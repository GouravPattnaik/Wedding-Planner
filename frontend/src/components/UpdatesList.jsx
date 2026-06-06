import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

function UpdatesList() {
  const [updates, setUpdates] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [newDate, setNewDate] = useState('');
  
  const fetchUpdates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/updates`);
      setUpdates(res.data);
    } catch (err) {
      console.error("Failed to fetch updates", err);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!newContent || !newDate) return;
    try {
      await axios.post(`${API_BASE}/updates`, {
        content: newContent,
        date: newDate
      });
      setNewContent('');
      setNewDate('');
      fetchUpdates();
    } catch (err) {
      console.error("Failed to add update", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/updates/${id}`);
      fetchUpdates();
    } catch (err) {
      console.error("Failed to delete update", err);
    }
  };

  return (
    <div className="card updates-section">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        <Calendar size={24} color="var(--primary-color)" />
        Important Updates
      </h2>

      <form onSubmit={handleAddUpdate} className="add-update-form" style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="What's happening?" 
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          required
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '0.5rem', width: '100%' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="date" 
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Add
          </button>
        </div>
      </form>

      <div className="updates-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {updates.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No updates yet.</p>
        ) : (
          updates.map((update) => (
            <div key={update.id} className="update-item" style={{ padding: '1rem', borderLeft: '4px solid var(--primary-color)', backgroundColor: 'var(--card-bg)', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
              <button 
                onClick={() => handleDelete(update.id)}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '0.25rem' }}
                title="Delete update"
              >
                <Trash2 size={16} />
              </button>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary-color)', marginBottom: '0.25rem' }}>
                {new Date(update.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <p style={{ margin: 0, fontSize: '1rem' }}>{update.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UpdatesList;
