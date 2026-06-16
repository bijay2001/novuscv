import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { showAlert } from '../utils/alerts';
import { motion } from 'framer-motion';
import Logo from '../components/Logo'; // IMPORT YOUR NEW LOGO HERE

// --- Animated Counter Component ---
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{displayValue}</>;
};

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Mock Data (Replace with API fetch later)
  const stats = { avgScore: 85, totalScans: 12 };
  const recentScans = [
    { id: 1, fileName: 'Frontend_Dev_Final.pdf', scannedAt: 'Just now', score: 92 },
    { id: 2, fileName: 'Software_Engineer_v2.docx', scannedAt: '2 days ago', score: 64 },
  ];

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

  const getMatchTheme = (score) => {
    if (score >= 80) return { bg: '#ecfdf5', color: '#059669' };
    if (score >= 60) return { bg: '#fffbeb', color: '#b45309' };
    return { bg: '#fff1f2', color: '#e11d48' };
  };

  const firstName = user?.name ? user.name.split(' ')[0] : null;

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
  };

  return (
    <div className="dash-page">
      <span className="dash-blob dash-blob-1" />
      <span className="dash-blob dash-blob-2" />

      {/* Top Nav */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="dash-nav"
      >
        <div className="dash-nav-inner">
          
          {/* REPLACE OLD BRANDING WITH THE LOGO COMPONENT */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo width={42} height={42} showText={true} />
          </Link>

          <div className="dash-nav-right">
            <div className="dash-user-chip">
              <div className="dash-user-text">
                <span className="dash-user-name">{user?.name || 'Welcome back'}</span>
                <span className="dash-user-email">{user?.email || 'Candidate'}</span>
              </div>
              <div className="dash-avatar">{getInitials(user?.name)}</div>
            </div>

            <motion.button whileTap={{ scale: 0.94 }} onClick={handleLogout} className="dash-logout-btn" title="Sign out">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
              </svg>
              <span className="dash-logout-label">Sign out</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.div className="dash-container" variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="dash-heading-row">
          <span className="dash-eyebrow">Dashboard</span>
          <h2 className="dash-title">{firstName ? `Welcome back, ${firstName}` : 'Overview'}</h2>
          <p className="dash-subtitle">Track and optimize your ATS performance.</p>
        </motion.div>

        {/* CTA Banner */}
        <motion.div variants={itemVariants}>
          <Link to="/upload" className="dash-cta-link">
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} className="dash-cta">
              <div className="dash-cta-top">
                <div className="dash-cta-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z" />
                  </svg>
                </div>
                <div className="dash-cta-body">
                  <h3 className="dash-cta-title">Scan a new resume</h3>
                  <p className="dash-cta-text">Upload a PDF or DOCX to get instant AI feedback and ATS keyword matches.</p>
                </div>
              </div>
              <span className="dash-cta-action">
                Start analysis
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={itemVariants} className="dash-stats-grid">
          <div className="dash-stat-card">
            <div className="dash-stat-text">
              <span className="dash-stat-label">Avg. ATS match</span>
              <span className="dash-stat-value">
                <AnimatedNumber value={stats.avgScore} />%<span className="dash-stat-trend">↑</span>
              </span>
            </div>
            <div className="dash-stat-icon dash-stat-icon-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z" />
              </svg>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-text">
              <span className="dash-stat-label">Resumes scanned</span>
              <span className="dash-stat-value"><AnimatedNumber value={stats.totalScans} /></span>
            </div>
            <div className="dash-stat-icon dash-stat-icon-indigo">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Recent Scans */}
        <motion.div variants={itemVariants} className="dash-section">
          <div className="dash-section-head">
            <h5 className="dash-section-title">Recent scans</h5>
          </div>

          <div className="dash-list-card">
            {recentScans.map((scan) => {
              const theme = getMatchTheme(scan.score);
              return (
                <motion.div
                  key={scan.id}
                  whileHover={{ backgroundColor: '#f8f9fc' }}
                  whileTap={{ scale: 0.99 }}
                  className="dash-list-item"
                >
                  <div className="dash-list-left">
                    <div className="dash-list-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z" />
                      </svg>
                    </div>
                    <div className="dash-list-text">
                      <h6 className="dash-list-filename">{scan.fileName}</h6>
                      <small className="dash-list-time">{scan.scannedAt}</small>
                    </div>
                  </div>
                  <div className="dash-list-right">
                    <span className="dash-match-badge" style={{ background: theme.bg, color: theme.color }}>
                      {scan.score}% match
                    </span>
                    <svg className="dash-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        /* ... Keeping the rest of your original CSS exactly the same ... */
        .dash-page {
          position: relative;
          min-height: 100vh;
          padding-bottom: 4rem;
          background: #f6f7fb;
          font-family: 'Inter', sans-serif;
          color: #0f172a;
          overflow-x: hidden;
        }

        .dash-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.3;
          z-index: 0;
          pointer-events: none;
          animation: dash-float 18s ease-in-out infinite;
        }
        .dash-blob-1 { width: 300px; height: 300px; top: -110px; left: -90px; background: #c7d2fe; }
        .dash-blob-2 { width: 340px; height: 340px; top: 420px; right: -130px; background: #bae6fd; animation-delay: -7s; }
        @keyframes dash-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(22px, -26px); }
        }

        .dash-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          padding: 0.8rem 1.25rem;
        }
        .dash-nav-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .dash-nav-right { display: flex; align-items: center; gap: 0.9rem; }
        .dash-user-chip { display: none; align-items: center; gap: 0.65rem; }
        @media (min-width: 576px) { .dash-user-chip { display: flex; } }
        .dash-user-text { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.25; }
        .dash-user-name { font-weight: 700; font-size: 0.88rem; color: #0f172a; }
        .dash-user-email { font-size: 0.76rem; color: #94a0b8; }
        .dash-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #eef2ff;
          color: #4338ca;
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dash-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #fff;
          color: #e11d48;
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: 999px;
          padding: 0.5rem 0.65rem;
          cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .dash-logout-btn:hover { background: #fff1f2; box-shadow: 0 6px 16px -8px rgba(225, 29, 72, 0.35); }
        .dash-logout-label { display: none; }
        @media (min-width: 768px) {
          .dash-logout-btn { padding: 0.5rem 1.1rem; }
          .dash-logout-label { display: inline; }
        }

        .dash-container { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; padding: 2rem 1.25rem 0; }

        .dash-heading-row { margin-bottom: 1.5rem; }
        .dash-eyebrow { display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #4f46e5; margin-bottom: 0.35rem; }
        .dash-title { font-size: 1.7rem; font-weight: 800; margin: 0 0 0.2rem; color: #0f172a; }
        .dash-subtitle { margin: 0; color: #5b6478; font-size: 0.92rem; }

        .dash-cta-link { text-decoration: none; display: block; margin-bottom: 1.5rem; }
        .dash-cta {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border-radius: 1.4rem;
          padding: 1.75rem 2rem;
          background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          color: #fff;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 24px 48px -26px rgba(67, 56, 202, 0.55);
          cursor: pointer;
        }
        .dash-cta::after {
          content: '';
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          top: -90px;
          right: -70px;
        }
        .dash-cta-top { display: flex; align-items: center; gap: 1.1rem; flex: 1; min-width: 0; position: relative; z-index: 1; }
        .dash-cta-icon {
          width: 52px;
          height: 52px;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dash-cta-body { min-width: 0; }
        .dash-cta-title { font-size: 1.2rem; font-weight: 800; margin: 0 0 0.3rem; }
        .dash-cta-text { margin: 0; font-size: 0.88rem; color: rgba(255, 255, 255, 0.82); line-height: 1.5; max-width: 420px; }
        .dash-cta-action {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          color: #4338ca;
          font-weight: 700;
          font-size: 0.85rem;
          border-radius: 999px;
          padding: 0.65rem 1.15rem;
          position: relative;
          z-index: 1;
          white-space: nowrap;
        }
        @media (max-width: 720px) {
          .dash-cta { flex-direction: column; align-items: stretch; padding: 1.5rem; gap: 1.1rem; }
          .dash-cta-action { width: 100%; justify-content: center; }
        }

        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.1rem;
          margin-bottom: 1.75rem;
        }
        .dash-stat-card {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 1.25rem;
          padding: 1.4rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 14px 30px -22px rgba(15, 23, 42, 0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .dash-stat-card:hover { transform: translateY(-3px); box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 18px 34px -20px rgba(15, 23, 42, 0.22); }
        .dash-stat-text { display: flex; flex-direction: column; gap: 0.4rem; min-width: 0; }
        .dash-stat-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a0b8; }
        .dash-stat-value { font-size: 1.9rem; font-weight: 800; color: #0f172a; display: flex; align-items: baseline; gap: 0.3rem; }
        .dash-stat-trend { font-size: 1rem; color: #10b981; font-weight: 700; }
        .dash-stat-icon { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dash-stat-icon-success { background: #ecfdf5; color: #059669; }
        .dash-stat-icon-indigo { background: #eef2ff; color: #4f46e5; }

        .dash-section { margin-bottom: 1rem; }
        .dash-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
        .dash-section-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0; }

        .dash-list-card {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 16px 34px -24px rgba(15, 23, 42, 0.2);
        }
        .dash-list-item { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.25rem; cursor: pointer; }
        .dash-list-item:not(:first-child) { border-top: 1px solid rgba(15, 23, 42, 0.06); }
        .dash-list-left { display: flex; align-items: center; gap: 0.9rem; min-width: 0; flex: 1; }
        .dash-list-icon {
          width: 44px;
          height: 44px;
          border-radius: 0.85rem;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dash-list-text { min-width: 0; }
        .dash-list-filename {
          margin: 0 0 0.15rem;
          font-weight: 700;
          font-size: 0.92rem;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }
        .dash-list-time { font-size: 0.78rem; color: #94a0b8; }
        .dash-list-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .dash-match-badge { font-size: 0.78rem; font-weight: 700; padding: 0.35rem 0.8rem; border-radius: 999px; white-space: nowrap; }
        .dash-chevron { color: #c2c8d6; display: none; flex-shrink: 0; }
        @media (min-width: 480px) { .dash-chevron { display: block; } }

        @media (max-width: 480px) {
          .dash-title { font-size: 1.4rem; }
          .dash-list-filename { max-width: 130px; }
          .dash-cta-icon { width: 44px; height: 44px; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;