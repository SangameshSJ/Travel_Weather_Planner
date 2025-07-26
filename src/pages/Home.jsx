import React, { useContext, useEffect } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import LocationInput from '../components/LocationInput';
import WeatherCard from '../components/WeatherCard';
import ForecastChart from '../components/ForecastChart';
import RecommendationCard from '../components/RecommendationCard';
import NetworkStatus from '../components/NetworkStatus';
import useGeolocation from '../hooks/useGeolocation';
import useNetworkStatus from '../hooks/useNetworkStatus';
import { getCurrentWeather } from '../services/weatherService';

const Home = () => {
  const { 
    currentLocation, 
    currentWeather, 
    destination,
    forecast, 
    recommendations, 
    isLoading,
    setCurrentWeather,
    setForecast,
    setRecommendations,
    cachedData,
    networkStatus
  } = useContext(WeatherContext);
  
  useGeolocation();
  useNetworkStatus();


  useEffect(() => {
    if (currentLocation && !currentWeather && !isLoading) {
      const fetchWeather = async () => {
        try {
          const weather = await getCurrentWeather(currentLocation.name);
          setCurrentWeather(weather);
        } catch (err) {
          console.error('Failed to fetch current weather:', err);
        }
      };
      
      fetchWeather();
    }
  }, [currentLocation, currentWeather, isLoading, setCurrentWeather]);

  // Load cached data when offline
  useEffect(() => {
    if (!networkStatus?.online && cachedData.current && !currentWeather) {
      setCurrentWeather(cachedData.current);
    }
    
  
    if (!networkStatus?.online && destination && cachedData?.forecasts?.[destination] && forecast?.length === 0) {
      setForecast(cachedData.forecasts[destination]);
    }
  }, [networkStatus, cachedData, currentWeather, forecast, setCurrentWeather, setForecast]);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Travel Weather Planner</h1>
          <p className="text-lg text-gray-600">Plan your trip with confidence using real-time weather insights</p>
        </header>

        {/* Search and Current Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <LocationInput />
          </div>
          
          {currentWeather && (
            <div className="lg:col-span-2">
              <WeatherCard weather={currentWeather} isCurrent={true} />
            </div>
          )}
        </div>

        {/* Forecast and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {forecast.length > 0 && <ForecastChart forecast={forecast} />}
          </div>
          
          <div className="lg:col-span-1">
            {recommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                <h3 className="text-xl font-bold mb-4">Travel Recommendations</h3>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <RecommendationCard key={index} recommendation={rec} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-12">
          <p className="text-sm">Travel Weather Planner &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">Using Geolocation, Network Information, Background Tasks, Canvas, and Intersection Observer APIs</p>
        </footer>
      </div>
    </div>
  );
};

// Mock functions for demonstration

export default Home;