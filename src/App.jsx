import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import Home from './pages/Home';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <WeatherProvider>
        <Home />
      </WeatherProvider>
    </ErrorBoundary>
    
  );
}

export default App;