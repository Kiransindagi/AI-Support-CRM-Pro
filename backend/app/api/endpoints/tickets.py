from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, TicketListResponse
from app.crud import ticket as crud_ticket
from app.api.deps import get_current_user
from app.models.user import User
from app.services.ai_service import analyze_ticket

router = APIRouter()

@router.post("/", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    ticket_in: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ai_result = await analyze_ticket(ticket_in.subject, ticket_in.description)
    return crud_ticket.create_ticket(db=db, ticket=ticket_in, ai_result=ai_result)

@router.get("/", response_model=List[TicketListResponse])
def list_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search term for ID, name, email, subject, or description"),
    status: Optional[str] = Query(None, description="Filter by exact status (e.g., Open, Closed)"),
    assigned_to_me: Optional[bool] = Query(False, description="Filter to only tickets assigned to the current user"),
    sort_by: Optional[str] = Query("created_at", description="Field to sort by"),
    sort_desc: bool = Query(True, description="Sort descending (true) or ascending (false)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assigned_to_id = current_user.id if assigned_to_me else None
    return crud_ticket.get_tickets(
        db=db, skip=skip, limit=limit, search=search, status=status, assigned_to_id=assigned_to_id, sort_by=sort_by, sort_desc=sort_desc
    )

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = crud_ticket.get_ticket(db=db, ticket_id=ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_in: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = crud_ticket.get_ticket(db=db, ticket_id=ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    updated_ticket = crud_ticket.update_ticket(db=db, db_ticket=ticket, ticket_update=ticket_in)
    return updated_ticket
