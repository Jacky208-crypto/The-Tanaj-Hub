import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getStudentClasses, getMyAssignmentAttempts, leaveClass } from '../lib/supabaseClient';
import { getQuizzes, pick } from '../lib/content';
import { formatScore } from '../components/QuizReport';
import QuizPlayer from '../components/QuizPlayer';
import { formatDue } from '../lib/dates';
import styles from './Classes.module.css';

// How many questions an assigned quiz asks.
const ASSIGNMENT_QUESTIONS = 10;

// Student view: the classes I'm in and what each one has assigned.
export default function MyClasses() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { language, t } = useLanguage();
  const [classes, setClasses] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(null); // the quiz object handed to QuizPlayer

  // Errors clear on success, not up front: load() runs inside an effect.
  const load = useCallback(() => {
    Promise.all([getStudentClasses(), getMyAssignmentAttempts(), getQuizzes()])
      .then(([c, a, q]) => { setClasses(c); setAttempts(a); setQuizzes(q || []); setError(''); })
      .catch(() => setError(t('classes.errGeneric')));
  }, [t]);

  useEffect(() => { if (user) load(); }, [user, load]);

  if (!loading && !user) return <Navigate to="/join" replace />;

  if (playing) {
    return <QuizPlayer quiz={playing} onBack={() => { setPlaying(null); load(); }} />;
  }

  const quizByKey = Object.fromEntries(quizzes.map((q) => [q.key, q]));
  // Best attempt per assignment.
  const best = {};
  for (const a of attempts) {
    const pct = a.total ? Number(a.score) / a.total : 0;
    if (!best[a.assignment_id] || pct > best[a.assignment_id].pct) best[a.assignment_id] = { ...a, pct };
  }

  async function handleLeave(classId) {
    if (!window.confirm(t('classes.leaveConfirm'))) return;
    try {
      await leaveClass(classId);
      load();
    } catch {
      setError(t('classes.errGeneric'));
    }
  }

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>{t('classes.myTitle')}</h1>
        <p className={styles.sub}>
          <button className={styles.textBtn} onClick={() => navigate('/join')}>{t('classes.joinAnother')}</button>
        </p>
        {error && <div className={styles.error}>{error}</div>}
        {classes && classes.length === 0 && (
          <div className={styles.card}>
            <p className={styles.empty}>{t('classes.myEmpty')}</p>
          </div>
        )}
        {classes?.map(({ nickname, classes: cls }) => {
          const assignments = [...(cls.assignments || [])].sort((a, b) =>
            (a.due_at || '9999').localeCompare(b.due_at || '9999'));
          return (
            <div key={cls.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>{cls.name}</span>
                <span className={styles.meta}>{t('classes.youAre', { name: nickname })}</span>
              </div>
              <p className={styles.sectionLabel}>{t('classes.assigned')}</p>
              {assignments.length === 0 ? (
                <p className={styles.empty}>{t('classes.noAssignments')}</p>
              ) : (
                <ul className={styles.list}>
                  {assignments.map((a) => {
                    const quiz = quizByKey[a.quiz_key];
                    const result = best[a.id];
                    return (
                      <li key={a.id} className={styles.item}>
                        <div className={styles.itemMain}>
                          <div>{quiz ? pick(quiz, 'label', language) : a.quiz_key}</div>
                          <div className={styles.meta}>
                            {a.due_at && <>{t('classes.due', { date: formatDue(a.due_at, language) })} · </>}
                            {result
                              ? <span className={styles.done}>{t('classes.done', { score: `${formatScore(Number(result.score))}/${result.total}` })}</span>
                              : t('classes.notStarted')}
                          </div>
                        </div>
                        <button
                          className={result ? styles.secondary : styles.primary}
                          onClick={() => setPlaying({
                            label: quiz ? pick(quiz, 'label', 'english') : a.quiz_key,
                            quizKeys: [a.quiz_key],
                            count: ASSIGNMENT_QUESTIONS,
                            assignmentId: a.id,
                          })}
                        >
                          {result ? t('classes.again') : t('classes.start')}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className={styles.hint}>
                <button className={`${styles.textBtn} ${styles.danger}`} onClick={() => handleLeave(cls.id)}>
                  {t('classes.leave')}
                </button>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
