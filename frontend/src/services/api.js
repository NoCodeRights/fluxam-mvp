// frontend/src/services/api.js
import axios from 'axios';

const RAW = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const ORIGIN = RAW.replace(/\/+$/, ''); // sin barra final
const baseURL = `${ORIGIN}/api`;

console.log(`⚙️ API baseURL = ${baseURL}`);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjunta el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
