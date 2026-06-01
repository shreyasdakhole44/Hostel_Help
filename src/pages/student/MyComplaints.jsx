import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';
import PortalLayout from '../../components/PortalLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { THEME } from '../../theme';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await complaintService.getStudentComplaints();
        setComplaints(data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load your complaints.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Compute counts dynamically
  const allCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'PENDING').length;
  const assignedCount = complaints.filter((c) => c.status === 'ASSIGNED').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const rejectedCount = complaints.filter((c) => c.status === 'REJECTED').length;

  const tabs = [
    { key: 'ALL', label: `All (${allCount})` },
    { key: 'PENDING', label: `Pending (${pendingCount})` },
    { key: 'ASSIGNED', label: `Assigned (${assignedCount})` },
    { key: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` },
    { key: 'RESOLVED', label: `Resolved (${resolvedCount})` },
    { key: 'REJECTED', label: `Rejected (${rejectedCount})` }
  ];

  // Filters logic
  const filteredComplaints = complaints.filter((comp) => {
    const matchesTab = activeTab === 'ALL' || comp.status === activeTab;
    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.description && comp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      comp.id.toString().includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <PortalLayout title="My Complaints" breadcrumbs={['Dashboard', 'Complaints']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                My Complaints
              </h2>
              <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
                Track the status and resolution history of all your submitted complaints.
              </p>
            </div>
            <button
              onClick={() => navigate('/student/complaints/new')}
              style={{
                background: THEME.gradients.primaryBtn,
                color: THEME.colors.white,
                border: 'none',
                borderRadius: THEME.radius.button,
                padding: '10px 20px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: THEME.shadows.button,
                transition: THEME.transition
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0.95)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Submit New →
            </button>
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
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: '38px',
                  width: '240px',
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

          {/* Complaints Vertical List */}
          {filteredComplaints.length === 0 ? (
            <EmptyState
              icon="📭"
              heading="No complaints yet"
              subtext={searchQuery ? "We couldn't find any complaints matching your search." : "No reports have been submitted under this filter."}
              actionLabel={!searchQuery ? "Report an Issue" : null}
              onAction={() => navigate('/student/complaints/new')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredComplaints.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => navigate(`/student/complaints/${comp.id}`)}
                  style={{
                    backgroundColor: THEME.colors.white,
                    borderRadius: THEME.radius.card,
                    padding: '24px',
                    boxShadow: THEME.shadows.card,
                    border: `1px solid ${THEME.colors.gray200}`,
                    cursor: 'pointer',
                    transition: THEME.transition,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
                    e.currentTarget.style.borderColor = THEME.colors.purple100;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = THEME.shadows.card;
                    e.currentTarget.style.borderColor = THEME.colors.gray200;
                  }}
                >
                  {/* Top Row: Title + Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: THEME.colors.gray900, margin: 0 }}>
                      {comp.title}
                    </h3>
                    <StatusBadge status={comp.status} />
                  </div>

                  {/* Second Row: Category pill + Date + Warden assigned */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '13px', color: THEME.colors.gray500 }}>
                    <span
                      style={{
                        backgroundColor: THEME.colors.purple50,
                        color: THEME.colors.purple600,
                        padding: '2px 8px',
                        borderRadius: THEME.radius.small,
                        fontWeight: '600'
                      }}
                    >
                      📁 {comp.categoryName || 'General'}
                    </span>
                    <span>📅 {new Date(comp.createdAt).toLocaleDateString()}</span>
                    {comp.wardenName ? (
                      <span style={{ color: THEME.colors.gray700, fontWeight: '500' }}>
                        👤 Warden: {comp.wardenName}
                      </span>
                    ) : (
                      <span style={{ color: THEME.colors.gray400, fontStyle: 'italic' }}>
                        👤 Unassigned
                      </span>
                    )}
                  </div>

                  {/* Description Preview (Truncated) */}
                  <p
                    style={{
                      fontSize: '14px',
                      color: THEME.colors.gray500,
                      margin: 0,
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {comp.description}
                  </p>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: THEME.colors.gray100, margin: '4px 0' }} />

                  {/* Bottom Row: ID + Link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: THEME.colors.gray400, fontFamily: 'monospace' }}>
                      #TICKET-{comp.id}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: THEME.colors.purple600,
                        transition: THEME.transition
                      }}
                    >
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PortalLayout>
  );
};

export default MyComplaints;