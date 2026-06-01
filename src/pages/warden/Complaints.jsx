import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';
import PortalLayout from '../../components/PortalLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { THEME } from '../../theme';

const WardenComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await complaintService.getWardenComplaints();
        setComplaints(data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load assigned complaints.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Compute counts dynamically
  const allCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const assignedCount = complaints.filter(c => c.status === 'ASSIGNED').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const rejectedCount = complaints.filter(c => c.status === 'REJECTED').length;

  const tabs = [
    { key: 'ALL', label: `All (${allCount})` },
    { key: 'PENDING', label: `Pending (${pendingCount})` },
    { key: 'ASSIGNED', label: `Assigned (${assignedCount})` },
    { key: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` },
    { key: 'RESOLVED', label: `Resolved (${resolvedCount})` },
    { key: 'REJECTED', label: `Rejected (${rejectedCount})` }
  ];

  // Simple keyword analyzer for priority
  const detectPriority = (comp) => {
    if (comp.priority) return comp.priority;
    const text = (comp.title + ' ' + (comp.description || '')).toLowerCase();
    const highKeywords = ['fire', 'shock', 'leakage', 'flood', 'broken lock', 'stolen', 'emergency', 'short circuit', 'injury', 'theft', 'water leak'];
    const medKeywords = ['fan', 'light', 'internet', 'wifi', 'slow', 'noise', 'dirty', 'clean', 'mosquito', 'ac', 'cooler', 'geyser'];

    if (highKeywords.some((kw) => text.includes(kw))) return 'HIGH';
    if (medKeywords.some((kw) => text.includes(kw))) return 'MEDIUM';
    return 'LOW';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'HIGH') return THEME.colors.red500;
    if (priority === 'MEDIUM') return THEME.colors.yellow500;
    return THEME.colors.green500;
  };

  const filteredComplaints = complaints.filter((comp) => {
    const matchesTab = activeTab === 'ALL' || comp.status === activeTab;
    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.studentName && comp.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (comp.roomNumber && comp.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      comp.id.toString().includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <PortalLayout title="Assigned Complaints" breadcrumbs={['Dashboard', 'Complaints']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Row */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
              Assigned Complaints
            </h2>
            <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
              View and update status for all complaints assigned to you.
            </p>
          </div>

          {/* Filter Bar (Tabs + Search) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              borderBottom: `1px solid ${THEME.colors.gray200}`,
              paddingBottom: '16px'
            }}
          >
            {/* Tabs Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      background: isActive ? THEME.gradients.primaryBtn : THEME.colors.white,
                      color: isActive ? THEME.colors.white : THEME.colors.gray500,
                      border: `1.5px solid ${isActive ? 'transparent' : THEME.colors.gray200}`,
                      borderRadius: THEME.radius.badge,
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: isActive ? THEME.shadows.button : 'none',
                      transition: THEME.transition
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = THEME.colors.gray50;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = THEME.colors.white;
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '12px', color: THEME.colors.gray500, fontSize: '14px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search room, title, student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: '38px',
                  width: '260px',
                  backgroundColor: THEME.colors.white,
                  border: `1px solid ${THEME.colors.gray200}`,
                  borderRadius: THEME.radius.input,
                  padding: '0 12px 0 36px',
                  fontSize: '13px',
                  color: THEME.colors.gray700,
                  outline: 'none',
                  transition: THEME.transition
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = THEME.colors.purple500;
                  e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = THEME.colors.gray200;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Complaints Table Card */}
          {filteredComplaints.length === 0 ? (
            <EmptyState
              icon="🎉"
              heading="No complaints found"
              subtext={searchQuery ? "No issues matched your search text." : "You have no complaints under this status."}
            />
          ) : (
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                overflow: 'hidden'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: THEME.colors.gray50, borderBottom: `1px solid ${THEME.colors.gray200}` }}>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>#ID</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Complaint Title</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Student</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Room</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Category</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((comp) => {
                      const priority = detectPriority(comp);
                      const priorityColor = getPriorityColor(priority);

                      return (
                        <tr
                          key={comp.id}
                          style={{
                            borderBottom: `1px solid ${THEME.colors.gray100}`,
                            transition: THEME.transition,
                            borderLeft: `4px solid ${priorityColor}`
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.gray50; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500, fontFamily: 'monospace' }}>#{comp.id}</td>
                          <td style={{ padding: '14px 20px', fontWeight: '600', color: THEME.colors.gray900 }}>{comp.title}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{comp.studentName}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{comp.roomNumber || '—'}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            <span style={{ backgroundColor: THEME.colors.purple50, color: THEME.colors.purple600, padding: '2px 8px', borderRadius: THEME.radius.small, fontSize: '12px', fontWeight: '600' }}>
                              {comp.categoryName}
                            </span>
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
                              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                            >
                              Update →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </PortalLayout>
  );
};

export default WardenComplaints;
