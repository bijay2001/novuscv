import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { saveJobDescription, getMyJobDescriptions } from '../controllers/jobController.js';

const router = express.Router();

router.post('/save', protect, saveJobDescription);
router.get('/my-jobs', protect, getMyJobDescriptions);

export default router;  