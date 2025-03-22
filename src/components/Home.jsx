import WeatherCard from './WeatherCard';
import Loader from './Loader';

export default function Home({ weather, loading }) {
  return (
    <div className="px-4">
      {loading && <Loader />}
      {!loading && <WeatherCard weather={weather} />}
    </div>
  );
}
