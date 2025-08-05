import axios from 'axios';

const raw = import.meta.env.VITE_API_URL;
// Si falta protocolo, lo fuerza:
const baseURL = raw?.startsWith('http') 
  ? raw 
  : `https://${raw}`;

console.log('⚙️ API baseURL =', baseURL);

const api = axios.create({ baseURL });
// … interceptors …

export default api;
