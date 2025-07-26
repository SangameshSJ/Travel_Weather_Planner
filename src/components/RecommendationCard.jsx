import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const RecommendationCard = ({ recommendation }) => {
  const getIcon = () => {
    switch (recommendation.type) {
      case 'rain': return '🌧️';
      case 'heat': return '🔥';
      case 'cold': return '❄️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getIcon()}</span>
        <div>
          <h4 className="font-semibold text-gray-800">{recommendation.message}</h4>
          <p className="text-gray-600 text-sm mt-1">{recommendation.suggestion}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;