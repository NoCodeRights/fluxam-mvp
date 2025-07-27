import { Table, Button } from 'react-bootstrap';
import api from '../services/api';

export default function TransfersList({ transfers }) {
  const handleAction = async (id, action) => {
    await api.patch(`/transfers/${id}/approve`, { action });
    window.location.reload();
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>De</th><th>A</th><th>Solicitó</th><th>Estado</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {transfers.map(t => (
          <tr key={t.id}>
            <td>{t.from_site_id}</td>
            <td>{t.to_site_id}</td>
            <td>{t.requester}</td>
            <td>{t.status}</td>
            <td>
              {t.status==='pending' && (
                <>
                  <Button size="sm" variant="success" onClick={()=>handleAction(t.id,'approved')}>Aprobar</Button>{' '}
                  <Button size="sm" variant="danger" onClick={()=>handleAction(t.id,'rejected')}>Rechazar</Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
