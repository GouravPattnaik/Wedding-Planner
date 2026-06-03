Simple Wedding Planner (V1) - Backend Summary
Goal

A simple wedding planning application where you can manage:

Engagement
Wedding
Reception

For each event:

Guest List
Expenses
Expense Attachments (optional)
Event Summary
Tech Stack
Backend
FastAPI
SQLAlchemy
SQLite (initially)
uv
Future
PostgreSQL
Docker
Flutter Mobile App
MCP Server
Ollama
Database Design
1. Wedding

Represents a complete wedding.

Example:

My Wedding
2. Events

Each wedding contains:

Engagement
Wedding
Reception

Table:

events
------
id
wedding_id
name
created_at
3. Guests

Guests belong to an event.

Table:

guests
------
id
event_id
name
phone
email
created_at

Examples:

John
Rahul
Priya
4. Expenses

Expenses belong to an event.

Table:

expenses
--------
id
event_id
title
amount
note
attachment_path
created_at

Examples:

Venue Booking
Catering Advance
Photography
Wedding Dress

Attachment examples:

Invoice PDF
Vendor Quotation
Receipt Image
Contract
APIs
Events
GET /events
GET /events/{event_id}
Guests
GET    /events/{event_id}/guests
POST   /events/{event_id}/guests
PUT    /guests/{guest_id}
DELETE /guests/{guest_id}
Expenses
GET    /events/{event_id}/expenses
POST   /events/{event_id}/expenses
PUT    /expenses/{expense_id}
DELETE /expenses/{expense_id}

Expense creation supports:

title
amount
note
attachment (optional)
Summary
GET /events/{event_id}/summary

Returns:

{
  "event_name": "Wedding",
  "guest_count": 120,
  "expense_total": 185000
}
Flutter Screens (V1)
Home Screen
My Wedding

Cards:

Engagement
Wedding
Reception
Event Screen

Example:

Wedding

Tabs:

Guests
Expenses
Summary
Guests Tab
+ Add Guest

Fields:

Name
Phone
Email
Expenses Tab
+ Add Expense

Fields:

Title
Amount
Note
Attachment (Optional)
Summary Tab

Shows:

Total Guests
Total Expenses
Future Features (Not in V1)
Expense Tags (Food, Attire, Decor, Travel)
Vendor Management
Budget Tracking
Payment Tracking
AI Suggestions using Ollama
MCP Server access
Shared access for family members
PostgreSQL migration
Docker deployment
V1 Milestone

Build a working backend with:

✅ Wedding
✅ Engagement / Wedding / Reception events
✅ Guest CRUD
✅ Expense CRUD
✅ Expense Attachments
✅ Event Summary
✅ Swagger API testing

Once this works in Swagger (/docs), connect a Flutter app to it.