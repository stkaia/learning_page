'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Solution = { start: string; end: string };

type Task = {
  targetP: number;
  step: number;
  startHex: number;
  solutions: Solution[];
};

export default function TableTrainer() {
  const [task, setTask] = useState<Task | null>(null);
  const [inputs, setInputs] = useState<{ s: string[]; e: string[] }>({ s: ['', '', '', ''], e: ['', '', '', ''] });
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; results: { s: boolean[]; e: boolean[] } } | null>(null);

  const generateTask = () => {
    const prefixes = [52, 54, 57, 58, 59, 60, 61, 62];
    const targetP = prefixes[Math.floor(Math.random() * prefixes.length)];
    const stepSize = Math.pow(2, 64 - targetP);
    const startHex = 0x3000;
    
    const solutions: Solution[] = [];
    let currentAddr = startHex;

    for (let i = 0; i < 4; i++) {
      const start = currentAddr.toString(16).padStart(4, '0');
      const end = (currentAddr + stepSize - 1).toString(16).padStart(4, '0');
      solutions.push({ start, end });
      currentAddr += stepSize;
    }

    setTask({ targetP, step: stepSize, startHex, solutions });
    setInputs({ s: ['3000', '', '', ''], e: ['', '', '', ''] });
    setFeedback(null);
  };

  useEffect(() => {
    generateTask();
  }, []);

  const handleInputChange = (type: 's' | 'e', index: number, value: string) => {
    const newInputs = { ...inputs };
    newInputs[type][index] = value;
    setInputs(newInputs);
  };

  const validateTable = () => {
    if (!task) return;
    let allCorrect = true;
    const results = { s: [false, false, false, false], e: [false, false, false, false] };

    for (let i = 0; i < 4; i++) {
      const sol = task.solutions[i];
      const sValid = inputs.s[i].toLowerCase() === sol.start;
      const eValid = inputs.e[i].toLowerCase() === sol.end;

      results.s[i] = sValid;
      results.e[i] = eValid;

      if (!sValid || !eValid) allCorrect = false;
    }

    setFeedback({
      isCorrect: allCorrect,
      message: allCorrect ? "Hervorragend! Alle Adressen sind korrekt berechnet." : "Da sind noch Fehler in der Tabelle. Überprüfe die rot markierten Felder!",
      results
    });
  };

  if (!task) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link href="/" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>← Menü</Link>
        <span style={{ fontWeight: 600 }}>Tabellen-Trainer</span>
      </div>

      <div style={{ width: '100%', maxWidth: '900px', background: 'var(--card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Prüfungs-Modus: IPv6 Tabelle ausfüllen</h2>
        
        <div style={{ fontSize: '1.1rem', background: '#1e293b', padding: '15px', borderLeft: '4px solid var(--accent)', marginBottom: '1rem' }}>
          Gegeben: <b>2a02:2e0:3f3:3000::/48</b><br />
          Gesucht: Subnetze für Präfix <b>/{task.targetP}</b>. Füllen Sie die Tabelle aus.
        </div>

        <p style={{ marginBottom: '2rem', color: '#a1a1aa' }}>
          <i>Trage nur die letzten 4 Stellen des 4. Blocks ein (z.B. 3040).</i>
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ background: 'var(--accent)', color: 'white', padding: '12px', border: '1px solid var(--card-border)' }}>Subnetz</th>
                <th style={{ background: 'var(--accent)', color: 'white', padding: '12px', border: '1px solid var(--card-border)' }}>Anfangsadresse (4. Block)</th>
                <th style={{ background: 'var(--accent)', color: 'white', padding: '12px', border: '1px solid var(--card-border)' }}>Endadresse (4. Block)</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3].map((i) => (
                <tr key={i}>
                  <td style={{ padding: '12px', border: '1px solid var(--card-border)' }}>{i + 1}</td>
                  <td style={{ padding: '12px', border: '1px solid var(--card-border)' }}>
                    2a02:2e0:3f3:
                    <input 
                      type="text" 
                      value={inputs.s[i]}
                      onChange={(e) => handleInputChange('s', i, e.target.value)}
                      disabled={i === 0}
                      style={{ 
                        width: '80px', padding: '6px', background: 'rgba(255,255,255,0.05)', color: 'white', 
                        border: feedback && !feedback.results.s[i] ? '1px solid var(--error)' : feedback && feedback.results.s[i] ? '1px solid var(--success)' : '1px solid var(--card-border)',
                        backgroundColor: feedback && !feedback.results.s[i] ? 'rgba(239,68,68,0.2)' : feedback && feedback.results.s[i] ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                        fontFamily: 'monospace', textAlign: 'center', borderRadius: '4px', margin: '0 5px'
                      }}
                    />
                    ::/{task.targetP}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid var(--card-border)' }}>
                    2a02:2e0:3f3:
                    <input 
                      type="text" 
                      value={inputs.e[i]}
                      onChange={(e) => handleInputChange('e', i, e.target.value)}
                      style={{ 
                        width: '80px', padding: '6px', background: 'rgba(255,255,255,0.05)', color: 'white', 
                        border: feedback && !feedback.results.e[i] ? '1px solid var(--error)' : feedback && feedback.results.e[i] ? '1px solid var(--success)' : '1px solid var(--card-border)',
                        backgroundColor: feedback && !feedback.results.e[i] ? 'rgba(239,68,68,0.2)' : feedback && feedback.results.e[i] ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                        fontFamily: 'monospace', textAlign: 'center', borderRadius: '4px', margin: '0 5px'
                      }}
                    />
                    ::/{task.targetP}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={validateTable}
            style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Tabelle prüfen
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
          </div>
        )}
      </div>
    </div>
  );
}
