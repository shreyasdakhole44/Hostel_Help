import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { Plus } from 'lucide-react';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('STUDENT'); // 'STUDENT' or 'WARDEN'
  const [students, setStudents] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddWarden, setShowAddWarden] = useState(false);
  const [submittingWarden, setSubmittingWarden] = useState(false);

  const [wardenForm, setWardenForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    roomNumber: 'WARDEN', // backend register request needs it, set to a constant for warden
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [studentRes, wardenRes] = await Promise.all([
        api.get('/api/admin/users/student'),
        api.get('/api/admin/users/warden'),
      ]);
      setStudents(studentRes.data);
      setWardens(wardenRes.data);
    } catch (err) {
      console.error('Error fetching users', err);
      toast.error('Failed to load user records.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.put(`/api/admin/users/${userId}/toggle`);
      toast.success(res.data || 'User status updated successfully');
      
      // Update local states
      setStudents(prev => prev.map(u => u.id === userId ? { ...u, active: !u.active } : u));
      setWardens(prev => prev.map(u => u.id === userId ? { ...u, active: !u.active } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleWardenChange = (e) => {
    setWardenForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateWarden = async (e) => {
    e.preventDefault();
    setSubmittingWarden(true);
    try {
      await api.post('/api/admin/users/wardens', wardenForm);
      toast.success('New Warden registered successfully!');
      setWardenForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        roomNumber: 'WARDEN',
      });
      setShowAddWarden(false);
      fetchUsers(); // reload list
    } catch (err) {
      toast.error(err.response?.data || 'Failed to register warden.');
    } finally {
      setSubmittingWarden(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>User Account Management</h2>
          {activeTab === 'WARDEN' && (
            <button
              onClick={() => setShowAddWarden(!showAddWarden)}
              style={styles.addWardenBtn}
            >
              {showAddWarden ? 'Cancel' : (
                <>
                  <Plus size={16} />
                  Add Warden
                </>
              )}
            </button>
          )}
        </div>

        {/* Add Warden Panel */}
        {activeTab === 'WARDEN' && showAddWarden && (
          <div style={styles.addPanel}>
            <h3 style={styles.panelTitle}>Register New Warden Account</h3>
            <form onSubmit={handleCreateWarden} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={wardenForm.name}
                    onChange={handleWardenChange}
                    placeholder="Warden Name"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={wardenForm.email}
                    onChange={handleWardenChange}
                    placeholder="warden@hostel.com"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={wardenForm.password}
                    onChange={handleWardenChange}
                    placeholder="Enter password"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={wardenForm.phone}
                    onChange={handleWardenChange}
                    placeholder="e.g. 9876543210"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingWarden}
                style={styles.submitBtn}
              >
                {submittingWarden ? 'Registering...' : 'Register Warden'}
              </button>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('STUDENT')}
            style={{
              ...styles.tabBtn,
              borderBottomColor: activeTab === 'STUDENT' ? '#4f46e5' : 'transparent',
              color: activeTab === 'STUDENT' ? '#4f46e5' : '#64748b',
            }}
          >
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('WARDEN')}
            style={{
              ...styles.tabBtn,
              borderBottomColor: activeTab === 'WARDEN' ? '#4f46e5' : 'transparent',
              color: activeTab === 'WARDEN' ? '#4f46e5' : '#64748b',
            }}
          >
            Wardens ({wardens.length})
          </button>
        </div>

        {/* User lists */}
        {loading ? (
          <p style={styles.loading}>Loading user list...</p>
        ) : (
          <div style={styles.tableContainer}>
            {activeTab === 'STUDENT' ? (
              students.length === 0 ? (
                <p style={styles.noData}>No students registered yet.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Room No</th>
                      <th style={styles.th}>Date Joined</th>
                      <th style={styles.th}>Account Status</th>
                      <th style={styles.th}>Toggle Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(u => (
                      <tr key={u.id} style={styles.tr}>
                        <td style={styles.td}>#{u.id}</td>
                        <td style={{ ...styles.td, fontWeight: '600' }}>{u.name}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>{u.phone || '—'}</td>
                        <td style={styles.td}><span style={styles.roomBadge}>{u.roomNumber || '—'}</span></td>
                        <td style={styles.td}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusDot,
                            backgroundColor: u.active ? '#10b981' : '#ef4444',
                          }} />
                          <span style={{ fontWeight: '600', color: u.active ? '#065f46' : '#b91c1c' }}>
                            {u.active ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            style={{
                              ...styles.toggleBtn,
                              backgroundColor: u.active ? '#fee2e2' : '#d1fae5',
                              color: u.active ? '#dc2626' : '#059669',
                              borderColor: u.active ? '#fca5a5' : '#a7f3d0',
                            }}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              wardens.length === 0 ? (
                <p style={styles.noData}>No wardens registered yet.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Date Joined</th>
                      <th style={styles.th}>Account Status</th>
                      <th style={styles.th}>Toggle Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardens.map(u => (
                      <tr key={u.id} style={styles.tr}>
                        <td style={styles.td}>#{u.id}</td>
                        <td style={{ ...styles.td, fontWeight: '600' }}>{u.name}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>{u.phone || '—'}</td>
                        <td style={styles.td}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusDot,
                            backgroundColor: u.active ? '#10b981' : '#ef4444',
                          }} />
                          <span style={{ fontWeight: '600', color: u.active ? '#065f46' : '#b91c1c' }}>
                            {u.active ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            style={{
                              ...styles.toggleBtn,
                              backgroundColor: u.active ? '#fee2e2' : '#d1fae5',
                              color: u.active ? '#dc2626' : '#059669',
                              borderColor: u.active ? '#fca5a5' : '#a7f3d0',
                            }}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc' },
  content: { maxWidth: '1150px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 },
  addWardenBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)', display: 'flex', alignItems: 'center', gap: '6px' },
  addPanel: { backgroundColor: '#fff', borderRadius: '12px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '28px' },
  panelTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '18px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none' },
  submitBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '8px', alignSelf: 'flex-start' },
  tabs: { display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '24px' },
  tabBtn: { background: 'none', border: 'none', borderBottom: '3px solid transparent', padding: '12px 20px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginRight: '16px', transition: 'all 0.2s', outline: 'none' },
  loading: { textAlign: 'center', color: '#64748b', padding: '40px' },
  noData: { textAlign: 'center', color: '#64748b', padding: '40px', backgroundColor: '#fff', borderRadius: '12px' },
  tableContainer: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px 20px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' },
  td: { padding: '16px 20px', color: '#334155', fontSize: '14px', verticalAlign: 'middle' },
  roomBadge: { backgroundColor: '#e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' },
  statusDot: { display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px', verticalAlign: 'middle' },
  toggleBtn: { border: '1px solid', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' },
};

export default UserManagement;
