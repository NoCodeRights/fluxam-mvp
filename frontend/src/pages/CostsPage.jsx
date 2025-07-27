import { useState, useEffect } from 'react';
import api from '../services/api';
import CostBreakdown from '../components/CostBreakdown';

export default function CostsPage() {
  const [lots, setLots] = useState([]);

  useEffect(() => {
    // podrías cargar lista de lotes para elegir
    api.get('/lots').then(res => setLots(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Costos</h2>
      <CostBreakdown lots={lots} />
    </div>
  );
}
