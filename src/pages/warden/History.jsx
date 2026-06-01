import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import { complaintService } from '../../services/complaintService';
import PortalLayout from '../../components/PortalLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { THEME } from '../../theme';

const WardenHistory = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'RESOLVED' | 'REJECTED' | 'CLOSED'
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await complaintService.getWardenComplaints();
        // Only load finalized complaints (Resolved, Rejected, Closed)
        const finalized = (data || []).filter(
          c => c.status === 'RESOLVED' || c.status === 'REJECTED' || c.status === 'CLOSED'
        );
        setComplaints(finalized);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load complaint history.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const detectPriority = (comp) => {
    if (comp.priority) return comp.priority;
    const text = (comp.title + ' ' + (comp.description || '')).toLowerCase();
    const highKeywords = ['fire', 'shock', 'leakage', 'flood', 'broken lock', 'stolen', 'emergency', 'short-circuit', 'injury', 'theft', 'water leak'];
    const medKeywords = ['fan', 'light', 'internet', 'wifi', 'slow', 'noise', 'dirty', 'clean', 'mosquito', 'ac', 'cooler', 'geyser'];

    if (highKeywords.some(kw => text.includes(kw))) return 'HIGH';
    if (medKeywords.some(kw => text.includes(kw))) return 'MEDIUM';
    return 'LOW';
  };

  // Get categories dynamically
  const categories = ['ALL', ...new Set(complaints.map(c => c.categoryName).filter(Boolean))];

  // Filtering Logic
  const filteredComplaints = complaints.filter(comp => {
    const matchesStatus = statusFilter === 'ALL' || comp.status === statusFilter;
    const priority = detectPriority(comp);
    const matchesPriority = priorityFilter === 'ALL' || priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || comp.categoryName === categoryFilter;

    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.studentName && comp.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      comp.id.toString().includes(searchQuery) ||
      (comp.categoryName && comp.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(comp.createdAt) >= new Date(dateFrom);
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && new Date(comp.createdAt) <= endDate;
    }

    return matchesStatus && matchesPriority && matchesCategory && matchesSearch && matchesDate;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredComplaints.length === 0) {
      toast.warning('No data to export.');
      return;
    }

    const headers = ['Complaint ID', 'Title', 'Student', 'Room Number', 'Category', 'Priority', 'Status', 'Submitted Date', 'Remark'];
    const rows = filteredComplaints.map(c => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.studentName || 'Student',
      c.roomNumber || '—',
      c.categoryName || 'General',
      detectPriority(c),
      c.status,
      new Date(c.createdAt).toLocaleDateString(),
      `"${(c.wardenRemark || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Warden_Complaint_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Report exported successfully!');
  };

  // Export to PDF Function
  const exportToPDF = () => {
    if (filteredComplaints.length === 0) {
      toast.warning('No data to export.');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title & Header
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(124, 58, 237); // Purple theme primary
      doc.text("Hostel Help - Complaint Resolution Report", 14, 20);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 26);
      doc.text(`Total Records: ${filteredComplaints.length}`, 14, 32);

      // Line separator
      doc.setDrawColor(229, 231, 235);
      doc.line(14, 38, pageWidth - 14, 38);

      let yPos = 48;

      filteredComplaints.forEach((c, idx) => {
        // Check for page overflow
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(17, 24, 39);
        doc.text(`#${c.id} - ${c.title}`, 14, yPos);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        doc.text(`Student: ${c.studentName || 'N/A'} (Room ${c.roomNumber || 'N/A'})`, 14, yPos + 6);
        doc.text(`Category: ${c.categoryName || 'General'}  |  Priority: ${detectPriority(c)}  |  Status: ${c.status}`, 14, yPos + 11);
        
        if (c.wardenRemark) {
          doc.setTextColor(76, 29, 149); // Dark purple
          doc.setFont('Helvetica', 'oblique');
          doc.text(`Remark: ${c.wardenRemark}`, 14, yPos + 16);
        }

        // Draw dotted separator line between complaints
        doc.setDrawColor(243, 244, 246);
        doc.line(14, yPos + 22, pageWidth - 14, yPos + 22);

        yPos += 30;
      });

      doc.save(`Warden_Complaint_History_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF Report exported successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF report.');
    }
  };

  return (
    <PortalLayout title="Finalized Complaints History" breadcrumbs={['Dashboard', 'History']}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                Resolution Log
              </h2>
              <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
                Review resolved, rejected, and closed tickets assigned to you.
              </p>
            </div>

            {/* Export buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={exportToCSV}
                style={{
                  backgroundColor: THEME.colors.white,
                  border: `1.5px solid ${THEME.colors.gray200}`,
                  borderRadius: THEME.radius.button,
                  color: THEME.colors.gray700,
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: THEME.transition
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = THEME.colors.gray50}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = THEME.colors.white}
              >
                📥 Export CSV
              </button>
              <button
                onClick={exportToPDF}
                style={{
                  background: THEME.gradients.primaryBtn,
                  border: 'none',
                  borderRadius: THEME.radius.button,
                  color: THEME.colors.white,
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: THEME.shadows.button,
                  transition: THEME.transition
                }}
                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
              >
                📄 Export PDF
              </button>
            </div>
          </div>

          {/* Filtering and Search Panel */}
          <div
            style={{
              backgroundColor: THEME.colors.white,
              borderRadius: THEME.radius.card,
              padding: '20px 24px',
              border: `1px solid ${THEME.colors.gray200}`,
              boxShadow: THEME.shadows.card,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Top row: search + status filter */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
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
                  onFocus={e => {
                    e.target.style.borderColor = THEME.colors.purple500;
                    e.target.style.backgroundColor = THEME.colors.white;
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = THEME.colors.gray200;
                    e.target.style.backgroundColor = THEME.colors.gray50;
                  }}
                />
              </div>

              {/* Status Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
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
                  <option value="ALL">All Statuses</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: category + priority + date range */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Category selector */}
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

              {/* Priority selector */}
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
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              {/* Date pickers */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: THEME.colors.gray500 }}>From</span>
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
                <span style={{ fontSize: '13px', color: THEME.colors.gray500 }}>To</span>
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

          {/* Complaints Table Card */}
          {filteredComplaints.length === 0 ? (
            <EmptyState
              icon="📋"
              heading="No records found"
              subtext="No historical complaints match your current filter parameters."
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
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>ID</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Title</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Student</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Category</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Priority</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Completed Date</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Warden Remark</th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map(comp => {
                      const priority = detectPriority(comp);
                      const priorityColor = priority === 'HIGH' ? THEME.colors.red500 : priority === 'MEDIUM' ? THEME.colors.yellow500 : THEME.colors.green500;

                      return (
                        <tr
                          key={comp.id}
                          style={{
                            borderBottom: `1px solid ${THEME.colors.gray100}`,
                            transition: THEME.transition
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = THEME.colors.gray50}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500, fontFamily: 'monospace' }}>#{comp.id}</td>
                          <td style={{ padding: '14px 20px', fontWeight: '600', color: THEME.colors.gray900 }}>{comp.title}</td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray700 }}>
                            {comp.studentName} (Room {comp.roomNumber || '—'})
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            <span style={{ backgroundColor: THEME.colors.purple50, color: THEME.colors.purple600, padding: '2px 8px', borderRadius: THEME.radius.small, fontSize: '12px', fontWeight: '600' }}>
                              {comp.categoryName}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', color: priorityColor, fontWeight: '700', fontSize: '12px' }}>
                            {priority}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <StatusBadge status={comp.status} />
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500 }}>
                            {new Date(comp.updatedAt || comp.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '14px 20px', color: THEME.colors.gray500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {comp.wardenRemark || '—'}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <button
                              onClick={() => navigate(`/warden/complaints/${comp.id}`)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: THEME.colors.purple600,
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '13px'
                              }}
                            >
                              View Details
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

export default WardenHistory;
