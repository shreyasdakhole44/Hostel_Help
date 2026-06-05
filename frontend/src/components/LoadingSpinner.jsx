import React from 'react';
import { THEME } from '../theme';

const LoadingSpinner = ({ size = '40px', color, fullPage = false, inline = false }) => {
  const spinnerColor = color || THEME.colors.purple600;

  const isInline = inline || (typeof size === 'string' && size.endsWith('px') && parseFloat(size) <= 30 && !fullPage);

  const spinner = (
    <div
      className="spinner-animation"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `3px solid ${THEME.colors.purple100}`,
        borderTopColor: spinnerColor,
        display: 'inline-block'
      }}
    />
  );

  if (fullPage) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        {spinner}
      </div>
    );
  }

  if (isInline) {
    return spinner;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        width: '100%'
      }}
    >
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
