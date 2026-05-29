const StatusBadge = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'PENDING':     return { bg: '#fef3c7', text: '#92400e' };
      case 'ASSIGNED':    return { bg: '#dbeafe', text: '#1e40af' };
      case 'IN_PROGRESS': return { bg: '#ede9fe', text: '#5b21b6' };
      case 'RESOLVED':    return { bg: '#d1fae5', text: '#065f46' };
      case 'RESOLVED_PENDING': return { bg: '#e0f2fe', text: '#0369a1' };
      case 'CLOSED':       return { bg: '#d1fae5', text: '#065f46' };
      case 'REOPENED':     return { bg: '#ffedd5', text: '#c2410c' };
      case 'REJECTED':    return { bg: '#fee2e2', text: '#991b1b' };
      default:            return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const { bg, text } = getColor();

  return (
    <span style={{
      backgroundColor: bg,
      color: text,
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.5px',
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;