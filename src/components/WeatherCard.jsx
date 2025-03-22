// src/components/WeatherCard.jsx
export default function WeatherCard({ weather }) {
    if (!weather) return null;
  
    const {
      name,
      main: { temp, humidity },
      weather: [details],
      wind: { speed },
    } = weather;
  
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-blue-300">{name}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200">{details.main} - {details.description}</p>
        <div className="mt-4 flex justify-around text-gray-800 dark:text-gray-100">
          <div>
            <p className="text-sm">Temp</p>
            <p className="text-xl font-semibold">{temp}°C</p>
          </div>
          <div>
            <p className="text-sm">Humidity</p>
            <p className="text-xl font-semibold">{humidity}%</p>
          </div>
          <div>
            <p className="text-sm">Wind</p>
            <p className="text-xl font-semibold">{speed} m/s</p>
          </div>
        </div>
      </div>
    );
  }
  