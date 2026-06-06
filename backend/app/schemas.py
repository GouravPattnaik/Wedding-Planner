"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel


# ---------- Wedding ----------
class WeddingBase(BaseModel):
    name: str


class WeddingCreate(WeddingBase):
    pass


class WeddingResponse(WeddingBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Event ----------
class EventBase(BaseModel):
    wedding_id: int
    name: str


class EventCreate(EventBase):
    pass


class EventResponse(EventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class EventWithWedding(EventResponse):
    wedding: Optional[WeddingResponse] = None


# ---------- Guest ----------
class GuestBase(BaseModel):
    family_name: str
    total_members: int = 1
    attending_members: int = 1
    rsvp_status: bool = False
    is_coming: bool = False
    phone: Optional[str] = None
    email: Optional[str] = None


class GuestCreate(GuestBase):
    pass


class GuestUpdate(BaseModel):
    family_name: Optional[str] = None
    total_members: Optional[int] = None
    attending_members: Optional[int] = None
    rsvp_status: Optional[bool] = None
    is_coming: Optional[bool] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class GuestResponse(GuestBase):
    id: int
    event_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Expense ----------
class ExpenseBase(BaseModel):
    title: str
    amount: float
    tag: Optional[str] = None
    is_fully_paid: bool = False
    amount_remaining: Optional[float] = None
    payment_date: Optional[date] = None
    note: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    tag: Optional[str] = None
    is_fully_paid: Optional[bool] = None
    amount_remaining: Optional[float] = None
    payment_date: Optional[date] = None
    note: Optional[str] = None


class ExpenseResponse(ExpenseBase):
    id: int
    event_id: int
    attachment_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Summary ----------
class EventSummary(BaseModel):
    event_name: str
    guest_count: int
    expense_total: float
    expenses_by_tag: dict[str, float] = {}