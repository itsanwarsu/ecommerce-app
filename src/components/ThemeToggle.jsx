import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  // Panggil fungsi & state dari context yang sudah kita buat
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-lg transition-colors duration-200 
                 bg-gray-200 hover:bg-gray-300 text-gray-800 
                 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

