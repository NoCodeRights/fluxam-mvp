// frontend/src/services/api.js
import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';
// quita barras finales duplicadas
const cleanBase = rawBase.replace(/\/+$/, '');

console.log('⚙️ API baseURL =', cleanBase);

const api = axios.create({
  baseURL: `${cleanBase}/api`,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
