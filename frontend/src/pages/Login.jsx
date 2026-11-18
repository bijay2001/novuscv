import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alerts';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
  };

  const R = 68;
  const CIRC = 2 * Math.PI * R;
  const FILLED = CIRC * 0.942;

  return (
    <div className="ec-auth-shell ec-grid-bg">
      {/* Left Telemetry Rail (Desktop) */}
      <div className="ec-rail">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '380px' }}
        >
          <div className="ec-frame" style={{ padding: '2.25rem 2rem' }}>
            <span className="ec-corner tl" />
            <span className="ec-corner tr" />
            <span className="ec-corner bl" />
            <span className="ec-corner br" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span className="ec-eyebrow">Auth.Module</span>
              <span className="ec-badge">
                <span className="ec-dot" />
                ONLINE
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0 1rem' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={R} stroke="var(--ec-gauge-track)" strokeWidth="10" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r={R}
                  stroke="var(--ec-amber)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC - FILLED}
                  style={{
                    transformOrigin: 'center',
                    transform: 'rotate(-90deg)',
                    filter: 'drop-shadow(0 0 6px var(--ec-amber-glow))',
                  }}
                />
                <text
                  x="80"
                  y="76"
                  textAnchor="middle"
                  fill="var(--ec-text)"
                  fontSize="26"
                  fontWeight="700"
                  fontFamily="Space Grotesk, sans-serif"
                >
                  94.2%
                </text>
                <text
                  x="80"
                  y="96"
                  textAnchor="middle"
                  fill="var(--ec-muted)"
                  fontSize="9"
                  letterSpacing="1.5"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  MATCH SCORE
                </text>
              </svg>
            </div>

            <div>
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

          <p className="ec-eyebrow" style={{ display: 'block', textAlign: 'center', marginTop: '1.25rem' }}>
            // Resume Intelligence Workspace
          </p>
        </motion.div>
      </div>

      {/* Right Login Form */}
      <div className="ec-auth-form-col">
        <motion.div
          style={{ width: '100%', maxWidth: '420px' }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '1.75rem' }}>
            <span className="ec-eyebrow">// Session Login</span>
            <h1 className="ec-heading" style={{ fontSize: '2rem', fontWeight: 700, margin: '0.4rem 0' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--ec-muted)', fontSize: '0.88rem' }}>
              Enter your credentials to access your ATS intelligence dashboard.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="ec-card" style={{ padding: '2rem' }}>
            <span className="ec-corner tl" />
            <span className="ec-corner br" />

            <motion.div variants={itemVariants} style={{ marginBottom: '1.1rem' }}>
              <label className="ec-field-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="ec-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginBottom: '1.1rem' }}>
              <label className="ec-field-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="ec-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}
            >
              <input
                type="checkbox"
                id="rememberSwitch"
                className="ec-toggle"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberSwitch" style={{ color: 'var(--ec-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
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
                  <>
                    <span className="ec-spinner" />
                    <span>Authenticating</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            variants={itemVariants}
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--ec-border-soft)',
              fontSize: '0.84rem',
            }}
          >
            <span style={{ color: 'var(--ec-muted)' }}>Don&apos;t have an account? </span>
            <Link to="/register" style={{ color: 'var(--ec-teal)', fontWeight: 600 }}>
              Create one now →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;