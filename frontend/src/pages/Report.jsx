import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// --- 1. Safe JSON Parser ---
// This prevents crashes if the DB driver already parsed the array
const safeParseArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data; // Already an array, safe to use
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("JSON Parse Error on:", data);
    return typeof data === 'string' ? [data] : [];
  }
};

// --- 2. Animated Number Counter ---
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const numValue = Number(value) || 0;
    if (numValue === 0) return setDisplayValue(0);

    const increment = numValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numValue) { setDisplayValue(numValue); clearInterval(timer); }
      else { setDisplayValue(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{displayValue}</>;
};

// --- 3. Score Gauge (flat instrument dial) ---
const ScoreGauge = ({ score, theme }) => {
  const size = 168;
  const center = size / 2;
  const radius = 66;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="ec-gauge-wrap">
      {score >= 80 && (
        <motion.span
          className="ec-gauge-pulse"
          style={{ background: theme.accentSoft }}
          animate={{ scale: [1, 1.28, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <motion.circle
          cx={center} cy={center} r={radius} fill="none"
          stroke={theme.accent}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${theme.accentSoft})` }}
        />
      </svg>
      <div className="ec-gauge-center">
        <span className="ec-gauge-number"><AnimatedNumber value={score} /></span>
        <span className="ec-gauge-suffix">/ 100</span>
      </div>
    </div>
  );
};

// --- 4. Themes (tiered console signal colors) ---
const getTheme = (score) => {
  if (score >= 80) return { accent: '#2DD4BF', accentSoft: 'rgba(45, 212, 191, 0.16)', label: 'Highly Competitive', tier: 'OPTIMAL' };
  if (score >= 60) return { accent: '#F0A22E', accentSoft: 'rgba(240, 162, 46, 0.16)', label: 'Needs Optimization', tier: 'CAUTION' };
  return { accent: '#EF4444', accentSoft: 'rgba(239, 68, 68, 0.16)', label: 'Major Red Flags', tier: 'CRITICAL' };
};

// --- 5. Main Component ---
const Report = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/resume/report/${id}`);
        setReport(response.data.report);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchReport();
  }, [id]);

  const consoleStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

    .ec-root {
      --ec-bg: #0A0D12;
      --ec-panel: #12161C;
      --ec-panel-alt: #161B22;
      --ec-surface: #1A2029;
      --ec-border: #232A35;
      --ec-border-soft: #1D232D;
      --ec-amber: #F0A22E;
      --ec-teal: #2DD4BF;
      --ec-danger: #EF4444;
      --ec-text: #E7E9EC;
      --ec-muted: #7C8592;
      --ec-muted-2: #4B5563;
      background: var(--ec-bg);
      min-height: 100%;
    }
    .ec-body { font-family: 'Inter', sans-serif; color: var(--ec-text); }
    .ec-heading { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; color: var(--ec-text); }
    .ec-mono { font-family: 'IBM Plex Mono', SFMono-Regular, monospace; }

    .ec-grid-bg {
      background-image:
        linear-gradient(rgba(240, 162, 46, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(240, 162, 46, 0.04) 1px, transparent 1px);
      background-size: 34px 34px;
      background-position: -1px -1px;
    }

    .ec-panel-box {
      background: var(--ec-panel-alt);
      border: 1px solid var(--ec-border);
      border-radius: 8px;
      position: relative;
    }
    .ec-corner { position: absolute; width: 14px; height: 14px; opacity: 0.7; }
    .ec-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--ec-accent, var(--ec-amber)); border-left: 2px solid var(--ec-accent, var(--ec-amber)); }
    .ec-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--ec-accent, var(--ec-amber)); border-right: 2px solid var(--ec-accent, var(--ec-amber)); }

    .ec-eyebrow {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.68rem;
      letter-spacing: 0.14em;
      color: var(--ec-muted);
      font-weight: 500;
      text-transform: uppercase;
    }

    .ec-tier-badge {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.08em;
      font-weight: 600;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .ec-tier-dot { width: 6px; height: 6px; border-radius: 50%; }

    .ec-gauge-wrap { position: relative; display: flex; align-items: center; justify-content: center; width: 168px; height: 168px; }
    .ec-gauge-center { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 2; }
    .ec-gauge-number { font-family: 'Space Grotesk', sans-serif; font-size: 2.6rem; font-weight: 700; line-height: 1; letter-spacing: -1px; color: var(--ec-text); }
    .ec-gauge-suffix { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: var(--ec-muted); margin-top: 2px; }
    .ec-gauge-pulse { position: absolute; inset: -14px; border-radius: 50%; z-index: 0; }

    .ec-stat-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      padding: 0.7rem 0;
      border-bottom: 1px solid var(--ec-border-soft);
      font-size: 0.85rem;
    }
    .ec-stat-row:last-child { border-bottom: none; }

    .ec-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.03em;
      padding: 0.4rem 0.8rem;
      border-radius: 5px;
      border: 1px solid var(--ec-border);
      background: var(--ec-surface);
      color: var(--ec-text);
      display: inline-block;
    }
    .ec-tag.pos { border-color: rgba(45, 212, 191, 0.35); background: rgba(45, 212, 191, 0.08); color: var(--ec-teal); }
    .ec-tag.neg { border-color: rgba(239, 68, 68, 0.35); background: rgba(239, 68, 68, 0.08); color: var(--ec-danger); }

    .ec-list-item { display: flex; gap: 0.8rem; align-items: flex-start; padding: 0.65rem 0; border-bottom: 1px solid var(--ec-border-soft); }
    .ec-list-item:last-child { border-bottom: none; }
    .ec-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 0.5rem; flex-shrink: 0; }

    .ec-index {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.68rem;
      color: var(--ec-muted);
      flex-shrink: 0;
      width: 28px;
    }

    .ec-btn-ghost {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      font-weight: 500;
      color: var(--ec-text);
      background: var(--ec-panel-alt);
      border: 1px solid var(--ec-border);
      border-radius: 999px;
      padding: 0.55rem 1.1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      text-decoration: none;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .ec-btn-ghost:hover { border-color: var(--ec-muted); color: var(--ec-text); background: var(--ec-surface); }

    .ec-btn-solid {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      font-weight: 600;
      text-transform: uppercase;
      color: #14110A;
      background: var(--ec-amber);
      border: none;
      border-radius: 999px;
      padding: 0.6rem 1.3rem;
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      transition: box-shadow 0.2s ease, transform 0.15s ease;
    }
    .ec-btn-solid:hover:not(:disabled) { box-shadow: 0 8px 22px -8px rgba(240, 162, 46, 0.55); }
    .ec-btn-solid:active:not(:disabled) { transform: translateY(1px); }
    .ec-btn-solid:disabled { background: #3A3F47; color: var(--ec-muted); cursor: not-allowed; }

    .ec-spinner {
      width: 13px; height: 13px; border-radius: 50%;
      border: 2px solid rgba(0,0,0,0.2); border-top-color: #14110A;
      animation: ec-spin 0.7s linear infinite;
    }
    .ec-spinner-light {
      width: 22px; height: 22px; border-radius: 50%;
      border: 2px solid rgba(240,162,46,0.2); border-top-color: var(--ec-amber);
      animation: ec-spin 0.7s linear infinite;
    }
    @keyframes ec-spin { to { transform: rotate(360deg); } }

    @media (prefers-reduced-motion: reduce) {
      .ec-spinner, .ec-spinner-light { animation: none; }
    }

    @media (max-width: 767.98px) {
      .ec-hero-split { flex-direction: column; }
      .ec-hero-score { flex: 0 0 auto !important; width: 100%; }
    }
  `;

  if (loading) {
    return (
      <div className="ec-root ec-grid-bg min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <style>{consoleStyles}</style>
        <div className="ec-spinner-light mb-3" />
        <p className="ec-eyebrow mb-0">Loading Report</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="ec-root ec-grid-bg min-vh-100 d-flex flex-column align-items-center justify-content-center px-3">
        <style>{consoleStyles}</style>
        <span className="ec-tag neg mb-3">ERROR 404</span>
        <h4 className="ec-heading fw-bold mb-4" style={{ color: '#E7E9EC' }}>Report not found</h4>
        <Link to="/" className="ec-btn-solid text-decoration-none">Back to Dashboard</Link>
      </div>
    );
  }

  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    const safeName = user?.name ? user.name.replace(/\s+/g, '_') : 'Candidate';
    const opt = {
      margin: [0.4, 0.4, 0.4, 0.4],
      filename: `${safeName}_ATS_Report.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0A0D12' },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    setExporting(true);
    html2pdf().set(opt).from(element).save().then(() => setExporting(false));
  };

  const theme = getTheme(report.ats_score);
  const isGeneral = !report.target_role || report.target_role.toLowerCase() === 'general application';

  // Safely parse all arrays
  const matchedSkills = safeParseArray(report.matched_skills);
  const missingSkills = safeParseArray(report.missing_skills);
  const suggestions = safeParseArray(report.suggestions);
  const topSkills = safeParseArray(report.top_skills);
  const strengths = safeParseArray(report.strengths);
  const weaknesses = safeParseArray(report.weaknesses);

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } } };

  return (
    <div className="ec-root ec-grid-bg ec-body position-relative min-vh-100 pb-5" style={{ overflowX: 'hidden' }}>
      <style>{consoleStyles}</style>

      <div className="container position-relative pt-4" style={{ maxWidth: '1000px' }}>

        {/* Action Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <Link to="/" className="ec-btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
            Back
          </Link>
          <button onClick={handleExportPDF} className="ec-btn-solid" disabled={exporting}>
            {exporting ? <span className="ec-spinner" /> : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>}
            {exporting ? 'Exporting' : 'Export PDF'}
          </button>
        </div>

        {/* Printable Area Starts */}
        <motion.div
          id="report-content"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ background: 'var(--ec-bg)' }}
        >

          <motion.div variants={itemVariants} className="mb-4">
            <span className="ec-eyebrow d-inline-block mb-2">
              // {isGeneral ? 'General ATS Scan' : 'Targeted Job Match'}
            </span>
            <h1 className="ec-heading fw-bold mb-1" style={{ fontSize: '2rem' }}>Resume Evaluation</h1>
            <p className="ec-mono" style={{ color: 'var(--ec-muted)', fontSize: '0.8rem' }}>
              Analyzed on {new Date(report.created_at).toLocaleDateString()}
            </p>
          </motion.div>

          {/* Hero Split Panel */}
          <motion.div
            variants={itemVariants}
            className="ec-panel-box d-flex ec-hero-split mb-4 overflow-hidden"
            style={{ '--ec-accent': theme.accent, pageBreakInside: 'avoid' }}
          >
            <span className="ec-corner tl" />
            <span className="ec-corner br" />

            {/* Score Side */}
            <div
              className="ec-hero-score p-4 p-md-5 d-flex flex-column align-items-center justify-content-center text-center"
              style={{ flex: '0 0 300px', borderRight: '1px solid var(--ec-border)', background: 'var(--ec-panel)' }}
            >
              <span className="ec-eyebrow mb-4">ATS Match Score</span>
              <ScoreGauge score={report.ats_score} theme={theme} />
              <div
                className="ec-tier-badge mt-4"
                style={{ background: theme.accentSoft, color: theme.accent, border: `1px solid ${theme.accent}55` }}
              >
                <span className="ec-tier-dot" style={{ background: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }} />
                {theme.tier} · {theme.label}
              </div>
            </div>

            {/* Summary Side */}
            <div className="p-4 p-md-5 flex-grow-1">
              <h5 className="ec-heading fw-bold mb-3" style={{ fontSize: '1.15rem' }}>Executive Summary</h5>
              <p style={{ color: 'var(--ec-muted)', fontSize: '0.92rem', lineHeight: 1.7 }} className="mb-4">
                {report.summary}
              </p>

              <div>
                <div className="ec-stat-row">
                  <span className="ec-eyebrow">Document</span>
                  <span className="ec-mono fw-semibold text-end" style={{ fontSize: '0.82rem' }}>{report.file_name}</span>
                </div>
                {!isGeneral && (
                  <div className="ec-stat-row">
                    <span className="ec-eyebrow">Target Role</span>
                    <span className="ec-mono fw-semibold text-end" style={{ fontSize: '0.82rem', color: theme.accent }}>{report.target_role}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Dynamic Content Based on Scan Type */}
          {isGeneral ? (
            // ================= GENERAL VIEW =================
            <>
              {/* Top Skills */}
              <motion.div variants={itemVariants} className="ec-panel-box p-4 p-md-5 mb-4" style={{ pageBreakInside: 'avoid' }}>
                <h5 className="ec-heading fw-bold mb-3" style={{ fontSize: '1.05rem' }}>Core Technical Skills Extracted</h5>
                <div className="d-flex flex-wrap gap-2">
                  {topSkills.map((skill, i) => (
                    <span key={i} className="ec-tag">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <div className="row g-4">
                {/* Strengths */}
                <div className="col-md-6">
                  <motion.div variants={itemVariants} className="ec-panel-box p-4 p-md-5 h-100" style={{ pageBreakInside: 'avoid' }}>
                    <span className="ec-eyebrow d-block mb-3">Primary Strengths</span>
                    <ul className="list-unstyled mb-0">
                      {strengths.map((str, i) => (
                        <li key={i} className="ec-list-item">
                          <span className="ec-dot" style={{ background: 'var(--ec-teal)' }} />
                          <span style={{ fontSize: '0.88rem', color: 'var(--ec-text)' }}>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Weaknesses */}
                <div className="col-md-6">
                  <motion.div variants={itemVariants} className="ec-panel-box p-4 p-md-5 h-100" style={{ pageBreakInside: 'avoid' }}>
                    <span className="ec-eyebrow d-block mb-3">Areas for Improvement</span>
                    <ul className="list-unstyled mb-0">
                      {weaknesses.map((weak, i) => (
                        <li key={i} className="ec-list-item">
                          <span className="ec-dot" style={{ background: 'var(--ec-danger)' }} />
                          <span style={{ fontSize: '0.88rem', color: 'var(--ec-text)' }}>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </>
          ) : (
            // ================= TARGETED VIEW =================
            <>
              <div className="row g-4 mb-4">
                {/* Matched Skills */}
                <div className="col-md-6">
                  <motion.div variants={itemVariants} className="ec-panel-box p-4 p-md-5 h-100" style={{ pageBreakInside: 'avoid' }}>
                    <span className="ec-eyebrow d-block mb-3" style={{ color: 'var(--ec-teal)' }}>Matched Job Keywords</span>
                    <div className="d-flex flex-wrap gap-2">
                      {matchedSkills.length > 0 ? matchedSkills.map((s, i) => (
                        <span key={i} className="ec-tag pos">{s}</span>
                      )) : <span className="ec-mono" style={{ color: 'var(--ec-muted)', fontSize: '0.8rem' }}>No critical keywords matched perfectly.</span>}
                    </div>
                  </motion.div>
                </div>

                {/* Missing Skills */}
                <div className="col-md-6">
                  <motion.div variants={itemVariants} className="ec-panel-box p-4 p-md-5 h-100" style={{ pageBreakInside: 'avoid' }}>
                    <span className="ec-eyebrow d-block mb-3" style={{ color: 'var(--ec-danger)' }}>Missing Job Keywords</span>
                    <div className="d-flex flex-wrap gap-2">
                      {missingSkills.length > 0 ? missingSkills.map((s, i) => (
                        <span key={i} className="ec-tag neg">{s}</span>
                      )) : <span className="ec-mono" style={{ color: 'var(--ec-muted)', fontSize: '0.8rem' }}>Great job! No major keywords missing.</span>}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Suggestions */}
              <motion.div variants={itemVariants} className="ec-panel-box p-4 p-md-5" style={{ pageBreakInside: 'avoid' }}>
                <span className="ec-eyebrow d-block mb-3" style={{ color: 'var(--ec-amber)' }}>Actionable Recommendations</span>
                <ul className="list-unstyled mb-0">
                  {suggestions.length > 0 ? suggestions.map((s, i) => (
                    <li key={i} className="ec-list-item">
                      <span className="ec-index">{String(i + 1).padStart(2, '0')}</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--ec-text)', lineHeight: 1.6 }}>{s}</span>
                    </li>
                  )) : <li className="ec-mono" style={{ color: 'var(--ec-muted)', fontSize: '0.85rem' }}>Your resume looks perfectly optimized for this role!</li>}
                </ul>
              </motion.div>
            </>
          )}

          <div className="text-center mt-5">
            <p className="ec-eyebrow mb-0">NovusCV · AI Analysis Engine</p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Report;