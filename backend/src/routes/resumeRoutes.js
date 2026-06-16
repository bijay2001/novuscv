import express from 'express';
import { uploadAndParseResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// The form field name coming from the React frontend must exactly match 'document'
router.post('/upload', protect, uploadResume.single('document'), uploadAndParseResume);

export default router;