import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [formData, setFormData]     = useState({
    title: '',
    description: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/student/categories');
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/student/complaints', {
        ...formData,
        categoryId: parseInt(formData.categoryId),
      });
      toast.success('Complaint submitted successfully!');
      navigate('/student/complaints');
    } catch (err) {
      toast.error('Failed to submit complaint. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
          <h2 style={styles.title}>Submit a Complaint</h2>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Complaint Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Water leaking in bathroom"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">-- Select a category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                required
                rows={5}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

            <div style={styles.btnRow}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page:       { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content:    { maxWidth: '700px', margin: '0 auto', padding: '32px 24px' },
  header:     { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backBtn:    { background: 'none', border: 'none', fontSize: '15px', color: '#4f46e5', cursor: 'pointer', fontWeight: '600' },
  title:      { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 },
  card:       { backgroundColor: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  form:       { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:      { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input:      { padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '15px', outline: 'none', fontFamily: 'inherit' },
  btnRow:     { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn:  { padding: '10px 24px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#64748b' },
  submitBtn:  { padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
};

export default SubmitComplaint;