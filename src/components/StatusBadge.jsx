import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'PENDING':
        return { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' };
      case 'ASSIGNED':
        return { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' };
      case 'IN_PROGRESS':
        return { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' };
      case 'RESOLVED':
      case 'RESOLVED_PENDING':
        return { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' };
      case 'REJECTED':
        return { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' };
      default:
        return { bg: '#F3F4F6', text: '#374151', dot: '#6B7280' };
    }
  };

  const { bg, text, dot } = getBadgeStyle();

  let displayStatus = status ? status.replace('_', ' ') : '';
  if (displayStatus === 'RESOLVED PENDING') {
    displayStatus = 'RESOLVED';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: bg,
        color: text,
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '600',
        lineHeight: '1.2',
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dot,
          marginRight: '6px',
          display: 'inline-block'
        }}
      />
      {displayStatus}
    </span>
  );
};

export default StatusBadge;