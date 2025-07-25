import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const WeatherCard = ({ weather, isCurrent = false }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // if (!weather) return null;

  return (
    <div 
      ref={ref}
      className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            {weather.location} {isCurrent && <span className="text-sm font-normal text-blue-600">(Current)</span>}
          </h2>
          <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        <div className="text-5xl">{weather.icon}</div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-6xl font-bold">{weather.temperature}°C</p>
          <p className="text-lg text-gray-600">{weather.condition}</p>
        </div>
        
        <div className="text-right">
          <p className="text-gray-600">Feels like {weather.feelsLike}°C</p>
          <p className="text-gray-600">Humidity: {weather.humidity}%</p>
          <p className="text-gray-600">Wind: {weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;