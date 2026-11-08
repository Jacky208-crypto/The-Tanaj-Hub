import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getTeacherClasses, createClass, addAssignment, deleteAssignment, removeStudent, archiveClass,
} from '../lib/supabaseClient';
import { getQuizzes, pick } from '../lib/content';
import { formatDue } from '../lib/dates';
import styles from './Classes.module.css';

// A due date picked as YYYY-MM-DD means "by the end of that day" locally.
function endOfDay(dateText) {
  if (!dateText) return null;
  const [y, m, d] = dateText.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59).toISOString();
}

function ClassCard({ cls, quizzes, onChange }) {
  const { language, t } = useLanguage();
  const [quizKey, setQuizKey] = useState('');
  const [due, setDue] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const joinUrl = `${window.location.origin}/join?code=${cls.join_code}`;
  const quizByKey = Object.fromEntries(quizzes.map((q) => [q.key, q]));
  const students = [...(cls.class_members || [])].sort((a, b) => a.nickname.localeCompare(b.nickname));
  const assignments = [...(cls.assignments || [])].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const run = async (fn) => {
    setError('');
    try {
      await fn();
      onChange();
    } catch {
      setError(t('classes.errGeneric'));
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: the link is shown anyway */ }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.cardTitle}>{cls.name}</span>
        <button
          className={`${styles.textBtn} ${styles.danger}`}
          onClick={() => window.confirm(t('classes.archiveConfirm')) && run(() => archiveClass(cls.id))}
        >
          {t('classes.archive')}
        </button>
      </div>

      <div className={styles.codeBox}>
        <span className={styles.code} dir="ltr">{cls.join_code}</span>
        <button className={styles.secondary} onClick={copy}>
          {copied ? t('classes.copied') : t('classes.copyLink')}
        </button>
      </div>
      <p className={styles.hint}>
        {t('classes.shareHint')} <span dir="ltr">{joinUrl}</span>
      </p>

      <p className={styles.sectionLabel}>{t('classes.assignments')}</p>
      <form
        className={styles.row}
        onSubmit={(e) => {
          e.preventDefault();
          if (!quizKey) return;
          run(async () => {
            await addAssignment({ classId: cls.id, quizKey, dueAt: endOfDay(due) });
            setQuizKey('');
            setDue('');
          });
        }}
      >
        <label className={styles.label}>
          {t('classes.assignQuiz')}
          <select className={styles.input} value={quizKey} onChange={(e) => setQuizKey(e.target.value)}>
            <option value="">—</option>
            {quizzes.map((q) => <option key={q.key} value={q.key}>{pick(q, 'label', language)}</option>)}
          </select>
        </label>
        <label className={styles.label}>
          {t('classes.dueDate')}
          <input className={styles.input} type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <button className={styles.primary} type="submit" disabled={!quizKey}>{t('classes.assignBtn')}</button>
      </form>
      {assignments.length > 0 && (
        <ul className={styles.list} style={{ marginTop: 10 }}>
          {assignments.map((a) => (
            <li key={a.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div>{quizByKey[a.quiz_key] ? pick(quizByKey[a.quiz_key], 'label', language) : a.quiz_key}</div>
                {a.due_at && <div className={styles.meta}>{t('classes.due', { date: formatDue(a.due_at, language) })}</div>}
              </div>
              <button
                className={`${styles.textBtn} ${styles.danger}`}
                onClick={() => window.confirm(t('classes.deleteAssignmentConfirm')) && run(() => deleteAssignment(a.id))}
              >
                {t('classes.delete')}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.sectionLabel}>{t('classes.students', { n: students.length })}</p>
      {students.length === 0 ? (
        <p className={styles.empty}>{t('classes.noStudents')}</p>
      ) : (
        <ul className={styles.list}>
          {students.map((s) => (
            <li key={s.user_id} className={styles.item}>
              <span className={styles.itemMain}>{s.nickname}</span>
              <button
                className={`${styles.textBtn} ${styles.danger}`}
                onClick={() => window.confirm(t('classes.removeConfirm', { name: s.nickname }))
                  && run(() => removeStudent(cls.id, s.user_id))}
              >
                {t('classes.remove')}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <div className={styles.error} style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}

// Teacher view: create classes, share their codes, assign quizzes.
// Accounts become teachers only when added to public.teachers by the admin.
export default function Teach() {
  const navigate = useNavigate();
  const { user, loading, isTeacher, teacherChecked } = useAuth();
  const { language, t } = useLanguage();
  const [classes, setClasses] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Errors clear on success, not up front: load() runs inside an effect.
  const load = useCallback(() => {
    Promise.all([getTeacherClasses(), getQuizzes()])
      .then(([c, q]) => { setClasses(c); setQuizzes(q || []); setError(''); })
      .catch(() => setError(t('classes.errGeneric')));
  }, [t]);

  useEffect(() => { if (isTeacher) load(); }, [isTeacher, load]);

  if (!loading && !user) return <Navigate to="/login" state={{ from: '/teach' }} replace />;

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError('');
    try {
      await createClass(name.trim());
      setName('');
      load();
    } catch {
      setError(t('classes.errGeneric'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>{t('classes.teachTitle')}</h1>

        {teacherChecked && !isTeacher && (
          <div className={styles.card}>
            <p className={styles.empty}>
              {t('classes.notTeacher')} <Link to="/schools">{t('home.schoolsLink')}</Link>
            </p>
          </div>
        )}

        {isTeacher && (
          <>
            <div className={styles.card}>
              <form className={styles.row} onSubmit={handleCreate}>
                <label className={styles.label}>
                  {t('classes.createLabel')}
                  <input
                    className={styles.input}
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('classes.createPlaceholder')}
                  />
                </label>
                <button className={styles.primary} type="submit" disabled={busy || !name.trim()}>
                  {t('classes.createBtn')}
                </button>
              </form>
              {error && <div className={styles.error} style={{ marginTop: 10 }}>{error}</div>}
              {classes?.length === 0 && <p className={styles.hint}>{t('classes.noClasses')}</p>}
            </div>
            {classes?.map((cls) => (
              <ClassCard key={cls.id} cls={cls} quizzes={quizzes} onChange={load} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
