from pydantic import BaseModel
from datetime import datetime

class NoteCreate(BaseModel):
    note_text: str

class NoteResponse(BaseModel):
    id: int
    ticket_id: int
    note_text: str
    created_at: datetime

    class Config:
        from_attributes = True
