import { useState } from 'react';
import styles from './QuizPlayer.module.css';

export default function QuizPlayer({ quiz, onBack }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null); // 'correct' | 'incorrect'
  const [flashOption, setFlashOption] = useState(null);
  const finished = index >= quiz.questions.length;

  const handleAnswer = (option) => {
    if (flash) return; // prevent double-click during animation
    const current = quiz.questions[index];
    const isCorrect = option === current.correct;
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
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {finished ? (
          <>
            <p className={styles.question}>Quiz Finished! 🎉</p>
            <p className={styles.score}>
              Final Score: {score} / {quiz.questions.length}
            </p>
            <button className={styles.restartBtn} onClick={restart}>Play Again</button>
            {onBack && <button className={styles.backLink} onClick={onBack}>← Back to Quizzes</button>}
          </>
        ) : (
          <>
            <p className={styles.question}>{quiz.questions[index].question}</p>
            <div className={styles.options}>
              {quiz.questions[index].options.map((opt) => {
                let cls = styles.optionBtn;
                if (flashOption === opt) {
                  cls += flash === 'correct' ? ` ${styles.correct}` : ` ${styles.incorrect}`;
                }
                return (
                  <button key={opt} className={cls} onClick={() => handleAnswer(opt)}>
                    {opt}
                  </button>
                );
              })}
            </div>
            <p className={styles.score}>Correct Answers: {score}</p>
          </>
        )}
      </div>
    </div>
  );
}
