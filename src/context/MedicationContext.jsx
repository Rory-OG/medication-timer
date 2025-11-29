import React, { createContext, useContext, useState, useEffect } from 'react';

const MedicationContext = createContext();

const MEDICATIONS = [
  { id: 'focalin-ir-5', name: 'Focalin 5mg (IR)', duration: 4 * 60 * 60 * 1000, type: 'Short Acting' },
  { id: 'focalin-xr', name: 'Focalin XR', duration: 8 * 60 * 60 * 1000, type: 'Extended Release' },
];

export const useMedication = () => {
  return useContext(MedicationContext);
};

export const MedicationProvider = ({ children }) => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('medication_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeDose, setActiveDose] = useState(null);

  useEffect(() => {
    localStorage.setItem('medication_logs', JSON.stringify(logs));
    updateActiveDose();
  }, [logs]);

  // Check for active dose periodically
  useEffect(() => {
    const interval = setInterval(updateActiveDose, 1000 * 60); // Check every minute
    return () => clearInterval(interval);
  }, [logs]);

  const updateActiveDose = () => {
    const now = Date.now();
    // Find the most recent log that is still active
    const active = logs.find(log => {
      const med = MEDICATIONS.find(m => m.id === log.medicationId);
      if (!med) return false;
      const endTime = log.timestamp + med.duration;
      return endTime > now;
    });

    if (active) {
      const med = MEDICATIONS.find(m => m.id === active.medicationId);
      setActiveDose({
        ...active,
        medication: med,
        endTime: active.timestamp + med.duration,
      });
    } else {
      setActiveDose(null);
    }
  };

  const logDose = (medicationId) => {
    const newLog = {
      id: Date.now().toString(),
      medicationId,
      timestamp: Date.now(),
    };
    setLogs([newLog, ...logs]);
  };

  const deleteLog = (logId) => {
    setLogs(logs.filter(log => log.id !== logId));
  };

  return (
    <MedicationContext.Provider value={{ 
      medications: MEDICATIONS, 
      logs, 
      activeDose, 
      logDose,
      deleteLog
    }}>
      {children}
    </MedicationContext.Provider>
  );
};
