# TriageQ - Quantum-Inspired Optical EMS Triage Device

This is a software prototype of the TriageQ device, a low-cost, quantum-inspired optical sensor for rapid emergency medical screening and prioritization. This application simulates the device's core logic, user interface, and real-time decision support capabilities.

---

## ✨ Features

* **Live Vital Signs Simulation:** The backend generates a realistic, dynamic data stream for Heart Rate (HR), Blood Oxygen (SpO2), Perfusion Index (PI), Respiratory Rate (RR), and the novel Blood-Flow Index (BFI).
* **Live PPG Waveform:** A scrolling waveform visualizes the simulated photoplethysmography (PPG) signal, mimicking a real medical monitor.
* **Automated Triage Engine:** Implements the triage logic from the project specification, automatically classifying the patient's condition into "Immediate," "Delayed," "Minor," or "Assess."
* **Dynamic UI:** The user interface, built with React, updates in real-time. It features a color-coded triage banner, reason codes, and conditional coloring for out-of-range vitals.
* **Interactive Scenario Control:** A control panel allows the user to switch between different patient profiles (e.g., 'Stable', 'Shock') to demonstrate the system's responsiveness.

---

## 💻 Technology Stack

* **Backend:** Python, Flask
* **Frontend:** React.js, JavaScript, CSS
* **Key Libraries:**
    * `axios` for API communication
    * `react-chartjs-2` for waveform display
    * `@mui/material` & `@mui/icons-material` for UI components

---

## 🚀 How to Run This Project

To run this prototype, you need to start both the backend and frontend servers.

### **1. Run the Backend Server**

Open a terminal and navigate to the `backend` directory.

```bash
# Navigate into the backend folder
cd backend

# Install required Python packages
python -m pip install -r requirements.txt

# Run the server
python app.py
