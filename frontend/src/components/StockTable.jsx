import { Table, Button } from 'react-bootstrap';
import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

export default function StockTable({ lots, refreshLots }) {
  const [using, setUsing] = useState(false);

  const handleUse = async id => {
    const qtyStr = prompt('Cantidad a usar:');
    if (!qtyStr) return;
    const qty = parseFloat(qtyStr);
    if (isNaN(qty) || qty <= 0) {
      Swal.fire({ icon: 'warning', text: 'Ingresa un número válido' });
      return;
    }

    setUsing(true);
    try {
      const res = await api.patch(`/lots/${id}/use`, { quantity: qty });
      Swal.fire({ icon: 'success', text: 'Stock actualizado' });
      refreshLots();
    } catch (err) {
      console.error('Error al usar stock:', err);
      const msg =
        err.response?.data?.message ||
        'No se pudo usar la cantidad solicitada';
      Swal.fire({ icon: 'error', text: msg });
    } finally {
      setUsing(false);
    }
  };

  const formatDate = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(); // usa configuración local (YYYY-MM-DD en es-CL)
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cant.</th>
          <th>Expira</th>
          <th>Rack</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {lots.map(l => {
          const isExpired = l.expiry_at && new Date(l.expiry_at) < new Date();
          const isWarning =
            l.expiry_at &&
            new Date(l.expiry_at) - new Date() < 1000 * 60 * 60 * 24 * 30;
          return (
            <tr
              key={l.id}
              className={
                l.quantity < 0
                  ? 'table-danger'
                  : isExpired
                  ? 'table-danger'
                  : isWarning
                  ? 'table-warning'
                  : ''
              }
            >
              <td>{l.name}</td>
              <td>
                {l.quantity} {l.unit_type}
              </td>
              <td>{formatDate(l.expiry_at)}</td>
              <td>{l.position}</td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={using}
                  onClick={() => handleUse(l.id)}
                >
                  Usar
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
