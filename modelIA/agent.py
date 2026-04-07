"""
NeuroAlert Africa — Agent conversationnel FAST (Hybride O/N + texte libre).

Logique du flow par tour USSD :

  Tour N   : L'agent génère une question contextuelle sur le prochain signe inconnu.
             L'écran USSD affiche :
               [Question adaptée par Gemini]
               1. Oui
               2. Non
               3. Décrire ce que j'observe

  Tour N+1 : L'utilisateur répond :
               "1" → signe courant = positif (True)
               "2" → signe courant = négatif (False)
               "3" → prochain tour = saisie de texte libre

  Texte libre : Gemini extrait les signes FAST détectables.
                Un seul texte peut couvrir plusieurs signes à la fois.
                Les signes non déterminables restent None → question explicite suivante.

  Terminaison : Quand face + arm + speech sont tous connus →
                  question sur le temps (T) → scoring pondéré → END USSD.

  Fallback    : Si Gemini est indisponible, les questions fixe (tools.py) prennent le relais.
                Le test FAST complet reste garanti.

Compatible Africa's Talking USSD (réponses CON / END).
État de session en mémoire pour le MVP — à migrer vers Supabase en production.
"""

from __future__ import annotations

import logging
import os
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()
logger = logging.getLogger(__name__)

# Ordre d'évaluation des signes (cliniquement, la parole peut être priorisée
# mais on commence par le visage qui est le plus visible pour un témoin)
_SIGN_ORDER = ("face", "arm", "speech")


# ---------------------------------------------------------------------------
# État de session
# ---------------------------------------------------------------------------

class FASTSessionState(BaseModel):
    """État mutable d'une session FAST en cours (une entrée par sessionId USSD)."""

    # Signes FAST — None = non encore évalué
    face:       Optional[bool] = None
    arm:        Optional[bool] = None
    speech:     Optional[bool] = None
    time_known: Optional[bool] = None

    # Signe actuellement questionné (face | arm | speech | time)
    current_sign: Optional[str] = None

    # True si le prochain tour attend une description libre de l'utilisateur
    awaiting_description: bool = False

    # Historique des échanges (pour le contexte Gemini)
    history: list[dict] = Field(default_factory=list)

    # Résultat final une fois le test terminé
    complete: bool = False
    result:   Optional[dict] = None


# ---------------------------------------------------------------------------
# Helpers internes
# ---------------------------------------------------------------------------

def _next_unknown_sign(state: FASTSessionState) -> Optional[str]:
    """Premier signe parmi (face, arm, speech) encore inconnu, ou None."""
    for sign in _SIGN_ORDER:
        if getattr(state, sign) is None:
            return sign
    return None


def _fast_complete(state: FASTSessionState) -> bool:
    return (
        state.face  is not None
        and state.arm   is not None
        and state.speech is not None
    )


# ---------------------------------------------------------------------------
# Agent principal
# ---------------------------------------------------------------------------

class FASTConversationalAgent:
    """
    Agent conversationnel FAST pour sessions USSD NeuroAlert Africa.

    Usage (depuis le handler USSD FastAPI) :
        agent = FASTConversationalAgent()
        ussd_text = await agent.turn(session_id, user_input, language_code="fr")
        # ussd_text commence par "CON " (continuer) ou "END " (terminer)
    """

    def __init__(
        self,
        gemini_api_key: Optional[str] = None,
        gemini_model:   Optional[str] = None,
    ) -> None:
        self._api_key = (gemini_api_key or os.getenv("GEMINI_API_KEY") or "").strip() or None
        self._model   = (gemini_model   or os.getenv("GEMINI_MODEL")   or "gemini-1.5-flash").strip()
        self._sessions: dict[str, FASTSessionState] = {}

    # ------------------------------------------------------------------
    # Point d'entrée USSD
    # ------------------------------------------------------------------

    async def turn(
        self, session_id: str, user_input: str, language_code: str = "fr"
    ) -> str:
        """
        Traite un tour USSD et retourne la réponse CON/END à Africa's Talking.

        Paramètres :
          session_id    : identifiant de session Africa's Talking
          user_input    : saisie de l'utilisateur ("" au premier tour,
                          "1"/"2"/"3" pour O/N/Décrire, texte libre sinon)
          language_code : code langue ISO (fr, en, ha, yo, ig)
        """
        state = self._sessions.setdefault(session_id, FASTSessionState())
        user_input = (user_input or "").strip()

        # 1. Traiter la saisie utilisateur
        await self._process_input(state, user_input, language_code)

        # 2. Test terminé → retourner résultat final
        if state.complete:
            self._sessions.pop(session_id, None)
            return self._format_result(state, language_code)

        # 3. Continuer → générer prochaine question
        return await self._build_next_turn(state, language_code)

    def reset(self, session_id: str) -> None:
        """Supprime la session (timeout, abandon)."""
        self._sessions.pop(session_id, None)

    # ------------------------------------------------------------------
    # Traitement de la saisie
    # ------------------------------------------------------------------

    async def _process_input(
        self, state: FASTSessionState, user_input: str, lang: str
    ) -> None:
        """Met à jour l'état de session selon la saisie de l'utilisateur."""

        # Premier tour — aucune saisie à traiter
        if not user_input:
            return

        # Mode description libre : l'entrée est du texte à analyser
        if state.awaiting_description:
            state.awaiting_description = False
            await self._extract_from_text(state, user_input, lang)
            return

        current = state.current_sign

        if user_input == "1":       # Oui
            self._record_answer(state, current, True)

        elif user_input == "2":     # Non
            self._record_answer(state, current, False)

        elif user_input == "3":     # Décrire (uniquement pour les signes FAST, pas pour T)
            if current != "time":
                state.awaiting_description = True
                state.history.append({
                    "sign":   current,
                    "answer": "DESCRIPTION_LIBRE",
                })
        # Saisie non reconnue → on re-posera la même question

        # Déclencher la finalisation si F+A+S+T sont tous connus
        if _fast_complete(state) and state.time_known is not None:
            await self._finalize(state)

    def _record_answer(
        self, state: FASTSessionState, sign: Optional[str], value: bool
    ) -> None:
        """Enregistre la réponse O/N pour le signe courant."""
        if not sign:
            return
        if sign in ("face", "arm", "speech"):
            setattr(state, sign, value)
        elif sign == "time":
            state.time_known = value
        state.history.append({
            "sign":   sign,
            "answer": "OUI" if value else "NON",
        })

    # ------------------------------------------------------------------
    # Extraction NLP depuis le texte libre
    # ------------------------------------------------------------------

    async def _extract_from_text(
        self, state: FASTSessionState, text: str, lang: str
    ) -> None:
        """
        Appelle Gemini pour extraire les signes FAST depuis le texte libre.
        Un seul message peut couvrir plusieurs signes à la fois.
        Les signes non déterminables restent None → question explicite suivante.
        """
        from modelIA.tools import extract_signs_from_text

        current_known = {k: getattr(state, k) for k in ("face", "arm", "speech")}

        if self._api_key:
            extracted = extract_signs_from_text(
                text, current_known, self._api_key, self._model, lang
            )
        else:
            logger.warning("Pas de clé Gemini — extraction texte libre impossible, questions O/N utilisées.")
            extracted = {"face": None, "arm": None, "speech": None}

        # Mettre à jour uniquement les signes encore inconnus
        for sign in ("face", "arm", "speech"):
            val = extracted.get(sign)
            if val is not None and getattr(state, sign) is None:
                setattr(state, sign, val)

        state.history.append({
            "sign":      "(texte libre)",
            "answer":    text[:80],
            "extracted": {k: v for k, v in extracted.items() if v is not None},
        })

        # Finalisation si tout est connu après extraction
        if _fast_complete(state) and state.time_known is not None:
            await self._finalize(state)

    # ------------------------------------------------------------------
    # Finalisation : scoring pondéré
    # ------------------------------------------------------------------

    async def _finalize(self, state: FASTSessionState) -> None:
        """Lance le moteur de scoring pondéré et stocke le résultat."""
        from modelIA.main import FASTInput, NeuroAlertModel

        inp = FASTInput(
            face_droop        = bool(state.face),
            arm_weakness      = bool(state.arm),
            speech_difficulty = bool(state.speech),
            time_symptoms_known = state.time_known,
        )
        model = NeuroAlertModel(
            gemini_api_key=self._api_key,
            gemini_model=self._model,
        )
        result = await model.analyze(inp)
        state.result   = result.model_dump()
        state.complete = True

    # ------------------------------------------------------------------
    # Construction du prochain tour USSD
    # ------------------------------------------------------------------

    async def _build_next_turn(
        self, state: FASTSessionState, lang: str
    ) -> str:
        """Retourne le texte CON à envoyer à l'utilisateur."""

        # L'utilisateur vient de choisir "Décrire" → attendre son texte
        if state.awaiting_description:
            return self._prompt_for_description(lang)

        # Déterminer le prochain signe à évaluer
        if not _fast_complete(state):
            next_sign = _next_unknown_sign(state)
        elif state.time_known is None:
            next_sign = "time"
        else:
            # Sécurité : ne devrait pas arriver (finalisation déjà déclenchée)
            await self._finalize(state)
            return self._format_result(state, lang)

        state.current_sign = next_sign

        # Générer la question contextuelle (ou fallback)
        question = await self._get_question(state, next_sign, lang)

        if next_sign == "time":
            return (
                f"CON {question}\n"
                "1. Oui, je connais l'heure\n"
                "2. Non, je ne sais pas"
            )

        return (
            f"CON {question}\n"
            "1. Oui\n"
            "2. Non\n"
            "3. Decrire ce que j'observe"
        )

    async def _get_question(
        self, state: FASTSessionState, sign: str, lang: str
    ) -> str:
        """Retourne une question contextuelle via Gemini, ou une question fixe en fallback."""
        from modelIA.tools import generate_contextual_question, get_fallback_question

        if not self._api_key:
            return get_fallback_question(sign, lang)

        known = {k: getattr(state, k) for k in ("face", "arm", "speech")}
        return generate_contextual_question(
            sign_to_ask   = sign,
            known_state   = known,
            history       = state.history,
            api_key       = self._api_key,
            model_name    = self._model,
            language_code = lang,
        )

    # ------------------------------------------------------------------
    # Formatage des messages USSD
    # ------------------------------------------------------------------

    @staticmethod
    def _prompt_for_description(lang: str) -> str:
        msgs = {
            "fr": "CON Décrivez en quelques mots ce que vous observez chez cette personne :",
            "en": "CON Briefly describe what you observe in this person:",
            "ha": "CON Bayyana a taƙaice abin da kuke gani a wannan mutum:",
            "yo": "CON Ṣapejuwe ní ọ̀rọ̀ díẹ̀ ohun tó ń ṣẹlẹ̀ fún ẹni náà:",
            "ig": "CON Kọọ n'okwu ole ihe ị hụ n'onye ahụ:",
        }
        lc = (lang or "fr")[:2].lower()
        return msgs.get(lc, msgs["fr"])

    @staticmethod
    def _format_result(state: FASTSessionState, lang: str) -> str:
        """Formate le message END USSD avec le résultat du test."""
        if not state.result:
            return "END Erreur interne. Appelez les secours si vous avez le moindre doute."

        r          = state.result
        score      = r.get("fast_positive_count", 0)
        risk       = r.get("risk_score", 0.0)
        urgency    = r.get("urgency_level", "high").upper()
        rec        = r.get("recommendation", "Appelez les secours.")

        # Tronquer pour la limite USSD (~182 chars par écran)
        rec_short = (rec[:140] + "...") if len(rec) > 140 else rec

        return f"END FAST {score}/3 | Risque {risk:.0%} | {urgency}\n{rec_short}"


# ---------------------------------------------------------------------------
# Singleton — à importer depuis le backend FastAPI / handler USSD
# ---------------------------------------------------------------------------
fast_agent = FASTConversationalAgent()
