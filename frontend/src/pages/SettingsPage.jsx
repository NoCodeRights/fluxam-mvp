import { useState, useEffect } from 'react';
import api from '../services/api';

export default function SettingsPage() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    api.get('/companies/1').then(res => setCompany(res.data));
  }, []);

  if (!company) return <p>Cargando…</p>;

  return (
    <div className="container mt-4">
      <h2>Configuración</h2>
      <div className="mb-3">
        <label className="form-label">Nombre público</label>
        <input 
          type="text" 
          className="form-control" 
          value={company.display_name}
          readOnly
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Razón social</label>
        <input 
          type="text" 
          className="form-control" 
          value={company.legal_name}
          readOnly
        />
      </div>
      {/* Más opciones: logo, colores, tema */}
    </div>
  );
}
