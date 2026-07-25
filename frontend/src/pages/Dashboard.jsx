import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Animated Counter Component ---
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    // Ensure value is a number to prevent NaN errors
    const numValue = Number(value) || 0;

    if (numValue === 0) {
      setDisplayValue(0);
      return;
    }

    const increment = numValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= numValue) {
        setDisplayValue(numValue);
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
  const { user } = useAuth();

  // Real State for Database Data
  const [stats, setStats] = useState({ avgScore: 0, totalScans: 0 });
  const [recentScans, setRecentScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/resume/dashboard');
        setStats({
          avgScore: response.data.stats.avgScore,
          totalScans: response.data.stats.totalScans
        });
        setRecentScans(response.data.stats.recentScans);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getMatchTheme = (score) => {
    if (!score) return { accent: '#7C8592', tag: 'UNSCORED' };
    if (score >= 80) return { accent: '#2DD4BF', tag: 'OPTIMAL' };
    if (score >= 60) return { accent: '#F0A22E', tag: 'CAUTION' };
    return { accent: '#EF4444', tag: 'CRITICAL' };
  };

  // Helper to format MySQL timestamps securely
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
      <motion.div className="dash-container" variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="dash-heading-row">
          <span className="dash-eyebrow">// Dashboard</span>
          <h2 className="dash-title">{firstName ? `Welcome back, ${firstName}` : 'Overview'}</h2>
          <p className="dash-subtitle">Track and optimize your ATS performance.</p>
        </motion.div>

        {/* CTA Banner */}
        <motion.div variants={itemVariants}>
          <Link to="/upload" className="dash-cta-link">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} className="dash-cta">
              <span className="dash-cta-corner tl" />
              <span className="dash-cta-corner br" />
              <div className="dash-cta-top">
                <div className="dash-cta-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z" />
                  </svg>
                </div>
                <div className="dash-cta-body">
                  <span className="dash-cta-eyebrow">New Scan</span>
                  <h3 className="dash-cta-title">Scan a new resume</h3>
                  <p className="dash-cta-text">Upload a PDF or DOCX to get instant AI feedback and ATS keyword matches.</p>
                </div>
              </div>
              <span className="dash-cta-action">
                Start analysis
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stat Cards */}
        <motion.div variants={itemVariants} className="dash-stats-grid">
          <div className="dash-stat-card">
            <span className="dash-stat-corner tl" />
            <span className="dash-stat-corner br" />
            <div className="dash-stat-text">
              <span className="dash-stat-label">Avg. ATS Match</span>
              <span className="dash-stat-value">
                {isLoading ? '···' : <AnimatedNumber value={stats.avgScore} />}%
                {!isLoading && stats.avgScore > 0 && <span className="dash-stat-trend">↑</span>}
              </span>
            </div>
            <div className="dash-stat-icon dash-stat-icon-teal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z" />
              </svg>
            </div>
          </div>

          <div className="dash-stat-card">
            <span className="dash-stat-corner tl" />
            <span className="dash-stat-corner br" />
            <div className="dash-stat-text">
              <span className="dash-stat-label">Resumes Scanned</span>
              <span className="dash-stat-value">
                {isLoading ? '···' : <AnimatedNumber value={stats.totalScans} />}
              </span>
            </div>
            <div className="dash-stat-icon dash-stat-icon-amber">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Recent Scans */}
        <motion.div variants={itemVariants} className="dash-section">
          <div className="dash-section-head">
            <h5 className="dash-section-title">Recent Scans</h5>
          </div>

          <div className="dash-list-card">
            {isLoading ? (
              <div className="dash-empty">Loading your reports…</div>
            ) : recentScans.length === 0 ? (
              <div className="dash-empty">No scans yet. Upload your first resume to get started.</div>
            ) : (
              recentScans.map((scan) => {
                const theme = getMatchTheme(scan.score);
                return (
                  <Link to={`/report/${scan.id}`} key={scan.id} className="text-decoration-none">
                    <motion.div
                      whileHover={{ backgroundColor: '#161B22' }}
                      whileTap={{ scale: 0.99 }}
                      className="dash-list-item"
                    >
                      <div className="dash-list-left">
                        <div className="dash-list-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z" />
                          </svg>
                        </div>
                        <div className="dash-list-text">
                          <h6 className="dash-list-filename">{scan.jobProfile}</h6>
                          <small className="dash-list-time">{scan.fileName} · {formatDate(scan.scannedAt)}</small>
                        </div>
                      </div>
                      <div className="dash-list-right">
                        <span
                          className="dash-match-badge"
                          style={{ color: theme.accent, borderColor: `${theme.accent}55`, background: `${theme.accent}1A` }}
                        >
                          {scan.score ? `${scan.score}% · ${theme.tag}` : theme.tag}
                        </span>
                        <svg className="dash-chevron" xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

        .dash-page {
          position: relative;
          min-height: 100vh;
          padding-bottom: 4rem;
          background: #0A0D12;
          background-image:
            linear-gradient(rgba(240, 162, 46, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240, 162, 46, 0.045) 1px, transparent 1px);
          background-size: 34px 34px;
          font-family: 'Inter', sans-serif;
          color: #E7E9EC;
          overflow-x: hidden;
        }

        .dash-container { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; padding: 2rem 1.25rem 0; }

        .dash-heading-row { margin-bottom: 1.5rem; }
        .dash-eyebrow {
          display: block; font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #7C8592; margin-bottom: 0.5rem;
        }
        .dash-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 0.3rem; color: #E7E9EC; }
        .dash-subtitle { margin: 0; color: #7C8592; font-size: 0.9rem; }

        .dash-cta-link { text-decoration: none; display: block; margin-bottom: 1.5rem; }
        .dash-cta {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border-radius: 12px;
          padding: 1.75rem 2rem;
          background: #161B22;
          border: 1px solid #232A35;
          color: #E7E9EC;
          overflow: hidden;
          cursor: pointer;
        }
        .dash-cta-corner { position: absolute; width: 14px; height: 14px; opacity: 0.75; }
        .dash-cta-corner.tl { top: -1px; left: -1px; border-top: 2px solid #F0A22E; border-left: 2px solid #F0A22E; }
        .dash-cta-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid #F0A22E; border-right: 2px solid #F0A22E; }
        .dash-cta-top { display: flex; align-items: center; gap: 1.1rem; flex: 1; min-width: 0; position: relative; z-index: 1; }
        .dash-cta-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: rgba(240, 162, 46, 0.14);
          border: 1px solid rgba(240, 162, 46, 0.3);
          color: #F0A22E;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dash-cta-body { min-width: 0; }
        .dash-cta-eyebrow {
          display: block; font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.12em; text-transform: uppercase; color: #F0A22E; margin-bottom: 0.3rem;
        }
        .dash-cta-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 700; margin: 0 0 0.3rem; }
        .dash-cta-text { margin: 0; font-size: 0.86rem; color: #7C8592; line-height: 1.5; max-width: 420px; }
        .dash-cta-action {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #F0A22E;
          color: #14110A;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
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
          position: relative;
          background: #161B22;
          border: 1px solid #232A35;
          border-radius: 12px;
          padding: 1.4rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          transition: transform 0.2s ease;
        }
        .dash-stat-card:hover { transform: translateY(-2px); }
        .dash-stat-corner { position: absolute; width: 12px; height: 12px; opacity: 0.6; }
        .dash-stat-corner.tl { top: -1px; left: -1px; border-top: 2px solid #2DD4BF; border-left: 2px solid #2DD4BF; }
        .dash-stat-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid #2DD4BF; border-right: 2px solid #2DD4BF; }
        .dash-stat-text { display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }
        .dash-stat-label { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: #7C8592; }
        .dash-stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 1.9rem; font-weight: 700; color: #E7E9EC; display: flex; align-items: baseline; gap: 0.3rem; }
        .dash-stat-trend { font-size: 1rem; color: #2DD4BF; font-weight: 700; }
        .dash-stat-icon { width: 46px; height: 46px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid; }
        .dash-stat-icon-teal { background: rgba(45, 212, 191, 0.12); color: #2DD4BF; border-color: rgba(45, 212, 191, 0.3); }
        .dash-stat-icon-amber { background: rgba(240, 162, 46, 0.12); color: #F0A22E; border-color: rgba(240, 162, 46, 0.3); }

        .dash-section { margin-bottom: 1rem; }
        .dash-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
        .dash-section-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; font-weight: 700; color: #E7E9EC; margin: 0; }

        .dash-list-card {
          background: #161B22;
          border: 1px solid #232A35;
          border-radius: 12px;
          overflow: hidden;
        }
        .dash-empty {
          padding: 2rem 1rem; text-align: center; color: #7C8592;
          font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;
        }
        .dash-list-item { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.25rem; cursor: pointer; color: inherit; transition: background 0.15s ease; }
        .dash-list-item:not(:first-child) { border-top: 1px solid #1D232D; }
        .dash-list-left { display: flex; align-items: center; gap: 0.9rem; min-width: 0; flex: 1; }
        .dash-list-icon {
          width: 40px;
          height: 40px;
          border-radius: 9px;
          background: #1A2029;
          border: 1px solid #232A35;
          color: #7C8592;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dash-list-text { min-width: 0; }
        .dash-list-filename {
          margin: 0 0 0.15rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.92rem;
          color: #E7E9EC;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }
        .dash-list-time { font-family: 'IBM Plex Mono', monospace; font-size: 0.74rem; color: #7C8592; }
        .dash-list-right { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        .dash-match-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem; font-weight: 600;
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          border: 1px solid;
          white-space: nowrap;
        }
        .dash-chevron { color: #4B5563; display: none; flex-shrink: 0; }
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