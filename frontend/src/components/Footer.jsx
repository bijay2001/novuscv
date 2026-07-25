import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png'; // Direct import

const Footer = () => {
  return (
    <>
      <footer className="ec-footer mt-auto">
        <div className="ec-footer-grid" />
        <div className="container position-relative">
          <div className="row gy-4 align-items-center">

            {/* Left Side: Branding & Credits */}
            <div className="col-12 col-md-8 text-center text-md-start">

              {/* Logo Section */}
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
                <img src={logoImage} alt="NovusCV Logo" width="24" height="24" style={{ objectFit: 'contain' }} />
                <span className="ec-footer-brand">NovusCV</span>
                <span className="ec-footer-dot" />
              </div>

              <p className="ec-footer-eyebrow mb-2">// AI Resume Intelligence Engine</p>

              {/* Compact Credit Line */}
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start gap-1 gap-md-2">
                <p className="ec-footer-text mb-0">
                  © {new Date().getFullYear()} NovusCV. All rights reserved.
                </p>
                <span className="d-none d-md-inline ec-footer-sep">/</span>
                <p className="ec-footer-text mb-0">
                  Engineered by{' '}
                  <a
                    href="https://bijay-portfolio-rho.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ec-footer-link"
                  >
                    Bijay Kumar Behera
                  </a>
                </p>
              </div>
            </div>

            {/* Right Side: Contact Button */}
            <div className="col-12 col-md-4 text-center text-md-end">
              <Link to="/contact" className="ec-footer-btn">
                Contact Us
              </Link>
            </div>

          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .ec-footer {
          position: relative;
          background: #0A0D12;
          border-top: 1px solid #1D232D;
          padding: 2rem 0;
          overflow: hidden;
        }
        .ec-footer-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(240, 162, 46, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240, 162, 46, 0.04) 1px, transparent 1px);
          background-size: 34px 34px;
          pointer-events: none;
        }

        .ec-footer-brand {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
          color: #E7E9EC;
        }
        .ec-footer-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #2DD4BF;
          box-shadow: 0 0 6px #2DD4BF;
          display: inline-block;
          margin-top: -14px;
        }

        .ec-footer-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7C8592;
        }

        .ec-footer-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          color: #7C8592;
        }
        .ec-footer-sep { color: #4B5563; }

        .ec-footer-link {
          color: #F0A22E;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .ec-footer-link:hover {
          opacity: 0.85;
          text-decoration: underline;
        }

        .ec-footer-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #E7E9EC;
          border: 1px solid #232A35;
          background: #12161C;
          border-radius: 999px;
          padding: 0.6rem 1.5rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .ec-footer-btn:hover {
          border-color: #F0A22E;
          color: #F0A22E;
          background: rgba(240, 162, 46, 0.08);
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .ec-footer-btn:hover { transform: none; }
        }
      `}</style>
    </>
  );
};

export default Footer;