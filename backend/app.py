from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from firebase_admin import auth as firebase_auth

from pydantic import BaseModel

import uvicorn
import logging

from reviewer import get_bio_review
from auth import init_firebase_from_env

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

origins = ["http://localhost:5173", "https://ai-dating-profile-review.vercel.app"]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin
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
def review(bio_request: BioRequest, request: Request):
    result = get_bio_review(bio_request.bio, bio_request.temperature)
    return result

if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)