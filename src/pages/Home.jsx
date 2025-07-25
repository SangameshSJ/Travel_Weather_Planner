import React, { useContext, useEffect } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import LocationInput from '../components/LocationInput';
import WeatherCard from '../components/WeatherCard';
import ForecastChart from '../components/ForecastChart';
import RecommendationCard from '../components/RecommendationCard';
import NetworkStatus from '../components/NetworkStatus';
import useGeolocation from '../hooks/useGeolocation';
import useNetworkStatus from '../hooks/useNetworkStatus';

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

  // Load current location weather when available
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
    
    if (!networkStatus?.online && destination && cachedData.forecasts[destination] && forecast.length === 0) {
      setForecast(cachedData.forecasts[destination]);
    }
  }, [networkStatus, cachedData, currentWeather, forecast, setCurrentWeather, setForecast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Travel Weather Planner</h1>
          <p className="text-gray-600">Plan your trip with confidence using real-time weather insights</p>
        </header>
        
        <LocationInput />
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          {currentWeather && (
            <WeatherCard weather={currentWeather} isCurrent={true} />
          )}
          
          {isLoading && (
            <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {forecast.length > 0 && (
            <>
              <ForecastChart forecast={forecast} />
              
              {recommendations.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Travel Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, index) => (
                      <RecommendationCard 
                        key={index} 
                        recommendation={rec} 
                        index={index} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <footer className="text-center text-gray-600 mt-12">
          <p>Travel Weather Planner &copy; {new Date().getFullYear()}</p>
          <p className="text-sm mt-2">Using Geolocation, Network Information, Background Tasks, Canvas, and Intersection Observer APIs</p>
        </footer>
      </div>
      
      <NetworkStatus />
    </div>
  );
};

// Mock functions for demonstration
const getCurrentWeather = async () => ({});

export default Home;