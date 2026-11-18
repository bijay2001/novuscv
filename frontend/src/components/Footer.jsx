import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="ec-footer">
      <div className="ec-footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.35rem' }}>
            <img src={logoImage} alt="NovusCV Logo" width="24" height="24" style={{ objectFit: 'contain' }} />
            <span className="ec-heading" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              NovusCV
            </span>
            <span className="ec-brand-dot" />
          </div>

          <p className="ec-eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>
            // AI Resume Intelligence Engine
          </p>

          <p className="ec-mono" style={{ fontSize: '0.78rem', color: 'var(--ec-muted)' }}>
            © {new Date().getFullYear()} NovusCV. All rights reserved. / Engineered by{' '}
            <a
              href="https://bijay-portfolio-rho.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ec-amber)', fontWeight: 600 }}
            >
              Bijay Kumar Behera
            </a>
          </p>
        </div>

        <div>
          <Link to="/contact" className="ec-btn-ghost">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;