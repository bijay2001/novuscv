import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alerts';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
  };

  return (
    <div className="ec-auth-shell ec-grid-bg">
      {/* Left Provisioning Rail */}
      <div className="ec-rail">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '380px' }}
        >
          <div className="ec-frame" style={{ padding: '2.25rem 2rem', '--ec-accent': 'var(--ec-teal)' }}>
            <span className="ec-corner tl" />
            <span className="ec-corner tr" />
            <span className="ec-corner bl" />
            <span className="ec-corner br" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span className="ec-eyebrow">Provisioning</span>
              <span className="ec-badge amber">
                <span className="ec-dot" style={{ background: 'var(--ec-amber)', boxShadow: '0 0 8px var(--ec-amber)' }} />
                SETUP
              </span>
            </div>

            <h3 className="ec-heading" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Workspace Init
            </h3>
            <p style={{ color: 'var(--ec-muted)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              Allocating your personal AI resume intelligence workspace.
            </p>

            <div
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '999px',
                background: 'var(--ec-surface)',
                border: '1px solid var(--ec-border)',
                overflow: 'hidden',
                marginBottom: '0.5rem',
              }}
            >
              <motion.div
                initial={{ width: '15%' }}
                animate={{ width: '68%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--ec-teal), var(--ec-amber))',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span className="ec-eyebrow" style={{ fontSize: '0.62rem' }}>READY TO DEPLOY</span>
              <span className="ec-mono" style={{ color: 'var(--ec-teal)', fontSize: '0.72rem', fontWeight: 600 }}>68%</span>
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
                <span className="ec-stat-value" style={{ color: 'var(--ec-teal)' }}>READY</span>
              </div>
            </div>
          </div>

          <p className="ec-eyebrow" style={{ display: 'block', textAlign: 'center', marginTop: '1.25rem' }}>
            // Resume Intelligence Workspace
          </p>
        </motion.div>
      </div>

      {/* Right Registration Form */}
      <div className="ec-auth-form-col">
        <motion.div
          style={{ width: '100%', maxWidth: '420px' }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '1.75rem' }}>
            <span className="ec-eyebrow">// New Account</span>
            <h1 className="ec-heading" style={{ fontSize: '2rem', fontWeight: 700, margin: '0.4rem 0' }}>
              Create account
            </h1>
            <p style={{ color: 'var(--ec-muted)', fontSize: '0.88rem' }}>
              Register to begin optimizing your resume profile against ATS filters.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="ec-card" style={{ padding: '2rem', '--ec-accent': 'var(--ec-teal)' }}>
            <span className="ec-corner tl" />
            <span className="ec-corner br" />

            <motion.div variants={itemVariants} style={{ marginBottom: '1.1rem' }}>
              <label className="ec-field-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="ec-input"
                placeholder="Bijay Kumar Behera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginBottom: '1.1rem' }}>
              <label className="ec-field-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                className="ec-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
              <label className="ec-field-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                className="ec-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={loading}
                className="ec-submit ec-btn-teal"
              >
                {loading ? (
                  <>
                    <span className="ec-spinner" />
                    <span>Provisioning</span>
                  </>
                ) : (
                  'Sign Up'
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
            <span style={{ color: 'var(--ec-muted)' }}>Already have an active account? </span>
            <Link to="/login" style={{ color: 'var(--ec-amber)', fontWeight: 600 }}>
              Sign In →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;