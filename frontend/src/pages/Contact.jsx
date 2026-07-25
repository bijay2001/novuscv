import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alerts';
import api from '../services/api';

const Contact = () => {
  const { user } = useAuth(); // Get current user status
  const navigate = useNavigate(); // Hook for navigation
  const [loading, setLoading] = useState(false);

  // Auto-fill name and email if the user is already logged in
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    subject: '',
    message: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to the backend route
      await api.post('/contact/submit', formData);

      // Wait for user to click "OK" on the success alert
      await showAlert.success('Message Sent!', 'We have received your message and will get back to you shortly.');

      setFormData({ name: '', email: '', subject: '', message: '' });

      // Conditional Navigation based on Auth status
      if (user) {
        navigate('/'); // Go to Dashboard if logged in
      } else {
        navigate('/login'); // Go to Login if guest
      }

    } catch (error) {
      showAlert.error('Error', error.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const consoleStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

    .ec-root {
      --ec-bg: #0A0D12;
      --ec-panel-alt: #161B22;
      --ec-surface: #1A2029;
      --ec-border: #232A35;
      --ec-border-soft: #1D232D;
      --ec-amber: #F0A22E;
      --ec-amber-dim: rgba(240, 162, 46, 0.14);
      --ec-teal: #2DD4BF;
      --ec-text: #E7E9EC;
      --ec-muted: #7C8592;
      --ec-muted-2: #4B5563;
      background: var(--ec-bg);
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
      color: var(--ec-text);
    }
    .ec-heading { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }
    .ec-mono { font-family: 'IBM Plex Mono', SFMono-Regular, monospace; }

    .ec-grid-bg {
      background-image:
        linear-gradient(rgba(240, 162, 46, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(240, 162, 46, 0.045) 1px, transparent 1px);
      background-size: 34px 34px;
      background-position: -1px -1px;
    }

    .ec-eyebrow {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      color: var(--ec-muted);
      font-weight: 500;
      text-transform: uppercase;
    }

    .ec-icon-badge {
      width: 60px; height: 60px; border-radius: 14px;
      background: var(--ec-amber-dim);
      border: 1px solid rgba(240, 162, 46, 0.3);
      color: var(--ec-amber);
      display: flex; align-items: center; justify-content: center;
    }

    .ec-card {
      background: var(--ec-panel-alt);
      border: 1px solid var(--ec-border);
      border-radius: 14px;
      position: relative;
    }
    .ec-corner { position: absolute; width: 16px; height: 16px; opacity: 0.75; }
    .ec-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--ec-teal); border-left: 2px solid var(--ec-teal); }
    .ec-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--ec-teal); border-right: 2px solid var(--ec-teal); }

    .ec-field-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ec-muted);
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: block;
    }

    .ec-input, .ec-textarea {
      width: 100%;
      background: var(--ec-surface);
      border: 1px solid var(--ec-border);
      border-radius: 8px;
      padding: 0.8rem 1rem;
      font-size: 0.9rem;
      color: var(--ec-text);
      font-family: 'Inter', sans-serif;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    }
    .ec-input::placeholder, .ec-textarea::placeholder { color: var(--ec-muted-2); }
    .ec-input:focus, .ec-textarea:focus {
      outline: none;
      border-color: var(--ec-teal);
      box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.14);
    }
    .ec-input:disabled {
      background: #14181F;
      color: var(--ec-muted);
      cursor: not-allowed;
      border-color: var(--ec-border-soft);
    }

    .ec-submit {
      width: 100%;
      background: var(--ec-amber);
      color: #14110A;
      border: none;
      border-radius: 10px;
      padding: 0.95rem 1rem;
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      position: relative;
    }
    .ec-submit:disabled { background: #3A3F47; color: var(--ec-muted); cursor: not-allowed; }

    .ec-spinner {
      width: 15px; height: 15px; border-radius: 50%;
      border: 2px solid rgba(0,0,0,0.2); border-top-color: #14110A;
      animation: ec-spin 0.7s linear infinite;
    }
    @keyframes ec-spin { to { transform: rotate(360deg); } }

    @media (prefers-reduced-motion: reduce) {
      .ec-spinner { animation: none; }
    }
  `;

  return (
    <div className="ec-root ec-grid-bg d-flex flex-column align-items-center justify-content-center py-5 position-relative" style={{ overflow: 'hidden' }}>
      <style>{consoleStyles}</style>

      <div className="container position-relative px-3" style={{ maxWidth: '600px' }}>

        <motion.div className="text-center mb-4" variants={fadeUp} initial="hidden" animate="visible">
          <div className="ec-icon-badge d-inline-flex mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
            </svg>
          </div>
          <span className="ec-eyebrow d-block mb-2">// Contact</span>
          <h2 className="ec-heading fw-bold mb-2" style={{ fontSize: '2.1rem' }}>Get in Touch</h2>
          <p style={{ color: 'var(--ec-muted)', fontSize: '0.92rem' }}>
            Have a question or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="ec-card overflow-hidden">
          <span className="ec-corner tl" />
          <span className="ec-corner br" />
          <div className="p-4 p-sm-5">
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="ec-field-label">Full Name</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="ec-input" placeholder="John Doe" required
                    disabled={loading || !!user}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="ec-field-label">Email Address</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className="ec-input" placeholder="john@example.com" required
                    disabled={loading || !!user}
                  />
                </div>
              </div>

              <div>
                <label className="ec-field-label">Subject</label>
                <input
                  type="text" name="subject" value={formData.subject} onChange={handleChange}
                  className="ec-input" placeholder="How can we help?" required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="ec-field-label">Message</label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange}
                  className="ec-textarea" rows="5" placeholder="Write your message here..." required
                  disabled={loading} style={{ resize: 'none' }}
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { boxShadow: '0 10px 24px -8px rgba(240, 162, 46, 0.5)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="ec-submit mt-2"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="d-flex align-items-center justify-content-center gap-2">
                      <span className="ec-spinner" />
                      <span>Sending Message</span>
                    </motion.div>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;