import { useEffect, useRef } from 'react';

export default function MapSection({ lat, lon, weatherType }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  useEffect(() => {
    // We need to dynamically import Leaflet as it's not available server-side
    const loadMap = async () => {
      if (typeof window !== 'undefined') {
        // Make sure we're in the browser
        if (!mapInstanceRef.current) {
          // Only create a new map if one doesn't exist
          const L = await import('leaflet');
          
          // Import CSS for Leaflet
          import('leaflet/dist/leaflet.css');
          
          // Create map
          const map = L.map(mapContainerRef.current).setView([lat, lon], 10);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add a marker at the location
          L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`Current Location: ${lat.toFixed(2)}, ${lon.toFixed(2)}`)
            .openPopup();
          
          // Add weather layer if available
          const weatherLayer = `https://tile.openweathermap.org/map/${getWeatherLayerType(weatherType)}/10/${lat}/${lon}.png?appid=5105c729147245a6224a1a099c3ec8c7`;
          
          L.tileLayer(weatherLayer, {
            attribution: '&copy; OpenWeatherMap',
            opacity: 0.6
          }).addTo(map);
          
          // Store the map instance
          mapInstanceRef.current = map;
        } else {
          // If the map already exists, just update the view and marker
          const L = await import('leaflet');
          mapInstanceRef.current.setView([lat, lon], 10);
          
          // Clear existing markers
          mapInstanceRef.current.eachLayer(layer => {
            if (layer instanceof L.Marker) {
              mapInstanceRef.current.removeLayer(layer);
            }
          });
          
          // Add new marker
          L.marker([lat, lon])
            .addTo(mapInstanceRef.current)
            .bindPopup(`Current Location: ${lat.toFixed(2)}, ${lon.toFixed(2)}`)
            .openPopup();
        }
      }
    };
    
    // Call the function
    loadMap();
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, weatherType]);
  
  // Helper function to determine which weather layer to show
  function getWeatherLayerType(weatherType) {
    if (!weatherType) return 'precipitation_new';
    
    switch (weatherType.toLowerCase()) {
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return 'precipitation_new';
      case 'snow':
        return 'snow';
      case 'clouds':
        return 'clouds_new';
      case 'wind':
        return 'wind';
      case 'temperature':
      default:
        return 'temp_new';
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Weather Map</h2>
      <div 
        ref={mapContainerRef} 
        className="h-96 rounded-xl overflow-hidden shadow-md"
        style={{ width: '100%' }}
      ></div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
        Showing weather map for {lat.toFixed(4)}, {lon.toFixed(4)}
      </p>
    </div>
  );
}
