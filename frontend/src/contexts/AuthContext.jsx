import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// Función simple para decodificar un JWT (solo payload)
function jwt_decode(token) {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('fluxam_token');
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded) {
        setUser({
          id: decoded.id,
          role: decoded.role,
          company_id: decoded.company_id,
          site_id: decoded.site_id
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('fluxam_token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('fluxam_token', token);
    const decoded = jwt_decode(token);
    if (decoded) {
      setUser({
        id: decoded.id,
        role: decoded.role,
        company_id: decoded.company_id,
        site_id: decoded.site_id
      });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const logout = () => {
    localStorage.removeItem('fluxam_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
