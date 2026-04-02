from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Phone(BaseModel):
    phone: str

@app.post("/auth/otp-send")
async def send_otp(phone: Phone):
    print(f"OTP pour {phone.phone}: 123456")  # Test console
    return {"status": "OTP envoyé"}

@app.post("/auth/otp-verify")
async def verify_otp(phone: Phone):
    return {"status": "OK", "token": "fake-jwt-token"}

@app.get("/test")
async def test():
    return {"status": "Backend OK"}
