import { useNavigate } from 'react-router-dom';
import QuizPlayer from '../components/QuizPlayer';
import styles from './Quiz.module.css';
import { quizzes, allBooksQuiz } from '../data/quizData';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getQuizAttempts } from '../lib/supabaseClient';

const BOOKS_WITH_QUIZZES = [
  'bereshit', 'shemot', 'vaikra', 'bamidbar', 'devarim',
  'yehoshua', 'shoftim', 'shmuelAlef', 'shmuelBet',
  'melajimAlef', 'melajimBet', 'neviimAjaronim',
  'ketuvimPoetry', 'iyov', 'rut', 'ester',
  'daniel', 'ezra', 'nehemia', 'divreHayamim'
];

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mode, setMode] = useState('menu');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [customQuiz, setCustomQuiz] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [attempts, setAttempts] = useState([]);

  /* Load this account's quiz history whenever we return to the menu.
  useEffect(() => {
    if (!user || mode !== 'menu') return;
    let active = true;
    getQuizAttempts()
      .then((rows) => { if (active) setAttempts(rows); })
      .catch(() => { if (active) setAttempts([]); });
    return () => { active = false; };
  }, [user, mode]);

  // Best score (by percentage) per quiz label.
  const bestByQuiz = attempts.reduce((acc, a) => {
    const pct = a.total ? a.score / a.total : 0;
    const prev = acc[a.quiz_label];
    if (!prev || pct > prev.pct) {
      acc[a.quiz_label] = { score: a.score, total: a.total, pct };
    }
    return acc;
  }, {});
  const bestList = Object.entries(bestByQuiz).sort((a, b) => b[1].pct - a[1].pct);
*/
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

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
          <button
            onClick={() => setMode('menu')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              cursor: 'pointer',
              color: '#555',
              padding: '5px 10px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f0f0f0';
              e.target.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#555';
            }}
          >
            ← Back
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Selected: {selectedBooks.length} book{selectedBooks.length !== 1 && 's'}
        </p>

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

      <button
        className="nav-btn"
        style={{ display: 'block', margin: '20px auto' }}
        onClick={() => setMode('builder')}
      >
        Create Custom Quiz
      </button>

      {user && attempts.length > 0 && (
        <div
          style={{
            maxWidth: '640px',
            margin: '10px auto 30px',
            background: '#f7f9fc',
            border: '1px solid #e3e9f2',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
          }}
        >
          <h2 className={styles.subtitle} style={{ marginTop: 0 }}>Your Progress</h2>
          <p style={{ textAlign: 'center', color: '#555', marginTop: 0 }}>
            {attempts.length} quiz{attempts.length !== 1 && 'zes'} completed
          </p>

          <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1rem' }}>Best scores</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {bestList.map(([label, b]) => (
              <div
                key={label}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.95rem' }}
              >
                <span style={{ color: '#333' }}>{label}</span>
                <strong style={{ color: '#4a90e2' }}>
                  {b.score}/{b.total} ({Math.round(b.pct * 100)}%)
                </strong>
              </div>
            ))}
          </div>

          <h3 style={{ margin: '1rem 0 0.25rem', fontSize: '1rem' }}>Recent attempts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {attempts.slice(0, 5).map((a) => (
              <div
                key={a.id}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.9rem', color: '#555' }}
              >
                <span>{a.quiz_label}</span>
                <span>
                  {a.score}/{a.total}
                  {a.created_at && (
                    <span style={{ color: '#999', marginLeft: '8px' }}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!user && (
        <p style={{ textAlign: 'center', color: '#777', margin: '0 auto 24px', maxWidth: '520px' }}>
          <button
            className={styles.linkInline}
            onClick={() => navigate('/login', { state: { mode: 'signup' } })}
            style={{ background: 'none', border: 'none', color: '#4a90e2', cursor: 'pointer', font: 'inherit', textDecoration: 'underline', padding: 0 }}
          >
            Sign up
          </button>{' '}
          to save your scores and track your progress over time.
        </p>
      )}

      <h2 className={styles.subtitle}>Our Quizzes</h2>

      <div className={styles.cardGrid}>
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