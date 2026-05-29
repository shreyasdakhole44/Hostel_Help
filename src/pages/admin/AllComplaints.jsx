import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWardenMap, setSelectedWardenMap] = useState({}); // complaintId -> selectedWardenId
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingMap, setActionLoadingMap] = useState({}); // complaintId -> boolean

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [compRes, wardenRes, catRes] = await Promise.all([
        api.get('/api/admin/complaints'),
        api.get('/api/admin/users/warden'),
        api.get('/api/admin/categories'),
      ]);
      setComplaints(compRes.data);
      setWardens(wardenRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching admin complaints data', err);
      toast.error('Failed to load complaints management data.');
    } finally {
      setLoading(false);
    }
  };

  const handleWardenSelect = (complaintId, wardenId) => {
    setSelectedWardenMap(prev => ({
      ...prev,
      [complaintId]: wardenId,
    }));
  };

  const handleAssignWarden = async (complaintId) => {
    const wardenId = selectedWardenMap[complaintId];
    if (!wardenId) {
      toast.warning('Please select a warden first');
      return;
    }

    setActionLoadingMap(prev => ({ ...prev, [complaintId]: true }));
    try {
      const res = await api.put(`/api/admin/complaints/${complaintId}/assign`, {
        wardenId: parseInt(wardenId),
      });
      
      // Update local state
      setComplaints(prev => prev.map(c => c.id === complaintId ? res.data : c));
      toast.success(`Complaint #${complaintId} assigned successfully!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign warden';
      toast.error(msg);
    } finally {
      setActionLoadingMap(prev => ({ ...prev, [complaintId]: false }));
    }
  };

  // filter logic
  const filtered = complaints.filter(c => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.categoryName === categoryFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.wardenName && c.wardenName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const statuses = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

  return (
    <div style={styles.page}>
      <div className="print:hidden">
        <Navbar />
      </div>
      <div style={styles.content} className="print-area">
        
        {/* Printable Report Header (Visible only in PDF/Print) */}
        <div className="hidden print:block" style={{ borderBottom: '2px solid #4f46e5', paddingBottom: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#4f46e5', margin: 0 }}>🏠 Hostel Help</h1>
              <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0 0 0' }}>Official Hostel Complaints Resolution Summary Report</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Generated on: {new Date().toLocaleString()}</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Filters: Status [{statusFilter}], Category [{categoryFilter}]</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '32px', marginTop: '16px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Total Filtered</span>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{filtered.length} Complaints</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Pending Action</span>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#d97706', margin: 0 }}>{filtered.filter(c => c.status === 'PENDING').length}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>In Progress</span>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#7c3aed', margin: 0 }}>{filtered.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Resolved Cases</span>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#059669', margin: 0 }}>{filtered.filter(c => c.status === 'RESOLVED').length}</p>
            </div>
          </div>
        </div>

        <div style={styles.header} className="print:hidden">
          <h2 style={styles.title}>All Hostel Complaints</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by title, student or warden..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBar}
            />
            <button
              onClick={() => window.print()}
              style={{
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.1), 0 2px 4px -1px rgba(124, 58, 237, 0.06)'
              }}
              className="hover-btn"
            >
              <span>📊</span> Export PDF Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersBar} className="print:hidden">
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={styles.select}
            >
              <option value="ALL">ALL CATEGORIES</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <p style={styles.loading}>Loading complaints...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>📭</p>
            <p style={styles.emptyText}>No complaints match the criteria.</p>
          </div>
        ) : (
          <div style={styles.tableContainer} className="print-clean">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Title & Details</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Warden</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Submitted</th>
                  <th style={styles.th} className="print:hidden">Assignment Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const isAssigning = actionLoadingMap[c.id];
                  const hasWarden = !!c.wardenName;

                  return (
                    <tr key={c.id} style={styles.tr}>
                      <td style={styles.td}>#{c.id}</td>
                      <td style={styles.td}>
                        <div style={styles.titleCol}>
                          <span style={styles.complaintTitle}>{c.title}</span>
                          <span style={styles.complaintDesc}>{c.description.substring(0, 100)}{c.description.length > 100 ? '...' : ''}</span>
                          {c.wardenRemark && (
                            <span style={styles.remarkSnippet}>💬 <strong>Remark:</strong> {c.wardenRemark}</span>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>{c.categoryName || '—'}</td>
                      <td style={styles.td}>{c.studentName}</td>
                      <td style={styles.td}>
                        {hasWarden ? (
                          <span style={{fontWeight: '600', color: '#1e293b'}}>{c.wardenName}</span>
                        ) : (
                          <span style={{color: '#94a3b8', fontStyle: 'italic'}}>Unassigned</span>
                        )}
                      </td>
                      <td style={styles.td}><StatusBadge status={c.status} /></td>
                      <td style={styles.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td} className="print:hidden">
                        {c.status === 'PENDING' ? (
                          <div style={styles.assignForm}>
                            <select
                              value={selectedWardenMap[c.id] || ''}
                              onChange={(e) => handleWardenSelect(c.id, e.target.value)}
                              style={styles.assignSelect}
                            >
                              <option value="">-- Choose Warden --</option>
                              {wardens.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignWarden(c.id)}
                              disabled={isAssigning}
                              style={styles.assignBtn}
                            >
                              {isAssigning ? '...' : 'Assign'}
                            </button>
                          </div>
                        ) : (
                          <span style={styles.completedAssign}>Already Assigned</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 },
  headerActions: {},
  searchBar: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '14px', width: '320px' },
  filtersBar: { display: 'flex', gap: '20px', backgroundColor: '#fff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '24px', flexWrap: 'wrap' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  filterLabel: { fontSize: '13px', fontWeight: '600', color: '#64748b' },
  select: { padding: '8px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', backgroundColor: '#f8fafc', color: '#334155', fontWeight: '600' },
  loading: { textAlign: 'center', color: '#64748b', padding: '40px' },
  emptyBox: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' },
  emptyIcon: { fontSize: '48px', margin: '0 0 12px 0' },
  emptyText: { color: '#64748b', fontSize: '16px', margin: 0 },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflowX: 'auto',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px 20px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' },
  td: { padding: '16px 20px', color: '#334155', fontSize: '14px', verticalAlign: 'top' },
  titleCol: { display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' },
  complaintTitle: { fontWeight: '700', color: '#1e293b' },
  complaintDesc: { fontSize: '12px', color: '#64748b', lineHeight: '1.4' },
  remarkSnippet: { fontSize: '12px', color: '#0369a1', marginTop: '4px', backgroundColor: '#e0f2fe', padding: '4px 8px', borderRadius: '4px' },
  assignForm: { display: 'flex', gap: '6px' },
  assignSelect: { padding: '6px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' },
  assignBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
  completedAssign: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' },
};

export default AllComplaints;
