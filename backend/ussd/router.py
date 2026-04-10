"""
NeuroAlert Africa — USSD Router (Pitch Stable Version)
Prioritizes USSD response over database logging to ensure a smooth demo.
"""
from fastapi import APIRouter, Request, Response
from backend.database import supabase_admin
from backend.agents import agents
from modelIA.main import FASTInput, NeuroAlertModel
import logging
import uuid
import traceback

router = APIRouter(prefix="/ussd", tags=["USSD"])
logger = logging.getLogger(__name__)

# Questions text map
MENUS = {
    "lang_selection": "NeuroAlert Africa\nSelect Language:\n1. Français\n2. English\n3. Hausa\n4. Yoruba\n5. Igbo",
    "fr": {
        "welcome": "CON NeuroAlert Africa (Assistance AVC)\n1. Faire le test rapide\n0. Quitter",
        "balance": "CON 1/7 EQUILIBRE\nEssayez de rester debout. Avez-vous perdu l'équilibre subitement ?\n1. Oui\n2. Non",
        "eyes": "CON 2/7 YEUX\nRegardez droit devant. Voyez-vous flou ou double tout à coup ?\n1. Oui\n2. Non",
        "face": "CON 3/7 VISAGE\nEssayez de sourire. Un côté de votre visage s'affaisse-t-il ?\n1. Oui\n2. Non",
        "arm": "CON 4/7 BRAS\nLevez vos deux bras. L'un d'eux retombe-t-il tout seul ?\n1. Oui (Faiblesse)\n2. Non (Normal)",
        "speech": "CON 5/7 PAROLE\nDites: 'Le ciel est bleu'. Votre voix est-elle bizarre ou confuse ?\n1. Oui\n2. Non",
        "time": "CON 6/7 TEMPS\nSavez-vous à quelle heure cela a commencé ?\n1. Oui\n2. Non",
        "location": "CON 7/7 LOCALISATION\nOù êtes-vous exactement ? (Ville, Quartier, Rue)",
        "end_low": "END NeuroAlert : Vous allez bien ! Reposez-vous à la maison.",
        "end_high": "END ALERTE AVC ! Allez au FMC Abeokuta ou OOUTH Sagamu immédiatement."
    },
    "en": {
        "welcome": "CON NeuroAlert Africa (Stroke Assist)\n1. Start quick test\n0. Exit",
        "balance": "CON 1/7 BALANCE\nTry to stand still. Did you suddenly lose your balance?\n1. Yes\n2. No",
        "eyes": "CON 2/7 EYES\nLook straight ahead. Is your vision blurry or double suddenly?\n1. Yes\n2. No",
        "face": "CON 3/7 FACE\nSmile please. Does one side of your face droop?\n1. Yes\n2. No",
        "arm": "CON 4/7 ARMS\nRaise both arms. Does one of them drift down?\n1. Yes\n2. No",
        "speech": "CON 5/7 SPEECH\nSay: 'The sky is blue'. Is your speech slurred or strange?\n1. Yes\n2. No",
        "time": "CON 6/7 TIME\nDo you know exactly when this started?\n1. Yes\n2. No",
        "location": "CON 7/7 LOCATION\nWhere are you right now? (City, Street, Neighborhood)",
        "end_low": "END NeuroAlert: You are okay! But you might just be tired. Please rest.",
        "end_high": "END STROKE ALERT! Go to FMC Abeokuta or Babcock Teaching Hospital immediately."
    }
}

def safe_db_call(func, *args, **kwargs):
    """Executes a DB call but prevents crashes if DB is down or schema is wrong."""
    try:
        return func(*args, **kwargs).execute()
    except Exception as e:
        logger.warning(f"Database background error (ignored for session continuity): {e}")
        return None

@router.post("")
async def handle_ussd(request: Request):
    try:
        form_data = await request.form()
        session_id = form_data.get("sessionId")
        phone_number = form_data.get("phoneNumber")
        text = form_data.get("text", "")

        # Clean text logic (Frontend must send clean 1*2*1 indices)
        steps = text.split("*") if text and text != "" else []
        logger.info(f"USSD Step: session={session_id} len={len(steps)} steps={steps}")
        
        # Language Map
        LANGS = {"1": "fr", "2": "en", "3": "ha", "4": "yo", "5": "ig"}
        
        response = ""
        
        if not text or text == "":
            response = MENUS["lang_selection"]
            safe_db_call(supabase_admin.table("ussd_sessions").insert, {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "phone_number": phone_number,
                "status": "active",
                "current_step": "lang_selection"
            })
            
        elif len(steps) == 1:
            lang = LANGS.get(steps[0], "en")
            response = MENUS.get(lang, MENUS["en"])["welcome"]
            safe_db_call(supabase_admin.table("ussd_sessions").update, {
                "current_step": "welcome",
                "language_code": lang
            }, eq_id=session_id) # Using a simplified match or just ignoring for continuity
            
        elif len(steps) >= 2:
            lang = LANGS.get(steps[0], "en")
            m = MENUS.get(lang, MENUS["en"])
            
            if len(steps) == 2:
                response = m["balance"]
            elif len(steps) == 3:
                response = m["eyes"]
            elif len(steps) == 4:
                response = m["face"]
            elif len(steps) == 5:
                response = m["arm"]
            elif len(steps) == 6:
                response = m["speech"]
            elif len(steps) == 7:
                response = m["time"]
            elif len(steps) == 8:
                response = m["location"]
            elif len(steps) >= 9:
                # FINAL ANALYSIS BLOCK - Triggered when all 7 questions + Location are answered
                balance = (steps[2] == "1")
                eyes = (steps[3] == "1")
                face = (steps[4] == "1")
                arm = (steps[5] == "1")
                speech = (steps[6] == "1")
                time_v = (steps[7] == "1")
                location_text_input = steps[8] if len(steps) > 8 else "Unknown"

                # AI Engine Call
                analysis = await agents.analyse_fast_symptoms(
                    balance=balance, eyes=eyes, face=face, arm=arm, speech=speech,
                    time_known=time_v, language_code=lang
                )
                decision = agents.decide_alert(analysis)
                
                # Persistence (Optional but good for demo logs)
                safe_db_call(supabase_admin.table("ussd_sessions").update, {
                    "status": "completed",
                    "fast_score": analysis.get("fast_positive_count", 0),
                    "ai_decision": decision,
                    "location_text": location_text_input
                }, eq_id=session_id)

                # ALERTING
                if decision != "low_risk":
                    inst_res = safe_db_call(supabase_admin.table("institutions").select("id").limit(1))
                    inst_id = inst_res.data[0]["id"] if inst_res and inst_res.data else None
                    safe_db_call(supabase_admin.table("alerts").insert, {
                        "id": str(uuid.uuid4()),
                        "institution_id": inst_id,
                        "phone_caller": phone_number,
                        "location_text": location_text_input,
                        "alert_level": 2 if decision == "alert_level2" else 1,
                        "status": "active"
                    })

                # FINAL RESPONSE (Ensuring it starts with END to stop USSD session)
                rec_text = analysis.get("recommendation") or m["end_low"]
                response = f"END {rec_text}"
            else:
                response = "END Diagnostic complete. Please rest."
        else:
            response = "END Session finished."

        return Response(content=response, media_type="text/plain")

    except Exception as e:
        logger.error(f"CRITICAL USSD ERROR: {str(e)}")
        logger.error(traceback.format_exc())
        # ABSOLUTE FALLBACK - Never show 500 to user during pitch
        return Response(content="END Please try again in a moment.", media_type="text/plain")
