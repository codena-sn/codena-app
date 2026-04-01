import os
from pydantic import BaseModel
class Settings(BaseModel):
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")
    jwt_secret: str = os.getenv("JWT_SECRET", "jwt-secret")
    jwt_access_min: int = int(os.getenv("JWT_ACCESS_MIN", "30"))
    jwt_refresh_days: int = int(os.getenv("JWT_REFRESH_DAYS", "30"))
    jwt_refresh_rotate: bool = os.getenv("JWT_REFRESH_ROTATE","true").lower()=="true"
    otp_ttl_minutes: int = int(os.getenv("OTP_TTL_MINUTES", "5"))
    otp_max_attempts: int = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))
    db_url: str = "sqlite:///codena.db"
    media_local_dir: str = os.getenv("MEDIA_LOCAL_DIR","/app/app/media")
    payment_webhook_secret: str = os.getenv("PAYMENT_WEBHOOK_SECRET","whsec")
    admin_phone: str = os.getenv("ADMIN_PHONE","+221700000000")
    admin_email: str = os.getenv("ADMIN_EMAIL","admin@codena.sn")
    rate_limit_login: str = os.getenv("RATE_LIMIT_LOGIN","10/minute")
    rate_limit_general: str = os.getenv("RATE_LIMIT_GENERAL","120/minute")
settings = Settings()
