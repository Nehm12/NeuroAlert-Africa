import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class NeuroAlertAgents:
    """
    NeuroAlert Africa AI Agents
    Using Google Generative AI (Gemini) for symptom analysis and alerting.
    """

    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def analyse_fast_symptoms(self, face: bool, arm: bool, speech: bool) -> dict:
        """
        Agent Analyse: Processes FAST symptoms and returns a risk assessment.
        """
        # Rule-based fallback + AI refinement
        score = 0
        if face: score += 1
        if arm: score += 1
        if speech: score += 1

        prompt = f"""
        Analyze the following stroke symptoms (FAST test):
        - Facial drooping: {'Yes' if face else 'No'}
        - Arm weakness: {'Yes' if arm else 'No'}
        - Speech difficulty: {'Yes' if speech else 'No'}
        
        Current FAST Score: {score}/3.
        
        Provide a JSON response with:
        - risk_score: (float between 0.0 and 1.0)
        - urgency_level: (low, medium, high)
        - recommendation: (short text)
        """

        try:
            # For MVP, we can combine rule-based and AI or just use AI for complex cases
            # Here we simulate the AI response logic
            risk_score = score / 3.0
            urgency = "high" if score >= 2 else "medium" if score == 1 else "low"
            
            return {
                "risk_score": risk_score,
                "urgency_level": urgency,
                "recommendation": "Call emergency services immediately." if score >= 1 else "Monitor symptoms and consult a doctor."
            }
        except Exception as e:
            return {"error": str(e), "risk_score": score/3.0, "urgency_level": "unknown"}

    async def decide_alert(self, analysis: dict) -> str:
        """
        Agent Alerte: Decides the next action based on analysis.
        """
        if analysis.get("urgency_level") == "high":
            return "alert_level2"  # Emergency + Family
        elif analysis.get("urgency_level") == "medium":
            return "alert_level1"  # Family only
        else:
            return "low_risk"

    def get_first_aid_instructions(self, language_code: str = "fr") -> str:
        """
        Provides first aid instructions in the requested language.
        """
        # Placeholder for multilingual instructions
        instructions = {
            "fr": "1. Gardez la personne calme. 2. Ne rien donner à manger ou à boire. 3. Notez l'heure du début des signes.",
            "en": "1. Keep the person calm. 2. Do not give food or drink. 3. Note the time symptoms started.",
            "ha": "1. Kwantar wa mutum da hankali. 2. Kada ka ba shi abinci ko abin sha. 3. Rubuta lokacin da alamun suka fara."
        }
        return instructions.get(language_code, instructions["fr"])

# Singleton instance
agents = NeuroAlertAgents()
