from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import MeOut, MeUpdate
from ..logging import log_event

router = APIRouter(prefix="/me", tags=["profile"])


def _me_out(user: User) -> MeOut:
    return MeOut(
        id=user.id,
        phone=user.phone,
        first_name=user.first_name,
        email=user.email,
        city=user.city,
        language=user.language,
        exam_goal=user.exam_goal,
        referral_source=user.referral_source,
        marketing_consent=bool(user.marketing_consent),
        profile_completed=user.profile_completed_at is not None,
        created_at=user.created_at,
    )


@router.get("", response_model=MeOut)
def get_me(user: User = Depends(get_current_user)):
    return _me_out(user)


@router.patch("", response_model=MeOut)
def update_me(payload: MeUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    data = payload.model_dump(exclude_unset=True)

    for field in ("first_name", "email", "city", "language", "exam_goal", "referral_source"):
        if field in data and data[field] is not None:
            value = str(data[field]).strip()
            setattr(user, field, value or None)

    if "marketing_consent" in data and data["marketing_consent"] is not None:
        user.marketing_consent = bool(data["marketing_consent"])
        user.marketing_consent_at = datetime.utcnow()

    # Profil considéré complet dès qu'on a prénom + ville.
    if user.first_name and user.city and user.profile_completed_at is None:
        user.profile_completed_at = datetime.utcnow()

    db.add(user)
    db.commit()
    db.refresh(user)
    log_event("profile_updated", phone=user.phone, completed=user.profile_completed_at is not None)
    return _me_out(user)
