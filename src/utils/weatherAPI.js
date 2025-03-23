const API_KEY = '5105c729147245a6224a1a099c3ec8c7'; // Replace with your real key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchCurrentWeather(city) {
  const res = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);

  if (!res.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return res.json();
}

export async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error('Location weather not found');
  return res.json();
}

export async function fetchForecast(lat, lon) {
  const res = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error('Forecast data not found');
  return res.json();
}

export async function fetchAirQuality(lat, lon) {
  const res = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  if (!res.ok) throw new Error('Air quality data not found');
  return res.json();
}

// Helper function to map air quality index to a human-readable label
export function getAirQualityLabel(aqi) {
  const labels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  return labels[aqi - 1] || 'Unknown';
}

// Helper function to get weather icon URL
export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}