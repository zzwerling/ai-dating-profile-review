from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from firebase_admin import auth as firebase_auth

from pydantic import BaseModel

from typing import List, Optional

import logging
import re
import json
from utils.reviewer import get_bio_review
from utils.conversation_coach import conversation_feedback
from utils.opener_generator import generate_openers
from utils.auth import init_firebase_from_env

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

origins = ["http://localhost:5173", "https://ai-dating-profile-toolkit.vercel.app"]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_firebase_from_env()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

class BioRequest(BaseModel):
    bio: str
    temperature: float

class BioResponse(BaseModel):
    submitted_rating: int
    submitted_critique: str
    rewritten_bio: str
    rewritten_rating: int
    rewritten_explanation: str

class OpenerRequest(BaseModel):
    description: str
    tone: str
    number: int

class OpenerResponse(BaseModel):
    openers: list[str]
    
class ConvoCoachRequest(BaseModel):
    conversation: str
    bio: str
    
class Feedback(BaseModel):
    summary: str
    tone_detected: str


class Suggestion(BaseModel):
    style: str
    message: str


class ConvoCoachResponse(BaseModel):
    feedback: Feedback
    suggestions: Optional[List[Suggestion]] = None 

def is_input_safe(user_input: str) -> bool:
    try:
        with open('secrets/filters.json') as f:
            filters = json.load(f).get('blocked_patterns', [])
        for pattern in filters:
            if re.search(pattern, user_input, re.IGNORECASE):
                return False
        return True
    except Exception as e:
        # Fail safe: block everything if the filter can't be loaded
        return False


@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    client_ip = request.client.host
    logger.warning(f"Rate limit exceeded for IP: {client_ip}")
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )

def verify_firebase_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header.")

    token = auth_header.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token  # gives you uid, email, etc.
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

@app.post("/review", response_model=BioResponse)
@limiter.limit("2/minute")
def review_route(bio_request: BioRequest, request: Request):
    
    if not is_input_safe(bio_request.bio):
        raise HTTPException(status_code=400, detail="Input contains disallowed content.")
    
    result = get_bio_review(bio_request.bio, bio_request.temperature)
    return result

@app.post("/generate-openers", response_model=OpenerResponse)
@limiter.limit("5/minute")
def generate_openers_route(opener_request: OpenerRequest, request: Request):
    
    if not is_input_safe(opener_request.description):
        raise HTTPException(status_code=400, detail="Input contains disallowed content.")
    
    result = generate_openers(opener_request.description, opener_request.tone, opener_request.number)
    return result

@app.post("/conversation-feedback", response_model=ConvoCoachResponse)
@limiter.limit("5/hour")
def conversation_feedback_route(conversation_request: ConvoCoachRequest, request: Request):
    
    if not is_input_safe(conversation_request.conversation) or not is_input_safe(conversation_request.bio):
        raise HTTPException(status_code=400, detail="Input contains disallowed content.")
    
    result = conversation_feedback(conversation_request.conversation, conversation_request.bio)
    return result
