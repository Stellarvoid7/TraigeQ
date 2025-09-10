
// frontend/src/components/FocusViewModal.js

import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import './FocusViewModal.css';

// Re-register ChartJS elements
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- Definitions for each vital sign ---
const vitalDefinitions = {
  HR: "Heart Rate (HR) is the number of times a person's heart beats per minute (bpm). It's a key indicator of cardiac health and stress.",
  SpO2: "Blood Oxygen Saturation (SpO2) measures the percentage of oxygen in the blood. Low levels can indicate respiratory issues.",
  PI: "Perfusion Index (PI) is an indicator of the pulse strength at the sensor site. A low PI can indicate poor blood flow to the extremities.",
  RR: "Respiratory Rate (RR) is the number of breaths a person takes per minute. It's a critical sign for assessing respiratory function.",
  BFI: "Blood-Flow Index (BFI) is a novel metric derived from light correlation that indicates microvascular blood flow, a key factor in perfusion.",
  'Signal Trust': "Signal Trust is a quality score (0-100%) indicating how reliable the current sensor reading is, accounting for motion and other interference.",
};

// --- NEW: Function to get the interpretation of the current value ---
const getInterpretation = (label, value) => {
  switch (label) {
    case 'HR':
      if (value >= 120) return "This indicates tachycardia (a very fast heart rate).";
      if (value < 50) return "This indicates bradycardia (a slow heart rate).";
      return "This is a normal resting heart rate.";
    case 'SpO2':
      if (value < 90) return "This is a critically low oxygen level (hypoxemia).";
      if (value <= 93) return "This level is borderline and warrants monitoring.";
      return "This is a healthy blood oxygen level.";
    case 'PI':
      if (value < 0.5) return "This indicates very weak peripheral perfusion.";
      return "This indicates strong peripheral perfusion.";
    case 'RR':
      if (value >= 30) return "This indicates tachypnea (abnormally rapid breathing).";
      if (value < 8) return "This indicates bradypnea (abnormally slow breathing).";
      return "This is a normal respiratory rate.";
    case 'BFI':
      if (value > 120) return "This indicates severely restricted microvascular blood flow.";
      return "This indicates excellent microvascular blood flow.";
    case 'Signal Trust':
      if (value < 50) return "The signal quality is poor; the reading is unreliable.";
      return "The signal quality is excellent.";
    default:
      return "";
  }
};


const FocusViewModal = ({ isOpen, onClose, vitalData }) => {
  const [isExplanationVisible, setExplanationVisible] = useState(false);

  if (!isOpen) return null;

  const { label, history, unit, status, currentValue } = vitalData;
  const definition = vitalDefinitions[label] || "No definition available.";
  const interpretation = getInterpretation(label, currentValue); // Get the interpretation text

  // Charting data and options remain the same
  const chartData = {
    labels: Array(history.length).fill(''),
    datasets: [{
      label: label,
      data: history,
      borderColor: status === 'critical' ? '#ff5252' : status === 'warning' ? '#ffc400' : '#00e5ff',
      backgroundColor: status === 'critical' ? 'rgba(255, 82, 82, 0.2)' : status === 'warning' ? 'rgba(255, 196, 0, 0.2)' : 'rgba(0, 229, 255, 0.2)',
      borderWidth: 2,
      pointRadius: 1,
      tension: 0.4,
      fill: true,
    }],
  };
  const options = {
    scales: { y: { ticks: { color: '#ccc' } }, x: { ticks: { color: '#ccc' } } },
    plugins: { legend: { labels: { color: 'white' } } },
    maintainAspectRatio: false,
  };

  return (
    <Modal open={isOpen} onClose={() => { setExplanationVisible(false); onClose(); }}>
      <Box className={`modal-box modal-box--${status}`}>
        <h2 className="modal-title">{label} - 30 Second Trend</h2>
        
        <div className="modal-current-value" onClick={() => setExplanationVisible(!isExplanationVisible)}>
          {currentValue} <span className="modal-unit">{unit}</span>
        </div>
        
        <div className="modal-chart-container">
          <Line data={chartData} options={options} />
        </div>
        
        {isExplanationVisible && (
          <div className="explanation-box">
            <p>{definition}</p>
            {/* NEW: Display the interpretation */}
            <p className="interpretation-text"><strong>Interpretation:</strong> {interpretation}</p>
          </div>
        )}
        
        <button className="modal-close-button" onClick={() => { setExplanationVisible(false); onClose(); }}>Close</button>
      </Box>
    </Modal>
  );
};

export default FocusViewModal;