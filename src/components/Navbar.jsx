import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications() || { notifications: [], unreadCount: 0 };
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
            {/* Notification Bell */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  borderRadius: '50%',
                  transition: 'background 0.2s',
                  backgroundColor: dropdownOpen ? '#f1f5f9' : 'transparent'
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: '700',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  width: '320px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  zIndex: 200,
                  padding: '12px 0',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 8px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          markAllAsRead();
                          setDropdownOpen(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4f46e5',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div style={{ padding: '4px 0' }}>
                    {!notifications || notifications.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '16px 0', margin: 0 }}>
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            setDropdownOpen(false);
                            const baseRoute = user.role === 'STUDENT' ? 'student' : user.role === 'WARDEN' ? 'warden' : 'admin';
                            navigate(`/${baseRoute}/complaints/${n.complaintId}`);
                          }}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f8fafc',
                            cursor: 'pointer',
                            backgroundColor: n.read ? '#ffffff' : '#f5f3ff',
                            transition: 'background 0.2s',
                            textAlign: 'left'
                          }}
                        >
                          <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 4px 0', fontWeight: n.read ? '500' : '600', lineHeight: '1.4' }}>
                            {n.message}
                          </p>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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