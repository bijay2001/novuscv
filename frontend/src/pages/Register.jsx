import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alerts';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password });
      loginUser(response.data.user);
      navigate('/');
    } catch (err) {
      showAlert.error(
        'Registration Failed',
        err.response?.data?.message || 'Check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const consoleStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    .ec-root {
      --ec-bg: #0A0D12;
      --ec-panel: #12161C;
      --ec-panel-alt: #161B22;
      --ec-surface: #1A2029;
      --ec-border: #232A35;
      --ec-border-soft: #1D232D;
      --ec-amber: #F0A22E;
      --ec-amber-dim: rgba(240, 162, 46, 0.14);
      --ec-teal: #2DD4BF;
      --ec-teal-dim: rgba(45, 212, 191, 0.14);
      --ec-text: #E7E9EC;
      --ec-muted: #7C8592;
      --ec-muted-2: #4B5563;
      font-family: 'IBM Plex Mono', SFMono-Regular, Menlo, monospace;
      background: var(--ec-bg);
      min-height: 100%;
    }

    .ec-heading { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }

    .ec-grid-bg {
      background-image:
        linear-gradient(rgba(45, 212, 191, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(45, 212, 191, 0.05) 1px, transparent 1px);
      background-size: 34px 34px;
      background-position: -1px -1px;
    }

    .ec-rail {
      background: var(--ec-panel);
      position: relative;
    }
    .ec-rail::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      box-shadow: inset -1px 0 0 var(--ec-border);
    }

    .ec-frame {
      position: relative;
      background: var(--ec-panel-alt);
      border: 1px solid var(--ec-border);
      border-radius: 6px;
      padding: 2.25rem 2rem;
    }
    .ec-corner {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid var(--ec-teal);
      opacity: 0.75;
    }
    .ec-corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
    .ec-corner.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
    .ec-corner.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
    .ec-corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

    .ec-eyebrow {
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      color: var(--ec-muted);
      font-weight: 500;
      text-transform: uppercase;
    }

    .ec-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--ec-amber);
      box-shadow: 0 0 8px var(--ec-amber);
      display: inline-block;
      animation: ec-pulse 1.3s ease-in-out infinite;
    }
    @keyframes ec-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }

    .ec-progress-track {
      width: 100%;
      height: 8px;
      border-radius: 999px;
      background: var(--ec-surface);
      border: 1px solid var(--ec-border);
      overflow: hidden;
      position: relative;
    }
    .ec-progress-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--ec-teal), var(--ec-amber));
      position: relative;
    }
    .ec-progress-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: linear-gradient(
        135deg,
        rgba(255,255,255,0.18) 25%, transparent 25%,
        transparent 50%, rgba(255,255,255,0.18) 50%,
        rgba(255,255,255,0.18) 75%, transparent 75%, transparent
      );
      background-size: 14px 14px;
      animation: ec-stripes 1.1s linear infinite;
    }
    @keyframes ec-stripes { to { background-position: 14px 0; } }

    .ec-stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.55rem 0;
      border-bottom: 1px solid var(--ec-border-soft);
      font-size: 0.72rem;
    }
    .ec-stat-row:last-child { border-bottom: none; }
    .ec-stat-label { color: var(--ec-muted); letter-spacing: 0.06em; }
    .ec-stat-value { color: var(--ec-text); font-weight: 500; }

    .ec-badge {
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      padding: 0.3rem 0.65rem;
      border-radius: 3px;
      border: 1px solid rgba(240, 162, 46, 0.35);
      background: var(--ec-amber-dim);
      color: var(--ec-amber);
      font-weight: 600;
    }

    .ec-field-label {
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      color: var(--ec-muted);
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: block;
    }

    .ec-input {
      width: 100%;
      background: var(--ec-surface);
      border: 1px solid var(--ec-border);
      border-radius: 6px;
      padding: 0.85rem 1rem;
      font-size: 0.9rem;
      color: var(--ec-text);
      font-family: 'IBM Plex Mono', monospace;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    }
    .ec-input::placeholder { color: var(--ec-muted-2); }
    .ec-input:focus {
      outline: none;
      border-color: var(--ec-teal);
      background: #1D2430;
      box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.14);
    }

    .ec-submit {
      width: 100%;
      background: var(--ec-teal);
      color: #08201C;
      border: none;
      border-radius: 6px;
      padding: 0.9rem 1rem;
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 600;
      font-size: 0.78rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: box-shadow 0.2s ease, transform 0.15s ease, background 0.2s ease;
    }
    .ec-submit:hover:not(:disabled) {
      box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.2), 0 8px 24px -8px rgba(45, 212, 191, 0.5);
    }
    .ec-submit:active:not(:disabled) { transform: translateY(1px); }
    .ec-submit:disabled { background: #3A3F47; color: var(--ec-muted); cursor: not-allowed; }
    .ec-submit:focus-visible { outline: 2px solid var(--ec-amber); outline-offset: 2px; }

    .ec-spinner {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid rgba(0,0,0,0.2);
      border-top-color: #08201C;
      animation: ec-spin 0.7s linear infinite;
    }
    @keyframes ec-spin { to { transform: rotate(360deg); } }

    .ec-link { color: var(--ec-amber); font-weight: 600; text-decoration: none; }
    .ec-link:hover { text-decoration: underline; }

    .ec-divider { border-color: var(--ec-border-soft) !important; }

    @media (prefers-reduced-motion: reduce) {
      .ec-dot, .ec-spinner, .ec-progress-fill::after { animation: none; }
    }
  `;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } }
  };

  return (
    <div className="ec-root d-flex flex-grow-1 w-100">
      <style>{consoleStyles}</style>

      <div className="row g-0 w-100 h-100">

        {/* --- LEFT RAIL: SETUP INSTRUMENT PANEL (desktop only) --- */}
        <div className="col-lg-5 ec-rail ec-grid-bg d-none d-lg-flex flex-column justify-content-center align-items-center p-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-100"
            style={{ maxWidth: '380px' }}
          >
            <div className="ec-frame">
              <span className="ec-corner tl" />
              <span className="ec-corner tr" />
              <span className="ec-corner bl" />
              <span className="ec-corner br" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="ec-eyebrow">Provisioning</span>
                <span className="ec-badge">
                  <span className="ec-dot me-2" style={{ verticalAlign: 'middle' }} />
                  SETUP
                </span>
              </div>

              <h4 className="ec-heading fw-bold mb-1" style={{ color: '#E7E9EC', fontSize: '1.3rem' }}>
                Workspace Init
              </h4>
              <p className="ec-eyebrow mb-4" style={{ textTransform: 'none', letterSpacing: 0 }}>
                Allocating your resume intelligence workspace.
              </p>

              <div className="ec-progress-track mb-2">
                <div className="ec-progress-fill" style={{ width: '62%' }} />
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="ec-eyebrow" style={{ fontSize: '0.62rem' }}>PENDING</span>
                <span style={{ color: '#2DD4BF', fontSize: '0.7rem', fontWeight: 600 }}>62%</span>
              </div>

              <div>
                <div className="ec-stat-row">
                  <span className="ec-stat-label">PROFILE</span>
                  <span className="ec-stat-value">QUEUED</span>
                </div>
                <div className="ec-stat-row">
                  <span className="ec-stat-label">STORAGE</span>
                  <span className="ec-stat-value">ALLOCATING</span>
                </div>
                <div className="ec-stat-row">
                  <span className="ec-stat-label">AI MODEL</span>
                  <span className="ec-stat-value">READY</span>
                </div>
              </div>
            </div>

            <p className="ec-eyebrow text-center mt-4 mb-0">// Resume Intelligence Workspace</p>
          </motion.div>
        </div>

        {/* --- RIGHT: FORM --- */}
        <div className="col-12 col-lg-7 d-flex flex-column justify-content-center align-items-center p-3 p-md-5">
          <motion.div
            className="w-100"
            style={{ maxWidth: '420px' }}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="ec-eyebrow">// New Account</span>
              <h3 className="ec-heading fw-bold mt-2 mb-2" style={{ color: '#E7E9EC', fontSize: '1.85rem' }}>
                Create account
              </h3>
              <p style={{ color: '#7C8592', fontSize: '0.85rem' }} className="mb-0">
                Register to begin optimizing your resume profile.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants} className="mb-3">
                <label className="ec-field-label">Full Name</label>
                <input
                  type="text"
                  className="ec-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mb-3">
                <label className="ec-field-label">Email Address</label>
                <input
                  type="email"
                  className="ec-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mb-4">
                <label className="ec-field-label">Password</label>
                <input
                  type="password"
                  className="ec-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={loading}
                  className="ec-submit"
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="ec-spinner" />
                      Provisioning
                    </span>
                  ) : 'Sign Up'}
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="text-center mt-4 pt-4 border-top ec-divider">
              <span style={{ color: '#7C8592', fontSize: '0.82rem' }}>Already have an active account? </span>
              <Link to="/login" className="ec-link" style={{ fontSize: '0.82rem' }}>
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Register;