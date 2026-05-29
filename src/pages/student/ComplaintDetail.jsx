import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const ComplaintDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [rating, setRating]       = useState(5);
  const [feedback, setFeedback]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await api.get(`/api/student/complaints/${id}`);
      setComplaint(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    setSubmitting(true);
    try {
      await api.post(`/api/student/complaints/${id}/feedback`, { rating, feedback });
      fetchComplaint();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopen = async () => {
    if (!feedback.trim()) {
      alert("Please provide a reason in the feedback box for reopening this complaint.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/student/complaints/${id}/reopen`, { feedback });
      fetchComplaint();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadPDF = () => {
    if (!complaint) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text("Hostel Help", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Official Complaint Resolution Ticket", 20, 26);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(`Ticket #${complaint.id}`, 150, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Status: ${complaint.status}`, 150, 26);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 32, 190, 32);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(complaint.title, 20, 42);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("Category", 20, 52);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(complaint.categoryName || 'Uncategorized', 20, 57);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    doc.text("Student Name", 100, 52);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(complaint.studentName || '—', 100, 57);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    doc.text("Submitted On", 20, 67);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(new Date(complaint.createdAt).toLocaleString(), 20, 72);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    doc.text("Assigned Warden", 100, 67);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(complaint.wardenName || 'Not assigned yet', 100, 72);
    
    doc.line(20, 78, 190, 78);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    doc.text("Complaint Description", 20, 88);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    
    const splitDesc = doc.splitTextToSize(complaint.description, 170);
    doc.text(splitDesc, 20, 93);
    
    let currentY = 93 + (splitDesc.length * 5) + 10;
    
    doc.line(20, currentY, 190, currentY);
    currentY += 10;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(148, 163, 184);
    doc.text("Warden Resolution Remarks", 20, currentY);
    currentY += 5;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    const remarkText = complaint.wardenRemark || "No resolution details submitted yet.";
    const splitRemark = doc.splitTextToSize(remarkText, 170);
    doc.text(splitRemark, 20, currentY);
    
    currentY += (splitRemark.length * 5) + 15;
    
    doc.setDrawColor(203, 213, 225);
    doc.line(130, currentY, 180, currentY);
    currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Authority Sign / Stamp", 130, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("This is an automated system generated receipt.", 20, 280);
    doc.text(`Printed on: ${new Date().toLocaleString()}`, 20, 285);
    
    doc.save(`complaint_receipt_${complaint.id}.pdf`);
  };

  if (loading) return <div style={styles.page}><Navbar /><p style={styles.loading}>Loading...</p></div>;
  if (!complaint) return <div style={styles.page}><Navbar /><p style={styles.loading}>Complaint not found.</p></div>;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back to Dashboard</button>
          <button 
            onClick={downloadPDF} 
            style={{
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06)'
            }}
            className="hover-btn"
          >
            <span>📄</span> Generate PDF Receipt
          </button>
        </div>

        <div className="print-area print-clean" style={styles.card}>

          {/* Printable Header - hidden on screen, visible on print via media queries or clean inline layout */}
          <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#4f46e5', margin: 0 }}>🏠 Hostel Help</h1>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Official Complaint Resolution Ticket</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Ticket #{complaint.id}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>Status: {complaint.status}</p>
            </div>
          </div>

          {/* Title row */}
          <div style={styles.titleRow}>
            <h2 style={styles.title}>{complaint.title}</h2>
            <StatusBadge status={complaint.status} />
          </div>

          {/* Meta info */}
          <div style={styles.metaGrid}>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Category</p>
              <p style={styles.metaValue}>{complaint.categoryName || '—'}</p>
            </div>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Student Name</p>
              <p style={styles.metaValue}>{complaint.studentName || '—'}</p>
            </div>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Submitted on</p>
              <p style={styles.metaValue}>{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Assigned warden</p>
              <p style={styles.metaValue}>{complaint.wardenName || 'Not assigned yet'}</p>
            </div>
          </div>

          {/* Description */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>Complaint Description</p>
            <p style={styles.sectionText}>{complaint.description}</p>
          </div>

          {/* Warden remark */}
          {complaint.wardenRemark ? (
            <div style={styles.remarkBox}>
              <p style={styles.remarkLabel}>💬 Warden's Resolution Remarks</p>
              <p style={styles.remarkText}>{complaint.wardenRemark}</p>
              {complaint.resolvedAt && (
                <p style={{ fontSize: '11px', color: '#4b5563', marginTop: '8px', fontStyle: 'italic' }}>
                  Resolved on {new Date(complaint.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <div style={{ ...styles.remarkBox, backgroundColor: '#f8fafc', borderLeft: '4px solid #cbd5e1' }}>
              <p style={{ ...styles.remarkLabel, color: '#64748b' }}>⏳ Resolution Details</p>
              <p style={{ ...styles.remarkText, color: '#64748b', fontStyle: 'italic' }}>
                This issue is currently awaiting assignment or processing by the warden team.
              </p>
            </div>
          )}

          {/* Student Verification & Feedback Block */}
          {(complaint.status === 'RESOLVED_PENDING' || complaint.status === 'RESOLVED') && (
            <div className="no-print" style={{ marginTop: '24px', padding: '24px', backgroundColor: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#7c3aed', marginBottom: '8px', marginTop: 0 }}>🔔 Verify Resolution</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                The warden has marked this complaint as resolved. Please verify the solution and submit your rating and feedback.
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Rating:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: star <= rating ? '#eab308' : '#e5e7eb',
                        padding: 0,
                        transition: 'transform 0.1s ease'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4b5563', marginBottom: '6px' }}>
                  Comments / Feedback:
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe your feedback here (required for reopening)..."
                  style={{
                    width: '100%',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitFeedback}
                  style={{
                    flex: 1,
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    opacity: submitting ? 0.6 : 1
                  }}
                >
                  {submitting ? 'Submitting...' : 'Accept & Close Complaint'}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleReopen}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    opacity: submitting ? 0.6 : 1
                  }}
                >
                  Reopen Issue
                </button>
              </div>
            </div>
          )}

          {/* Show Submitted Feedback */}
          {complaint.status === 'CLOSED' && complaint.rating && (
            <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#166534', margin: '0 0 6px 0' }}>✅ Verification & Feedback Submitted</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ fontSize: '18px', color: star <= complaint.rating ? '#eab308' : '#e5e7eb' }}>★</span>
                ))}
              </div>
              {complaint.feedback && <p style={{ fontSize: '14px', color: '#1b5e20', margin: 0, fontStyle: 'italic' }}>"{complaint.feedback}"</p>}
            </div>
          )}

          {/* Stamp & Verification Area (Visible in print) */}
          <div style={{ marginTop: '40px', borderTop: '1px dashed #cbd5e1', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>This is an automated system generated receipt.</p>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>Printed on: {new Date().toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'center', width: '150px' }}>
              <div style={{ height: '40px', borderBottom: '1px solid #cbd5e1' }}></div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginTop: '6px' }}>Authority Sign / Stamp</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


const styles = {
  page:         { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content:      { maxWidth: '750px', margin: '0 auto', padding: '32px 24px' },
  loading:      { textAlign: 'center', padding: '60px', color: '#64748b' },
  backBtn:      { background: 'none', border: 'none', fontSize: '15px', color: '#4f46e5', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', padding: 0 },
  card:         { backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  titleRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title:        { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 },
  metaGrid:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px' },
  metaItem:     {},
  metaLabel:    { fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px 0' },
  metaValue:    { fontSize: '14px', color: '#1e293b', fontWeight: '600', margin: 0 },
  section:      { marginBottom: '20px' },
  sectionLabel: { fontSize: '13px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' },
  sectionText:  { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: 0 },
  remarkBox:    { backgroundColor: '#eff6ff', borderRadius: '8px', padding: '16px', borderLeft: '4px solid #3b82f6' },
  remarkLabel:  { fontSize: '13px', fontWeight: '700', color: '#1d4ed8', margin: '0 0 8px 0' },
  remarkText:   { fontSize: '14px', color: '#1e40af', margin: 0, lineHeight: '1.5' },
};

export default ComplaintDetail;