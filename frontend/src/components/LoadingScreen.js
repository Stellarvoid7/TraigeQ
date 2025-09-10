// frontend/src/components/LoadingScreen.js

import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onStart }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <h1 className="loading-title">TriageQ</h1>
        <p className="loading-subtitle">Ready for EMS Triage Simulation</p>
        <button className="begin-button" onClick={onStart}>
          Begin
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;