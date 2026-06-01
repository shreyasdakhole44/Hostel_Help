export const THEME = {
  colors: {
    purple50: '#F5F3FF',
    purple100: '#EDE9FE',
    purple500: '#8B5CF6',
    purple600: '#7C3AED',   // Primary brand color
    purple700: '#6D28D9',   // Hover state
    purple900: '#4C1D95',
    cyan500: '#06B6D4',     // Accent
    green500: '#10B981',    // Resolved/success
    yellow500: '#F59E0B',   // Pending/warning
    red500: '#EF4444',      // Rejected/danger
    blue500: '#3B82F6',     // Assigned/info
    gray50: '#F9FAFB',      // Page background
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',     // Borders
    gray400: '#9CA3AF',     // Semi-muted text/borders
    gray500: '#6B7280',     // Muted text
    gray700: '#374151',     // Body text
    gray900: '#111827',     // Headings
    white: '#FFFFFF'        // Card surfaces
  },
  fonts: {
    family: "'Inter', sans-serif",
    lineHeight: '1.6',
    sizes: {
      h1: '48px',
      h2: '28px',
      h3: '24px',
      h4: '20px',
      h5: '18px',
      h6: '16px',
      body: '14px',
      bodyLarge: '15px',
      small: '12px',
      label: '13px'
    }
  },
  radius: {
    card: '16px',
    button: '10px',
    input: '10px',
    badge: '999px',
    small: '8px'
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    cardHover: '0 4px 12px rgba(124,58,237,0.1)',
    button: '0 1px 2px rgba(0,0,0,0.05)',
    dropdown: '0 10px 15px rgba(0,0,0,0.1)'
  },
  gradients: {
    primaryBtn: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    hero: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)',
    sidebarActive: 'linear-gradient(90deg, #F5F3FF 0%, #EDE9FE 100%)',
    statCardAccent: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)'
  },
  transition: 'all 0.2s ease-in-out'
};
