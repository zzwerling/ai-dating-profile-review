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

class Image(BaseModel):
    link: HttpUrl
    type: str
    width: int
    height: int

class ImageMetrics(BaseModel):
    blur: Optional[float] = None
    face_ratio: Optional[float] = None
    yaw: Optional[float] = None

class ScoredImage(BaseModel):
    url: HttpUrl
    score: int
    passed: bool
    feedback: str
    issues: List[str]
    metrics: ImageMetrics
    

class ImageURLRequest(BaseModel):
    imgur_url: HttpUrl
    agreedToTerms: bool
    
    @model_validator(mode='after')
    def check_terms(self) -> 'ImageURLRequest':
        if not self.agreedToTerms:
            raise ValueError("You must agree to the terms.")
        return self

class ImageURLResponse(BaseModel):
    images: List[ScoredImage]

    