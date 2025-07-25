import { useState, useEffect, useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';

export default function useGeolocation() {
  const { setCurrentLocation } = useContext(WeatherContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode to get location name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            setCurrentLocation({
              lat: latitude,
              lng: longitude,
              name: data.city || data.locality || 'Your Location',
              country: data.countryName
            });
          } catch (err) {
            setError('Failed to fetch location details');
          }
        },
        (err) => {
          setError(err.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, [setCurrentLocation]);

  return { error };
}