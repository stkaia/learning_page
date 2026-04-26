import React from 'react';
import styles from './AITutor.module.css';

interface StartViewProps {
  onStart: () => void;
  isLoading: boolean;
}

export const StartView: React.FC<StartViewProps> = ({ onStart, isLoading }) => {
  return (
    <div className={styles.viewContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>KI-Prüfungstrainer (AP2)</h1>
        <p className={styles.subtitle}>Dein interaktiver Tutor für Fachinformatiker Systemintegration</p>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#d0d0d0' }}>
          Bist du bereit für deine heutige Lektion?
        </p>
        <button 
          className={styles.button} 
          onClick={onStart}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span> Lektion wird geladen...
            </>
          ) : (
            'Lektion starten'
          )}
        </button>
      </div>
    </div>
  );
};
