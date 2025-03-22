import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { fetchCurrentWeather, fetchWeatherByCoords } from './utils/weatherAPI';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's location on initial load
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByCoords(latitude, longitude);
          setWeather(data);
        } catch (error) {
          console.error('Error fetching location weather:', error);
          // Fallback to a default city
          searchCity('London');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        searchCity('London');
        setLoading(false);
      }
    );
  }, []);

  const searchCity = async (city) => {
    setLoading(true);
    try {
      const data = await fetchCurrentWeather(city);
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('City not found! Please try another one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Navbar onSearch={searchCity} />
      <Home weather={weather} loading={loading} />
    </div>
  );
}