import { useEffect } from 'react';

function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-surface-container-lowest min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop fade-in-up">
        
        <div className="mb-12 border-b border-surface-variant pb-8">
          <h1 className="font-display-md text-display-sm md:text-display-md font-bold text-on-surface mb-4">
            Privacy Policy
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8 text-on-surface-variant font-body-md leading-relaxed">
          
          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">1. Introduction</h2>
            <p>
              [Placeholder: Welcome to the KL IRD / VEDA Club Privacy Policy. Explain that you respect user privacy and are committed to protecting it. Mention the scope of this policy.]
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">2. Data Collection</h2>
            <p className="mb-3">
              [Placeholder: List the types of personal data you collect from students. For example:]
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and University ID Number</li>
              <li>Email addresses and contact information</li>
              <li>Event registration history</li>
              <li>Attendance records via QR codes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">3. Use of Information</h2>
            <p>
              [Placeholder: Explain how the collected data is used. Typically, this includes managing event registrations, sending important club updates, tracking attendance for certificates, and improving club activities.]
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">4. Data Security</h2>
            <p>
              [Placeholder: Detail the measures taken to secure user data. Mention that the database is secured, passwords are encrypted, and access to the admin dashboard is strictly controlled.]
            </p>
          </section>

          <section>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:ird@kluniversity.in" className="text-primary hover:underline">
                ird@kluniversity.in
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default Privacy;
