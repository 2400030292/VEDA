import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../config';

function Team() {
  const containerRef = useRef(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dynamic team data
    fetch(`${API_URL}/api/team`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch team data");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setDomains(data);
        } else {
          setDomains([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Team fetch error:", err);
        setError("Could not load team data. Please try again later.");
        setDomains([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || domains.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-3d');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, domains]);

  // Helper function to create an anchor ID from a domain name
  const toAnchorId = (name) => name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'section';
  
  // Array of material icons to cycle through for domains if we want variety
  const iconList = ['stars', 'menu_book', 'science', 'psychology', 'rocket_launch', 'lightbulb'];

  return (
    <div ref={containerRef}>
      {/* Header Section (Loads Immediately) */}
      <header className="circuit-bg text-on-primary py-24 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="max-w-container-max mx-auto relative z-10 text-center">
          <h1 className="font-display-lg text-5xl md:text-6xl font-bold mb-6 reveal-3d is-visible">VEDA TEAM 2026-2027</h1>
          <p className="font-body-lg text-xl md:text-2xl text-tertiary-fixed-dim max-w-3xl mx-auto reveal-3d is-visible" style={{ transitionDelay: '0.1s' }}>KL IRD — Integrated Research and Discovery</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[50vh]">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-on-surface-variant font-body-md animate-pulse">Loading team roster...</p>
          </div>
        ) : error ? (
          <div className="text-center text-error font-body-lg py-12 bg-error-container/20 rounded-xl">
            {error}
          </div>
        ) : domains.length === 0 ? (
          <div className="text-center text-on-surface-variant font-body-lg py-12">
            Team roster is currently being updated. Check back later!
          </div>
        ) : (
          <>
            {/* Sticky Sub-Nav */}
            <div className="sticky top-20 bg-surface-bright/95 backdrop-blur-md z-40 py-4 mb-16 border-b border-surface-container-high flex flex-wrap gap-3 justify-center shadow-sm">
              {domains.map(domain => (
                <a key={`nav-${domain.id}`} className="px-4 py-2 rounded-full bg-surface hover:bg-surface-container-high text-secondary font-label-sm text-sm font-bold transition-all border border-surface-container" href={`#${toAnchorId(domain.name)}`}>
                  {domain.name}
                </a>
              ))}
            </div>

            {/* Directory Grid */}
            <div className="space-y-24">
              {domains.map((domain, index) => {
                const iconName = iconList[index % iconList.length];
                const borderColor = index % 2 === 0 ? 'border-l-primary' : 'border-l-secondary';
                
                return (
                  <section key={domain.id} className="scroll-mt-32" id={toAnchorId(domain.name)}>
                    <h2 className="font-headline-md text-3xl font-bold mb-10 border-b-2 border-secondary pb-4 flex items-center gap-3 text-secondary">
                      <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{iconName}</span>
                      {domain.name}
                    </h2>
                    
                    {domain.members && domain.members.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {domain.members.map((member, mIndex) => (
                          <div key={member.id} className={`glass-card rounded-xl p-6 reveal-3d border-l-4 ${borderColor} hover:-translate-y-1 transition-transform flex flex-col justify-between`} style={{ transitionDelay: `${(mIndex % 4) * 0.1}s` }}>
                            <div>
                              {/* Optional Profile Image */}
                              {member.profile_image_url && (
                                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-surface-container">
                                  <img src={member.profile_image_url} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="font-body-md text-lg text-secondary font-bold mb-1 blur-reveal">{member.name}</div>
                              {member.role && (
                                <div className="font-label-sm text-on-surface-variant mb-3 text-xs uppercase tracking-wider">{member.role}</div>
                              )}
                            </div>
                            <div className="mt-4 flex justify-between items-end">
                              <div className="font-label-md text-primary font-medium">{member.student_id}</div>
                              {member.linkedin_url && (
                                <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-secondary hover:text-primary transition-colors">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-on-surface-variant italic">Members to be announced soon.</p>
                    )}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Team;
