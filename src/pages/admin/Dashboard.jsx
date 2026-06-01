import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { THEME } from '../../theme';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const allComplaints = await complaintService.getAdminComplaints().catch(err => { console.error('Complaints fetch error:', err); return []; });
      const allStudents = await complaintService.getAdminStudents().catch(err => { console.error('Students fetch error:', err); return []; });
      const allWardens = await complaintService.getAdminWardens().catch(err => { console.error('Wardens fetch error:', err); return []; });
      const allCategories = await complaintService.getAdminCategories().catch(err => { console.error('Categories fetch error:', err); return []; });

      setComplaints(allComplaints || []);
      setStudents(allStudents || []);
      setWardens(allWardens || []);
      setCategories(allCategories || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load admin dashboard operations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute counts
  const totalComplaints = complaints.length;
  const pendingReview = complaints.filter((c) => c.status === 'PENDING').length;
  const totalStudents = students.length;
  const activeWardens = wardens.filter((w) => w.status !== 'INACTIVE').length;

  // Check for overdue complaints (Pending & older than 3 days)
  const getOverdueComplaints = () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return complaints.filter((c) => {
      return c.status === 'PENDING' && new Date(c.createdAt) < threeDaysAgo;
    });
  };

  const overdueList = getOverdueComplaints();
  const overdueCount = overdueList.length;

  // Get count per category
  const getCategoryCount = (catName) => {
    return complaints.filter((c) => c.categoryName === catName).length;
  };

  return (
    <DashboardLayout title="Admin Dashboard" breadcrumbs={['Admin', 'Dashboard']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Greeting */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
              Good morning, Admin!
            </h2>
            <p style={{ fontSize: '14px', color: THEME.colors.gray500, margin: '4px 0 0 0', fontWeight: '500' }}>
              Operations Overview & System Control Center
            </p>
          </div>

          {/* Overdue Alert Banner */}
          {overdueCount > 0 && (
            <div
              style={{
                backgroundColor: '#FEF3C7',
                border: '1px solid #F59E0B',
                borderRadius: THEME.radius.card,
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: THEME.shadows.card,
                animation: 'pulse 3s infinite'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <span style={{ fontSize: '14px', color: '#92400E', fontWeight: '600' }}>
                  {overdueCount} {overdueCount === 1 ? 'complaint is' : 'complaints are'} overdue and need immediate attention
                </span>
              </div>
              <span
                onClick={() => navigate('/admin/complaints')}
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: THEME.colors.purple600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                View Now →
              </span>
            </div>
          )}

          {/* Large Stats Row */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <StatCard
              icon="📋"
              label="Total Complaints"
              value={totalComplaints}
            />
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <StatCard
                icon="⏳"
                label="Pending Review"
                value={pendingReview}
              />
              {/* Conditional yellow highlighting if pending > 10 */}
              {pendingReview > 10 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: THEME.colors.yellow500,
                    color: THEME.colors.white,
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: THEME.radius.badge
                  }}
                >
                  HIGH VOL
                </div>
              )}
            </div>
            <StatCard
              icon="👥"
              label="Total Students"
              value={totalStudents}
            />
            <StatCard
              icon="👷"
              label="Active Wardens"
              value={activeWardens}
            />
          </div>

          {/* Split Content grids */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Column 1+2 (8 cols): Recent Complaints */}
            <div
              style={{
                gridColumn: window.innerWidth >= 1024 ? 'span 8' : 'span 12',
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                  Recent Complaints
                </h3>
                <span
                  onClick={() => navigate('/admin/complaints')}
                  style={{ fontSize: '13px', color: THEME.colors.purple600, fontWeight: '600', cursor: 'pointer' }}
                >
                  View All →
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.colors.gray50, borderBottom: `1px solid ${THEME.colors.gray200}` }}>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Student</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Title</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Category</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Date</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.slice(0, 8).map((comp) => (
                      <tr
                        key={comp.id}
                        style={{ borderBottom: `1px solid ${THEME.colors.gray100}`, transition: THEME.transition }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.gray50; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: '500', color: THEME.colors.gray900 }}>{comp.studentName}</td>
                        <td style={{ padding: '12px 16px', color: THEME.colors.gray700 }}>{comp.title}</td>
                        <td style={{ padding: '12px 16px', color: THEME.colors.gray500 }}>{comp.categoryName || 'General'}</td>
                        <td style={{ padding: '12px 16px' }}><StatusBadge status={comp.status} /></td>
                        <td style={{ padding: '12px 16px', color: THEME.colors.gray500 }}>{new Date(comp.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          {comp.status === 'PENDING' ? (
                            <button
                              onClick={() => navigate('/admin/complaints', { state: { assignId: comp.id } })}
                              style={{
                                backgroundColor: THEME.colors.purple600,
                                color: THEME.colors.white,
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: THEME.radius.small,
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Assign
                            </button>
                          ) : (
                            <span style={{ color: THEME.colors.gray400, fontSize: '11px', fontStyle: 'italic' }}>Assigned</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column 3 (4 cols): By Category progress bars */}
            <div
              style={{
                gridColumn: window.innerWidth >= 1024 ? 'span 4' : 'span 12',
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                By Category
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '350px' }}>
                {categories.map((cat, idx) => {
                  const count = getCategoryCount(cat.name);
                  const percentage = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600' }}>
                        <span style={{ color: THEME.colors.gray700 }}>{cat.name}</span>
                        <span style={{ color: THEME.colors.gray900 }}>{count} issues ({percentage}%)</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: THEME.colors.gray100, borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor: THEME.colors.purple600,
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 1+2 (8 cols): Recent Users */}
            <div
              style={{
                gridColumn: 'span 12',
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                marginTop: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                  Recent Registered Students
                </h3>
                <span
                  onClick={() => navigate('/admin/users/students')}
                  style={{ fontSize: '13px', color: THEME.colors.purple600, fontWeight: '600', cursor: 'pointer' }}
                >
                  Manage Users →
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.colors.gray50, borderBottom: `1px solid ${THEME.colors.gray200}` }}>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Name</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Email</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Room</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Joined Date</th>
                      <th style={{ padding: '12px 16px', color: THEME.colors.gray500, fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 5).map((stud) => (
                      <tr
                        key={stud.id}
                        style={{ borderBottom: `1px solid ${THEME.colors.gray100}`, transition: THEME.transition }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.gray50; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: '600', color: THEME.colors.gray900 }}>{stud.name}</td>
                        <td style={{ padding: '12px 16px', color: THEME.colors.gray700 }}>{stud.email}</td>
                        <td style={{ padding: '12px 16px', color: THEME.colors.gray700 }}>{stud.roomNumber || '—'}</td>
                        <td style={{ padding: '12px 16px', color: THEME.colors.gray500 }}>
                          {new Date(stud.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              backgroundColor: stud.status === 'INACTIVE' ? THEME.colors.red500 + '15' : THEME.colors.green500 + '15',
                              color: stud.status === 'INACTIVE' ? THEME.colors.red500 : THEME.colors.green500,
                              fontSize: '11px',
                              fontWeight: '700',
                              padding: '2px 8px',
                              borderRadius: THEME.radius.badge
                            }}
                          >
                            {stud.status === 'INACTIVE' ? 'Inactive' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
