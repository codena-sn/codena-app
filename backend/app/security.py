from datetime import datetime, timedelta
from jose import jwt, JWTError
from .config import settings
ALGO="HS256"
def create_token(sub: str, token_type: str, jti: str, expires_delta: timedelta):
    return jwt.encode({"sub":sub,"typ":token_type,"jti":jti,"exp":datetime.utcnow()+expires_delta,"iat":datetime.utcnow()},
                      settings.jwt_secret, algorithm=ALGO)
def decode_token(token: str):
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[ALGO])
    except JWTError:
        return None
