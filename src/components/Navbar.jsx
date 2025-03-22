import { useState, useEffect } from 'react';

export default function Navbar({ onSearch }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark' // Persist theme across refreshes
  );
  const [city, setCity] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600 dark:text-blue-300">
        Weatherly 🌦️
      </h1>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-1 rounded-md border dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-gray-700 dark:text-gray-200 ml-4 text-xl"
        title="Toggle Dark Mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}
