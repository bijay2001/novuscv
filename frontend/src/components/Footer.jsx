import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png'; // Direct import

const Footer = () => {
  return (
    <footer className="py-4 mt-auto" style={{ backgroundColor: '#0B1017' }}>
      <div className="container">
        <div className="row gy-4 align-items-center">
          
          {/* Left Side: Branding & Credit */}
          <div className="col-12 col-md-6 text-center text-md-start">
            
            {/* Logo Section - Increased size to 32 and gap to 3 */}
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3 mb-3">
              <img src={logoImage} alt="NovusCV Logo" width="32" height="32" style={{ objectFit: 'contain' }} />
              <span className="fs-4 fw-bolder text-white" style={{ letterSpacing: '-0.5px' }}>NovusCV</span>
            </div>
            
            <p className="text-secondary small mb-1 fw-medium">
              © {new Date().getFullYear()} NovusCV. The new era of CV optimization.
            </p>
            <p className="small mb-0 text-secondary fw-medium">
              Engineered by{' '}
              <a 
                href="https://bijay-portfolio-rho.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white fw-bold text-decoration-none"
                style={{ transition: 'opacity 0.2s' }}
                onMouseOver={(e) => e.target.style.opacity = '0.8'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                Bijay Kumar Behera
              </a>
            </p>
          </div>
          
          {/* Right Side: Contact Button */}
          <div className="col-12 col-md-6 text-center text-md-end">
            <Link 
              to="/contact" 
              className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold text-uppercase"
              style={{ fontSize: '0.8rem', letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;