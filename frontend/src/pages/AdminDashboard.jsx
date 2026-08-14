import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventFormModal from '../components/EventFormModal';
import DocumentUploadModal from '../components/DocumentUploadModal';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  const fetchData = async () => {
    try {
      const statsRes = await fetch('http://localhost:8000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const eventsRes = await fetch('http://localhost:8000/api/admin/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const docsRes = await fetch('http://localhost:8000/api/admin/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!statsRes.ok || !eventsRes.ok || !docsRes.ok) throw new Error("Failed to fetch dashboard data");

      setStats(await statsRes.json());
      setEvents(await eventsRes.json());
      setDocuments(await docsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleCreateEvent = () => {
    setEventToEdit(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setIsEventModalOpen(true);
  };
  
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This will permanently delete all registrations and attendance records associated with it!")) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete event");
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/admin/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete document");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  // Format file size
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display-lg text-display-lg font-bold text-on-surface">Admin Dashboard</h1>
          <p className="font-body-md text-on-surface-variant mt-2">Manage events, attendance, and settings.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-error hover:bg-error-container rounded transition-colors font-label-md tracking-wider uppercase flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span> Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface border border-surface-variant p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Events</h3>
            <span className="material-symbols-outlined text-primary">event</span>
          </div>
          <p className="font-display-md text-display-md font-bold text-on-surface">{stats?.total_events || 0}</p>
        </div>
        <div className="bg-surface border border-surface-variant p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Registrations</h3>
            <span className="material-symbols-outlined text-secondary">group</span>
          </div>
          <p className="font-display-md text-display-md font-bold text-on-surface">{stats?.total_registrations || 0}</p>
        </div>
        <div className="bg-surface border border-surface-variant p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Attendance Rate</h3>
            <span className="material-symbols-outlined text-tertiary">how_to_reg</span>
          </div>
          <p className="font-display-md text-display-md font-bold text-on-surface">{stats?.overall_attendance_rate ? `${(stats.overall_attendance_rate * 100).toFixed(1)}%` : '0%'}</p>
        </div>
        <div className="bg-surface border border-surface-variant p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Events</h3>
            <span className="material-symbols-outlined text-primary">notifications_active</span>
          </div>
          <p className="font-display-md text-display-md font-bold text-on-surface">{stats?.active_events || 0}</p>
        </div>
      </div>

      {/* Events List */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Event Management</h2>
          <button 
            onClick={handleCreateEvent}
            className="bg-primary text-on-primary px-4 py-2 rounded font-label-md tracking-wider uppercase flex items-center gap-2 hover:bg-surface-tint cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span> New Event
          </button>
        </div>

        <div className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-variant">
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Event Name</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-surface-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 font-body-md text-on-surface font-medium">{event.title}</td>
                    <td className="p-4 font-body-md text-on-surface-variant">{event.event_date || 'TBD'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-label-md uppercase tracking-wider ${event.status === 'PUBLISHED' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 flex justify-end">
                      <button 
                        onClick={() => handleEditEvent(event)}
                        className="text-tertiary hover:text-on-surface transition-colors p-2 rounded hover:bg-surface-container cursor-pointer"
                        title="Edit Event"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-error hover:text-on-error hover:bg-error-container transition-colors p-2 rounded cursor-pointer"
                        title="Delete Event"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-on-surface-variant font-body-md">
                      No events found. Click "New Event" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Document Management List */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Document & File Management</h2>
          <button 
            onClick={() => setIsDocModalOpen(true)}
            className="bg-primary text-on-primary px-4 py-2 rounded font-label-md tracking-wider uppercase flex items-center gap-2 hover:bg-surface-tint cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span> Upload Document
          </button>
        </div>

        <div className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-variant">
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">File Name</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Size</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Visibility</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Related Event</th>
                  <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const linkedEvent = events.find(e => e.id === doc.event_id);
                  return (
                    <tr key={doc.id} className="border-b border-surface-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                      <td className="p-4 font-body-md text-on-surface font-medium max-w-[200px] truncate" title={doc.file_name}>
                        <a href={`http://localhost:8000${doc.file_url}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">description</span>
                          {doc.file_name}
                        </a>
                      </td>
                      <td className="p-4 font-body-md text-on-surface-variant">{formatBytes(doc.file_size)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-label-md uppercase tracking-wider ${doc.visibility === 'PUBLIC' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                          {doc.visibility}
                        </span>
                      </td>
                      <td className="p-4 font-body-md text-on-surface-variant">{linkedEvent ? linkedEvent.title : '-'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-error hover:text-on-error hover:bg-error transition-colors p-2 rounded cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-on-surface-variant font-body-md">
                      No documents found. Click "Upload Document" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <EventFormModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        eventToEdit={eventToEdit}
        onSave={fetchData}
      />
      
      <DocumentUploadModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSave={fetchData}
      />
    </div>
  );
}

export default AdminDashboard;
