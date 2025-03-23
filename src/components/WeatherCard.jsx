import { getWeatherIconUrl, getAirQualityLabel } from '../utils/weatherAPI';

export default function WeatherCard({ weather, airQuality }) {
  if (!weather) return null;
  
  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [details],
    wind: { speed },
    sys: { country },
    visibility,
  } = weather;
  
  // Format the date
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Get air quality data if available
  const aqi = airQuality?.list?.[0]?.main?.aqi;
  const airQualityText = aqi ? getAirQualityLabel(aqi) : 'Unavailable';
  
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Left Section - Main Weather Info */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            {name}, {country}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">{formattedDate}</p>
          <div className="flex items-center justify-center md:justify-start mt-4">
            <img 
              src={getWeatherIconUrl(details.icon)} 
              alt={details.description}
              className="w-20 h-20"
            />
            <div className="ml-4">
              <p className="text-5xl font-semibold text-gray-800 dark:text-gray-100">
                {Math.round(temp)}°C
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-300 capitalize">
                {details.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Section - Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Feels Like</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {Math.round(feels_like)}°C
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {humidity}%
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {speed} m/s
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {pressure} hPa
            </p>
          </div>
        </div>
      </div>
      
      {/* Air Quality Section */}
      {airQuality && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Air Quality
          </h3>
          <div className="flex items-center">
            <div 
              className={`
                px-3 py-1 rounded-full text-white font-medium
                ${aqi <= 2 ? 'bg-green-500' : aqi <= 3 ? 'bg-yellow-500' : 'bg-red-500'}
              `}
            >
              {airQualityText}
            </div>
            <p className="ml-4 text-gray-600 dark:text-gray-300">
              Visibility: {(visibility / 1000).toFixed(1)} km
            </p>
          </div>
        </div>
      )}
    </div>
  );
}