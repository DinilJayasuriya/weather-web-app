const API_KEY = '5105c729147245a6224a1a099c3ec8c7'; // Replace with your real key or .env variable
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
