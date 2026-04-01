from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from .config import settings
from .routes import auth, content, exams, booking, payments, admin, media

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Codéna API", version="0.3.0")
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if settings.cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse({"detail":"Rate limit exceeded"}, status_code=429)

@app.get("/health")
@limiter.limit(settings.rate_limit_general)
def health(request: Request):
    return {"status":"ok"}

app.include_router(auth.router)
app.include_router(content.router)
app.include_router(exams.router)
app.include_router(booking.router)
app.include_router(payments.router)
app.include_router(admin.router)
app.include_router(media.router)
