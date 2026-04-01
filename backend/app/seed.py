from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .db import SessionLocal, engine
from .models import Base, User, Lesson, Question, Center, Slot
from .config import settings

def seed(db: Session):
    if db.query(Lesson).first():
        return
    if not db.query(User).filter(User.phone==settings.admin_phone).first():
        db.add(User(phone=settings.admin_phone, email=settings.admin_email, role="admin", city="Dakar"))
    db.add_all([
        Lesson(title="Priorités à droite", chapter="Priorités", content_md="## Règle\nPriorité à droite sauf signalisation.", reading_time_min=4),
        Lesson(title="Cédez le passage", chapter="Signalisation", content_md="## Panneau\nTriangle inversé : cédez le passage.", reading_time_min=5),
        Lesson(title="Distances de sécurité", chapter="Sécurité", content_md="## Conseils\nAdapter la distance selon la situation.", reading_time_min=6),
    ])
    db.add_all([
        Question(theme="Priorités", difficulty=1, stem="À une intersection sans panneau, qui a la priorité ?", choices={"A":"Vous","B":"La voiture de gauche","C":"La voiture de droite"}, answer="C", explanation="Priorité à droite."),
        Question(theme="Signalisation", difficulty=1, stem="Le triangle inversé indique :", choices={"A":"Stop","B":"Cédez le passage","C":"Interdiction"}, answer="B", explanation="Cédez le passage."),
        Question(theme="Sécurité", difficulty=1, stem="Sous la pluie, la distance de sécurité doit :", choices={"A":"Diminuer","B":"Rester identique","C":"Augmenter"}, answer="C", explanation="Distance de freinage plus longue."),
    ])
    centers=[Center(name="Centre Dakar Plateau", city="Dakar", lat=14.67, lng=-17.44, instructions="Pièce d'identité obligatoire."),
             Center(name="Centre Thiès", city="Thiès", lat=14.79, lng=-16.92, instructions="Arriver 15 min avant.")]
    db.add_all(centers); db.flush()
    now=datetime.utcnow().replace(minute=0,second=0,microsecond=0)
    slots=[]
    for c in centers:
        for d in range(1,8):
            slots.append(Slot(center_id=c.id, dt_utc=now+timedelta(days=d, hours=9)))
            slots.append(Slot(center_id=c.id, dt_utc=now+timedelta(days=d, hours=11)))
    db.add_all(slots)

def main():
    Base.metadata.create_all(bind=engine)
    db=SessionLocal()
    try:
        seed(db); db.commit()
    finally:
        db.close()
if __name__=="__main__": main()
