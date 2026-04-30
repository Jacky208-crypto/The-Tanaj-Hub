import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizPlayer from '../components/QuizPlayer';
import styles from './Quiz.module.css';
import { quizzes, allBooksQuiz } from '../data/quizData';

const BOOKS_WITH_QUIZZES = ['bereshit', 'shemot', 'vaikra', 'bamidbar', 'devarim', 'yehoshua', 'shoftim', 'shmuelAlef', 'shmuelBet', 'melajimAlef', 'melajimBet', 'neviimAjaronim', 'ketuvimPoetry', 'iyov', 'rut', 'ester', 'daniel', 'ezra', 'nehemia', 'divreHayamim'];

export default function Quiz() {
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState(null);

  if (activeQuiz) {
    return (
      <QuizPlayer
        quiz={activeQuiz === 'all' ? allBooksQuiz : quizzes[activeQuiz]}
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
        {/* All Books card */}
        <div className={styles.card}>
          <p className={styles.cardTitle}>{allBooksQuiz.label}</p>
          <p className={styles.cardText}>{allBooksQuiz.description}</p>
          <button className={styles.goBtn} onClick={() => setActiveQuiz('all')}>
            GO!
          </button>
        </div>

        {/* Individual book quizzes */}
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
