from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud.analytics import get_analytics_summary
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_analytics_summary(db)
