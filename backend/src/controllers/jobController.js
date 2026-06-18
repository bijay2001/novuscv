import db from '../config/db.js';

// Save a new Job Description
export const saveJobDescription = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const [result] = await db.execute(
      'INSERT INTO job_descriptions (user_id, title, description) VALUES (?, ?, ?)',
      [userId, title, description]
    );

    res.status(201).json({ success: true, id: result.insertId, message: 'JD Saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving JD' });
  }
};

// Fetch user's saved JDs for the dropdown in Upload Page
export const getMyJobDescriptions = async (req, res) => {
  try {
    const [jobs] = await db.execute(
      'SELECT id, title FROM job_descriptions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching JDs' });
  }
};