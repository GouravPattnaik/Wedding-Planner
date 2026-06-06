import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TitleBar from './components/TitleBar';
import Home from './pages/Home';
import EventPage from './pages/EventPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <TitleBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/engagement" element={<EventPage eventName="Engagement" eventId={1} />} />
            <Route path="/marriage" element={<EventPage eventName="Marriage" eventId={2} />} />
            <Route path="/reception" element={<EventPage eventName="Reception" eventId={3} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
