import { useState, useEffect, useRef } from 'react';
import styles from './QuizPlayer.module.css';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { saveQuizAttempt } from '../lib/supabaseClient';
import { getRandomQuestions, pick } from '../lib/content';
import ContentStatus from './ContentStatus';

const SUFFIX = { english: 'en', spanish: 'es', hebrew: 'he' };

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle each question's answers, applying the same order to every language
// so correct_index keeps pointing at the right answer.
function shuffleOptions(q) {
  const order = shuffled(q.options_en.map((_, i) => i));
  const reorder = (opts) => (opts ? order.map((i) => opts[i]) : null);
  return {
    ...q,
    options_en: reorder(q.options_en),
    options_es: reorder(q.options_es),
    options_he: reorder(q.options_he),
    correct_index: order.indexOf(q.correct_index),
  };
}

// quiz = { label, quizKeys: ['bereshit', …], count, chapters?: { shemot: [1, 2, …] }, books?: { neviimAjaronim: { yona: [] } } }
export default function QuizPlayer({ quiz, onBack }) {
  const { user } = useAuth();
  const { language: uiLanguage, t } = useLanguage();
  const [questions, setQuestions] = useState(null); // null while loading
  const [loadError, setLoadError] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [flashOption, setFlashOption] = useState(null);
  const [language, setLanguage] = useState(uiLanguage);
  const [sessionKey, setSessionKey] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const savedForSession = useRef(-1);

  // Fresh random questions for every run (first play and each "play again").
  useEffect(() => {
    let active = true;
    getRandomQuestions(quiz.quizKeys, quiz.count || 5, quiz.chapters, quiz.books)
      .then((rows) => { if (active) setQuestions(rows.map(shuffleOptions)); })
      .catch((e) => { if (active) setLoadError(e.message); });
    return () => { active = false; };
  }, [quiz, sessionKey]);

  const finished = questions !== null && index >= questions.length;
  const current = questions?.[index];

  // When a quiz finishes, save the attempt for logged-in users (once per run).
  useEffect(() => {
    if (!finished || questions.length === 0) return;
    if (!user) return;
    if (savedForSession.current === sessionKey) return;
    savedForSession.current = sessionKey;
    setSaveState('saving');
    saveQuizAttempt({
      quizLabel: quiz.label || 'Quiz',
      score,
      total: questions.length,
    })
      .then(() => setSaveState('saved'))
      .catch(() => setSaveState('error'));
  }, [finished, user, sessionKey, quiz.label, score, questions]);

  const getOptions = (q) => q[`options_${SUFFIX[language]}`] || q.options_en;

  const handleAnswer = (optionIndex) => {
    if (flash) return;
    const isCorrect = optionIndex === current.correct_index;
    if (isCorrect) {
      setScore((s) => s + 1);
      setWrongAnswer(null);
    } else {
      setWrongAnswer(current.correct_index);
    }
    setFlash(isCorrect ? 'correct' : 'incorrect');
    setFlashOption(optionIndex);
    setTimeout(() => {
      setFlash(null);
      setFlashOption(null);
      setWrongAnswer(null);
      setIndex((i) => i + 1);
    }, 2000);
  };

  // Clears the current questions and fetches a new random set.
  const loadNewQuestions = () => {
    setQuestions(null);
    setLoadError(null);
    setSessionKey((k) => k + 1);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setFlash(null);
    setFlashOption(null);
    setWrongAnswer(null);
    setSaveState('idle');
    loadNewQuestions();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* Language Toggle - at the top inside the card */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {['english', 'spanish', 'hebrew'].map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                background: language === lang ? 'var(--accent2)' : 'var(--bg-hover)',
                color: language === lang ? 'var(--accent2-text)' : 'var(--text-primary)',
              }}
            >
              {lang === 'english' ? 'English' : lang === 'spanish' ? 'Español' : 'עברית'}
            </button>
          ))}
        </div>

        {questions === null ? (
          <ContentStatus error={loadError} onRetry={loadNewQuestions} />
        ) : questions.length === 0 ? (
          <>
            <p className={styles.question}>{t('quizPlayer.noQuestions')}</p>
            {onBack && (
              <button className={styles.backLink} onClick={onBack}>
                {t('quizPlayer.backToQuizzes')}
              </button>
            )}
          </>
        ) : finished ? (
          <>
            <p className={styles.question}>{t('quizPlayer.finished')}</p>
            <p className={styles.score}>
              {t('quizPlayer.finalScore', { score, total: questions.length })}
            </p>
            {user ? (
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--quiz-text)', margin: '0.25rem 0 0.75rem' }}>
                {saveState === 'saving' && ''}
                {saveState === 'saved' && ' '}
                {saveState === 'error' && t('quizPlayer.couldNotSave')}
              </p>
            ) : (
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--quiz-text)', margin: '0.25rem 0 0.75rem' }}>
                {t('quizPlayer.logInToSave')}
              </p>
            )}
            <button className={styles.restartBtn} onClick={restart}>
              {t('quizPlayer.playAgain')}
            </button>
            {onBack && (
              <button className={styles.backLink} onClick={onBack}>
                {t('quizPlayer.backToQuizzes')}
              </button>
            )}
          </>
        ) : (
          <>
            <p
              className={styles.question}
              style={{ direction: language === 'hebrew' ? 'rtl' : 'ltr' }}
            >
              {pick(current, 'question', language)}
            </p>
            <div className={styles.options}>
              {getOptions(current).map((opt, i) => {
                let cls = styles.optionBtn;
                if (flashOption === i) {
                  cls += flash === 'correct'
                    ? ` ${styles.correct}`
                    : ` ${styles.incorrect}`;
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    style={{ direction: language === 'hebrew' ? 'rtl' : 'ltr' }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {wrongAnswer !== null && (
              <p style={{
                marginTop: '1rem',
                color: 'var(--danger)',
                fontWeight: 'bold',
                textAlign: 'center',
                direction: language === 'hebrew' ? 'rtl' : 'ltr'
              }}>
                {t('quizPlayer.correctAnswer', { answer: getOptions(current)[wrongAnswer] })}
              </p>
            )}

            <p className={styles.score}>
              {t('quizPlayer.progress', { i: index + 1, n: questions.length, score })}
            </p>
          </>
        )}
      </div>
    </div>
  );
}