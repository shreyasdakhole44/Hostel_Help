import React from 'react';
import Navbar from './Navbar';
import { THEME } from '../theme';

const PortalLayout = ({ title, breadcrumbs = [], children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
        width: '100%',
        fontFamily: THEME.fonts.family
      }}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Page Header (Subheader with breadcrumbs & title) */}
      <div
        style={{
          borderBottom: `1px solid ${THEME.colors.gray200}`,
          backgroundColor: THEME.colors.white,
          padding: '20px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {breadcrumbs.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: THEME.colors.gray500,
                fontWeight: '500',
              }}
            >
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span>{crumb}</span>
                  {idx < breadcrumbs.length - 1 && <span style={{ color: THEME.colors.gray300 }}>/</span>}
                </React.Fragment>
              ))}
            </div>
          )}
          <h1
            style={{
              fontSize: '20px',
              fontWeight: '800',
              color: THEME.colors.gray900,
              margin: 0,
              lineHeight: 1.2
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: '32px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default PortalLayout;
