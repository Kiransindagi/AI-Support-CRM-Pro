from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str

class TicketUpdate(BaseModel):
    status: Optional[str] = None
    note_text: Optional[str] = None
    assigned_to_id: Optional[int] = None

class TicketResponse(BaseModel):
    id: int
    ticket_id: str
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    status: str
    category: str
    sentiment: str
    assigned_to_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TicketListResponse(BaseModel):
    id: int
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    category: str
    sentiment: str
    assigned_to_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
