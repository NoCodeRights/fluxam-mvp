import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('fluxam_theme');
    if (saved === 'dark') applyDark();
  }, []);

  function applyDark() {
    setTheme('dark');
    document.body.classList.add('bg-dark', 'text-light', 'dark-mode');
  }

  function removeDark() {
    setTheme('light');
    document.body.classList.remove('bg-dark', 'text-light', 'dark-mode');
  }

  const toggle = () => {
    theme === 'light' ? applyDark() : removeDark();
    localStorage.setItem('fluxam_theme', theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
