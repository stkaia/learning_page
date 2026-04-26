'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StartView } from '@/components/AITutor/StartView';
import { TaskView, Task, Evaluation } from '@/components/AITutor/TaskView';
import { SummaryView } from '@/components/AITutor/SummaryView';
import styles from '@/components/AITutor/AITutor.module.css';

type AppState = 'start' | 'task' | 'summary';

export default function AITutorPage() {
  const [state, setState] = useState<AppState>('start');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [allEvaluations, setAllEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [stats, setStats] = useState({
    correct: 0,
    wrong: 0,
    streak: 0,
    consecutiveWrong: 0,
    totalPoints: 0
  });

  const generateTask = async (isFirst = false) => {
    setIsLoading(true);
    setEvaluation(null);
    setApiError(null);
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'generate-task',
          previousTasks: allEvaluations.map(e => e.topicsToReview).flat(),
          difficulty: stats.consecutiveWrong >= 5 ? 'very-easy' : 'standard'
        })
      });
      const data = await res.json();
      if (data.error) {
        setApiError(data.error);
        return;
      }
      setCurrentTask(data);
      if (isFirst) setState('task');
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const evaluateTask = async (answer: string) => {
    if (!currentTask) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'evaluate-task', 
          task: currentTask, 
          userAnswer: answer 
        })
      });
      const result = await res.json();
      if (result.error) {
        setApiError(result.error);
        return;
      }

      setEvaluation(result);
      setAllEvaluations(prev => [...prev, result]);
      
      setStats(prev => ({
        correct: prev.correct + (result.isCorrect ? 1 : 0),
        wrong: prev.wrong + (result.isCorrect ? 0 : 1),
        streak: result.isCorrect ? prev.streak + 1 : 0,
        consecutiveWrong: result.isCorrect ? 0 : prev.consecutiveWrong + 1,
        totalPoints: prev.totalPoints + (result.points || 0)
      }));

    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" className={styles.backButton}>
          ← Menu
        </Link>
        
        {state === 'task' && (
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <div className={styles.badge} style={{ background: 'rgba(100, 255, 218, 0.1)', color: '#64ffda', border: '1px solid rgba(100, 255, 218, 0.3)' }}>
              💎 {stats.totalPoints} Pkt
            </div>
            <div className={styles.badge} style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}>
              ✓ {stats.correct}
            </div>
            <div className={styles.badge} style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}>
              ✗ {stats.wrong}
            </div>
            {stats.streak >= 2 && (
              <div className={styles.badge} style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid #fbbf24' }}>
                🔥 {stats.streak}
              </div>
            )}
          </div>
        )}
      </header>

      {apiError && (
        <div style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid #f87171', color: '#f87171', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <strong>Błąd API:</strong> {apiError}
        </div>
      )}

      {state === 'start' && <StartView onStart={() => {
        setAllEvaluations([]);
        setStats({ correct: 0, wrong: 0, streak: 0, consecutiveWrong: 0, totalPoints: 0 });
        generateTask(true);
      }} isLoading={isLoading} />}
      
      {state === 'task' && currentTask && !apiError && (
        <TaskView 
          task={currentTask} 
          onEvaluate={evaluateTask}
          evaluation={evaluation}
          onNextTask={() => generateTask()}
          onEndSession={() => setState('summary')}
          isLoading={isLoading}
        />
      )}

      {state === 'summary' && (
        <SummaryView 
          allEvaluations={allEvaluations} 
          onRestart={() => {
            setAllEvaluations([]);
            setState('start');
          }} 
        />
      )}
    </div>
  );
}
