import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/student/complaints');
      const complaintsData = res.data;
      setComplaints(complaintsData);
      setStats({
        total: complaintsData.length,
        pending: complaintsData.filter(c => c.status === 'PENDING').length,
        inProgress: complaintsData.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length,
        resolved: complaintsData.filter(c => c.status === 'RESOLVED').length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Total Complaints', value: stats.total, color: '#4f46e5', icon: '📋' },
    { label: 'Pending', value: stats.pending, color: '#d97706', icon: '⏳' },
    { label: 'In Progress', value: stats.inProgress, color: '#7c3aed', icon: '🔧' },
    { label: 'Resolved', value: stats.resolved, color: '#059669', icon: '✅' },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        {/* Welcome banner */}
        <div style={styles.banner} className="gradient-indigo">
          <div>
            <h2 style={styles.bannerTitle}>Welcome back, {user?.name}! 👋</h2>
            <p style={styles.bannerSub}>Here is a summary of your complaints</p>
          </div>
          <button
            onClick={() => navigate('/student/complaints/new')}
            style={styles.newBtn}
            className="hover-btn"
          >
            + New Complaint
          </button>
        </div>

        {/* Stats cards */}
        {loading ? (
          <p style={styles.loading}>Loading Dashboard...</p>
        ) : (
          <>
            <div style={styles.grid}>
              {cards.map((card) => (
                <div key={card.label} style={styles.card} className="hover-card">
                  <div style={styles.cardLeft}>
                    <p style={styles.cardLabel}>{card.label}</p>
                    <p style={{ ...styles.cardValue, color: card.color }}>{card.value}</p>
                  </div>
                  <span style={styles.cardIcon}>{card.icon}</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={styles.actions}>
              <h3 style={styles.sectionTitle}>Quick Actions</h3>
              <div style={styles.actionGrid}>
                <div
                  style={styles.actionCard}
                  onClick={() => navigate('/student/complaints/new')}
                  className="hover-card"
                >
                  <span style={styles.actionIcon}>📝</span>
                  <p style={styles.actionLabel}>Submit Complaint</p>
                  <p style={styles.actionDesc}>Report a new issue in your room or hostel</p>
                </div>
                <div
                  style={styles.actionCard}
                  onClick={() => navigate('/student/complaints')}
                  className="hover-card"
                >
                  <span style={styles.actionIcon}>📋</span>
                  <p style={styles.actionLabel}>View My Complaints</p>
                  <p style={styles.actionDesc}>Track status of all your complaints</p>
                </div>
              </div>
            </div>

            {/* Recent complaints table */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>My Recent Complaints</h3>
                <span style={styles.viewAll} onClick={() => navigate('/student/complaints')}>View All →</span>
              </div>

              {complaints.length === 0 ? (
                <div style={styles.emptyBox}>
                  <p style={styles.emptyIcon}>🎉</p>
                  <p style={styles.emptyText}>No complaints reported yet. Need something fixed? Click "Submit Complaint"!</p>
                </div>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Title</th>
                        <th style={styles.th}>Category</th>
                        <th style={styles.th}>Date Submitted</th>
                        <th style={styles.th}>Assigned Warden</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 5).map((c) => (
                        <tr key={c.id} style={styles.tr} className="hover-row">
                          <td style={styles.td}>#{c.id}</td>
                          <td style={{ ...styles.td, fontWeight: '600' }}>{c.title}</td>
                          <td style={styles.td}>{c.categoryName || '—'}</td>
                          <td style={styles.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                          <td style={styles.td}>
                            {c.wardenName ? (
                              <span style={{ fontWeight: '500' }}>👷 {c.wardenName}</span>
                            ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not assigned yet</span>
                            )}
                          </td>
                          <td style={styles.td}><StatusBadge status={c.status} /></td>
                          <td style={styles.td}>
                            <button
                              onClick={() => navigate(`/student/complaints/${c.id}`)}
                              style={styles.detailsBtn}
                              className="hover-btn"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  banner: {
    backgroundColor: '#4f46e5',
    borderRadius: '12px',
    padding: '28px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  bannerTitle: { color: '#fff', fontSize: '22px', fontWeight: '700', margin: 0 },
  bannerSub: { color: '#c7d2fe', fontSize: '14px', margin: '6px 0 0 0' },
  newBtn: {
    backgroundColor: '#fff',
    color: '#4f46e5',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
  },
  loading: { textAlign: 'center', color: '#64748b', padding: '40px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    border: '1px solid #e2e8f0',
  },
  cardLeft: {},
  cardLabel: { fontSize: '13px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' },
  cardValue: { fontSize: '32px', fontWeight: '800', margin: 0 },
  cardIcon: { fontSize: '36px' },
  actions: { marginTop: '8px' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '16px',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    border: '1px solid #e2e8f0',
  },
  actionIcon: { fontSize: '32px' },
  actionLabel: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '10px 0 4px 0' },
  actionDesc: { fontSize: '13px', color: '#64748b', margin: 0 },

  section: { marginTop: '32px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  viewAll: { fontSize: '14px', fontWeight: '600', color: '#4f46e5', cursor: 'pointer' },
  emptyBox: { textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' },
  emptyIcon: { fontSize: '40px', margin: '0 0 8px 0' },
  emptyText: { color: '#64748b', fontSize: '14px', margin: 0 },
  tableContainer: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '14px 18px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' },
  td: { padding: '14px 18px', color: '#334155', fontSize: '14px', verticalAlign: 'middle' },
  detailsBtn: {
    backgroundColor: '#f5f3ff',
    color: '#4f46e5',
    border: '1px solid #ddd6fe',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default StudentDashboard;