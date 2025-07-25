import React, { createContext, useState, useEffect, useCallback } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(null);
  const [cachedData, setCachedData] = useState(() => {
    const saved = localStorage.getItem('weatherCache');
    return saved ? JSON.parse(saved) : { current: null, forecasts: {} };
  });

  // Update cache whenever new data comes in
  useEffect(() => {
    localStorage.setItem('weatherCache', JSON.stringify(cachedData));
  }, [cachedData]);

  return (
    <WeatherContext.Provider value={{
      currentLocation,
      setCurrentLocation,
      destination,
      setDestination,
      currentWeather,
      setCurrentWeather,
      forecast,
      setForecast,
      recommendations,
      setRecommendations,
      isLoading,
      setIsLoading,
      networkStatus,
      setNetworkStatus,
      cachedData,
      setCachedData
    }}>
      {children}
    </WeatherContext.Provider>
  );
};