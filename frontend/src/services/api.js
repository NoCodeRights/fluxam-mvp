// frontend/src/services/api.js
import axios from 'axios';

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const apiBase = base.endsWith('/api') ? base : `${base}/api`;

console.log('⚙️ API baseURL =', apiBase);

const api = axios.create({
  baseURL: apiBase,
});

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // o desde AuthContext
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
