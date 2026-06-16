import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Crucial: Allows the httpOnly cookie to be saved by the browser
});

export default api;