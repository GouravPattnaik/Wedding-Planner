"""
SQLAlchemy models for Wedding Planner V1.

Models:
- Wedding: Top-level wedding (e.g., "My Wedding")
- Event: Events within a wedding (Engagement, Wedding, Reception)
- Guest: Guests belonging to an event
- Expense: Expenses belonging to an event (with optional attachment)
"""

import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db import Base


class Wedding(Base):
    __tablename__ = "weddings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    events = relationship("Event", back_populates="wedding", cascade="all, delete-orphan")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    name = Column(String(255), nullable=False)  # e.g., "Engagement", "Wedding", "Reception"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    wedding = relationship("Wedding", back_populates="events")
    guests = relationship("Guest", back_populates="event", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="event", cascade="all, delete-orphan")


class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    event = relationship("Event", back_populates="guests")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    note = Column(Text, nullable=True)
    attachment_path = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    event = relationship("Event", back_populates="expenses")