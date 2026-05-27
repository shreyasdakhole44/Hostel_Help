import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('ALL');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/api/student/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'ALL'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const filters = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        <div style={styles.header}>
          <h2 style={styles.title}>My Complaints</h2>
          <button
            onClick={() => navigate('/student/complaints/new')}
            style={styles.newBtn}
          >
            + New Complaint
          </button>
        </div>

        {/* Filter tabs */}
        <div style={styles.filters}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === f ? '#4f46e5' : '#fff',
                color: filter === f ? '#fff' : '#64748b',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Complaints list */}
        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>📭</p>
            <p style={styles.emptyText}>No complaints found</p>
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map(complaint => (
              <div
                key={complaint.id}
                style={styles.card}
                onClick={() => navigate(`/student/complaints/${complaint.id}`)}
              >
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.cardTitle}>{complaint.title}</p>
                    <p style={styles.cardMeta}>
                      {complaint.categoryName} &nbsp;•&nbsp;
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
                <p style={styles.cardDesc}>{complaint.description}</p>
                {complaint.wardenName && (
                  <p style={styles.cardWarden}>👷 Assigned to: {complaint.wardenName}</p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  page:       { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content:    { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title:      { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 },
  newBtn:     { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
  filters:    { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  filterBtn:  { padding: '6px 16px', borderRadius: '20px', border: '1.5px solid #e2e8f0', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  empty:      { textAlign: 'center', color: '#64748b', padding: '40px' },
  emptyBox:   { textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px' },
  emptyIcon:  { fontSize: '48px', margin: '0 0 12px 0' },
  emptyText:  { color: '#64748b', fontSize: '16px', margin: 0 },
  list:       { display: 'flex', flexDirection: 'column', gap: '12px' },
  card:       { backgroundColor: '#fff', borderRadius: '10px', padding: '20px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '2px solid transparent' },
  cardTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  cardTitle:  { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
  cardMeta:   { fontSize: '13px', color: '#94a3b8', margin: 0 },
  cardDesc:   { fontSize: '14px', color: '#475569', margin: '0 0 8px 0', lineHeight: '1.5' },
  cardWarden: { fontSize: '13px', color: '#64748b', margin: 0 },
};

export default MyComplaints;