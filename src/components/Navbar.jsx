import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getNavLinks = () => {
    if (user?.role === 'STUDENT') {
      return (
        <>
          <Link
            to="/student/dashboard"
            style={{
              ...styles.link,
              ...(location.pathname === '/student/dashboard' ? styles.activeLink : {}),
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/student/complaints"
            style={{
              ...styles.link,
              ...(location.pathname.startsWith('/student/complaints') && !location.pathname.endsWith('/new') ? styles.activeLink : {}),
            }}
          >
            My Complaints
          </Link>
          <Link
            to="/student/complaints/new"
            style={{
              ...styles.link,
              ...(location.pathname === '/student/complaints/new' ? styles.activeLink : {}),
            }}
          >
            Submit Complaint
          </Link>
        </>
      );
    }
    if (user?.role === 'WARDEN') {
      return (
        <>
          <Link
            to="/warden/dashboard"
            style={{
              ...styles.link,
              ...(location.pathname === '/warden/dashboard' ? styles.activeLink : {}),
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/warden/complaints"
            style={{
              ...styles.link,
              ...(location.pathname.startsWith('/warden/complaints') ? styles.activeLink : {}),
            }}
          >
            Complaints
          </Link>
        </>
      );
    }
    if (user?.role === 'ADMIN') {
      return (
        <>
          <Link
            to="/admin/dashboard"
            style={{
              ...styles.link,
              ...(location.pathname === '/admin/dashboard' ? styles.activeLink : {}),
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/complaints"
            style={{
              ...styles.link,
              ...(location.pathname.startsWith('/admin/complaints') ? styles.activeLink : {}),
            }}
          >
            Complaints
          </Link>
          <Link
            to="/admin/users"
            style={{
              ...styles.link,
              ...(location.pathname === '/admin/users' ? styles.activeLink : {}),
            }}
          >
            Users
          </Link>
          <Link
            to="/admin/categories"
            style={{
              ...styles.link,
              ...(location.pathname === '/admin/categories' ? styles.activeLink : {}),
            }}
          >
            Categories
          </Link>
        </>
      );
    }
    return null;
  };

  const getRoleBadgeStyles = () => {
    if (user?.role === 'ADMIN') {
      return { backgroundColor: '#f3e8ff', color: '#7c3aed' };
    }
    if (user?.role === 'WARDEN') {
      return { backgroundColor: '#fef3c7', color: '#d97706' };
    }
    if (user?.role === 'STUDENT') {
      return { backgroundColor: '#e0f2fe', color: '#0ea5e9' };
    }
    return { backgroundColor: '#f1f5f9', color: '#64748b' };
  };

  const badgeStyles = getRoleBadgeStyles();

  return (
    <nav style={styles.nav}>
      {/* Left — logo */}
      <div style={styles.logo} onClick={() => navigate('/')}>
        <span style={styles.logoIcon}>🏠</span>
        <span style={styles.logoText}>Hostel Help</span>
      </div>

      {/* Middle — nav links */}
      <div style={styles.links}>
        {getNavLinks()}
      </div>

      {/* Right — user info + logout */}
      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.name}>{user.name}</span>
            <span style={{
              ...styles.badge,
              backgroundColor: badgeStyles.backgroundColor,
              color: badgeStyles.color,
            }}>
              {user.role}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: '0 32px',
    height: '70px',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  logoIcon: {
    fontSize: '22px',
  },
  logoText: {
    color: '#4f46e5',
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    gap: '4px',
  },
  link: {
    color: '#64748b',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  activeLink: {
    color: '#4f46e5',
    backgroundColor: '#f5f3ff',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  name: {
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '600',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  logoutBtn: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fee2e2',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loginBtn: {
    color: '#4f46e5',
    textDecoration: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
  },
  registerBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default Navbar;