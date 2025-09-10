

import numpy as np
import time

class VirtualSensor:
    """
    Simulates a realistic PPG sensor providing vital signs.
    Version 2.0 includes four distinct patient profiles with unique
    waveform characteristics for enhanced realism.
    """
    def __init__(self):
        self.patient_profile = 'Minor'
        self.start_time = time.time()

    def set_patient_profile(self, profile='Minor'):
        """Sets the patient simulation profile."""
        print(f"SENSOR V2: Switching to patient profile: {profile}")
        self.patient_profile = profile

    def _generate_ppg_wave(self, vitals):
        """Generates a realistic PPG waveform based on the current profile."""
        t = (time.time() - self.start_time) % 60
        f_heart = vitals.get("HR", 75) / 60.0
        f_resp = vitals.get("RR", 16) / 60.0
        pi = vitals.get("PI", 2.0)
        
        # Base heart rhythm
        ppg = np.sin(2 * np.pi * f_heart * t)

        # Add profile-specific waveform characteristics
        if self.patient_profile == 'Immediate':
            # Fast, shallow (low PI), and noisy waveform
            ppg *= 0.6 # Reduce amplitude
            ppg += np.random.normal(0, 0.15, 1)[0] # Add significant noise
        elif self.patient_profile == 'Delayed':
            # Add some slight irregularity
            ppg += 0.3 * np.sin(2 * np.pi * f_heart * 1.5 * t + 1)
        elif self.patient_profile == 'Assess':
            return 1.0 + np.random.normal(0, 0.05, 1)[0] # Flat, noisy line
        else: # Minor profile
            # Clean, stable wave with respiratory modulation
            ppg += 0.2 * np.sin(2 * np.pi * f_resp * t)
            ppg += np.random.normal(0, 0.05, 1)[0]

        # Scale by perfusion index
        dc_component = 1.0
        ac_component = (pi / 100.0) * dc_component
        ppg = dc_component + ac_component * ppg
        
        return ppg

    def get_vitals(self):
        """
        Returns a dictionary of vital signs based on the current patient profile.
        Thresholds are based on the project PDF.
        """
        vitals = {}
        if self.patient_profile == 'Immediate':
            vitals = {
                "HR": 124, "SpO2": 88, "PI": 0.4, "RR": 32, "tau_us": 135, "SignalTrust": 78
            }
        elif self.patient_profile == 'Delayed':
            # The extra '#' at the end of this dictionary was the error. It is now removed.
            vitals = {
                "HR": 110, "SpO2": 92, "PI": 1.2, "RR": 24, "tau_us": 95, "SignalTrust": 90
            }
        elif self.patient_profile == 'Assess':
            vitals = {
                "HR": 0, "SpO2": 0, "PI": 0, "RR": 0, "tau_us": 0, "SignalTrust": 25
            }
        else: # Default to 'Minor'
            vitals = {
                "HR": 78, "SpO2": 98, "PI": 2.5, "RR": 16, "tau_us": 70, "SignalTrust": 98
            }

        # Add slight random variations to make it feel live
        if self.patient_profile not in ['Assess']:
            vitals['HR'] += np.random.randint(-2, 2)
            vitals['PI'] += np.random.uniform(-0.1, 0.1)

        # Generate the corresponding PPG point
        vitals['ppg_point'] = self._generate_ppg_wave(vitals)
        
        return vitals
    
    def get_vitals(self):
        """
        Returns a dictionary of vital signs based on the current patient profile.
        Thresholds are based on the project PDF.
        """
        vitals = {}
        if self.patient_profile == 'Immediate':
            vitals = {
                "HR": 124, "SpO2": 88, "PI": 0.4, "RR": 32, "tau_us": 135, "SignalTrust": 78
            }
        elif self.patient_profile == 'Delayed':
            vitals = {
                "HR": 110, "SpO2": 92, "PI": 1.2, "RR": 24, "tau_us": 95, "SignalTrust": 90
            }
        # --- CORRECT PLACEMENT for the new profile ---
        elif self.patient_profile == 'VOT_Occlusion':
            # Simulate a finger squeeze: PI and SpO2 drop significantly
            vitals = {
                "HR": 75 + np.random.randint(-2, 2), 
                "SpO2": 85, 
                "PI": 0.1, 
                "RR": 16, 
                "tau_us": 150, 
                "SignalTrust": 95
            }
        elif self.patient_profile == 'Assess':
            vitals = {
                "HR": 0, "SpO2": 0, "PI": 0, "RR": 0, "tau_us": 0, "SignalTrust": 25
            }
        else: # Default to 'Minor'
            vitals = {
                "HR": 78, "SpO2": 98, "PI": 2.5, "RR": 16, "tau_us": 70, "SignalTrust": 98
            }

        # Add slight random variations to make it feel live
        if self.patient_profile not in ['Assess']:
            vitals['HR'] += np.random.randint(-2, 2)
            vitals['PI'] += np.random.uniform(-0.1, 0.1)

        # Generate the corresponding PPG point
        vitals['ppg_point'] = self._generate_ppg_wave(vitals)
        
        return vitals