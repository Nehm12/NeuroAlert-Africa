"""
NeuroAlert Africa — USSD Router
Handles Africa's Talking callbacks and integrates with modelIA.
"""
from fastapi import APIRouter, Request, Response
from backend.database import supabase_admin
from backend.agents import agents
from modelIA.main import FASTInput, NeuroAlertModel
import logging
import uuid

router = APIRouter(prefix="/ussd", tags=["USSD"])
logger = logging.getLogger(__name__)

# Questions text map
MENUS = {
    "lang_selection": "NeuroAlert Africa\nSelect Language:\n1. Français\n2. English\n3. Hausa\n4. Yoruba\n5. Igbo",
    "fr": {
        "welcome": "CON NeuroAlert Africa (Triage AVC)\n1. Démarrer le dépistage\n0. Quitter",
        "balance": "CON 1/7 EQUILIBRE\nLa personne a-t-elle subitement perdu l'équilibre ou la coordination?\n1. Oui\n2. Non",
        "eyes": "CON 2/7 YEUX\nA-t-elle une perte de vision soudaine ou voit-elle double?\n1. Oui\n2. Non",
        "face": "CON 3/7 VISAGE\nLe visage est-il asymétrique? Demandez-lui de sourire pour vérifier.\n1. Oui\n2. Non",
        "arm": "CON 4/7 BRAS\nPeut-elle lever les deux bras normalement? L'un d'eux retombe-t-il?\n1. Non (Faiblesse)\n2. Oui (Normal)",
        "speech": "CON 5/7 PAROLE\nSa parole est-elle confuse ou étrange? Demandez-lui de répéter une phrase.\n1. Oui\n2. Non",
        "time": "CON 6/7 TEMPS\nConnaissez-vous l'heure exacte du début des signes?\n1. Oui\n2. Non",
        "location": "CON 7/7 LOCALISATION\nDans quelle ville, quartier ou rue êtes-vous actuellement ? (Tapez en texte court)",
        "end_low": "END NeuroAlert : Aucun signe critique détecté. Restez vigilant.",
        "end_high": "END ALERTE AVC ! Appelez le 15/112 immédiatement."
    },
    "en": {
        "welcome": "CON NeuroAlert Africa (Stroke Triage)\n1. Start screening\n0. Exit",
        "balance": "CON 1/7 BALANCE\nDid the person suddenly lose balance or coordination?\n1. Yes\n2. No",
        "eyes": "CON 2/7 EYES\nDid they have sudden vision loss or double vision?\n1. Yes\n2. No",
        "face": "CON 3/7 FACE\nIs the face drooping? Ask them to smile to check.\n1. Yes\n2. No",
        "arm": "CON 4/7 ARMS\nCan they raise both arms? Does one arm drift down?\n1. No (Weakness)\n2. Yes (Normal)",
        "speech": "CON 5/7 SPEECH\nIs their speech slurred or strange? Ask them to repeat a simple sentence.\n1. Yes\n2. No",
        "time": "CON 6/7 TIME\nDo you know exactly when the symptoms started?\n1. Yes\n2. No",
        "location": "CON 7/7 LOCATION\nIn which city, neighborhood, or street are you currently located? (Type short text)",
        "end_low": "END NeuroAlert: No critical signs detected. Stay vigilant.",
        "end_high": "END STROKE ALERT! Call 911/112 immediately."
    },
    "ig": {
        "welcome": "CON NeuroAlert Africa (Triage Stroke)\n1. Malite nnyocha\n0. Pụọ",
        "balance": "CON 1/6 NGUZOZI\nOtu onye ọ tụfuru nkwekọrịta ma ọ bụ nguzozi na mberede?\n1. Ee\n2. Mba",
        "eyes": "CON 2/6 ANYA\nO nwere nsogbu ọhụụ na mberede (ịhụ ihe abụọ ma ọ bụ ìsì)?\n1. Ee\n2. Mba",
        "face": "CON 3/6 IHU\nIhu ya ọ dabara adaba? Gwa ya ka ọ chịa ọchị.\n1. Ee\n2. Mba",
        "arm": "CON 4/6 AKA\nỌ nwere ike ibuli aka ya abụọ? Nke ọ bụla n'ime ha ọ na-ada?\n1. Mba (Adịghị ike)\n2. Ee (Ọ dị mma)",
        "speech": "CON 5/6 OKWU\nOkwu ya ọ bụ ihe ijuanya? Gwa ya ka o kwuo okwu dị mfe.\n1. Ee\n2. Mba",
        "time": "CON 6/6 OGE\nỊ ma oge ihe a malitere?\n1. Ee\n2. Mba",
        "end_low": "END NeuroAlert: Enweghị akara mberede. Nọrọ na nche.",
        "end_high": "END ALERTE AVC! Kpọọ ndị nnapụta ozugbo."
    }
}

@router.post("")
async def handle_ussd(request: Request):
    form_data = await request.form()
    session_id = form_data.get("sessionId")
    phone_number = form_data.get("phoneNumber")
    text = form_data.get("text", "")

    # Clean text logic (AT format is 1*1*2)
    steps = text.split("*") if text else []
    
    # Language Map
    LANGS = {"1": "fr", "2": "en", "3": "ha", "4": "yo", "5": "ig"}
    
    if not text:
        response = MENUS["lang_selection"]
        # Track initial session in DB
        supabase_admin.table("ussd_sessions").insert({
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "phone_number": phone_number,
            "status": "active",
            "current_step": "lang_selection"
        }).execute()
        
    elif len(steps) == 1:
        lang = LANGS.get(steps[0], "fr")
        response = MENUS[lang]["welcome"]
        supabase_admin.table("ussd_sessions").update({
            "current_step": "welcome",
            "language_code": lang
        }).eq("session_id", session_id).execute()
        
    elif len(steps) >= 2:
        # Detect lang from first step
        lang = LANGS.get(steps[0], "fr")
        
        if len(steps) == 2: # Answered Welcome (Start screening)
            response = MENUS[lang]["balance"]
            supabase_admin.table("ussd_sessions").update({"current_step": "balance"}).eq("session_id", session_id).execute()
            
        elif len(steps) == 3: # Answered Balance
            response = MENUS[lang]["eyes"]
            supabase_admin.table("ussd_sessions").update({"current_step": "eyes"}).eq("session_id", session_id).execute()
            
        elif len(steps) == 4: # Answered Eyes
            response = MENUS[lang]["face"]
            supabase_admin.table("ussd_sessions").update({"current_step": "face"}).eq("session_id", session_id).execute()
            
        elif len(steps) == 5: # Answered Face
            response = MENUS[lang]["arm"]
            supabase_admin.table("ussd_sessions").update({"current_step": "arm"}).eq("session_id", session_id).execute()
            
        elif len(steps) == 6: # Answered Arm
            response = MENUS[lang]["speech"]
            supabase_admin.table("ussd_sessions").update({"current_step": "speech"}).eq("session_id", session_id).execute()
            
        elif len(steps) == 7: # Answered Speech
            response = MENUS[lang]["time"]
            supabase_admin.table("ussd_sessions").update({"current_step": "time"}).eq("session_id", session_id).execute()
            
        elif len(steps) == 8: # Answered Time -> Ask Location
            response = MENUS[lang]["location"]
            supabase_admin.table("ussd_sessions").update({"current_step": "location"}).eq("session_id", session_id).execute()
            
        elif len(steps) == 9: # Answered Location -> Run Model
            # Indices: 0=Lang, 1=StartTest, 2=Balance, 3=Eyes, 4=Face, 5=Arm, 6=Speech, 7=Time, 8=Location
            balance = (steps[2] == "1")
            eyes = (steps[3] == "1")
            face = (steps[4] == "1")
            arm = (steps[5] == "1")
            speech = (steps[6] == "1")
            time_v = (steps[7] == "1")
            location_text_input = steps[8]

            # Analyze using existing modelIA through agents layer
            analysis = await agents.analyse_fast_symptoms(
                balance=balance,
                eyes=eyes,
                face=face,
                arm=arm,
                speech=speech,
                time_known=time_v,
                language_code=lang
            )
            decision = agents.decide_alert(analysis)
            
            # Geocoding via Gemini (Mock pour l'instant)
            # Demande à Gemini d'extraire lat/lng via le texte (ex: 6.5244, 3.3792)
            extracted_lat = 6.5244 # Test Lagos
            extracted_lon = 3.3792
            
            # symptoms dictionary
            symptoms_data = {
                "balance": balance,
                "eyes": eyes,
                "face": face,
                "arm": arm,
                "speech": speech,
                "time_known": time_v
            }

            # Update DB with final result
            supabase_admin.table("ussd_sessions").update({
                "status": "completed",
                "current_step": "finished",
                "fast_score": analysis.get("fast_positive_count", 0),
                "ai_risk_score": analysis.get("risk_score", 0),
                "ai_decision": decision,
                "symptoms": symptoms_data
            }).eq("session_id", session_id).execute()
            
            # 🚨 Envoi d'Alerte au Dashboard avec GPS ! 🚨
            if decision in ["alert_level1", "alert_level2"]:
                alert_level = 2 if decision == "alert_level2" else 1
                supabase_admin.table("alerts").insert({
                    "id": str(uuid.uuid4()),
                    "alert_level": alert_level,
                    "phone_caller": phone_number,
                    "location_text": location_text_input,
                    "latitude": extracted_lat,
                    "longitude": extracted_lon,
                    "fast_score": analysis.get("fast_positive_count", 0),
                    "ai_risk_score": analysis.get("risk_score", 0),
                    "ai_decision": decision,
                    "symptoms": symptoms_data,
                    "status": "active"
                }).execute()
            
            # 🚨 Emergency Alerts Trigger SMS 🚨
            if decision == "alert_level2":
                score_befast = analysis.get('fast_positive_count')
                msg = (
                    f"NeuroAlert URGENT: Suspicion AVC sur le numéro {phone_number} à {location_text_input}. "
                    f"Score BEFAST: {score_befast}/5. "
                    "Intervention immediate requise."
                )
                emergency_contacts = ["+221770000000"] # Mock
                await agents.send_emergency_sms(emergency_contacts, msg)

            # Dynamic recommendation
            rec_text = analysis.get("recommendation", MENUS[lang]["end_low"])
            response = f"END {rec_text}"
        else:
            response = "END Session terminée."
    else:
        response = "END Session terminée."

    return Response(content=response, media_type="text/plain")
