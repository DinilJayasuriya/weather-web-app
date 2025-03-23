import { useState, useEffect } from 'react';

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

export default function Navbar({ onSearch }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [city, setCity] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setCity(input);

    if (!input.trim()) {
      setFilteredSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          input
        )}.json?access_token=${MAPBOX_API_KEY}&types=place&limit=5`
      );

      const data = await res.json();

      const suggestions = data.features.map((feature) => ({
        name: feature.place_name,
        lat: feature.center[1],
        lon: feature.center[0],
      }));

      setFilteredSuggestions(suggestions);
      setShowDropdown(true);
    } catch (err) {
      console.error('Mapbox autocomplete error:', err);
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    onSearch(suggestion); // Send full object to parent
    setFilteredSuggestions([]);
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city); // Works for manual input
      setCity('');
      setShowDropdown(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 relative z-50">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-300">
        Cumulus 🌦️
      </h1>

      <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={handleInputChange}
          className="px-3 py-2 w-full sm:w-64 rounded-md border dark:bg-gray-800 dark:text-white"
        />

        {showDropdown && filteredSuggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow max-h-48 overflow-y-auto z-50">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="mt-2 sm:mt-0 sm:ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-gray-700 dark:text-gray-200 sm:ml-4 text-xl"
        title="Toggle Dark Mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}
