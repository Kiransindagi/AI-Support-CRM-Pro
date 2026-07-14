from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.note import NoteCreate, NoteResponse
from app.crud import note as crud_note
from app.crud import ticket as crud_ticket
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/{ticket_id}/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note_for_ticket(
    ticket_id: int,
    note_in: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = crud_ticket.get_ticket(db=db, ticket_id=ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return crud_note.create_note(db=db, ticket_id=ticket_id, note=note_in)

@router.get("/{ticket_id}/notes", response_model=List[NoteResponse])
def get_notes_for_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = crud_ticket.get_ticket(db=db, ticket_id=ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return crud_note.get_notes(db=db, ticket_id=ticket_id)
