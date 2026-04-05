from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NeuroAlert Africa API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to NeuroAlert Africa API", "status": "active"}

@app.post("/ussd")
async def ussd_callback(request: Request):
    """
    Africa's Talking USSD Callback
    Expects form-data: sessionId, serviceCode, phoneNumber, text
    """
    form_data = await request.form()
    session_id = form_data.get("sessionId")
    service_code = form_data.get("serviceCode")
    phone_number = form_data.get("phoneNumber")
    text = form_data.get("text", "")

    # Placeholder logic for USSD flow
    # Africa's Talking expects plain text response starting with CON (continue) or END (end)
    if not text:
        response = "CON Welcome to NeuroAlert Africa\n"
        response += "1. Start FAST Test\n"
        response += "2. Stroke Information\n"
        response += "0. Exit"
    elif text == "1":
        response = "CON Q1: Does their face look uneven when they smile? (Yes/No)"
    elif text == "1*1": # Simulating multi-step USSD
        response = "CON Q2: Can they lift both arms? (Yes/No)"
    else:
        response = "END Thank you for using NeuroAlert Africa."

    return Response(content=response, media_type="text/plain")
