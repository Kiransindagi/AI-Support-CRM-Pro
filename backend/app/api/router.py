from fastapi import APIRouter
from app.api.endpoints import tickets, notes, auth, analytics, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(notes.router, prefix="/tickets", tags=["notes"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
