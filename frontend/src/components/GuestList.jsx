import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function GuestList({ eventId, onUpdate }) {
  const [guests, setGuests] = useState([]);
  const [formData, setFormData] = useState({
    family_name: '', total_members: 1, attending_members: 1, rsvp_status: false, is_coming: false
  });

  const fetchGuests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/events/${eventId}/guests`);
      setGuests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/events/${eventId}/guests`, {
        ...formData,
        total_members: parseInt(formData.total_members) || 1,
        attending_members: parseInt(formData.attending_members) || 1
      });
      setFormData({ family_name: '', total_members: 1, attending_members: 1, rsvp_status: false, is_coming: false });
      fetchGuests();
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Guest List</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Family Name</label>
          <input className="form-control" name="family_name" value={formData.family_name} onChange={handleChange} required placeholder="e.g. Smith Family" />
        </div>
        <div className="form-group">
          <label>Total Members</label>
          <input className="form-control" type="number" min="1" name="total_members" value={formData.total_members} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Attending Members</label>
          <input className="form-control" type="number" min="0" name="attending_members" value={formData.attending_members} onChange={handleChange} required />
        </div>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <input type="checkbox" name="rsvp_status" checked={formData.rsvp_status} onChange={handleChange} id="rsvpCheck" />
          <label htmlFor="rsvpCheck" style={{ margin: 0 }}>RSVP Received?</label>
        </div>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <input type="checkbox" name="is_coming" checked={formData.is_coming} onChange={handleChange} id="comingCheck" />
          <label htmlFor="comingCheck" style={{ margin: 0 }}>Are they coming?</label>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary">Add Family</button>
        </div>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Family Name</th>
              <th>Total</th>
              <th>Attending</th>
              <th>RSVP</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {guests.map(guest => (
              <tr key={guest.id}>
                <td style={{ fontWeight: 500 }}>{guest.family_name}</td>
                <td>{guest.total_members}</td>
                <td>{guest.attending_members}</td>
                <td>
                  {guest.rsvp_status ? 
                    <span className="badge badge-success">Yes</span> : 
                    <span className="badge badge-warning">No</span>
                  }
                </td>
                <td>
                  {guest.is_coming ? 
                    <span className="badge badge-success">Coming</span> : 
                    <span className="badge badge-danger">Not Coming</span>
                  }
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No guests added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GuestList;
