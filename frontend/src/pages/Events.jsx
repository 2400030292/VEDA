import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { API_URL } from '../config';

function Events() {
  const containerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [events]); // Re-run when events load

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegisterClick = (eventId) => {
    setSelectedEventId(eventId);
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'ALL') return true;
    if (filter === 'LIVE NOW') return event.status === 'PUBLISHED';
    // Simplified filtering logic for demo
    return true; 
  });

  return (
    <div ref={containerRef}>
      {/* Registration Modal Overlay */}
      {selectedEventId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <RegistrationForm eventId={selectedEventId} onClose={() => setSelectedEventId(null)} />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full px-margin-mobile md:px-margin-desktop py-24 circuit-pattern flex flex-col items-center justify-center text-center overflow-hidden border-b border-surface-variant">
        <div className="max-w-4xl z-10 reveal">
          <div className="inline-block bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-sm text-label-sm mb-6 tracking-widest uppercase shadow-sm">
            Discover What's Next
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-6">EVENTS & EXPERIENCES</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">
            Discover hackathons, workshops, challenges, sessions and innovation experiences by KL IRD.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] z-40 bg-surface/90 backdrop-blur-md border-b border-surface-variant py-4">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex overflow-x-auto gap-2 md:gap-4 no-scrollbar">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap cursor-pointer transition-colors ${filter === 'ALL' ? 'bg-inverse-surface text-inverse-on-surface' : 'text-secondary hover:bg-surface-container'}`}>ALL</button>
          <button onClick={() => setFilter('LIVE NOW')} className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${filter === 'LIVE NOW' ? 'bg-inverse-surface text-inverse-on-surface' : 'text-secondary hover:bg-surface-container'}`}>
            <span className="w-2 h-2 rounded-full bg-primary-container"></span> LIVE NOW
          </button>
        </div>
      </section>

      {/* Content Container */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 space-y-24">
        
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-4 rounded text-center">
            {error}. Make sure the backend server is running.
          </div>
        ) : (
          <section className="reveal">
            <div className="flex items-center gap-4 mb-8 border-b border-surface-variant pb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container"></span>
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">EVENTS</h2>
            </div>
            
            {filteredEvents.length === 0 ? (
              <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[200px]">
                <span className="material-symbols-outlined text-4xl text-tertiary mb-4">event_busy</span>
                <p className="font-body-lg text-body-lg text-tertiary">No events found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {filteredEvents.map(event => (
                  <article key={event.id} className="bg-surface-container-lowest border border-surface-variant rounded-xl overflow-hidden img-hover-zoom card-hover transition-all duration-300 flex flex-col group reveal">
                    <div className="aspect-[16/9] w-full bg-surface-container overflow-hidden relative">
                      {event.category && (
                        <div className="absolute top-4 left-4 z-10 bg-surface/90 backdrop-blur text-secondary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase">{event.category}</div>
                      )}
                      <img 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-500" 
                        src={event.poster_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDY5CygTMrnOLzeZR5lNJegspdBjzZAGffkDhuQgiwUCX65njyo9R7UqPxwC1ejzGTyzzR7l9o4P-PSplP6r_6V3FuqjmE8SEdfWGDFf2Il91GfhdPGY_m5ei9Bnnv3weGRus7q2mPCY1wh0ThdjhVS-KqENWI8gHvV7_bGgQAHBM6WH4OqISDS1vsQ5wPyRX_9i3hwcyuaY6zv-Q87IU8WJUvoSZnSbqrTQCX9woyLw0QWZg3N9W5P"}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-headline-md text-headline-md text-on-background mb-2">{event.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="flex items-center gap-4 text-tertiary font-body-md text-body-md mb-6 mt-auto pt-4">
                        {event.event_date && (
                          <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {event.event_date}</div>
                        )}
                        {event.start_time && (
                          <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {event.start_time}</div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-surface-variant pt-4">
                        <span className="bg-surface-container px-3 py-1 rounded-full font-label-sm text-label-sm text-tertiary uppercase">{event.status}</span>
                        <button 
                          onClick={() => handleRegisterClick(event.id)}
                          className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-300 hover:bg-primary-container hover:shadow-lg group/btn cursor-pointer"
                        >
                          <span>Register Now</span>
                          <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover/btn:translate-x-1">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default Events;
