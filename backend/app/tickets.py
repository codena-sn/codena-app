from pathlib import Path
from datetime import datetime
import qrcode
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

BASE = Path("/app/app/generated")
import os
BASE = Path("tickets")  # ← Change /app par tickets
BASE.mkdir(parents=True, exist_ok=True)
def generate_ticket_pdf(booking_code: str, center_name: str, dt_utc: str, phone: str) -> str:
    qr_path = BASE / f"{booking_code}.png"
    qrcode.make(booking_code).save(qr_path)

    pdf_path = BASE / f"{booking_code}.pdf"
    c = canvas.Canvas(str(pdf_path), pagesize=A4)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, 800, "Codéna — Convocation Examen (DEMO)")
    c.setFont("Helvetica", 12)
    c.drawString(50, 770, f"Code : {booking_code}")
    c.drawString(50, 750, f"Centre : {center_name}")
    c.drawString(50, 730, f"Date/Heure (UTC) : {dt_utc}")
    c.drawString(50, 710, f"Téléphone : {phone}")
    c.drawString(50, 690, f"Généré : {datetime.utcnow().isoformat()}Z")
    c.drawImage(str(qr_path), 50, 520, width=160, height=160)
    c.showPage(); c.save()
    return str(pdf_path)
