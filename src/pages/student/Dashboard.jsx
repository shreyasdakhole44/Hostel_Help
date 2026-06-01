import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import PortalLayout from '../../components/PortalLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { THEME } from '../../theme';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await complaintService.getStudentComplaints();
        setComplaints(data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'PENDING').length;
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;

  const getPercentage = (count) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <PortalLayout title="Student Dashboard" breadcrumbs={['Dashboard']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Top greeting */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
              Good morning, {user?.name || 'Student'}! 👋
            </h2>
            <p style={{ fontSize: '14px', color: THEME.colors.gray500, margin: '4px 0 0 0', fontWeight: '500' }}>
              {formattedDate}
            </p>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <StatCard
              icon="📋"
              label="Total Complaints"
              value={total}
              percentage={12}
              trendUp={true}
              timeframe="vs last month"
            />
            <StatCard
              icon="⏳"
              label="Pending"
              value={pending}
              percentage={4}
              trendUp={false}
              timeframe="vs last month"
            />
            <StatCard
              icon="🔧"
              label="In Progress"
              value={inProgress}
              percentage={8}
              trendUp={true}
              timeframe="vs last month"
            />
            <StatCard
              icon="✅"
              label="Resolved"
              value={resolved}
              percentage={15}
              trendUp={true}
              timeframe="vs last month"
            />
          </div>

          {/* 70/30 Split Section */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              width: '100%'
            }}
          >
            {/* Left 70% Recent Complaints */}
            <div
              style={{
                flex: '2 1 600px',
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: THEME.colors.gray900, margin: 0 }}>
                  Recent Complaints
                </h3>
                <span
                  onClick={() => navigate('/student/complaints')}
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: THEME.colors.purple600,
                    cursor: 'pointer',
                    transition: THEME.transition
                  }}
                  onMouseEnter={(e) => { e.target.style.color = THEME.colors.purple700; }}
                  onMouseLeave={(e) => { e.target.style.color = THEME.colors.purple600; }}
                >
                  View All →
                </span>
              </div>

              {complaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: THEME.colors.gray500 }}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🎉</span>
                  No complaints reported yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${THEME.colors.gray100}` }}>
                        <th style={{ padding: '12px 16px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Title</th>
                        <th style={{ padding: '12px 16px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Category</th>
                        <th style={{ padding: '12px 16px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '12px 16px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Date</th>
                        <th style={{ padding: '12px 16px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 5).map((comp) => (
                        <tr
                          key={comp.id}
                          style={{
                            borderBottom: `1px solid ${THEME.colors.gray50}`,
                            transition: THEME.transition
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.gray50; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <td style={{ padding: '14px 16px', fontWeight: '600', color: THEME.colors.gray900 }}>{comp.title}</td>
                          <td style={{ padding: '14px 16px', color: THEME.colors.gray700 }}>{comp.categoryName || 'General'}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <StatusBadge status={comp.status} />
                          </td>
                          <td style={{ padding: '14px 16px', color: THEME.colors.gray500 }}>
                            {new Date(comp.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <button
                              onClick={() => navigate(`/student/complaints/${comp.id}`)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: THEME.colors.purple600,
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                              onMouseEnter={(e) => { e.target.style.color = THEME.colors.purple700; }}
                              onMouseLeave={(e) => { e.target.style.color = THEME.colors.purple600; }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right 30% Quick Stats */}
            <div
              style={{
                flex: '1 1 300px',
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: THEME.colors.gray900, margin: 0 }}>
                Complaints by Status
              </h3>

              {/* Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Pending', count: pending, color: THEME.colors.yellow500 },
                  { label: 'Assigned', count: complaints.filter(c => c.status === 'ASSIGNED').length, color: THEME.colors.blue500 },
                  { label: 'In Progress', count: complaints.filter(c => c.status === 'IN_PROGRESS').length, color: THEME.colors.purple600 },
                  { label: 'Resolved', count: resolved, color: THEME.colors.green500 },
                  { label: 'Rejected', count: complaints.filter(c => c.status === 'REJECTED').length, color: THEME.colors.red500 }
                ].map((item, idx) => {
                  const pct = getPercentage(item.count);
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                        <span style={{ color: THEME.colors.gray700 }}>{item.label} ({item.count})</span>
                        <span style={{ color: THEME.colors.gray900 }}>{pct}%</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: THEME.colors.gray100, borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            backgroundColor: item.color,
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Action Card (Full Width Purple Gradient) */}
          <div
            style={{
              background: THEME.gradients.hero,
              borderRadius: THEME.radius.card,
              padding: '32px',
              color: THEME.colors.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
              boxShadow: THEME.shadows.cardHover
            }}
          >
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: THEME.colors.white }}>
                Ready to report an issue?
              </h3>
              <p style={{ fontSize: '14px', color: THEME.colors.purple100, margin: '8px 0 0 0', maxWidth: '500px' }}>
                Submit a plumbing, carpentry, or electrical complaint, and the system will instantly alert the assigned warden.
              </p>
            </div>
            <button
              onClick={() => navigate('/student/complaints/new')}
              style={{
                backgroundColor: THEME.colors.white,
                color: THEME.colors.purple600,
                border: 'none',
                borderRadius: THEME.radius.button,
                padding: '12px 24px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: THEME.shadows.button,
                transition: THEME.transition
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.filter = 'brightness(0.98)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              + Submit New Complaint
            </button>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default StudentDashboard;