from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import Lesson, Question
from ..schemas import LessonOut, LessonCreate, QuestionOut, QuestionCreate
from ..deps import require_role

router = APIRouter(prefix="/content", tags=["content"])

@router.get("/lessons", response_model=List[LessonOut])
def lessons(chapter: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Lesson).filter(Lesson.status=="published")
    if chapter: q=q.filter(Lesson.chapter==chapter)
    return q.order_by(Lesson.id.asc()).all()

@router.get("/lessons")
def lessons(chapter: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Lesson)
    if chapter:
        q = q.filter(Lesson.chapter == chapter)
    return q.all()


@router.get("/questions")
def questions(theme: Optional[str] = None, limit: int = 20, db: Session = Depends(get_db)):
    q = db.query(Question).limit(limit)
    if theme:
        q = q.filter(Question.theme == theme)
    return q.all()

@router.post("/admin/lessons", response_model=LessonOut, dependencies=[Depends(require_role("admin"))])
def create_lesson(payload: LessonCreate, db: Session=Depends(get_db)):
    l = Lesson(**payload.model_dump())
    db.add(l); db.commit(); db.refresh(l)
    return l

@router.put("/admin/lessons/{lesson_id}", response_model=LessonOut, dependencies=[Depends(require_role("admin"))])
def update_lesson(lesson_id: int, payload: LessonCreate, db: Session = Depends(get_db)):
    l = db.query(Lesson).filter(Lesson.id==lesson_id).first()
    if not l: raise HTTPException(404,"Not found")
    for k,v in payload.model_dump().items(): setattr(l,k,v)
    db.add(l); db.commit(); db.refresh(l)
    return l

@router.delete("/admin/lessons/{lesson_id}", dependencies=[Depends(require_role("admin"))])
def delete_lesson(lesson_id: int, db: Session=Depends(get_db)):
    l = db.query(Lesson).filter(Lesson.id==lesson_id).first()
    if not l: raise HTTPException(404,"Not found")
    l.status="archived"
    db.add(l); db.commit()
    return {"ok": True}

@router.post("/admin/questions", response_model=QuestionOut, dependencies=[Depends(require_role("admin"))])
def create_question(payload: QuestionCreate, db: Session=Depends(get_db)):
    q = Question(**payload.model_dump())
    db.add(q); db.commit(); db.refresh(q)
    return QuestionOut(id=q.id, theme=q.theme, difficulty=q.difficulty, stem=q.stem, media_url=q.media_url, choices=q.choices, explanation=q.explanation)

@router.put("/admin/questions/{question_id}", response_model=QuestionOut, dependencies=[Depends(require_role("admin"))])
def update_question(question_id: int, payload: QuestionCreate, db: Session=Depends(get_db)):
    q = db.query(Question).filter(Question.id==question_id).first()
    if not q: raise HTTPException(404,"Not found")
    for k,v in payload.model_dump().items(): setattr(q,k,v)
    db.add(q); db.commit(); db.refresh(q)
    return QuestionOut(id=q.id, theme=q.theme, difficulty=q.difficulty, stem=q.stem, media_url=q.media_url, choices=q.choices, explanation=q.explanation)

@router.delete("/admin/questions/{question_id}", dependencies=[Depends(require_role("admin"))])
def delete_question(question_id: int, db: Session=Depends(get_db)):
    q = db.query(Question).filter(Question.id==question_id).first()
    if not q: raise HTTPException(404,"Not found")
    q.status="archived"
    db.add(q); db.commit()
    return {"ok": True}
