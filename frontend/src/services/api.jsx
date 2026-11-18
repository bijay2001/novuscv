import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial: Sends & receives httpOnly auth cookies across requests
  timeout: 60000, // 60s timeout so Gemini AI has enough time to parse and score the resume
});

export default api;