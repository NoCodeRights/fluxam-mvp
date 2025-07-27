import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown, Form, Image } from 'react-bootstrap';
import { useAuth } from './contexts/AuthContext';
import { ThemeContext } from './contexts/ThemeContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import TransfersPage from './pages/TransfersPage';
import CostsPage from './pages/CostsPage';
import SettingsPage from './pages/SettingsPage';

const defaultAvatar = '/images/avatar.svg';

function PrivateRoute({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useContext(ThemeContext);

  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">FluxAm</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/products">Productos</Nav.Link>
              <Nav.Link as={Link} to="/inventory">Inventario</Nav.Link>
              <Nav.Link as={Link} to="/transfers">Transferencias</Nav.Link>
              <Nav.Link as={Link} to="/costs">Costos</Nav.Link>
              <Nav.Link as={Link} to="/settings">Configuración</Nav.Link>
            </Nav>
            <Nav className="ms-auto align-items-center">
              <Dropdown align="end">
                <Dropdown.Toggle variant={theme === 'dark' ? 'secondary' : 'outline-secondary'} id="user-dropdown">
                  <Image
                    src={user.avatarUrl || defaultAvatar}
                    roundedCircle
                    width="30"
                    height="30"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>{user.email}</Dropdown.Header>
                  <Dropdown.Divider/>
                  {/* Selector de tema */}
                  <Form.Check
                    type="switch"
                    id="theme-switch"
                    label="Modo oscuro"
                    className="px-3"
                    checked={theme === 'dark'}
                    onChange={toggle}
                  />
                  <Dropdown.Divider/>
                  {/* Subir imagen de perfil */}
                  <Form.Group className="px-3 mb-2">
                    <Form.Label>Subir foto</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        // aquí podrías enviar al backend...
                        const file = e.target.files[0];
                        console.log('Archivo subido:', file);
                      }}
                    />
                  </Form.Group>
                  <Dropdown.Divider/>
                  <Dropdown.Item onClick={logout}>Cerrar sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <PrivateRoute>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="transfers" element={<TransfersPage />} />
              <Route path="costs" element={<CostsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </PrivateRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}
