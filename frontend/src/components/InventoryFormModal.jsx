import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function InventoryFormModal({ onClose, onSaved }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
    unit_type: '',
    manufacture_at: '',
    expiry_at: '',
    position: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/products?q=')
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const res = await api.post('/lots', form);
      // Confirmación con SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: 'Lote creado',
        text: `El lote del producto se creó correctamente.`,
        confirmButtonText: 'OK',
        customClass: { popup: 'swal2-dark' }
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'No se pudo crear el lote';
      setError(msg);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        customClass: { popup: 'swal2-dark' }
      });
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton><Modal.Title>Nuevo Lote</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Producto</Form.Label>
            <Form.Select name="product_id" onChange={handleChange} value={form.product_id}>
              <option value="">Selecciona...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Unidad</Form.Label>
            <Form.Control
              type="text"
              name="unit_type"
              value={form.unit_type}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de fabricación</Form.Label>
            <Form.Control
              type="date"
              name="manufacture_at"
              value={form.manufacture_at}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de vencimiento</Form.Label>
            <Form.Control
              type="date"
              name="expiry_at"
              value={form.expiry_at}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Posición</Form.Label>
            <Form.Control
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="success" onClick={handleSubmit}>Crear lote</Button>
      </Modal.Footer>
    </Modal>
  );
}
