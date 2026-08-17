import { useState } from 'react';
import { API_URL } from '../config';

function RegistrationForm({ eventId, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      setSuccessData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-surface rounded-xl p-8 max-w-md w-full border border-surface-variant text-center">
        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">check</span>
        </div>
        <h3 className="font-headline-md text-headline-md font-bold mb-2">Registration Successful!</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          Your Registration ID is <span className="font-bold text-primary">{successData.registration.registration_code}</span>
        </p>
        
        <div className="mb-6 inline-block bg-white p-4 rounded-xl border border-surface-variant shadow-sm">
          <img src={successData.qr_code} alt="Your Ticket QR Code" className="w-48 h-48 mx-auto" />
        </div>
        
        <p className="font-body-sm text-body-sm text-tertiary mb-6">
          Please take a screenshot of this ticket to show at the entrance. A copy has also been sent to your email.
        </p>
        
        <button 
          onClick={onClose}
          className="bg-primary text-on-primary px-6 py-3 rounded-full w-full font-label-md tracking-wider uppercase hover:shadow-md transition-shadow"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-8 max-w-md w-full border border-surface-variant">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md font-bold">Register for Event</h3>
        <button onClick={onClose} className="text-tertiary hover:text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-label-sm text-on-surface mb-1">Full Name *</label>
          <input 
            required
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block font-label-sm text-on-surface mb-1">Email Address *</label>
          <input 
            required
            type="email" 
            name="email"
            pattern="^\d{10}@kluniversity\.in$"
            title="Must be your 10-digit KL University ID followed by @kluniversity.in"
            value={formData.email}
            onChange={handleChange}
            placeholder="1234567890@kluniversity.in"
            className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block font-label-sm text-on-surface mb-1">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-label-sm text-on-surface mb-1">Department</label>
            <input 
              type="text" 
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block font-label-sm text-on-surface mb-1">Year of Study</label>
            <input 
              type="text" 
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g. 2nd Year"
              className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded mt-6 font-label-md tracking-wider uppercase hover:bg-surface-tint disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
