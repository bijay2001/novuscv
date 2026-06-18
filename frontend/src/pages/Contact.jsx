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

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-5 position-relative" style={{ backgroundColor: '#f4f7f6', overflow: 'hidden' }}>
      
      {/* Background Decor */}
      <div className="position-absolute top-0 start-0 bg-primary opacity-10 rounded-circle" style={{ width: '300px', height: '300px', filter: 'blur(60px)', transform: 'translate(-30%, -30%)' }}></div>
      
      <div className="container position-relative z-1 px-3" style={{ maxWidth: '600px' }}>
        
        <motion.div className="text-center mb-4" variants={fadeUp} initial="hidden" animate="visible">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3 shadow-sm" style={{ width: '64px', height: '64px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
            </svg>
          </div>
          <h2 className="fw-bolder text-dark mb-2" style={{ fontSize: '2.2rem', letterSpacing: '-0.5px' }}>Get in Touch</h2>
          <p className="text-secondary fs-6">Have a question or feedback? We'd love to hear from you.</p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
          <div className="card-body p-4 p-sm-5">
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-dark ms-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control px-3 py-2 rounded-3 bg-light border-0" placeholder="John Doe" required disabled={loading || !!user} style={{ fontSize: '0.95rem' }} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-dark ms-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control px-3 py-2 rounded-3 bg-light border-0" placeholder="john@example.com" required disabled={loading || !!user} style={{ fontSize: '0.95rem' }} />
                </div>
              </div>

              <div>
                <label className="form-label small fw-bold text-dark ms-1">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-control px-3 py-2 rounded-3 bg-light border-0" placeholder="How can we help?" required disabled={loading} style={{ fontSize: '0.95rem' }} />
              </div>

              <div>
                <label className="form-label small fw-bold text-dark ms-1">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="form-control px-3 py-2 rounded-3 bg-light border-0" rows="5" placeholder="Write your message here..." required disabled={loading} style={{ resize: 'none', fontSize: '0.95rem' }}></textarea>
              </div>

              <motion.button 
                type="submit" 
                disabled={loading} 
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="btn btn-primary btn-lg w-100 rounded-pill py-3 mt-3 fs-6 fw-bolder border-0 overflow-hidden position-relative"
                style={{ 
                  background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  transition: 'background 0.3s'
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="d-flex align-items-center justify-content-center gap-2">
                      <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                      <span>Sending Message...</span>
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