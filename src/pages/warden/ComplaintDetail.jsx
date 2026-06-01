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

  const fetchComplaintDetail = async () => {
    try {
      const data = await complaintService.getWardenComplaintDetail(id);
      setComplaint(data);
      // Pre-select next status based on state machine
      if (data.status === 'ASSIGNED') {
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedStatus) {
      toast.error('Please select a target status.');
      return;
    }
    if ((selectedStatus === 'RESOLVED' || selectedStatus === 'REJECTED') && !remark.trim()) {
      toast.error('A remark is required when resolving or rejecting complaints.');
      return;
    }

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

  return (
    <PortalLayout title={`Update Ticket #${complaint.id}`} breadcrumbs={['Dashboard', 'Complaints', `Detail #${complaint.id}`]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
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
            onMouseEnter={(e) => { e.target.style.color = THEME.colors.purple700; }}
            onMouseLeave={(e) => { e.target.style.color = THEME.colors.purple600; }}
          >
            ← Back to Dashboard
          </button>
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
          <div
            style={{
              flex: '2 1 500px',
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
                <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Student</div>
                <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>👤 {complaint.studentName || 'Student'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Room Number</div>
                <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>🏠 {complaint.roomNumber || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Category</div>
                <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>📁 {complaint.categoryName || 'General'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: THEME.colors.gray500, fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Submitted Date</div>
                <div style={{ fontWeight: '600', color: THEME.colors.gray900 }}>📅 {new Date(complaint.createdAt).toLocaleDateString()}</div>
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

            {/* Existing remark if resolved/rejected */}
            {complaint.wardenRemark && (
              <div
                style={{
                  backgroundColor: THEME.colors.purple50,
                  borderLeft: `3px solid ${THEME.colors.purple600}`,
                  borderRadius: THEME.radius.small,
                  padding: '20px',
                  marginTop: '12px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '700', color: THEME.colors.purple900, marginBottom: '6px' }}>
                  💬 Filed Remark ({complaint.status})
                </div>
                <p style={{ fontSize: '14px', color: THEME.colors.purple900, margin: 0, lineHeight: '1.5' }}>
                  {complaint.wardenRemark}
                </p>
              </div>
            )}
          </div>

          {/* Right Column (35%): Update Card */}
          <div style={{ flex: '1 1 300px' }}>
            <div
              style={{
                backgroundColor: THEME.colors.white,
                borderRadius: THEME.radius.card,
                padding: '24px',
                boxShadow: THEME.shadows.card,
                border: `1px solid ${THEME.colors.gray200}`
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: THEME.colors.gray900, marginBottom: '20px', marginTop: 0 }}>
                Update Complaint
              </h3>

              {/* Current Status Badge row */}
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: THEME.colors.gray500, fontWeight: '500' }}>Current Status:</span>
                <StatusBadge status={complaint.status} />
              </div>

              {/* Status Update Form */}
              {(complaint.status === 'ASSIGNED' || complaint.status === 'IN_PROGRESS' || complaint.status === 'PENDING') ? (
                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Select status radios */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: THEME.colors.gray700 }}>
                      Change Status:
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
                            In Progress
                          </div>
                          <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>
                            Acknowledge the issue and begin repairing.
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
                              Resolved
                            </div>
                            <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>
                              Successfully resolve the reported issue.
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
                              Rejected
                            </div>
                            <p style={{ fontSize: '12px', color: THEME.colors.gray500, margin: '2px 0 0 0' }}>
                              Reject complaint (incorrect category, duplicate, etc.)
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
                        Add Remark:
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
                      placeholder="Specify materials replaced, repair specifics, or rejection reason..."
                      rows={4}
                      style={{
                        borderRadius: THEME.radius.input,
                        border: `1.5px solid ${THEME.colors.gray200}`,
                        padding: '10px 12px',
                        fontSize: '13px',
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: THEME.gradients.primaryBtn,
                      color: THEME.colors.white,
                      border: 'none',
                      height: '42px',
                      borderRadius: THEME.radius.button,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: THEME.shadows.button,
                      transition: THEME.transition,
                      marginTop: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting) e.currentTarget.style.filter = 'brightness(0.95)';
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) e.currentTarget.style.filter = 'none';
                    }}
                  >
                    {submitting ? <LoadingSpinner size="18px" color="#FFFFFF" /> : 'Confirm Update'}
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
    </PortalLayout>
  );
};

export default WardenComplaintDetail;
