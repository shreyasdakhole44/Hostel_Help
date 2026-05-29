import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(''); // 'RESOLVED_PENDING' or 'REJECTED'
  const [remark, setRemark] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await api.get(`/api/warden/complaints/${id}`);
      setComplaint(res.data);
      if (res.data.status === 'IN_PROGRESS') {
        setUpdateStatus('RESOLVED_PENDING');
      }
      setRemark(res.data.wardenRemark || '');
    } catch (err) {
      console.error('Error fetching complaint detail', err);
      toast.error('Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorking = async () => {
    setSubmitting(true);
    try {
      const res = await api.put(`/api/warden/complaints/${id}/status`, {
        status: 'IN_PROGRESS',
        wardenRemark: 'Started working on this issue.',
      });
      setComplaint(res.data);
      setUpdateStatus('RESOLVED_PENDING');
      setRemark('Started working on this issue.');
      toast.success('Complaint status updated to IN PROGRESS');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalizeStatus = async (e) => {
    e.preventDefault();
    if (!remark.trim()) {
      toast.warning('Please enter a remark before finalizing.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.put(`/api/warden/complaints/${id}/status`, {
        status: updateStatus,
        wardenRemark: remark,
      });
      setComplaint(res.data);
      toast.success(`Complaint marked as ${updateStatus}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to finalize complaint';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <p style={styles.loading}>Loading complaint details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={styles.page}>
        <Navbar />
        <p style={styles.loading}>Complaint not found.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back to Complaints</button>

        <div style={styles.card}>
          {/* Header row */}
          <div style={styles.headerRow}>
            <div>
              <span style={styles.complaintId}>Complaint #{complaint.id}</span>
              <h2 style={styles.title}>{complaint.title}</h2>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          {/* Meta Grid */}
          <div style={styles.metaGrid}>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Student Name</p>
              <p style={styles.metaValue}>{complaint.studentName}</p>
            </div>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Category</p>
              <p style={styles.metaValue}>{complaint.categoryName || '—'}</p>
            </div>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Submitted On</p>
              <p style={styles.metaValue}>{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Last Updated</p>
              <p style={styles.metaValue}>{new Date(complaint.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Description */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>Student Description</p>
            <p style={styles.sectionText}>{complaint.description}</p>
          </div>

          {/* Existing remarks */}
          {complaint.wardenRemark && (complaint.status === 'RESOLVED' || complaint.status === 'RESOLVED_PENDING' || complaint.status === 'CLOSED' || complaint.status === 'REJECTED') && (
            <div style={{
              ...styles.remarkBox,
              borderLeftColor: (complaint.status === 'RESOLVED' || complaint.status === 'RESOLVED_PENDING' || complaint.status === 'CLOSED') ? '#10b981' : '#ef4444',
              backgroundColor: (complaint.status === 'RESOLVED' || complaint.status === 'RESOLVED_PENDING' || complaint.status === 'CLOSED') ? '#ecfdf5' : '#fef2f2',
            }}>
              <p style={{
                ...styles.remarkLabel,
                color: (complaint.status === 'RESOLVED' || complaint.status === 'RESOLVED_PENDING' || complaint.status === 'CLOSED') ? '#047857' : '#b91c1c',
              }}>
                💬 Warden Remark ({complaint.status})
              </p>
              <p style={{
                ...styles.remarkText,
                color: (complaint.status === 'RESOLVED' || complaint.status === 'RESOLVED_PENDING' || complaint.status === 'CLOSED') ? '#065f46' : '#991b1b',
              }}>{complaint.wardenRemark}</p>
            </div>
          )}

          {/* Status Updates Interaction */}
          {complaint.status === 'ASSIGNED' && (
            <div style={styles.actionPanel}>
              <h3 style={styles.actionTitle}>Take Action</h3>
              <p style={styles.actionDesc}>Acknowledge this complaint and start working on resolving it.</p>
              <button
                onClick={handleStartWorking}
                disabled={submitting}
                style={styles.primaryBtn}
              >
                {submitting ? 'Updating...' : '🔧 Start Working / In Progress'}
              </button>
            </div>
          )}

          {complaint.status === 'IN_PROGRESS' && (
            <div style={styles.actionPanel}>
              <h3 style={styles.actionTitle}>Resolve or Reject Complaint</h3>
              <form onSubmit={handleFinalizeStatus} style={styles.form}>
                
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="statusChoice"
                      value="RESOLVED_PENDING"
                      checked={updateStatus === 'RESOLVED_PENDING'}
                      onChange={() => setUpdateStatus('RESOLVED_PENDING')}
                      style={styles.radioInput}
                    />
                    <span style={{color: '#059669', fontWeight: '600'}}>Mark Resolved</span>
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="statusChoice"
                      value="REJECTED"
                      checked={updateStatus === 'REJECTED'}
                      onChange={() => setUpdateStatus('REJECTED')}
                      style={styles.radioInput}
                    />
                    <span style={{color: '#dc2626', fontWeight: '600'}}>Reject Complaint</span>
                  </label>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Warden Remark / Resolution Summary *</label>
                  <textarea
                    rows={4}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter details about what was fixed or why this was rejected..."
                    required
                    style={styles.textarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...styles.primaryBtn,
                    backgroundColor: updateStatus === 'RESOLVED_PENDING' ? '#059669' : '#dc2626',
                    boxShadow: updateStatus === 'RESOLVED_PENDING' ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 4px 12px rgba(220, 38, 38, 0.2)'
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Resolution'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content: { maxWidth: '750px', margin: '0 auto', padding: '32px 24px' },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
  backBtn: { background: 'none', border: 'none', fontSize: '15px', color: '#4f46e5', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', padding: 0 },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  complaintId: { fontSize: '13px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' },
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', border: '1px solid #e2e8f0' },
  metaItem: {},
  metaLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px 0' },
  metaValue: { fontSize: '14px', color: '#1e293b', fontWeight: '600', margin: 0 },
  section: { marginBottom: '24px' },
  sectionLabel: { fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' },
  sectionText: { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: 0 },
  remarkBox: { borderLeft: '4px solid', borderRadius: '8px', padding: '16px', marginBottom: '24px' },
  remarkLabel: { fontSize: '13px', fontWeight: '700', margin: '0 0 8px 0' },
  remarkText: { fontSize: '14px', margin: 0, lineHeight: '1.5' },
  actionPanel: { borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginTop: '24px' },
  actionTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' },
  actionDesc: { fontSize: '13px', color: '#64748b', marginBottom: '16px' },
  primaryBtn: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
    transition: 'all 0.2s',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  radioGroup: { display: 'flex', gap: '24px', margin: '8px 0' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' },
  radioInput: { width: '16px', height: '16px', accentColor: '#4f46e5' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' },
};

export default ComplaintDetail;
