import { useEffect } from 'react';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-surface-container-lowest min-h-screen py-16 md:py-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h1 className="font-display-lg text-display-md md:text-display-lg font-bold text-on-surface mb-6">
            About <span className="text-primary">Us</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Pioneering research, fostering innovation, and building the future of technology through collaborative exploration at KL IRD.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-surface-container-low rounded-3xl p-8 border border-surface-variant glass-effect hover-lift slide-in-left">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-4">Our Vision</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              [Placeholder Text: This section will outline the long-term vision of the Institutional Research and Development Cell. Describe the ultimate goals and the future you aim to build.]
            </p>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-8 border border-surface-variant glass-effect hover-lift slide-in-right">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-4">Our Mission</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              [Placeholder Text: This section will detail the actionable steps and daily mission of the club. How do you plan to achieve the vision? Focus on student empowerment and technical skill development.]
            </p>
          </div>
        </div>

        {/* Club Details Section */}
        <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 border border-surface-variant glass-effect fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-6 text-center">The VEDA Club</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              [Placeholder Text: Introduce the VEDA club here. What does VEDA stand for? Who can join? What are the core activities and how does it benefit the student community at KL University?]
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              [Placeholder Text: Add more details about past achievements, notable alumni, or significant milestones the club has reached. This builds credibility and excitement.]
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;
