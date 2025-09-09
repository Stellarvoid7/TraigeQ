// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TriageBanner from './components/TriageBanner';
import VitalsDisplay from './components/VitalsDisplay';
import SimulationControls from './components/SimulationControls';
import WaveformDisplay from './components/WaveformDisplay';

const API_URL = 'http://127.0.0.1:5000/api/vitals';

function App() {
  const [vitals, setVitals] = useState(null);
  const [triage, setTriage] = useState({ class: "Assess", reasons: ["Initializing..."] });
  const [ppgData, setPpgData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setVitals(response.data.vitals);
        setTriage(response.data.triage);

        const newPoint = response.data.vitals.ppg_point;
        setPpgData(currentData => {
          const updatedData = [...currentData, newPoint];
          if (updatedData.length > 200) {
            return updatedData.slice(updatedData.length - 200);
          }
          return updatedData;
        });

      } catch (error) {
        console.error("Error fetching data from backend:", error);
        setTriage({ class: "Assess", reasons: ["Backend Connection Error"] });
      }
    };

    // Fetch data at a slightly slower, more stable interval
    const intervalId = setInterval(fetchData, 200); 

    // Cleanup function to stop the timer
    return () => clearInterval(intervalId);
  }, []); // The empty array [] ensures this runs only once on startup

  return (
    <div className="App">
      <header className="App-header">
        <h1>TriageQ</h1>
      </header>

      <main>
        <TriageBanner 
          triageClass={triage.class} 
          reasons={triage.reasons} 
        />
        <WaveformDisplay data={ppgData} />
        <VitalsDisplay vitals={vitals} />
      </main>

      <SimulationControls />
    </div>
  );
}

export default App;