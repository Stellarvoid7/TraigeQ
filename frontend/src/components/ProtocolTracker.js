// frontend/src/components/ProtocolTracker.js

import React from 'react';
import './ProtocolTracker.css';

const ProtocolTracker = ({ step, message, progress, onVotClick, onHoldClick, isHeld }) => {
  return (
    <div className="protocol-tracker">
      <div className="protocol-info">
        <span className="protocol-step">STEP {step}/4</span>
        <span className="protocol-message">{message}</span>
      </div>
      <div className="protocol-progress-bar">
        <div className="protocol-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="softkeys">
        <button className="softkey">[Cal]</button>
        <button className="softkey" onClick={onVotClick}>[VOT]</button>
        <button className="softkey">[Site]</button>
        <button className="softkey" onClick={onHoldClick}>{isHeld ? '[Resume]' : '[Hold]'}</button>
      </div>
    </div>
  );
};

export default ProtocolTracker;