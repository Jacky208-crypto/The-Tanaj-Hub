import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizPlayer from '../components/QuizPlayer';
import styles from './Quiz.module.css';
import { quizzes, allBooksQuiz } from '../data/quizData';

const BOOKS_WITH_QUIZZES = [
  'bereshit', 'shemot', 'vaikra', 'bamidbar', 'devarim',
  'yehoshua', 'shoftim', 'shmuelAlef', 'shmuelBet',
  'melajimAlef', 'melajimBet', 'neviimAjaronim',
  'ketuvimPoetry', 'iyov', 'rut', 'ester',
  'daniel', 'ezra', 'nehemia', 'divreHayamim'
];

export default function Quiz() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('menu'); // menu | builder | quiz
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [customQuiz, setCustomQuiz] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);

  // 👉 Quiz mode
  if (mode === 'quiz' && customQuiz) {
    return (
      <QuizPlayer
        quiz={customQuiz}
        onBack={() => {
          setMode('menu');
          setCustomQuiz(null);
          setSelectedBooks([]);
        }}
      />
    );
  }

  // 👉 Builder mode
  if (mode === 'builder') {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Create Quiz</h1>

        <button onClick={() => setMode('menu')}>← Back</button>

        <div className={styles.cardGrid}>
          {BOOKS_WITH_QUIZZES.map((key) => {
            const q = quizzes[key];
            const selected = selectedBooks.includes(key);

            return (
              <div
                key={key}
                className={styles.card}
                style={{
                  border: selected ? '2px solid #4a90e2' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedBooks((prev) =>
                    prev.includes(key)
                      ? prev.filter(k => k !== key)
                      : [...prev, key]
                  );
                }}
              >
                <p className={styles.cardTitle}>{q.label}</p>
              </div>
            );
          })}
        </div>

        {/* Question count */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Number of questions:</p>
          <input
            type="number"
            value={questionCount}
            min={1}
            max={50}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
          />
        </div>

        <button
          className={styles.goBtn}
          style={{ marginTop: '20px' }}
          onClick={() => {
            const combinedQuestions = selectedBooks.flatMap(
              key => quizzes[key].questions
            );

            if (combinedQuestions.length === 0) return;

            setCustomQuiz({
              label: 'Custom Quiz',
              description: 'Selected books',
              questions: combinedQuestions,
              count: questionCount
            });

            setMode('quiz');
          }}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  // 👉 Main menu
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Practice Questions</h1>

      <button
        className="nav-btn"
        style={{ display: 'block', margin: '0 auto 30px' }}
        onClick={() => navigate('/')}
      >
        ← Home
      </button>

      {/* Create quiz button */}
      <button
        className="nav-btn"
        style={{ display: 'block', margin: '20px auto' }}
        onClick={() => setMode('builder')}
      >
        Create Custom Quiz
      </button>

      <h2 className={styles.subtitle}>Our Quizzes</h2>

      <div className={styles.cardGrid}>
        {/* All Books */}
        <div className={styles.card}>
          <p className={styles.cardTitle}>{allBooksQuiz.label}</p>
          <p className={styles.cardText}>{allBooksQuiz.description}</p>
          <button
            className={styles.goBtn}
            onClick={() => {
              setCustomQuiz(allBooksQuiz);
              setMode('quiz');
            }}
          >
            GO!
          </button>
        </div>

        {/* Individual books */}
        {BOOKS_WITH_QUIZZES.map((key) => {
          const q = quizzes[key];
          return (
            <div key={key} className={styles.card}>
              <p className={styles.cardTitle}>{q.label}</p>
              <p className={styles.cardText}>{q.description}</p>
              <button
                className={styles.goBtn}
                onClick={() => {
                  setCustomQuiz(quizzes[key]);
                  setMode('quiz');
                }}
              >
                GO!
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}