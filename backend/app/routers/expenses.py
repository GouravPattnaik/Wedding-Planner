"""
Router for Expense endpoints with optional attachment uploads.
"""

import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from backend.app.db import get_db
from backend.app.models import Event, Expense
from backend.app.schemas import ExpenseResponse, ExpenseUpdate

router = APIRouter()

# Upload directory for expense attachments
UPLOAD_DIR = Path(__file__).parent.parent.parent.parent / "data" / "uploads" / "attachments"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/events/{event_id}/expenses", response_model=List[ExpenseResponse])
def list_expenses(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event.expenses


@router.post("/events/{event_id}/expenses", response_model=ExpenseResponse, status_code=201)
async def create_expense(
    event_id: int,
    title: str = Form(...),
    amount: float = Form(...),
    tag: Optional[str] = Form(None),
    is_fully_paid: bool = Form(False),
    amount_remaining: Optional[float] = Form(None),
    payment_date: Optional[date] = Form(None),
    note: Optional[str] = Form(None),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    attachment_path = None
    if attachment and attachment.filename:
        # Save attachment to disk
        ext = Path(attachment.filename).suffix
        unique_name = f"{uuid.uuid4()}{ext}"
        file_path = UPLOAD_DIR / unique_name
        with open(file_path, "wb") as f:
            content = await attachment.read()
            f.write(content)
        attachment_path = str(file_path)

    expense = Expense(
        event_id=event_id,
        title=title,
        amount=amount,
        tag=tag,
        is_fully_paid=is_fully_paid,
        amount_remaining=amount_remaining,
        payment_date=payment_date,
        note=note,
        attachment_path=attachment_path,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, data: ExpenseUpdate, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if data.title is not None:
        expense.title = data.title
    if data.amount is not None:
        expense.amount = data.amount
    if data.tag is not None:
        expense.tag = data.tag
    if data.is_fully_paid is not None:
        expense.is_fully_paid = data.is_fully_paid
    if data.amount_remaining is not None:
        expense.amount_remaining = data.amount_remaining
    if data.payment_date is not None:
        expense.payment_date = data.payment_date
    if data.note is not None:
        expense.note = data.note
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    # Remove attachment file if it exists
    if expense.attachment_path and Path(expense.attachment_path).exists():
        try:
            Path(expense.attachment_path).unlink()
        except OSError:
            pass
    db.delete(expense)
    db.commit()
    return None