import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { THEME } from '../theme';

const DashboardLayout = ({ title, breadcrumbs, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(false); // Reset mobile overlay state on desktop transition
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: THEME.colors.gray50,
        width: '100%'
      }}
    >
      {/* Sidebar - fixed and sticky */}
      <Sidebar isOpen={sidebarOpen} isDesktop={isDesktop} toggleSidebar={toggleSidebar} />

      {/* Main Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Prevents flex child overflow
          marginLeft: isDesktop ? '260px' : 0, // Offset for desktop sidebar width
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Top Bar */}
        <TopBar title={title} breadcrumbs={breadcrumbs} toggleSidebar={toggleSidebar} />

        {/* Page Content */}
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
    </div>
  );
};

export default DashboardLayout;
