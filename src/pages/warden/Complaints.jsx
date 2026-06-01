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

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [studentFilter, setStudentFilter] = useState('');

  // Sorting State
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc' | 'date_asc' | 'priority_desc' | 'priority_asc' | 'status' | 'student'

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

  // Priority detection helper
  const detectPriority = (comp) => {
    if (comp.priority) return comp.priority;
    const text = (comp.title + ' ' + (comp.description || '')).toLowerCase();
    const highKeywords = ['fire', 'shock', 'leakage', 'flood', 'broken lock', 'stolen', 'emergency', 'short-circuit', 'injury', 'theft', 'water leak'];
    const medKeywords = ['fan', 'light', 'internet', 'wifi', 'slow', 'noise', 'dirty', 'clean', 'mosquito', 'ac', 'cooler', 'geyser'];

    if (highKeywords.some(kw => text.includes(kw))) return 'HIGH';
    if (medKeywords.some(kw => text.includes(kw))) return 'MEDIUM';
    return 'LOW';
  };

  const getPriorityWeight = (priority) => {
    if (priority === 'HIGH') return 3;
    if (priority === 'MEDIUM') return 2;
    return 1;
  };

  // Get categories dynamically
  const categories = ['ALL', ...new Set(complaints.map(c => c.categoryName).filter(Boolean))];

  // Filters application
  const getFilteredComplaints = () => {
    return complaints.filter(comp => {
      const matchesStatus = statusFilter === 'ALL' || comp.status === statusFilter;
      const priority = detectPriority(comp);
      const matchesPriority = priorityFilter === 'ALL' || priority === priorityFilter;
      const matchesCategory = categoryFilter === 'ALL' || comp.categoryName === categoryFilter;

      const matchesSearch =
        comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comp.studentName && comp.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        comp.id.toString().includes(searchQuery) ||
        (comp.categoryName && comp.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStudent = !studentFilter || (comp.studentName && comp.studentName.toLowerCase().includes(studentFilter.toLowerCase()));

      let matchesDate = true;
      if (dateFrom) {
        matchesDate = matchesDate && new Date(comp.createdAt) >= new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(comp.createdAt) <= endDate;
      }

      return matchesStatus && matchesPriority && matchesCategory && matchesSearch && matchesStudent && matchesDate;
    });
  };

  // Sorting application
  const getSortedComplaints = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'priority_desc') {
        return getPriorityWeight(detectPriority(b)) - getPriorityWeight(detectPriority(a));
      }
      if (sortBy === 'priority_asc') {
        return getPriorityWeight(detectPriority(a)) - getPriorityWeight(detectPriority(b));
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      if (sortBy === 'student') {
        return (a.studentName || '').localeCompare(b.studentName || '');
      }
      return 0;
    });
  };

  const filteredItems = getFilteredComplaints();
  const sortedItems = getSortedComplaints(filteredItems);

  // Tab counts
  const allCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING' || c.status === 'ASSIGNED').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const rejectedCount = complaints.filter(c => c.status === 'REJECTED').length;

  return (
    <PortalLayout title="Assigned Tickets Management" breadcrumbs={['Dashboard', 'Complaints']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Row */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
              Complaint Assignments
            </h2>
            <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
              Review, sort, and update the status of active issues.
            </p>
          </div>

          {/* Quick Filters - Pills Tab selector */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: `1px solid ${THEME.colors.gray100}`, paddingBottom: '12px' }}>
            {[
              { key: 'ALL', label: `All Complaints (${allCount})` },
              { key: 'ASSIGNED', label: `Pending/Assigned (${pendingCount})` },
              { key: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` },
              { key: 'RESOLVED', label: `Resolved (${resolvedCount})` },
              { key: 'REJECTED', label: `Rejected (${rejectedCount})` }
            ].map(tab => {
              const isActive = (tab.key === 'ALL' && statusFilter === 'ALL') || 
                               (tab.key === 'ASSIGNED' && (statusFilter === 'ASSIGNED' || statusFilter === 'PENDING')) ||
                               (statusFilter === tab.key);
              
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    if (tab.key === 'ASSIGNED') {
                      setStatusFilter('ASSIGNED'); // This will match both Assigned/Pending in getFilteredComplaints
                    } else {
                      setStatusFilter(tab.key);
                    }
                  }}
                  style={{
                    background: isActive ? THEME.gradients.primaryBtn : THEME.colors.white,
                    color: isActive ? THEME.colors.white : THEME.colors.gray500,
                    border: `1.5px solid ${isActive ? 'transparent' : THEME.colors.gray200}`,
                    borderRadius: THEME.radius.badge,
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: isActive ? THEME.shadows.button : 'none',
                    transition: THEME.transition
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = THEME.colors.gray50; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = THEME.colors.white; }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Detailed Filters panel */}
          <div
            style={{
              backgroundColor: THEME.colors.white,
              borderRadius: THEME.radius.card,
              padding: '24px',
              border: `1px solid ${THEME.colors.gray200}`,
              boxShadow: THEME.shadows.card,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Top row: search + sorting + student name filter */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              
              {/* Global search */}
              <div style={{ flex: '1.5 1 240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: THEME.colors.gray500, fontSize: '14px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search complaint, student name or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    height: '40px',
                    width: '100%',
                    backgroundColor: THEME.colors.gray50,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    borderRadius: THEME.radius.input,
                    padding: '0 12px 0 36px',
                    fontSize: '13px',
                    color: THEME.colors.gray700,
                    outline: 'none',
                    transition: THEME.transition
                  }}
                  onFocus={e => { e.target.style.borderColor = THEME.colors.purple500; e.target.style.backgroundColor = THEME.colors.white; }}
                  onBlur={e => { e.target.style.borderColor = THEME.colors.gray200; e.target.style.backgroundColor = THEME.colors.gray50; }}
                />
              </div>

              {/* Student Filter */}
              <div style={{ flex: '1 1 180px' }}>
                <input
                  type="text"
                  placeholder="Student Name Filter..."
                  value={studentFilter}
                  onChange={e => setStudentFilter(e.target.value)}
                  style={{
                    height: '40px',
                    width: '100%',
                    backgroundColor: THEME.colors.gray50,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    borderRadius: THEME.radius.input,
                    padding: '0 14px',
                    fontSize: '13px',
                    color: THEME.colors.gray700,
                    outline: 'none',
                    transition: THEME.transition
                  }}
                  onFocus={e => { e.target.style.borderColor = THEME.colors.purple500; e.target.style.backgroundColor = THEME.colors.white; }}
                  onBlur={e => { e.target.style.borderColor = THEME.colors.gray200; e.target.style.backgroundColor = THEME.colors.gray50; }}
                />
              </div>

              {/* Sorting selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: THEME.colors.gray500, fontWeight: '600' }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    height: '40px',
                    borderRadius: THEME.radius.input,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 16px',
                    fontSize: '13px',
                    color: THEME.colors.gray700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="priority_desc">Urgent First</option>
                  <option value="priority_asc">Urgent Last</option>
                  <option value="status">Status Order</option>
                  <option value="student">Student Name</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: category + priority + date range */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: THEME.radius.small,
                  border: `1.5px solid ${THEME.colors.gray200}`,
                  padding: '0 12px',
                  fontSize: '13px',
                  color: THEME.colors.gray700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Categories</option>
                {categories.filter(c => c !== 'ALL').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                style={{
                  height: '36px',
                  borderRadius: THEME.radius.small,
                  border: `1.5px solid ${THEME.colors.gray200}`,
                  padding: '0 12px',
                  fontSize: '13px',
                  color: THEME.colors.gray700,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              {/* Date pickers */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: THEME.colors.gray500 }}>Assigned Range:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  style={{
                    height: '36px',
                    borderRadius: THEME.radius.small,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 10px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '13px', color: THEME.colors.gray500 }}>to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  style={{
                    height: '36px',
                    borderRadius: THEME.radius.small,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 10px',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table list */}
          {sortedItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              heading="No assignments found"
              subtext="No complaints matched your active search queries or filter selections."
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
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Complaint ID</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Title</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Student</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Room No.</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Category</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Priority</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Assigned Date</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Last Updated</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedItems.map(comp => {
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
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{comp.studentName}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{comp.roomNumber || '—'}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            <span style={{ backgroundColor: THEME.colors.purple50, color: THEME.colors.purple600, padding: '2px 8px', borderRadius: THEME.radius.small, fontSize: '12px', fontWeight: '600' }}>
                              {comp.categoryName}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', color: priorityColor, fontWeight: '700', fontSize: '12.5px' }}>
                            {priority}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <StatusBadge status={comp.status} />
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            {new Date(comp.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            {new Date(comp.updatedAt || comp.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '14px 20px', display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => navigate(`/warden/complaints/${comp.id}`)}
                              style={{
                                background: THEME.gradients.primaryBtn,
                                border: 'none',
                                color: THEME.colors.white,
                                padding: '6px 12px',
                                borderRadius: THEME.radius.small,
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: THEME.transition
                              }}
                              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
                              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                            >
                              Update
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
