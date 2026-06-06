"""
Router for Guest endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.db import get_db
from backend.app.models import Event, Guest
from backend.app.schemas import GuestCreate, GuestUpdate, GuestResponse

router = APIRouter()


@router.get("/events/{event_id}/guests", response_model=List[GuestResponse])
def list_guests(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event.guests


@router.post("/events/{event_id}/guests", response_model=GuestResponse, status_code=201)
def create_guest(event_id: int, data: GuestCreate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    guest = Guest(
        event_id=event_id, 
        family_name=data.family_name, 
        total_members=data.total_members,
        attending_members=data.attending_members,
        rsvp_status=data.rsvp_status,
        is_coming=data.is_coming,
        phone=data.phone, 
        email=data.email
    )
    db.add(guest)
    db.commit()
    db.refresh(guest)
    return guest


@router.put("/guests/{guest_id}", response_model=GuestResponse)
def update_guest(guest_id: int, data: GuestUpdate, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    if data.family_name is not None:
        guest.family_name = data.family_name
    if data.total_members is not None:
        guest.total_members = data.total_members
    if data.attending_members is not None:
        guest.attending_members = data.attending_members
    if data.rsvp_status is not None:
        guest.rsvp_status = data.rsvp_status
    if data.is_coming is not None:
        guest.is_coming = data.is_coming
    if data.phone is not None:
        guest.phone = data.phone
    if data.email is not None:
        guest.email = data.email
    db.commit()
    db.refresh(guest)
    return guest


@router.delete("/guests/{guest_id}", status_code=204)
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    db.delete(guest)
    db.commit()
    return None