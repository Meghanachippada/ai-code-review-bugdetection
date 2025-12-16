# server-python/routes/sessions.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from pydantic import BaseModel
from database import get_db
from models import ReviewSession, User
from auth import get_current_user

router = APIRouter(prefix="/sessions", tags=["Sessions"])

# ---------- Pydantic Schemas ----------
class SessionCreate(BaseModel):
    language: str
    snippet: str
    issues: list


class SessionOut(BaseModel):
    id: int
    language: str
    snippet: str
    issues: list
    ts: datetime

    class Config:
        orm_mode = True


# ---------- Routes ----------

@router.post("/", response_model=SessionOut)
def create_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new code review session linked to logged-in user"""
    try:
        new_session = ReviewSession(
            language=session_data.language,
            snippet=session_data.snippet,
            issues=session_data.issues,
            user_id=current_user.id,
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        return new_session
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {e}")


@router.get("/", response_model=List[SessionOut])
def get_user_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all code review sessions of the logged-in user"""
    sessions = (
        db.query(ReviewSession)
        .filter(ReviewSession.user_id == current_user.id)
        .order_by(ReviewSession.ts.desc())
        .all()
    )
    return sessions


# ---------- NEW FIXED ROUTE ----------
@router.get("/{session_id}", response_model=SessionOut)
def get_single_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch one code review session by ID (no user check, backward compatible)."""

    session = db.query(ReviewSession).filter(ReviewSession.id == session_id).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return session

# -------------------------------------


@router.delete("/{session_id}")
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a specific session belonging to the user"""
    session = (
        db.query(ReviewSession)
        .filter(ReviewSession.id == session_id, ReviewSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    db.delete(session)
    db.commit()
    return {"message": "✅ Session deleted successfully"}
