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
from modelIA.agent import fast_agent

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

    Flow :
      text = ""           → écran d'accueil + choix de langue
      text = "1"/"2"/"3"  → langue choisie → premier tour de l'agent FAST
      text = "<lang>*..."  → tours suivants : dernier input routé vers l'agent
    """
    form_data    = await request.form()
    session_id   = str(form_data.get("sessionId", ""))
    text         = (form_data.get("text") or "").strip()

    # Langue sélectionnée (toujours le premier choix)
    _lang_map = {"1": "fr", "2": "en", "3": "ha"}
    steps = text.split("*") if text else []

    # ── Écran d'accueil : sélection de langue ────────────────────────────────
    if not text:
        return Response(
            content=(
                "CON NeuroAlert Africa — Triage AVC\n"
                "Choisir la langue / Select language :\n"
                "1. Français\n"
                "2. English\n"
                "3. Hausa\n"
                "0. Quitter / Exit"
            ),
            media_type="text/plain",
        )

    # ── Quitter ───────────────────────────────────────────────────────────────
    if steps[0] == "0":
        fast_agent.reset(session_id)
        return Response(
            content="END Au revoir. Composez *789# pour recommencer.",
            media_type="text/plain",
        )

    # ── Langue invalide ───────────────────────────────────────────────────────
    if steps[0] not in _lang_map:
        return Response(
            content="END Saisie invalide. Composez *789# pour recommencer.",
            media_type="text/plain",
        )

    # ── Tours FAST (agent conversationnel) ───────────────────────────────────
    lang       = _lang_map[steps[0]]
    # Premier tour (langue juste choisie) → input vide pour initialiser l'agent
    # Tours suivants → dernier élément de la chaîne accumulée
    last_input = steps[-1] if len(steps) > 1 else ""

    response = await fast_agent.turn(session_id, last_input, lang)
    return Response(content=response, media_type="text/plain")
