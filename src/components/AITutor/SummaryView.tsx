import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './AITutor.module.css';
import { Evaluation } from './TaskView';

interface Summary {
  feedback: string;
  topicsToLearn: string[];
}

interface SummaryViewProps {
  allEvaluations: Evaluation[];
  onRestart: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ allEvaluations, onRestart }) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/ai-tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate-summary', allEvaluations })
        });
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch summary:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (allEvaluations.length > 0) {
      fetchSummary();
    } else {
      setIsLoading(false);
    }
  }, [allEvaluations]);

  const correctCount = allEvaluations.filter(e => e.isCorrect).length;
  const totalCount = allEvaluations.length;
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className={styles.card} style={{ textAlign: 'center', padding: '4rem' }}>
        <div className={styles.spinner}></div>
        <p style={{ color: '#94a3b8' }}>Analiza Twoich wyników...</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title} style={{ fontSize: '2rem', marginBottom: '1rem' }}>Lern-Zusammenfassung</h2>
      
      <div className={styles.summaryStats}>
        <div className={styles.statBox}>
          <div className={styles.statVal}>{scorePercent}%</div>
          <div className={styles.statLab}>Erfolg</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statVal}>{correctCount}/{totalCount}</div>
          <div className={styles.statLab}>Richtig</div>
        </div>
      </div>

      {summary && (
        <div className={styles.feedbackArea} style={{ marginTop: '2rem' }}>
          <div className={styles.section} style={{ borderLeftColor: '#64ffda' }}>
            <div className={styles.sectionTitle}>Tutor Feedback</div>
            <div className={styles.markdownBody}>
              <ReactMarkdown>{summary.feedback || 'Gute Arbeit! Mach weiter so.'}</ReactMarkdown>
            </div>
          </div>

          {summary.topicsToLearn && summary.topicsToLearn.length > 0 && (
            <div className={styles.section} style={{ borderLeftColor: '#fbbf24' }}>
              <div className={styles.sectionTitle}>Themen zum Wiederholen</div>
              <ul style={{ color: '#cbd5e1', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                {summary.topicsToLearn.map((topic, i) => (
                  <li key={i} style={{ marginBottom: '0.4rem' }}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button className={styles.button} onClick={onRestart} style={{ marginTop: '2rem' }}>
        Neue Sitzung starten
      </button>
    </div>
  );
};
