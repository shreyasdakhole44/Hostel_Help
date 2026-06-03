import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../theme';
import hostelHelpLogo from '../assets/hostel-help-logo.png';
import { 
  Home, ClipboardList, PlusCircle, User, BookOpen, 
  History, BarChart3, Users, Wrench, Tag, LogOut 
} from 'lucide-react';

const Sidebar = ({ isOpen, isDesktop, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'STUDENT';
  const name = user?.name || 'User';

  // Get initials for profile circle
  const getInitials = (n) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Defined navigation lists per role
  const navItems = {
    STUDENT: [
      { path: '/student/dashboard', label: 'Dashboard', icon: Home },
      { path: '/student/complaints', label: 'My Complaints', icon: ClipboardList, badgeKey: 'studentPending' },
      { path: '/student/complaints/new', label: 'Submit Complaint', icon: PlusCircle },
      { path: '/student/profile', label: 'My Profile', icon: User },
      { path: '/student/knowledge', label: 'Knowledge Base', icon: BookOpen }
    ],
    WARDEN: [
      { path: '/warden/dashboard', label: 'Dashboard', icon: Home },
      { path: '/warden/complaints', label: 'Complaints', icon: ClipboardList, badgeKey: 'wardenAction' },
      { path: '/warden/history', label: 'History', icon: History },
      { path: '/warden/reports', label: 'Reports', icon: BarChart3 },
      { path: '/warden/profile', label: 'My Profile', icon: User }
    ],
    ADMIN: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
      { path: '/admin/complaints', label: 'All Complaints', icon: ClipboardList, badgeKey: 'adminPending' },
      { path: '/admin/users/students', label: 'Students', icon: Users },
      { path: '/admin/users/wardens', label: 'Wardens', icon: Wrench },
      { path: '/admin/categories', label: 'Categories', icon: Tag },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 }
    ]
  };

  const currentNavItems = navItems[role] || [];

  // Mock badge counts - in production these would come from state/context/API.
  const badgeCounts = {
    studentPending: 3,
    wardenAction: 5,
    adminPending: 8
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {!isDesktop && isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 900,
            backdropFilter: 'blur(2px)'
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <div
        style={{
          width: '260px',
          height: '100vh',
          backgroundColor: THEME.colors.white,
          borderRight: `1px solid ${THEME.colors.gray200}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          transform: (isDesktop || isOpen) ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 950,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // On desktop, keep open and remove transform
          ...(isDesktop && {
            transform: 'none',
            position: 'fixed'
          })
        }}
      >
        {/* Logo Area */}
        <div
          style={{
            height: '64px',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1px solid ${THEME.colors.gray100}`,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <img
            src={hostelHelpLogo}
            alt="Hostel Help Logo"
            style={{
              height: '36px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Navigation Section */}
        <div style={{ flex: 1, padding: '24px 16px', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '16px',
              paddingLeft: '12px'
            }}
          >
            Main Menu
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentNavItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path) && item.path.split('/').length > 2);
              const badgeCount = item.badgeKey ? badgeCounts[item.badgeKey] : 0;

              return (
                <div
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderRadius: THEME.radius.button,
                    cursor: 'pointer',
                    transition: THEME.transition,
                    backgroundColor: isActive ? THEME.colors.purple50 : 'transparent',
                    borderLeft: isActive ? `3px solid ${THEME.colors.purple600}` : '3px solid transparent',
                    color: isActive ? THEME.colors.purple600 : THEME.colors.gray700,
                    fontWeight: isActive ? '600' : '500'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = THEME.colors.gray50;
                      e.currentTarget.style.color = THEME.colors.gray900;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = THEME.colors.gray700;
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', width: '20px', color: isActive ? THEME.colors.purple600 : THEME.colors.gray500 }}>
                      {React.createElement(item.icon, { size: 18 })}
                    </span>
                    <span style={{ fontSize: '14px' }}>{item.label}</span>
                  </div>
                  {badgeCount > 0 && (
                    <span
                      style={{
                        backgroundColor: THEME.colors.purple600,
                        color: THEME.colors.white,
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: THEME.radius.badge,
                        lineHeight: 1
                      }}
                    >
                      {badgeCount}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: THEME.colors.gray100 }} />

        {/* User Profile Area */}
        <div
          style={{
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Initials Circle */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: THEME.colors.purple600,
                color: THEME.colors.white,
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
            >
              {getInitials(name)}
            </div>

            {/* Name & Role */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: THEME.colors.gray900,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {name}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: THEME.colors.purple50,
                  color: THEME.colors.purple600,
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: THEME.radius.small,
                  marginTop: '2px',
                  textTransform: 'uppercase'
                }}
              >
                {role}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: THEME.radius.button,
              border: 'none',
              backgroundColor: 'transparent',
              color: THEME.colors.red500,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: THEME.transition,
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', width: '20px', color: THEME.colors.red500 }}>
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
