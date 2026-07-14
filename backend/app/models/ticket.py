import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="Open", nullable=False)
    
    # AI-Generated Fields
    category = Column(String, default="General Inquiry")
    sentiment = Column(String, default="Neutral")
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    notes = relationship("Note", back_populates="ticket", cascade="all, delete-orphan")
    assigned_to = relationship("User", back_populates="tickets")
