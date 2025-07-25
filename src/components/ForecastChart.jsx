import React, { useContext, useEffect, useRef } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import useBackgroundTask from '../hooks/useBackgroundTask';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const ForecastChart = ({ forecast }) => {
  const canvasRef = useRef(null);
  const { runInBackground } = useBackgroundTask();
  const { networkStatus } = useContext(WeatherContext);
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  useEffect(() => {
    if (!isVisible || !forecast.length) return;
    
    const drawChart = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Find min/max temperatures for scaling
      const temps = forecast.map(day => [day.high, day.low]).flat();
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      const tempRange = maxTemp - minTemp;
      
      // Set up chart dimensions
      const margin = 30;
      const chartWidth = width - margin * 2;
      const chartHeight = height - margin * 2;
      
      // Draw grid
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      
      // Horizontal lines
      const yLines = 5;
      for (let i = 0; i <= yLines; i++) {
        const y = margin + (chartHeight / yLines) * i;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
        
        // Temperature labels
        const temp = maxTemp - (tempRange / yLines) * i;
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(temp)}°C`, margin - 5, y + 4);
      }
      
      // Draw temperature lines
      const pointSpacing = chartWidth / (forecast.length - 1);
      
      // High temperatures
      ctx.beginPath();
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 3;
      
      forecast.forEach((day, i) => {
        const x = margin + i * pointSpacing;
        const y = margin + chartHeight * (1 - (day.high - minTemp) / tempRange);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
      });
      
      ctx.stroke();
      
      // Low temperatures
      ctx.beginPath();
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 3;
      
      forecast.forEach((day, i) => {
        const x = margin + i * pointSpacing;
        const y = margin + chartHeight * (1 - (day.low - minTemp) / tempRange);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#3498db';
        ctx.fill();
      });
      
      ctx.stroke();
      
      // Draw day labels
      ctx.fillStyle = '#333';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      
      forecast.forEach((day, i) => {
        const x = margin + i * pointSpacing;
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        ctx.fillText(dayName, x, height - 10);
        
        // Draw weather icon
        ctx.font = '20px sans-serif';
        ctx.fillText(day.icon, x, margin - 15);
      });
      
      // Draw legend
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      
      // High temp legend
      ctx.fillStyle = '#e74c3c';
      ctx.fillText('High', width - 100, margin + 20);
      
      // Low temp legend
      ctx.fillStyle = '#3498db';
      ctx.fillText('Low', width - 100, margin + 45);
    };
    
    // Use Background Tasks API for smoother rendering on low-power devices
    if (networkStatus?.effectiveType.includes('2g') || 
      networkStatus?.effectiveType.includes('3g')) {
    const taskId = runInBackground(drawChart);
    return () => cancelBackgroundTask(taskId);
  } else {
    drawChart();
  }
}, [forecast, isVisible, networkStatus, runInBackground, cancelBackgroundTask]);

  if (!forecast.length) return null;

  return (
    <div 
      ref={ref}
      className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <h3 className="text-xl font-bold mb-4">7-Day Forecast</h3>
      <canvas 
        ref={canvasRef} 
        width="800" 
        height="400"
        className="w-full h-64 md:h-80"
      ></canvas>
    </div>
  );
};

export default ForecastChart;