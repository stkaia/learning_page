'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BitTrainer() {
  const [task, setTask] = useState<{ target: number; subnets: number; step: string } | null>(null);
  const [prefixInput, setPrefixInput] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const generateTask = () => {
    const krummePrefixe = [51, 52, 54, 57, 58, 59, 61];
    const target = krummePrefixe[Math.floor(Math.random() * krummePrefixe.length)];
    const subnets = Math.pow(2, target - 48);
    const step = Math.pow(2, 64 - target).toString(16);

    setTask({ target, subnets, step });
    setPrefixInput('');
    setStepInput('');
    setFeedback(null);
  };

  useEffect(() => {
    generateTask();
  }, []);

  const checkAnswer = () => {
    if (!task) return;
    const p = parseInt(prefixInput);
    const s = stepInput.toLowerCase().trim();

    if (p === task.target && s === task.step) {
      setFeedback({ isCorrect: true, message: 'Korrekt!' });
    } else {
      setFeedback({ isCorrect: false, message: `Fehler! Richtig wäre: /${task.target} mit Schrittweite ${task.step}` });
    }
  };

  if (!task) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link href="/" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>← Menü</Link>
        <span style={{ fontWeight: 600 }}>Der Bit-Detektiv</span>
      </div>

      <div style={{ width: '100%', maxWidth: '800px', background: 'var(--card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>IPv6 Subnetting (Krumme Präfixe)</h2>
        
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          Du hast das Netz <b>...:3000::/48</b>.<br/>
          Teile es in <b>{task.subnets}</b> Subnetze auf.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Wie lautet der neue Präfix? (z.B. 58)</label>
            <input 
              type="number" 
              value={prefixInput} 
              onChange={e => setPrefixInput(e.target.value)}
              style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '1.1rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#a1a1aa' }}>Wie lautet die Hexadezimale Schrittweite? (z.B. 40)</label>
            <input 
              type="text" 
              value={stepInput} 
              onChange={e => setStepInput(e.target.value)}
              style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '1.1rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={checkAnswer}
            style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Prüfen
          </button>
          <button 
            onClick={generateTask}
            style={{ flex: 1, padding: '1rem', background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Neue Aufgabe
          </button>
        </div>

        {feedback && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: feedback.isCorrect ? 'var(--success-bg)' : 'var(--error-bg)', borderLeft: `4px solid ${feedback.isCorrect ? 'var(--success)' : 'var(--error)'}`, borderRadius: '0 8px 8px 0' }}>
            <h3 style={{ color: feedback.isCorrect ? 'var(--success)' : 'var(--error)' }}>{feedback.message}</h3>
            {!feedback.isCorrect && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#a1a1aa' }}>Der Bit-Schnitt verläuft bei einem Hex-Zeichen.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
