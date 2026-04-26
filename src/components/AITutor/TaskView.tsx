import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './AITutor.module.css';

export interface Task {
  taskType: 'completion' | 'question' | 'troubleshooting';
  prompt: string;
  sentence: string;
  expectedAnswerFormat: string;
}

export interface Evaluation {
  isCorrect: boolean;
  points?: number;
  correction?: string;
  explanation: string;
  topicsToReview: string[];
}

interface TaskViewProps {
  task: Task;
  onEvaluate: (answer: string) => Promise<void>;
  evaluation: Evaluation | null;
  onNextTask: () => void;
  onEndSession: () => void;
  isLoading: boolean;
}

export const TaskView: React.FC<TaskViewProps> = ({
  task,
  onEvaluate,
  evaluation,
  onNextTask,
  onEndSession,
  isLoading
}) => {
  const [answer, setAnswer] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Clear state when task changes
  React.useEffect(() => {
    setAnswer('');
    setUserQuestion('');
    setChatAnswer('');
  }, [task]);

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'completion': return 'Fachbegriff ergänzen';
      case 'question': return 'AP2 Prüfungsfrage';
      case 'troubleshooting': return 'Fehlersuche & Lösung';
      default: return 'Übung';
    }
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim() || isAsking) return;
    setIsAsking(true);
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask-question',
          task,
          userAnswer: answer,
          evaluation,
          userQuestion
        })
      });
      const data = await res.json();
      setChatAnswer(data.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleSkip = () => {
    onEvaluate(''); // Send empty answer to trigger skip logic in AI
  };

  return (
    <div className={styles.card}>
      <div className={styles.taskHeader}>
        <span className={`${styles.badge} ${
          task.taskType === 'completion' ? styles.badgeCompletion : 
          task.taskType === 'question' ? styles.badgeQuestion : styles.badgeTroubleshooting
        }`}>
          {getTaskTypeLabel(task.taskType)}
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>IHK AP2 PREP</span>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>AUFGABE</h2>
        {task.prompt && <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>{task.prompt}</p>}
        <p className={styles.taskText}>{task.sentence}</p>
        <p style={{ color: '#64ffda', fontSize: '0.9rem', fontStyle: 'italic' }}>
          <strong>Hinweis:</strong> {task.expectedAnswerFormat}
        </p>
      </div>

      {!evaluation ? (
        <div className={styles.inputGroup}>
          <textarea
            className={styles.inputField}
            placeholder="Schreibe deine Antwort tutaj..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <button 
              className={styles.button}
              onClick={() => onEvaluate(answer)}
              disabled={isLoading || !answer.trim()}
              style={{ flex: 2 }}
            >
              {isLoading ? 'Prüfung läuft...' : 'Antwort absenden'}
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={handleSkip}
              disabled={isLoading}
              style={{ flex: 1, borderColor: '#94a3b8', color: '#94a3b8' }}
            >
              Ich weiß es nicht
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.feedbackArea}>
          <div className={styles.statusHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {evaluation.isCorrect ? (
                <span className={styles.correct}>✓ Richtig</span>
              ) : (
                <span className={styles.wrong}>{evaluation.points && evaluation.points > 0 ? '⚠ Fast richtig' : '✗ Lösung'}</span>
              )}
            </div>
            {evaluation.points !== undefined && (
              <div style={{ color: '#64ffda', fontWeight: 800, fontSize: '1.2rem' }}>
                {evaluation.points} / 4 <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PKT</span>
              </div>
            )}
          </div>

          {answer && (
            <div className={styles.section} style={{ borderLeftColor: evaluation.isCorrect ? '#10b981' : '#f87171' }}>
              <div className={styles.sectionTitle}>Deine Antwort</div>
              <div style={{ 
                color: evaluation.isCorrect ? '#64ffda' : '#fca5a5', 
                textDecoration: evaluation.isCorrect ? 'none' : 'line-through',
                opacity: evaluation.isCorrect ? 1 : 0.8,
                fontWeight: 600
              }}>
                {answer}
              </div>
            </div>
          )}

          {evaluation.correction && (
            <div className={styles.section} style={{ borderLeftColor: '#34d399' }}>
              <div className={styles.sectionTitle}>Feedback & Lösung</div>
              <div style={{ color: '#64ffda', fontWeight: 600, fontSize: '1.1rem' }}>{evaluation.correction}</div>
            </div>
          )}

          <div className={styles.section} style={{ borderLeftColor: '#60a5fa' }}>
            <div className={styles.sectionTitle}>Erklärung</div>
            <div className={styles.markdownBody}>
              <ReactMarkdown>{String(evaluation.explanation || 'Keine Erklärung verfügbar.')}</ReactMarkdown>
            </div>
          </div>

          <div className={styles.chatSection}>
            <div className={styles.chatTitle}>
              <span>💬</span> Frage an den Tutor
            </div>
            <div className={styles.chatInputGroup}>
              <input 
                type="text" 
                className={styles.chatInput} 
                placeholder="Frag etwas do tego zadania..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              />
              <button 
                className={styles.chatButton} 
                onClick={handleAskQuestion}
                disabled={isAsking || !userQuestion.trim()}
              >
                {isAsking ? '...' : 'Fragen'}
              </button>
            </div>
            {chatAnswer && (
              <div className={styles.chatAnswer}>
                <ReactMarkdown>{chatAnswer}</ReactMarkdown>
              </div>
            )}
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.button} onClick={onNextTask} disabled={isLoading} style={{ margin: 0, flex: 2 }}>
              Nächste Übung
            </button>
            <button className={styles.secondaryButton} onClick={onEndSession} disabled={isLoading} style={{ borderColor: '#f87171', color: '#f87171' }}>
              Beenden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
