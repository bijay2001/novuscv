import React from 'react';
import logoImage from '../assets/logo.png'; // Importing your actual logo

const LoadingScreen = ({
  tagline = 'The new era of CV optimization.'
}) => {
  return (
    <>
      <div className="ncv-loader" role="status" aria-live="polite">
        <span className="ncv-loader__sr-only">Loading NovusCV...</span>

        {/* Ambient background blobs for a native iOS/macOS feel */}
        <div className="ncv-loader__blob ncv-loader__blob--a" aria-hidden="true" />
        <div className="ncv-loader__blob ncv-loader__blob--b" aria-hidden="true" />

        <div className="ncv-loader__content">
          
          {/* Animated Logo Container */}
          <div className="ncv-loader__mark" aria-hidden="true">
            <img src={logoImage} alt="NovusCV" className="ncv-loader__mark-img" />
          </div>

          {/* Wordmark */}
          <h1 className="ncv-loader__wordmark" aria-hidden="true">
            <span className="ncv-loader__wordmark-novus">Novus</span>
            <span className="ncv-loader__wordmark-cv">CV</span>
          </h1>

          {/* Indeterminate Progress Bar */}
          <div className="ncv-loader__progress" aria-hidden="true">
            <span className="ncv-loader__progress-fill" />
          </div>

          {/* Brand Tagline */}
          <p className="ncv-loader__tagline">{tagline}</p>
        </div>
      </div>

      {/* Scoped CSS for native-grade animations */}
      <style>{`
        .ncv-loader {
          --ncv-blue-light: #60a5fa;
          --ncv-blue: #2563eb;
          --ncv-blue-deep: #1d4ed8;
          --ncv-ink: #0f172a;
          --ncv-muted: #64748b;
          --ncv-bg: #f8fafc;
          --ncv-track: #e2e8f0;

          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: var(--ncv-bg);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          z-index: 10000;
        }

        .ncv-loader__sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Ambient background blobs */
        .ncv-loader__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        .ncv-loader__blob--a {
          width: 380px;
          height: 380px;
          top: -120px;
          left: -100px;
          background: radial-gradient(circle at 30% 30%, rgba(96, 165, 250, 0.4), rgba(96, 165, 250, 0) 70%);
          animation: ncv-blob-a 10s ease-in-out infinite alternate;
        }

        .ncv-loader__blob--b {
          width: 420px;
          height: 420px;
          bottom: -140px;
          right: -120px;
          background: radial-gradient(circle at 70% 70%, rgba(37, 99, 235, 0.3), rgba(37, 99, 235, 0) 70%);
          animation: ncv-blob-b 12s ease-in-out infinite alternate;
        }

        .ncv-loader__content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 24px;
        }

        /* Logo mark */
        .ncv-loader__mark {
          width: 96px;
          height: 96px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          animation: ncv-glow-pulse 2.5s ease-in-out infinite;
        }

        .ncv-loader__mark-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: inherit;
          /* Adds a slight drop shadow strictly around the PNG shape */
          filter: drop-shadow(0 8px 16px rgba(37, 99, 235, 0.25)); 
        }

        /* Wordmark */
        .ncv-loader__wordmark {
          display: flex;
          gap: 1px;
          margin: 24px 0 0;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
          opacity: 0;
          animation: ncv-fade-up 0.6s ease-out 0.2s forwards;
        }

        .ncv-loader__wordmark-novus {
          color: var(--ncv-ink);
        }

        .ncv-loader__wordmark-cv {
          background: linear-gradient(135deg, var(--ncv-blue-light), var(--ncv-blue-deep));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Indeterminate progress bar */
        .ncv-loader__progress {
          position: relative;
          width: 180px;
          height: 4px;
          margin: 28px auto 16px;
          border-radius: 999px;
          background: var(--ncv-track);
          overflow: hidden;
        }

        .ncv-loader__progress-fill {
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--ncv-blue-light), var(--ncv-blue-deep));
          animation: ncv-progress-slide 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Tagline */
        .ncv-loader__tagline {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: var(--ncv-muted);
          letter-spacing: 0.01em;
          opacity: 0;
          animation: ncv-fade-in 0.6s ease-out 0.5s forwards;
        }

        /* Keyframes */
        @keyframes ncv-glow-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }

        @keyframes ncv-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ncv-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ncv-progress-slide {
          0% { left: -40%; }
          100% { left: 100%; }
        }

        @keyframes ncv-blob-a {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.1); }
        }

        @keyframes ncv-blob-b {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-35px, -25px) scale(1.08); }
        }

        /* Respect reduced-motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .ncv-loader__mark,
          .ncv-loader__blob--a,
          .ncv-loader__blob--b,
          .ncv-loader__progress-fill {
            animation: none !important;
          }
          .ncv-loader__wordmark,
          .ncv-loader__tagline {
            animation: ncv-fade-in 0.3s ease-out forwards;
          }
          .ncv-loader__progress-fill {
            left: 0;
            width: 60%;
          }
        }

        /* Small screens */
        @media (max-width: 480px) {
          .ncv-loader__mark {
            width: 84px;
            height: 84px;
          }
          .ncv-loader__wordmark {
            font-size: 26px;
            margin-top: 20px;
          }
          .ncv-loader__progress {
            width: 150px;
            margin: 24px auto 14px;
          }
          .ncv-loader__tagline {
            font-size: 13px;
          }
          .ncv-loader__blob--a,
          .ncv-loader__blob--b {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default LoadingScreen;