// frontend/src/components/TriageBanner.js

import React from 'react';
import './TriageBanner.css';

// This is a reusable UI component.
// It accepts a "triageClass" as input (a prop) to change its color and text.
const TriageBanner = ({ triageClass = "Assess", reasons = [] }) => {

  const triageInfo = {
    Immediate: { color: '#D32F2F', text: 'IMMEDIATE' }, // Red
    Delayed: { color: '#FBC02D', text: 'DELAYED' },   // Yellow
    Minor: { color: '#388E3C', text: 'MINOR' },     // Green
    Assess: { color: '#616161', text: 'ASSESS' },    // Gray
  };

  const currentInfo = triageInfo[triageClass] || triageInfo.Assess;

  return (
    <div className="triage-banner" style={{ backgroundColor: currentInfo.color }}>
      <div className="triage-class">{currentInfo.text}</div>
      <div className="triage-reasons">
        Reasons: {reasons.join(', ')}
      </div>
    </div>
  );
};

export default TriageBanner;