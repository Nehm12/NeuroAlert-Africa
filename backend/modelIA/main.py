"""
NeuroAlert Africa — moteur IA FAST (AVC).

Couche 1 : règles cliniques (toujours disponible, déterministe).
Couche 2 : Gemini optionnel (GEMINI_API_KEY) pour affiner texte + cohérence du score.

À brancher côté USSD : appeler analyze() ou analyze_sync() avec les booléens FAST
extraits du menu, puis decide_alert() pour alert_level1 / alert_level2 / low_risk.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
from enum import Enum
from typing import Literal, Optional

from dotenv import load_dotenv
from pydantic import BaseModel, Field, field_validator

load_dotenv()

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Contrats (API stable pour FastAPI / USSD)
# ---------------------------------------------------------------------------


class FASTInput(BaseModel):
    """Réponses structurées du test B.E.F.A.S.T. (issues des choix USSD)."""

    # B: Balance
    balance_loss: bool = Field(description="Perte soudaine d'équilibre ou de coordination")
    # E: Eyes
    vision_problem: bool = Field(description="Troubles de la vision soudains (vue double, perte de vue)")
    # F: Face
    face_droop: bool = Field(description="Asymétrie du visage / sourire")
    # A: Arm
    arm_weakness: bool = Field(description="Faiblesse ou dérive d'un bras")
    # S: Speech
    speech_difficulty: bool = Field(description="Trouble de la parole ou incompréhension")
    # T: Time
    time_symptoms_known: Optional[bool] = Field(
        default=None,
        description="Heure de début des signes connue, si collecté",
    )
    language_code: str = Field(
        default="fr",
        description="ISO court pour textes générés / SMS",
    )

    @field_validator("language_code")
    @classmethod
    def _norm_lang(cls, v: str) -> str:
        return (v or "fr").strip().lower()[:5] or "fr"


class UrgencyLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


AlertDecision = Literal["low_risk", "alert_level1", "alert_level2"]


class StrokeAnalysisResult(BaseModel):
    """Sortie unique consommée par le backend (logs, SMS, dashboard)."""

    fast_positive_count: int = Field(ge=0, le=5)
    risk_score: float = Field(ge=0.0, le=1.0, description="Probabilité de suspicion synthétique 0–1")
    urgency_level: Literal["low", "medium", "high"]
    recommendation: str = Field(description="Court message actionnable (USSD END ou SMS)")
    rationale_short: str = Field(description="Une ligne pour audit / médecins")
    model_source: Literal["rules", "gemini", "rules+gemini"]
    raw_llm_json: Optional[dict] = None


# ---------------------------------------------------------------------------
# Règles FAST (fallback + socle médical du MVP)
# ---------------------------------------------------------------------------


def _compute_rule_metrics(inp: FASTInput) -> tuple[int, float, UrgencyLevel, str, str]:
    """
    Compte les signes BEFAST positifs et dérive l'urgence.
    Standard Médical : ANY sign (B,E,F,A,S) is a potential stroke.
    """
    signs = [
        inp.balance_loss,
        inp.vision_problem,
        inp.face_droop,
        inp.arm_weakness,
        inp.speech_difficulty
    ]
    n = sum(1 for s in signs if s)
    risk = n / 5.0
    lang = inp.language_code

    # Multi-lingual recommendations
    RECS = {
        "en": {
            "low": "You are okay! But you might just be stressed or need to drink water. Please go home and rest.",
            "med": "DANGER! You are showing signs of a stroke. Go to FMC Abeokuta or Babcock Teaching Hospital (Ogun State) immediately.",
            "high": "DANGER! You are showing signs of a stroke. Go to FMC Abeokuta or OOUTH Sagamu (Ogun State) immediately for treatment."
        },
        "fr": {
            "low": "Vous allez bien ! Mais il se peut que vous soyez simplement fatigué ou que vous ayez besoin d'eau. Reposez-vous.",
            "med": "DANGER ! Vous présentez des signes d'AVC. Allez immédiatement au FMC Abeokuta ou à l'Hôpital Babcock (Ogun State).",
            "high": "URGENCE VITALE ! Vous présentez des signes graves d'AVC. Allez immédiatement au FMC Abeokuta ou à l'OOUTH Sagamu (Ogun State)."
        }
    }
    
    # Fallback to English if lang not found
    m = RECS.get(lang, RECS["en"])
    
    if n == 0:
        urg = UrgencyLevel.low
        rec = m["low"]
    elif n == 1:
        urg = UrgencyLevel.medium
        rec = m["med"]
    else:
        urg = UrgencyLevel.high
        rec = m["high"]

    if inp.time_symptoms_known is False and n >= 1:
        time_msg = " Note the time it started." if lang == "en" else " Notez l'heure du début."
        rec += time_msg

    rationale = (
        f"BEFAST: {n}/5 positive (B={inp.balance_loss}, E={inp.vision_problem}, "
        f"F={inp.face_droop}, A={inp.arm_weakness}, S={inp.speech_difficulty})."
    )
    return n, risk, urg, rec.strip(), rationale


def _map_urgency_to_alert(fast_count: int) -> AlertDecision:
    if fast_count == 0:
        return "low_risk"
    if fast_count == 1:
        return "alert_level1"
    return "alert_level2"


def alert_decision_for_fast_count(fast_count: int) -> AlertDecision:
    """Expose public pour le backend sans reconstruire StrokeAnalysisResult."""
    return _map_urgency_to_alert(max(0, min(3, int(fast_count))))


# ---------------------------------------------------------------------------
# Gemini (optionnel)
# ---------------------------------------------------------------------------


def _gemini_json_refinement(
    inp: FASTInput,
    base: StrokeAnalysisResult,
    api_key: str,
    model_name: str,
) -> StrokeAnalysisResult:
    """Affine recommendation + rationale ; conserve le compte FAST et le score de base si parsing échoue."""
    try:
        import google.generativeai as genai
        from google.generativeai.types import GenerationConfig
    except ImportError:
        logger.warning("google-generativeai non installé ; couche Gemini ignorée.")
        return base

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)

    schema_hint = {
        "recommendation": "string max 350 chars, même langue que language_code",
        "rationale_short": "string max 200 chars",
        "risk_score": "number 0-1 cohérent avec les signes FAST",
    }

    prompt = f"""Tu es un assistant médical pour NeuroAlert Africa (dépistage communautaire AVC, test B.E.F.A.S.T.).

Données (issues d'un menu USSD) :
- B (Balance) Perte équilibre : {inp.balance_loss}
- E (Eyes) Vision trouble : {inp.vision_problem}
- F (Face) Visage asymétrique : {inp.face_droop}
- A (Arms) Bras faible / dérive : {inp.arm_weakness}
- S (Speech) Parole trouble : {inp.speech_difficulty}
- T (Time) Heure des signes connue : {inp.time_symptoms_known!s}
- Langue : {inp.language_code}

Analyse déjà calculée par règles :
- Signes positifs : {base.fast_positive_count}/5
- Score risque initial : {base.risk_score}
- Urgence : {base.urgency_level}

Réponds UNIQUEMENT en JSON valide selon ce schéma : {json.dumps(schema_hint)}
- Ne pas inventer d'examen clinique. Urgentiste virtuel.
- Textes COURTS et SIMPLES (Pas de jargon médical).
- Si risque détecté, recommander le Federal Medical Centre (FMC) Abeokuta ou OOUTH Sagamu en Ogun State.
- Si pas de risque, dire que c'est probablement du stress ou de la fatigue.
- Textes pour écran téléphone basique.
"""

    config = GenerationConfig(
        temperature=0.2,
        response_mime_type="application/json",
    )

    try:
        resp = model.generate_content(prompt, generation_config=config)
        text = (resp.text or "").strip()
        data = json.loads(text)
    except Exception as e:
        logger.warning("Gemini indisponible ou JSON invalide : %s", e)
        return base

    try:
        new_risk = float(data.get("risk_score", base.risk_score))
        new_risk = max(0.0, min(1.0, new_risk))
    except (TypeError, ValueError):
        new_risk = base.risk_score

    rec = str(data.get("recommendation") or base.recommendation)[:500]
    rat = str(data.get("rationale_short") or base.rationale_short)[:300]

    return StrokeAnalysisResult(
        fast_positive_count=base.fast_positive_count,
        risk_score=new_risk,
        urgency_level=base.urgency_level,
        recommendation=rec,
        rationale_short=rat,
        model_source="rules+gemini",
        raw_llm_json=data if isinstance(data, dict) else None,
    )


# ---------------------------------------------------------------------------
# Instructions premiers secours (hors diagnostic)
# ---------------------------------------------------------------------------

_FIRST_AID: dict[str, str] = {
    "fr": (
        "Restez calme. Appelez les secours. Faites allonger la personne sur le côté si perte de conscience. "
        "Ne donnez ni à manger ni à boire. Notez l'heure du début des signes. Surveillez la respiration."
    ),
    "en": (
        "Stay calm. Call emergency services. Lay the person on their side if unconscious. "
        "Do not give food or drink. Note the time symptoms started. Watch breathing."
    ),
    "ha": (
        "Ka kwantar da hakuri. Kira agajin gaggawa. Ka bar mutum ya kwanta a gefen idan ya rasa sani. "
        "Kada ka ba shi abinci ko abin sha. Rubuta lokacin fara alamu."
    ),
    "yo": (
        "Farapọ̀ ní ìtùnú. Pe àwọn àìsàn ní kíákíá. Jẹ́ kí ẹnìkan dúró ní ìgbékùn tí ó bá ṣòfò. "
        "Má fún un ní oúnjẹ tàbí ohun mímu. Ṣàkíyèsí àkókò tí àwọn àmì bá bẹ̀rẹ̀."
    ),
    "ig": (
        "Nọdụnụ alụkwaghịm. Kpọọ ọrụ ọgwụgwụ. Ka mmadụ dina n'akụkụ ma ọ bụrụ na ọ nọ n'ụjọ. "
        "E nyefee nri ma ọ bụ mmanya. Dee oge ihe malitere."
    ),
}


def first_aid_text(language_code: str = "fr") -> str:
    """Texte unique pour SMS « premiers gestes » (non exhaustif)."""
    lc = (language_code or "fr").strip().lower()
    if lc in _FIRST_AID:
        return _FIRST_AID[lc]
    k2 = lc[:2]
    if k2 in _FIRST_AID:
        return _FIRST_AID[k2]
    return _FIRST_AID["fr"]


# ---------------------------------------------------------------------------
# Classe principale
# ---------------------------------------------------------------------------


class NeuroAlertModel:
    """
    Point d'entrée unique pour le hackathon / intégration FastAPI.

    Usage:
        m = NeuroAlertModel()
        out = await m.analyze(FASTInput(...))
        level = m.decide_alert(out)
    """

    def __init__(
        self,
        gemini_api_key: Optional[str] = None,
        gemini_model: Optional[str] = None,
    ) -> None:
        self._gemini_api_key = (gemini_api_key or os.getenv("GEMINI_API_KEY") or "").strip() or None
        self._gemini_model = (gemini_model or os.getenv("GEMINI_MODEL") or "gemini-1.5-flash").strip()

    def _rules_only(self, inp: FASTInput) -> StrokeAnalysisResult:
        n, risk, urg, rec, rationale = _compute_rule_metrics(inp)
        return StrokeAnalysisResult(
            fast_positive_count=n,
            risk_score=round(risk, 4),
            urgency_level=urg.value,
            recommendation=rec,
            rationale_short=rationale,
            model_source="rules",
        )

    async def analyze(self, inp: FASTInput) -> StrokeAnalysisResult:
        base = self._rules_only(inp)
        if not self._gemini_api_key:
            return base

        def _run() -> StrokeAnalysisResult:
            return _gemini_json_refinement(inp, base, self._gemini_api_key, self._gemini_model)

        return await asyncio.to_thread(_run)

    def analyze_sync(self, inp: FASTInput) -> StrokeAnalysisResult:
        """Pour scripts ou endpoints FastAPI déjà sync."""
        base = self._rules_only(inp)
        if not self._gemini_api_key:
            return base
        return _gemini_json_refinement(inp, base, self._gemini_api_key, self._gemini_model)

    @staticmethod
    def decide_alert(result: StrokeAnalysisResult) -> AlertDecision:
        """Décision alignée sur la base (champs ai_decision du schéma SQL)."""
        n = result.fast_positive_count
        if n == 0:
            return "low_risk"
        if n == 1:
            return "alert_level1"
        return "alert_level2"

    def get_first_aid(self, language_code: str = "fr") -> str:
        return first_aid_text(language_code)


_default_model: Optional[NeuroAlertModel] = None


def get_default_model() -> NeuroAlertModel:
    global _default_model
    if _default_model is None:
        _default_model = NeuroAlertModel()
    return _default_model


# ---------------------------------------------------------------------------
# Démonstration CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    async def _run_demo() -> None:
        model = NeuroAlertModel()
        samples = [
            FASTInput(face_droop=False, arm_weakness=False, speech_difficulty=False),
            FASTInput(face_droop=True, arm_weakness=False, speech_difficulty=False),
            FASTInput(face_droop=True, arm_weakness=True, speech_difficulty=True),
        ]
        for s in samples:
            out = await model.analyze(s)
            print(out.model_dump_json(indent=2))
            print("decide_alert ->", model.decide_alert(out))
            print("---")

    asyncio.run(_run_demo())
