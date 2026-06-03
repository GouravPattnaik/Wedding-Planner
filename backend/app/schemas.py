"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime
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
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None


class GuestCreate(GuestBase):
    pass


class GuestUpdate(BaseModel):
    name: Optional[str] = None
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
    note: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
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