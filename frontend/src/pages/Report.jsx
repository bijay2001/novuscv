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

// --- 3. Score Gauge ---
const ScoreGauge = ({ score, theme }) => {
  const size = 164;
  const center = size / 2;
  const radius = 64;
  const stroke = 11;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;
  
  return (
    <div className="ats-gauge-wrap">
      {score >= 80 && (
        <motion.span
          className="ats-gauge-pulse"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={stroke} />
        <motion.circle
          cx={center} cy={center} r={radius} fill="none"
          stroke={theme.ring[1]}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="ats-gauge-center">
        <span className="ats-gauge-number text-dark"><AnimatedNumber value={score} /></span>
        <span className="ats-gauge-suffix fw-bold">/ 100</span>
      </div>
    </div>
  );
};

// --- 4. Themes ---
const getTheme = (score) => {
  if (score >= 80) return { ring: ['#a7f3d0', '#10b981'], bg: 'linear-gradient(135deg, #047857 0%, #10b981 100%)', label: 'Highly Competitive', icon: '🏆' };
  if (score >= 60) return { ring: ['#fde68a', '#f59e0b'], bg: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)', label: 'Needs Optimization', icon: '⚠️' };
  return { ring: ['#fecdd3', '#f43f5e'], bg: 'linear-gradient(135deg, #9f1239 0%, #f43f5e 100%)', label: 'Major Red Flags', icon: '🚨' };
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

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#f4f7f6' }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 fw-bold text-secondary">Loading Report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#f4f7f6' }}>
        <h4 className="text-danger fw-bold mb-3">Report not found</h4>
        <Link to="/" className="btn btn-primary rounded-pill px-4">Back to Dashboard</Link>
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
      html2canvas: { scale: 2, useCORS: true },
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

  const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <div className="position-relative min-vh-100 pb-5" style={{ backgroundColor: '#f8fafc', overflowX: 'hidden' }}>
      {/* Background Blobs */}
      <div className="position-absolute top-0 start-0 bg-primary opacity-10 rounded-circle" style={{ width: '400px', height: '400px', filter: 'blur(80px)', transform: 'translate(-30%, -30%)' }}></div>
      <div className="position-absolute top-50 end-0 bg-success opacity-10 rounded-circle" style={{ width: '300px', height: '300px', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }}></div>

      <div className="container position-relative z-1 pt-4" style={{ maxWidth: '1000px' }}>
        
        {/* Action Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/" className="text-decoration-none text-dark fw-bold d-flex align-items-center gap-2 transition-all hover-primary">
            <div className="bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>
            </div>
            Back
          </Link>
          <button onClick={handleExportPDF} className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2" disabled={exporting}>
            {exporting ? <span className="spinner-border spinner-border-sm"></span> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>

        {/* Printable Area Starts */}
        <motion.div id="report-content" variants={containerVariants} initial="hidden" animate="show" className="bg-transparent p-1">
          
          <motion.div variants={itemVariants} className="mb-4">
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill mb-2 fw-bold text-uppercase tracking-wide">
              {isGeneral ? 'General ATS Scan' : 'Targeted Job Match'}
            </span>
            <h1 className="fw-bolder text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Resume Evaluation</h1>
            <p className="text-secondary fw-medium">Analyzed on {new Date(report.created_at).toLocaleDateString()}</p>
          </motion.div>

          {/* Hero Split Card */}
          <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 d-flex flex-column flex-md-row" style={{ pageBreakInside: 'avoid' }}>
            
            {/* Score Side */}
            <div className="p-4 p-md-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ background: theme.bg, flex: '0 0 300px' }}>
              <h6 className="text-white text-uppercase tracking-wide fw-bold opacity-75 mb-4">ATS Match Score</h6>
              <ScoreGauge score={report.ats_score} theme={theme} />
              <div className="mt-4 bg-white bg-opacity-25 border border-white border-opacity-25 rounded-pill px-4 py-2 text-white fw-bold d-flex align-items-center gap-2 shadow-sm">
                <span>{theme.icon}</span> {theme.label}
              </div>
            </div>

            {/* Summary Side */}
            <div className="p-4 p-md-5 bg-white flex-grow-1">
              <h5 className="fw-bolder text-dark mb-3 d-flex align-items-center gap-2">
                <span className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/></svg></span>
                Executive Summary
              </h5>
              <p className="text-secondary lh-lg mb-4" style={{ fontSize: '0.95rem' }}>{report.summary}</p>
              
              <div className="pt-3 border-top border-light">
                <p className="small text-uppercase text-secondary fw-bold mb-2">Document Analyzed</p>
                <p className="fw-bold text-dark mb-0">{report.file_name}</p>
                {!isGeneral && (
                  <div className="mt-3">
                    <p className="small text-uppercase text-secondary fw-bold mb-2">Target Role</p>
                    <p className="fw-bold text-primary mb-0">{report.target_role}</p>
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
              <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white" style={{ pageBreakInside: 'avoid' }}>
                <h5 className="fw-bolder text-dark mb-3">Core Technical Skills Extracted</h5>
                <div className="d-flex flex-wrap gap-2">
                  {topSkills.map((skill, i) => (
                    <span key={i} className="badge bg-light text-dark border border-secondary border-opacity-25 px-3 py-2 rounded-pill fw-semibold shadow-sm">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <div className="row g-4">
                {/* Strengths */}
                <div className="col-md-6">
                  <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white" style={{ pageBreakInside: 'avoid' }}>
                    <h5 className="fw-bolder text-success mb-4 d-flex align-items-center gap-2">
                       <span className="bg-success bg-opacity-10 rounded-circle p-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg></span>
                       Primary Strengths
                    </h5>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                      {strengths.map((str, i) => (
                        <li key={i} className="d-flex gap-3 text-secondary fw-medium align-items-start">
                          <span className="text-success mt-1">●</span> <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Weaknesses */}
                <div className="col-md-6">
                  <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white" style={{ pageBreakInside: 'avoid' }}>
                    <h5 className="fw-bolder text-danger mb-4 d-flex align-items-center gap-2">
                      <span className="bg-danger bg-opacity-10 rounded-circle p-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></span>
                      Areas for Improvement
                    </h5>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                      {weaknesses.map((weak, i) => (
                        <li key={i} className="d-flex gap-3 text-secondary fw-medium align-items-start">
                          <span className="text-danger mt-1">●</span> <span>{weak}</span>
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
                  <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white" style={{ pageBreakInside: 'avoid' }}>
                    <h5 className="fw-bolder text-success mb-3">✅ Matched Job Keywords</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {matchedSkills.length > 0 ? matchedSkills.map((s, i) => (
                        <span key={i} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-semibold">{s}</span>
                      )) : <span className="text-muted small">No critical keywords matched perfectly.</span>}
                    </div>
                  </motion.div>
                </div>
                
                {/* Missing Skills */}
                <div className="col-md-6">
                  <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white" style={{ pageBreakInside: 'avoid' }}>
                    <h5 className="fw-bolder text-danger mb-3">⚠️ Missing Job Keywords</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {missingSkills.length > 0 ? missingSkills.map((s, i) => (
                        <span key={i} className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill fw-semibold">{s}</span>
                      )) : <span className="text-muted small">Great job! No major keywords missing.</span>}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Suggestions */}
              <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white" style={{ pageBreakInside: 'avoid' }}>
                <h5 className="fw-bolder text-primary mb-4">💡 Actionable Recommendations</h5>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                  {suggestions.length > 0 ? suggestions.map((s, i) => (
                    <li key={i} className="d-flex gap-3 text-secondary fw-medium align-items-start border-bottom border-light pb-3">
                      <span className="text-primary mt-1 fs-5">👉</span> <span className="lh-lg">{s}</span>
                    </li>
                  )) : <li className="text-muted">Your resume looks perfectly optimized for this role!</li>}
                </ul>
              </motion.div>
            </>
          )}

          <div className="text-center mt-5 opacity-50">
             <p className="small fw-bold text-uppercase tracking-wide text-secondary">NovusCV • AI Analysis Engine</p>
          </div>
          
        </motion.div>
      </div>

      <style>{`
        .ats-gauge-wrap { position: relative; display: flex; align-items: center; justify-content: center; width: 164px; height: 164px;}
        .ats-gauge-center { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 2;}
        .ats-gauge-number { font-size: 2.8rem; font-weight: 800; line-height: 1; letter-spacing: -1px; }
        .ats-gauge-pulse { position: absolute; inset: -12px; border-radius: 50%; background: rgba(255, 255, 255, 1); z-index: 0;}
      `}</style>
    </div>
  );
};

export default Report;