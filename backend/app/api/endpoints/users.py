from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/agents", response_model=List[UserResponse])
def get_agents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # For now, return all users as agents
    return db.query(User).all()
