// frontend/src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import api from '../services/api';
import ProductFormModal from '../components/ProductFormModal';
import { useAuth } from '../contexts/AuthContext';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadProducts = () => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error cargando productos:', err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = newProd => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (!ok) return;
    try {
      await api.delete(`/products/${id}`); // 👈 ojo: backticks
      loadProducts();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      alert('No se pudo eliminar el producto. Revisa la consola para más detalles.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Productos</h2>

      {(user.role === 'jefe_bodega' || user.role === 'super_admin') && (
        <Button className="mb-3" onClick={() => setShowModal(true)}>
          + Nuevo Producto
        </Button>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Peso (kg)</th>
            <th>Vence</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.unit_weight}</td>
              <td>{p.has_expiry ? 'Sí' : 'No'}</td>
              <td>
                {(user.role === 'jefe_bodega' || user.role === 'super_admin') && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <ProductFormModal
          onClose={() => setShowModal(false)}
          onSaved={handleSave}
        />
      )}
    </div>
  );
}
