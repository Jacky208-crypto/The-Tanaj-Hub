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

  // 👉 QUIZ MODE
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

  // 👉 BUILDER MODE
  if (mode === 'builder') {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Create Quiz</h1>

        <button onClick={() => setMode('menu')}>← Back</button>

        {/* Selected count */}
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Selected: {selectedBooks.length} book{selectedBooks.length !== 1 && 's'}
        </p>

        {/* Book selection */}
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

        {/* Question count selector */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ marginBottom: '10px' }}>Number of questions:</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  background: questionCount === num ? '#4a90e2' : '#eee',
                  color: questionCount === num ? 'white' : 'black',
                  fontWeight: questionCount === num ? 'bold' : 'normal',
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <button
            className={styles.goBtn}
            disabled={selectedBooks.length === 0}
            style={{
              opacity: selectedBooks.length === 0 ? 0.5 : 1,
              cursor: selectedBooks.length === 0 ? 'not-allowed' : 'pointer',
              padding: '0.8rem 2rem',
              fontSize: '1rem',
            }}
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
      </div>
    );
  }

  // 👉 MAIN MENU
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

      {/* Create custom quiz */}
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