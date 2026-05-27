import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [activeRole, setActiveRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleTabClick = (role) => {
    setActiveRole(role);
    if (role === 'STUDENT') {
      setFormData({ email: 'student@hostel.com', password: 'password123' });
    } else if (role === 'WARDEN') {
      setFormData({ email: 'warden@hostel.com', password: 'warden123' });
    } else if (role === 'ADMIN') {
      setFormData({ email: 'admin@hostel.com', password: 'admin123' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', formData);
      const data = response.data;

      // save to context + localStorage
      login(data);

      toast.success(`Welcome back, ${data.name}!`);

      // redirect based on role
      if (data.role === 'ADMIN')   navigate('/admin/dashboard');
      if (data.role === 'WARDEN')  navigate('/warden/dashboard');
      if (data.role === 'STUDENT') navigate('/student/dashboard');

    } catch (error) {
      const message = error.response?.data?.message
        || error.response?.data
        || 'Login failed. Check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🏠 Hostel Help</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {/* Role Tabs */}
        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => handleRoleTabClick('STUDENT')}
            style={{
              ...styles.tab,
              backgroundColor: activeRole === 'STUDENT' ? '#4f46e5' : '#f8fafc',
              color: activeRole === 'STUDENT' ? '#fff' : '#64748b',
              borderColor: activeRole === 'STUDENT' ? '#4f46e5' : '#e2e8f0',
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabClick('WARDEN')}
            style={{
              ...styles.tab,
              backgroundColor: activeRole === 'WARDEN' ? '#0ea5e9' : '#f8fafc',
              color: activeRole === 'WARDEN' ? '#fff' : '#64748b',
              borderColor: activeRole === 'WARDEN' ? '#0ea5e9' : '#e2e8f0',
            }}
          >
            Warden
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabClick('ADMIN')}
            style={{
              ...styles.tab,
              backgroundColor: activeRole === 'ADMIN' ? '#7c3aed' : '#f8fafc',
              color: activeRole === 'ADMIN' ? '#fff' : '#64748b',
              borderColor: activeRole === 'ADMIN' ? '#7c3aed' : '#e2e8f0',
            }}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@hostel.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Footer */}
        <p style={styles.footer}>
          New student?{' '}
          <Link to="/register" style={styles.link}>
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#4f46e5',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    padding: '10px 6px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  button: {
    padding: '13px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#64748b',
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Login;