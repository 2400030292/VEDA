import { Link, useLocation, useNavigate } from 'react-router-dom';

function TopNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('adminToken');

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/login');
  };

  const getLinkClass = (path) => {
    const baseClass = "h-full flex items-center transition-colors duration-200 cursor-pointer active:scale-95 font-label-md text-label-md uppercase tracking-wider";
    if (location.pathname === path) {
      return `${baseClass} text-primary font-bold border-b-2 border-primary`;
    }
    return `${baseClass} text-on-surface hover:text-primary`;
  };

  return (
    <header className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-3">
            <img src="/veda-logo.png" alt="VEDA Logo" className="h-10 md:h-14 w-auto object-contain" />
            KL IRD
          </Link>
        </div>
        <nav className="hidden md:flex gap-gutter items-center h-full">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/events" className={getLinkClass('/events')}>Events</Link>
          <Link to="/team" className={getLinkClass('/team')}>Team</Link>
          <Link to="/resources" className={getLinkClass('/resources')}>Resources</Link>
          {!token ? (
            <Link to="/login" className={getLinkClass('/login')}>Login</Link>
          ) : (
            <>
              <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="h-full flex items-center transition-colors duration-200 cursor-pointer active:scale-95 font-label-md text-label-md uppercase tracking-wider text-error hover:text-error/80"
              >
                Logout
              </button>
            </>
          )}
        </nav>
        <button className="hidden md:flex items-center justify-center bg-primary text-on-primary px-6 py-2 rounded font-label-md text-label-md uppercase tracking-wider hover:bg-surface-tint transition-colors cursor-pointer active:scale-95">
          Join Us
        </button>
        <button className="md:hidden text-on-surface cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
        </button>
      </div>
    </header>
  );
}

export default TopNavBar;
