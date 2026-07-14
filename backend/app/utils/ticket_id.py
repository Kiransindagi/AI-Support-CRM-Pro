from sqlalchemy.orm import Session
from app.models.ticket import Ticket

def generate_ticket_id(db: Session) -> str:
    # Gets the latest ticket and generates the next ID
    last_ticket = db.query(Ticket).order_by(Ticket.id.desc()).first()
    
    if not last_ticket:
        return "TKT-0001"
        
    last_id_str = last_ticket.ticket_id
    try:
        # Assumes format TKT-XXXX
        last_num = int(last_id_str.split("-")[1])
        next_num = last_num + 1
    except (IndexError, ValueError):
        # Fallback if something is wrong with the format
        next_num = 1
        
    return f"TKT-{next_num:04d}"
