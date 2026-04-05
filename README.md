# NeuroAlert Africa 🧠🚨

NeuroAlert Africa is a stroke early warning system designed for the African context. It uses USSD/SMS technology to provide a life-saving diagnostic tool (the FAST test) to everyone, even those without smartphones or internet access.

## Project Structure

- `backend/`: FastAPI application.
- `frontend/`: Next.js application (Landing Page & Dashboard).
- `database/`: SQL initialization scripts and database related files.

## Technical Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js 15 (TypeScript, Tailwind CSS)
- **Database/Auth**: Supabase (PostgreSQL)
- **USSD/SMS**: Africa's Talking SDK
- **AI**: Google Agent Development Kit (ADK) + Gemini/Groq

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- Africa's Talking, Supabase, and AI (Gemini/Groq) API keys.

### Backend Setup

1. `cd backend`
2. `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and fill in your credentials.
4. `uvicorn main:app --reload`

### Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Deployment

- **Backend**: Deploy the `backend/` directory to **Render**.
- **Frontend**: Deploy the `frontend/` directory to **Vercel**.
