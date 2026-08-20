import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function Home() {
  const containerRef = useRef(null);
  const statsRef = useRef(null);
  const [events, setEvents] = useState([]);

  const scrollToStats = () => {
    if (statsRef.current) {
      statsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data.slice(0, 2)); // Show only top 2 events
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();

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
    
    // Tilt Cards Logic
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (card) => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      setTimeout(() => {
          card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease'; 
      }, 500);
    };

    const handleMouseEnter = (card) => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    };

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
      card.addEventListener('mouseleave', () => handleMouseLeave(card));
      card.addEventListener('mouseenter', () => handleMouseEnter(card));
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <section className="relative w-full h-[65vh] md:h-[70vh] bg-black flex flex-col items-center justify-center overflow-hidden reveal-3d">
        <div className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center px-4 mt-[-4vh] md:mt-[-6vh]">
          <img alt="VEDA Brand Logo" className="w-40 md:w-56 h-auto mb-4 drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA30xgn-miSNAcNnZQm_dHGs6rbsjm8zYNyYUTTiNNjeB4Jechn8jUuBlRRoxpQHtzPqLrntzx4Z60TCQtqnQdKPMozXmUq_6VeOOkmvTK6Lds7gL6FUUdSvYpYz1p_Mewd9NXzTZaCXC2n32tkFeC0vWSMOTJP9N9uCbgpdyiPBxhxEB4NH4m2Vi5vjumdSaGj7IcTBR7bGlDDBL6xvXlASLvrIfx4AY9Uedvihju03xxoAj0YzL_hebtrOzIa4Px9UA"/>
          
          <div className="font-headline-md text-headline-md text-on-primary font-bold flex flex-col items-center gap-2">
            <h1 className="font-display-md text-display-md md:font-display-lg md:text-display-lg text-white font-bold mb-1">Pioneering the Future of Innovation</h1>
            <div className="animated-text-container">
              <ul className="animated-text-list">
                <li className="text-primary-fixed">KL IRD</li>
                <li className="text-primary-fixed">VEDA</li>
                <li className="text-primary-fixed">KL Researcher's Club</li>
                <li className="text-primary-fixed">IoTrix</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-4 text-body-md md:text-body-lg text-tertiary-fixed-dim max-w-2xl text-center mx-auto opacity-80">
            Pioneering research, fostering innovation, and building the future of technology through collaborative exploration.
          </p>
          <Link to="/events" className="relative z-50 mt-6 bg-transparent border-2 border-primary-fixed text-primary-fixed px-8 py-3 rounded-full font-label-md text-label-md uppercase tracking-widest hover:bg-primary-fixed hover:text-black transition-all duration-300">
            Discover More
          </Link>
        </div>
        
      </section>

      {/* Stats Bar */}
      <section ref={statsRef} className="bg-surface-container-low py-12 border-b border-surface-variant z-10 relative">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8 text-center reveal-3d">
          <div className="flex flex-col items-center">
            <span className="font-display-lg text-display-lg text-secondary mb-2">50+</span>
            <span className="font-label-md text-label-md text-tertiary uppercase tracking-wider">Research Projects</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display-lg text-display-lg text-secondary mb-2">12</span>
            <span className="font-label-md text-label-md text-tertiary uppercase tracking-wider">Patents Filed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display-lg text-display-lg text-secondary mb-2">300</span>
            <span className="font-label-md text-label-md text-tertiary uppercase tracking-wider">Active Members</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display-lg text-display-lg text-secondary mb-2">4</span>
            <span className="font-label-md text-label-md text-tertiary uppercase tracking-wider">Core Sub-Teams</span>
          </div>
        </div>
      </section>

      {/* About (3D Reveal) */}
      <section className="py-24 md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full reveal-3d">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 bg-surface-container py-1 px-3 rounded-full border border-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">About KL IRD</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold leading-tight">
              Driving Innovation at the Intersection of Disciplines
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant text-opacity-80">
              The Institutional Research and Development (IRD) cell is the central hub for technological advancement. We provide the resources, mentorship, and environment necessary for students to transition from theoretical learning to practical, impactful engineering solutions.
            </p>
            <Link to="/resources" className="inline-flex items-center gap-2 text-secondary font-label-md text-label-md uppercase tracking-wider hover:text-primary transition-colors group">
              Explore Our Facilities 
              <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
            </Link>
          </div>
          <div className="md:col-span-6 md:col-start-7 mt-12 md:mt-0 relative h-96 md:h-[500px] w-full rounded-xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
            <img alt="Modern university research laboratory" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"/>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/10 backdrop-blur-md border-t border-white/20">
              <p className="font-label-md text-label-md text-white font-medium drop-shadow-md">State-of-the-art labs equipped for next-gen research.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Teams */}
      <section className="py-24 bg-surface-container-low w-full border-y border-surface-variant reveal-3d">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-4">Core Research Teams</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Specialized hubs operating under the KL IRD umbrella, focusing on niche technological domains.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            
            {/* VEDA Card */}
            <div className="tilt-card tilt-card-dark rounded-xl p-8 flex flex-col items-center text-center h-full border border-gray-800 relative overflow-hidden group">
              <div className="absolute inset-0 z-0">
                <img alt="VEDA Lab" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"/>
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center h-full w-full">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 p-4">
                  <img alt="VEDA Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjyXGoU2GOmHnHDCvrKHie1v7S2vdZb8Z0IxuQTsO35_MfzsaDLWKYDfYGhl50uwOj2ZAL3Njcb13D5G5hkaZYQ0tBR5mmmUo0UgJ82Bm4vD9SsABU9jPpFM896_eaXKao5nQgx1s-YxfctQfItlH-CIhWyyjTRtOFHxuyzQpaq4B_vZMsUX33zJyJmMkwkBM8T1SVSJvT30VLDYE6zdBexJHqT7wxiHC9FAFXHE_VeXIw2a9NSkFCGrpbMUkgBioO3w"/>
                </div>
                <h3 className="font-headline-md text-headline-md text-white font-bold mb-3 tracking-wide">VEDA</h3>
                <p className="font-body-md text-body-md text-gray-300 mb-6 flex-grow">VLSI and Embedded Systems Design Academy. Focusing on microarchitecture and hardware engineering.</p>
                <button className="mt-auto border border-white/20 text-white px-6 py-2 rounded font-label-sm text-label-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors backdrop-blur-sm bg-white/5">
                  View Team
                </button>
              </div>
            </div>

            {/* IoTRIX Card */}
            <div className="tilt-card tilt-card-dark rounded-xl p-8 flex flex-col items-center text-center h-full border border-gray-800 relative overflow-hidden group">
              <div className="absolute inset-0 z-0">
                <img alt="IoTRIX Lab" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"/>
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center h-full w-full">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 p-4">
                  <img alt="IoTRIX Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0_u_5PtMUR1BSKAjEblJqnBqm8IddVw-3_jcjeoy-3GZwKh7yU0ObHdJkqGmICxBqxb68IvJ2kcif4bMF0ipwVjeGeqd1Eh-RSKLmHYBNfH0uf946aWeuQ5FFCZOR_sT9S3WetWD4wW4TROngoaTePO5RosNdAYFTWDTguY7LIp2-rJxsGFf9Lt1Ksyj6XpfoX_SwY7NPIHEUEohot3una9LMfj020Sq3lYWhvCrF2YiU0zcu4Kz6nzJSjgr5jAi4oA"/>
                </div>
                <h3 className="font-headline-md text-headline-md text-white font-bold mb-3 tracking-wide">IoTRIX</h3>
                <p className="font-body-md text-body-md text-gray-300 mb-6 flex-grow">Internet of Things Research and Innovation. Building connected ecosystems and smart solutions.</p>
                <button className="mt-auto border border-white/20 text-white px-6 py-2 rounded font-label-sm text-label-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors backdrop-blur-sm bg-white/5">
                  View Team
                </button>
              </div>
            </div>

            {/* KLRC Card */}
            <div className="tilt-card tilt-card-dark rounded-xl p-8 flex flex-col items-center text-center h-full border border-gray-800 relative overflow-hidden group">
              <div className="absolute inset-0 z-0">
                <img alt="KLRC Lab" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"/>
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center h-full w-full">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 p-4">
                  <img alt="KLRC Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBKXOA2R7H_sTjYR_DL2ECY4KOpi_x-sE5gFeMf9X46LhdbA4ZXGfQejNG_gN8V7WQUtKcF7sLUMP7R455OBv5Gfw8P1yBwvfoBuJ-LZXgVYF63hXzi14ySPm_ie8c8JX4zUWYGXjsjtAL6DD7K6eaf9mrCqVLF669gueVZnbjiyhbwEMYxtJ2x-WxhAmSb-qyY91GGKAsS5cObPTxCfW74OXiNgZ2bPfffPRCrxh-M6u2ya4vgMrDerheItgIVhO8uQ"/>
                </div>
                <h3 className="font-headline-md text-headline-md text-white font-bold mb-3 tracking-wide">KLRC</h3>
                <p className="font-body-md text-body-md text-gray-300 mb-6 flex-grow">KL Researcher's Club. Fostering a culture of foundational research and academic publication.</p>
                <button className="mt-auto border border-white/20 text-white px-6 py-2 rounded font-label-sm text-label-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors backdrop-blur-sm bg-white/5">
                  View Team
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full reveal-3d">
        <div className="flex justify-between items-end mb-12 border-b border-surface-variant pb-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Upcoming Events</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Workshops, hackathons, and guest lectures.</p>
          </div>
          <Link to="/events" className="hidden md:inline-flex items-center gap-1 text-primary font-label-md text-label-md uppercase tracking-wider hover:text-secondary transition-colors">
            All Events <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => {
            const dateObj = new Date(event.event_date);
            const day = event.event_date ? dateObj.getDate() : '--';
            const monthStr = event.event_date ? dateObj.toLocaleString('default', { month: 'short' }) : 'TBD';
            
            return (
              <Link key={event.id} to="/events" className="group bg-surface rounded-lg p-6 border border-surface-variant hover:border-primary/50 transition-colors shadow-sm flex flex-col md:flex-row gap-6 items-start cursor-pointer">
                <div className="bg-surface-container-low rounded p-4 text-center min-w-[80px] border border-surface-variant">
                  <span className="block font-headline-md text-headline-md text-primary font-bold">{day}</span>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">{monthStr}</span>
                </div>
                <div className="w-full">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 bg-surface-container text-tertiary rounded text-[10px] font-label-md uppercase tracking-widest border border-outline-variant">{event.category || 'EVENT'}</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">{event.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4 text-sm text-tertiary">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span> {event.start_time ? event.start_time.substring(0,5) : 'TBA'}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>location_on</span> {event.venue || 'TBA'}</span>
                    </div>
                    <span className="text-primary font-label-sm font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">Register <span className="material-symbols-outlined text-sm">arrow_forward</span></span>
                  </div>
                </div>
              </Link>
            )
          })}
          {events.length === 0 && (
             <div className="col-span-1 md:col-span-2 text-center py-12 text-on-surface-variant border border-surface-variant border-dashed rounded-lg">
                Stay tuned for our upcoming research and hackathon events!
             </div>
          )}
        </div>
        
        <Link to="/events" className="md:hidden mt-8 block text-center w-full bg-surface-container py-3 rounded text-primary font-label-md text-label-md uppercase tracking-wider">
          View All Events
        </Link>
      </section>

      {/* Moments Section */}
      <section className="py-24 bg-surface-container-low w-full border-t border-surface-variant overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
          <div className="text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Research Moments</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl mx-auto">Glimpses of our students and researchers in action, exploring the frontiers of technology.</p>
          </div>
        </div>
        <div className="marquee-wrapper w-full relative">
          <div className="marquee-container flex">
            {/* Set 1 */}
            <div className="marquee-item aspect-square rounded-xl overflow-hidden shadow-sm">
              <img alt="Lab Work Moment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"/>
            </div>
            <div className="marquee-item aspect-square rounded-xl overflow-hidden shadow-sm">
              <img alt="Lab Work Moment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWra7o7JWN5fD4A9hvZyUCAOVmQnU1oPV2QEEvvfQ_m9JNoGBfxqN93RVtqiBX8HogiBQemU1S_iH1c8TQpAdq8MsHzvXV2SNNdr6suXOuvD27wVVcG0Qj7iArfEjTezgKW9C2dVXDwMqu8Q05vNgVvh9K8hf_BdRxkgJsayIP6YRlmkt9INuwFEr3S8JAaSxw8I61iS-rS3mqvvv20LR6lEyQ39LxGfGd7WKXo4qkrn6biFyY3ZkpwgNrVMZ2HwySKA"/>
            </div>
            <div className="marquee-item aspect-square rounded-xl overflow-hidden shadow-sm">
              <img alt="Lab Work Moment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"/>
            </div>
            <div className="marquee-item aspect-square rounded-xl overflow-hidden shadow-sm">
              <img alt="Lab Work Moment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLvJlbpKz_wvx58g-HxU0MnHuW9TrxUyjX5yzXYuGWTGrs6z2aZZ-_x9XeEN1KNSK3-wFVoLXLF63xl-kCFIvSuBuSAZlPyePeQznOoL4dpfmjQrz0rTBYIjLxdw2Wi-qf0DRzrE5bjcP_Np7d2Na_DiY3q21fyJ3hGc1HUq6HYKMtK5rpaBHzc_8Xv04n6ZzRwAk91uEDHKs9oMiGZq9OYZVglM7uKYM6Nx0ZZAvTuPJsEA-POQMBY_3-OgcP2NRT6Q"/>
            </div>
            {/* Set 2 for infinite loop */}
            <div className="marquee-item aspect-square rounded-xl overflow-hidden shadow-sm">
              <img alt="Lab Work Moment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"/>
            </div>
            <div className="marquee-item aspect-square rounded-xl overflow-hidden shadow-sm">
              <img alt="Lab Work Moment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWra7o7JWN5fD4A9hvZyUCAOVmQnU1oPV2QEEvvfQ_m9JNoGBfxqN93RVtqiBX8HogiBQemU1S_iH1c8TQpAdq8MsHzvXV2SNNdr6suXOuvD27wVVcG0Qj7iArfEjTezgKW9C2dVXDwMqu8Q05vNgVvh9K8hf_BdRxkgJsayIP6YRlmkt9INuwFEr3S8JAaSxw8I61iS-rS3mqvvv20LR6lEyQ39LxGfGd7WKXo4qkrn6biFyY3ZkpwgNrVMZ2HwySKA"/>
            </div>
            <div className="marquee-item aspect-square rounded-xl overflow-hidden shadow-sm">
              <img alt="Lab Work Moment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AP1WRLvDn9aNPw67nn03xwJVeF4v29mBWsaR3KbwXGaijgUE5pCOqvjUteUL-DJRQtd3KxRdYJMT7ZFTrOyesZLXJvP1WB3aNPvczgMEUhtA0k1Q6b7B8QOk-5NU9Tx3ZOQeNSol4ON87n_BcUuB-H87cWSWRK2wTZEykzIBm4YhXozrdt4Qp64cSeky6VLvFGUQqnJ1RrQ3TcigXl8aYJBRKbSlITuFBoB9ZPMQmfrkdDOa3EZCAuL0LDttCIs"/>
            </div>
            <div className="marquee-item aspect-square rounded-xl overflow-hidden shadow-sm">
              <img alt="Lab Work Moment" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLvJlbpKz_wvx58g-HxU0MnHuW9TrxUyjX5yzXYuGWTGrs6z2aZZ-_x9XeEN1KNSK3-wFVoLXLF63xl-kCFIvSuBuSAZlPyePeQznOoL4dpfmjQrz0rTBYIjLxdw2Wi-qf0DRzrE5bjcP_Np7d2Na_DiY3q21fyJ3hGc1HUq6HYKMtK5rpaBHzc_8Xv04n6ZzRwAk91uEDHKs9oMiGZq9OYZVglM7uKYM6Nx0ZZAvTuPJsEA-POQMBY_3-OgcP2NRT6Q"/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
