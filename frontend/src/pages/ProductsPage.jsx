import { useState, useEffect, useContext } from 'react';
import { Button, Table } from 'react-bootstrap';
import api from '../services/api';
import ProductFormModal from '../components/ProductFormModal';
import { useAuth } from '../contexts/AuthContext';

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  const handleSave = newProd => {
    setProducts([newProd, ...products]);
  };

  return (
    <div className="container mt-4">
      <h2>Productos</h2>
      {(user.role === 'jefe_bodega' || user.role === 'super_admin') && (
        <Button className="mb-3" onClick={() => setShowModal(true)}>+ Nuevo Producto</Button>
      )}
      <Table striped bordered hover variant={user.role === 'dark'?'dark':''}>
        <thead><tr><th>Código</th><th>Nombre</th><th>Peso (kg)</th><th>Vence</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.unit_weight}</td>
              <td>{p.has_expiry ? 'Sí' : 'No'}</td>
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
