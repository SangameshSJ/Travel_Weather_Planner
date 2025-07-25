// Mock weather service since we can't use real API keys in this example
// In a real app, you would use OpenWeatherMap or similar API

export const getCurrentWeather = async (location) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock weather data based on location
  const temperatures = {
    'New York': 22,
    'Paris': 18,
    'Tokyo': 25,
    'London': 16,
    'Sydney': 28,
    'Rio de Janeiro': 30
  };
  
  const conditions = {
    'New York': 'Partly Cloudy',
    'Paris': 'Rainy',
    'Tokyo': 'Sunny',
    'London': 'Cloudy',
    'Sydney': 'Clear',
    'Rio de Janeiro': 'Sunny'
  };
  
  const mockData = {
    location: location,
    temperature: Math.floor(20 + Math.random() * 15),
    condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
    humidity: Math.floor(40 + Math.random() * 40),
    windSpeed: Math.floor(5 + Math.random() * 15),
    feelsLike: Math.floor(18 + Math.random() * 15),
    icon: ['☀️', '🌧️', '☁️', '🌤️'][Math.floor(Math.random() * 4)]
  };
  return mockData;
  
  // return {
  //   location: location,
  //   temperature: temperatures[location] || 20 + Math.floor(Math.random() * 15),
  //   condition: conditions[location] || ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
  //   humidity: 40 + Math.floor(Math.random() * 40),
  //   windSpeed: 5 + Math.floor(Math.random() * 15),
  //   feelsLike: temperatures[location] ? temperatures[location] - 2 : 18 + Math.floor(Math.random() * 15),
  //   icon: conditions[location] === 'Sunny' ? '☀️' : 
  //         conditions[location] === 'Rainy' ? '🌧️' : 
  //         conditions[location] === 'Cloudy' ? '☁️' : '🌤️'
  // };
};

export const getWeatherForecast = async (location) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock forecast data
  const forecast = [];
  const baseTemp = 20 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < 7; i++) {
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      high: baseTemp + 5 + Math.floor(Math.random() * 5),
      low: baseTemp - 5 + Math.floor(Math.random() * 5),
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      precipitation: Math.floor(Math.random() * 30),
      humidity: 40 + Math.floor(Math.random() * 40),
      icon: ['☀️', '🌤️', '☁️', '🌧️'][Math.floor(Math.random() * 4)]
    });
  }
  
  return forecast;
};

export const getTravelRecommendations = (currentWeather, forecast) => {
  const recommendations = [];
  
  // Check for rain
  const rainyDays = forecast.filter(day => day.condition.includes('Rain'));
  if (rainyDays.length > 0) {
    recommendations.push({
      type: 'rain',
      message: `Rain expected on ${rainyDays.length} days during your trip`,
      suggestion: 'Pack an umbrella and waterproof clothing'
    });
  }
  
  // Temperature variance
  const temps = forecast.map(day => day.high);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  
  if (maxTemp - minTemp > 15) {
    recommendations.push({
      type: 'temperature',
      message: 'Large temperature swings expected',
      suggestion: 'Pack layers of clothing'
    });
  }
  
  // Hot weather
  if (maxTemp > 30) {
    recommendations.push({
      type: 'heat',
      message: 'Hot weather expected',
      suggestion: 'Pack light clothing, sunscreen, and stay hydrated'
    });
  }
  
  // Cold weather
  if (minTemp < 10) {
    recommendations.push({
      type: 'cold',
      message: 'Cold weather expected',
      suggestion: 'Pack warm clothing and layers'
    });
  }
  
  // Compare to current location
  if (currentWeather && Math.abs(currentWeather.temperature - forecast[0].high) > 15) {
    recommendations.push({
      type: 'temperature-change',
      message: `Significant temperature difference from home (${Math.abs(currentWeather.temperature - forecast[0].high)}°C)`,
      suggestion: 'Prepare for the temperature change'
    });
  }
  
  return recommendations;
};