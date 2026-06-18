import fs from 'fs';
import crypto from 'crypto';
import db from '../config/db.js';
import { extractTextFromFile } from '../utils/resumeParser.js';
import { analyzeResumeWithAI } from '../utils/aiAnalyzer.js';

// Non-blocking file deletion helper
const deleteFile = async (filePath) => {
  try {
    if (filePath) {
      await fs.promises.access(filePath); // Check if exists
      await fs.promises.unlink(filePath); // Delete asynchronously
    }
  } catch (err) {
    // File already gone or inaccessible, safe to ignore
  }
};

export const uploadAndParseResume = async (req, res) => {
  let uploadedFilePath = req.file?.path;

  try {
    // 1. Initial File Existence Check
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or DOCX file.' });
    }

    const userId = req.user.id; 
    const originalName = req.file.originalname;
    
    const jobRole = req.body.jobRole || 'General Application'; 
    const jobDescriptionId = req.body.jobDescriptionId || null;

    // 2. Strict File Type & Size Protection
    const allowedMimeTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      await deleteFile(uploadedFilePath);
      return res.status(400).json({ success: false, message: 'Invalid format. Only PDF and DOCX files are allowed.' });
    }

    if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
      await deleteFile(uploadedFilePath);
      return res.status(400).json({ success: false, message: 'File is too large. Maximum size is 5MB.' });
    }

    // 3. Extract text
    const fullResumeText = await extractTextFromFile(uploadedFilePath);
    if (!fullResumeText || fullResumeText.trim().length < 50) {
      await deleteFile(uploadedFilePath);
      return res.status(400).json({ success: false, message: 'Could not read text from this document. Please ensure it is not an image-based PDF.' });
    }

    // 4. Job Description Lookup Logic
    let activeJD = jobRole; 

    if (jobDescriptionId) {
      const [jobRows] = await db.execute(
        'SELECT description FROM job_descriptions WHERE id = ? AND user_id = ?',
        [jobDescriptionId, userId]
      );
      if (jobRows.length > 0) {
        activeJD = jobRows[0].description; 
      }
    }

    // 5. Length & Heuristic Protection
    if (fullResumeText.length > 15000) {
      await deleteFile(uploadedFilePath);
      return res.status(400).json({ success: false, message: 'Document contains too much text. Please upload a standard resume.' });
    }

    const limitedText = fullResumeText.substring(0, 12000);

    // 6. IMPROVED HASHING: Prevents duplicate API costs
    const hashData = limitedText + activeJD.toLowerCase();
    const resumeHash = crypto.createHash('sha256').update(hashData).digest('hex');

    const [existingScan] = await db.execute(
      'SELECT id FROM resumes WHERE user_id = ? AND resume_hash = ?',
      [userId, resumeHash]
    );

    if (existingScan.length > 0) {
      await deleteFile(uploadedFilePath);
      return res.status(200).json({
        success: true,
        message: 'Analysis instantly retrieved from cache',
        data: { resumeId: existingScan[0].id }
      });
    }

    // 7. SEND TO GEMINI API
    const aiReport = await analyzeResumeWithAI(limitedText, activeJD);

    // 8. INSERTION (Resumes Table)
    const [resumeResult] = await db.execute(
      `INSERT INTO resumes 
       (user_id, file_url, resume_text, ats_score, file_name, target_role, job_description_id, resume_hash) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        'deleted_temp_file', 
        limitedText, 
        aiReport.atsScore, 
        originalName, 
        jobRole, 
        jobDescriptionId, 
        resumeHash
      ]
    );

    const resumeId = resumeResult.insertId;

    // 9. INSERTION (Analysis Reports Table)
    await db.execute(
      `INSERT INTO analysis_reports 
      (resume_id, ats_score, matched_skills, missing_skills, suggestions, summary, top_skills, strengths, weaknesses) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        resumeId, 
        aiReport.atsScore, 
        JSON.stringify(aiReport.matchedSkills || []), 
        JSON.stringify(aiReport.missingSkills || []), 
        JSON.stringify(aiReport.suggestions || []),
        aiReport.summary || 'No summary provided.',
        JSON.stringify(aiReport.topSkills || []),
        JSON.stringify(aiReport.strengths || []),
        JSON.stringify(aiReport.weaknesses || [])
      ]
    );

    // Final cleanup
    await deleteFile(uploadedFilePath);

    res.status(201).json({
      success: true,
      message: 'Analysis Complete & Saved',
      data: { resumeId: resumeId }
    });

  } catch (error) {
    console.error("Upload Error:", error);
    await deleteFile(uploadedFilePath);
    res.status(500).json({ success: false, message: 'Server error during document processing.' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [statsResult] = await db.execute(`
      SELECT COUNT(id) as totalScans, ROUND(AVG(ats_score), 1) as avgScore 
      FROM resumes WHERE user_id = ?
    `, [userId]);

    const [recentScans] = await db.execute(`
      SELECT id, file_name as fileName, target_role as jobProfile, ats_score as score, created_at as scannedAt 
      FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 5
    `, [userId]);

    res.status(200).json({
      success: true,
      stats: {
        totalScans: statsResult[0].totalScans || 0,
        avgScore: statsResult[0].avgScore || 0,
        recentScans: recentScans
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getReportById = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    // Securely JOIN tables to fetch the entire dataset
    const [reportData] = await db.execute(`
      SELECT 
        r.file_name, r.target_role, 
        a.ats_score, a.matched_skills, a.missing_skills, a.suggestions, 
        a.summary, a.top_skills, a.strengths, a.weaknesses, a.created_at
      FROM resumes r
      JOIN analysis_reports a ON r.id = a.resume_id
      WHERE r.id = ? AND r.user_id = ?
    `, [resumeId, userId]);

    if (reportData.length === 0) {
      return res.status(404).json({ success: false, message: 'Report not found or unauthorized' });
    }

    res.status(200).json({ success: true, report: reportData[0] });
  } catch (error) {
    console.error("Fetch Report Error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};