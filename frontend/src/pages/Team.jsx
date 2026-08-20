import { useEffect, useRef } from 'react';

function Team() {
  const containerRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <div ref={containerRef}>
      {/* Header Section */}
      <header className="circuit-bg text-on-primary py-24 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        <div className="max-w-container-max mx-auto relative z-10 text-center">
          <h1 className="font-display-lg text-5xl md:text-6xl font-bold mb-6 reveal-3d">VEDA TEAM 2026-2027</h1>
          <p className="font-body-lg text-xl md:text-2xl text-tertiary-fixed-dim max-w-3xl mx-auto reveal-3d" style={{ transitionDelay: '0.1s' }}>KL IRD — Integrated Research and Discovery</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Sticky Sub-Nav */}
        <div className="sticky top-20 bg-surface-bright/95 backdrop-blur-md z-40 py-4 mb-16 border-b border-surface-container-high flex flex-wrap gap-3 justify-center shadow-sm">
          <a className="px-4 py-2 rounded-full bg-surface hover:bg-surface-container-high text-secondary font-label-sm text-sm font-bold transition-all border border-surface-container" href="#zero-order">ZERO ORDER</a>
          <a className="px-4 py-2 rounded-full bg-surface hover:bg-surface-container-high text-secondary font-label-sm text-sm font-bold transition-all border border-surface-container" href="#academics">ACADEMICS</a>
          <a className="px-4 py-2 rounded-full bg-surface hover:bg-surface-container-high text-secondary font-label-sm text-sm font-bold transition-all border border-surface-container" href="#research">RESEARCH AND DISCOVERY</a>
        </div>

        {/* Directory Grid */}
        <div className="space-y-24">

          {/* ZERO ORDER */}
          <section className="scroll-mt-32" id="zero-order">
            <h2 className="font-headline-md text-3xl font-bold mb-10 border-b-2 border-secondary pb-4 flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              ZERO ORDER
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-xl p-6 reveal-3d border-l-4 border-l-primary hover:-translate-y-1 transition-transform">
                <div className="font-body-md text-lg text-secondary font-bold mb-3 blur-reveal">Seelam Monish Ratan</div>
                <div className="font-label-md text-primary font-medium">2000030018</div>
              </div>
              <div className="glass-card rounded-xl p-6 reveal-3d border-l-4 border-l-primary hover:-translate-y-1 transition-transform">
                <div className="font-body-md text-lg text-secondary font-bold mb-3 blur-reveal" style={{ transitionDelay: '0.1s' }}>Harshitha Reddy</div>
                <div className="font-label-md text-primary font-medium">2000030025</div>
              </div>
            </div>
          </section>

          {/* ACADEMICS */}
          <section className="scroll-mt-32" id="academics">
            <h2 className="font-headline-md text-3xl font-bold mb-10 border-b-2 border-secondary pb-4 flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              ACADEMICS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-xl p-6 reveal-3d border-l-4 border-l-secondary hover:-translate-y-1 transition-transform">
                <div className="font-body-md text-lg text-secondary font-bold mb-3 blur-reveal">Muthinti Lakshman</div>
                <div className="font-label-md text-primary font-medium">2000030555</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Team;
