import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const AssignedComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/api/warden/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to load warden complaints', err);
    } finally {
      setLoading(false);
    }
  };

  // filter logic
  const filtered = complaints.filter(c => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.categoryName && c.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const filterTabs = ['ALL', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>Assigned Complaints</h2>
          <input
            type="text"
            placeholder="Search by title, student or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchBar}
          />
        </div>

        {/* Status filters */}
        <div style={styles.filters}>
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                ...styles.filterBtn,
                backgroundColor: statusFilter === tab ? '#4f46e5' : '#fff',
                color: statusFilter === tab ? '#fff' : '#64748b',
                borderColor: statusFilter === tab ? '#4f46e5' : '#e2e8f0',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Complaints list */}
        {loading ? (
          <p style={styles.loading}>Loading complaints...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <Inbox size={48} style={{ color: '#94a3b8', marginBottom: '12px' }} />
            <p style={styles.emptyText}>No assigned complaints found.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map(c => (
              <div
                key={c.id}
                style={styles.card}
                onClick={() => navigate(`/warden/complaints/${c.id}`)}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{c.title}</h3>
                    <p style={styles.cardMeta}>
                      Student: <span style={{fontWeight: '600'}}>{c.studentName}</span> &nbsp;•&nbsp;
                      Category: {c.categoryName} &nbsp;•&nbsp;
                      Submitted: {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p style={styles.cardDesc}>{c.description}</p>
                {c.wardenRemark && (
                  <div style={styles.remarkSnippet}>
                    <strong>My Remark:</strong> {c.wardenRemark}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content: { maxWidth: '950px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 },
  searchBar: { padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '14px', width: '320px', transition: 'border 0.2s' },
  filters: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  filterBtn: { padding: '8px 18px', borderRadius: '20px', border: '1px solid', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  loading: { textAlign: 'center', color: '#64748b', padding: '40px' },
  emptyBox: { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' },
  emptyIcon: { fontSize: '48px', margin: '0 0 12px 0' },
  emptyText: { color: '#64748b', fontSize: '16px', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px 0' },
  cardMeta: { fontSize: '13px', color: '#64748b', margin: 0 },
  cardDesc: { fontSize: '14px', color: '#334155', margin: '0 0 12px 0', lineHeight: '1.6' },
  remarkSnippet: { backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#475569', borderLeft: '3px solid #cbd5e1' },
};

export default AssignedComplaints;
