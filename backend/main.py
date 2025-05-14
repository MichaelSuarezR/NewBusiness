# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1"

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(data: ChatRequest):
    user_input = data.message

    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "prompt": user_input,
        "max_tokens": 200,
        "temperature": 0.7
    }

    response = requests.post(
        "https://api.together.xyz/v1/completions",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        result = response.json()
        return {"response": result['choices'][0]['text'].strip()}
    else:
        return {"response": f"Error: {response.status_code} - {response.text}"}
