import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alerts';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser, user, loading: isSessionLoading } = useAuth();

  useEffect(() => {
    if (!isSessionLoading && user) {
      navigate('/');
    }
  }, [user, isSessionLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password, rememberMe });
      loginUser(response.data.user);
      navigate('/');
    } catch (err) {
      showAlert.error(
        'Login Failed',
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
        linear-gradient(rgba(240, 162, 46, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(240, 162, 46, 0.045) 1px, transparent 1px);
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
      border: 2px solid var(--ec-amber);
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
      background: var(--ec-teal);
      box-shadow: 0 0 8px var(--ec-teal);
      display: inline-block;
      animation: ec-pulse 2.2s ease-in-out infinite;
    }
    @keyframes ec-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }

    .ec-gauge-ring-bg { stroke: var(--ec-border); fill: none; }
    .ec-gauge-ring-fg {
      stroke: var(--ec-amber);
      fill: none;
      stroke-linecap: round;
      filter: drop-shadow(0 0 6px rgba(240, 162, 46, 0.5));
      transform-origin: center;
      transform: rotate(-90deg);
    }

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
      border: 1px solid rgba(45, 212, 191, 0.35);
      background: var(--ec-teal-dim);
      color: var(--ec-teal);
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
      border-color: var(--ec-amber);
      background: #1D2430;
      box-shadow: 0 0 0 3px rgba(240, 162, 46, 0.14);
    }

    .ec-toggle {
      appearance: none;
      -webkit-appearance: none;
      width: 34px;
      height: 19px;
      border-radius: 999px;
      background: var(--ec-surface);
      border: 1px solid var(--ec-border);
      position: relative;
      cursor: pointer;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }
    .ec-toggle::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: var(--ec-muted);
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .ec-toggle:checked { background: var(--ec-amber-dim); border-color: var(--ec-amber); }
    .ec-toggle:checked::before { transform: translateX(15px); background: var(--ec-amber); }

    .ec-submit {
      width: 100%;
      background: var(--ec-amber);
      color: #14110A;
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
      box-shadow: 0 0 0 3px rgba(240, 162, 46, 0.2), 0 8px 24px -8px rgba(240, 162, 46, 0.5);
    }
    .ec-submit:active:not(:disabled) { transform: translateY(1px); }
    .ec-submit:disabled { background: #3A3F47; color: var(--ec-muted); cursor: not-allowed; }
    .ec-submit:focus-visible { outline: 2px solid var(--ec-teal); outline-offset: 2px; }

    .ec-spinner {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.25);
      border-top-color: #14110A;
      animation: ec-spin 0.7s linear infinite;
    }
    @keyframes ec-spin { to { transform: rotate(360deg); } }

    .ec-link { color: var(--ec-teal); font-weight: 600; text-decoration: none; }
    .ec-link:hover { text-decoration: underline; }

    .ec-divider { border-color: var(--ec-border-soft) !important; }

    @media (prefers-reduced-motion: reduce) {
      .ec-dot, .ec-spinner { animation: none; }
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

  // Decorative gauge geometry (94.2%)
  const R = 70;
  const CIRC = 2 * Math.PI * R;
  const FILLED = CIRC * 0.942;

  return (
    <div className="ec-root d-flex flex-grow-1 w-100">
      <style>{consoleStyles}</style>

      <div className="row g-0 w-100 h-100">

        {/* --- LEFT RAIL: INSTRUMENT PANEL (desktop only) --- */}
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
                <span className="ec-eyebrow">Auth.Module</span>
                <span className="ec-badge">
                  <span className="ec-dot me-2" style={{ verticalAlign: 'middle' }} />
                  ONLINE
                </span>
              </div>

              <div className="d-flex justify-content-center py-2 mb-3">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle className="ec-gauge-ring-bg" cx="80" cy="80" r={R} strokeWidth="10" />
                  <circle
                    className="ec-gauge-ring-fg"
                    cx="80" cy="80" r={R}
                    strokeWidth="10"
                    strokeDasharray={CIRC}
                    strokeDashoffset={CIRC - FILLED}
                  />
                  <text
                    x="80" y="76" textAnchor="middle"
                    fill="#E7E9EC" fontSize="26" fontWeight="700"
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    94.2%
                  </text>
                  <text
                    x="80" y="96" textAnchor="middle"
                    fill="#7C8592" fontSize="9" letterSpacing="1.5"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    MATCH SCORE
                  </text>
                </svg>
              </div>

              <div className="mt-3">
                <div className="ec-stat-row">
                  <span className="ec-stat-label">SESSION</span>
                  <span className="ec-stat-value">SECURE</span>
                </div>
                <div className="ec-stat-row">
                  <span className="ec-stat-label">ENCRYPTION</span>
                  <span className="ec-stat-value">AES-256</span>
                </div>
                <div className="ec-stat-row">
                  <span className="ec-stat-label">LATENCY</span>
                  <span className="ec-stat-value">12ms</span>
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
              <span className="ec-eyebrow">// Session Login</span>
              <h3 className="ec-heading fw-bold mt-2 mb-2" style={{ color: '#E7E9EC', fontSize: '1.85rem' }}>
                Welcome back
              </h3>
              <p style={{ color: '#7C8592', fontSize: '0.85rem' }} className="mb-0">
                Enter your credentials to access your dashboard.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
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

              <motion.div variants={itemVariants} className="mb-3">
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

              <motion.div variants={itemVariants} className="d-flex align-items-center gap-2 mb-4 mt-1">
                <input
                  type="checkbox"
                  id="rememberSwitch"
                  className="ec-toggle"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberSwitch" style={{ color: '#7C8592', fontSize: '0.78rem', cursor: 'pointer' }}>
                  Remember my device
                </label>
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
                      Authenticating
                    </span>
                  ) : 'Sign In'}
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="text-center mt-4 pt-4 border-top ec-divider">
              <span style={{ color: '#7C8592', fontSize: '0.82rem' }}>Don't have an account? </span>
              <Link to="/register" className="ec-link" style={{ fontSize: '0.82rem' }}>
                Create one now
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Login;