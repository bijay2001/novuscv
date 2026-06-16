import fs from 'fs';
import db from '../config/db.js';
import { extractTextFromFile } from '../utils/resumeParser.js';
import { analyzeResumeWithAI } from '../utils/aiAnalyzer.js'; // 1. Import the AI utility

export const uploadAndParseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or DOCX file.' });
    }

    const userId = req.user.id; 
    const filePath = req.file.path;

    // Extract text
    const resumeText = await extractTextFromFile(filePath);

    if (!resumeText || resumeText.length < 50) {
      fs.unlinkSync(filePath); 
      return res.status(400).json({ success: false, message: 'Could not read text from this document.' });
    }

    // 2. SEND TO GEMINI! (This takes about 2-3 seconds)
    const aiReport = await analyzeResumeWithAI(resumeText);

    // Save to database (Assuming your DB handles the JSON or we just save the score)
    const [result] = await db.execute(
      'INSERT INTO resumes (user_id, file_url, resume_text, ats_score) VALUES (?, ?, ?, ?)',
      [userId, 'deleted_temp_file', resumeText, aiReport.atsScore]
    );

    // Delete the local file immediately
    fs.unlinkSync(filePath); 

    // 3. Send the AI report straight to the frontend!
    res.status(201).json({
      success: true,
      message: 'Analysis Complete',
      data: {
        resumeId: result.insertId,
        report: aiReport // Sending the complete JSON from Gemini
      }
    });

  } catch (error) {
    console.error("Upload Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'Server error during AI processing' });
  }
};