import React from 'react';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../theme';

const TopBar = ({ title, breadcrumbs = [], toggleSidebar }) => {
  const { user } = useAuth();
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

        {/* Breadcrumb + Title */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {breadcrumbs.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: THEME.colors.gray500,
                fontWeight: '500',
                marginBottom: '2px'
              }}
            >
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span>{crumb}</span>
                  {idx < breadcrumbs.length - 1 && <span style={{ color: THEME.colors.gray200 }}>/</span>}
                </React.Fragment>
              ))}
            </div>
          )}
          <h1
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: THEME.colors.gray900,
              margin: 0,
              lineHeight: 1.2
            }}
          >
            {title}
          </h1>
        </div>
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
              fontSize: '14px',
              pointerEvents: 'none'
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search complaints..."
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

        {/* Notification Bell */}
        <button
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            color: THEME.colors.gray500,
            cursor: 'pointer',
            position: 'relative',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: THEME.transition
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
          🔔
          {/* Red Dot Badge */}
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
        </button>

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
