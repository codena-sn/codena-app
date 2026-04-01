from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..deps import require_role
from ..models import User, Lesson, Question, Booking, Payment
router=APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_role("admin"))])

@router.get("/stats")
def stats(db: Session=Depends(get_db)):
    return {"users":db.query(User).count(),"lessons":db.query(Lesson).count(),"questions":db.query(Question).count(),
            "bookings":db.query(Booking).count(),"payments":db.query(Payment).count()}
