import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alerts';
import api from '../services/api';

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contact/submit', formData);
      await showAlert.success(
        'Message Sent!',
        'We have received your message and will get back to you shortly.'
      );
      setFormData({ name: '', email: '', subject: '', message: '' });
      navigate(user ? '/' : '/login');
    } catch (error) {
      showAlert.error('Error', error.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container" style={{ maxWidth: '640px' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'var(--ec-amber-dim)',
              border: '1px solid var(--ec-amber)',
              color: 'var(--ec-amber)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.9rem',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
            </svg>
          </div>
          <span className="ec-eyebrow" style={{ display: 'block', marginBottom: '0.35rem' }}>// Support Channel</span>
          <h1 className="ec-heading" style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            Get in Touch
          </h1>
          <p style={{ color: 'var(--ec-muted)', fontSize: '0.92rem' }}>
            Have a question or feedback? Dispatch a message directly to our team.
          </p>
        </div>

        <div className="ec-card" style={{ padding: '2rem', '--ec-accent': 'var(--ec-teal)' }}>
          <span className="ec-corner tl" />
          <span className="ec-corner br" />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="ec-two-col">
              <div>
                <label className="ec-field-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="ec-input"
                  placeholder="Bijay Kumar Behera"
                  required
                  disabled={loading || !!user}
                />
              </div>
              <div>
                <label className="ec-field-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="ec-input"
                  placeholder="name@example.com"
                  required
                  disabled={loading || !!user}
                />
              </div>
            </div>

            <div>
              <label className="ec-field-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="ec-input"
                placeholder="How can we help?"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="ec-field-label">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="ec-textarea"
                rows="5"
                placeholder="Write your message here..."
                required
                disabled={loading}
                style={{ resize: 'none' }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="ec-submit"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <span className="ec-spinner" />
                    <span>Sending Message</span>
                  </motion.span>
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
  );
};

export default Contact;