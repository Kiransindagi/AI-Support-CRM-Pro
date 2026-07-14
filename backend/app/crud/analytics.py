from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.ticket import Ticket

def get_analytics_summary(db: Session) -> dict:
    total_tickets = db.query(func.count(Ticket.id)).scalar()
    
    # Status breakdown
    open_tickets = db.query(func.count(Ticket.id)).filter(Ticket.status == 'Open').scalar()
    in_progress = db.query(func.count(Ticket.id)).filter(Ticket.status == 'In Progress').scalar()
    resolved = db.query(func.count(Ticket.id)).filter(Ticket.status == 'Resolved').scalar()
    closed = db.query(func.count(Ticket.id)).filter(Ticket.status == 'Closed').scalar()
    
    # Sentiment distribution
    sentiment_data = db.query(Ticket.sentiment, func.count(Ticket.id)).group_by(Ticket.sentiment).all()
    sentiment_breakdown = {s: c for s, c in sentiment_data if s}
    
    # Category distribution
    category_data = db.query(Ticket.category, func.count(Ticket.id)).group_by(Ticket.category).all()
    category_breakdown = {c: count for c, count in category_data if c}
    
    return {
        "overview": {
            "total": total_tickets,
            "open": open_tickets,
            "in_progress": in_progress,
            "resolved": resolved,
            "closed": closed
        },
        "sentiments": sentiment_breakdown,
        "categories": category_breakdown
    }
