import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alerts';
import Logo from '../components/Logo';
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

  // --- Ultra-Premium Scoped Styles ---
  const premiumStyles = `
    .font-mono-head { font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace; }
    .bg-ink-navy { background-color: #0B1017; position: relative; overflow: hidden; }
    .text-initializing-blue { color: #60a5fa; }
    
    /* Soft Mobile Background */
    .bg-app-soft { background-color: #f8fafc; }
    
    /* Modern Floating Glass Card */
    .premium-card {
      background: #ffffff;
      border-radius: 1.5rem;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }

    /* Next-Gen Input Fields */
    .input-modern {
      background-color: #f1f5f9;
      border: 2px solid transparent;
      padding: 0.875rem 1.25rem;
      border-radius: 0.85rem;
      font-size: 0.95rem;
      color: #1e293b;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .input-modern:focus {
      background-color: #ffffff;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
      outline: none;
    }
    .input-modern::placeholder { color: #94a0b8; font-weight: 400; }
    
    /* Desktop Laser Scanner Animation */
    .scan-line {
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,1) 50%, rgba(59,130,246,0) 100%);
      box-shadow: 0 0 15px #3b82f6;
      animation: laserMove 3s infinite ease-in-out;
      z-index: 10;
    }
    
    @keyframes laserMove {
      0% { top: 0%; opacity: 0; }
      15% { opacity: 1; }
      85% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }

    .skeleton-line {
      height: 8px;
      background-color: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      margin-bottom: 12px;
    }
  `;

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-vh-100 d-flex bg-app-soft">
      <style>{premiumStyles}</style>

      <div className="row g-0 w-100">
        
        {/* --- PANEL 1: DESKTOP BRANDING (Hidden on Mobile) --- */}
        <div className="col-lg-5 bg-ink-navy d-none d-lg-flex flex-column justify-content-between p-5 text-white border-end border-dark">
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Logo width={44} height={44} showText={true} textColor="#ffffff" />
            <p className="text-secondary mt-3 mb-0 font-mono-head" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
              // The new era of CV optimization.
            </p>
          </motion.div>

          {/* Central Mockup Motif Area */}
          <div className="w-100 d-flex justify-content-center my-auto position-relative py-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.2, duration: 0.6 }}
              className="card bg-dark bg-opacity-25 border border-secondary border-opacity-25 rounded-4 p-4 shadow-lg position-relative overflow-hidden w-100" 
              style={{ maxWidth: '380px' }}
            >
              <div className="scan-line"></div>
              
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-secondary bg-opacity-20 rounded-circle" style={{ width: '48px', height: '48px' }}></div>
                <div className="w-50">
                  <div className="skeleton-line w-50 bg-primary bg-opacity-50"></div>
                  <div className="skeleton-line w-75" style={{ height: '6px' }}></div>
                </div>
                <span className="badge bg-primary bg-opacity-10 text-initializing-blue border border-primary border-opacity-25 ms-auto small rounded-pill py-2 px-3 font-mono-head">
                  SETUP
                </span>
              </div>
              
              <div className="skeleton-line w-100"></div>
              <div className="skeleton-line w-100"></div>
              <div className="skeleton-line w-50 mb-4"></div>

              <div className="border-top border-secondary border-opacity-25 pt-4 d-flex justify-content-between align-items-center mt-2">
                <span className="small font-mono-head text-secondary">ACCOUNT STATUS</span>
                <span className="fw-bolder text-initializing-blue font-mono-head fs-6">INITIALIZING...</span>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="small text-secondary font-mono-head">
            // SECURE ENVIRONMENT READY
          </motion.div>
        </div>

        {/* --- PANEL 2: INTERACTIVE FORM (Centered Floating Card on Mobile) --- */}
        <div className="col-12 col-lg-7 d-flex flex-column justify-content-center align-items-center p-3 p-md-5 position-relative">
          
          <motion.div 
            className="w-100 premium-card p-4 p-sm-5" 
            style={{ maxWidth: '440px' }}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            
            {/* Mobile Branding (Only visible on small screens) */}
            <div className="d-lg-none text-center mb-4 pb-2 border-bottom border-light">
              <div className="d-flex justify-content-center mb-3">
                 <Logo width={42} height={42} showText={true} textColor="#0f172a" />
              </div>
              <p className="text-secondary small fw-medium mb-3">
                The new era of CV optimization.
              </p>
            </div>

            <div className="mb-4 text-center text-lg-start">
              <h3 className="fw-bolder text-dark mb-2 tracking-tight" style={{ letterSpacing: '-0.5px' }}>Create Account</h3>
              <p className="text-secondary small fw-medium">Register to begin optimizing your resume profile.</p>
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              
              {/* Modern Input: Full Name */}
              <div>
                <label className="form-label small fw-bold text-dark mb-1 ms-1">Full Name</label>
                <input 
                  type="text" 
                  className="form-control input-modern w-100" 
                  placeholder="John Doe"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              {/* Modern Input: Email */}
              <div>
                <label className="form-label small fw-bold text-dark mb-1 ms-1">Email Address</label>
                <input 
                  type="email" 
                  className="form-control input-modern w-100" 
                  placeholder="name@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              {/* Modern Input: Password */}
              <div>
                <label className="form-label small fw-bold text-dark mb-1 ms-1">Password</label>
                <input 
                  type="password" 
                  className="form-control input-modern w-100" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>

              {/* Main Call to Action */}
              <motion.button 
                whileHover={!loading ? { y: -2, boxShadow: "0 10px 20px -10px rgba(13, 110, 253, 0.6)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit" 
                disabled={loading} 
                className="btn btn-primary w-100 rounded-pill py-3 mt-3 fs-6 fw-bold border-0 text-white"
                style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', transition: 'all 0.3s' }}
              >
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Encrypting Records...</span>
                  </div>
                ) : 'Sign Up'}
              </motion.button>
              
            </form>

            <div className="text-center mt-4 pt-3 border-top border-light">
              <span className="text-secondary small fw-medium">Already have an active account? </span>
              <Link to="/login" className="text-decoration-none small fw-bold text-primary ms-1">
                Sign In
              </Link>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Register;