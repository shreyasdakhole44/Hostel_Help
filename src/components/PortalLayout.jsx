import React from 'react';
import Navbar from './Navbar';
import { THEME } from '../theme';

const PortalLayout = ({ title, breadcrumbs = [], children, hideHeader = false }) => {
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
