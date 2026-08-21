import { useEffect } from 'react';

function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-surface-container-lowest min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop fade-in-up">
        
        <div className="mb-12 border-b border-surface-variant pb-8">
          <h1 className="font-display-md text-display-sm md:text-display-md font-bold text-on-surface mb-4">
            Terms of Service
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8 text-on-surface-variant font-body-md leading-relaxed">
          
          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">1. Acceptance of Terms</h2>
            <p>
              [Placeholder: By accessing and registering on the VEDA Club event management platform, you accept and agree to be bound by the terms and provisions of this agreement.]
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">2. Event Registration Rules</h2>
            <p className="mb-3">
              [Placeholder: Outline the rules regarding event participation:]
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Registrations are non-transferable.</li>
              <li>Students must present their valid University ID and the generated QR code for attendance.</li>
              <li>The club reserves the right to cancel or modify events.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">3. User Conduct</h2>
            <p>
              [Placeholder: State the expected behavior of members during club events, hackathons, and workshops. Emphasize academic integrity, respect, and proper use of university resources.]
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">4. Intellectual Property</h2>
            <p>
              [Placeholder: Clarify the ownership of projects built during hackathons or research under the club's banner. Usually, intellectual property rules defined by KL University apply.]
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">5. Modifications</h2>
            <p>
              [Placeholder: State that the club reserves the right to revise these terms at any time without notice. Continued use of the platform implies acceptance of revisions.]
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default Terms;
