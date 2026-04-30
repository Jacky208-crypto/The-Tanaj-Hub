import { useState, useMemo } from 'react';
import styles from './QuizPlayer.module.css';

function shuffleAndPick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, n);

  return picked.map(q => {
    // zip options together so they stay in sync across languages
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
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [flashOption, setFlashOption] = useState(null);
  const [language, setLanguage] = useState('english');
  const [sessionKey, setSessionKey] = useState(0);

  const questions = useMemo(
    () => shuffleAndPick(quiz.questions, 5),
    [quiz, sessionKey]
  );

  const finished = index >= questions.length;
  const current = questions[index];

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
    if (isCorrect) setScore((s) => s + 1);
    setFlash(isCorrect ? 'correct' : 'incorrect');
    setFlashOption(option);
    setTimeout(() => {
      setFlash(null);
      setFlashOption(null);
      setIndex((i) => i + 1);
    }, 600);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setFlash(null);
    setFlashOption(null);
    setSessionKey((k) => k + 1); // triggers new random 10 questions
  };

  return (
    <div className={styles.wrapper}>
      {/* Language Toggle */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
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

      <div className={styles.card}>
        {finished ? (
          <>
            <p className={styles.question}>Quiz Finished! 🎉</p>
            <p className={styles.score}>
              Final Score: {score} / {questions.length}
            </p>
            <button className={styles.restartBtn} onClick={restart}>
              Play Again
            </button>
            {onBack && (
              <button className={styles.backLink} onClick={onBack}>
                ← Back to Quizzes
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
            <p className={styles.score}>
              Question {index + 1} / {questions.length} — Correct: {score}
            </p>
          </>
        )}
      </div>
    </div>
  );
}