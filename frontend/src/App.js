// frontend/src/App.js (Definitive Final Version)

import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import TriageBanner from './components/TriageBanner';
import VitalsDisplay from './components/VitalsDisplay';
import SimulationControls from './components/SimulationControls';
import WaveformDisplay from './components/WaveformDisplay';
import FocusViewModal from './components/FocusViewModal';
import AssessmentStepper from './components/AssessmentStepper'; // New, creative stepper
import LoadingScreen from './components/LoadingScreen';

const API_URL = 'http://127.0.0.1:5000/api/vitals';

const SOUNDS = {
  START: 'https://www.soundjay.com/buttons/beep-09.mp3',
  MINOR: 'https://actions.google.com/sounds/v1/medical/heart_monitor_beep_single_calm.ogg',
  DELAYED: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
  IMMEDIATE: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg',
  ASSESS: 'https://actions.google.com/sounds/v1/alarms/dosimeter_alarm.ogg'
};

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

const ASSESSMENT_STEPS = [
  { duration: 5, message: "Acquiring stable signal..." },
  { duration: 10, message: "Monitoring vitals..." },
  { duration: 5, message: "VOT window active. Press [VOT] if needed." },
  { duration: 10, message: "Finalizing assessment..." }
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [vitals, setVitals] = useState(null);
  const [triage, setTriage] = useState({ class: "Assess", reasons: ["Initializing..."] });
  const [ppgData, setPpgData] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [modalVital, setModalVital] = useState(null);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [isProtocolRunning, setProtocolRunning] = useState(false);
  const [protocolStep, setProtocolStep] = useState(0);
  const [isHeld, setHeld] = useState(false);
  
  const dataIntervalRef = useRef(null);
  const soundTimeoutRef = useRef(null);
  const audioRefs = useMemo(() => ({
    start: React.createRef(), Minor: React.createRef(), Delayed: React.createRef(), Immediate: React.createRef(), Assess: React.createRef(),
  }), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const newVitals = response.data.vitals;
        setVitals(newVitals);
        setTriage(response.data.triage);
        setPpgData(currentData => [...currentData, newVitals.ppg_point].slice(-200));
        setVitalsHistory(currentHistory => [...currentHistory, newVitals].slice(-150));
      } catch (error) {
        setTriage({ class: "Assess", reasons: ["Backend Connection Error"] });
      }
    };
    if (!isHeld) {
      dataIntervalRef.current = setInterval(fetchData, 200);
    } else if (dataIntervalRef.current) {
      clearInterval(dataIntervalRef.current);
    }
    return () => clearInterval(dataIntervalRef.current);
  }, [isHeld]);

  useEffect(() => {
    const stopAllSounds = () => {
      clearTimeout(soundTimeoutRef.current);
      Object.values(audioRefs).forEach(ref => {
        if (ref.current && !ref.current.paused) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
    const activeSoundRef = audioRefs[triage.class];
    if (activeSoundRef && activeSoundRef.current) {
      stopAllSounds();
      activeSoundRef.current.play().catch(e => console.log("Audio play failed"));
      soundTimeoutRef.current = setTimeout(() => {
        if(activeSoundRef.current) {
          activeSoundRef.current.pause();
          activeSoundRef.current.currentTime = 0;
        }
      }, 30000);
    }
    return () => clearTimeout(soundTimeoutRef.current);
  }, [triage.class, audioRefs]);

  useEffect(() => {
    if (!isProtocolRunning) return;
    if (protocolStep >= ASSESSMENT_STEPS.length) {
      setProtocolRunning(false);
      setAssessmentComplete(true);
      setProtocolStep(0);
      return;
    }
    const timer = setTimeout(() => { setProtocolStep(prev => prev + 1); }, ASSESSMENT_STEPS[protocolStep].duration * 1000);
    return () => clearTimeout(timer);
  }, [isProtocolRunning, protocolStep]);

  const handleStartApp = () => { setIsLoading(false); setProtocolRunning(true); };
  const startProtocol = () => { setProtocolStep(0); setProtocolRunning(true); };
  const handleProfileChangeStart = () => {
    if (audioRefs.start.current) {
      audioRefs.start.current.currentTime = 0;
      audioRefs.start.current.play().catch(e => console.log("Start sound failed to play."));
    }
  };
  const handleVotClick = () => {
    if (!isProtocolRunning || protocolStep !== 2) return;
    handleProfileChangeStart();
    axios.post(API_URL.replace('vitals', 'set_profile'), { profile: 'VOT_Occlusion' });
    setTimeout(() => {
      axios.post(API_URL.replace('vitals', 'set_profile'), { profile: 'Delayed' });
    }, 5000);
  };
  const handleCardClick = (vitalLabel) => {
    if (!vitals) return;
    const keyMap = { 'BFI': 'tau_us', 'Signal Trust': 'SignalTrust' };
    const vitalKey = keyMap[vitalLabel] || vitalLabel;
    const history = vitalsHistory.map(v => v[vitalKey] || 0);
    const unitMap = { HR: 'bpm', SpO2: '%', PI: '%', RR: 'bpm', BFI: 'μs (τc)', 'Signal Trust': '%' };
    setModalVital({
      label: vitalLabel, history: history, unit: unitMap[vitalLabel], currentValue: vitals[vitalKey], status: getVitalStatus(vitalLabel, vitals[vitalKey])
    });
  };
  const handleCloseModal = () => { setModalVital(null); };

  if (isLoading) {
    return <LoadingScreen onStart={handleStartApp} />;
  }

  return (
    <div className="App">
      <audio ref={audioRefs.start} src={SOUNDS.START} />
      <audio ref={audioRefs.Minor} src={SOUNDS.MINOR} loop />
      <audio ref={audioRefs.Delayed} src={SOUNDS.DELAYED} loop />
      <audio ref={audioRefs.Immediate} src={SOUNDS.IMMEDIATE} loop />
      <audio ref={audioRefs.Assess} src={SOUNDS.ASSESS} loop />
      <header className="App-header"><h1>TriageQ</h1></header>
      <main>
        <TriageBanner triageClass={triage.class} reasons={triage.reasons} />
        <WaveformDisplay data={ppgData} />
        <VitalsDisplay vitals={vitals} onCardClick={handleCardClick} />
      </main>
      <div className="controls-section">
        {isProtocolRunning ? (
          <AssessmentStepper
            currentStep={protocolStep} steps={ASSESSMENT_STEPS}
            onVotClick={handleVotClick} onHoldClick={() => setHeld(!isHeld)} isHeld={isHeld}
          />
        ) : (
          assessmentComplete && (
            <>
              <button className="start-assessment-button" onClick={startProtocol}>Begin New Assessment</button>
              <SimulationControls onProfileChangeStart={handleProfileChangeStart} />
            </>
          )
        )}
      </div>
      <FocusViewModal 
        isOpen={!!modalVital} 
        onClose={handleCloseModal}
        vitalData={modalVital} 
      />
    </div>
  );
}

export default App;