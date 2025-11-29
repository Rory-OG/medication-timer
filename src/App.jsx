import React from 'react';
import { MedicationProvider } from './context/MedicationContext';
import Dashboard from './components/Dashboard';
import './styles/index.css';

function App() {
  return (
    <MedicationProvider>
      <div className="app-container">
        <Dashboard />
      </div>
    </MedicationProvider>
  );
}

export default App;
