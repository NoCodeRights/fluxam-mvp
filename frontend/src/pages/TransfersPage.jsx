import { useState, useEffect } from 'react';
import api from '../services/api';
import TransfersList from '../components/TransfersList';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    api.get('/transfers').then(res => setTransfers(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Transferencias</h2>
      <TransfersList transfers={transfers} />
    </div>
  );
}
