import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE = 'http://localhost:8000';

function ExpenseSection({ eventId, onUpdate, summary }) {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: '', amount: '', tag: '', is_fully_paid: false, amount_remaining: '', payment_date: ''
  });

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/events/${eventId}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
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
    const data = new FormData();
    data.append('title', formData.title);
    data.append('amount', formData.amount);
    if (formData.tag) data.append('tag', formData.tag);
    data.append('is_fully_paid', formData.is_fully_paid);
    if (!formData.is_fully_paid && formData.amount_remaining) {
      data.append('amount_remaining', formData.amount_remaining);
    }
    if (formData.payment_date) data.append('payment_date', formData.payment_date);

    try {
      await axios.post(`${API_BASE}/events/${eventId}/expenses`, data);
      setFormData({ title: '', amount: '', tag: '', is_fully_paid: false, amount_remaining: '', payment_date: '' });
      fetchExpenses();
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: summary?.expenses_by_tag ? Object.keys(summary.expenses_by_tag) : [],
    datasets: [
      {
        data: summary?.expenses_by_tag ? Object.values(summary.expenses_by_tag) : [],
        backgroundColor: [
          '#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card">
      <h2 className="section-title">Expenses</h2>
      
      {summary?.expenses_by_tag && Object.keys(summary.expenses_by_tag).length > 0 && (
        <div style={{ maxWidth: '300px', margin: '0 auto 2rem auto' }}>
          <Pie data={chartData} />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Catering" />
        </div>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input className="form-control" type="number" name="amount" value={formData.amount} onChange={handleChange} required placeholder="0" />
        </div>
        <div className="form-group">
          <label>Tag</label>
          <input className="form-control" name="tag" value={formData.tag} onChange={handleChange} placeholder="e.g. Food" />
        </div>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <input type="checkbox" name="is_fully_paid" checked={formData.is_fully_paid} onChange={handleChange} id="paidCheck" />
          <label htmlFor="paidCheck" style={{ margin: 0 }}>Is Fully Paid?</label>
        </div>
        {!formData.is_fully_paid && (
          <div className="form-group">
            <label>Amount Remaining (₹)</label>
            <input className="form-control" type="number" name="amount_remaining" value={formData.amount_remaining} onChange={handleChange} placeholder="0" />
          </div>
        )}
        <div className="form-group">
          <label>Payment Date</label>
          <input className="form-control" type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary">Add Expense</button>
        </div>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Tag</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Remaining</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id}>
                <td>{exp.title}</td>
                <td><span className="badge" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>{exp.tag || 'None'}</span></td>
                <td>₹{exp.amount}</td>
                <td>
                  {exp.is_fully_paid ? 
                    <span className="badge badge-success">Paid</span> : 
                    <span className="badge badge-warning">Pending</span>
                  }
                </td>
                <td>{exp.is_fully_paid ? '-' : `₹${exp.amount_remaining || 0}`}</td>
                <td>{exp.payment_date || '-'}</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No expenses added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseSection;
