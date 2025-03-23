import { useState } from 'react';
import { getWeatherIconUrl } from '../utils/weatherAPI';

export default function ForecastSection({ forecast }) {
  const [activeTab, setActiveTab] = useState('daily');
  
  if (!forecast || !forecast.list) return null;
  
  // Group forecast data by day
  const dailyData = {};
  const hourlyData = [...forecast.list.slice(0, 8)]; // Next 24 hours (3-hour intervals)
  
  // Process forecast data for daily view
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        temps: [],
        icon: item.weather[0].icon,
        description: item.weather[0].description
      };
    }
    
    dailyData[date].temps.push(item.main.temp);
  });
  
  // Calculate min and max temps for each day
  const processedDailyData = Object.values(dailyData).map(day => ({
    ...day,
    minTemp: Math.min(...day.temps),
    maxTemp: Math.max(...day.temps)
  })).slice(0, 5); // Just take 5 days
  
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Forecast</h2>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'daily' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            5-Day
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'hourly' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Hourly
          </button>
        </div>
      </div>
      
      {/* Daily forecast */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {processedDailyData.map((day, idx) => (
            <div 
              key={idx} 
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center"
            >
              <p className="font-semibold text-gray-800 dark:text-gray-200">{day.date}</p>
              <img 
                src={getWeatherIconUrl(day.icon)} 
                alt={day.description}
                className="w-12 h-12 mx-auto my-2"
              />
              <p className="text-gray-600 dark:text-gray-300 capitalize text-sm">{day.description}</p>
              <div className="flex justify-center space-x-2 mt-2">
                <span className="text-gray-800 dark:text-gray-100">{Math.round(day.maxTemp)}°</span>
                <span className="text-gray-500 dark:text-gray-400">{Math.round(day.minTemp)}°</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Hourly forecast */}
      {activeTab === 'hourly' && (
        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-max pb-4">
            {hourlyData.map((item, idx) => {
              const hour = new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
                hour: 'numeric',
                hour12: true
              });
              
              return (
                <div 
                  key={idx} 
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center min-w-32"
                >
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{hour}</p>
                  <img 
                    src={getWeatherIconUrl(item.weather[0].icon)} 
                    alt={item.weather[0].description}
                    className="w-12 h-12 mx-auto my-2"
                  />
                  <p className="text-gray-800 dark:text-gray-100 text-xl">{Math.round(item.main.temp)}°</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>💧 {item.main.humidity}%</span>
                    <span>💨 {Math.round(item.wind.speed)} m/s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}