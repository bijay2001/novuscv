import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png'; // Direct import

const Footer = () => {
  return (
    <>
      <footer 
        className="mt-auto border-top border-light border-opacity-10" 
        style={{ 
          background: 'linear-gradient(135deg, #0B1017 0%, #062b61 100%)', // Premium dark native gradient
          padding: '1.25rem 0' // Compact padding
        }}
      >
        <div className="container">
          <div className="row gy-3 align-items-center">
            
            {/* Left Side: Branding & Credits */}
            <div className="col-12 col-md-8 text-center text-md-start">
              
              {/* Logo Section */}
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                <img src={logoImage} alt="NovusCV Logo" width="24" height="24" style={{ objectFit: 'contain' }} />
                <span className="fs-5 fw-bolder text-white" style={{ letterSpacing: '-0.5px' }}>NovusCV</span>
              </div>
              
              {/* Compact Credit Line (Stacks on mobile, inline on desktop) */}
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start gap-1 gap-md-2 mt-2">
                <p className="small mb-0" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  © {new Date().getFullYear()} NovusCV. All rights reserved.
                </p>
                <span className="d-none d-md-inline" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
                <p className="small mb-0" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  Engineered by{' '}
                  <a 
                    href="https://bijay-portfolio-rho.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white fw-bold text-decoration-none footer-link"
                  >
                    Bijay Kumar Behera
                  </a>
                </p>
              </div>
            </div>
            
            {/* Right Side: Contact Button */}
            <div className="col-12 col-md-4 text-center text-md-end">
              <Link to="/contact" className="btn footer-contact-btn rounded-pill px-4 py-2 fw-bold text-uppercase">
                Contact Us
              </Link>
            </div>

          </div>
        </div>
      </footer>

      {/* Scoped Native CSS for smooth hover effects */}
      <style>{`
        .footer-link {
          transition: all 0.2s ease-in-out;
        }
        .footer-link:hover {
          opacity: 0.85;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
        }
        
        .footer-contact-btn {
          font-size: 0.75rem;
          letter-spacing: 1px;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .footer-contact-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default Footer;