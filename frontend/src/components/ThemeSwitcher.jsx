import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Button } from 'react-bootstrap';

export default function ThemeSwitcher() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <Button variant="outline-secondary" onClick={toggle}>
      {theme==='light' ? '🌙' : '☀️'}
    </Button>
  );
}
