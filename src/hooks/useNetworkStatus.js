import { useState, useEffect, useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';

export default function useNetworkStatus() {
  const { setNetworkStatus } = useContext(WeatherContext);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      
      if (navigator.connection) {
        const connection = navigator.connection;
        setNetworkStatus({
          online: navigator.onLine,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      } else {
        setNetworkStatus({
          online: navigator.onLine,
          effectiveType: 'unknown',
          downlink: 0,
          rtt: 0,
          saveData: false
        });
      }
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateNetworkStatus);
    }

    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, [setNetworkStatus]);

  return isOnline;
}