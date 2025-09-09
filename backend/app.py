# backend/app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import time

# Import our custom modules
from virtual_sensor import VirtualSensor
from triage_engine import TriageEngine

# Initialize the Flask app and enable CORS
app = Flask(__name__)
CORS(app) # This allows our React frontend to talk to this server

# Create single instances of our sensor and engine
sensor = VirtualSensor()
engine = TriageEngine()

@app.route('/api/vitals', methods=['GET'])
def get_vitals():
    """
    This is the main endpoint the frontend will call.
    It gets data from the sensor, classifies it with the engine,
    and returns the combined result.
    """
    # Get the latest simulated data
    vitals_data = sensor.get_vitals()

    # Get the triage decision
    triage_class, reasons = engine.classify(vitals_data)

    # Combine everything into one response object
    response = {
        "timestamp": time.time(),
        "vitals": vitals_data,
        "triage": {
            "class": triage_class,
            "reasons": reasons
        }
    }
    return jsonify(response)

@app.route('/api/set_profile', methods=['POST'])
def set_profile():
    """
    This endpoint allows the frontend to change the patient simulation.
    """
    data = request.get_json()
    profile = data.get('profile', 'Stable')
    sensor.set_patient_profile(profile)
    return jsonify({"status": "success", "new_profile": profile})


if __name__ == '__main__':
    # Run the Flask server
    app.run(debug=True, port=5000)