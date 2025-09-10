// frontend/src/components/WaveformDisplay.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const WaveformDisplay = ({ data }) => {
  const chartData = {
    labels: Array(data.length).fill(''),
    datasets: [
      {
        data: data,
        borderColor: '#00c853', // A bright, medical green
        borderWidth: 2,
        pointRadius: 0, // No dots on the line
        tension: 0.4, // Makes the line smooth
      },
    ],
  };

  const options = {
    animation: false, // Turn off animation for real-time feel
    scales: {
      y: {
        display: false, // Hide Y-axis labels
        min: 0.8,
        max: 1.2,
      },
      x: {
        display: false, // Hide X-axis labels
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disable tooltips on hover
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '120px', padding: '0 16px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WaveformDisplay;