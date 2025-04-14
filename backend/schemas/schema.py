from pydantic import BaseModel, HttpUrl, model_validator

from typing import List, Optional

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





    