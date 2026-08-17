import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function EventFormModal({ isOpen, onClose, eventToEdit = null, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    event_date: '',
    start_time: '',
    end_time: '',
    capacity: '',
    poster_url: '',
    status: 'DRAFT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load existing event data if editing
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        category: eventToEdit.category || '',
        venue: eventToEdit.venue || '',
        event_date: eventToEdit.event_date || '',
        start_time: eventToEdit.start_time || '',
        end_time: eventToEdit.end_time || '',
        capacity: eventToEdit.capacity || '',
        poster_url: eventToEdit.poster_url || '',
        status: eventToEdit.status || 'DRAFT',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        venue: '',
        event_date: '',
        start_time: '',
        end_time: '',
        capacity: '',
        poster_url: '',
        status: 'DRAFT',
      });
    }
  }, [eventToEdit, isOpen]);

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

    const token = localStorage.getItem('adminToken');
    const url = eventToEdit 
      ? `${API_URL}/api/admin/events/${eventToEdit.id}` 
      : `${API_URL}/api/admin/events`;
    const method = eventToEdit ? 'PUT' : 'POST';

    // Format data: ensure capacity is an integer or null
    const payload = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to save event');
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
      <div className="bg-surface rounded-xl p-8 max-w-2xl w-full border border-surface-variant shadow-lg my-8">
        <div className="flex justify-between items-center mb-6 border-b border-surface-variant pb-4">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            {eventToEdit ? 'Edit Event' : 'Create New Event'}
          </h2>
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
            <label className="block font-label-sm text-on-surface mb-1">Event Title *</label>
            <input 
              required
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-label-sm text-on-surface mb-1">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-on-surface mb-1">Category *</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
              >
                <option value="">Select Category</option>
                <option value="TECHNICAL">Technical (Hackathons, Workshops)</option>
                <option value="NON_TECHNICAL">Non-Technical</option>
                <option value="SEMINAR">Seminar / Guest Lecture</option>
                <option value="CLUB_ACTIVITY">Club Activity</option>
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-on-surface mb-1">Venue *</label>
              <input 
                required
                type="text" 
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. R&D Block, Lab 3"
                className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-label-sm text-on-surface mb-1">Date</label>
              <input 
                type="date" 
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-label-sm text-on-surface mb-1">Start Time</label>
              <input 
                type="time" 
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-label-sm text-on-surface mb-1">End Time</label>
              <input 
                type="time" 
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-on-surface mb-1">Max Capacity</label>
              <input 
                type="number" 
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Leave blank for unlimited"
                className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block font-label-sm text-on-surface mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
              >
                <option value="DRAFT">DRAFT (Hidden)</option>
                <option value="PUBLISHED">PUBLISHED (Live)</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block font-label-sm text-on-surface mb-1">Poster Image URL</label>
            <input 
              type="url" 
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-outline-variant bg-surface-container-lowest p-2 rounded focus:outline-none focus:border-primary"
            />
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
              className="bg-primary text-on-primary px-6 py-2 rounded font-label-md tracking-wider uppercase hover:bg-surface-tint disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventFormModal;
