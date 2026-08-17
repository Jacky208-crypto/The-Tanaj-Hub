import { useState, useMemo, useEffect, useRef } from 'react';
import styles from './QuizPlayer.module.css';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { saveQuizAttempt } from '../lib/supabaseClient';

function shuffleAndPick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, n);

  return picked.map(q => {
    const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: indices.map(i => q.options[i]),
      optionsSp: q.optionsSp ? indices.map(i => q.optionsSp[i]) : undefined,
      optionsHe: q.optionsHe ? indices.map(i => q.optionsHe[i]) : undefined,
    };
  });
}

export default function QuizPlayer({ quiz, onBack }) {
  const { user } = useAuth();
  const { language: uiLanguage, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [flashOption, setFlashOption] = useState(null);
  const [language, setLanguage] = useState(uiLanguage);
  const [sessionKey, setSessionKey] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const savedForSession = useRef(-1);

  const questions = useMemo(
    () => shuffleAndPick(quiz.questions, quiz.count || 5),
    [quiz, sessionKey]
  );

  const finished = index >= questions.length;
  const current = questions[index];

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
  }, [finished, user, sessionKey, quiz.label, score, questions.length]);

  const getQuestion = (q) => {
    if (language === 'spanish' && q.questionSp) return q.questionSp;
    if (language === 'hebrew' && q.questionHe) return q.questionHe;
    return q.question;
  };

  const getOptions = (q) => {
    if (language === 'spanish' && q.optionsSp) return q.optionsSp;
    if (language === 'hebrew' && q.optionsHe) return q.optionsHe;
    return q.options;
  };

  const getCorrect = (q) => {
    if (language === 'spanish' && q.correctSp) return q.correctSp;
    if (language === 'hebrew' && q.correctHe) return q.correctHe;
    return q.correct;
  };

  const handleAnswer = (option) => {
    if (flash) return;
    const isCorrect = option === getCorrect(current);
    if (isCorrect) {
      setScore((s) => s + 1);
      setWrongAnswer(null);
    } else {
      setWrongAnswer(getCorrect(current));
    }
    setFlash(isCorrect ? 'correct' : 'incorrect');
    setFlashOption(option);
    setTimeout(() => {
      setFlash(null);
      setFlashOption(null);
      setWrongAnswer(null);
      setIndex((i) => i + 1);
    }, 2000);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setFlash(null);
    setFlashOption(null);
    setWrongAnswer(null);
    setSaveState('idle');
    setSessionKey((k) => k + 1);
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
                background: language === lang ? '#4a90e2' : '#eee',
                color: language === lang ? 'white' : 'black',
              }}
            >
              {lang === 'english' ? 'English' : lang === 'spanish' ? 'Español' : 'עברית'}
            </button>
          ))}
        </div>

        {finished ? (
          <>
            <p className={styles.question}>{t('quizPlayer.finished')}</p>
            <p className={styles.score}>
              {t('quizPlayer.finalScore', { score, total: questions.length })}
            </p>
            {user ? (
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', margin: '0.25rem 0 0.75rem' }}>
                {saveState === 'saving' && ''}
                {saveState === 'saved' && ' '}
                {saveState === 'error' && t('quizPlayer.couldNotSave')}
              </p>
            ) : (
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', margin: '0.25rem 0 0.75rem' }}>
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
              {getQuestion(current)}
            </p>
            <div className={styles.options}>
              {getOptions(current).map((opt) => {
                let cls = styles.optionBtn;
                if (flashOption === opt) {
                  cls += flash === 'correct'
                    ? ` ${styles.correct}`
                    : ` ${styles.incorrect}`;
                }
                return (
                  <button
                    key={opt}
                    className={cls}
                    onClick={() => handleAnswer(opt)}
                    style={{ direction: language === 'hebrew' ? 'rtl' : 'ltr' }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {wrongAnswer && (
              <p style={{
                marginTop: '1rem',
                color: '#e74c3c',
                fontWeight: 'bold',
                textAlign: 'center',
                direction: language === 'hebrew' ? 'rtl' : 'ltr'
              }}>
                {t('quizPlayer.correctAnswer', { answer: wrongAnswer })}
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