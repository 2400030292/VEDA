import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Team from './pages/Team';
import Resources from './pages/Resources';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Attendance from './pages/Attendance';

function App() {
  return (
    <Router>
      <TopNavBar />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<AdminLogin />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
