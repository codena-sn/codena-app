from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from collections import defaultdict
import random
from ..db import get_db
from ..models import Question, MockExam, User
from ..schemas import MockStartIn, MockStartOut, MockSubmitIn, ScoreOut, QuestionOut
from ..deps import get_current_user

router = APIRouter(prefix="/exams", tags=["exams"])

def compute_readiness(score: int, breakdown: dict):
    readiness = int(score*0.8)
    weak=[t for t,v in breakdown.items() if v<60]
    recos=[f"Revoir : {t}" for t in weak[:3]] if weak else ["Consolider : examens blancs"]
    return max(0,min(100,readiness)), recos

@router.post("/mock/start", response_model=MockStartOut)
def start(payload: MockStartIn, db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    q=db.query(Question).filter(Question.status=="published")
    if payload.themes: q=q.filter(Question.theme.in_(payload.themes))
    pool=q.all()
    if len(pool)<payload.size: raise HTTPException(400,"Not enough questions")
    picked=random.sample(pool, payload.size)
    me=MockExam(user_id=user.id, question_ids=[p.id for p in picked])
    db.add(me); db.commit(); db.refresh(me)
    qs=[QuestionOut(id=p.id, theme=p.theme, difficulty=p.difficulty, stem=p.stem, media_url=p.media_url, choices=p.choices) for p in picked]
    return {"mock_exam_id": me.id, "questions": qs}

@router.post("/mock/{mock_exam_id}/submit", response_model=ScoreOut)
def submit(mock_exam_id: int, payload: MockSubmitIn, db: Session=Depends(get_db), user: User=Depends(get_current_user)):
    me=db.query(MockExam).filter(MockExam.id==mock_exam_id, MockExam.user_id==user.id).first()
    if not me: raise HTTPException(404,"Mock exam not found")
    questions=db.query(Question).filter(Question.id.in_(me.question_ids)).all()
    qmap={q.id:q for q in questions}
    correct=0
    per_total=defaultdict(int); per_ok=defaultdict(int)
    for qid,choice in payload.answers.items():
        q=qmap.get(int(qid))
        if not q: continue
        ok=(choice==q.answer)
        correct += 1 if ok else 0
        per_total[q.theme]+=1
        per_ok[q.theme]+=1 if ok else 0
    total=max(1,len(me.question_ids))
    score=int(100*correct/total)
    breakdown={t:(100*per_ok[t]/per_total[t]) for t in per_total}
    readiness, recos = compute_readiness(score, breakdown)
    me.score=score; me.duration_sec=payload.duration_sec; me.breakdown=breakdown
    db.add(me); db.commit()
    return {"score":score,"readiness":readiness,"recommendation":recos,"breakdown":breakdown}
