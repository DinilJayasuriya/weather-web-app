import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ForecastSection from './components/ForecastSection';
import MapSection from './components/MapSection';
import { fetchCurrentWeather, fetchWeatherByCoords, fetchForecast, fetchAirQuality } from './utils/weatherAPI';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: null, lon: null });

  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  const fetchLocationData = async (lat, lon) => {
    try {
      const [weatherData, forecastData, airData] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchForecast(lat, lon),
        fetchAirQuality(lat, lon)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setAirQuality(airData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchCity = async (city) => {
    setLoading(true);
    try {
      // First get the weather to extract coordinates
      const weatherData = await fetchCurrentWeather(city);
      setWeather(weatherData);
      
      // Then use coordinates to get forecast and air quality
      const { coord } = weatherData;
      setLocation({ lat: coord.lat, lon: coord.lon });
      
      // Fetch additional data
      const [forecastData, airData] = await Promise.all([
        fetchForecast(coord.lat, coord.lon),
        fetchAirQuality(coord.lat, coord.lon)
      ]);
      
      setForecast(forecastData);
      setAirQuality(airData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('City not found! Please try another one.');
    } finally {
      setLoading(false);
    }
  };
  const fetchWeatherByLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          await fetchLocationData(latitude, longitude);
        } catch (error) {
          console.error('Error fetching location weather:', error);
          searchCity('Colombo'); // fallback
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        searchCity('Colombo'); // fallback
        setLoading(false);
      }
    );
  };
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Navbar onSearch={searchCity} onLocationReload= {fetchWeatherByLocation} />
      <div className="container mx-auto px-4 py-8">
        <Home weather={weather} airQuality={airQuality} loading={loading} />
        
        {forecast && !loading && (
          <ForecastSection forecast={forecast} />
        )}
        
        {location.lat && location.lon && !loading && (
          <MapSection 
            lat={location.lat} 
            lon={location.lon} 
            weatherType={weather?.weather[0]?.main}
          />
        )}
      </div>
    </div>
  );
}