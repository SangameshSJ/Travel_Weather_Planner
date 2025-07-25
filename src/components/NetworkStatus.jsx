import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import useBackgroundTask from '../hooks/useBackgroundTask';

const NetworkStatus = () => {
  const { networkStatus, cachedData } = useContext(WeatherContext);
  const { runInBackground } = useBackgroundTask();
  
  if (!networkStatus) return null;
  
  // Determine network status display
  const getStatusInfo = () => {
    if (!networkStatus.online) {
      return {
        text: 'Offline Mode',
        color: 'bg-red-100 text-red-800',
        icon: '📴'
      };
    }
    
    switch (networkStatus.effectiveType) {
      case 'slow-2g':
      case '2g':
        return {
          text: 'Slow Network (2G)',
          color: 'bg-orange-100 text-orange-800',
          icon: '🐢'
        };
      case '3g':
        return {
          text: 'Moderate Network (3G)',
          color: 'bg-yellow-100 text-yellow-800',
          icon: '🚶'
        };
      case '4g':
        return {
          text: 'Fast Network (4G)',
          color: 'bg-green-100 text-green-800',
          icon: '🚀'
        };
      default:
        return {
          text: 'Online',
          color: 'bg-blue-100 text-blue-800',
          icon: '🌐'
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  // Sync cached data when network improves
  const handleSync = () => {
    if (networkStatus.online && Object.keys(cachedData.forecasts).length > 0) {
      runInBackground(() => {
        console.log('Syncing cached weather data...');
        // In a real app, this would sync with a backend
        setTimeout(() => {
          console.log('Data sync complete!');
          // Clear cache after sync
          localStorage.removeItem('weatherCache');
        }, 2000);
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${statusInfo.color}`}>
        <span className="text-xl">{statusInfo.icon}</span>
        <span className="font-medium">{statusInfo.text}</span>
        
        {!networkStatus.online && (
          <button 
            onClick={handleSync}
            className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition"
          >
            Sync when online
          </button>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;