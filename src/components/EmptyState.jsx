import React from 'react';
import { THEME } from '../theme';

const EmptyState = ({ icon = '📭', heading = 'No data available', subtext = 'There is nothing to display here yet.', actionLabel, onAction }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.radius.card,
        boxShadow: THEME.shadows.card,
        border: `1px solid ${THEME.colors.gray200}`,
        maxWidth: '600px',
        margin: '24px auto',
        fontFamily: THEME.fonts.family
      }}
    >
      <div style={{ fontSize: '64px', marginBottom: '16px', lineHeight: 1 }}>{icon}</div>
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '700',
          color: THEME.colors.gray900,
          marginBottom: '8px'
        }}
      >
        {heading}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: THEME.colors.gray500,
          marginBottom: actionLabel ? '24px' : '0',
          maxWidth: '400px'
        }}
      >
        {subtext}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            background: THEME.gradients.primaryBtn,
            color: THEME.colors.white,
            border: 'none',
            borderRadius: THEME.radius.button,
            padding: '10px 20px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: THEME.shadows.button,
            transition: THEME.transition
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.95)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
