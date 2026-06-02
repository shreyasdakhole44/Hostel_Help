import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { THEME } from '../theme';
import { Search, Bell } from 'lucide-react';

const TopBar = ({ title, breadcrumbs = [], toggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications() || { notifications: [], unreadCount: 0 };
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const name = user?.name || 'User';

  const getInitials = (n) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: THEME.colors.white,
        borderBottom: `1px solid ${THEME.colors.gray200}`,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        fontFamily: THEME.fonts.family
      }}
    >
      {/* Left side: Hamburger (Mobile) + Breadcrumbs & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Hamburger Menu Icon */}
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: THEME.colors.gray500,
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            transition: THEME.transition,
            // Hide on desktop
            ...(window.innerWidth >= 768 && {
              display: 'none'
            })
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = THEME.colors.gray50;
            e.currentTarget.style.color = THEME.colors.gray900;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = THEME.colors.gray500;
          }}
        >
          ☰
        </button>

        {/* Breadcrumb + Title (Removed) */}
      </div>

      {/* Right side: Search, Notification Bell, User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Search Input (Desktop) */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            // Hide search bar on mobile screens
            ...(window.innerWidth < 640 && {
              display: 'none'
            })
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: '12px',
              color: THEME.colors.gray500,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate('/admin/complaints?search=' + encodeURIComponent(searchVal));
              }
            }}
            style={{
              height: '38px',
              width: '240px',
              backgroundColor: THEME.colors.gray50,
              border: `1px solid ${THEME.colors.gray200}`,
              borderRadius: THEME.radius.input,
              padding: '0 12px 0 36px',
              fontSize: '14px',
              color: THEME.colors.gray700,
              outline: 'none',
              transition: THEME.transition
            }}
            onFocus={(e) => {
              e.target.style.borderColor = THEME.colors.purple500;
              e.target.style.boxShadow = `0 0 0 3px rgba(139,92,246,0.1)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = THEME.colors.gray200;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Notification Bell Container */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: dropdownOpen ? THEME.colors.gray900 : THEME.colors.gray500,
              cursor: 'pointer',
              position: 'relative',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: THEME.transition,
              backgroundColor: dropdownOpen ? THEME.colors.gray50 : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.backgroundColor = THEME.colors.gray50;
                e.currentTarget.style.color = THEME.colors.gray900;
              }
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = THEME.colors.gray500;
              }
            }}
          >
            <Bell size={18} />
            {/* Red Dot Badge */}
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: THEME.colors.red500,
                  borderRadius: '50%',
                  border: `2px solid ${THEME.colors.white}`
                }}
              />
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: 0,
              width: '320px',
              backgroundColor: THEME.colors.white,
              boxShadow: THEME.shadows.cardHover,
              borderRadius: '12px',
              border: `1px solid ${THEME.colors.gray200}`,
              zIndex: 999,
              padding: '12px 0',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 8px 16px', borderBottom: `1px solid ${THEME.colors.gray100}` }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: THEME.colors.gray900 }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllAsRead();
                      setDropdownOpen(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: THEME.colors.purple600,
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
                  <p style={{ textAlign: 'center', color: THEME.colors.gray400, fontSize: '13px', padding: '16px 0', margin: 0 }}>
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        setDropdownOpen(false);
                        // Redirect to complaints page and open this specific complaint details modal
                        navigate('/admin/complaints', { state: { viewComplaintId: n.complaintId } });
                      }}
                      style={{
                        padding: '12px 16px',
                        borderBottom: `1px solid ${THEME.colors.gray50}`,
                        cursor: 'pointer',
                        backgroundColor: n.read ? THEME.colors.white : '#f5f3ff',
                        transition: 'background 0.2s',
                        textAlign: 'left'
                      }}
                    >
                      <p style={{ fontSize: '13px', color: THEME.colors.gray800, margin: '0 0 4px 0', fontWeight: n.read ? '500' : '600', lineHeight: '1.4' }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '11px', color: THEME.colors.gray400 }}>
                        {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: THEME.colors.gray200 }} />

        {/* User initials avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: THEME.colors.purple100,
            color: THEME.colors.purple600,
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: `2px solid ${THEME.colors.purple600}`
          }}
          title={name}
        >
          {getInitials(name)}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
