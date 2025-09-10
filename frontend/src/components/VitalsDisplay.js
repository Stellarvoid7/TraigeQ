// frontend/src/components/VitalsDisplay.js (Version 2.2)

import React from 'react';
import './VitalsDisplay.css';
// ... (keep all the icon imports)
import FavoriteIcon from '@mui/icons-material/Favorite';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import SpeedIcon from '@mui/icons-material/Speed';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';


const Vital = ({ label, value, unit, icon, status, animationStyle, onCardClick }) => (
  <div className={`vital-card vital-card--${status}`} onClick={() => onCardClick(label)}>
    <div className="vital-label">
      <span style={animationStyle}>{icon}</span>
      {label}
    </div>
    <div className={`vital-value vital-value--${status}`}>
      {value}
      <span className="vital-unit"> {unit}</span>
    </div>
  </div>
);

const VitalsDisplay = ({ vitals, onCardClick }) => {
  // ... (keep the `if (!vitals)` block and the `getVitalStatus` function exactly the same)
  if (!vitals) {
    return <div className="loading-text">Connecting to device...</div>;
  }
  const getVitalStatus = (label, value) => {
    switch (label) {
      case 'HR':
        if (value >= 120) return 'critical';
        if (value < 50) return 'warning';
        return 'normal';
      case 'SpO2':
        if (value < 90) return 'critical';
        if (value <= 93) return 'warning';
        return 'normal-spo2';
      case 'PI':
        return value < 0.5 ? 'critical' : 'normal';
      case 'RR':
        return (value >= 30 || value < 8) ? 'critical' : 'normal';
      case 'BFI':
         return value > 120 ? 'critical' : 'normal';
      default:
        return 'normal';
    }
  };

  const heartAnimation = {
    animationDuration: vitals.HR > 0 ? `${60 / vitals.HR}s` : 'none',
    animationName: 'pulse',
    animationIterationCount: 'infinite',
  };

  return (
    <div className="vitals-grid">
      <Vital label="HR" value={vitals.HR} unit="bpm" icon={<FavoriteIcon fontSize="inherit" />} status={getVitalStatus('HR', vitals.HR)} animationStyle={heartAnimation} onCardClick={onCardClick} />
      <Vital label="SpO2" value={vitals.SpO2} unit="%" icon={<OpacityIcon fontSize="inherit" />} status={getVitalStatus('SpO2', vitals.SpO2)} onCardClick={onCardClick} />
      <Vital label="PI" value={vitals.PI} unit="%" icon={<SpeedIcon fontSize="inherit" />} status={getVitalStatus('PI', vitals.PI)} onCardClick={onCardClick} />
      <Vital label="RR" value={vitals.RR} unit="bpm" icon={<AirIcon fontSize="inherit" />} status={getVitalStatus('RR', vitals.RR)} onCardClick={onCardClick} />
      <Vital label="BFI" value={vitals.tau_us} unit="μs (τc)" icon={<ScienceIcon fontSize="inherit" />} status={getVitalStatus('BFI', vitals.tau_us)} onCardClick={onCardClick} />
      <Vital label="Signal Trust" value={vitals.SignalTrust} unit="%" icon={<VerifiedUserIcon fontSize="inherit" />} status={getVitalStatus('SignalTrust', vitals.SignalTrust)} onCardClick={onCardClick} />
    </div>
  );
};

export default VitalsDisplay;