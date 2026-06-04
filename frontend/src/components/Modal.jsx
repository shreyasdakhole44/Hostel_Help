import React, { useEffect } from 'react';
import { THEME } from '../theme';

const Modal = ({ isOpen, onClose, title, children, type = 'modal' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isSlideOver = type === 'slideover';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: isSlideOver ? 'flex-end' : 'center',
        alignItems: isSlideOver ? 'stretch' : 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
        transition: 'opacity 0.2s ease-in-out'
      }}
      onClick={onClose}
    >
      <div
        className={`${isSlideOver ? 'slide-in-right' : ''} responsive-modal`}
        style={{
          backgroundColor: THEME.colors.white,
          width: '100%',
          maxWidth: '480px',
          height: isSlideOver ? '100vh' : 'auto',
          borderRadius: isSlideOver ? '0' : THEME.radius.card,
          padding: '24px',
          boxShadow: THEME.shadows.dropdown,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
          onClick: (e) => e.stopPropagation()
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: `1px solid ${THEME.colors.gray100}`,
            paddingBottom: '12px'
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: THEME.colors.gray900,
              fontFamily: THEME.fonts.family
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: THEME.colors.gray500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              transition: THEME.transition
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = THEME.colors.gray100;
              e.currentTarget.style.color = THEME.colors.gray900;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = THEME.colors.gray500;
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
