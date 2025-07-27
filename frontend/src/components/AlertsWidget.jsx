import { useState, useEffect } from 'react';
import { Badge, ListGroup } from 'react-bootstrap';
import api from '../services/api';

export default function AlertsWidget() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get('/alerts')
      .then(res => setAlerts(res.data || []))
      .catch(err => {
        console.error('Error cargando alertas:', err);
        setAlerts([]);
      });
  }, []);

  return (
    <div className="mb-4">
      <h5>
        Alertas <Badge bg={alerts.length ? 'danger' : 'secondary'}>{alerts.length}</Badge>
      </h5>
      {alerts.length > 0 && (
        <ListGroup>
          {alerts.map((a, i) => (
            <ListGroup.Item 
              key={i} 
              className={a.level === 'red' ? 'list-group-item-danger' : 'list-group-item-warning'}
            >
              {a.message}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
