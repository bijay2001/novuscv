import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoImage from '../assets/logo.png';

const Header = () => {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logoutUser();
    navigate('/login');
  };

  return (
    <header className="ec-header">
      <div className="ec-header-inner">
        <NavLink to="/" className="ec-brand" onClick={closeMenu}>
          <img
            src={logoImage}
            alt="NovusCV Logo"
            width="28"
            height="28"
            style={{ objectFit: 'contain', borderRadius: '6px' }}
          />
          <span>NovusCV</span>
          <span className="ec-brand-dot" title="System Online" />
        </NavLink>

        <nav className={`ec-nav ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <NavLink to="/" end className="ec-nav-link" onClick={closeMenu}>
                // Dashboard
              </NavLink>
              <NavLink to="/upload" className="ec-nav-link" onClick={closeMenu}>
                // Scan Resume
              </NavLink>
              <NavLink to="/contact" className="ec-nav-link" onClick={closeMenu}>
                // Support
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="ec-btn-ghost"
                style={{ padding: '0.42rem 0.9rem', fontSize: '0.72rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/contact" className="ec-nav-link" onClick={closeMenu}>
                // Contact
              </NavLink>
              <NavLink to="/login" className="ec-nav-link" onClick={closeMenu}>
                // Sign In
              </NavLink>
              <NavLink
                to="/register"
                className="ec-btn-solid"
                onClick={closeMenu}
                style={{ padding: '0.45rem 1rem', fontSize: '0.72rem' }}
              >
                Initialize Account
              </NavLink>
            </>
          )}
        </nav>

        <div className="ec-header-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="ec-icon-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="ec-icon-btn ec-mobile-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;