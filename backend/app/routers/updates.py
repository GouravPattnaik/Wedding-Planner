"""
Router for Important Updates.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.db import get_db
from backend.app.models import Update
from backend.app.schemas import UpdateCreate, UpdateResponse

router = APIRouter()

@router.get("/updates", response_model=List[UpdateResponse])
def list_updates(db: Session = Depends(get_db)):
    # Order by date descending, or created_at
    updates = db.query(Update).order_by(Update.date.desc()).all()
    return updates

@router.post("/updates", response_model=UpdateResponse, status_code=201)
def create_update(data: UpdateCreate, db: Session = Depends(get_db)):
    update_item = Update(content=data.content, date=data.date)
    db.add(update_item)
    db.commit()
    db.refresh(update_item)
    return update_item

@router.delete("/updates/{update_id}", status_code=204)
def delete_update(update_id: int, db: Session = Depends(get_db)):
    update_item = db.query(Update).filter(Update.id == update_id).first()
    if not update_item:
        raise HTTPException(status_code=404, detail="Update not found")
    db.delete(update_item)
    db.commit()
    return None
