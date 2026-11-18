import React from 'react';
import logoImage from '../assets/logo.png';

const LoadingScreen = ({ tagline = 'The new era of CV optimization.' }) => {
  return (
    <div
      className="ec-grid-bg"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 22,
          padding: 12,
          background: 'var(--ec-panel-alt)',
          border: '1px solid var(--ec-border)',
          boxShadow: 'var(--ec-shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <img src={logoImage} alt="NovusCV" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <h1 className="ec-heading" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        Novus<span style={{ color: 'var(--ec-amber)' }}>CV</span>
      </h1>

      <div className="ec-spinner-lg" style={{ marginBottom: '1rem' }} />

      <p className="ec-mono" style={{ fontSize: '0.8rem', color: 'var(--ec-muted)' }}>
        {tagline}
      </p>
    </div>
  );
};

export default LoadingScreen;