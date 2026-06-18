import React from 'react';
import './LoadingScreen.css';

/**
 * Full-screen branded loading state, shown while the app boots
 * (auth check, initial config fetch, etc).
 *
 * Props:
 *  - tagline: small status line under the wordmark
 *  - logoSrc: optional path to the real exported app-icon asset
 *             (e.g. '/brand/novuscv-icon.svg'). If omitted, a CSS-drawn
 *             fallback mark is used so this works with zero extra assets.
 */
const LoadingScreen = ({
  tagline = 'Setting things up for you…',
  logoSrc,
}) => {
  return (
    <div className="ncv-loader" role="status" aria-live="polite">
      <span className="ncv-loader__sr-only">Loading NovusCV</span>

      <div className="ncv-loader__blob ncv-loader__blob--a" aria-hidden="true" />
      <div className="ncv-loader__blob ncv-loader__blob--b" aria-hidden="true" />

      <div className="ncv-loader__content">
        <div
          className={`ncv-loader__mark${logoSrc ? '' : ' ncv-loader__mark--fallback'}`}
          aria-hidden="true"
        >
          {logoSrc ? (
            <img src={logoSrc} alt="" className="ncv-loader__mark-img" />
          ) : (
            <span className="ncv-loader__mark-letter">N</span>
          )}
        </div>

        <h1 className="ncv-loader__wordmark" aria-hidden="true">
          <span className="ncv-loader__wordmark-novus">Novus</span>
          <span className="ncv-loader__wordmark-cv">CV</span>
        </h1>

        <div className="ncv-loader__progress" aria-hidden="true">
          <span className="ncv-loader__progress-fill" />
        </div>

        <p className="ncv-loader__tagline">{tagline}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;