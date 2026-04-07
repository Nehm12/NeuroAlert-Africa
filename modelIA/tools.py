"""
NeuroAlert Africa — Outils Gemini pour l'agent FAST conversationnel.

extract_signs_from_text      : détecte les signes FAST dans un texte libre d'un témoin.
generate_contextual_question : génère la prochaine question O/N, adaptée au contexte.
get_fallback_question        : question fixe (sans Gemini) pour les cas de fallback.
"""

from __future__ import annotations

import json
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Questions de repli (quand Gemini est indisponible)
# ---------------------------------------------------------------------------

_FALLBACK_QUESTIONS: dict[str, dict[str, str]] = {
    "face": {
        "fr": "Son sourire est-il de travers ou une partie de son visage semble-t-elle dropper ?",
        "en": "Is their smile uneven or does one side of their face seem to droop?",
        "ha": "Fuska tana kama da lanƙwasa ko ɓangaren fuska ya fado?",
        "yo": "Ṣé ìrìn ẹ̀rín rẹ̀ yà papọ̀ tàbí ọ̀nà kan ti ojú rẹ̀ wó lulẹ̀?",
        "ig": "Ọ bụ nje uche ya na-adọrọ ma ọ bụ akụkụ ihu ya na-ada?",
    },
    "arm": {
        "fr": "Peut-il/elle lever les deux bras à la même hauteur sans que l'un dérive vers le bas ?",
        "en": "Can they raise both arms to the same height without one drifting down?",
        "ha": "Shin zai/zata iya ɗaga hannuwansa/hannuwanta biyu a tsayin ɗaya ba tare da guda ɗaya ya fado ba?",
        "yo": "Ṣé ó lè gbé ọwọ́ rẹ̀ méjèjì sí ìgbà kan náà láìsí ọ̀kan tí ó ṣubú?",
        "ig": "Ọ nwere ike isi aka ya abụọ elu n'otu ọkwa na-enweghị otu na-ada?",
    },
    "speech": {
        "fr": "Sa parole est-elle normale, claire et compréhensible ?",
        "en": "Is their speech normal, clear, and easy to understand?",
        "ha": "Shin yana/tana magana yadda ya kamata, a sarari kuma ana fahimtarsa?",
        "yo": "Ṣé ọ ń sọ̀rọ̀ dáradára, tí a sì lè gbọ́ ohun tó sọ?",
        "ig": "Okwu ya bụ nke ọma, doro anya, ma a na-aghọta ya?",
    },
    "time": {
        "fr": "Savez-vous exactement à quelle heure ces symptômes ont commencé ?",
        "en": "Do you know exactly what time these symptoms started?",
        "ha": "Shin kun san daidai lokacin da waɗannan alamomin suka fara?",
        "yo": "Ṣé ẹ mọ ìgbà tí àwọn àmì yìí bẹ̀rẹ̀?",
        "ig": "Ị mara oge mgbe ihe ndị a malitere?",
    },
}


def get_fallback_question(sign: str, language_code: str = "fr") -> str:
    """Retourne une question fixe pour le signe donné."""
    lang = (language_code or "fr").strip().lower()[:2]
    bank = _FALLBACK_QUESTIONS.get(sign, {})
    return bank.get(lang) or bank.get("fr") or f"Observez-vous un problème de type '{sign}' ?"


# ---------------------------------------------------------------------------
# Extraction de signes FAST depuis un texte libre
# ---------------------------------------------------------------------------

def extract_signs_from_text(
    user_text: str,
    current_state: dict[str, Optional[bool]],
    api_key: str,
    model_name: str = "gemini-1.5-flash",
    language_code: str = "fr",
) -> dict[str, Optional[bool]]:
    """
    Demande à Gemini d'extraire les signes FAST depuis une description libre du témoin.

    Retourne un dict {face, arm, speech} :
      True  → signe clairement décrit comme PRÉSENT
      False → signe clairement décrit comme ABSENT
      None  → pas assez d'information dans ce texte pour ce signe

    Seuls les signes encore inconnus (None dans current_state) sont évalués.
    """
    try:
        import google.generativeai as genai
        from google.generativeai.types import GenerationConfig
    except ImportError:
        logger.warning("google-generativeai non disponible — extraction impossible.")
        return {"face": None, "arm": None, "speech": None}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)

    already_known = {
        k: v for k, v in current_state.items()
        if v is not None and k in ("face", "arm", "speech")
    }

    prompt = f"""Tu es un assistant médical de triage AVC pour NeuroAlert Africa.
Ta tâche : analyser le texte libre d'un témoin et détecter les signes FAST présents.

SIGNES FAST À ÉVALUER :
- face    : asymétrie du visage, sourire de travers, coin de bouche qui tombe, bave d'un côté
- arm     : bras qui pend/dérive/impossible à lever, faiblesse d'un membre supérieur
- speech  : parole confuse, incompréhensible, absente, bégaiement soudain, mots mélangés

SIGNES DÉJÀ CONNUS (ne pas ré-évaluer) : {json.dumps(already_known)}

TEXTE DU TÉMOIN : "{user_text}"
LANGUE DU TÉMOIN : {language_code}

RÈGLES STRICTES :
- "true"  uniquement si le signe est CLAIREMENT décrit comme présent
- "false" uniquement si le signe est CLAIREMENT décrit comme absent
- null    si le texte ne donne pas assez d'info sur ce signe précis
- Ne jamais inférer — reste strictement factuel par rapport au texte fourni
- Ne ré-évalue pas les signes déjà connus

Réponds UNIQUEMENT en JSON valide, sans markdown, sans explication :
{{"face": true|false|null, "arm": true|false|null, "speech": true|false|null}}"""

    try:
        config = GenerationConfig(temperature=0.0, response_mime_type="application/json")
        resp = model.generate_content(prompt, generation_config=config)
        data = json.loads(resp.text or "{}")
        result: dict[str, Optional[bool]] = {}
        for sign in ("face", "arm", "speech"):
            val = data.get(sign)
            result[sign] = None if val is None else bool(val)
        return result
    except Exception as exc:
        logger.warning("Gemini : extraction signs échouée — %s", exc)
        return {"face": None, "arm": None, "speech": None}


# ---------------------------------------------------------------------------
# Génération de question contextuelle O/N
# ---------------------------------------------------------------------------

_SIGN_DESCRIPTIONS = {
    "face":   "asymétrie du visage (sourire de travers, partie du visage qui tombe)",
    "arm":    "faiblesse d'un bras (impossible à lever ou qui dérive vers le bas)",
    "speech": "trouble de la parole (incompréhensible, confuse, ralentie ou absente)",
    "time":   "heure de début des symptômes (connue précisément ou non)",
}


def generate_contextual_question(
    sign_to_ask: str,
    known_state: dict[str, Optional[bool]],
    history: list[dict],
    api_key: str,
    model_name: str = "gemini-1.5-flash",
    language_code: str = "fr",
) -> str:
    """
    Génère une question O/N contextuellement adaptée pour le prochain signe FAST manquant.

    Prend en compte :
    - Les signes déjà connus (pour adapter le ton : urgence si signe positif confirmé)
    - L'historique des échanges (pour ne pas être répétitif)
    - La langue cible

    Retourne le texte de la question seul, sans les options (1/2/3).
    Longueur cible : ≤ 120 caractères (contrainte USSD).
    """
    try:
        import google.generativeai as genai
        from google.generativeai.types import GenerationConfig
    except ImportError:
        return get_fallback_question(sign_to_ask, language_code)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)

    known_str = ", ".join(
        f"{k}={'OUI ⚠️' if v else 'NON'}"
        for k, v in known_state.items()
        if v is not None and k in ("face", "arm", "speech")
    ) or "aucun signe évalué"

    positive_count = sum(1 for v in known_state.values() if v is True)
    urgency_hint = (
        "⚠️ Au moins un signe positif détecté — ton URGENT approprié."
        if positive_count > 0
        else "Aucun signe positif pour l'instant — ton calme et rassurant."
    )

    history_str = "\n".join(
        f"  - {h.get('sign','?')} : {h.get('answer','?')}"
        for h in history[-4:]
        if h.get("answer") not in ("DESCRIPTION_LIBRE",)
    ) or "  premier échange"

    prompt = f"""Tu assistes un témoin africain pour évaluer une suspicion d'AVC (NeuroAlert Africa).
Tu dois poser UNE question simple pour évaluer le signe FAST suivant.

SIGNE À ÉVALUER : {_SIGN_DESCRIPTIONS.get(sign_to_ask, sign_to_ask)}
SIGNES DÉJÀ CONNUS : {known_str}
CONTEXTE D'URGENCE : {urgency_hint}
HISTORIQUE RÉCENT :
{history_str}
LANGUE CIBLE : {language_code}

CONTRAINTES :
- Question courte : maximum 120 caractères
- Formulée pour obtenir OUI ou NON
- Langage simple, adapté à un contexte communautaire africain
- Pas de jargon médical complexe
- Adapte la formulation au contexte (urgence si signe positif déjà présent)
- La question DOIT être complète et se terminer par « ? »
- Réponds avec la question uniquement"""

    try:
        config = GenerationConfig(temperature=0.3, max_output_tokens=200)
        resp = model.generate_content(prompt, generation_config=config)
        question = (resp.text or "").strip()
        # Garde la question uniquement si elle est complète (se termine par "?")
        # et a une longueur minimale sensée. Sinon, fallback statique.
        if question and len(question) >= 15 and question.endswith("?"):
            return question
        logger.warning("Gemini : question incomplète ou tronquée ('%s') — fallback utilisé.", question[:40])
    except Exception as exc:
        logger.warning("Gemini : génération question échouée — %s", exc)

    return get_fallback_question(sign_to_ask, language_code)
