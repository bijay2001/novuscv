import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { showAlert } from '../utils/alerts';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(selectedFile.type) && !['pdf', 'docx'].includes(ext)) {
      showAlert.error('Invalid File Type', 'Invalid format. Only PDF and DOCX files are allowed.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      showAlert.error('File Too Large', 'File is too large. Maximum size is 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showAlert.error('Missing File', 'Please upload a PDF or DOCX file.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobRole', jobRole.trim() || 'General Application');

      const { data } = await api.post('/resume/upload', formData);

      const resumeId = data?.data?.resumeId;

      await showAlert.success(
        'Analysis Complete!',
        data?.message || 'Your resume has been evaluated and saved.'
      );

      if (resumeId) {
        navigate(`/report/${resumeId}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showAlert.error(
        'Analysis Failed',
        err.response?.data?.message || 'Server error during document processing.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="main-container" style={{ maxWidth: '760px' }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <span className="ec-eyebrow" style={{ marginBottom: '0.4rem' }}>// ATS Ingestion Module</span>
        <h1 className="ec-heading" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, marginBottom: '0.4rem' }}>
          Scan & Optimize Resume
        </h1>
        <p style={{ color: 'var(--ec-muted)', fontSize: '0.92rem', marginBottom: '2rem' }}>
          Upload your PDF or DOCX resume and specify your target role or job description for instant AI ATS scoring.
        </p>

        <form onSubmit={handleSubmit} className="ec-card" style={{ padding: '2rem' }}>
          <span className="ec-corner tl" />
          <span className="ec-corner br" />

          <div
            className={`ec-dropzone ${dragActive ? 'active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              onChange={(e) => validateAndSetFile(e.target.files?.[0])}
            />

            <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>📄</div>
            {file ? (
              <div>
                <h3 className="ec-heading" style={{ fontSize: '1.1rem', color: 'var(--ec-teal)' }}>
                  {file.name}
                </h3>
                <p className="ec-mono" style={{ fontSize: '0.78rem', color: 'var(--ec-muted)', marginTop: '0.3rem' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB · VERIFIED FOR AI PARSING
                </p>
              </div>
            ) : (
              <div>
                <h3 className="ec-heading" style={{ fontSize: '1.08rem', marginBottom: '0.3rem' }}>
                  Drag & drop your resume here, or click to browse
                </h3>
                <p className="ec-mono" style={{ fontSize: '0.76rem', color: 'var(--ec-muted)' }}>
                  SUPPORTS .PDF OR .DOCX (MAX 5MB · 5 SCANS/HOUR)
                </p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <label className="ec-field-label" htmlFor="jobRole">
              Target Job Role or Job Description (Leave blank for General Application Scan)
            </label>
            <textarea
              id="jobRole"
              rows={4}
              className="ec-textarea"
              placeholder="e.g., Full Stack React & Node.js Developer — or paste the target job requirements here..."
              maxLength={3000}
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled={uploading}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="ec-submit" disabled={uploading}>
            {uploading ? (
              <>
                <span className="ec-spinner" />
                <span>Executing AI ATS Scan...</span>
              </>
            ) : (
              'Run ATS Diagnostic'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadResume;