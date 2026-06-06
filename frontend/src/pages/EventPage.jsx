import { useState, useEffect } from 'react';
import axios from 'axios';
import GuestList from '../components/GuestList';
import ExpenseSection from '../components/ExpenseSection';

const API_BASE = 'http://localhost:8000';

function EventPage({ eventName, eventId }) {
  const [summary, setSummary] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/events/${eventId}/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [eventId]);

  return (
    <div className="event-page">
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>{eventName}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage guests and expenses for your {eventName}</p>
        </div>
        {summary && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              ₹{summary.expense_total.toLocaleString()}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Total Cost</div>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <ExpenseSection eventId={eventId} onUpdate={fetchSummary} summary={summary} />
        <GuestList eventId={eventId} onUpdate={fetchSummary} />
      </div>
    </div>
  );
}

export default EventPage;
