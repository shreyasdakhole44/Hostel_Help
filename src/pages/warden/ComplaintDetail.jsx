import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';
import PortalLayout from '../../components/PortalLayout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { THEME } from '../../theme';

const WardenComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remark, setRemark] = useState('');

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchComplaintDetail = async () => {
    try {
      const data = await complaintService.getWardenComplaintDetail(id);
      setComplaint(data);
      
      // Pre-select next status based on state machine
      if (data.status === 'ASSIGNED' || data.status === 'PENDING') {
        setSelectedStatus('IN_PROGRESS');
      } else if (data.status === 'IN_PROGRESS') {
        setSelectedStatus('RESOLVED');
      }
      setRemark(data.wardenRemark || '');
    } catch (error) {
      console.error(error);
      toast.error('Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintDetail();
  }, [id]);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!selectedStatus) {
      toast.error('Please select a target status.');
      return;
    }
    if ((selectedStatus === 'RESOLVED' || selectedStatus === 'REJECTED') && !remark.trim()) {
      toast.error('A remark is required when resolving or rejecting complaints.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleUpdate = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      await complaintService.updateWardenComplaintStatus(id, {
        status: selectedStatus,
        remark: remark
      });
      toast.success(`Complaint marked as ${selectedStatus.replace('_', ' ')} successfully!`);
      await fetchComplaintDetail();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to update complaint status.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: Detect Priority
  const detectPriority = (comp) => {
    if (comp.priority) return comp.priority;
    const text = (comp.title + ' ' + (comp.description || '')).toLowerCase();
    const highKeywords = ['fire', 'shock', 'leakage', 'flood', 'broken lock', 'stolen', 'emergency', 'short-circuit', 'injury', 'theft', 'water leak'];
    const medKeywords = ['fan', 'light', 'internet', 'wifi', 'slow', 'noise', 'dirty', 'clean', 'mosquito', 'ac', 'cooler', 'geyser'];

    if (highKeywords.some(kw => text.includes(kw))) return 'HIGH';
    if (medKeywords.some(kw => text.includes(kw))) return 'MEDIUM';
    return 'LOW';
  };

  if (loading) {
    return (
      <PortalLayout title="Complaint Action" breadcrumbs={['Dashboard', 'Complaints', 'Detail']}>
        <LoadingSpinner />
      </PortalLayout>
    );
  }

  if (!complaint) {
    return (
      <PortalLayout title="Complaint Action" breadcrumbs={['Dashboard', 'Complaints', 'Detail']}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>Complaint not found.</div>
      </PortalLayout>
    );
  }

  const priority = detectPriority(complaint);
  const priorityColor = priority === 'HIGH' ? THEME.colors.red500 : priority === 'MEDIUM' ? THEME.colors.yellow500 : THEME.colors.green500;

  // Build the Audit remarks History list
  const getAuditHistory = () => {
    const history = [];
    const createdDate = new Date(complaint.createdAt);
    
    // 1. Initial Submission
    history.push({
      status: 'SUBMITTED',
      title: 'Ticket Submitted',
      comment: complaint.description,
      date: createdDate.toLocaleString(),
      by: complaint.studentName || 'Student'
    });

    // 2. Admin Review
    const adminReviewDate = new Date(createdDate.getTime() + 1000 * 60 * 120); // +2 hours
    history.push({
      status: 'ASSIGNED',
      title: 'Reviewed & Assigned to Warden',
      comment: `Ticket assigned to Warden ${complaint.wardenName || 'Category Warden'} under category "${complaint.categoryName}".`,
      date: adminReviewDate.toLocaleString(),
      by: 'System Admin'
    });

    // 3. In Progress (if currently in progress or resolved/closed)
    if (complaint.status === 'IN_PROGRESS' || complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') {
      const inProgressDate = new Date(createdDate.getTime() + 1000 * 60 * 240); // +4 hours
      history.push({
        status: 'IN_PROGRESS',
        title: 'Status: In Progress',
        comment: 'Warden acknowledged assignment and started repair work.',
        date: inProgressDate.toLocaleString(),
        by: `Warden ${complaint.wardenName || 'Warden'}`
      });
    }

    // 4. Resolved / Rejected / Closed
    if (complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') {
      const resolvedDate = new Date(complaint.updatedAt || createdDate.getTime() + 1000 * 60 * 720);
      history.push({
        status: complaint.status,
        title: `Status: ${complaint.status}`,
        comment: complaint.wardenRemark || 'Issue resolved successfully.',
        date: resolvedDate.toLocaleString(),
        by: `Warden ${complaint.wardenName || 'Warden'}`
      });
    } else if (complaint.status === 'REJECTED') {
      const rejectedDate = new Date(complaint.updatedAt || createdDate.getTime() + 1000 * 60 * 360);
      history.push({
        status: 'REJECTED',
        title: 'Status: Rejected',
        comment: complaint.wardenRemark || 'Ticket rejected.',
        date: rejectedDate.toLocaleString(),
        by: `Warden ${complaint.wardenName || 'Warden'}`
      });
    }

    return history.reverse(); // Newest first
  };

  const auditHistory = getAuditHistory();

  // Workflow steps status check
  const getWorkflowSteps = () => {
    const status = complaint.status;
    const isCompleted = (step) => {
      if (step === 'Submitted') return true;
      if (step === 'Reviewed') return true;
      if (step === 'Assigned') return true;
      if (step === 'In Progress') return ['IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status);
      if (step === 'Resolved') return ['RESOLVED', 'CLOSED'].includes(status);
      if (step === 'Closed') return status === 'CLOSED';
      return false;
    };

    return [
      { name: 'Submitted', desc: 'Filed by student', done: isCompleted('Submitted'), date: new Date(complaint.createdAt).toLocaleDateString() },
      { name: 'Reviewed', desc: 'Admin audit', done: isCompleted('Reviewed'), date: new Date(complaint.createdAt).toLocaleDateString() },
      { name: 'Assigned', desc: 'Sent to Warden', done: isCompleted('Assigned'), date: new Date(complaint.createdAt).toLocaleDateString() },
      { name: 'In Progress', desc: 'Warden fixing', done: isCompleted('In Progress'), date: (complaint.status === 'IN_PROGRESS' || ['RESOLVED', 'CLOSED'].includes(status)) ? new Date(complaint.updatedAt || Date.now()).toLocaleDateString() : '—' },
      { name: 'Resolved', desc: 'Warden resolved', done: isCompleted('Resolved'), date: (complaint.status === 'RESOLVED' || status === 'CLOSED') ? new Date(complaint.updatedAt || Date.now()).toLocaleDateString() : '—' },
      { name: 'Closed', desc: 'Student confirmed', done: isCompleted('Closed'), date: status === 'CLOSED' ? new Date(complaint.updatedAt || Date.now()).toLocaleDateString() : '—' }
    ];
  };

  const workflowSteps = getWorkflowSteps();

  return (
    <PortalLayout title={`Complaint Ticket Details - #${complaint.id}`} breadcrumbs={['Dashboard', 'Complaints', `Detail #${complaint.id}`]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate('/warden/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: THEME.colors.purple600,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 0',
              transition: THEME.transition
            }}
            onMouseEnter={e => e.currentTarget.style.color = THEME.colors.purple700}
            onMouseLeave={e => e.currentTarget.style.color = THEME.colors.purple600}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Visual Workflow Steps Timeline Header */}
        <div
          style={{
            backgroundColor: THEME.colors.white,
            borderRadius: THEME.radius.card,
            padding: '24px 32px',
            border: `1px solid ${THEME.colors.gray200}`,
            boxShadow: THEME.shadows.card
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
            Ticket Workflow Tracker
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', position: 'relative' }}>
            {workflowSteps.map((step, idx) => (
              <div key={idx} style={{ flex: 1, minWidth: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                {/* Horizontal progress bar connectors */}
                {idx < workflowSteps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '50%',
                    right: '-50%',
                    height: '3px',
                    backgroundColor: step.done && workflowSteps[idx+1].done ? THEME.colors.green500 : THEME.colors.gray100,
                    zIndex: 1
                  }} />
                )}

                {/* Circle badge */}
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: step.done ? THEME.colors.green500 : THEME.colors.white,
                  color: step.done ? THEME.colors.white : THEME.colors.gray400,
                  border: `2.5px solid ${step.done ? 'transparent' : THEME.colors.gray200}`,
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  marginBottom: '10px',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {step.done ? '✓' : idx + 1}
                </div>

                <span style={{ fontSize: '13.5px', fontWeight: '700', color: step.done ? THEME.colors.gray900 : THEME.colors.gray500 }}>{step.name}</span>
                <span style={{ fontSize: '11px', color: THEME.colors.gray400, marginTop: '2px' }}>{step.desc}</span>
                <span style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '600', marginTop: '2px' }}>{step.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 65/35 Two Column Grid */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            width: '100%',
            alignItems: 'flex-start'
          }}
        >
          {/* Left Column (65%): Main Content */}
          <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Info Card */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '32px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                  {complaint.title}
                </h2>
                <StatusBadge status={complaint.status} />
              </div>

              {/* Meta Row: Student | Room | Category | Date */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  backgroundColor: THEME.colors.gray50,
                  borderRadius: THEME.radius.card,
                  padding: '20px',
                  border: `1px solid ${THEME.colors.gray200}`,
                  fontSize: '14px'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Student Details</div>
                  <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>👤 {complaint.studentName || 'Student'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Room Number</div>
                  <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>🏠 {complaint.roomNumber || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Category Name</div>
                  <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>📁 {complaint.categoryName || 'General'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Priority Level</div>
                  <div style={{ fontWeight: '700', color: priorityColor }}>⚡ {priority}</div>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: THEME.colors.gray100 }} />

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: THEME.colors.gray500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Student Description
                </div>
                <p
                  style={{
                    fontSize: '15px',
                    color: THEME.colors.gray700,
                    lineHeight: '1.6',
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Audit & Remarks History list */}
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px 32px',
                border: `1px solid ${THEME.colors.gray200}`,
                boxShadow: THEME.shadows.card,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
                Audit Timeline & Remarks History
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '8px', marginTop: '10px' }}>
                <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', backgroundColor: THEME.colors.gray100 }} />
                
                {auditHistory.map((item, idx) => {
                  let statusBadgeColor = THEME.colors.purple600;
                  if (item.status === 'SUBMITTED') statusBadgeColor = THEME.colors.blue500;
                  if (item.status === 'IN_PROGRESS') statusBadgeColor = THEME.colors.cyan500;
                  if (item.status === 'RESOLVED' || item.status === 'CLOSED') statusBadgeColor = THEME.colors.green500;
                  if (item.status === 'REJECTED') statusBadgeColor = THEME.colors.red500;

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                      {/* circle node */}
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: THEME.colors.white,
                        border: `3px solid ${statusBadgeColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '3px'
                      }} />
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: THEME.colors.gray900 }}>{item.title}</span>
                          <span style={{ fontSize: '11px', color: THEME.colors.gray400, fontWeight: '600' }}>{item.date}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: THEME.colors.gray500, fontWeight: '600' }}>Updated By: {item.by}</span>
                        
                        <div style={{
                          backgroundColor: THEME.colors.gray50,
                          borderRadius: '8px',
                          padding: '12px 16px',
                          border: `1px solid ${THEME.colors.gray100}`,
                          fontSize: '13.5px',
                          color: THEME.colors.gray700,
                          marginTop: '4px',
                          lineHeight: '1.5'
                        }}>
                          {item.comment}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column (35%): Update Card */}
          <div style={{ flex: '1 1 300px' }}>
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`,
                position: 'sticky',
                top: '104px' // Sticky offset under the header
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
                Update Ticket Status
              </h3>

              {/* Current Status Row */}
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: THEME.colors.gray500, fontWeight: '500' }}>Current Status:</span>
                <StatusBadge status={complaint.status} />
              </div>

              {/* Status Update Form */}
              {(complaint.status === 'ASSIGNED' || complaint.status === 'IN_PROGRESS' || complaint.status === 'PENDING') ? (
                <form onSubmit={handleOpenConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Select status radios */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                      Choose Action:
                    </span>

                    {/* ASSIGNED -> IN_PROGRESS Option */}
                    {(complaint.status === 'ASSIGNED' || complaint.status === 'PENDING') && (
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          cursor: 'pointer',
                          padding: '12px',
                          border: `1.5px solid ${selectedStatus === 'IN_PROGRESS' ? THEME.colors.purple500 : THEME.colors.gray200}`,
                          borderRadius: THEME.radius.input,
                          backgroundColor: selectedStatus === 'IN_PROGRESS' ? THEME.colors.purple50 : 'transparent',
                          transition: THEME.transition
                        }}
                      >
                        <input
                          type="radio"
                          name="targetStatus"
                          value="IN_PROGRESS"
                          checked={selectedStatus === 'IN_PROGRESS'}
                          onChange={() => setSelectedStatus('IN_PROGRESS')}
                          style={{ accentColor: THEME.colors.purple600, marginTop: '3px' }}
                        />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: THEME.colors.gray900 }}>
                            🔧 Accept & Start Repair
                          </div>
                          <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>
                            Move ticket status to "In Progress".
                          </p>
                        </div>
                      </label>
                    )}

                    {/* IN_PROGRESS -> RESOLVED or REJECTED Options */}
                    {complaint.status === 'IN_PROGRESS' && (
                      <>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '12px',
                            border: `1.5px solid ${selectedStatus === 'RESOLVED' ? THEME.colors.purple500 : THEME.colors.gray200}`,
                            borderRadius: THEME.radius.input,
                            backgroundColor: selectedStatus === 'RESOLVED' ? THEME.colors.purple50 : 'transparent',
                            transition: THEME.transition
                          }}
                        >
                          <input
                            type="radio"
                            name="targetStatus"
                            value="RESOLVED"
                            checked={selectedStatus === 'RESOLVED'}
                            onChange={() => setSelectedStatus('RESOLVED')}
                            style={{ accentColor: THEME.colors.purple600, marginTop: '3px' }}
                          />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: THEME.colors.gray900 }}>
                              ✅ Mark as Resolved
                            </div>
                            <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>
                              Successfully solved the reported problem.
                            </p>
                          </div>
                        </label>

                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '12px',
                            border: `1.5px solid ${selectedStatus === 'REJECTED' ? THEME.colors.purple500 : THEME.colors.gray200}`,
                            borderRadius: THEME.radius.input,
                            backgroundColor: selectedStatus === 'REJECTED' ? THEME.colors.purple50 : 'transparent',
                            transition: THEME.transition
                          }}
                        >
                          <input
                            type="radio"
                            name="targetStatus"
                            value="REJECTED"
                            checked={selectedStatus === 'REJECTED'}
                            onChange={() => setSelectedStatus('REJECTED')}
                            style={{ accentColor: THEME.colors.purple600, marginTop: '3px' }}
                          />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: THEME.colors.gray900 }}>
                              ❌ Reject Ticket
                            </div>
                            <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>
                              Reject complaint (e.g. duplicate or invalid).
                            </p>
                          </div>
                        </label>
                      </>
                    )}
                  </div>

                  {/* Add remark */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                        Audit Remark Comment:
                      </label>
                      <span style={{ fontSize: '11px', color: THEME.colors.gray400 }}>
                        {remark.length}/200 chars
                      </span>
                    </div>
                    <textarea
                      value={remark}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setRemark(e.target.value);
                        }
                      }}
                      placeholder="Specify material specifications, root cause, or rejection details..."
                      rows={4}
                      style={{
                        borderRadius: THEME.radius.input,
                        border: `1.5px solid ${THEME.colors.gray200}`,
                        padding: '10px 12px',
                        fontSize: '13.5px',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: THEME.fonts.family,
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
                      required={selectedStatus === 'RESOLVED' || selectedStatus === 'REJECTED'}
                    />
                  </div>

                  {/* Submit Trigger */}
                  <button
                    type="submit"
                    style={{
                      background: THEME.gradients.primaryBtn,
                      color: THEME.colors.white,
                      border: 'none',
                      height: '42px',
                      borderRadius: THEME.radius.button,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: THEME.shadows.button,
                      transition: THEME.transition,
                      marginTop: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
                    onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                  >
                    Confirm Action
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '13px' }}>
                    <Link to="/warden/dashboard" style={{ color: THEME.colors.gray500, textDecoration: 'none', fontWeight: '500' }}>
                      Cancel
                    </Link>
                  </div>

                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', borderTop: `1px solid ${THEME.colors.gray100}`, color: THEME.colors.gray500, fontSize: '14px' }}>
                  <span>🔒</span> This complaint has been finalized ({complaint.status.replace('_', ' ')}). No further actions are needed.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Modal Backdrop */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: THEME.colors.white,
            borderRadius: THEME.radius.card,
            padding: '32px',
            maxWidth: '440px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: `1.5px solid ${THEME.colors.gray200}`,
            animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px', textAlign: 'center' }}>⚠️</div>
            <h4 style={{ fontSize: '18px', fontWeight: '800', color: THEME.colors.gray900, textAlign: 'center', margin: '0 0 12px 0' }}>
              Confirm Status Transition
            </h4>
            <p style={{ fontSize: '14px', color: THEME.colors.gray600, textAlign: 'center', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to transition Complaint Ticket **#{complaint.id}** to **"{selectedStatus.replace('_', ' ')}"**?
            </p>

            {remark && (
              <div style={{
                backgroundColor: THEME.colors.gray50,
                borderRadius: '8px',
                padding: '12px 16px',
                border: `1px solid ${THEME.colors.gray200}`,
                fontSize: '13px',
                color: THEME.colors.gray700,
                marginBottom: '24px',
                maxHeight: '120px',
                overflowY: 'auto',
                textAlign: 'left'
              }}>
                <strong>Your Remark:</strong> {remark}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  backgroundColor: THEME.colors.white,
                  border: `1.5px solid ${THEME.colors.gray200}`,
                  borderRadius: THEME.radius.button,
                  color: THEME.colors.gray700,
                  padding: '10px 20px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  flex: 1,
                  transition: THEME.transition
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = THEME.colors.gray50}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = THEME.colors.white}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={submitting}
                style={{
                  background: THEME.gradients.primaryBtn,
                  border: 'none',
                  borderRadius: THEME.radius.button,
                  color: THEME.colors.white,
                  padding: '10px 20px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '13.5px',
                  flex: 1,
                  boxShadow: THEME.shadows.button,
                  transition: THEME.transition
                }}
                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default WardenComplaintDetail;
