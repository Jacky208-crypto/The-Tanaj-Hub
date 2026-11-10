import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getAssignment, getClassQuestions } from '../lib/supabaseClient';
import { getQuizzes, getRandomQuestions, pick } from '../lib/content';
import { assignmentQuiz } from '../lib/assignments';
import { translator } from '../lib/translate';
import { usePageTitle } from '../lib/pageTitle';
import styles from './Classes.module.css';

const SUFFIX = { english: 'en', spanish: 'es', hebrew: 'he' };
const LETTERS = 'ABCDEF';

function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A printable worksheet for a quiz assignment: fresh random questions in the
// chosen language, with the answer key on its own page.
export default function TeachWorksheet() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { isTeacher } = useAuth();
  const { language, t } = useLanguage();
  const [assignment, setAssignment] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [sheetLanguage, setSheetLanguage] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [round, setRound] = useState(0); // "New questions"
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isTeacher) return;
    Promise.all([getAssignment(assignmentId), getQuizzes()])
      .then(([a, q]) => { setAssignment(a); setQuizzes(q || []); })
      .catch(() => setError(true));
  }, [assignmentId, isTeacher]);

  useEffect(() => {
    if (!assignment) return;
    const load = assignment.kind === 'custom'
      ? getClassQuestions(assignment.class_id).then((rows) => shuffled(rows).slice(0, assignment.question_count || 10)
        .map((q) => ({ id: q.id, question_en: q.question, options_en: q.options, correct_index: q.correct_index })))
      : (() => {
        const quiz = assignmentQuiz(assignment, '');
        return getRandomQuestions(quiz.quizKeys, quiz.count, quiz.chapters, quiz.books);
      })();
    load.then(setQuestions).catch(() => setError(true));
  }, [assignment, round]);

  const lang = sheetLanguage || assignment?.classes?.language || language;
  const ts = translator(lang);
  const quiz = quizzes.find((q) => q.key === assignment?.quiz_key);
  const title = assignment?.kind === 'custom' ? ts('classes.kindCustom') : quiz ? pick(quiz, 'label', lang) : '';
  const options = (q) => q[`options_${SUFFIX[lang]}`] || q.options_en;
  usePageTitle(title ? t('a11y.worksheetOf', { name: title }) : null);

  return (
    <div className={`${styles.page} ${styles.printPage}`} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <div className={styles.noPrint}>
          <button className={styles.back} onClick={() => navigate('/teach')}>{t('classes.backToClasses')}</button>
          <div className={styles.buttonRow} style={{ marginTop: 0 }}>
            <select
              className={styles.inputSmall}
              value={lang}
              onChange={(e) => setSheetLanguage(e.target.value)}
              aria-label={t('classes.worksheetLanguage')}
            >
              <option value="english">English</option>
              <option value="spanish">Español</option>
              <option value="hebrew">עברית</option>
            </select>
            <button className={styles.secondary} onClick={() => { setQuestions(null); setRound((r) => r + 1); }}>
              {t('classes.newQuestions')}
            </button>
            <button className={styles.primary} onClick={() => window.print()} disabled={!questions?.length}>
              {t('classes.print')}
            </button>
          </div>
        </div>
        {error && <div className={styles.error}>{t('classes.errGeneric')}</div>}
        {!error && !questions && <p className={styles.empty}>{t('content.loading')}</p>}
        {questions && (
          <div className={styles.worksheet} dir={lang === 'hebrew' ? 'rtl' : 'ltr'}>
            <div className={styles.wsHead}>
              <div>
                <p className={styles.printClass}>{assignment.classes?.name}</p>
                <h1 className={styles.wsTitle}>{title}</h1>
              </div>
              <div className={styles.wsFields}>
                <span>{ts('classes.wsName')} ____________________</span>
                <span>{ts('classes.wsDate')} ____________</span>
              </div>
            </div>
            <ol className={styles.wsQuestions}>
              {questions.map((q) => (
                <li key={q.id}>
                  <p className={styles.wsQuestion}>{pick(q, 'question', lang)}</p>
                  <ol className={styles.wsOptions}>
                    {options(q).map((o, i) => <li key={i}><span className={styles.wsLetter}>{LETTERS[i]}.</span> {o}</li>)}
                  </ol>
                </li>
              ))}
            </ol>
            <div className={styles.wsKey}>
              <h2 className={styles.wsKeyTitle}>{ts('classes.wsAnswerKey')}: {title}</h2>
              <ol className={styles.wsKeyList}>
                {questions.map((q) => <li key={q.id}>{LETTERS[q.correct_index]}</li>)}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
