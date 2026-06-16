import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { showAlert } from '../utils/alerts';
import { motion, AnimatePresence } from 'framer-motion';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  // --- Reusable File Validation ---
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // 1. Validate File Type
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(selectedFile.type)) {
      showAlert.error('Invalid File', 'Please upload only PDF or DOCX formats.');
      return false;
    }

    // 2. Validate File Size (Strict 5MB Limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      showAlert.error('File Too Large', 'Please keep your resume under 5MB.');
      return false;
    }

    setFile(selectedFile);
    return true;
  };

  // --- Event Handlers ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!processFile(selectedFile)) {
      e.target.value = null; // Clear input if invalid
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showAlert.error('Missing File', 'Please select a resume to upload.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('document', file); 

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await showAlert.success('Success!', 'Resume parsed successfully.');
      
      navigate(`/report/${response.data.data.resumeId}`, { 
        state: { report: response.data.data.report } 
      });

    } catch (err) {
      showAlert.error(
        'Upload Failed', 
        err.response?.data?.message || 'Failed to process resume. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Animation Variants ---
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f4f7f6' }}>
      
      {/* Animated Top Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm px-3 py-3 mb-4 sticky-top w-100"
      >
        <div className="container-fluid p-0 d-flex align-items-center" style={{ maxWidth: '1100px' }}>
          <Link to="/" className="text-decoration-none text-dark d-flex align-items-center gap-2 fw-semibold transition-all hover-primary">
            <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center hover-bg-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
            </div>
            Back to Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="container px-3 px-md-4 d-flex flex-column align-items-center justify-content-center flex-grow-1 pb-5"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-100" style={{ maxWidth: '580px' }}>
          
          {/* Header Area */}
          <motion.div className="text-center mb-4" variants={childVariants}>
            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3 shadow-sm" style={{ width: '64px', height: '64px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/>
              </svg>
            </div>
            <h2 className="fw-bolder text-dark mb-2" style={{ fontSize: '2.2rem', letterSpacing: '-0.5px' }}>Upload Document</h2>
            <p className="text-secondary fs-6">Drag and drop your resume to extract powerful ATS insights.</p>
          </motion.div>

          {/* Interactive Card */}
          <motion.div variants={childVariants} className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4 bg-white">
            <div className="card-body p-4 p-sm-5 text-center position-relative">
              
              <form onSubmit={handleUpload}>
                
                {/* Advanced Dropzone */}
                <motion.div 
                  animate={{ 
                    scale: isDragging ? 1.02 : 1,
                    backgroundColor: isDragging ? 'rgba(37, 99, 235, 0.05)' : (file ? 'rgba(37, 99, 235, 0.02)' : '#ffffff'),
                    borderColor: isDragging || file ? '#2563eb' : '#dee2e6'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="position-relative p-5 mb-4 rounded-4 d-flex flex-column align-items-center justify-content-center transition-all"
                  style={{ 
                    border: `2px ${isDragging || file ? 'solid' : 'dashed'}`, 
                    minHeight: '260px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div 
                        key="file-selected"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="d-flex flex-column align-items-center"
                      >
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 shadow-sm mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          </svg>
                        </div>
                        <h5 className="fw-bolder text-dark mb-1 text-truncate px-3" style={{ maxWidth: '300px' }}>
                          {file.name}
                        </h5>
                        <p className="small mb-0 fw-semibold text-primary bg-primary bg-opacity-10 px-3 py-1 rounded-pill mt-2">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="no-file"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="d-flex flex-column align-items-center pe-none"
                      >
                        <div className="bg-light text-secondary rounded-circle p-4 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
                            <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                          </svg>
                        </div>
                        <h5 className="fw-bolder text-dark mb-1">
                          Drag & drop or <span className="text-primary text-decoration-underline">browse</span>
                        </h5>
                        <p className="small mb-0 text-secondary fw-medium mt-1">
                          Supports PDF and DOCX (Max 5MB)
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hidden Input Layer - Z-index set high to ensure entirely clickable area */}
                  <input 
                    type="file" 
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                    style={{ cursor: 'pointer', zIndex: 10 }}
                    disabled={loading}
                  />
                </motion.div>

                {/* Animated Submit Button */}
                <motion.button 
                  type="submit" 
                  disabled={loading || !file} 
                  whileHover={!loading && file ? { scale: 1.02, boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)" } : {}}
                  whileTap={!loading && file ? { scale: 0.98 } : {}}
                  className="btn btn-primary btn-lg w-100 rounded-pill py-3 fs-6 fw-bolder border-0 overflow-hidden position-relative"
                  style={{ 
                    zIndex: 20, 
                    background: loading || !file ? '#a5b4fc' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    transition: 'background 0.3s'
                  }}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="d-flex align-items-center justify-content-center gap-2"
                      >
                        <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                        <span>Scanning Document...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="d-flex align-items-center justify-content-center gap-2"
                      >
                        Analyze with AI
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

              </form>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default UploadResume;