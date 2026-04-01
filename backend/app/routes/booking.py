from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
from ..db import get_db
from ..models import Center, Slot, Booking, User
from ..schemas import BookingIn, BookingOut
from ..deps import get_current_user
from ..tickets import generate_ticket_pdf

router=APIRouter(prefix="/booking", tags=["booking"])

@router.get("/centers")
def centers(db: Session=Depends(get_db)):
    return db.query(Center).order_by(Center.city.asc()).all()

@router.get("/centers/{center_id}/slots")
def slots(center_id: int, db: Session=Depends(get_db)):
    items=db.query(Slot).filter(Slot.center_id==center_id).order_by(Slot.dt_utc.asc()).all()
    return [{"id":s.id,"center_id":s.center_id,"dt_utc":s.dt_utc.isoformat()+"Z","capacity":s.capacity,"booked":s.booked} for s in items]

@router.post("/reserve", response_model=BookingOut)
def reserve(payload: BookingIn, db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    slot=db.query(Slot).filter(Slot.id==payload.slot_id).first()
    if not slot: raise HTTPException(404,"Slot not found")
    if slot.booked>=slot.capacity: raise HTTPException(400,"Slot full")
    slot.booked += 1
    booking=Booking(user_id=user.id, slot_id=slot.id, status="confirmed")
    db.add(slot); db.add(booking); db.commit(); db.refresh(booking)
    center=db.query(Center).filter(Center.id==slot.center_id).first()
    code=f"CDN-{booking.id:06d}"
    booking.pdf_path=generate_ticket_pdf(code, center.name, slot.dt_utc.isoformat()+"Z", user.phone)
    booking.qr_data=code
    db.add(booking); db.commit()
    return {"booking_id":booking.id,"status":booking.status,"pdf_url":f"/booking/tickets/{code}.pdf","qr_data":code}

@router.get("/tickets/{code}.pdf")
def ticket(code: str):
    p=Path("/app/app/generated")/f"{code}.pdf"
    if not p.exists(): raise HTTPException(404,"Ticket not found")
    return FileResponse(str(p), media_type="application/pdf", filename=f"{code}.pdf")
