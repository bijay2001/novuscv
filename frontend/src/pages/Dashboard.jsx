import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [totalScans, setTotalScans] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/resume/dashboard');
        if (data?.success && data?.stats) {
          setTotalScans(Number(data.stats.totalScans) || 0);
          setAvgScore(Number(data.stats.avgScore) || 0);
          setRecentScans(Array.isArray(data.stats.recentScans) ? data.stats.recentScans : []);
        }
      } catch (err) {
        console.error('Failed to load dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const highestScore = useMemo(() => {
    if (!recentScans.length) return 0;
    return Math.max(...recentScans.map((r) => Number(r.score || 0)));
  }, [recentScans]);

  const filteredScans = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return recentScans;
    return recentScans.filter(
      (r) =>
        (r.fileName || '').toLowerCase().includes(q) ||
        (r.jobProfile || '').toLowerCase().includes(q)
    );
  }, [recentScans, searchQuery]);

  const getBadgeVariant = (score) => {
    if (score >= 80) return '';
    if (score >= 60) return 'amber';
    return 'danger';
  };

  return (
    <div className="main-container">
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <span className="ec-eyebrow" style={{ marginBottom: '0.4rem' }}>
            // Command Center
          </span>
          <h1 className="ec-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 700 }}>
            Welcome back, <span style={{ color: 'var(--ec-amber)' }}>{user?.name || 'Engineer'}</span>
          </h1>
          <p style={{ color: 'var(--ec-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Monitor your latest ATS evaluations and keyword alignment telemetry.
          </p>
        </div>

        <Link to="/upload" className="ec-btn-solid">
          + New Resume Scan
        </Link>
      </div>

      {/* Telemetry KPI Grid */}
      <div className="ec-stats-grid">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="ec-card"
          style={{ padding: '1.5rem' }}
        >
          <span className="ec-corner tl" />
          <span className="ec-eyebrow">Total Evaluations</span>
          <div className="ec-heading" style={{ fontSize: '2.4rem', fontWeight: 700, marginTop: '0.4rem' }}>
            {totalScans}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="ec-card"
          style={{ padding: '1.5rem', '--ec-accent': 'var(--ec-amber)' }}
        >
          <span className="ec-corner tl" />
          <span className="ec-eyebrow">Average Match Index</span>
          <div
            className="ec-heading"
            style={{ fontSize: '2.4rem', fontWeight: 700, marginTop: '0.4rem', color: 'var(--ec-amber)' }}
          >
            {avgScore}%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
          className="ec-card"
          style={{ padding: '1.5rem', '--ec-accent': 'var(--ec-teal)' }}
        >
          <span className="ec-corner tl" />
          <span className="ec-eyebrow">Peak Recent Score</span>
          <div
            className="ec-heading"
            style={{ fontSize: '2.4rem', fontWeight: 700, marginTop: '0.4rem', color: 'var(--ec-teal)' }}
          >
            {highestScore}%
          </div>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <span className="ec-eyebrow">// Recent Evaluations (Last 5 Scans)</span>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <input
            type="search"
            className="ec-input"
            placeholder="Filter by file name or job profile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="ec-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <div className="ec-spinner-lg" style={{ margin: '0 auto 1rem' }} />
          <span className="ec-eyebrow">Fetching Telemetry Logs...</span>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="ec-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <span className="ec-eyebrow" style={{ marginBottom: '0.5rem' }}>// Empty Workspace</span>
          <h3 className="ec-heading" style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            {recentScans.length === 0 ? 'No resume scans recorded yet' : 'No matching scans found'}
          </h3>
          <p style={{ color: 'var(--ec-muted)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
            Upload your PDF or DOCX resume to generate a full ATS compatibility breakdown.
          </p>
          <Link to="/upload" className="ec-btn-solid">
            Run First ATS Scan
          </Link>
        </div>
      ) : (
        <div className="ec-bento-grid">
          {filteredScans.map((item, idx) => {
            const score = Number(item.score || 0);
            const isGeneral = !item.jobProfile || item.jobProfile.toLowerCase() === 'general application';

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="ec-card interactive"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <span className="ec-eyebrow" style={{ fontSize: '0.62rem', marginBottom: '0.25rem' }}>
                        {isGeneral ? '// GENERAL SCAN' : '// TARGETED MATCH'}
                      </span>
                      <h3
                        className="ec-heading"
                        style={{
                          fontSize: '1.08rem',
                          fontWeight: 700,
                          marginBottom: '0.25rem',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.fileName || 'Resume.pdf'}
                      </h3>
                      <span className="ec-mono" style={{ fontSize: '0.76rem', color: 'var(--ec-muted)' }}>
                        Role: {item.jobProfile || 'General Application'}
                      </span>
                    </div>

                    <span className={`ec-badge ${getBadgeVariant(score)}`} style={{ flexShrink: 0, fontSize: '0.76rem' }}>
                      {score}%
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--ec-border-soft)',
                    paddingTop: '0.9rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <span className="ec-mono" style={{ fontSize: '0.74rem', color: 'var(--ec-muted)' }}>
                    {item.scannedAt ? new Date(item.scannedAt).toLocaleDateString('en-IN') : 'Recent'}
                  </span>
                  <Link
                    to={`/report/${item.id}`}
                    className="ec-btn-ghost"
                    style={{ padding: '0.38rem 0.85rem', fontSize: '0.72rem' }}
                  >
                    Inspect Report →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;