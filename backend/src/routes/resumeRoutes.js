import express from 'express';
import rateLimit from 'express-rate-limit'; // <-- 1. Import rate limiter
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { uploadAndParseResume, getDashboardStats, getReportById } from '../controllers/resumeController.js'; 

const router = express.Router();

// --- 2. Create the Strict Upload Limiter ---
// Limits users to 5 resume uploads per hour to prevent API abuse and DDoS
const strictUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Hour window
  max: 5, // Max 5 uploads
  message: { 
    success: false, 
    message: "Upload limit reached. You can only analyze 5 resumes per hour to prevent system abuse." 
  }
});

// --- 3. Apply the Limiter to the Upload Route ---
// Notice how strictUploadLimiter goes BEFORE uploadResume (Multer)
router.post(
  '/upload', 
  protect, 
  strictUploadLimiter, 
  uploadResume.single('resume'), 
  uploadAndParseResume
);

router.get('/dashboard', protect, getDashboardStats);
router.get('/report/:id', protect, getReportById);

export default router;