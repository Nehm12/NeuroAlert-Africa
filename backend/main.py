"""
NeuroAlert Africa — Main FastAPI Application
Entry point. Registers all routers and middleware.
"""
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from backend.config import settings
from backend.auth.router import router as auth_router
from backend.dashboard.router import router as dashboard_router

# ── App Init ─────────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    description="""
## NeuroAlert Africa API

Backend API for the NeuroAlert Africa platform — USSD-native stroke triage system powered by Google Gemini.

### Auth
- `POST /auth/login` — Get JWT token
- `GET /auth/me` — Current user profile

### Dashboard (JWT required)
- `GET /dashboard/stats` — Today's summary
- `GET /dashboard/alerts` — Paginated alerts
- `PATCH /dashboard/alerts/{id}/acknowledge` — Acknowledge
- `PATCH /dashboard/alerts/{id}/resolve` — Resolve
- `GET /dashboard/triage-feed` — Live USSD sessions
- `GET /dashboard/users` — Institution users (admin)

### USSD
- `POST /ussd` — Africa's Talking USSD callback
    """,
)

# ── CORS ──────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(auth_router)
app.include_router(dashboard_router)


# ── Root & Health ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "operational",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "timestamp": __import__("datetime").datetime.utcnow().isoformat()}


# ── USSD Callback (Africa's Talking) ─────────────────────────────────────────

@app.post("/ussd", tags=["USSD"])
async def ussd_callback(request: Request):
    """
    Africa's Talking USSD Callback endpoint.
    Expects form-data: sessionId, serviceCode, phoneNumber, text
    Returns plain text starting with CON (continue) or END (end session).
    """
    form_data = await request.form()
    session_id = form_data.get("sessionId", "")
    phone_number = form_data.get("phoneNumber", "")
    text = form_data.get("text", "").strip()

    # ── Step routing ─────────────────────────────────────────────────────────
    steps = text.split("*") if text else []
    step_count = len(steps)

    if not text:
        # Welcome screen — Language selection
        response = (
            "CON NeuroAlert Africa — Stroke Triage\n"
            "Select language / Choisir la langue:\n"
            "1. Français\n"
            "2. English\n"
            "3. Hausa\n"
            "0. Quitter / Exit"
        )
    elif step_count == 1 and steps[0] in ["1", "2", "3"]:
        # Language selected — FAST intro
        lang_map = {"1": "Français", "2": "English", "3": "Hausa"}
        response = (
            f"CON FAST Triage ({lang_map.get(steps[0], 'FR')})\n"
            "Q1 - VISAGE: La personne a-t-elle une asymetrie du visage?\n"
            "1. Oui\n"
            "2. Non"
        )
    elif step_count == 2:
        # Q2 - ARM
        response = (
            "CON Q2 - BRAS: Peut-elle lever les deux bras?\n"
            "1. Non (bras retombe)\n"
            "2. Oui (normal)"
        )
    elif step_count == 3:
        # Q3 - SPEECH
        response = (
            "CON Q3 - PAROLE: A-t-elle un trouble de l'elocution?\n"
            "1. Oui (parole anormale)\n"
            "2. Non (normal)"
        )
    elif step_count == 4:
        # Calculate FAST score & AI decision
        face_sym = steps[1] == "1"
        arm_weak = steps[2] == "1"
        speech_diff = steps[3] == "1"
        fast_score = sum([face_sym, arm_weak, speech_diff])

        if fast_score >= 2:
            response = (
                "END ALERTE NIVEAU 2 — AVC Suspect!\n"
                "Appelez immédiatement le 15 ou 112.\n"
                "Ne laissez pas la personne seule.\n"
                "NeuroAlert a alerté l'hopital le plus proche."
            )
        elif fast_score == 1:
            response = (
                "END ALERTE NIVEAU 1 — Symptome detecte.\n"
                "Consultez un medecin maintenant.\n"
                "SMS d'information envoyé."
            )
        else:
            response = (
                "END Aucun symptome critique detecte.\n"
                "Restez vigilant. En cas de doute,\n"
                "composez a nouveau *789#.\n"
                "NeuroAlert Africa."
            )
    else:
        response = "END Merci d'utiliser NeuroAlert Africa.\nComposez *789# pour recommencer."

    return Response(content=response, media_type="text/plain")
