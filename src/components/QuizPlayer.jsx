import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuizPlayer.module.css';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { saveQuizAttempt } from '../lib/supabaseClient';
import { getRandomQuestions, pick } from '../lib/content';
import ContentStatus from './ContentStatus';
import QuizReport, { RESULT_POINTS, formatScore } from './QuizReport';

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

// Questions that only make sense with the options in front of you
// ("Which of these…", "All of the above"). In free-response mode these are
// still asked as multiple choice.
const NEEDS_OPTIONS_Q = /which of (these|the following)|\bof the following\b|all of the above|none of the above/i;
const NEEDS_OPTIONS_A = /^(all|none|both) of the above|^both\b|^neither\b/i;
function needsOptions(q) {
  return NEEDS_OPTIONS_Q.test(q.question_en ?? '')
    || (q.options_en ?? []).some((o) => NEEDS_OPTIONS_A.test((o ?? '').trim()));
}

// quiz = { label, quizKeys: ['bereshit', …], count, chapters?: { shemot: [1, 2, …] }, books?: { neviimAjaronim: { yona: [] } } }
export default function QuizPlayer({ quiz, onBack }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language: uiLanguage, t } = useLanguage();
  const [questions, setQuestions] = useState(null); // null while loading
  const [loadError, setLoadError] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // one report item per answered question
  const [flash, setFlash] = useState(null);
  const [flashOption, setFlashOption] = useState(null);
  const [language, setLanguage] = useState(uiLanguage);
  const [mode, setMode] = useState('choice'); // choice | free
  const [draft, setDraft] = useState(''); // free response: what the player wrote
  const [revealed, setRevealed] = useState(false); // free response: answer shown?
  const [sessionKey, setSessionKey] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const [showReport, setShowReport] = useState(false);
  const savedForSession = useRef(-1);

  // Fresh random questions for every run (first play and each "play again").
  useEffect(() => {
    let active = true;
    getRandomQuestions(quiz.quizKeys, quiz.count || 5, quiz.chapters, quiz.books, quiz.types)
      .then((rows) => { if (active) setQuestions(rows.map(shuffleOptions)); })
      .catch((e) => { if (active) setLoadError(e.message); });
    return () => { active = false; };
  }, [quiz, sessionKey]);

  const finished = questions !== null && index >= questions.length;
  const current = questions?.[index];
  const score = answers.reduce((sum, a) => sum + (RESULT_POINTS[a.result] ?? 0), 0);
  const asFree = mode === 'free' && current && !needsOptions(current);

  // When a quiz finishes, save the attempt (with its report) for logged-in users, once per run.
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
      mode,
      details: answers,
    })
      .then(() => setSaveState('saved'))
      .catch(() => setSaveState('error'));
  }, [finished, user, sessionKey, quiz.label, score, questions, mode, answers]);

  const getOptions = (q) => q[`options_${SUFFIX[language]}`] || q.options_en;

  // The report item for the current question.
  const record = (answerText, result, itemMode) => ({
    quiz_key: current.quiz_key,
    book: current.book || null,
    chapter: current.chapter || null,
    mode: itemMode,
    lang: language,
    question: pick(current, 'question', language),
    answer: answerText,
    correct: getOptions(current)[current.correct_index],
    result,
  });

  const handleAnswer = (optionIndex) => {
    if (flash) return;
    const isCorrect = optionIndex === current.correct_index;
    setAnswers((prev) => [...prev, record(getOptions(current)[optionIndex], isCorrect ? 'right' : 'wrong', 'choice')]);
    setWrongAnswer(isCorrect ? null : current.correct_index);
    setFlash(isCorrect ? 'correct' : 'incorrect');
    setFlashOption(optionIndex);
    setTimeout(() => {
      setFlash(null);
      setFlashOption(null);
      setWrongAnswer(null);
      setIndex((i) => i + 1);
    }, 2000);
  };

  // Free response: the player grades themselves after seeing the answer.
  const handleSelfGrade = (result) => {
    setAnswers((prev) => [...prev, record(draft.trim(), result, 'free')]);
    setDraft('');
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  // Clears the current questions and fetches a new random set.
  const loadNewQuestions = () => {
    setQuestions(null);
    setLoadError(null);
    setSessionKey((k) => k + 1);
  };

  const restart = () => {
    setIndex(0);
    setAnswers([]);
    setFlash(null);
    setFlashOption(null);
    setWrongAnswer(null);
    setDraft('');
    setRevealed(false);
    setSaveState('idle');
    setShowReport(false);
    loadNewQuestions();
  };

  const dir = language === 'hebrew' ? 'rtl' : 'ltr';
  // The mode can only be changed before the first answer.
  const modeLocked = answers.length > 0 || draft.length > 0 || flash !== null;

  const pill = (on) => ({
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    background: on ? 'var(--accent2)' : 'var(--bg-hover)',
    color: on ? 'var(--accent2-text)' : 'var(--text-primary)',
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* Language Toggle - at the top inside the card */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {['english', 'spanish', 'hebrew'].map(lang => (
            <button key={lang} onClick={() => setLanguage(lang)} style={pill(language === lang)}>
              {lang === 'english' ? 'English' : lang === 'spanish' ? 'Español' : 'עברית'}
            </button>
          ))}
        </div>

        {/* Answer mode: multiple choice or free response */}
        {!finished && (
          <div className={styles.modeRow}>
            {['choice', 'free'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={modeLocked && mode !== m}
                style={{ ...pill(mode === m), opacity: modeLocked && mode !== m ? 0.4 : 1, cursor: modeLocked ? 'default' : 'pointer' }}
              >
                {m === 'choice' ? t('quizPlayer.modeChoice') : t('quizPlayer.modeFree')}
              </button>
            ))}
          </div>
        )}

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
        ) : finished && showReport && user ? (
          <QuizReport
            details={answers}
            score={score}
            total={questions.length}
            onClose={() => setShowReport(false)}
            closeLabel={t('quizReport.backToResults')}
          />
        ) : finished ? (
          <>
            <p className={styles.question}>{t('quizPlayer.finished')}</p>
            <p className={styles.score}>
              {t('quizPlayer.finalScore', { score: formatScore(score), total: questions.length })}
            </p>
            {user ? (
              <>
                {saveState === 'error' && (
                  <p className={styles.note}>{t('quizPlayer.couldNotSave')}</p>
                )}
                <button className={styles.reportBtn} onClick={() => setShowReport(true)}>
                  {t('quizPlayer.seeReport')}
                </button>
              </>
            ) : (
              <p className={styles.note}>
                <button
                  className={styles.inlineLink}
                  onClick={() => navigate('/login', { state: { mode: 'signup' } })}
                >
                  {t('quizPlayer.signUpForReport')}
                </button>{' '}
                {t('quizPlayer.signUpForReportRest')}
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
            <p className={styles.question} style={{ direction: dir }}>
              {pick(current, 'question', language)}
            </p>

            {asFree ? (
              <div className={styles.freeBox}>
                <textarea
                  className={styles.freeInput}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  readOnly={revealed}
                  placeholder={t('quizPlayer.freePlaceholder')}
                  dir={dir}
                  rows={3}
                  autoFocus
                />
                {!revealed ? (
                  <button
                    className={styles.reportBtn}
                    disabled={!draft.trim()}
                    onClick={() => setRevealed(true)}
                  >
                    {t('quizPlayer.showAnswer')}
                  </button>
                ) : (
                  <>
                    <p className={styles.revealed} style={{ direction: dir }}>
                      {t('quizPlayer.answerIs')} <strong>{getOptions(current)[current.correct_index]}</strong>
                    </p>
                    <p className={styles.note}>{t('quizPlayer.howDidYouDo')}</p>
                    <div className={styles.gradeRow}>
                      <button className={`${styles.gradeBtn} ${styles.gradeWrong}`} onClick={() => handleSelfGrade('wrong')}>
                        {t('quizPlayer.grade.wrong')}
                      </button>
                      <button className={`${styles.gradeBtn} ${styles.gradeHalf}`} onClick={() => handleSelfGrade('half')}>
                        {t('quizPlayer.grade.half')}
                      </button>
                      <button className={`${styles.gradeBtn} ${styles.gradeRight}`} onClick={() => handleSelfGrade('right')}>
                        {t('quizPlayer.grade.right')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {mode === 'free' && (
                  <p className={styles.note}>{t('quizPlayer.needsOptions')}</p>
                )}
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
                        style={{ direction: dir }}
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
                    direction: dir
                  }}>
                    {t('quizPlayer.correctAnswer', { answer: getOptions(current)[wrongAnswer] })}
                  </p>
                )}
              </>
            )}

            <p className={styles.score}>
              {t('quizPlayer.progress', { i: index + 1, n: questions.length, score: formatScore(score) })}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
