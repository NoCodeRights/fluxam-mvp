import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import AlertsWidget from '../components/AlertsWidget';
import { ThemeContext } from '../contexts/ThemeContext';

export default function Dashboard() {
  const { theme } = useContext(ThemeContext);

  return (
    <Container
      fluid
      className={`mt-4 ${theme === 'dark' ? 'text-white' : ''}`}
      style={{ minHeight: 'calc(100vh - 56px)' }} // deja espacio al navbar
    >
      <h1>Dashboard</h1>
      <hr />
      <AlertsWidget />
      <p className="mt-3">
        Bienvenido a FluxAm. Selecciona una sección del menú para comenzar.
      </p>
    </Container>
  );
}
