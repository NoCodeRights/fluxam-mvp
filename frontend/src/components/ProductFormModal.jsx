import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../services/api';
import Swal from 'sweetalert2';

export default function ProductFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    code: '',
    name: '',
    unit_weight: '',
    has_expiry: true
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const res = await api.post('/products', form);
      await Swal.fire({
        icon: 'success',
        title: 'Producto creado',
        text: `${res.data.name} ha sido agregado.`,
        confirmButtonText: 'OK',
        customClass: { popup: 'swal2-dark' }
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'No se pudo crear el producto';
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
      <Modal.Header closeButton><Modal.Title>Nuevo Producto</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Código</Form.Label>
            <Form.Control name="code" value={form.code} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Peso por unidad (kg)</Form.Label>
            <Form.Control
              type="number"
              name="unit_weight"
              value={form.unit_weight}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-check">
            <Form.Check
              type="checkbox"
              label="Tiene fecha de vencimiento"
              name="has_expiry"
              checked={form.has_expiry}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Crear producto</Button>
      </Modal.Footer>
    </Modal>
  );
}
