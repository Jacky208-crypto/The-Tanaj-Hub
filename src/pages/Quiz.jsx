import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizData';
import QuizPlayer from '../components/QuizPlayer';
import styles from './Quiz.module.css';

const BOOKS_WITH_QUIZZES = ['bereshit', 'shemot', 'bamidbar'];

export default function Quiz() {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState(null);

  if (activeQuiz) {
    return (
      <QuizPlayer
        quiz={quizzes[activeQuiz]}
        onBack={() => setActiveQuiz(null)}
      />
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Practice Questions</h1>
      <button className="nav-btn" style={{ display: 'block', margin: '0 auto 30px' }} onClick={() => navigate('/')}>
        ← Home
      </button>

      <h2 className={styles.subtitle}>Our Quizzes</h2>
      <div className={styles.cardGrid}>
        {BOOKS_WITH_QUIZZES.map((key) => {
          const q = quizzes[key];
          return (
            <div key={key} className={styles.card}>
              <p className={styles.cardTitle}>{q.label}</p>
              <p className={styles.cardText}>{q.description}</p>
              <button className={styles.goBtn} onClick={() => setActiveQuiz(key)}>
                GO!
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
