import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarHeart, Users, Receipt, IndianRupee } from 'lucide-react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import UpdatesList from '../components/UpdatesList';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE = 'http://localhost:8000';

function Home() {
  const [events, setEvents] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await axios.get(`${API_BASE}/events`);
        setEvents(eventsRes.data);
        
        const sumData = {};
        let total = 0;
        for (const ev of eventsRes.data) {
          try {
            const sumRes = await axios.get(`${API_BASE}/events/${ev.id}/summary`);
            sumData[ev.id] = sumRes.data;
            total += sumRes.data.expense_total;
          } catch (e) {
            console.error("No summary for event", ev.id);
          }
        }
        setSummaries(sumData);
        setTotalCost(total);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const calculateDaysRemaining = (dateStr) => {
    if (!dateStr) return "Date not set";
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 0) return "Today!";
    return `${diffDays} days remaining`;
  };

  const pieData = {
    labels: ['Engagement', 'Marriage', 'Reception'],
    datasets: [
      {
        data: [
          summaries[1]?.expense_total || 0,
          summaries[2]?.expense_total || 0,
          summaries[3]?.expense_total || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const getEventDate = (id) => events.find(e => e.id === id)?.event_date;

  return (
    <div className="home-container" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
      <div className="left-col">
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome to Your Wedding Planner</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Manage your Engagement, Marriage, and Reception events seamlessly.
            </p>
          </div>
          <div style={{ textAlign: 'right', background: 'var(--primary-color)', color: 'white', padding: '1rem 2rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Total Cost Spent</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <IndianRupee size={28} /> {totalCost.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          <Link to="/engagement" className="card event-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CalendarHeart size={36} color="var(--primary-color)" />
              <span style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>
                {calculateDaysRemaining(getEventDate(1))}
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Engagement</h2>
            <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Cost:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>₹{summaries[1]?.expense_total?.toLocaleString() || 0}</span>
            </div>
          </Link>
          
          <Link to="/marriage" className="card event-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Users size={36} color="var(--primary-color)" />
              <span style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>
                {calculateDaysRemaining(getEventDate(2))}
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Marriage</h2>
            <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Cost:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>₹{summaries[2]?.expense_total?.toLocaleString() || 0}</span>
            </div>
          </Link>

          <Link to="/reception" className="card event-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Receipt size={36} color="var(--primary-color)" />
              <span style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>
                {calculateDaysRemaining(getEventDate(3))}
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Reception</h2>
            <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Cost:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>₹{summaries[3]?.expense_total?.toLocaleString() || 0}</span>
            </div>
          </Link>
        </div>

        {totalCost > 0 && (
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Cost Distribution</h2>
            <div style={{ width: '400px', height: '400px' }}>
              <Pie 
                data={pieData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }} 
              />
            </div>
          </div>
        )}
      </div>

      <div className="right-col">
        <UpdatesList />
      </div>
    </div>
  );
}

export default Home;
