import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingCategory, setSubmittingCategory] = useState(false);
  const [assigningWardenMap, setAssigningWardenMap] = useState({}); // catId -> boolean

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, wardenRes] = await Promise.all([
        api.get('/api/admin/categories'),
        api.get('/api/admin/users/warden'),
      ]);
      setCategories(catRes.data);
      setWardens(wardenRes.data);
    } catch (err) {
      console.error('Error loading category page data', err);
      toast.error('Failed to load categories or wardens list.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewCategory(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    setSubmittingCategory(true);
    try {
      const res = await api.post('/api/admin/categories', newCategory);
      toast.success(res.data || 'Category added successfully!');
      setNewCategory({ name: '', description: '' });
      fetchData(); // reload
    } catch (err) {
      toast.error(err.response?.data || 'Failed to create category');
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleAssignWarden = async (categoryId, wardenId) => {
    if (!wardenId) return;

    setAssigningWardenMap(prev => ({ ...prev, [categoryId]: true }));
    try {
      const res = await api.put(`/api/admin/categories/${categoryId}/assign-warden`, {
        wardenId: parseInt(wardenId),
      });
      toast.success(res.data || 'Warden assigned to category successfully!');
      fetchData(); // reload
    } catch (err) {
      toast.error(err.response?.data || 'Failed to assign warden');
    } finally {
      setAssigningWardenMap(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        
        <h2 style={styles.title}>Hostel Complaint Categories</h2>
        
        <div style={styles.gridLayout}>
          
          {/* Left Column — List and Assign */}
          <div style={styles.leftCol}>
            <div style={styles.tableCard}>
              <h3 style={styles.cardHeader}>Manage Categories</h3>
              
              {loading ? (
                <p style={styles.loading}>Loading categories...</p>
              ) : categories.length === 0 ? (
                <p style={styles.noData}>No categories created yet.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Category Name</th>
                      <th style={styles.th}>Description</th>
                      <th style={styles.th}>Assigned Warden</th>
                      <th style={styles.th}>Assign Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => {
                      const isAssigning = assigningWardenMap[cat.id];
                      return (
                        <tr key={cat.id} style={styles.tr}>
                          <td style={styles.td}>#{cat.id}</td>
                          <td style={{ ...styles.td, fontWeight: '700' }}>{cat.name}</td>
                          <td style={{ ...styles.td, fontSize: '13px', color: '#64748b' }}>{cat.description || '—'}</td>
                          <td style={styles.td}>
                            {cat.warden ? (
                              <span style={styles.wardenPill}>👷 {cat.warden.name}</span>
                            ) : (
                              <span style={styles.unassignedText}>Unassigned</span>
                            )}
                          </td>
                          <td style={styles.td}>
                            <select
                              value={cat.warden?.id || ''}
                              onChange={(e) => handleAssignWarden(cat.id, e.target.value)}
                              disabled={isAssigning}
                              style={styles.dropdown}
                            >
                              <option value="">-- Reassign / Set --</option>
                              {wardens.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right Column — Create Category Form */}
          <div style={styles.rightCol}>
            <div style={styles.formCard}>
              <h3 style={styles.cardHeader}>Add New Category</h3>
              <form onSubmit={handleCreateCategory} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Electrical, Plumbing"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    rows={4}
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of complaints falling in this category..."
                    style={styles.textarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingCategory}
                  style={styles.submitBtn}
                >
                  {submittingCategory ? 'Adding...' : 'Add Category'}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' },
  gridLayout: { display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '24px', alignItems: 'flex-start' },
  leftCol: {},
  rightCol: {},
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  formCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardHeader: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  loading: { textAlign: 'center', color: '#64748b', padding: '40px' },
  noData: { textAlign: 'center', color: '#64748b', padding: '40px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '14px 16px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', color: '#334155', fontSize: '14px', verticalAlign: 'middle' },
  wardenPill: { backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  unassignedText: { color: '#94a3b8', fontStyle: 'italic' },
  dropdown: { padding: '6px 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none' },
  textarea: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' },
  submitBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'flex-start' },
};

export default Categories;
