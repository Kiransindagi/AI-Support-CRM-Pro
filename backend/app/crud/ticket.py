from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate
from app.utils.ticket_id import generate_ticket_id
from app.models.note import Note
def create_ticket(db: Session, ticket: TicketCreate, ai_result: dict) -> Ticket:
    ticket_id_str = generate_ticket_id(db)
    
    db_ticket = Ticket(
        ticket_id=ticket_id_str,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        category=ai_result["category"],
        sentiment=ai_result["sentiment"]
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_ticket(db: Session, ticket_id: int) -> Ticket:
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()

def get_tickets(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    status: str = None,
    assigned_to_id: int = None,
    sort_by: str = "created_at",
    sort_desc: bool = True
):
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if assigned_to_id is not None:
        query = query.filter(Ticket.assigned_to_id == assigned_to_id)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.ticket_id.ilike(search_filter),
                Ticket.customer_name.ilike(search_filter),
                Ticket.customer_email.ilike(search_filter),
                Ticket.subject.ilike(search_filter),
                Ticket.description.ilike(search_filter)
            )
        )

    if sort_by and hasattr(Ticket, sort_by):
        sort_column = getattr(Ticket, sort_by)
        if sort_desc:
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
    else:
        # Default sort
        query = query.order_by(Ticket.created_at.desc())

    return query.offset(skip).limit(limit).all()

def update_ticket(db: Session, db_ticket: Ticket, ticket_update: TicketUpdate) -> Ticket:
    if ticket_update.status:
        db_ticket.status = ticket_update.status
        
    if ticket_update.assigned_to_id is not None:
        db_ticket.assigned_to_id = ticket_update.assigned_to_id
        
    db.commit()
    db.refresh(db_ticket)
    
    # If there's a note, it will be handled by the route or a separate note CRUD function
    if ticket_update.note_text:
        new_note = Note(ticket_id=db_ticket.id, note_text=ticket_update.note_text)
        db.add(new_note)
        db.commit()
        
    return db_ticket
