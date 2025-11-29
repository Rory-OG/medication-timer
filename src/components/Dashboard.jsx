import React, { useState, useEffect } from 'react';
import { useMedication } from '../context/MedicationContext';
import { Clock, Pill, History, Trash2, AlertCircle } from 'lucide-react';

const Timer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = endTime - Date.now();
            setTimeLeft(remaining);
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    if (timeLeft <= 0) return <div className="timer-expired">Dose Complete</div>;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="timer-display">
            <div className="timer-value">
                {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="timer-label">Time Remaining</div>
        </div>
    );
};

const Dashboard = () => {
    const { medications, activeDose, logDose, logs, deleteLog } = useMedication();

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="dashboard">
            <header className="header">
                <h1>Medication Timer</h1>
                <p className="text-muted">Adaptive ADHD Medication Tracker</p>
            </header>

            <section className="status-card card">
                {activeDose ? (
                    <div className="active-status">
                        <div className="status-header">
                            <Pill className="icon-primary" size={24} />
                            <span>Active Dose: {activeDose.medication.name}</span>
                        </div>
                        <Timer endTime={activeDose.endTime} />
                        <div className="expected-end">
                            Ends at {formatTime(activeDose.endTime)}
                        </div>
                    </div>
                ) : (
                    <div className="inactive-status">
                        <Clock size={48} className="text-muted" />
                        <h3>No Active Dose</h3>
                        <p className="text-muted">Log a dose to start tracking</p>
                    </div>
                )}
            </section>

            <section className="actions-section">
                <h2>Log Dose</h2>
                <div className="medication-grid">
                    {medications.map(med => (
                        <button
                            key={med.id}
                            className="med-btn card"
                            onClick={() => logDose(med.id)}
                        >
                            <div className="med-info">
                                <span className="med-name">{med.name}</span>
                                <span className="med-type">{med.type}</span>
                            </div>
                            <div className="med-duration">
                                {med.duration / (1000 * 60 * 60)}h
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="history-section">
                <h2>Recent History</h2>
                <div className="history-list">
                    {logs.length === 0 ? (
                        <p className="text-muted">No history yet.</p>
                    ) : (
                        logs.slice(0, 5).map(log => {
                            const med = medications.find(m => m.id === log.medicationId);
                            return (
                                <div key={log.id} className="history-item card">
                                    <div className="history-info">
                                        <span className="history-time">{formatTime(log.timestamp)}</span>
                                        <span className="history-name">{med?.name || 'Unknown'}</span>
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteLog(log.id)}
                                        aria-label="Delete log"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
