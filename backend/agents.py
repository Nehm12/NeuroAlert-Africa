"""
Pont vers le moteur IA NeuroAlert (`modelIA/`) — une seule source de vérité.
Le package `modelIA` est à la racine du dépôt (dossier parent de `backend/`).
"""

from __future__ import annotations

import sys
from pathlib import Path

# _CURRENT pointe vers le dossier contenant agents.py (backend/)
# modelIA/ est un sous-dossier de backend/ pour le déploiement Vercel
_CURRENT = Path(__file__).resolve().parent  # backend/
_ROOT = _CURRENT.parent  # repo root (fonctionne en local)

# Ajoute les deux pour couvrir local ET Vercel
for _p in [str(_ROOT), str(_CURRENT)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

import africastalking
from backend.config import settings
from modelIA.main import (  # noqa: E402
    FASTInput,
    NeuroAlertModel,
    alert_decision_for_fast_count,
    first_aid_text,
)

# Initialize Africa's Talking
if settings.AT_API_KEY:
    try:
        africastalking.initialize(settings.AT_USERNAME, settings.AT_API_KEY)
        at_sms = africastalking.SMS
    except Exception as e:
        print(f"AT Init Error: {e}")
        at_sms = None
else:
    at_sms = None


class NeuroAlertAgents:
    """Compatibilité avec l’ancienne API backend ; délègue à `NeuroAlertModel`."""

    def __init__(self) -> None:
        self._model = NeuroAlertModel()

    async def analyse_fast_symptoms(
        self,
        face: bool,
        arm: bool,
        speech: bool,
        balance: bool = False,
        eyes: bool = False,
        time_known: bool = False,
        language_code: str = "fr",
    ) -> dict:
        inp = FASTInput(
            balance_loss=balance,
            vision_problem=eyes,
            face_droop=face,
            arm_weakness=arm,
            speech_difficulty=speech,
            time_symptoms_known=time_known,
            language_code=language_code,
        )
        result = await self._model.analyze(inp)
        return result.model_dump()

    def decide_alert(self, analysis: dict) -> str:
        """Retourne low_risk | alert_level1 | alert_level2 (champ ai_decision)."""
        return alert_decision_for_fast_count(int(analysis.get("fast_positive_count", 0)))

    def get_first_aid_instructions(self, language_code: str = "fr") -> str:
        return first_aid_text(language_code)

    async def send_emergency_sms(self, to: list[str], message: str):
        """Envoie un SMS d'urgence via Africa's Talking."""
        if not at_sms:
            print(f"MOCK SMS to {to}: {message}")
            return {"status": "mocked"}
        
        try:
            response = at_sms.send(message, to)
            return response
        except Exception as e:
            print(f"AT SMS Error: {e}")
            return {"status": "error", "message": str(e)}


agents = NeuroAlertAgents()
