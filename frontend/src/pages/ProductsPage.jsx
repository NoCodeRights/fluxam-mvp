import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import api from '../services/api';
import ProductFormModal from '../components/ProductFormModal';
import { useAuth } from '../contexts/AuthContext';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Función para cargar productos desde el backend
  const loadProducts = () => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error cargando productos:', err));
  };

  // Al iniciar, cargamos la lista
  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = newProd => {
    // insertamos en la lista sin recargar todo
    setProducts([newProd, ...products]);
  };

  const handleDelete = async id => {
    const ok = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (!ok) return;

    try {
      // Petición DELETE al servidor
      await api.delete(`/products/${id}`);
      // Volvemos a cargar la lista completa para reflejar la base de datos
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

      <Table
        striped
        bordered
        hover
        variant={user.theme === 'dark' ? 'dark' : ''}
      >
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
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                >
                  🗑️
                </Button>
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
