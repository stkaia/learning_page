'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../app/quiz/[id]/page.module.css';

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Props = {
  title: string;
  questions: Question[];
};

export default function QuizEngine({ title, questions: initialQuestions }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...initialQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, [initialQuestions]);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleSelect = (index: number) => {
    if (answered) return;
    
    setSelectedIndex(index);
    setAnswered(true);
    
    if (index === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setAnswered(false);
      setSelectedIndex(null);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    const shuffled = [...initialQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedIndex(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.backBtn}>← Menü</Link>
        </div>
        <div className={styles.card}>
          <div className={styles.resultContainer}>
            <h2>Quiz Beendet!</h2>
            <p style={{ margin: '1rem 0' }}>Dein Ergebnis:</p>
            <div className={styles.scoreCircle}>
              {score}/{questions.length}
            </div>
            <button className={styles.nextBtn} onClick={handleRestart}>Quiz Neustarten</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backBtn}>← Menü</Link>
        <span style={{ fontWeight: 600 }}>{title}</span>
      </div>
      
      <div className={styles.card}>
        <div className={styles.progress}>
          <span>Frage {currentIndex + 1} von {questions.length}</span>
          <span>Punkte: {score}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <h3 className={styles.question}>{currentQ.question}</h3>
        
        <div className={styles.options}>
          {currentQ.options.map((opt, i) => {
            let btnClass = styles.option;
            if (answered) {
              if (i === currentQ.correctIndex) btnClass += ` ${styles.correct}`;
              else if (i === selectedIndex) btnClass += ` ${styles.wrong}`;
            }
            
            return (
              <button 
                key={i} 
                className={btnClass}
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={styles.explanation}>
            <div className={styles.explanationTitle}>Erklärung</div>
            {currentQ.explanation}
          </div>
        )}

        {answered && (
          <button className={styles.nextBtn} onClick={handleNext}>
            {currentIndex < questions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}
          </button>
        )}
      </div>
    </div>
  );
}
