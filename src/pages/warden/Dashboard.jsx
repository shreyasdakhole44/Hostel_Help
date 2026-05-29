import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6'];
const STATUS_COLORS = {
  PENDING: '#f59e0b',
  ASSIGNED: '#3b82f6',
  IN_PROGRESS: '#8b5cf6',
  RESOLVED_PENDING: '#10b981',
  CLOSED: '#64748b',
  REOPENED: '#ef4444'
};

const WardenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const complaintsRes = await api.get('/api/warden/complaints');
      setComplaints(complaintsRes.data);

      const analyticsRes = await api.get('/api/warden/analytics');
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Error fetching warden dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const summary = analytics?.summary || {
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    averageRating: 0.0
  };

  const statCards = [
    { label: 'Assigned Complaints', value: summary.totalComplaints, color: '#3b82f6', icon: '📥' },
    { label: 'Pending Action', value: summary.pendingComplaints, color: '#ef4444', icon: '⏳' },
    { label: 'Resolved Complaints', value: summary.resolvedComplaints, color: '#10b981', icon: '✅' },
    { label: 'Average Rating', value: `${summary.averageRating} ★`, color: '#f59e0b', icon: '⭐' },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        
        {/* Welcome banner */}
        <div style={styles.banner}>
          <div>
            <h2 style={styles.bannerTitle}>Welcome back, Warden {user?.name}! 👋</h2>
            <p style={styles.bannerSub}>Review, update, and finalize complaints submitted in your assigned hostels.</p>
          </div>
          <button
            onClick={() => navigate('/warden/complaints')}
            style={styles.actionBtn}
          >
            Manage complaints
          </button>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading Dashboard...</p>
        ) : (
          <>
            {/* Stats */}
            <div style={styles.grid}>
              {statCards.map((card) => (
                <div key={card.label} style={styles.card}>
                  <div style={styles.cardLeft}>
                    <p style={styles.cardLabel}>{card.label}</p>
                    <p style={{ ...styles.cardValue, color: card.color }}>{card.value}</p>
                  </div>
                  <span style={styles.cardIcon}>{card.icon}</span>
                </div>
              ))}
            </div>

            {/* Charts section */}
            <div style={styles.chartsGrid}>
              
              {/* Category Pie */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>📂 Category Distribution</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics?.categoryDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {(analytics?.categoryDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Status Doughnut */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>🔄 Complaint Status Ratios</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics?.statusDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {(analytics?.statusDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Complaints list */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Recent Assigned Complaints</h3>
                <span style={styles.viewAll} onClick={() => navigate('/warden/complaints')}>View All →</span>
              </div>

              {complaints.length === 0 ? (
                <div style={styles.emptyBox}>
                  <p style={styles.emptyIcon}>🎉</p>
                  <p style={styles.emptyText}>No complaints assigned to you!</p>
                </div>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Title</th>
                        <th style={styles.th}>Category</th>
                        <th style={styles.th}>Student</th>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 5).map((c) => (
                        <tr key={c.id} style={styles.tr}>
                          <td style={styles.td}>#{c.id}</td>
                          <td style={{ ...styles.td, fontWeight: '600' }}>{c.title}</td>
                          <td style={styles.td}>{c.categoryName}</td>
                          <td style={styles.td}>{c.studentName}</td>
                          <td style={styles.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
                          <td style={styles.td}><StatusBadge status={c.status} /></td>
                          <td style={styles.td}>
                            <button
                              onClick={() => navigate(`/warden/complaints/${c.id}`)}
                              style={styles.viewBtn}
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
    backgroundColor: '#0ea5e9',
    borderRadius: '12px',
    padding: '28px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  bannerTitle: { color: '#fff', fontSize: '22px', fontWeight: '700', margin: 0 },
  bannerSub: { color: '#e0f2fe', fontSize: '14px', margin: '6px 0 0 0' },
  actionBtn: {
    backgroundColor: '#fff',
    color: '#0284c7',
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
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  cardLeft: {},
  cardLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600', margin: '0 0 6px 0' },
  cardValue: { fontSize: '28px', fontWeight: '800', margin: 0 },
  cardIcon: { fontSize: '32px' },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    height: '330px',
  },
  chartTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
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
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px 20px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' },
  td: { padding: '16px 20px', color: '#334155', fontSize: '14px' },
  viewBtn: {
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

export default WardenDashboard;
