"""
Router for Wedding and Event endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.db import get_db
from backend.app.models import Wedding, Event
from backend.app.schemas import WeddingCreate, WeddingResponse, EventCreate, EventResponse

router = APIRouter()


# ---------- Weddings ----------
@router.get("/weddings", response_model=List[WeddingResponse])
def list_weddings(db: Session = Depends(get_db)):
    weddings = db.query(Wedding).all()
    return weddings


@router.post("/weddings", response_model=WeddingResponse, status_code=201)
def create_wedding(data: WeddingCreate, db: Session = Depends(get_db)):
    wedding = Wedding(name=data.name)
    db.add(wedding)
    db.commit()
    db.refresh(wedding)
    return wedding


@router.get("/weddings/{wedding_id}", response_model=WeddingResponse)
def get_wedding(wedding_id: int, db: Session = Depends(get_db)):
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    return wedding


# ---------- Events ----------
@router.get("/events", response_model=List[EventResponse])
def list_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return events


@router.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/events", response_model=EventResponse, status_code=201)
def create_event(data: EventCreate, db: Session = Depends(get_db)):
    # Verify wedding exists
    wedding = db.query(Wedding).filter(Wedding.id == data.wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")
    event = Event(wedding_id=data.wedding_id, name=data.name)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.put("/events/{event_id}", response_model=EventResponse)
def update_event(event_id: int, data: __import__('backend.app.schemas', fromlist=['EventUpdate']).EventUpdate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if data.name is not None:
        event.name = data.name
    if data.event_date is not None:
        event.event_date = data.event_date
        
    db.commit()
    db.refresh(event)
    return event