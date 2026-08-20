import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      sessionStorage.setItem('adminToken', data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="bg-surface rounded-xl p-8 max-w-md w-full border border-surface-variant shadow-lg reveal-3d is-visible">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface text-center">Admin Portal</h2>
          <p className="font-body-md text-on-surface-variant mt-2">Sign in to manage events and attendance</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded mb-6 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-label-sm text-on-surface mb-1 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-outline-variant bg-surface-container-lowest p-3 rounded focus:outline-none focus:border-primary transition-colors"
              placeholder="admin@kluniversity.in"
            />
          </div>
          <div>
            <label className="block font-label-sm text-on-surface mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-outline-variant bg-surface-container-lowest p-3 rounded focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded mt-6 font-label-md tracking-wider uppercase hover:bg-surface-tint disabled:opacity-50 transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
