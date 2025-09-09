# backend/triage_engine.py
import json

class TriageEngine:
    """
    Loads triage rules from a JSON file and classifies patient vitals.
    This is the "brain" of the device, implementing your specified logic.
    """
    def __init__(self, rules_filepath='triage_rules.json'):
        with open(rules_filepath, 'r') as f:
            self.ruleset = json.load(f)
        print("TRIAGE ENGINE: Ruleset version", self.ruleset['version'], "loaded.")
        # [cite_start]We will use the adult default thresholds [cite: 76]
        self.thresholds = self.ruleset['thresholds']['adult']

    def classify(self, vitals):
        """
        Applies the loaded rules to classify the vitals.
        Returns the triage class and reason codes.
        """
        # [cite_start]Rule: Unreliable Signal takes precedence [cite: 81]
        if vitals.get('SignalTrust', 100) < self.thresholds['SignalTrust']['unreliable_lt']:
            return "Assess", ["Signal unreliable"]

        # [cite_start]Rule: Immediate - High Respiratory Rate [cite: 77]
        if vitals.get('RR', 0) >= self.thresholds['RR']['immediate_high_ge']:
            return "Immediate", [f"RR {vitals['RR']}"]

        # [cite_start]Rule: Immediate - Low SpO2 [cite: 77]
        if vitals.get('SpO2', 100) < self.thresholds['SpO2']['immediate_lt']:
            return "Immediate", [f"SpO2 {vitals['SpO2']}%"]
        
        # [cite_start]Rule: Immediate - BFI/PI indicates shock [cite: 80, 84]
        if vitals.get('tau_us', 0) > self.thresholds['BFI']['tau_immediate_gt_us'] and \
           (vitals.get('HR', 0) >= self.thresholds['HR']['tachy_ge'] or vitals.get('PI', 100) < self.thresholds['PI']['veryLow_lt']):
            return "Immediate", ["BFI low", f"HR {vitals['HR']}", f"PI {vitals['PI']}%"]

        # [cite_start]Rule: Delayed - Borderline SpO2 or RR [cite: 86]
        if self.thresholds['SpO2']['borderline_range'][0] <= vitals.get('SpO2', 100) <= self.thresholds['SpO2']['borderline_range'][1] or \
           self.thresholds['RR']['borderline_range'][0] <= vitals.get('RR', 0) <= self.thresholds['RR']['borderline_range'][1]:
            return "Delayed", [f"RR {vitals['RR']}", f"SpO2 {vitals['SpO2']}%"]
        
        # [cite_start]Default Rule: If no critical flags, patient is Minor/Green [cite: 87]
        return "Minor", ["Stable vitals"]

# This allows you to test the file directly
if __name__ == '__main__':
    engine = TriageEngine()
    
    print("\n--- Testing with Stable Vitals ---")
    stable_vitals = {"HR": 75, "SpO2": 98, "PI": 2.0, "RR": 15, "tau_us": 75, "SignalTrust": 95}
    triage_class, reasons = engine.classify(stable_vitals)
    print(f"Class: {triage_class}, Reasons: {reasons}")

    print("\n--- Testing with Shock Vitals ---")
    shock_vitals = {"HR": 125, "SpO2": 91, "PI": 0.4, "RR": 32, "tau_us": 135, "SignalTrust": 95}
    triage_class, reasons = engine.classify(shock_vitals)
    print(f"Class: {triage_class}, Reasons: {reasons}")