import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function Attendance() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  
  const [registrations, setRegistrations] = useState([]);
  const [absentIds, setAbsentIds] = useState(new Set());
  
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const token = sessionStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/events`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch events");
        
        const data = await response.json();
        setEvents(data);
        if (data.length > 0) {
          setSelectedEventId(data[0].id);
        }
      } catch (err) {
        console.error(err);
        setStatusMessage({ type: 'error', text: 'Could not load events. Make sure you are logged in.' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, navigate]);

  useEffect(() => {
    if (!selectedEventId || !token) return;

    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/admin/events/${selectedEventId}/registrations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch registrations");
        
        const data = await response.json();
        setRegistrations(data);
        setAbsentIds(new Set()); // Reset checkboxes when event changes
        setIsEditing(false);
        setStatusMessage(null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [selectedEventId, token]);

  const handleCheckboxChange = (registrationId) => {
    setAbsentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(registrationId)) {
        newSet.delete(registrationId);
      } else {
        newSet.add(registrationId);
      }
      return newSet;
    });
  };

  const handleEditAttendance = () => {
    const absents = new Set(registrations.filter(r => r.attendance_status === 'ABSENT').map(r => r.id));
    setAbsentIds(absents);
    setIsEditing(true);
  };

  const handleBulkSubmit = async () => {
    if (!selectedEventId) return;

    const confirmSubmit = window.confirm(
      "Are you sure? Anyone NOT ticked will be permanently marked as PRESENT in the database."
    );
    if (!confirmSubmit) return;

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/admin/events/${selectedEventId}/attendance/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ absent_registration_ids: Array.from(absentIds) })
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({ 
          type: 'success', 
          text: `Success! ${data.marked_present} students marked Present. ${data.marked_absent} marked Absent.`
        });
      } else {
        setStatusMessage({ 
          type: 'error', 
          text: data.detail || 'Failed to mark attendance.'
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error occurred.' });
    } finally {
      setSubmitting(false);
      // Re-fetch registrations to update locked status
      const fetchRegistrations = async () => {
        try {
          const res = await fetch(`${API_URL}/api/admin/events/${selectedEventId}/registrations`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          setRegistrations(data);
          setIsEditing(false);
        } catch(e) {}
      };
      fetchRegistrations();
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    
    const headers = ["Index", "Name", "Email", "Status"];
    const rows = registrations.map((reg, index) => {
      const status = reg.attendance_status || (absentIds.has(reg.id) ? "Absent" : "Present (Pending)");
      return [index + 1, `"${reg.name}"`, reg.email, status].join(",");
    });
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_event_${selectedEventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isSubmitted = registrations.some(r => r.attendance_status);

  if (loading && events.length === 0) {
    return <div className="flex justify-center items-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-12 w-full">
      <div className="flex justify-between items-center mb-8 border-b border-surface-variant pb-6">
        <div>
          <h1 className="font-display-lg text-display-lg font-bold text-on-surface">Attendance Checklist</h1>
          <p className="font-body-md text-on-surface-variant mt-2">Select an event. Tick the box for ABSENT students. Unticked students are marked PRESENT.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={registrations.length === 0}
          className="bg-surface-container-high border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md tracking-wider flex items-center gap-2 hover:bg-surface-variant transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined">download</span>
          Export CSV
        </button>
      </div>

      <div className="bg-surface border border-surface-variant rounded-xl p-8 shadow-sm mb-8">
        <label className="block font-label-sm text-on-surface mb-2 uppercase tracking-wider">Select Event</label>
        <select 
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full border border-outline-variant bg-surface-container-lowest p-3 rounded focus:outline-none focus:border-primary transition-colors"
        >
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title} ({event.status})</option>
          ))}
        </select>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-lg flex items-start gap-3 mb-8 ${statusMessage.type === 'success' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
          <span className="material-symbols-outlined">
            {statusMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="font-body-md font-medium">{statusMessage.text}</span>
        </div>
      )}

      <div className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm">
        {loading ? (
           <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-variant">
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider w-16 text-center">#</th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Student Name</th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">KL ID / Email</th>
                    <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-center">Absent?</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr key={reg.id} className="border-b border-surface-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                      <td className="p-4 font-body-md text-on-surface-variant text-center">{index + 1}</td>
                      <td className="p-4 font-body-md text-on-surface font-medium">{reg.name}</td>
                      <td className="p-4 font-body-md text-on-surface-variant">{reg.email}</td>
                      <td className="p-4 text-center">
                        {isSubmitted && !isEditing ? (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${reg.attendance_status === 'PRESENT' ? 'bg-secondary-container text-on-secondary-container' : reg.attendance_status === 'ABSENT' ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                            {reg.attendance_status || 'PENDING'}
                          </span>
                        ) : (
                          <input 
                            type="checkbox"
                            checked={absentIds.has(reg.id)}
                            onChange={() => handleCheckboxChange(reg.id)}
                            className="w-5 h-5 cursor-pointer accent-error"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                  {registrations.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-on-surface-variant font-body-md">
                        No registrations found for this event yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {(!isSubmitted || isEditing) && registrations.length > 0 && (
              <div className="p-4 border-t border-surface-variant bg-surface-container-lowest flex justify-end items-center">
                {isEditing && (
                   <button 
                     onClick={() => setIsEditing(false)}
                     className="text-on-surface-variant font-label-md mr-6 hover:text-on-surface cursor-pointer"
                   >
                     Cancel
                   </button>
                )}
                <button 
                  onClick={handleBulkSubmit}
                  disabled={submitting}
                  className="bg-primary text-on-primary px-6 py-2 rounded font-label-md tracking-wider uppercase hover:bg-surface-tint disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? 'Processing...' : (isEditing ? 'Save Changes' : 'Submit Attendance')}
                </button>
              </div>
            )}
            {isSubmitted && !isEditing && (
              <div className="p-4 border-t border-surface-variant bg-surface-container-lowest flex justify-between items-center">
                <p className="text-secondary font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined">verified</span>
                  Attendance Posted
                </p>
                <button
                  onClick={handleEditAttendance}
                  className="bg-surface-container-high border border-outline-variant text-on-surface px-4 py-2 rounded font-label-md tracking-wider flex items-center gap-2 hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit Attendance
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;
