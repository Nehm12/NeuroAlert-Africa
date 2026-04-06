"""
Pont vers le moteur IA NeuroAlert (`modelIA/`) — une seule source de vérité.
Le package `modelIA` est à la racine du dépôt (dossier parent de `backend/`).
"""

from __future__ import annotations

import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]  # NeuroAlert-Africa/
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from modelIA.main import (  # noqa: E402
    FASTInput,
    NeuroAlertModel,
    alert_decision_for_fast_count,
    first_aid_text,
)


class NeuroAlertAgents:
    """Compatibilité avec l’ancienne API backend ; délègue à `NeuroAlertModel`."""

    def __init__(self) -> None:
        self._model = NeuroAlertModel()

    async def analyse_fast_symptoms(
        self,
        face: bool,
        arm: bool,
        speech: bool,
        language_code: str = "fr",
    ) -> dict:
        inp = FASTInput(
            face_droop=face,
            arm_weakness=arm,
            speech_difficulty=speech,
            language_code=language_code,
        )
        result = await self._model.analyze(inp)
        return result.model_dump()

    def decide_alert(self, analysis: dict) -> str:
        """Retourne low_risk | alert_level1 | alert_level2 (champ ai_decision)."""
        return alert_decision_for_fast_count(int(analysis.get("fast_positive_count", 0)))

    def get_first_aid_instructions(self, language_code: str = "fr") -> str:
        return first_aid_text(language_code)


agents = NeuroAlertAgents()
