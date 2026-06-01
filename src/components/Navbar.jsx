import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'react-toastify';
import hostelHelpLogo from '../assets/hostel-help-logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications() || { notifications: [], unreadCount: 0 };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          <Link
            to="/student/profile"
            style={{
              ...styles.link,
              ...(location.pathname === '/student/profile' ? styles.activeLink : {}),
            }}
          >
            My Profile
          </Link>
          <Link
            to="/student/knowledge"
            style={{
              ...styles.link,
              ...(location.pathname === '/student/knowledge' ? styles.activeLink : {}),
            }}
          >
            Knowledge Base
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
              ...(location.pathname === '/warden/complaints' || (location.pathname.startsWith('/warden/complaints/') && !location.pathname.includes('new')) ? styles.activeLink : {}),
            }}
          >
            Complaints
          </Link>
          <Link
            to="/warden/history"
            style={{
              ...styles.link,
              ...(location.pathname === '/warden/history' ? styles.activeLink : {}),
            }}
          >
            History
          </Link>
          <Link
            to="/warden/reports"
            style={{
              ...styles.link,
              ...(location.pathname === '/warden/reports' ? styles.activeLink : {}),
            }}
          >
            Reports
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
        <img
          src={hostelHelpLogo}
          alt="Hostel Help Logo"
          className="navbar-logo"
        />
      </div>
      {/* Middle — nav links */}
      <div className="nav-links-desktop" style={styles.links}>
        {getNavLinks()}
      </div>

      {/* Right — user info + logout */}
      <div style={styles.right}>
        {user && (
          /* Notification Bell - Visible on both mobile and desktop */
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setProfileDropdownOpen(false);
              }}
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
        )}

        {user ? (
          <>
            {/* Desktop-only controls */}
            <div className="nav-right-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {user.role === 'WARDEN' ? (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setDropdownOpen(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: profileDropdownOpen ? '#f1f5f9' : 'transparent',
                      transition: 'background 0.2s, color 0.2s'
                    }}
                  >
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#8b5cf6',
                      color: '#ffffff',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px'
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Warden {user.name.split(' ')[0]}</span>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>▼</span>
                  </button>

                  {profileDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '44px',
                      right: 0,
                      width: '200px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      zIndex: 200,
                      padding: '8px 0',
                    }}>
                      <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{user.name}</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Warden Portal</p>
                      </div>
                      <div
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/warden/profile');
                        }}
                        style={{
                          padding: '10px 16px',
                          fontSize: '13px',
                          color: '#334155',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          fontWeight: '500',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        👤 My Profile
                      </div>
                      <div
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/warden/profile?tab=password');
                        }}
                        style={{
                          padding: '10px 16px',
                          fontSize: '13px',
                          color: '#334155',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          fontWeight: '500',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        🔑 Change Password
                      </div>
                      <div
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/warden/profile?tab=settings');
                        }}
                        style={{
                          padding: '10px 16px',
                          fontSize: '13px',
                          color: '#334155',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          fontWeight: '500',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        ⚙️ Settings
                      </div>
                      <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />
                      <div
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        style={{
                          padding: '10px 16px',
                          fontSize: '13px',
                          color: '#dc2626',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          fontWeight: '600',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        🚪 Logout
                      </div>
                    </div>
                  )}

                  <button onClick={handleLogout} style={{ ...styles.logoutBtn, marginLeft: '12px' }}>
                    Logout
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </>
        ) : (
          <div className="nav-right-desktop" style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </div>
        )}

        {/* Mobile menu toggle button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div style={styles.mobilePanel}>
          <div style={styles.mobileSection}>
            {getNavLinks()}
          </div>
          {user ? (
            <div style={{ ...styles.mobileSection, borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 8px 8px' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px'
                }}>
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{user.name}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>{user.role} Portal</p>
                </div>
              </div>

              {user.role === 'WARDEN' && (
                <>
                  <Link
                    to="/warden/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    style={styles.mobileLink}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/warden/profile?tab=password"
                    onClick={() => setMobileMenuOpen(false)}
                    style={styles.mobileLink}
                  >
                    🔑 Change Password
                  </Link>
                  <Link
                    to="/warden/profile?tab=settings"
                    onClick={() => setMobileMenuOpen(false)}
                    style={styles.mobileLink}
                  >
                    ⚙️ Settings
                  </Link>
                </>
              )}

              {user.role === 'STUDENT' && (
                <Link
                  to="/student/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={styles.mobileLink}
                >
                  👤 My Profile
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                style={{ ...styles.mobileLogoutBtn, marginTop: '8px' }}
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div style={{ ...styles.mobileSection, borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLoginBtn}>Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={styles.mobileRegisterBtn}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: '0 24px',
    height: '80px',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
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
  mobilePanel: {
    position: 'absolute',
    top: '80px',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderBottom: '1.5px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 24px',
  },
  mobileSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mobileLink: {
    color: '#64748b',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'block',
    textAlign: 'left',
  },
  mobileLogoutBtn: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fee2e2',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center',
  },
  mobileLoginBtn: {
    color: '#4f46e5',
    textDecoration: 'none',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  mobileRegisterBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  }
};

export default Navbar;