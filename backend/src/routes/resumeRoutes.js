import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { uploadAndParseResume, getDashboardStats, getReportById } from '../controllers/resumeController.js'; 

const router = express.Router();

router.post('/upload', protect, uploadResume.single('resume'), uploadAndParseResume);
router.get('/dashboard', protect, getDashboardStats);
router.get('/report/:id', protect, getReportById);

export default router;