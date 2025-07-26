import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const WeatherCard = ({ weather, isCurrent }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {weather.location} {isCurrent && (
              <span className="text-sm font-normal text-blue-600 ml-2">(Current)</span>
            )}
          </h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-5xl">{weather.icon}</div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-5xl font-bold text-gray-800">{weather.temperature}°C</p>
          <p className="text-lg text-gray-600 capitalize">{weather.condition.toLowerCase()}</p>
        </div>
        
        <div className="text-right space-y-1">
          <p className="text-gray-600">Feels like {weather.feelsLike}°C</p>
          <p className="text-gray-600">Humidity: {weather.humidity}%</p>
          <p className="text-gray-600">Wind: {weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;