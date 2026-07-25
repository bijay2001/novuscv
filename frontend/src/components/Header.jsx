import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { showAlert } from '../utils/alerts';
import { motion } from 'framer-motion';
import logoImage from '../assets/logo.png';

const Header = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await showAlert.confirm('Log Out', 'Are you sure you want to end your session?');
    if (result.isConfirmed) {
      try {
        await api.get('/auth/logout');
        logoutUser();
        navigate('/login');
      } catch (error) {
        showAlert.error('Logout Failed', 'Could not securely log out. Try again.');
      }
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  // Extract just the first name for mobile screens to prevent text overlap
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="global-nav"
      >
        <div className="global-nav-inner">

          {/* Logo Section */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0">
            <img src={logoImage} alt="NovusCV Logo" className="header-logo" style={{ objectFit: 'contain' }} />
            <span className="header-title">NovusCV</span>
            <span className="header-status-dot" />
          </Link>

          {/* Right Side Actions */}
          <div className="global-nav-right">
            {user ? (
              // SHOW WHEN LOGGED IN
              <>
                <div className="global-user-chip">
                  <div className="global-avatar">{getInitials(user.name)}</div>
                  <div className="global-user-text">
                    <span className="global-user-name">
                      <span className="d-none d-sm-inline">{user.name}</span>
                      <span className="d-inline d-sm-none">{firstName}</span>
                    </span>
                    <span className="global-user-email d-none d-sm-block">{user.email}</span>
                  </div>
                </div>

                <motion.button whileTap={{ scale: 0.94 }} onClick={handleLogout} className="global-btn-logout ms-1 ms-sm-3" title="Sign out">
                  <span className="global-logout-label">Sign out</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                  </svg>
                </motion.button>
              </>
            ) : (
              // SHOW WHEN LOGGED OUT
              <div className="d-flex gap-2">
                <Link to="/login" className="global-btn-ghost">Sign In</Link>
                <Link to="/register" className="global-btn-solid">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .global-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10, 13, 18, 0.85);
          backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          border-bottom: 1px solid #1D232D;
          padding: 0.75rem 1rem;
          min-height: 50px;
          display: flex;
          align-items: center;
        }

        .global-nav-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .header-logo { width: 26px; height: 26px; }
        .header-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
          color: #E7E9EC;
        }
        .header-status-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #2DD4BF;
          box-shadow: 0 0 6px #2DD4BF;
          margin-left: 2px;
          margin-top: -14px;
          display: inline-block;
        }

        .global-nav-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .global-user-chip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .global-user-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
        }

        .global-user-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.84rem;
          color: #E7E9EC;
        }

        .global-user-email {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          color: #7C8592;
          margin-top: 0.15rem;
        }

        .global-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(240, 162, 46, 0.14);
          border: 1px solid rgba(240, 162, 46, 0.35);
          color: #F0A22E;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .global-btn-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          border: 1px solid #232A35;
          background: #12161C;
          color: #7C8592;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 500;
          border-radius: 999px;
          padding: 0.45rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .global-btn-logout:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #EF4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .global-logout-label {
          display: none;
        }

        .global-btn-ghost, .global-btn-solid {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 0.03em;
          padding: 0.5rem 0.85rem;
          border-radius: 999px;
          text-decoration: none;
          white-space: nowrap;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }
        .global-btn-ghost {
          color: #E7E9EC;
          border: 1px solid #232A35;
          background: transparent;
        }
        .global-btn-ghost:hover { border-color: #4B5563; color: #E7E9EC; background: #161B22; }
        .global-btn-solid {
          color: #14110A;
          background: #F0A22E;
          border: 1px solid #F0A22E;
        }
        .global-btn-solid:hover { box-shadow: 0 6px 16px -6px rgba(240, 162, 46, 0.55); }

        /* Desktop Adjustments */
        @media (min-width: 576px) {
          .global-nav {
            padding: 0.85rem 1.25rem;
            min-height: 72px;
          }
          .header-logo { width: 32px; height: 32px; }
          .header-title { font-size: 1.3rem; }
          .global-avatar { width: 36px; height: 36px; }
          .global-user-text { align-items: flex-end; }
          .global-user-name { font-size: 0.9rem; }
          .global-user-chip { gap: 0.75rem; }
          .global-logout-label { display: inline; font-size: 0.78rem; }
          .global-btn-logout { padding: 0.5rem 1rem; }
          .global-btn-ghost, .global-btn-solid { padding: 0.6rem 1.15rem; font-size: 0.78rem; }
        }
      `}</style>
    </>
  );
};

export default Header;