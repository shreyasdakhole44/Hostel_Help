import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { THEME } from '../../theme';

const AllComplaints = () => {
  const location = useLocation();

  const [complaints, setComplaints] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Applied Filters State (to trigger filter only on clicking "Apply Filters")
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'ALL',
    category: 'ALL',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaintForAssign, setSelectedComplaintForAssign] = useState(null);
  const [selectedWardenId, setSelectedWardenId] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Details Modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewedComplaint, setViewedComplaint] = useState(null);

  const fetchData = async () => {
    try {
      const compData = await complaintService.getAdminComplaints().catch(err => { console.error('Complaints fetch error:', err); return []; });
      const wardenData = await complaintService.getAdminWardens().catch(err => { console.error('Wardens fetch error:', err); return []; });
      const catData = await complaintService.getAdminCategories().catch(err => { console.error('Categories fetch error:', err); return []; });
      setComplaints(compData || []);
      setWardens(wardenData || []);
      setCategories(catData || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load complaints data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pre-select if redirected with state from dashboard
  useEffect(() => {
    if (location.state?.assignId && complaints.length > 0) {
      const target = complaints.find((c) => c.id === location.state.assignId);
      if (target) {
        openAssignModal(target);
      }
    }
  }, [location.state, complaints]);

  // Filtering Logic
  const getFilteredComplaints = () => {
    return complaints.filter((comp) => {
      const f = appliedFilters;
      
      const matchesStatus = f.status === 'ALL' || comp.status === f.status;
      const matchesCategory = f.category === 'ALL' || comp.categoryName === f.category;
      
      // Date range validation
      let matchesDate = true;
      if (f.dateFrom) {
        matchesDate = matchesDate && new Date(comp.createdAt) >= new Date(f.dateFrom);
      }
      if (f.dateTo) {
        const endDate = new Date(f.dateTo);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(comp.createdAt) <= endDate;
      }

      // Search Query
      const matchesSearch =
        comp.title.toLowerCase().includes(f.search.toLowerCase()) ||
        comp.studentName.toLowerCase().includes(f.search.toLowerCase()) ||
        (comp.roomNumber && comp.roomNumber.toLowerCase().includes(f.search.toLowerCase())) ||
        comp.id.toString().includes(f.search);

      return matchesStatus && matchesCategory && matchesDate && matchesSearch;
    });
  };

  const filteredComplaints = getFilteredComplaints();

  const handleApplyFilters = () => {
    setAppliedFilters({
      status: statusFilter,
      category: categoryFilter,
      dateFrom: dateFrom,
      dateTo: dateTo,
      search: searchQuery
    });
  };

  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setAppliedFilters({
      status: 'ALL',
      category: 'ALL',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  // Selection handlers
  const handleToggleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = filteredComplaints.map((c) => c.id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Assign Modal trigger
  const openAssignModal = (complaint) => {
    setSelectedComplaintForAssign(complaint);
    setSelectedWardenId('');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedWardenId) {
      toast.error('Please select a warden.');
      return;
    }
    setSubmittingAssign(true);
    try {
      await complaintService.assignComplaintToWarden(selectedComplaintForAssign.id, {
        wardenId: parseInt(selectedWardenId)
      });
      toast.success(`Warden assigned to Complaint #${selectedComplaintForAssign.id}!`);
      setAssignModalOpen(false);
      setSelectedIds([]);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to assign warden.');
    } finally {
      setSubmittingAssign(false);
    }
  };

  // Bulk assignment handler
  const handleBulkAssign = async (wardenId) => {
    if (!wardenId) return;
    
    // Filter out only PENDING complaints to avoid overriding resolved ones
    const pendingSelections = selectedIds.filter((id) => {
      const c = complaints.find((x) => x.id === id);
      return c && c.status === 'PENDING';
    });

    if (pendingSelections.length === 0) {
      toast.info('No pending complaints selected for assignment.');
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        pendingSelections.map((id) =>
          complaintService.assignComplaintToWarden(id, { wardenId: parseInt(wardenId) })
        )
      );
      toast.success(`Successfully assigned ${pendingSelections.length} complaints!`);
      setSelectedIds([]);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Bulk assignment failed.');
    } finally {
      setLoading(false);
    }
  };

  // View details trigger
  const handleViewDetails = (comp) => {
    setViewedComplaint(comp);
    setDetailsModalOpen(true);
  };

  // Export filtered list to CSV format
  const exportToCSV = () => {
    if (filteredComplaints.length === 0) {
      toast.warning('No complaints to export.');
      return;
    }

    const headers = ['ID', 'Student', 'Room', 'Title', 'Category', 'Status', 'Assigned Warden', 'Date'];
    const rows = filteredComplaints.map((c) => [
      c.id,
      c.studentName,
      c.roomNumber || '—',
      `"${c.title.replace(/"/g, '""')}"`,
      c.categoryName || 'General',
      c.status,
      c.wardenName || 'Unassigned',
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hostel_Help_Complaints_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV report exported successfully.');
  };

  // Helper to suggest correct expert wardens
  const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('plumb')) return '🚰';
    if (lower.includes('elect')) return '⚡';
    if (lower.includes('internet') || lower.includes('wifi') || lower.includes('net')) return '🌐';
    if (lower.includes('clean') || lower.includes('sweep') || lower.includes('house')) return '🧹';
    if (lower.includes('carp') || lower.includes('wood') || lower.includes('furn')) return '🔨';
    return '👷';
  };

  return (
    <DashboardLayout title="All Complaints" breadcrumbs={['Admin', 'Complaints']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                Complaints Log
              </h2>
              <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
                Review, filter, and allocate wardens to hostel complaints.
              </p>
            </div>
            <button
              onClick={exportToCSV}
              style={{
                background: THEME.colors.white,
                color: THEME.colors.purple600,
                border: `1.5px solid ${THEME.colors.purple600}`,
                borderRadius: THEME.radius.button,
                padding: '10px 20px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: THEME.transition
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.purple50; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Export CSV 📤
            </button>
          </div>

          {/* Advanced Filter Bar (White Card) */}
          <div
            style={{
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
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Status Filter */}
              <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: THEME.colors.gray700 }}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    height: '40px',
                    borderRadius: THEME.radius.small,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '13px',
                    backgroundColor: THEME.colors.white
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Category Filter */}
              <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: THEME.colors.gray700 }}>Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    height: '40px',
                    borderRadius: THEME.radius.small,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '13px',
                    backgroundColor: THEME.colors.white
                  }}
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: THEME.colors.gray700 }}>Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={{
                    height: '40px',
                    borderRadius: THEME.radius.small,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Date To */}
              <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: THEME.colors.gray700 }}>Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{
                    height: '40px',
                    borderRadius: THEME.radius.small,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Search input */}
              <div style={{ flex: 2, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: THEME.colors.gray700 }}>Search Query</label>
                <input
                  type="text"
                  placeholder="Search title, student name, room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    height: '40px',
                    borderRadius: THEME.radius.small,
                    border: `1.5px solid ${THEME.colors.gray200}`,
                    padding: '0 12px',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            {/* Filter buttons row */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', borderTop: `1px solid ${THEME.colors.gray100}`, paddingTop: '16px' }}>
              <span
                onClick={handleResetFilters}
                style={{ fontSize: '13px', color: THEME.colors.gray500, fontWeight: '600', cursor: 'pointer' }}
              >
                Reset
              </span>
              <button
                onClick={handleApplyFilters}
                style={{
                  background: THEME.gradients.primaryBtn,
                  color: THEME.colors.white,
                  border: 'none',
                  borderRadius: THEME.radius.button,
                  padding: '8px 20px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: THEME.transition
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div style={{ fontSize: '13px', color: THEME.colors.gray500, fontWeight: '500' }}>
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </div>

          {/* Complaints Table Card */}
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
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: THEME.colors.gray50, borderBottom: `1px solid ${THEME.colors.gray200}` }}>
                    <th style={{ padding: '14px 20px', width: '40px' }}>
                      <input
                        type="checkbox"
                        onChange={handleToggleSelectAll}
                        checked={filteredComplaints.length > 0 && selectedIds.length === filteredComplaints.length}
                        style={{ cursor: 'pointer', accentColor: THEME.colors.purple600 }}
                      />
                    </th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>#ID</th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Student</th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Room</th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Title</th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Category</th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Status</th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Warden</th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Date</th>
                    <th style={{ padding: '14px 20px', color: THEME.colors.gray500, fontWeight: '700' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((comp) => {
                    const isChecked = selectedIds.includes(comp.id);
                    return (
                      <tr
                        key={comp.id}
                        style={{
                          borderBottom: `1px solid ${THEME.colors.gray100}`,
                          backgroundColor: isChecked ? THEME.colors.purple50 + '30' : 'transparent',
                          transition: THEME.transition
                        }}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(comp.id)}
                            style={{ cursor: 'pointer', accentColor: THEME.colors.purple600 }}
                          />
                        </td>
                        <td style={{ padding: '14px 20px', color: THEME.colors.gray500, fontFamily: 'monospace' }}>#{comp.id}</td>
                        <td style={{ padding: '14px 20px', fontWeight: '600', color: THEME.colors.gray900 }}>{comp.studentName}</td>
                        <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>{comp.roomNumber || '—'}</td>
                        <td style={{ padding: '14px 20px', color: THEME.colors.gray900, fontWeight: '500' }}>{comp.title}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ backgroundColor: THEME.colors.purple50, color: THEME.colors.purple600, padding: '2px 8px', borderRadius: THEME.radius.small, fontSize: '11px', fontWeight: '600' }}>
                            {comp.categoryName || 'General'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <StatusBadge status={comp.status} />
                        </td>
                        <td style={{ padding: '14px 20px', color: THEME.colors.gray700, fontWeight: '500' }}>
                          {comp.wardenName ? `👷 ${comp.wardenName}` : <span style={{ color: THEME.colors.gray400, fontStyle: 'italic' }}>Unassigned</span>}
                        </td>
                        <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                          {new Date(comp.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {comp.status === 'PENDING' ? (
                            <button
                              onClick={() => openAssignModal(comp)}
                              style={{
                                backgroundColor: THEME.colors.purple600,
                                color: THEME.colors.white,
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: THEME.radius.small,
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Assign
                            </button>
                          ) : (
                            <button
                              disabled
                              style={{
                                backgroundColor: THEME.colors.gray100,
                                color: THEME.colors.gray400,
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: THEME.radius.small,
                                fontWeight: '700',
                                fontSize: '12px'
                              }}
                            >
                              Allocated
                            </button>
                          )}
                          <button
                            onClick={() => handleViewDetails(comp)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '16px',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="View details"
                          >
                            👁️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Floating Bulk Action Bar */}
          {selectedIds.length > 0 && (
            <div
              style={{
                position: 'fixed',
                bottom: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: THEME.colors.gray900,
                color: THEME.colors.white,
                padding: '16px 28px',
                borderRadius: THEME.radius.card,
                boxShadow: THEME.shadows.dropdown,
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                zIndex: 990,
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <span>{selectedIds.length} complaints selected</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: THEME.colors.gray400, fontSize: '12px' }}>Assign to:</span>
                <select
                  value=""
                  onChange={(e) => handleBulkAssign(e.target.value)}
                  style={{
                    height: '36px',
                    borderRadius: THEME.radius.small,
                    border: 'none',
                    padding: '0 10px',
                    fontSize: '13px',
                    backgroundColor: THEME.colors.white,
                    color: THEME.colors.gray900,
                    outline: 'none',
                    fontWeight: '600'
                  }}
                >
                  <option value="">Choose Warden...</option>
                  {wardens.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setSelectedIds([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: THEME.colors.red500,
                  cursor: 'pointer',
                  fontWeight: '700'
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Assign Warden Modal */}
          <Modal
            isOpen={assignModalOpen}
            onClose={() => setAssignModalOpen(false)}
            title="Allocate Category Warden"
          >
            {selectedComplaintForAssign && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>Complaint Title</div>
                  <h4 style={{ fontSize: '15px', color: THEME.colors.gray900, margin: '4px 0 0 0', fontWeight: '700' }}>
                    {selectedComplaintForAssign.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
                    Requested Category: {selectedComplaintForAssign.categoryName || 'General'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                    Select Warden
                  </label>
                  <select
                    value={selectedWardenId}
                    onChange={(e) => setSelectedWardenId(e.target.value)}
                    style={{
                      height: '44px',
                      borderRadius: THEME.radius.input,
                      border: `1.5px solid ${THEME.colors.gray200}`,
                      padding: '0 12px',
                      fontSize: '14px',
                      backgroundColor: THEME.colors.white
                    }}
                  >
                    <option value="">Select a warden...</option>
                    {wardens.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.assignedCategoryName || 'General Specialist'})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button
                    onClick={() => setAssignModalOpen(false)}
                    style={{
                      background: 'none',
                      border: `1.5px solid ${THEME.colors.gray200}`,
                      borderRadius: THEME.radius.button,
                      padding: '10px 20px',
                      color: THEME.colors.gray700,
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAssign}
                    disabled={submittingAssign}
                    style={{
                      background: THEME.gradients.primaryBtn,
                      color: THEME.colors.white,
                      border: 'none',
                      borderRadius: THEME.radius.button,
                      padding: '10px 24px',
                      fontWeight: '600',
                      cursor: submittingAssign ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {submittingAssign ? <LoadingSpinner size="18px" color="#FFFFFF" /> : 'Confirm Assignment'}
                  </button>
                </div>
              </div>
            )}
          </Modal>

          {/* Details Modal */}
          <Modal
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            title="Complaint Full Information"
          >
            {viewedComplaint && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: THEME.colors.gray500, fontFamily: 'monospace' }}>
                    #TICKET-{viewedComplaint.id}
                  </span>
                  <StatusBadge status={viewedComplaint.status} />
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                    {viewedComplaint.title}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px', backgroundColor: THEME.colors.gray50, borderRadius: THEME.radius.card }}>
                  <div>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>Student</span>
                    <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>{viewedComplaint.studentName}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>Room</span>
                    <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>{viewedComplaint.roomNumber || '—'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>Category</span>
                    <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>{viewedComplaint.categoryName || 'General'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>Submitted</span>
                    <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>{new Date(viewedComplaint.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>Description</span>
                  <p style={{ color: THEME.colors.gray700, margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {viewedComplaint.description}
                  </p>
                </div>

                {viewedComplaint.wardenRemark && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${THEME.colors.gray100}`, paddingTop: '16px' }}>
                    <span style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase' }}>
                      Warden's Remark ({viewedComplaint.wardenName})
                    </span>
                    <p style={{ color: THEME.colors.purple900, backgroundColor: THEME.colors.purple50, padding: '12px', borderRadius: THEME.radius.small, margin: 0 }}>
                      {viewedComplaint.wardenRemark}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    onClick={() => setDetailsModalOpen(false)}
                    style={{
                      background: THEME.gradients.primaryBtn,
                      color: THEME.colors.white,
                      border: 'none',
                      borderRadius: THEME.radius.button,
                      padding: '10px 24px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Modal>

        </div>
      )}
    </DashboardLayout>
  );
};

export default AllComplaints;
