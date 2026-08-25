import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function TeamManagement({ token }) {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  // Form States
  const [domainForm, setDomainForm] = useState({ name: '', order: 0 });
  const [memberForm, setMemberForm] = useState({ domain_id: '', name: '', student_id: '', role: '', profile_image_url: '', linkedin_url: '' });

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/domains`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDomains(data);
      } else {
        console.error("Failed to fetch domains from admin route");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [token]);

  const handleSaveDomain = async (e) => {
    e.preventDefault();
    const url = editingDomain ? `${API_URL}/api/admin/domains/${editingDomain.id}` : `${API_URL}/api/admin/domains`;
    const method = editingDomain ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(domainForm)
      });
      if (res.ok) {
        setIsDomainModalOpen(false);
        fetchTeam();
      } else {
        const errData = await res.json();
        alert(`Failed to save domain: ${errData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDomain = async (id) => {
    if (!window.confirm("Are you sure? This will delete the domain and all its members.")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/domains/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTeam();
    } catch (err) { console.error(err); }
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    const url = editingMember ? `${API_URL}/api/admin/members/${editingMember.id}` : `${API_URL}/api/admin/members`;
    const method = editingMember ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(memberForm)
      });
      if (res.ok) {
        setIsMemberModalOpen(false);
        fetchTeam();
      } else {
        const errData = await res.json();
        alert(`Failed to save member: ${errData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/members/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTeam();
    } catch (err) { console.error(err); }
  };

  const openDomainModal = (domain = null) => {
    setEditingDomain(domain);
    setDomainForm(domain ? { name: domain.name, order: domain.order } : { name: '', order: 0 });
    setIsDomainModalOpen(true);
  };

  const openMemberModal = (member = null, domainId = '') => {
    setEditingMember(member);
    setMemberForm(member ? 
      { domain_id: member.domain_id, name: member.name, student_id: member.student_id, role: member.role || '', profile_image_url: member.profile_image_url || '', linkedin_url: member.linkedin_url || '' } : 
      { domain_id: domainId || (domains.length > 0 ? domains[0].id : ''), name: '', student_id: '', role: '', profile_image_url: '', linkedin_url: '' }
    );
    setIsMemberModalOpen(true);
  };

  if (loading) return <div className="py-4">Loading team data...</div>;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Team Management</h2>
        <div className="flex gap-4">
          <button onClick={() => openDomainModal()} className="bg-surface-container-high text-on-surface px-4 py-2 rounded font-label-md tracking-wider uppercase flex items-center gap-2 border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">add</span> Add Domain
          </button>
          <button onClick={() => openMemberModal()} disabled={domains.length === 0} className={`px-4 py-2 rounded font-label-md tracking-wider uppercase flex items-center gap-2 ${domains.length === 0 ? 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-surface-tint cursor-pointer'}`}>
            <span className="material-symbols-outlined text-sm">person_add</span> Add Member
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {domains.length === 0 ? (
          <div className="bg-surface border border-surface-variant border-dashed rounded-xl p-8 text-center text-on-surface-variant font-body-md">
            No domains found. Create a domain (e.g., "ZERO ORDER") to start adding members.
          </div>
        ) : (
          domains.map(domain => (
            <div key={domain.id} className="bg-surface border border-surface-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low p-4 flex justify-between items-center border-b border-surface-variant">
                <h3 className="font-headline-sm text-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">stars</span>
                  {domain.name} <span className="text-sm font-normal text-on-surface-variant ml-2">(Order: {domain.order})</span>
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => openMemberModal(null, domain.id)} className="text-primary hover:bg-primary-container p-2 rounded transition-colors" title="Add Member to Domain">
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                  </button>
                  <button onClick={() => openDomainModal(domain)} className="text-tertiary hover:bg-surface-container p-2 rounded transition-colors">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => handleDeleteDomain(domain.id)} className="text-error hover:bg-error-container p-2 rounded transition-colors">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-surface-variant">
                      <th className="p-3 font-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
                      <th className="p-3 font-label-sm text-on-surface-variant uppercase tracking-wider">ID</th>
                      <th className="p-3 font-label-sm text-on-surface-variant uppercase tracking-wider">Role</th>
                      <th className="p-3 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domain.members && domain.members.length > 0 ? (
                      domain.members.map(member => (
                        <tr key={member.id} className="border-b border-surface-variant last:border-0 hover:bg-surface-container-lowest">
                          <td className="p-3 font-body-md text-on-surface font-medium">{member.name}</td>
                          <td className="p-3 font-body-md text-on-surface-variant font-mono">{member.student_id}</td>
                          <td className="p-3 font-body-md text-on-surface-variant">{member.role || '-'}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => openMemberModal(member)} className="text-tertiary hover:text-on-surface p-1 rounded">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onClick={() => handleDeleteMember(member.id)} className="text-error hover:text-on-error p-1 rounded">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-sm text-on-surface-variant">No members in this domain yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Domain Modal */}
      {isDomainModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-surface rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{editingDomain ? 'Edit Domain' : 'Add Domain'}</h2>
              <button onClick={() => setIsDomainModalOpen(false)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-variant transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveDomain} className="p-6 space-y-4">
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Domain Name *</label>
                <input required type="text" value={domainForm.name} onChange={(e) => setDomainForm({...domainForm, name: e.target.value})} className="w-full p-3 bg-surface border border-outline rounded text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="e.g. ZERO ORDER" />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Display Order</label>
                <input type="number" value={domainForm.order} onChange={(e) => setDomainForm({...domainForm, order: parseInt(e.target.value) || 0})} className="w-full p-3 bg-surface border border-outline rounded text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="1" />
                <p className="text-xs text-on-surface-variant mt-1">Controls which domain appears first on the public Team page (e.g., 1 is first, 2 is second).</p>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsDomainModalOpen(false)} className="px-6 py-2 text-on-surface-variant hover:bg-surface-variant rounded font-label-md uppercase tracking-wider transition-colors">Cancel</button>
                <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded font-label-md uppercase tracking-wider hover:bg-surface-tint transition-colors shadow-sm">{editingDomain ? 'Save Changes' : 'Create Domain'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-surface rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{editingMember ? 'Edit Member' : 'Add Member'}</h2>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-variant transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveMember} className="p-6 space-y-4">
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Domain / Wing *</label>
                <select required value={memberForm.domain_id} onChange={(e) => setMemberForm({...memberForm, domain_id: e.target.value})} className="w-full p-3 bg-surface border border-outline rounded text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Full Name *</label>
                  <input required type="text" value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} className="w-full p-3 bg-surface border border-outline rounded text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Student ID *</label>
                  <input required type="text" value={memberForm.student_id} onChange={(e) => setMemberForm({...memberForm, student_id: e.target.value})} className="w-full p-3 bg-surface border border-outline rounded text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Role (Optional)</label>
                <input type="text" value={memberForm.role} onChange={(e) => setMemberForm({...memberForm, role: e.target.value})} className="w-full p-3 bg-surface border border-outline rounded text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="e.g. Lead, Core Member" />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">LinkedIn URL (Optional)</label>
                <input type="url" value={memberForm.linkedin_url} onChange={(e) => setMemberForm({...memberForm, linkedin_url: e.target.value})} className="w-full p-3 bg-surface border border-outline rounded text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-2">Profile Image URL (Optional)</label>
                <input type="url" value={memberForm.profile_image_url} onChange={(e) => setMemberForm({...memberForm, profile_image_url: e.target.value})} className="w-full p-3 bg-surface border border-outline rounded text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" placeholder="https://..." />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="px-6 py-2 text-on-surface-variant hover:bg-surface-variant rounded font-label-md uppercase tracking-wider transition-colors">Cancel</button>
                <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded font-label-md uppercase tracking-wider hover:bg-surface-tint transition-colors shadow-sm">{editingMember ? 'Save Changes' : 'Create Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
