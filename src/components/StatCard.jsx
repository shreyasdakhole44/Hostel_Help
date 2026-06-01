import React from 'react';
import { THEME } from '../theme';

const StatCard = ({ icon, label, value, trend, percentage, trendUp = true, timeframe = 'vs last week' }) => {
  return (
    <div
      style={{
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.radius.card,
        padding: '24px',
        boxShadow: THEME.shadows.card,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
        minWidth: '220px',
        transition: THEME.transition,
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = THEME.shadows.cardHover;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = THEME.shadows.card;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top Row: Icon circle + Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: THEME.colors.purple50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            backgroundImage: label.includes('Total') || label.includes('All')
              ? THEME.gradients.statCardAccent
              : 'none',
            color: label.includes('Total') || label.includes('All') ? THEME.colors.white : THEME.colors.purple600
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: '13px',
            fontWeight: '500',
            color: THEME.colors.gray500,
            fontFamily: THEME.fonts.family
          }}
        >
          {label}
        </span>
      </div>

      {/* Middle Row: Large Value */}
      <div
        style={{
          fontSize: '32px',
          fontWeight: '800',
          color: THEME.colors.gray900,
          fontFamily: THEME.fonts.family,
          lineHeight: '1.2'
        }}
      >
        {value}
      </div>

      {/* Bottom Row: Trend and Timeframe */}
      {percentage !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: trendUp ? THEME.colors.green500 : THEME.colors.red500,
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            {trendUp ? '↑' : '↓'} {percentage}%
          </span>
          <span
            style={{
              fontSize: '12px',
              color: THEME.colors.gray500,
              fontFamily: THEME.fonts.family
            }}
          >
            {timeframe}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
