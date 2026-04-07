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
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
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
    return {"status": "healthy", "timestamp": __import__("datetime").datetime.utcnow().isoformat()}


# USSD logic moved to backend/ussd/router.py
