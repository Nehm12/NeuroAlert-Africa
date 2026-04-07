"""
Module IA NeuroAlert Africa.

Import explicite recommandé pour éviter les cycles d'import :
    from modelIA.main  import NeuroAlertModel, FASTInput, StrokeAnalysisResult
    from modelIA.agent import FASTConversationalAgent, fast_agent
    from modelIA.tools import get_fallback_question, extract_signs_from_text, generate_contextual_question
"""

from modelIA.agent import FASTConversationalAgent, fast_agent

__all__ = [
    "FASTConversationalAgent",
    "fast_agent",
]
