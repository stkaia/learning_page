'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Task = {
  code: string;
  correctFinalState: number[];
  tableTitle: string;
};

export default function Schreibtischtest() {
  const [task, setTask] = useState<Task | null>(null);
  const [inputs, setInputs] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: React.ReactNode; results: boolean[] } | null>(null);

  const generateTask = () => {
    const taskTypes = ['smoothing', 'interleaving'];
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    
    let code = "";
    let correctFinalState: number[] = [];
    let tableTitle = "";
    
    if (taskType === 'smoothing') {
      const arr = Array.from({ length: 9 }, () => Math.floor(Math.random() * 80) + 20);
      const arrString = '{' + arr.join(', ') + '}';
      
      code = `// Servermonitoring (Werte in Blöcken zusammenfassen)\n// Ziel: Mittelwert aus 3 Werten in der Mitte speichern, Nachbarn auf 0 setzen.\nint[] PerfCPU = new int[] ${arrString};\nint temp = 0;\n\nfor (int i = 1; i < 8; i += 3) {\n    temp = (PerfCPU[i-1] + PerfCPU[i] + PerfCPU[i+1]) / 3;\n    PerfCPU[i-1] = 0;\n    PerfCPU[i] = temp;\n    PerfCPU[i+1] = 0;\n}`;
      
      const currentArr = [...arr];
      for (let i = 1; i < 8; i += 3) {
        const temp = Math.floor((currentArr[i-1] + currentArr[i] + currentArr[i+1]) / 3);
        currentArr[i-1] = 0;
        currentArr[i] = temp;
        currentArr[i+1] = 0;
      }
      correctFinalState = currentArr;
      tableTitle = "Wert (PerfCPU)";
    } else if (taskType === 'interleaving') {
      const arr1 = Array.from({ length: 9 }, () => Math.floor(Math.random() * 50) + 10);
      const arrString = '{' + arr1.join(', ') + '}';
      
      code = `// Speicherzuweisung (Interleaving)\n// Ziel: Nummerierung (1,2,3...) an gerade Indizes, RAM1 Werte an ungerade Indizes.\nint[] RAM1 = new int[] ${arrString};\nint[] RAM2 = new int[18];\n\nfor (int i = 0; i < 9; i++) {\n    RAM2[i * 2] = i + 1;\n    RAM2[i * 2 + 1] = RAM1[i];\n}`;
      
      const RAM2 = new Array(18).fill(0);
      for (let i = 0; i < 9; i++) {
        RAM2[i * 2] = i + 1;
        RAM2[i * 2 + 1] = arr1[i];
      }
      correctFinalState = RAM2.slice(0, 9);
      tableTitle = "Wert (RAM2)";
    }

    setTask({ code, correctFinalState, tableTitle });
    setInputs(new Array(correctFinalState.length).fill(''));
    setFeedback(null);
  };

  useEffect(() => {
    generateTask();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const checkAnswer = () => {
    if (!task) return;
    let allCorrect = true;
    const results = new Array(task.correctFinalState.length).fill(false);

    for (let i = 0; i < task.correctFinalState.length; i++) {
      const val = parseInt(inputs[i]);
      const correctVal = task.correctFinalState[i];

      if (val === correctVal) {
        results[i] = true;
      } else {
        allCorrect = false;
      }
    }

    setFeedback({
      isCorrect: allCorrect,
      message: allCorrect ? <span><h3 style={{color: 'var(--success)'}}>Super! Das Array ist absolut korrekt.</h3></span> : <span><h3 style={{color: 'var(--error)'}}>Es gibt noch Fehler (rot markiert). Versuche es noch einmal!</h3></span>,
      results
    });
  };

  if (!task) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link href="/" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>← Menü</Link>
        <span style={{ fontWeight: 600 }}>Schreibtischtest Trainer</span>
      </div>

      <div style={{ width: '100%', maxWidth: '900px', background: 'var(--card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Schreibtischtest (Trace Table)</h2>
        <p style={{ marginBottom: '1rem', color: '#a1a1aa' }}>Führe einen Schreibtischtest für den folgenden Algorithmus durch. Trage die Werte der Variablen <b>am Ende jedes Schleifendurchlaufs</b> ein.</p>
        
        <div style={{ background: '#000', color: '#4ade80', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1.2rem', margin: '20px 0', whiteSpace: 'pre', overflowX: 'auto', border: '1px solid #334155' }}>
          {task.code}
        </div>

        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ background: '#334155', border: '1px solid #475569', padding: '10px' }}>Index</th>
                {task.correctFinalState.map((_, i) => (
                  <th key={i} style={{ background: '#334155', border: '1px solid #475569', padding: '10px' }}>{i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ background: '#334155', border: '1px solid #475569', padding: '10px' }}>{task.tableTitle}</th>
                {task.correctFinalState.map((_, i) => (
                  <td key={i} style={{ border: '1px solid #475569', padding: '10px' }}>
                    <input 
                      type="number" 
                      value={inputs[i]}
                      onChange={(e) => handleInputChange(i, e.target.value)}
                      style={{ 
                        width: '60px', padding: '8px', textAlign: 'center', borderRadius: '5px', 
                        border: feedback && !feedback.results[i] ? '2px solid var(--error)' : feedback && feedback.results[i] ? '2px solid var(--success)' : '1px solid #94a3b8', 
                        background: feedback && !feedback.results[i] ? 'rgba(239,68,68,0.2)' : feedback && feedback.results[i] ? 'rgba(34,197,94,0.2)' : '#cbd5e1', 
                        fontWeight: 'bold', color: feedback ? 'white' : '#0f172a'
                      }}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
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
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
}
