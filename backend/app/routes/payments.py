from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import secrets
from ..db import get_db
from ..models import Payment, User
from ..schemas import PaymentCreateIn, PaymentOut
from ..deps import get_current_user
from ..config import settings

router=APIRouter(prefix="/payments", tags=["payments"])

@router.post("/create", response_model=PaymentOut)
def create(payload: PaymentCreateIn, db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    ref="PAY-"+secrets.token_hex(8).upper()
    p=Payment(user_id=user.id, provider=payload.provider, amount_fcfa=payload.amount_fcfa, status="created", reference=ref)
    db.add(p); db.commit()
    return {"reference":ref,"status":p.status,"provider":p.provider,"amount_fcfa":p.amount_fcfa}

@router.post("/webhook")
async def webhook(request: Request, db: Session=Depends(get_db)):
    body=await request.json()
    if body.get("secret")!=settings.payment_webhook_secret:
        raise HTTPException(401,"Invalid secret")
    p=db.query(Payment).filter(Payment.reference==body.get("reference")).first()
    if not p: raise HTTPException(404,"Payment not found")
    p.status=body.get("status")
    db.add(p); db.commit()
    return {"ok": True}
