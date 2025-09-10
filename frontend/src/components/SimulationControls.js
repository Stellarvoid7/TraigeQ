// frontend/src/components/SimulationControls.js (Corrected)

import React from 'react';
import axios from 'axios';
import './SimulationControls.css';

const API_URL = 'http://127.0.0.1:5000/api/set_profile';

// The component now accepts a function to call when a button is clicked
const SimulationControls = ({ onProfileChangeStart }) => {
  
  const setProfile = async (profileName) => {
    // 1. Trigger the "calculation started" sound immediately
    if (onProfileChangeStart) {
        onProfileChangeStart();
    }
    
    // 2. Then, send the request to the backend
    try {
      await axios.post(API_URL, { profile: profileName });
      console.log(`Switched to ${profileName} profile`);
    } catch (error) { // <-- The missing curly braces are now added here
      console.error("Error setting profile:", error);
    }
  };

  return (
    <div className="sim-controls">
      <p className="sim-label">SIMULATION PROFILES:</p>
      <button className="sim-button--minor" onClick={() => setProfile('Minor')}>Minor</button>
      <button className="sim-button--delayed" onClick={() => setProfile('Delayed')}>Delayed</button>
      <button className="sim-button--immediate" onClick={() => setProfile('Immediate')}>Immediate</button>
      <button className="sim-button--assess" onClick={() => setProfile('Assess')}>Assess</button>
    </div>
  );
};

export default SimulationControls;