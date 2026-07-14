from sqlalchemy.orm import Session
from app.models.note import Note
from app.models.ticket import Ticket
from app.schemas.note import NoteCreate
from datetime import datetime

def create_note(db: Session, ticket_id: int, note: NoteCreate) -> Note:
    db_note = Note(
        ticket_id=ticket_id,
        note_text=note.note_text
    )
    db.add(db_note)
    
    # Update ticket's updated_at timestamp
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if ticket:
        ticket.updated_at = datetime.utcnow()
        
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes(db: Session, ticket_id: int):
    return db.query(Note).filter(Note.ticket_id == ticket_id).all()
