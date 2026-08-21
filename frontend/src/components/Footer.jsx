import { Link } from 'react-router-dom';

function Footer() {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'KL IRD - VEDA Club',
          text: 'Check out the official VEDA Club Event Management Platform at KL University!',
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        alert('Website link copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <footer className="w-full mt-auto bg-surface-container-low py-20 border-t border-surface-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-headline-md text-headline-md font-bold text-on-surface">KL IRD</span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Institutional Research and Development Cell. Empowering innovation and technical excellence.
          </p>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-tertiary hover:bg-primary hover:text-white transition-colors cursor-pointer outline-none"
              title="Share Website"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>share</span>
            </button>
            <a href="mailto:ird@kluniversity.in?subject=Inquiry%20to%20KL%20IRD" className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-tertiary hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            </a>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="flex flex-col gap-4 mt-8 md:mt-0">
          <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface font-bold">Quick Links</h4>
          <ul className="flex flex-col gap-2 font-body-md text-body-md">
            <li><Link to="/about" className="text-on-surface-variant hover:text-secondary transition-all">About Us</Link></li>
            <li><Link to="/research" className="text-on-surface-variant hover:text-secondary transition-all">Research Areas</Link></li>
            <li><Link to="/events" className="text-on-surface-variant hover:text-secondary transition-all">Events Calendar</Link></li>
            <li><Link to="/team" className="text-on-surface-variant hover:text-secondary transition-all">Join a Team</Link></li>
          </ul>
        </div>
        
        {/* Teams */}
        <div className="flex flex-col gap-4 mt-8 md:mt-0">
          <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface font-bold">Teams</h4>
          <ul className="flex flex-col gap-2 font-body-md text-body-md">
            <li><Link to="/team" className="text-on-surface-variant hover:text-secondary transition-all">VEDA</Link></li>
            <li><Link to="/team" className="text-on-surface-variant hover:text-secondary transition-all">IoTRIX</Link></li>
            <li><Link to="/team" className="text-on-surface-variant hover:text-secondary transition-all">KLRC</Link></li>
          </ul>
        </div>
        
        {/* Contact */}
        <div className="flex flex-col gap-4 mt-8 md:mt-0">
          <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface font-bold">Contact</h4>
          <ul className="flex flex-col gap-3 font-body-md text-body-md">
            <li className="flex items-start gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-tertiary mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span>
              <span>KL University Campus,<br/>Vaddeswaram, AP</span>
            </li>
            <li>
              <a href="mailto:ird@kluniversity.in?subject=Inquiry%20to%20KL%20IRD" className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-all cursor-pointer">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 0" }}>email</span>
                <span>ird@kluniversity.in</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-16 pt-8 border-t border-surface-variant flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-body-md text-body-md text-on-surface-variant">© {new Date().getFullYear()} KL IRD. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="/privacy" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-all">Privacy Policy</Link>
          <Link to="/terms" className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-all">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
