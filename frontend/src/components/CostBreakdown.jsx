import { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function CostBreakdown({ lots }) {
  const [selectedLot, setSelectedLot] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ type:'', description:'', amount:'' });

  useEffect(() => {
    if (selectedLot) {
      api.get(`/costs/lot/${selectedLot}`)
        .then(res => setItems(res.data))
        .catch(err => {
          console.error('Error fetching costs:', err);
          if (err.response?.status === 403) {
            Swal.fire({
              icon: 'warning',
              title: 'Sin permiso',
              text: 'No tienes permiso para ver estos costos.'
            });
          }
          setItems([]);
        });
    }
  }, [selectedLot]);

  const addItem = async () => {
    try {
      await api.post(`/costs/lot/${selectedLot}`, newItem);
      const res = await api.get(`/costs/lot/${selectedLot}`);
      setItems(res.data);
      setNewItem({ type:'', description:'', amount:'' });
    } catch (err) {
      console.error('Error creating cost item:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo agregar ítem de costo'
      });
    }
  };

  const total = items.reduce((sum, i) => sum + parseFloat(i.amount), 0);

  return (
    <div>
      <Form.Select 
        onChange={e => setSelectedLot(e.target.value)} 
        value={selectedLot}
      >
        <option value="">Selecciona lote...</option>
        {lots.map(l => (
          <option key={l.id} value={l.id}>
            {l.name} ({l.id})
          </option>
        ))}
      </Form.Select>
      {selectedLot && (
        <>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr><th>Tipo</th><th>Desc.</th><th>Monto</th></tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id}>
                  <td>{i.type}</td>
                  <td>{i.description}</td>
                  <td>{i.amount}</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan="2">Total</td>
                <td>{total}</td>
              </tr>
            </tbody>
          </Table>
          <h5>Agregar ítem</h5>
          <Form className="d-flex">
            <Form.Control 
              placeholder="Tipo" 
              value={newItem.type} 
              onChange={e => setNewItem(n => ({ ...n, type: e.target.value }))}
            />
            <Form.Control 
              placeholder="Descripción" 
              value={newItem.description} 
              onChange={e => setNewItem(n => ({ ...n, description: e.target.value }))}
            />
            <Form.Control 
              placeholder="Monto" 
              type="number" 
              value={newItem.amount} 
              onChange={e => setNewItem(n => ({ ...n, amount: e.target.value }))}
            />
            <Button onClick={addItem}>Agregar</Button>
          </Form>
        </>
      )}
    </div>
  );
}
