import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const safeParseArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('JSON Parse Error on:', data);
    return typeof data === 'string' ? [data] : [];
  }
};

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
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

const ScoreGauge = ({ score, tierTheme }) => {
  const size = 168;
  const center = size / 2;
  const radius = 66;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(Number(score) || 0, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="ec-gauge-wrap">
      {clamped >= 80 && (
        <motion.span
          className="ec-gauge-pulse"
          style={{ background: tierTheme.accentSoft }}
          animate={{ scale: [1, 1.24, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--ec-gauge-track)" strokeWidth={stroke} />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={tierTheme.accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${tierTheme.accentSoft})` }}
        />
      </svg>
      <div className="ec-gauge-center">
        <span className="ec-gauge-number">
          <AnimatedNumber value={clamped} />
        </span>
        <span className="ec-gauge-suffix">/ 100</span>
      </div>
    </div>
  );
};

const getTierTheme = (score) => {
  if (score >= 80)
    return { accent: 'var(--ec-teal)', accentSoft: 'var(--ec-teal-dim)', label: 'Highly Competitive', tier: 'OPTIMAL' };
  if (score >= 60)
    return { accent: 'var(--ec-amber)', accentSoft: 'var(--ec-amber-dim)', label: 'Needs Optimization', tier: 'CAUTION' };
  return { accent: 'var(--ec-danger)', accentSoft: 'var(--ec-danger-dim)', label: 'Major Red Flags', tier: 'CRITICAL' };
};

const Report = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme: colorMode } = useTheme();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/resume/report/${id}`);
        setReport(response.data.report || response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="main-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div className="ec-spinner-lg" style={{ marginBottom: '1rem' }} />
        <p className="ec-eyebrow">Compiling Telemetry Report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="main-container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
        <span className="ec-tag neg" style={{ marginBottom: '1rem' }}>ERROR 404</span>
        <h2 className="ec-heading" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          Report Not Found
        </h2>
        <Link to="/" className="ec-btn-solid">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    const safeName = user?.name ? user.name.replace(/\s+/g, '_') : 'Candidate';
    const pdfBg = colorMode === 'light' ? '#F4F7FB' : '#0A0D12';

    const opt = {
      margin: [0.35, 0.35, 0.35, 0.35],
      filename: `${safeName}_ATS_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: pdfBg },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    setExporting(true);
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => setExporting(false));
  };

  const tierTheme = getTierTheme(report.ats_score);
  const isGeneral = !report.target_role || report.target_role.toLowerCase() === 'general application';

  const matchedSkills = safeParseArray(report.matched_skills);
  const missingSkills = safeParseArray(report.missing_skills);
  const suggestions = safeParseArray(report.suggestions);
  const topSkills = safeParseArray(report.top_skills);
  const strengths = safeParseArray(report.strengths);
  const weaknesses = safeParseArray(report.weaknesses);

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
  };

  return (
    <div className="main-container" style={{ maxWidth: '1020px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <Link to="/" className="ec-btn-ghost">
          ← Back to Dashboard
        </Link>

        <button onClick={handleExportPDF} className="ec-btn-solid" disabled={exporting}>
          {exporting ? <span className="ec-spinner" /> : '⬇'}
          <span>{exporting ? 'Exporting PDF...' : 'Export PDF'}</span>
        </button>
      </div>

      {/* Printable Report Area */}
      <motion.div id="report-content" variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
          <span className="ec-eyebrow" style={{ marginBottom: '0.35rem' }}>
            // {isGeneral ? 'General ATS Scan' : 'Targeted Job Match'}
          </span>
          <h1 className="ec-heading" style={{ fontSize: 'clamp(1.65rem, 3vw, 2.2rem)', fontWeight: 700 }}>
            Resume Evaluation Report
          </h1>
          <p className="ec-mono" style={{ color: 'var(--ec-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
            Analyzed on {report.created_at ? new Date(report.created_at).toLocaleDateString('en-IN') : 'Recent'}
          </p>
        </motion.div>

        {/* Hero Split Panel */}
        <motion.div
          variants={itemVariants}
          className="ec-panel-box ec-hero-split"
          style={{ '--ec-accent': tierTheme.accent, marginBottom: '1.5rem', pageBreakInside: 'avoid' }}
        >
          <span className="ec-corner tl" />
          <span className="ec-corner br" />

          <div className="ec-hero-score">
            <span className="ec-eyebrow" style={{ marginBottom: '1rem' }}>ATS Match Score</span>
            <ScoreGauge score={report.ats_score} tierTheme={tierTheme} />
            <div
              className="ec-mono"
              style={{
                marginTop: '1rem',
                padding: '0.38rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: tierTheme.accentSoft,
                color: tierTheme.accent,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: tierTheme.accent }} />
              {tierTheme.tier} · {tierTheme.label}
            </div>
          </div>

          <div style={{ padding: '2rem', flex: 1 }}>
            <h3 className="ec-heading" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Executive Summary
            </h3>
            <p style={{ color: 'var(--ec-text-secondary)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {report.summary}
            </p>

            <div>
              <div className="ec-stat-row">
                <span className="ec-eyebrow">Document</span>
                <span className="ec-mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  {report.file_name || report.filename || 'Resume.pdf'}
                </span>
              </div>
              {!isGeneral && (
                <div className="ec-stat-row">
                  <span className="ec-eyebrow">Target Role</span>
                  <span className="ec-mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: tierTheme.accent }}>
                    {report.target_role}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {isGeneral ? (
          <>
            <motion.div
              variants={itemVariants}
              className="ec-panel-box"
              style={{ padding: '1.75rem', marginBottom: '1.25rem', pageBreakInside: 'avoid' }}
            >
              <h4 className="ec-heading" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                Core Technical Skills Extracted
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {topSkills.map((skill, i) => (
                  <span key={i} className="ec-tag">{skill}</span>
                ))}
              </div>
            </motion.div>

            <div className="ec-two-col">
              <motion.div variants={itemVariants} className="ec-panel-box" style={{ padding: '1.75rem', pageBreakInside: 'avoid' }}>
                <span className="ec-eyebrow" style={{ color: 'var(--ec-teal)', marginBottom: '0.9rem' }}>
                  Primary Strengths
                </span>
                <ul style={{ listStyle: 'none' }}>
                  {strengths.map((str, i) => (
                    <li key={i} className="ec-list-item">
                      <span className="ec-dot" style={{ marginTop: '0.55rem', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.9rem' }}>{str}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="ec-panel-box" style={{ padding: '1.75rem', pageBreakInside: 'avoid' }}>
                <span className="ec-eyebrow" style={{ color: 'var(--ec-danger)', marginBottom: '0.9rem' }}>
                  Areas for Improvement
                </span>
                <ul style={{ listStyle: 'none' }}>
                  {weaknesses.map((weak, i) => (
                    <li key={i} className="ec-list-item">
                      <span
                        className="ec-dot"
                        style={{
                          marginTop: '0.55rem',
                          flexShrink: 0,
                          background: 'var(--ec-danger)',
                          boxShadow: '0 0 8px var(--ec-danger)',
                        }}
                      />
                      <span style={{ fontSize: '0.9rem' }}>{weak}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </>
        ) : (
          <>
            <div className="ec-two-col" style={{ marginBottom: '1.25rem' }}>
              <motion.div variants={itemVariants} className="ec-panel-box" style={{ padding: '1.75rem', pageBreakInside: 'avoid' }}>
                <span className="ec-eyebrow" style={{ color: 'var(--ec-teal)', marginBottom: '0.9rem' }}>
                  Matched Job Keywords
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {matchedSkills.length > 0 ? (
                    matchedSkills.map((s, i) => (
                      <span key={i} className="ec-tag pos">{s}</span>
                    ))
                  ) : (
                    <span className="ec-mono" style={{ color: 'var(--ec-muted)', fontSize: '0.82rem' }}>
                      No critical keywords matched perfectly.
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="ec-panel-box" style={{ padding: '1.75rem', pageBreakInside: 'avoid' }}>
                <span className="ec-eyebrow" style={{ color: 'var(--ec-danger)', marginBottom: '0.9rem' }}>
                  Missing Job Keywords
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {missingSkills.length > 0 ? (
                    missingSkills.map((s, i) => (
                      <span key={i} className="ec-tag neg">{s}</span>
                    ))
                  ) : (
                    <span className="ec-mono" style={{ color: 'var(--ec-muted)', fontSize: '0.82rem' }}>
                      Great job! No major keywords missing.
                    </span>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="ec-panel-box" style={{ padding: '1.75rem', pageBreakInside: 'avoid' }}>
              <span className="ec-eyebrow" style={{ color: 'var(--ec-amber)', marginBottom: '0.9rem' }}>
                Actionable Recommendations
              </span>
              <ul style={{ listStyle: 'none' }}>
                {suggestions.length > 0 ? (
                  suggestions.map((s, i) => (
                    <li key={i} className="ec-list-item">
                      <span className="ec-mono" style={{ color: 'var(--ec-amber)', fontSize: '0.76rem', fontWeight: 600, width: '28px', flexShrink: 0 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{s}</span>
                    </li>
                  ))
                ) : (
                  <li className="ec-mono" style={{ color: 'var(--ec-muted)', fontSize: '0.85rem' }}>
                    Your resume looks well optimized for this role!
                  </li>
                )}
              </ul>
            </motion.div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p className="ec-eyebrow">NovusCV · AI Analysis Engine</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Report;