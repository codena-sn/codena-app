from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .db import get_db
from .security import decode_token
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/otp/verify")

def get_current_user(token: str=Depends(oauth2_scheme), db: Session=Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload or payload.get("typ")!="access":
        raise HTTPException(401,"Invalid token")
    user = db.query(User).filter(User.phone==payload.get("sub")).first()
    if not user or not user.is_active:
        raise HTTPException(401,"User not found")
    return user

def require_role(*roles: str):
    def guard(user: User=Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(403,"Forbidden")
        return user
    return guard
