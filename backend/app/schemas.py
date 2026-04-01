from pydantic import BaseModel, Field
from typing import Optional, Dict, List

class OTPRequest(BaseModel): phone: str
class OTPVerify(BaseModel): phone: str; code: str

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str="bearer"

class RefreshIn(BaseModel): refresh_token: str
class LogoutIn(BaseModel): refresh_token: str

class LessonCreate(BaseModel):
    title: str
    chapter: str
    media_url: Optional[str]=None
    content_md: str
    reading_time_min: int=5
    status: str="published"
class LessonOut(LessonCreate): id: int

class QuestionCreate(BaseModel):
    theme: str
    difficulty: int=1
    stem: str
    media_url: Optional[str]=None
    choices: Dict[str,str]
    answer: str
    explanation: Optional[str]=None
    status: str="published"

class QuestionOut(BaseModel):
    id: int
    theme: str
    difficulty: int
    stem: str
    media_url: Optional[str]
    choices: Dict[str,str]
    explanation: Optional[str]=None

class MockStartIn(BaseModel):
    size: int=Field(default=40, ge=10, le=60)
    themes: Optional[List[str]]=None
class MockStartOut(BaseModel):
    mock_exam_id: int
    questions: List[QuestionOut]
class MockSubmitIn(BaseModel):
    answers: Dict[int,str]
    duration_sec: int=0
class ScoreOut(BaseModel):
    score: int
    readiness: int
    recommendation: List[str]
    breakdown: Dict[str,float]

class BookingIn(BaseModel): slot_id: int
class BookingOut(BaseModel):
    booking_id: int
    status: str
    pdf_url: str
    qr_data: str

class PaymentCreateIn(BaseModel):
    provider: str=Field(pattern="^(wave|om)$")
    amount_fcfa: int=Field(ge=100)
class PaymentOut(BaseModel):
    reference: str
    status: str
    provider: str
    amount_fcfa: int
