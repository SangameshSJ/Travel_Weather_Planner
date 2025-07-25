import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const RecommendationCard = ({ recommendation, index }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  const getIcon = () => {
    switch (recommendation.type) {
      case 'rain':
        return '☔';
      case 'heat':
        return '🔥';
      case 'cold':
        return '❄️';
      case 'temperature':
        return '🌡️';
      case 'temperature-change':
        return '🔄';
      default:
        return 'ℹ️';
    }
  };
  
  const getColor = () => {
    switch (recommendation.type) {
      case 'rain':
        return 'bg-blue-100 border-blue-300';
      case 'heat':
        return 'bg-orange-100 border-orange-300';
      case 'cold':
        return 'bg-cyan-100 border-cyan-300';
      case 'temperature':
        return 'bg-purple-100 border-purple-300';
      case 'temperature-change':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div 
      ref={ref}
      className={`border rounded-lg p-4 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${getColor()}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getIcon()}</span>
        <div>
          <h4 className="font-bold text-lg">{recommendation.message}</h4>
          <p className="text-gray-700">{recommendation.suggestion}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;