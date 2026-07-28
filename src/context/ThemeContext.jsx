import { createContext, useContext, useEffect, useState } from 'react';

// 1. Inisialisasi Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Cek apakah pernah ada simpanan tema di localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // Jika belum ada, cek preferensi tema bawaan OS HP/Laptop user
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement; // Mengakses tag <html>

    // Tambah/hapus class 'dark' di tag <html>
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Simpan preferensi ke localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fungsi untuk toggle (saklar) ganti tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook agar komponen lain mudah mengakses nilai theme & toggleTheme
export const useTheme = () => useContext(ThemeContext);

