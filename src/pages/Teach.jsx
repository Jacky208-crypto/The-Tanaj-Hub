import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getTeacherClasses, createClass, addAssignment, deleteAssignment, removeStudent, archiveClass,
} from '../lib/supabaseClient';
import { getQuizzes, pick } from '../lib/content';
import { formatDue } from '../lib/dates';
import { assignmentSummary } from '../lib/assignments';
import { QUIZ_BOOKS, QUIZ_CHAPTERS, bookLabel, getBookById, parseChapters } from '../data/books';
import styles from './Classes.module.css';

// A due date picked as YYYY-MM-DD means "by the end of that day" locally.
function endOfDay(dateText) {
  if (!dateText) return null;
  const [y, m, d] = dateText.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59).toISOString();
}

const EMPTY_FORM = { quizKey: '', due: '', count: '10', book: '', chapters: '', mode: '', retries: true };

function AssignForm({ cls, quizzes, onDone }) {
  const { language, t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const books = QUIZ_BOOKS[form.quizKey];
  // Chapters can be narrowed for single-book quizzes, or once a book is picked.
  const maxChapters = books ? (form.book ? getBookById(form.book).chapters : null) : QUIZ_CHAPTERS[form.quizKey];

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.quizKey) return;
    const count = Number(form.count);
    if (!Number.isInteger(count) || count < 1 || count > 50) {
      setError(t('classes.errCount'));
      return;
    }
    let chapters = form.chapters.trim();
    if (chapters && maxChapters) {
      try {
        parseChapters(chapters, maxChapters);
      } catch {
        setError(t('classes.errChapters', { n: maxChapters }));
        return;
      }
    } else {
      chapters = '';
    }
    setBusy(true);
    try {
      await addAssignment({
        classId: cls.id,
        quizKey: form.quizKey,
        dueAt: endOfDay(form.due),
        questionCount: count,
        chapters,
        book: books ? form.book : '',
        mode: form.mode,
        allowRetries: form.retries,
      });
      setForm(EMPTY_FORM);
      onDone();
    } catch {
      setError(t('classes.errGeneric'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <label className={styles.label}>
          {t('classes.assignQuiz')}
          <select
            className={styles.input}
            value={form.quizKey}
            onChange={(e) => setForm({ ...form, quizKey: e.target.value, book: '', chapters: '' })}
          >
            <option value="">—</option>
            {quizzes.map((q) => <option key={q.key} value={q.key}>{pick(q, 'label', language)}</option>)}
          </select>
        </label>
        <label className={styles.label}>
          {t('classes.dueDate')}
          <input className={styles.input} type="date" value={form.due} onChange={(e) => set('due', e.target.value)} />
        </label>
      </div>
      {form.quizKey && (
        <>
          <div className={styles.row}>
            <label className={styles.label}>
              {t('classes.questionCount')}
              <input
                className={styles.input}
                type="number"
                min="1"
                max="50"
                value={form.count}
                onChange={(e) => set('count', e.target.value)}
              />
            </label>
            <label className={styles.label}>
              {t('classes.answerMode')}
              <select className={styles.input} value={form.mode} onChange={(e) => set('mode', e.target.value)}>
                <option value="">{t('classes.modeStudentPicks')}</option>
                <option value="choice">{t('quizPlayer.modeChoice')}</option>
                <option value="free">{t('quizPlayer.modeFree')}</option>
              </select>
            </label>
          </div>
          <div className={styles.row}>
            {books && (
              <label className={styles.label}>
                {t('classes.book')}
                <select
                  className={styles.input}
                  value={form.book}
                  onChange={(e) => setForm({ ...form, book: e.target.value, chapters: '' })}
                >
                  <option value="">{t('classes.allBooks')}</option>
                  {books.map((b) => <option key={b} value={b}>{bookLabel(b, language)}</option>)}
                </select>
              </label>
            )}
            {maxChapters && (
              <label className={styles.label}>
                {t('classes.chapters')}
                <input
                  className={styles.input}
                  dir="ltr"
                  value={form.chapters}
                  onChange={(e) => set('chapters', e.target.value)}
                  placeholder={t('quiz.chaptersAll', { n: maxChapters })}
                />
              </label>
            )}
          </div>
          <label className={styles.check}>
            <input type="checkbox" checked={form.retries} onChange={(e) => set('retries', e.target.checked)} />
            {t('classes.allowRetries')}
          </label>
        </>
      )}
      {error && <div className={styles.error}>{error}</div>}
      <button className={styles.primary} type="submit" disabled={!form.quizKey || busy}>
        {busy ? t('login.pleaseWait') : t('classes.assignBtn')}
      </button>
    </form>
  );
}

function ClassCard({ cls, quizzes, onChange }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
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
        <button className={styles.secondary} onClick={() => navigate(`/teach/${cls.id}/print`)}>
          {t('classes.printInstructions')}
        </button>
      </div>
      <p className={styles.hint}>
        {t('classes.shareHint')} <span dir="ltr">{joinUrl}</span>
      </p>

      <div className={styles.buttonRow}>
        <button className={styles.primary} onClick={() => navigate(`/teach/${cls.id}`)}>
          {t('classes.viewResults')}
        </button>
      </div>

      <p className={styles.sectionLabel}>{t('classes.assignments')}</p>
      <AssignForm cls={cls} quizzes={quizzes} onDone={onChange} />
      {assignments.length > 0 && (
        <ul className={styles.list} style={{ marginTop: 10 }}>
          {assignments.map((a) => (
            <li key={a.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div>{quizByKey[a.quiz_key] ? pick(quizByKey[a.quiz_key], 'label', language) : a.quiz_key}</div>
                <div className={styles.meta}>
                  {a.due_at && <>{t('classes.due', { date: formatDue(a.due_at, language) })} · </>}
                  {assignmentSummary(a, t, language)}
                </div>
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
              <div className={styles.itemMain}>
                <div>{s.nickname}</div>
                <div className={styles.meta}>{t('classes.joined', { date: formatDue(s.joined_at, language) })}</div>
              </div>
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
// Teachers are added by email in /admin → Teachers.
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

  const steps = t('classes.howSteps');

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
            {classes && (
              <details className={styles.howTo} open={classes.length === 0}>
                <summary>{t('classes.howTitle')}</summary>
                <ol>
                  {steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
              </details>
            )}
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
