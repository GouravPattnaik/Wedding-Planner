import { Link } from 'react-router-dom';
import { CalendarHeart, Users, Receipt } from 'lucide-react';

function Home() {
  return (
    <div className="home-container">
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Your Wedding Planner</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem' }}>
          Manage your Engagement, Marriage, and Reception events all in one place.
        </p>

        <div className="dashboard-grid">
          <Link to="/engagement" className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <CalendarHeart size={48} color="var(--primary-color)" />
            <h2>Engagement</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage ring ceremony, guests and budget</p>
          </Link>
          
          <Link to="/marriage" className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Users size={48} color="var(--primary-color)" />
            <h2>Marriage</h2>
            <p style={{ color: 'var(--text-muted)' }}>The big day! Track all expenses and families</p>
          </Link>

          <Link to="/reception" className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Receipt size={48} color="var(--primary-color)" />
            <h2>Reception</h2>
            <p style={{ color: 'var(--text-muted)' }}>Plan the after-party, caterers and final guests</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
