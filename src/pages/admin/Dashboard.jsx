import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalComplaints: 0, totalStudents: 0, totalWardens: 0 });
  const [complaints, setComplaints] = useState([]);
  const [detailedStats, setDetailedStats] = useState({ pending: 0, resolved: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get base counts
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);

      // Get complaints to calculate status summaries
      const complaintsRes = await api.get('/api/admin/complaints');
      const data = complaintsRes.data;
      setComplaints(data);
      
      setDetailedStats({
        pending: data.filter(c => c.status === 'PENDING').length,
        inProgress: data.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length,
        resolved: data.filter(c => c.status === 'RESOLVED').length,
      });

    } catch (err) {
      console.error('Error fetching admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Complaints', value: stats.totalComplaints, color: '#4f46e5', icon: '📋' },
    { label: 'Pending Complaints', value: detailedStats.pending, color: '#d97706', icon: '⏳' },
    { label: 'Total Students', value: stats.totalStudents, color: '#0ea5e9', icon: '🎓' },
    { label: 'Total Wardens', value: stats.totalWardens, color: '#7c3aed', icon: '👷' },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        
        {/* Welcome banner */}
        <div style={styles.banner} className="gradient-indigo">
          <div>
            <h2 style={styles.bannerTitle}>Portal Administrator Dashboard 🛠️</h2>
            <p style={styles.bannerSub}>Monitor site activity, assign wardens to categories, and manage student reports</p>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <p style={styles.loading}>Loading Dashboard...</p>
        ) : (
          <>
            <div style={styles.grid}>
              {statCards.map((card) => (
                <div key={card.label} style={styles.card} className="hover-card">
                  <div style={styles.cardLeft}>
                    <p style={styles.cardLabel}>{card.label}</p>
                    <p style={{ ...styles.cardValue, color: card.color }}>{card.value}</p>
                  </div>
                  <span style={styles.cardIcon}>{card.icon}</span>
                </div>
              ))}
            </div>

            {/* Complaints list */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Recent Hostel Complaints</h3>
                <span style={styles.viewAll} onClick={() => navigate('/admin/complaints')}>View All →</span>
              </div>

              {complaints.length === 0 ? (
                <div style={styles.emptyBox}>
                  <p style={styles.emptyIcon}>🎉</p>
                  <p style={styles.emptyText}>No complaints reported yet.</p>
                </div>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Title</th>
                        <th style={styles.th}>Category</th>
                        <th style={styles.th}>Student Name</th>
                        <th style={styles.th}>Warden</th>
                        <th style={styles.th}>Date Submitted</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 5).map((c) => (
                        <tr key={c.id} style={styles.tr} className="hover-row">
                          <td style={styles.td}>#{c.id}</td>
                          <td style={{ ...styles.td, fontWeight: '600' }}>{c.title}</td>
                          <td style={styles.td}>{c.categoryName || 'Uncategorized'}</td>
                          <td style={styles.td}>{c.studentName}</td>
                          <td style={styles.td}>{c.wardenName || <span style={{color: '#94a3b8', fontStyle: 'italic'}}>Unassigned</span>}</td>
                          <td style={styles.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                          <td style={styles.td}><StatusBadge status={c.status} /></td>
                          <td style={styles.td}>
                            <button
                              onClick={() => navigate('/admin/complaints')}
                              style={styles.actionBtn}
                              className="hover-btn"
                            >
                              Manage
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
  content: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  banner: {
    backgroundColor: '#4f46e5',
    borderRadius: '12px',
    padding: '28px 32px',
    marginBottom: '28px',
  },
  bannerTitle: { color: '#fff', fontSize: '22px', fontWeight: '700', margin: 0 },
  bannerSub: { color: '#c7d2fe', fontSize: '14px', margin: '6px 0 0 0' },
  loading: { textAlign: 'center', color: '#64748b', padding: '40px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  },
  cardLeft: {},
  cardLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600', margin: '0 0 6px 0' },
  cardValue: { fontSize: '32px', fontWeight: '800', margin: 0 },
  cardIcon: { fontSize: '36px' },
  section: { marginTop: '8px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 },
  viewAll: { fontSize: '14px', fontWeight: '600', color: '#4f46e5', cursor: 'pointer' },
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
  td: { padding: '16px 20px', color: '#334155', fontSize: '14px' },
  actionBtn: {
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

export default AdminDashboard;
