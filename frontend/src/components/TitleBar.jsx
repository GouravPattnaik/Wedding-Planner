import { Link, useLocation } from 'react-router-dom';

function TitleBar() {
  const location = useLocation();

  return (
    <header className="title-bar">
      <Link to="/" className="brand">
        Wedding Planner
      </Link>
      <nav className="nav-links">
        <Link 
          to="/engagement" 
          className={`nav-link ${location.pathname === '/engagement' ? 'active' : ''}`}
        >
          Engagement
        </Link>
        <Link 
          to="/marriage" 
          className={`nav-link ${location.pathname === '/marriage' ? 'active' : ''}`}
        >
          Marriage
        </Link>
        <Link 
          to="/reception" 
          className={`nav-link ${location.pathname === '/reception' ? 'active' : ''}`}
        >
          Reception
        </Link>
      </nav>
    </header>
  );
}

export default TitleBar;
