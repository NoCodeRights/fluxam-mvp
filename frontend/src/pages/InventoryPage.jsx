import { useState, useEffect } from 'react';
import api from '../services/api';
import InventoryFormModal from '../components/InventoryFormModal';
import StockTable from '../components/StockTable';

export default function InventoryPage() {
  const [lots, setLots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchLots = () => {
    api.get('/lots')
       .then(res => setLots(res.data))
       .catch(console.error);
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleSaved = newLot => {
    fetchLots();
  };

  // Filtra lots con cantidad > 0, o todos si showHistory
  const visibleLots = lots.filter(l => showHistory || l.quantity > 0);

  return (
    <div className="container mt-4">
      <h2>Inventario</h2>
      <div className="d-flex mb-3">
        <button
          className="btn btn-success me-2"
          onClick={() => setShowModal(true)}
        >
          + Agregar lote
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowHistory(h => !h)}
        >
          {showHistory ? 'Ocultar historial' : 'Mostrar historial'}
        </button>
      </div>

      <StockTable lots={visibleLots} refreshLots={fetchLots} />

      {showModal && (
        <InventoryFormModal
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
