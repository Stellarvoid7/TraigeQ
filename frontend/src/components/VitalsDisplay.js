// frontend/src/components/VitalsDisplay.js

import React from 'react';
import './VitalsDisplay.css';

// 1. Import the icons we need from Material-UI
import FavoriteIcon from '@mui/icons-material/Favorite'; // Heart for HR
import AirIcon from '@mui/icons-material/Air'; // Wind for RR
import OpacityIcon from '@mui/icons-material/Opacity'; // Water drop for SpO2
import SpeedIcon from '@mui/icons-material/Speed'; // Speedometer for PI
import ScienceIcon from '@mui/icons-material/Science'; // Beaker for BFI
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // Shield for Trust

// A small component for displaying a single vital sign
const Vital = ({ label, value, unit, icon }) => (
  <div className="vital-card">
    <div className="vital-label">
      {/* 2. Add the icon next to the label */}
      {icon}
      {label}
    </div>
    <div className="vital-value">
      {value}
      <span className="vital-unit"> {unit}</span>
    </div>
  </div>
);

// The main component that arranges all the vitals in a grid
const VitalsDisplay = ({ vitals }) => {
  // If vitals data is not available yet, show a loading message
  if (!vitals) {
    return <div className="loading-text">Connecting to device...</div>;
  }

  return (
    <div className="vitals-grid">
      {/* 3. Pass the correct icon component to each Vital */}
      <Vital label="HR" value={vitals.HR} unit="bpm" icon={<FavoriteIcon fontSize="inherit" />} />
      <Vital label="SpO2" value={vitals.SpO2} unit="%" icon={<OpacityIcon fontSize="inherit" />} />
      <Vital label="PI" value={vitals.PI} unit="%" icon={<SpeedIcon fontSize="inherit" />} />
      <Vital label="RR" value={vitals.RR} unit="bpm" icon={<AirIcon fontSize="inherit" />} />
      <Vital label="BFI" value={vitals.tau_us} unit="μs (τc)" icon={<ScienceIcon fontSize="inherit" />} />
      <Vital label="Signal Trust" value={vitals.SignalTrust} unit="%" icon={<VerifiedUserIcon fontSize="inherit" />} />
    </div>
  );
};

export default VitalsDisplay;