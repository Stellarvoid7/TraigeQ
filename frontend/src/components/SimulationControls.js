// frontend/src/components/SimulationControls.js

import React from 'react';
import axios from 'axios';
import './SimulationControls.css';

const API_URL = 'http://127.0.0.1:5000/api/set_profile';

const SimulationControls = () => {

  const setProfile = async (profileName) => {
    try {
      await axios.post(API_URL, { profile: profileName });
      console.log(`Switched to ${profileName} profile`);
    } catch (error) {
      console.error("Error setting profile:", error);
    }
  };

  return (
    <div className="sim-controls">
      <p className="sim-label">SIMULATION CONTROLS:</p>
      <button onClick={() => setProfile('Stable')}>Stable</button>
      <button onClick={() => setProfile('Shock')}>Shock</button>
      <button onClick={() => setProfile('UnreliableSignal')}>Bad Signal</button>
    </div>
  );
};

export default SimulationControls;