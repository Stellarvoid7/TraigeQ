// frontend/src/components/AssessmentStepper.js

import React from 'react';
import './AssessmentStepper.css';

const AssessmentStepper = ({ currentStep, steps, onVotClick, onHoldClick, isHeld }) => {
  return (
    <div className="stepper-container">
      <div className="steps-wrapper">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <div className={`step-circle ${index < currentStep ? 'complete' : ''} ${index === currentStep ? 'active' : ''}`}>
              {index < currentStep ? '✔' : index + 1}
            </div>
            <p className="step-message">{index === currentStep ? step.message : ''}</p>
          </div>
        ))}
      </div>
      <div className="softkeys-stepper">
        <button className="softkey-stepper" onClick={onVotClick} disabled={currentStep !== 2}>[VOT]</button>
        <button className="softkey-stepper" onClick={onHoldClick}>{isHeld ? '[Resume]' : '[Hold]'}</button>
      </div>
    </div>
  );
};

export default AssessmentStepper;