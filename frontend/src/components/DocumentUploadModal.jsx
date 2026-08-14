import { useState, useEffect } from 'react';

function DocumentUploadModal({ isOpen, onClose, onSave }) {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    event_id: '',
    visibility: 'PRIVATE',
  });
  const [file, setFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (isOpen) {
      // Fetch events for the dropdown
      const fetchEvents = async () => {
        try {
          const res = await fetch('http://localhost:8000/api/admin/events', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setEvents(await res.json());
          }
        } catch (err) {
          console.error("Failed to load events", err);
        }
      };
      fetchEvents();
      
      // Reset form
      setFile(null);
      setFormData({
        event_id: '',
        visibility: 'PRIVATE',
      });
      setError('');
    }
  }, [isOpen, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    setLoading(true);
    setError('');

    // Prepare multipart form data
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('visibility', formData.visibility);
    if (formData.event_id) {
      uploadData.append('event_id', formData.event_id);
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set Content-Type header when using FormData; the browser sets it automatically with the correct boundary
        },
        body: uploadData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to upload document');
      }

      onSave(); // Refresh dashboard
      onClose(); // Close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface rounded-xl p-8 max-w-md w-full border border-surface-variant shadow-lg my-8">
        <div className="flex justify-between items-center mb-6 border-b border-surface-variant pb-4">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Upload Document</h2>
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
            <label className="block font-label-sm text-on-surface mb-1">Select File *</label>
            <input 
              required
              type="file" 
              onChange={handleFileChange}
              className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-surface-tint"
            />
          </div>

          <div>
            <label className="block font-label-sm text-on-surface mb-1">Related Event (Optional)</label>
            <select
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
            >
              <option value="">-- None (General Resource) --</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-on-surface mb-1">Visibility *</label>
            <select
              required
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
            >
              <option value="PRIVATE">PRIVATE (Admins Only)</option>
              <option value="PUBLIC">PUBLIC (Visible to Students)</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-surface-variant mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded text-secondary hover:bg-surface-container transition-colors font-label-md tracking-wider uppercase"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-on-primary px-6 py-2 rounded font-label-md tracking-wider uppercase hover:bg-surface-tint disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-sm">refresh</span>}
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DocumentUploadModal;
