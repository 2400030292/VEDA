import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function Resources() {
  const [documents, setDocuments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, eventsRes] = await Promise.all([
          fetch(`${API_URL}/api/documents`),
          fetch(`${API_URL}/api/events`)
        ]);
        
        if (docsRes.ok) setDocuments(await docsRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
      } catch (err) {
        console.error("Failed to load resources", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 w-full">
      <div className="mb-12 text-center md:text-left">
        <h1 className="font-display-lg text-display-lg font-bold text-on-surface">Study Materials & Resources</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl">
          Download past event presentations, reference materials, and official documentation provided by KL IRD clubs.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="bg-surface border border-surface-variant rounded-xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-6xl text-tertiary mb-4">folder_open</span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No Resources Available</h3>
          <p className="font-body-md text-on-surface-variant">Check back later for new materials and downloads!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => {
            const linkedEvent = events.find(e => e.id === doc.event_id);
            return (
              <a 
                key={doc.id}
                href={`${API_URL}${doc.file_url}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-surface border border-surface-variant rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">
                      {doc.file_name.toLowerCase().endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-tertiary group-hover:text-primary transition-colors">download</span>
                </div>
                
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {doc.file_name}
                </h3>
                
                <div className="mt-auto pt-4 flex flex-col gap-2">
                  {linkedEvent && (
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-sm uppercase tracking-wider text-xs">
                      <span className="material-symbols-outlined text-[16px]">event</span>
                      <span className="truncate">{linkedEvent.title}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-tertiary font-label-sm uppercase tracking-wider text-xs">
                    <span className="material-symbols-outlined text-[16px]">sd_storage</span>
                    <span>{formatBytes(doc.file_size)}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Resources;
