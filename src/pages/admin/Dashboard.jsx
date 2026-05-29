import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalComplaints: 0, totalStudents: 0, totalWardens: 0 });
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data);

      const analyticsRes = await api.get('/api/admin/analytics');
      setAnalytics(analyticsRes.data);

      const complaintsRes = await api.get('/api/admin/complaints');
      setComplaints(complaintsRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadMonthlyReport = () => {
    if (!analytics) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text("Hostel Help - Operations Report", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 26);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 30, 190, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("1. Overall Summary Metrics", 20, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Total Complaints Logged: ${analytics.summary.totalComplaints}`, 25, 48);
    doc.text(`Resolved / Closed Complaints: ${analytics.summary.resolvedComplaints}`, 25, 54);
    doc.text(`In Progress / Assigned Complaints: ${analytics.summary.inProgressComplaints}`, 25, 60);
    doc.text(`Pending Actions (New / Reopened): ${analytics.summary.pendingComplaints}`, 25, 66);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("2. Complaints by Category", 20, 80);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text("Category Name", 25, 88);
    doc.text("Count", 130, 88);
    doc.line(20, 91, 190, 91);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    let currentY = 97;
    (analytics.categoryDistribution || []).forEach(cat => {
      doc.text(cat.name, 25, currentY);
      doc.text(String(cat.value), 130, currentY);
      currentY += 7;
    });

    currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("3. Resolution Status Breakdown", 20, currentY);
    currentY += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text("Status", 25, currentY);
    doc.text("Count", 130, currentY);
    doc.line(20, currentY + 3, 190, currentY + 3);
    currentY += 9;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    (analytics.statusDistribution || []).forEach(stat => {
      doc.text(stat.name, 25, currentY);
      doc.text(String(stat.value), 130, currentY);
      currentY += 7;
    });

    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text("Hostel Help - Operations Report", 20, 20);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("4. Warden Leaderboard & Performance", 20, 35);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text("Warden Name", 25, 45);
    doc.text("Resolved", 80, 45);
    doc.text("Total Assigned", 115, 45);
    doc.text("Avg Rating", 155, 45);
    doc.line(20, 48, 190, 48);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    currentY = 54;
    (analytics.wardenPerformance || []).forEach(warden => {
      doc.text(warden.wardenName, 25, currentY);
      doc.text(String(warden.resolved), 80, currentY);
      doc.text(String(warden.totalAssigned), 115, currentY);
      doc.text(`${warden.averageRating} ★`, 155, currentY);
      currentY += 7;
    });

    currentY += 30;
    doc.setDrawColor(203, 213, 225);
    doc.line(120, currentY, 180, currentY);
    doc.setFont("helvetica", "bold");
    doc.text("System Administrator Sign", 120, currentY + 6);

    doc.save("hostel_help_monthly_report.pdf");
  };

  const summary = analytics?.summary || {
    totalComplaints: stats.totalComplaints,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0
  };

  const statCards = [
    { label: 'Total Complaints', value: summary.totalComplaints, color: '#4f46e5', icon: '📋' },
    { label: 'Pending Complaints', value: summary.pendingComplaints, color: '#ef4444', icon: '⏳' },
    { label: 'In Progress', value: summary.inProgressComplaints, color: '#f59e0b', icon: '⚙️' },
    { label: 'Resolved & Closed', value: summary.resolvedComplaints, color: '#10b981', icon: '✅' },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        
        {/* Welcome banner */}
        <div style={{ ...styles.banner, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={styles.bannerTitle}>Hostel Help Analytics & Management Portal 📊</h2>
            <p style={styles.bannerSub}>Monitor room maintenance operations, track resolution velocity, and coordinate warden allocations</p>
          </div>
          <button
            onClick={downloadMonthlyReport}
            style={{
              backgroundColor: '#ffffff',
              color: '#4f46e5',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            📄 Export Report
          </button>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading Dashboard...</p>
        ) : (
          <>
            {/* KPI Cards */}
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
              
              {/* Monthly Trend */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>📈 Monthly Complaint Trends</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={analytics?.monthlyTrends || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="complaints" name="Complaints Filed" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="resolved" name="Complaints Resolved" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Category Pie */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>📂 Distribution by Category</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={analytics?.categoryDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(analytics?.categoryDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Status Doughnut */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>🔄 Complaint Status Ratios</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={analytics?.statusDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {(analytics?.statusDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Warden Leaderboard */}
              <div style={styles.chartCard}>
                <h4 style={styles.chartTitle}>🏆 Warden Resolution Performance</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics?.wardenPerformance || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="wardenName" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="resolved" name="Complaints Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalAssigned" name="Total Assigned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

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
                        <tr key={c.id} style={styles.tr}>
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
    height: '340px',
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
