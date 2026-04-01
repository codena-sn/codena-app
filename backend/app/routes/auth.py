from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from passlib.context import CryptContext
import random, secrets

from ..db import get_db
from ..config import settings
from ..models import User, OTPCode, RefreshToken
from ..schemas import OTPRequest, OTPVerify, TokenOut, RefreshIn, LogoutIn
from ..security import create_token, decode_token
from ..logging import log_event

router = APIRouter(prefix="/auth", tags=["auth"])
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def issue_tokens(db: Session, user: User) -> TokenOut:
    access_jti = secrets.token_hex(16)
    refresh_jti = secrets.token_hex(16)
    access = create_token(user.phone, "access", access_jti, timedelta(minutes=settings.jwt_access_min))
    refresh = create_token(user.phone, "refresh", refresh_jti, timedelta(days=settings.jwt_refresh_days))
    db.add(RefreshToken(user_id=user.id, jti=refresh_jti, revoked=False, expires_at=datetime.utcnow()+timedelta(days=settings.jwt_refresh_days)))
    db.commit()
    return TokenOut(access_token=access, refresh_token=refresh)

@router.post("/otp/send")
def send_otp(payload: OTPRequest, db: Session=Depends(get_db)):
    code = f"{random.randint(0,999999):06d}"
    expires_at = datetime.utcnow()+timedelta(minutes=settings.otp_ttl_minutes)
    db.query(OTPCode).filter(OTPCode.phone==payload.phone).delete()
    db.add(OTPCode(phone=payload.phone, code_hash=pwd.hash(code), expires_at=expires_at, attempts=0))
    db.commit()
    log_event("otp_sent", phone=payload.phone)
    return {"ok": True, "message": "OTP sent (dev stub)", "debug_code": code}

@router.post("/otp/verify", response_model=TokenOut)
def verify(payload: OTPVerify, db: Session=Depends(get_db)):
    otp = db.query(OTPCode).filter(OTPCode.phone==payload.phone).first()
    if not otp: raise HTTPException(400,"OTP not found")
    if datetime.utcnow()>otp.expires_at: raise HTTPException(400,"OTP expired")
    if otp.attempts>=settings.otp_max_attempts: raise HTTPException(429,"Too many attempts")
    otp.attempts += 1
    db.add(otp); db.commit()
    if not pwd.verify(payload.code, otp.code_hash):
        log_event("otp_failed", phone=payload.phone)
        raise HTTPException(400,"Invalid code")
    user = db.query(User).filter(User.phone==payload.phone).first()
    if not user:
        user = User(phone=payload.phone, role="user")
        db.add(user); db.commit(); db.refresh(user)
    db.query(OTPCode).filter(OTPCode.phone==payload.phone).delete()
    db.commit()
    log_event("login_success", phone=user.phone, role=user.role)
    return issue_tokens(db, user)

@router.post("/refresh", response_model=TokenOut)
def refresh(payload: RefreshIn, db: Session=Depends(get_db)):
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("typ")!="refresh":
        raise HTTPException(401,"Invalid refresh token")
    phone = decoded.get("sub"); jti = decoded.get("jti")
    user = db.query(User).filter(User.phone==phone).first()
    if not user: raise HTTPException(401,"User not found")
    rt = db.query(RefreshToken).filter(RefreshToken.jti==jti, RefreshToken.user_id==user.id).first()
    if not rt or rt.revoked or datetime.utcnow()>rt.expires_at:
        raise HTTPException(401,"Refresh token revoked/expired")
    if settings.jwt_refresh_rotate:
        rt.revoked=True
        db.add(rt); db.commit()
    log_event("token_refreshed", phone=user.phone)
    return issue_tokens(db, user)

@router.post("/logout")
def logout(payload: LogoutIn, db: Session=Depends(get_db)):
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("typ")!="refresh":
        raise HTTPException(400,"Invalid token")
    rt = db.query(RefreshToken).filter(RefreshToken.jti==decoded.get("jti")).first()
    if rt:
        rt.revoked=True
        db.add(rt); db.commit()
    return {"ok": True}
