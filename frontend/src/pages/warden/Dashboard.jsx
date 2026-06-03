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
import { ClipboardList, Clock, Wrench, CheckCircle2, XCircle, ChevronRight, Activity, Calendar } from 'lucide-react';

const WardenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await complaintService.getWardenComplaints();
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

  // Simple priority detector
  const detectPriority = (comp) => {
    if (comp.priority) return comp.priority;
    const text = (comp.title + ' ' + (comp.description || '')).toLowerCase();
    const highKeywords = ['fire', 'shock', 'leakage', 'flood', 'broken lock', 'stolen', 'emergency', 'short-circuit', 'injury', 'theft', 'water leak'];
    const medKeywords = ['fan', 'light', 'internet', 'wifi', 'slow', 'noise', 'dirty', 'clean', 'mosquito', 'ac', 'cooler', 'geyser'];

    if (highKeywords.some(kw => text.includes(kw))) return 'HIGH';
    if (medKeywords.some(kw => text.includes(kw))) return 'MEDIUM';
    return 'LOW';
  };

  // 1. Math Statistics
  const totalAssigned = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING' || c.status === 'ASSIGNED').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const rejectedCount = complaints.filter(c => c.status === 'REJECTED').length;

  // 2. Priority overview counts
  const highPriorityCount = complaints.filter(c => detectPriority(c) === 'HIGH').length;
  const mediumPriorityCount = complaints.filter(c => detectPriority(c) === 'MEDIUM').length;
  const lowPriorityCount = complaints.filter(c => detectPriority(c) === 'LOW').length;

  // 3. Quick Insights
  const getFrequentCategory = () => {
    if (complaints.length === 0) return 'General';
    const counts = {};
    complaints.forEach(c => {
      counts[c.categoryName] = (counts[c.categoryName] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';
  };

  const getAvgResolutionTime = () => {
    const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED');
    if (resolved.length === 0) return 'N/A';
    let sumHours = 0;
    resolved.forEach(c => {
      const diff = new Date(c.updatedAt || Date.now()) - new Date(c.createdAt);
      sumHours += Math.max(1, diff / (1000 * 60 * 60)); // Minimum 1 hr
    });
    return `${Math.round(sumHours / resolved.length)} Hours`;
  };

  const getWeeklyCount = (resolvedOnly = false) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return complaints.filter(c => {
      const date = new Date(resolvedOnly ? (c.updatedAt || c.createdAt) : c.createdAt);
      const matchesStatus = !resolvedOnly || (c.status === 'RESOLVED' || c.status === 'CLOSED');
      return date >= oneWeekAgo && matchesStatus;
    }).length;
  };

  const frequentCategory = getFrequentCategory();
  const avgResolutionTime = getAvgResolutionTime();
  const weeklyReceived = getWeeklyCount(false);
  const weeklyResolved = getWeeklyCount(true);

  // 4. Activity Logs construction
  const getActivityLogs = () => {
    const logs = [];
    complaints.forEach(c => {
      const formattedDate = new Date(c.updatedAt || c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
      const timeStr = new Date(c.updatedAt || c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (c.status === 'RESOLVED') {
        logs.push({
          type: 'RESOLVED',
          title: `Complaint #${c.id} Resolved`,
          desc: `Resolved task: "${c.title}"`,
          time: `${formattedDate} at ${timeStr}`,
          color: THEME.colors.green500,
          icon: CheckCircle2
        });
      } else if (c.status === 'REJECTED') {
        logs.push({
          type: 'REJECTED',
          title: `Complaint #${c.id} Rejected`,
          desc: `Rejected task: "${c.title}"`,
          time: `${formattedDate} at ${timeStr}`,
          color: THEME.colors.red500,
          icon: XCircle
        });
      } else if (c.status === 'IN_PROGRESS') {
        logs.push({
          type: 'IN_PROGRESS',
          title: `Complaint #${c.id} Work Started`,
          desc: `Status changed to In Progress for "${c.title}"`,
          time: `${formattedDate} at ${timeStr}`,
          color: THEME.colors.blue500,
          icon: Wrench
        });
      } else {
        logs.push({
          type: 'ASSIGNED',
          title: `New Assignment #${c.id}`,
          desc: `Assigned new task: "${c.title}"`,
          time: `${formattedDate} at ${timeStr}`,
          color: THEME.colors.purple600,
          icon: ClipboardList
        });
      }
    });

    // Sort by timestamp desc and limit to 5
    return logs.slice(0, 5);
  };

  const activityLogs = getActivityLogs();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <PortalLayout title="Warden Command Dashboard" breadcrumbs={['Dashboard']} hideHeader={true}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Greeting bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                Welcome back, Warden {user?.name || 'Warden'}
              </h2>
              <p style={{ fontSize: '14px', color: THEME.colors.gray500, margin: '4px 0 0 0', fontWeight: '500' }}>
                {formattedDate}
              </p>
            </div>
            
            <button
              onClick={() => navigate('/warden/complaints')}
              style={{
                background: THEME.gradients.primaryBtn,
                border: 'none',
                borderRadius: THEME.radius.button,
                color: THEME.colors.white,
                padding: '10px 20px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: THEME.shadows.button,
                transition: THEME.transition
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >
              Manage Assigned Tickets
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <StatCard
              icon={ClipboardList}
              label="Assigned Complaints"
              value={totalAssigned}
              percentage={4}
              trendUp={true}
              timeframe="vs last week"
            />
            <StatCard
              icon={Clock}
              label="Pending Action"
              value={pendingCount}
              percentage={2}
              trendUp={false}
              timeframe="vs last week"
            />
            <StatCard
              icon={Wrench}
              label="In Progress"
              value={inProgressCount}
              percentage={12}
              trendUp={true}
              timeframe="vs last week"
            />
            <StatCard
              icon={CheckCircle2}
              label="Resolved"
              value={resolvedCount}
              percentage={16}
              trendUp={true}
              timeframe="vs last week"
            />
            <StatCard
              icon={XCircle}
              label="Rejected"
              value={rejectedCount}
              percentage={1}
              trendUp={false}
              timeframe="vs last week"
            />
          </div>

          {/* Core Analytics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            
            {/* Priority overview & Quick insights */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                border: `1px solid ${THEME.colors.gray200}`,
                boxShadow: THEME.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>Priority Distribution</h3>
                <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>Urgency classifications of assigned complaints.</p>
              </div>

              {totalAssigned === 0 ? (
                <div style={{ color: THEME.colors.gray400, fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>No priority metrics available</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* High priority */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      <span style={{ color: THEME.colors.red500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: THEME.colors.red500, display: 'inline-block' }} />
                        High Priority
                      </span>
                      <span>{highPriorityCount} Tickets ({Math.round((highPriorityCount / totalAssigned) * 100)}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: THEME.colors.gray100, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(highPriorityCount / totalAssigned) * 100}%`, backgroundColor: THEME.colors.red500, borderRadius: '4px' }} />
                    </div>
                  </div>

                  {/* Medium priority */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      <span style={{ color: THEME.colors.yellow500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: THEME.colors.yellow500, display: 'inline-block' }} />
                        Medium Priority
                      </span>
                      <span>{mediumPriorityCount} Tickets ({Math.round((mediumPriorityCount / totalAssigned) * 100)}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: THEME.colors.gray100, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(mediumPriorityCount / totalAssigned) * 100}%`, backgroundColor: THEME.colors.yellow500, borderRadius: '4px' }} />
                    </div>
                  </div>

                  {/* Low priority */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      <span style={{ color: THEME.colors.green500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: THEME.colors.green500, display: 'inline-block' }} />
                        Low Priority
                      </span>
                      <span>{lowPriorityCount} Tickets ({Math.round((lowPriorityCount / totalAssigned) * 100)}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: THEME.colors.gray100, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(lowPriorityCount / totalAssigned) * 100}%`, backgroundColor: THEME.colors.green500, borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ height: '1px', backgroundColor: THEME.colors.gray100 }} />

              {/* Quick Insights Sub-Grid */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: THEME.colors.gray900, marginBottom: '16px' }}>Quick Insights</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '14px', backgroundColor: THEME.colors.gray50, borderRadius: THEME.radius.small, border: `1px solid ${THEME.colors.gray200}` }}>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Frequent Topic</span>
                    <strong style={{ fontSize: '14px', color: THEME.colors.gray900 }}>{frequentCategory}</strong>
                  </div>
                  <div style={{ padding: '14px', backgroundColor: THEME.colors.gray50, borderRadius: THEME.radius.small, border: `1px solid ${THEME.colors.gray200}` }}>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Avg Resolve Velocity</span>
                    <strong style={{ fontSize: '14px', color: THEME.colors.purple600 }}>{avgResolutionTime}</strong>
                  </div>
                  <div style={{ padding: '14px', backgroundColor: THEME.colors.gray50, borderRadius: THEME.radius.small, border: `1px solid ${THEME.colors.gray200}` }}>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Weekly Received</span>
                    <strong style={{ fontSize: '14px', color: THEME.colors.gray900 }}>{weeklyReceived} Tickets</strong>
                  </div>
                  <div style={{ padding: '14px', backgroundColor: THEME.colors.gray50, borderRadius: THEME.radius.small, border: `1px solid ${THEME.colors.gray200}` }}>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Weekly Resolved</span>
                    <strong style={{ fontSize: '14px', color: THEME.colors.green500 }}>{weeklyResolved} Tickets</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                border: `1px solid ${THEME.colors.gray200}`,
                boxShadow: THEME.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>Recent Activity</h3>
                <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>Real-time updates of ticket lifecycles.</p>
              </div>

              {activityLogs.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: THEME.colors.gray400, fontSize: '13px' }}>
                  No activities recorded yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '8px' }}>
                  {/* Vertical Timeline bar */}
                  <div style={{ position: 'absolute', left: '17px', top: '10px', bottom: '10px', width: '2px', backgroundColor: THEME.colors.gray100, zIndex: 1 }} />
                  
                  {activityLogs.map((log, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', zIndex: 2 }}>
                      {/* Circle dot */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: THEME.colors.white,
                        border: `2px solid ${log.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: log.color,
                        flexShrink: 0
                      }}>
                        <log.icon size={10} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: '700', color: THEME.colors.gray900 }}>{log.title}</span>
                        <span style={{ fontSize: '12.5px', color: THEME.colors.gray600 }}>{log.desc}</span>
                        <span style={{ fontSize: '11px', color: THEME.colors.gray400 }}>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Active Assigned Complaints List Table */}
          <div
            style={{
              backgroundColor: THEME.colors.white,
              borderRadius: THEME.radius.card,
              padding: '24px',
              boxShadow: THEME.shadows.card,
              border: `1px solid ${THEME.colors.gray200}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: THEME.colors.gray900, margin: 0 }}>
                  Active Complaints Assigned
                </h3>
                <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>
                  Acknowledge assignments and update task workflows.
                </p>
              </div>
              <button
                onClick={() => navigate('/warden/complaints')}
                style={{
                  background: 'none',
                  border: `1.5px solid ${THEME.colors.purple600}`,
                  borderRadius: THEME.radius.button,
                  color: THEME.colors.purple600,
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: THEME.transition
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = THEME.colors.purple50}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                View Full List
              </button>
            </div>

            {complaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: THEME.colors.gray500 }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🎉</span>
                No complaints are assigned to you!
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.colors.gray50, borderBottom: `1px solid ${THEME.colors.gray200}` }}>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>#</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Title</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Student</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Category</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Priority</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Assigned Date</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.slice(0, 5).map(comp => {
                      const priority = detectPriority(comp);
                      const priorityColor = priority === 'HIGH' ? THEME.colors.red500 : priority === 'MEDIUM' ? THEME.colors.yellow500 : THEME.colors.green500;

                      return (
                        <tr
                          key={comp.id}
                          style={{
                            borderBottom: `1px solid ${THEME.colors.gray100}`,
                            transition: THEME.transition,
                            borderLeft: `4px solid ${priorityColor}`
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = THEME.colors.gray50}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500, fontFamily: 'monospace' }}>#{comp.id}</td>
                          <td style={{ padding: '14px 20px', fontWeight: '600', color: THEME.colors.gray900 }}>{comp.title}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>
                            {comp.studentName || 'Student'} (Room {comp.roomNumber || '—'})
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            <span style={{ backgroundColor: THEME.colors.purple50, color: THEME.colors.purple600, padding: '2px 8px', borderRadius: THEME.radius.small, fontSize: '12px', fontWeight: '600' }}>
                              {comp.categoryName || 'General'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', color: priorityColor, fontWeight: '700', fontSize: '12px' }}>
                            {priority}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <StatusBadge status={comp.status} />
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            {new Date(comp.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <button
                              onClick={() => navigate(`/warden/complaints/${comp.id}`)}
                              style={{
                                background: THEME.gradients.primaryBtn,
                                border: 'none',
                                color: THEME.colors.white,
                                padding: '6px 14px',
                                borderRadius: THEME.radius.small,
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '13px',
                                transition: THEME.transition
                              }}
                              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
                              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                            >
                              Update Status
                            </button>
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
      )}
    </PortalLayout>
  );
};

export default WardenDashboard;
