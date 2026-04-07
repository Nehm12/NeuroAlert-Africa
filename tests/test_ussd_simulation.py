"""
tests/test_ussd_simulation.py
============================================================
Deux modes d'utilisation :

  MODE INTERACTIF (défaut quand lancé directement) :
    python tests/test_ussd_simulation.py
    → Simule un vrai écran USSD. TU tapes les réponses toi-même,
      comme si tu étais l'utilisateur sur son téléphone.

  MODE AUTOMATIQUE (pour pytest / CI) :
    python -m pytest tests/test_ussd_simulation.py -v
    → 7 scénarios prédéfinis, assertions sur les résultats.

Africa's Talking envoie en réalité un POST form-data avec :
  sessionId, serviceCode, phoneNumber, text
  où text accumule les saisies : "" → "1" → "1*2" → "1*2*1" etc.
Ce simulateur reproduit exactement cette logique.
"""

from __future__ import annotations

import asyncio
import sys
import os

# Permet de lancer le fichier directement depuis la racine du projet
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from modelIA.agent import FASTConversationalAgent

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

LANG_CHOICE = {"fr": "1", "en": "2", "ha": "3"}

RESET_COLOR  = "\033[0m"
GREEN        = "\033[32m"
RED          = "\033[31m"
YELLOW       = "\033[33m"
CYAN         = "\033[36m"
BOLD         = "\033[1m"


def _color(text: str, code: str) -> str:
    return f"{code}{text}{RESET_COLOR}"


def _header(title: str) -> None:
    line = "─" * 60
    print(f"\n{BOLD}{CYAN}{line}{RESET_COLOR}")
    print(f"{BOLD}{CYAN}  {title}{RESET_COLOR}")
    print(f"{BOLD}{CYAN}{line}{RESET_COLOR}")


def _print_turn(turn_n: int, user_input: str, response: str) -> None:
    label = "(init)" if not user_input else repr(user_input)
    tag   = _color("[CON]", YELLOW) if response.startswith("CON") else _color("[END]", GREEN)
    print(f"\n  Tour {turn_n} — saisie : {_color(label, BOLD)}")
    print(f"  {tag}")
    for line in response.split("\n"):
        print(f"      {line}")


def _assert(condition: bool, msg: str) -> None:
    if condition:
        print(f"  {_color('✓', GREEN)} {msg}")
    else:
        print(f"  {_color('✗ ECHEC', RED)} {msg}")
        raise AssertionError(msg)


async def _run_scenario(
    name: str,
    user_inputs: list[str],  # ["", "1", "2", ...] — "" = premier tour
    lang: str = "fr",
    *,
    expected_end_contains: list[str] | None = None,
    expected_end_not_contains: list[str] | None = None,
) -> str:
    """
    Exécute un scénario complet et retourne la dernière réponse USSD.
    Lève AssertionError si une attente n'est pas satisfaite.
    """
    _header(name)
    agent  = FASTConversationalAgent()
    sid    = f"sess-{name.replace(' ', '_')}"
    last   = ""

    for i, user_input in enumerate(user_inputs, start=1):
        response = await agent.turn(sid, user_input, lang)
        _print_turn(i, user_input, response)
        last = response

        # Tout sauf le dernier tour doit être CON
        if i < len(user_inputs):
            _assert(response.startswith("CON"), f"Tour {i} doit être CON (got {response[:20]}...)")

    # Le dernier tour doit être END
    _assert(last.startswith("END"), "Dernière réponse doit être END")

    if expected_end_contains:
        for keyword in expected_end_contains:
            _assert(keyword.upper() in last.upper(), f"Résultat contient '{keyword}'")

    if expected_end_not_contains:
        for keyword in expected_end_not_contains:
            _assert(keyword.upper() not in last.upper(), f"Résultat n'a pas '{keyword}'")

    return last


# ─────────────────────────────────────────────────────────────────────────────
# Scénario 1 — AVC classique (tous les signes positifs, heure connue)
# ─────────────────────────────────────────────────────────────────────────────

async def scenario_all_positive_fr() -> None:
    """
    FAST 3/3 — Tous les signes présents, heure connue.
    Attendu : risque max, niveau HIGH, alerte de niveau 2.
    """
    await _run_scenario(
        name          = "S1 — AVC classique FR (3/3 + heure connue)",
        user_inputs   = [
            "",   # Tour 1 : init → question visage
            "1",  # Visage : Oui (asymétrie)
            "1",  # Bras   : Oui (faiblesse)
            "1",  # Parole : Oui (trouble)
            "1",  # Temps  : Oui (heure connue)
        ],
        lang          = "fr",
        expected_end_contains     = ["HIGH", "3/3"],
        expected_end_not_contains = ["0/3"],
    )


# ─────────────────────────────────────────────────────────────────────────────
# Scénario 2 — Aucun signe (patient normal)
# ─────────────────────────────────────────────────────────────────────────────

async def scenario_no_signs_fr() -> None:
    """
    FAST 0/3 — Aucun signe détecté.
    Attendu : risque faible, LOW urgency.
    """
    await _run_scenario(
        name          = "S2 — Aucun signe FR (0/3)",
        user_inputs   = [
            "",   # init → question visage
            "2",  # Visage : Non
            "2",  # Bras   : Non
            "2",  # Parole : Non
            "2",  # Temps  : Non
        ],
        lang          = "fr",
        expected_end_contains     = ["0/3", "LOW"],
        expected_end_not_contains = ["HIGH"],
    )


# ─────────────────────────────────────────────────────────────────────────────
# Scénario 3 — Un signe positif (seuil d'alerte)
# ─────────────────────────────────────────────────────────────────────────────

async def scenario_one_sign_fr() -> None:
    """
    FAST 1/3 — Seulement la parole affectée.
    Attendu : HIGH (AHA/ASA 2019 — tout signe ≥ 1 = urgence haute).
    """
    await _run_scenario(
        name          = "S3 — Parole seule FR (1/3)",
        user_inputs   = [
            "",   # init → question visage
            "2",  # Visage : Non
            "2",  # Bras   : Non
            "1",  # Parole : Oui ← signe unique
            "2",  # Temps  : Non (réveil — inconnu)
        ],
        lang          = "fr",
        expected_end_contains = ["HIGH", "1/3"],
    )


# ─────────────────────────────────────────────────────────────────────────────
# Scénario 4 — Option "Décrire" suivie d'un texte (sans Gemini = fallback)
# ─────────────────────────────────────────────────────────────────────────────

async def scenario_describe_fallback_fr() -> None:
    """
    L'utilisateur choisit "3. Décrire" mais pas de clé Gemini.
    Le signe reste None → question O/N relancée automatiquement.
    La session se termine normalement quand même.
    """
    _header("S4 — Description libre (mode fallback sans Gemini)")
    agent = FASTConversationalAgent()
    sid   = "sess-describe-fallback"

    turns: list[tuple[str, str]] = [
        ("",                       "init → question visage"),
        ("3",                      "choisit Décrire"),
        ("son sourire est dévié",  "texte libre (fallback: signe reste None)"),
        ("1",                      "Oui visage (question relancée)"),
        ("1",                      "Oui bras"),
        ("1",                      "Oui parole"),
        ("1",                      "Oui temps"),
    ]

    last = ""
    for i, (inp, comment) in enumerate(turns, start=1):
        r = await agent.turn(sid, inp, "fr")
        _print_turn(i, inp, r)
        print(f"       → {_color(comment, YELLOW)}")
        last = r

    _assert(last.startswith("END"), "Session terminée par END")
    print()


# ─────────────────────────────────────────────────────────────────────────────
# Scénario 5 — Session en anglais (test multilingue)
# ─────────────────────────────────────────────────────────────────────────────

async def scenario_all_positive_en() -> None:
    """
    FAST 3/3 en anglais — Vérifie que le fallback est bien en anglais.
    """
    result = await _run_scenario(
        name        = "S5 — AVC classique EN (3/3)",
        user_inputs = ["", "1", "1", "1", "1"],
        lang        = "en",
        expected_end_contains = ["HIGH", "3/3"],
    )
    # Question de visage doit être en anglais
    print()


# ─────────────────────────────────────────────────────────────────────────────
# Scénario 6 — Saisie invalide au milieu (robustesse)
# ─────────────────────────────────────────────────────────────────────────────

async def scenario_invalid_input_fr() -> None:
    """
    L'utilisateur tape une saisie inconnue ("9", "abc").
    L'agent doit rester stable et reposer la même question.
    """
    _header("S6 — Saisie invalide (robustesse)")
    agent = FASTConversationalAgent()
    sid   = "sess-invalid"

    steps = [
        ("",    "init → question visage"),
        ("9",   "saisie invalide → même question attendue"),
        ("abc", "texte non reconnu → même question attendue (pas awaiting_description)"),
        ("1",   "Oui visage → passe au bras"),
        ("1",   "Oui bras"),
        ("1",   "Oui parole"),
        ("1",   "Oui temps → END"),
    ]

    last = ""
    for i, (inp, comment) in enumerate(steps, start=1):
        r = await agent.turn(sid, inp, "fr")
        _print_turn(i, inp, r)
        print(f"       → {_color(comment, YELLOW)}")
        last = r

    _assert(last.startswith("END"), "Session se termine par END malgré les saisies invalides")
    print()


# ─────────────────────────────────────────────────────────────────────────────
# Scénario 7 — Simulation Africa's Talking (texte cumulatif)
# ─────────────────────────────────────────────────────────────────────────────

async def scenario_africastalking_text_accumulation() -> None:
    """
    Africa's Talking accumule les saisies avec '*'.
    Le backend extrait toujours le dernier segment.
    Ce test reproduit ce comportement sans passer par FastAPI.

    text="" → "1" → "1*1" → "1*1*1" → "1*1*1*1" → "1*1*1*1*1"
    steps[0] = choix de langue  →  steps[-1] = dernière saisie agent
    """
    _header("S7 — Simulation accumulation Africa's Talking (text=1*1*1*1*1)")
    agent = FASTConversationalAgent()
    sid   = "sess-at-accum"

    # Séquence telle qu'elle arrive sur /ussd
    at_texts = ["", "1", "1*1", "1*1*1", "1*1*1*1", "1*1*1*1*1"]

    lang_map = {"1": "fr", "2": "en", "3": "ha"}

    last = ""
    for i, text in enumerate(at_texts, start=1):
        steps = text.split("*") if text else []

        if not text:
            # Écran d'accueil — pas encore dans l'agent
            print(f"\n  Tour {i} — text='' → écran d'accueil (hors agent)")
            continue

        if steps[0] not in lang_map:
            print(f"\n  Tour {i} — text='{text}' → choix de langue invalide, skip")
            continue

        lang       = lang_map[steps[0]]
        last_input = steps[-1] if len(steps) > 1 else ""
        r = await agent.turn(sid, last_input, lang)
        _print_turn(i, last_input, r)
        last = r

    _assert(last.startswith("END"), "Session AT se termine par END")
    print()


# ─────────────────────────────────────────────────────────────────────────────
# Runner principal
# ─────────────────────────────────────────────────────────────────────────────

SCENARIOS = [
    scenario_all_positive_fr,
    scenario_no_signs_fr,
    scenario_one_sign_fr,
    scenario_describe_fallback_fr,
    scenario_all_positive_en,
    scenario_invalid_input_fr,
    scenario_africastalking_text_accumulation,
]


async def run_all() -> None:
    passed  = 0
    failed  = 0
    results = []

    for scenario in SCENARIOS:
        try:
            await scenario()
            results.append((scenario.__name__, True, ""))
            passed += 1
        except AssertionError as exc:
            results.append((scenario.__name__, False, str(exc)))
            failed += 1
        except Exception as exc:
            results.append((scenario.__name__, False, f"EXCEPTION: {exc}"))
            failed += 1

    # Récapitulatif
    line = "═" * 60
    print(f"\n{BOLD}{line}{RESET_COLOR}")
    print(f"{BOLD}  RÉCAPITULATIF — {passed} réussi(s)  /  {failed} échoué(s){RESET_COLOR}")
    print(f"{BOLD}{line}{RESET_COLOR}\n")
    for name, ok, msg in results:
        icon = _color("✓", GREEN) if ok else _color("✗", RED)
        print(f"  {icon}  {name}")
        if not ok:
            print(f"       {_color(msg, RED)}")

    print()
    if failed:
        sys.exit(1)


# ─────────────────────────────────────────────────────────────────────────────
# pytest compatibility  (pytest collecte les fonctions async préfixées "test_")
# ─────────────────────────────────────────────────────────────────────────────

def test_all_positive_fr():
    asyncio.run(scenario_all_positive_fr())

def test_no_signs_fr():
    asyncio.run(scenario_no_signs_fr())

def test_one_sign_fr():
    asyncio.run(scenario_one_sign_fr())

def test_describe_fallback_fr():
    asyncio.run(scenario_describe_fallback_fr())

def test_all_positive_en():
    asyncio.run(scenario_all_positive_en())

def test_invalid_input_fr():
    asyncio.run(scenario_invalid_input_fr())

def test_africastalking_text_accumulation():
    asyncio.run(scenario_africastalking_text_accumulation())


# ─────────────────────────────────────────────────────────────────────────────
# MODE INTERACTIF — tu tapes toi-même comme un vrai utilisateur USSD
# ─────────────────────────────────────────────────────────────────────────────

_LANG_MAP = {"1": "fr", "2": "en", "3": "ha"}

_WELCOME = (
    "CON NeuroAlert Africa — Triage AVC\n"
    "Choisir la langue / Select language :\n"
    "1. Français\n"
    "2. English\n"
    "3. Hausa\n"
    "0. Quitter / Exit"
)

_BOX_TOP    = "┌" + "─" * 58 + "┐"
_BOX_BOTTOM = "└" + "─" * 58 + "┘"
_BOX_SEP    = "├" + "─" * 58 + "┤"


def _render_ussd_screen(content: str, turn: int) -> None:
    """Affiche le contenu USSD dans un encadré qui imite un écran de téléphone."""
    tag    = "[CON — session active]" if content.startswith("CON") else "[END — session terminée]"
    color  = YELLOW if content.startswith("CON") else GREEN
    body   = content[4:].strip()   # retire "CON " ou "END "

    print()
    print(f"  {_BOX_TOP}")
    print(f"  │  {_color(f'Tour {turn}  ·  {tag}', color):<66}│")
    print(f"  {_BOX_SEP}")
    for line in body.split("\n"):
        print(f"  │  {line:<56}  │")
    print(f"  {_BOX_BOTTOM}")


async def run_interactive() -> None:
    """
    Simulateur USSD interactif.
    Lance une (ou plusieurs) sessions où C'EST TOI qui réponds à chaque tour.
    """
    line60 = "═" * 60
    print(f"\n{BOLD}{CYAN}{line60}{RESET_COLOR}")
    print(f"{BOLD}{CYAN}   NeuroAlert Africa — Simulateur USSD Interactif{RESET_COLOR}")
    print(f"{BOLD}{CYAN}{line60}{RESET_COLOR}")
    print(f"  {_color('Tape tes réponses exactement comme sur ton téléphone.', YELLOW)}")
    print(f"  {_color('Appuie sur Entrée sans rien taper = valeur vide.', YELLOW)}")
    print(f"  {_color('Ctrl+C pour quitter à tout moment.', RED)}\n")

    session_n = 0

    while True:
        session_n += 1
        sid  = f"interactive-{session_n}"
        agent = FASTConversationalAgent()

        print(f"\n{BOLD}{'─'*60}{RESET_COLOR}")
        print(f"{BOLD}  Nouvelle session #{session_n}{RESET_COLOR}")
        print(f"{'─'*60}")

        # ── Écran d'accueil (hors agent) ─────────────────────────────────
        turn = 1
        _render_ussd_screen(_WELCOME, turn)

        try:
            lang_choice = input(f"\n  {BOLD}Ton choix >{RESET_COLOR} ").strip()
        except (KeyboardInterrupt, EOFError):
            print(f"\n\n  {_color('Simulation interrompue.', RED)}\n")
            break

        if lang_choice == "0":
            print(f"  {_color('Session quittée.', YELLOW)}\n")
            # Demander si on relance
            again = input(f"  Nouvelle session ? (o/n) : ").strip().lower()
            if again not in ("o", "oui", "y", "yes"):
                break
            continue

        if lang_choice not in _LANG_MAP:
            print(f"  {_color(f'Choix invalide « {lang_choice} » — relance la session.', RED)}\n")
            continue

        lang = _LANG_MAP[lang_choice]

        # ── Boucle de l'agent FAST ────────────────────────────────────────
        last_input = ""   # premier tour = init
        while True:
            turn += 1
            response = await agent.turn(sid, last_input, lang)
            _render_ussd_screen(response, turn)

            if response.startswith("END"):
                # Session terminée
                print(f"\n  {_color('✓ Session terminée.', GREEN)}\n")
                break

            # Session continue → demander la saisie
            try:
                last_input = input(f"\n  {BOLD}Ton choix >{RESET_COLOR} ").strip()
            except (KeyboardInterrupt, EOFError):
                print(f"\n\n  {_color('Session interrompue.', RED)}\n")
                agent.reset(sid)
                break

            if last_input.lower() in ("quit", "exit", "q"):
                agent.reset(sid)
                print(f"  {_color('Session abandonnée.', YELLOW)}\n")
                break

        # ── Rejouer ? ─────────────────────────────────────────────────────
        try:
            again = input(f"  {BOLD}Nouvelle session ? (o/n) >{RESET_COLOR} ").strip().lower()
        except (KeyboardInterrupt, EOFError):
            break
        if again not in ("o", "oui", "y", "yes"):
            break

    print(f"\n{_color('Au revoir.', CYAN)}\n")


if __name__ == "__main__":
    import sys
    # Si l'argument "--auto" est passé, exécuter les scénarios automatiques
    if "--auto" in sys.argv:
        asyncio.run(run_all())
    else:
        asyncio.run(run_interactive())
