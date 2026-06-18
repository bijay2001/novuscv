import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="py-3 mt-auto" style={{ backgroundColor: '#0B1017' }}>
      <div className="container">
        <div className="row gy-4 align-items-center">
          
          {/* Left Side: Branding & Credit */}
          <div className="col-12 col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              {/* Ensure your Logo component renders well on a dark background */}
              <Logo width={28} height={28} showText={false} textColor="#ffffff" />
              <span className="fs-5 fw-bolder text-white" style={{ letterSpacing: '-0.5px' }}>NovusCV</span>
            </div>
            <p className="text-secondary small mb-1 fw-medium">
              © {new Date().getFullYear()} NovusCV. The new era of CV optimization.
            </p>
            <p className="small mb-0 text-secondary fw-medium">
              Engineered by <span className="text-white fw-bold">Bijay Kumar Behera</span>
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