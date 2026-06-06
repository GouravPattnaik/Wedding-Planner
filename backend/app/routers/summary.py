"""
Router for Event Summary endpoint.
Returns event_name, guest_count, and expense_total.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.db import get_db
from backend.app.models import Event, Guest, Expense
from backend.app.schemas import EventSummary

router = APIRouter()


@router.get("/events/{event_id}/summary", response_model=EventSummary)
def get_event_summary(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    guest_count = db.query(func.sum(Guest.total_members)).filter(Guest.event_id == event_id).scalar() or 0
    expense_total = db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(Expense.event_id == event_id).scalar() or 0.0

    # Aggregate by tag
    expenses_by_tag_query = db.query(
        func.coalesce(Expense.tag, 'Untagged').label('tag'),
        func.sum(Expense.amount).label('total')
    ).filter(Expense.event_id == event_id).group_by(func.coalesce(Expense.tag, 'Untagged')).all()
    
    expenses_by_tag = {row.tag: float(row.total) for row in expenses_by_tag_query}

    return EventSummary(
        event_name=event.name,
        guest_count=guest_count,
        expense_total=float(expense_total),
        expenses_by_tag=expenses_by_tag
    )