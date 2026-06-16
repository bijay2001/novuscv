import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { useAuth } from '../context/AuthContext';

// --- 1. Animated Number Counter ---
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

// --- 2. Score Gauge ---
const ScoreGauge = ({ score, theme }) => {
  const size = 164;
  const center = size / 2;
  const radius = 64;
  const stroke = 11;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;
  const gradientId = `gaugeGradient-${theme.id}`;

  return (
    <div className="ats-gauge-wrap">
      {score >= 80 && (
        <motion.span
          className="ats-gauge-pulse"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.ring[0]} />
            <stop offset="100%" stopColor={theme.ring[1]} />
          </linearGradient>
        </defs>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={stroke} />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="ats-gauge-center">
        <span className="ats-gauge-number">
          <AnimatedNumber value={score} />
        </span>
        <span className="ats-gauge-suffix">/ 100</span>
      </div>
    </div>
  );
};

// --- 3. Theme Generator ---
const getTheme = (score) => {
  if (score >= 80) {
    return {
      id: 'high',
      gradient: 'linear-gradient(145deg, #047857 0%, #10b981 60%, #34d399 100%)',
      ring: ['#a7f3d0', '#ffffff'],
      label: 'Highly Competitive',
      icon: '🏆',
    };
  }
  if (score >= 60) {
    return {
      id: 'mid',
      gradient: 'linear-gradient(145deg, #b45309 0%, #f59e0b 60%, #fbbf24 100%)',
      ring: ['#fde68a', '#ffffff'],
      label: 'Needs Optimization',
      icon: '⚠️',
    };
  }
  return {
    id: 'low',
    gradient: 'linear-gradient(145deg, #9f1239 0%, #f43f5e 60%, #fb7185 100%)',
    ring: ['#fecdd3', '#ffffff'],
    label: 'Major Red Flags',
    icon: '🚨',
  };
};

// --- 4. Main Report Component ---
const Report = () => {
  const location = useLocation();
  const report = location.state?.report;
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);

  if (!report) {
    return <Navigate to="/" replace />;
  }

  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    const dateStr = new Date().toISOString().split('T')[0];
    const safeName = user?.name ? user.name.replace(/\s+/g, '_') : 'Candidate';
    const dynamicFilename = `${safeName}_ATS_Report_${dateStr}.pdf`;

    const opt = {
      margin: [0.4, 0.4, 0.4, 0.4],
      filename: dynamicFilename,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    setExporting(true);
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => setExporting(false))
      .catch(() => setExporting(false));
  };

  const theme = getTheme(report.atsScore);
  const generatedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
  };

  return (
    <div className="ats-page">
      <span className="ats-blob ats-blob-1" />
      <span className="ats-blob ats-blob-2" />

      {/* Top Nav (excluded from PDF export) */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="ats-nav"
      >
        <div className="ats-nav-inner">
          <Link to="/" className="ats-back-link">
            <span className="ats-back-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
            </span>
            Back to Dashboard
          </Link>

          <div className="ats-nav-right">
            <span className="ats-status-pill">
              <span className="ats-status-dot" />
              Analysis complete
            </span>
            <button onClick={handleExportPDF} className="ats-export-btn" disabled={exporting}>
              {exporting ? (
                <span className="ats-spinner" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
              )}
              {exporting ? 'Exporting…' : 'Export PDF'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Report Content (captured for PDF) */}
      <motion.div
        id="report-content"
        className="ats-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="ats-heading-row">
          <div>
            <span className="ats-eyebrow">ATS Report</span>
            <h2 className="ats-title">Resume Evaluation</h2>
            <p className="ats-subtitle">
              Detailed breakdown of {user?.name ? `${user.name}'s` : 'your'} resume performance.
            </p>
          </div>
          <span className="ats-generated-on">Generated {generatedOn}</span>
        </motion.div>

        {/* Hero: score + summary in one compact split card */}
        <motion.div variants={itemVariants} className="ats-hero" style={{ pageBreakInside: 'avoid' }}>
          <div className="ats-hero-score" style={{ background: theme.gradient }}>
            <span className="ats-hero-score-label">Match score</span>
            <ScoreGauge score={report.atsScore} theme={theme} />
            <span className="ats-badge-pill">
              <span>{theme.icon}</span> {theme.label}
            </span>
          </div>

          <div className="ats-hero-body">
            <div className="ats-hero-body-head">
              <span className="ats-icon-chip ats-icon-chip-indigo">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                </svg>
              </span>
              <h4 className="ats-section-title">AI executive summary</h4>
            </div>

            <p className="ats-summary-text">{report.summary}</p>

            <div className="ats-divider" />

            <span className="ats-label-small">Extracted keywords</span>
            <div className="ats-chip-row">
              {report.topSkills.map((skill, idx) => (
                <span key={idx} className="ats-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Strengths + Weaknesses */}
        <div className="ats-findings-grid">
          <motion.div variants={itemVariants} className="ats-finding-card" style={{ pageBreakInside: 'avoid' }}>
            <div className="ats-finding-head">
              <span className="ats-icon-chip ats-icon-chip-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                </svg>
              </span>
              <h5 className="ats-finding-title ats-finding-title-success">Core strengths</h5>
            </div>
            <ul className="ats-finding-list">
              {report.strengths.map((strength, idx) => (
                <li key={idx} className="ats-finding-item" style={{ pageBreakInside: 'avoid' }}>
                  <span className="ats-finding-dot ats-finding-dot-success">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="ats-finding-card" style={{ pageBreakInside: 'avoid' }}>
            <div className="ats-finding-head">
              <span className="ats-icon-chip ats-icon-chip-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </span>
              <h5 className="ats-finding-title ats-finding-title-danger">Critical findings</h5>
            </div>
            <ul className="ats-finding-list">
              {report.weaknesses.map((weakness, idx) => (
                <li key={idx} className="ats-finding-item" style={{ pageBreakInside: 'avoid' }}>
                  <span className="ats-finding-dot ats-finding-dot-danger">✕</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <p className="ats-footer-note">
          This report was generated automatically and is intended as a guide, not a guarantee of hiring outcomes.
        </p>
      </motion.div>

      <style>{`
        .ats-page {
          position: relative;
          min-height: 100vh;
          padding-bottom: 4rem;
          background: #f6f7fb;
          font-family: 'Inter', sans-serif;
          color: #0f172a;
          overflow-x: hidden;
        }

        .ats-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.35;
          z-index: 0;
          pointer-events: none;
          animation: ats-float 16s ease-in-out infinite;
        }
        .ats-blob-1 { width: 320px; height: 320px; top: -120px; left: -100px; background: #c7d2fe; }
        .ats-blob-2 { width: 360px; height: 360px; top: 280px; right: -140px; background: #a7f3d0; animation-delay: -6s; }
        @keyframes ats-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(24px, -28px); }
        }

        .ats-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          padding: 0.85rem 1.25rem;
        }
        .ats-nav-inner {
          max-width: 1040px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .ats-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          color: #0f172a;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
        }
        .ats-back-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #f1f2f7;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .ats-back-link:hover .ats-back-icon { background: #e0e3f5; transform: translateX(-2px); }

        .ats-nav-right { display: flex; align-items: center; gap: 0.9rem; }
        .ats-status-pill { display: none; align-items: center; gap: 0.45rem; font-size: 0.82rem; font-weight: 600; color: #4338ca; }
        @media (min-width: 576px) { .ats-status-pill { display: inline-flex; } }
        .ats-status-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #10b981;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55);
          animation: ats-pulse-dot 2s infinite;
        }
        @keyframes ats-pulse-dot {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .ats-export-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          border-radius: 999px;
          padding: 0.55rem 1.2rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #4f46e5, #4338ca);
          box-shadow: 0 10px 22px -8px rgba(79, 70, 229, 0.6);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .ats-export-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px -8px rgba(79, 70, 229, 0.65); }
        .ats-export-btn:active:not(:disabled) { transform: translateY(0); }
        .ats-export-btn:disabled { opacity: 0.75; cursor: default; }
        .ats-spinner {
          width: 13px; height: 13px; border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          animation: ats-spin 0.7s linear infinite;
        }
        @keyframes ats-spin { to { transform: rotate(360deg); } }

        .ats-container { position: relative; z-index: 1; max-width: 1040px; margin: 0 auto; padding: 2rem 1.25rem 0; }

        .ats-heading-row { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
        .ats-eyebrow { display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #4f46e5; margin-bottom: 0.35rem; }
        .ats-title { font-size: 1.7rem; font-weight: 800; margin: 0 0 0.2rem; color: #0f172a; }
        .ats-subtitle { margin: 0; color: #5b6478; font-size: 0.92rem; }
        .ats-generated-on { font-size: 0.78rem; color: #94a0b8; font-weight: 500; }

        .ats-hero {
          display: flex;
          border-radius: 1.4rem;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.06);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 24px 48px -28px rgba(15, 23, 42, 0.25);
          background: #fff;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 768px) {
          .ats-hero { flex-direction: column; }
          .ats-hero-score { flex: none; }
        }
        .ats-hero-score {
          flex: 0 0 260px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #fff;
          position: relative;
        }
        .ats-hero-score-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; margin-bottom: 0.9rem; }
        .ats-badge-pill {
          margin-top: 0.6rem;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 999px;
          padding: 0.4rem 1rem;
          font-weight: 700;
          font-size: 0.82rem;
        }

        .ats-hero-body { flex: 1; padding: 1.75rem 2rem; display: flex; flex-direction: column; min-width: 0; }
        .ats-hero-body-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.9rem; }
        .ats-icon-chip { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ats-icon-chip-indigo { background: #eef2ff; color: #4f46e5; }
        .ats-icon-chip-success { background: #ecfdf5; color: #059669; }
        .ats-icon-chip-danger { background: #fff1f2; color: #e11d48; }

        .ats-section-title { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0; }
        .ats-summary-text { font-size: 0.94rem; line-height: 1.65; color: #475569; margin: 0 0 1.25rem; }
        .ats-divider { height: 1px; background: rgba(15, 23, 42, 0.07); margin-bottom: 1.1rem; }
        .ats-label-small { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a0b8; margin-bottom: 0.65rem; }
        .ats-chip-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .ats-chip {
          background: #eef2ff;
          color: #4338ca;
          border: 1px solid rgba(79, 70, 229, 0.18);
          border-radius: 999px;
          padding: 0.32rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 600;
          transition: transform 0.18s ease;
        }
        .ats-chip:hover { transform: translateY(-2px); }

        .ats-findings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
        @media (max-width: 768px) { .ats-findings-grid { grid-template-columns: 1fr; } }
        .ats-finding-card {
          border-radius: 1.25rem;
          border: 1px solid rgba(15, 23, 42, 0.06);
          background: #fff;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 18px 36px -24px rgba(15, 23, 42, 0.2);
          overflow: hidden;
        }
        .ats-finding-head { display: flex; align-items: center; gap: 0.7rem; padding: 1.1rem 1.3rem 0.7rem; }
        .ats-finding-title { font-size: 0.98rem; font-weight: 700; margin: 0; }
        .ats-finding-title-success { color: #059669; }
        .ats-finding-title-danger { color: #e11d48; }
        .ats-finding-list { list-style: none; margin: 0; padding: 0.3rem 0.85rem 1.1rem; }
        .ats-finding-item {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
          padding: 0.6rem 0.65rem;
          border-radius: 0.85rem;
          font-size: 0.87rem;
          line-height: 1.55;
          color: #374151;
          font-weight: 500;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .ats-finding-item:hover { background: #f6f7fb; transform: translateX(3px); }
        .ats-finding-dot {
          width: 19px; height: 19px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px; font-size: 0.62rem; font-weight: 700; color: #fff;
        }
        .ats-finding-dot-success { background: #10b981; }
        .ats-finding-dot-danger { background: #f43f5e; }

        .ats-footer-note { text-align: center; font-size: 0.78rem; color: #9aa3b8; margin: 2rem 0 0; }

        .ats-gauge-wrap { position: relative; width: 164px; height: 164px; display: flex; align-items: center; justify-content: center; }
        .ats-gauge-pulse { position: absolute; inset: -8px; border-radius: 50%; background: rgba(255, 255, 255, 0.55); }
        .ats-gauge-center { position: absolute; display: flex; flex-direction: column; align-items: center; }
        .ats-gauge-number { font-size: 2.5rem; font-weight: 800; line-height: 1; }
        .ats-gauge-suffix { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; opacity: 0.85; margin-top: 0.15rem; }

        @media (max-width: 480px) {
          .ats-title { font-size: 1.4rem; }
          .ats-hero-score { padding: 1.75rem 1.25rem; }
          .ats-hero-body { padding: 1.5rem 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default Report;