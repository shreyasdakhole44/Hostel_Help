import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ClipboardList, 
  CheckCircle, 
  Megaphone, 
  Bell, 
  BellOff, 
  Calendar 
} from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { THEME } from '../../theme';

const WardenNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications() || { notifications: [], unreadCount: 0 };
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ'

  const filteredNotifications = (notifications || []).filter(n => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'READ') return n.read;
    return true;
  });

  const getAlertIcon = (message = '', color) => {
    const text = message.toLowerCase();
    if (text.includes('urgent') || text.includes('emergency') || text.includes('high priority')) {
      return <AlertTriangle size={18} style={{ color }} />;
    }
    if (text.includes('assigned') || text.includes('category')) {
      return <ClipboardList size={18} style={{ color }} />;
    }
    if (text.includes('resolved') || text.includes('closed')) {
      return <CheckCircle size={18} style={{ color }} />;
    }
    if (text.includes('announcement') || text.includes('admin')) {
      return <Megaphone size={18} style={{ color }} />;
    }
    return <Bell size={18} style={{ color }} />;
  };

  const getAlertColor = (message = '') => {
    const text = message.toLowerCase();
    if (text.includes('urgent') || text.includes('emergency') || text.includes('high priority')) return THEME.colors.red500;
    if (text.includes('assigned') || text.includes('category')) return THEME.colors.purple600;
    if (text.includes('resolved') || text.includes('closed')) return THEME.colors.green500;
    return THEME.colors.blue500;
  };

  return (
    <PortalLayout title="Notifications Center" breadcrumbs={['Dashboard', 'Notifications']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header summary row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: THEME.colors.gray900, margin: 0 }}>
              System Alerts
            </h2>
            <p style={{ fontSize: '13px', color: THEME.colors.gray500, margin: '4px 0 0 0' }}>
              Track important updates, ticket assignments, and announcements.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                background: 'none',
                border: `1.5px solid ${THEME.colors.purple600}`,
                borderRadius: THEME.radius.button,
                color: THEME.colors.purple600,
                padding: '8px 16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px',
                transition: THEME.transition
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.colors.purple50; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: `1px solid ${THEME.colors.gray200}`, paddingBottom: '12px' }}>
          {[
            { key: 'ALL', label: `All Alerts (${(notifications || []).length})` },
            { key: 'UNREAD', label: `Unread (${unreadCount})` },
            { key: 'READ', label: `Read (${(notifications || []).length - unreadCount})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                background: filter === tab.key ? '#f5f3ff' : 'none',
                border: 'none',
                color: filter === tab.key ? THEME.colors.purple600 : THEME.colors.gray500,
                padding: '8px 16px',
                borderRadius: THEME.radius.button,
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: THEME.transition
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={BellOff}
            heading="All caught up!"
            subtext={filter === 'UNREAD' ? "No unread alerts in your inbox." : "No notifications match your current filter."}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map((n) => {
              const color = getAlertColor(n.message);
              const icon = getAlertIcon(n.message, n.read ? THEME.colors.gray400 : color);
              
              return (
                <div
                  key={n.id}
                  onClick={() => {
                    if (!n.read) markAsRead(n.id);
                    if (n.complaintId) {
                      navigate(`/warden/complaints/${n.complaintId}`);
                    }
                  }}
                  style={{
                    backgroundColor: THEME.colors.white,
                    borderRadius: THEME.radius.card,
                    padding: '16px 20px',
                    boxShadow: THEME.shadows.card,
                    border: `1px solid ${THEME.colors.gray200}`,
                    borderLeft: `4px solid ${n.read ? THEME.colors.gray200 : color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    cursor: n.complaintId ? 'pointer' : 'default',
                    transition: THEME.transition,
                    transform: 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = THEME.shadows.card;
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Circle Icon Badge */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: n.read ? THEME.colors.gray100 : `${color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {icon}
                    </div>

                    <div>
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: n.read ? '500' : '700',
                        color: n.read ? THEME.colors.gray700 : THEME.colors.gray900,
                        lineHeight: '1.4'
                      }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '12px', color: THEME.colors.gray500, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Calendar size={12} style={{ color: THEME.colors.gray400 }} />
                        <span>{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!n.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid triggering route navigation
                          markAsRead(n.id);
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
                        Mark as read
                      </button>
                    )}
                    {n.complaintId && (
                      <span style={{ color: THEME.colors.gray400, fontSize: '12px' }}>
                        Details →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default WardenNotifications;
