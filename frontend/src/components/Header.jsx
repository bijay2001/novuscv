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
          
          {/* Logo Section - Removed d-none so text always shows */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0">
            <img src={logoImage} alt="NovusCV Logo" className="header-logo" style={{ objectFit: 'contain' }} />
            <span className="fw-bolder header-title" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
              NovusCV
            </span>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                  </svg>
                </motion.button>
              </>
            ) : (
              // SHOW WHEN LOGGED OUT
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-light fw-bold px-2 px-sm-3 border border-secondary border-opacity-25 rounded-pill btn-sm d-flex align-items-center transition-all text-nowrap">Sign In</Link>
                <Link to="/register" className="btn btn-primary fw-bold px-2 px-sm-3 rounded-pill btn-sm d-flex align-items-center transition-all shadow-sm text-nowrap">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <style>{`
        .global-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgb(255, 255, 255); 
          backdrop-filter: blur(20px) saturate(150%); 
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.49);
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

        .header-logo {
          width: 28px;
          height: 28px;
        }
        .header-title {
          font-size: 1.15rem;
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
          line-height: 1.1; 
        }
        
        .global-user-name { 
          font-weight: 700; 
          font-size: 0.85rem; 
          color: #0f172a; 
        }
        
        .global-user-email { 
          font-size: 0.72rem; 
          color: #64748b; 
          margin-top: 0.15rem;
        }
        
        .global-avatar {
          width: 32px; 
          height: 32px; 
          border-radius: 50%;
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          border: 1px solid rgba(67, 56, 202, 0.1);
          color: #4338ca;
          font-weight: 800; 
          font-size: 0.85rem;
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
          border: 1px solid rgba(15, 23, 42, 0.08); 
          background: #ffffff;
          color: #475569; 
          font-weight: 600; 
          border-radius: 999px; 
          padding: 0.45rem;
          cursor: pointer; 
          transition: all 0.2s ease;
        }
        
        .global-btn-logout:hover { 
          background: #fff1f2; 
          color: #e11d48;
          border-color: rgba(225, 29, 72, 0.2);
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.1); 
        }
        
        .global-logout-label { 
          display: none; 
        }

        /* Desktop Adjustments */
        @media (min-width: 576px) { 
          .global-nav { 
            padding: 0.85rem 1.25rem; 
            min-height: 72px;
          }
          .header-logo {
            width: 34px;
            height: 34px;
          }
          .header-title {
            font-size: 1.35rem;
          }
          .global-avatar { 
            width: 36px; 
            height: 36px; 
          }
          .global-user-text { align-items: flex-end; }
          .global-user-name { font-size: 0.9rem; }
          .global-user-chip { gap: 0.75rem; }
          .global-logout-label { display: inline; font-size: 0.85rem; } 
          .global-btn-logout { 
            padding: 0.45rem 1rem; 
          }
        }
      `}</style>
    </>
  );
};

export default Header;