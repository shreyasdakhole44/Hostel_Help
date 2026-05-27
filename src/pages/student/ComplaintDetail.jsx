import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const ComplaintDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]     = useState(true);

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

  if (loading) return <div style={styles.page}><Navbar /><p style={styles.loading}>Loading...</p></div>;
  if (!complaint) return <div style={styles.page}><Navbar /><p style={styles.loading}>Complaint not found.</p></div>;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

        <div style={styles.card}>

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
              <p style={styles.metaLabel}>Submitted on</p>
              <p style={styles.metaValue}>{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Last updated</p>
              <p style={styles.metaValue}>{new Date(complaint.updatedAt).toLocaleString()}</p>
            </div>
            <div style={styles.metaItem}>
              <p style={styles.metaLabel}>Assigned warden</p>
              <p style={styles.metaValue}>{complaint.wardenName || 'Not assigned yet'}</p>
            </div>
          </div>

          {/* Description */}
          <div style={styles.section}>
            <p style={styles.sectionLabel}>Description</p>
            <p style={styles.sectionText}>{complaint.description}</p>
          </div>

          {/* Warden remark */}
          {complaint.wardenRemark && (
            <div style={styles.remarkBox}>
              <p style={styles.remarkLabel}>💬 Warden's Remark</p>
              <p style={styles.remarkText}>{complaint.wardenRemark}</p>
            </div>
          )}

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