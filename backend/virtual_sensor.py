# backend/virtual_sensor.py

import numpy as np
import time

# --- Configuration ---
SAMPLE_RATE = 100  # Hz
HEART_RATE_STABLE = 75  # bpm
HEART_RATE_SHOCK = 125 # bpm
RESP_RATE_STABLE = 15 # breaths per minute
SPO2_STABLE = 98 # %
SPO2_LOW = 91 # %
PI_STABLE = 2.0 # %
PI_SHOCK = 0.4 # %

class VirtualSensor:
    """
    Simulates a realistic PPG sensor providing vital signs.
    This acts as the "Digital Twin" of the hardware.
    """
    def __init__(self):
        self.patient_profile = 'Stable'
        self.start_time = time.time()

    def set_patient_profile(self, profile='Stable'):
        """Sets the patient simulation profile."""
        print(f"SENSOR: Switching to patient profile: {profile}")
        self.patient_profile = profile

    def _generate_ppg_wave(self, heart_rate, resp_rate, perfusion_index):
        """Generates a realistic PPG waveform."""
        t = (time.time() - self.start_time) % 60
        
        # Base heart rhythm
        f_heart = heart_rate / 60.0
        ppg = np.sin(2 * np.pi * f_heart * t)
        
        # Add respiratory modulation (slow wave on the baseline)
        f_resp = resp_rate / 60.0
        ppg += 0.2 * np.sin(2 * np.pi * f_resp * t)
        
        # Add some noise to make it realistic
        ppg += np.random.normal(0, 0.05, 1)[0]
        
        # Scale by perfusion index (AC/DC ratio)
        dc_component = 1.0
        ac_component = (perfusion_index / 100.0) * dc_component
        ppg = dc_component + ac_component * ppg
        
        return ppg

    def get_vitals(self):
        """
        Returns a dictionary of vital signs based on the current patient profile.
        """
        if self.patient_profile == 'Shock':
            # Simulate a patient in shock
            hr = HEART_RATE_SHOCK + np.random.randint(-5, 5)
            spo2 = SPO2_LOW
            pi = PI_SHOCK + np.random.uniform(-0.1, 0.1)
            rr = 32 # High respiratory rate
            bfi_tau_us = 135 # Slow decorrelation, indicating poor flow
            
        elif self.patient_profile == 'UnreliableSignal':
            # Simulate a bad reading
            hr, spo2, pi, rr, bfi_tau_us = 0, 0, 0, 0, 0
        
        else: # Default to 'Stable'
            hr = HEART_RATE_STABLE + np.random.randint(-3, 3)
            spo2 = SPO2_STABLE
            pi = PI_STABLE + np.random.uniform(-0.2, 0.2)
            rr = RESP_RATE_STABLE
            bfi_tau_us = 75 # Healthy decorrelation time

        # Generate a PPG point for potential future waveform display
        ppg_point = self._generate_ppg_wave(hr, rr, pi)

        return {
            "HR": hr,
            "SpO2": spo2,
            "PI": round(pi, 2),
            "RR": rr,
            "tau_us": bfi_tau_us, # This is our simulated BFI
            "SignalTrust": 30 if self.patient_profile == 'UnreliableSignal' else 95,
            "ppg_point": ppg_point
        }

# This allows you to test the file directly
if __name__ == '__main__':
    sensor = VirtualSensor()
    
    print("--- Testing Stable Profile ---")
    vitals = sensor.get_vitals()
    print(vitals)

    print("\n--- Testing Shock Profile ---")
    sensor.set_patient_profile('Shock')
    vitals = sensor.get_vitals()
    print(vitals)