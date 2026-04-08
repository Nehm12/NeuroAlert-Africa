"""
NeuroAlert Africa — Main FastAPI Application
Entry point. Registers all routers and middleware.
"""
import sys
import os
import types

# --- Vercel Path Fix ---
# Sur Vercel, le contenu de backend/ est déployé directement dans /var/task/
# (sans sous-dossier backend/). Python ne peut donc pas trouver le package 'backend'.
# On crée un module virtuel 'backend' qui pointe vers le dossier courant,
# ce qui permet à `from backend.config import settings` de résoudre ./config.py
current_dir = os.path.dirname(os.path.abspath(__file__))
if 'backend' not in sys.modules:
    _pkg = types.ModuleType('backend')
    _pkg.__path__ = [current_dir]
    _pkg.__package__ = 'backend'
    sys.modules['backend'] = _pkg

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from backend.config import settings
from backend.auth.router import router as auth_router
from backend.dashboard.router import router as dashboard_router
from backend.ussd.router import router as ussd_router

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
    allow_origins=[
        settings.FRONTEND_URL, 
        "https://naaf.online",
        "http://naaf.online",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(ussd_router)


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
    from backend.database import supabase
    from backend.agents import agents
    
    # 1. Test Database
    try:
        supabase.table("users").select("count", count="exact").limit(1).execute()
        db_status = "connected"
    except Exception:
        db_status = "error"

    # 2. Test IA Model
    try:
        # Simple non-LLM check first
        from backend.modelIA.main import FASTInput
        test_input = FASTInput(
            balance_loss=False, vision_problem=False, face_droop=False, 
            arm_weakness=False, speech_difficulty=False
        )
        ai_result = await agents.analyse_fast_symptoms(
            face=False, arm=False, speech=False
        )
        ai_status = "ready" if ai_result else "error"
    except Exception as e:
        ai_status = f"error: {str(e)}"
        
    return {
        "status": "healthy" if db_status == "connected" and "error" not in ai_status else "degraded",
        "components": {
            "database": db_status,
            "ai_engine": ai_status,
            "telecom": "initialized" if settings.AT_API_KEY else "missing_key"
        },
        "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


# USSD logic moved to backend/ussd/router.py
