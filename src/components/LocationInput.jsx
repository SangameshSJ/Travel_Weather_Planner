import React, { useState, useContext, useRef } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import useGeolocation from '../hooks/useGeolocation';
import { getCurrentWeather, getWeatherForecast, getTravelRecommendations } from '../services/weatherService';

const LocationInput = () => {
  const { destination, setDestination, setCurrentWeather, setForecast, 
          setRecommendations, isLoading, setIsLoading, currentLocation } = useContext(WeatherContext);
  const { error } = useGeolocation();
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  
  const popularDestinations = [
    'New York', 'Paris', 'Tokyo', 'London', 'Sydney', 'Rio de Janeiro',
    'Rome', 'Barcelona', 'Dubai', 'Singapore', 'Bangkok', 'Berlin'
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Fetch weather data
      const current = await getCurrentWeather(destination);
      const forecast = await getWeatherForecast(destination);
      const recommendations = getTravelRecommendations(current, forecast);
      
      setCurrentWeather(current);
      setForecast(forecast);
      setRecommendations(recommendations);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    
    if (value.length > 1) {
      const filtered = popularDestinations.filter(dest => 
        dest.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setDestination(suggestion);
    setSuggestions([]);
    inputRef.current.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            value={destination}
            onChange={handleInputChange}
            placeholder="Enter destination city..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !destination.trim()}
          className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium ${
            isLoading || !destination.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {currentLocation && !destination && (
        <div className="mt-4 text-center text-gray-600">
          <p>Your current location: {currentLocation.name}, {currentLocation.country}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};



export default LocationInput;