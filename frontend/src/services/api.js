import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
console.log('⚙️ API baseURL =', baseURL);

const api = axios.create({
  baseURL  // ⬅️ aquí
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('fluxam_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
