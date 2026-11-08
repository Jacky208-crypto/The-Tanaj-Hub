import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getTeacherClasses, createClass, addAssignment, deleteAssignment, removeStudent, archiveClass,
  addClassPost, deleteClassPost, addClassQuestion, deleteClassQuestion,
} from '../lib/supabaseClient';
import { getPlaces, getQuizzes, pick } from '../lib/content';
import { formatDue } from '../lib/dates';
import { assignmentSummary, assignmentTitle } from '../lib/assignments';
import { QUIZ_BOOKS, QUIZ_CHAPTERS, allBooks, bookLabel, getBookById, parseChapters } from '../data/books';
import styles from './Classes.module.css';

// A due date picked as YYYY-MM-DD means "by the end of that day" locally.
function endOfDay(dateText) {
  if (!dateText) return null;
  const [y, m, d] = dateText.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59).toISOString();
}

const KINDS = ['quiz', 'custom', 'reading', 'discussion', 'map'];
const MAX_PLACES = 20;
const EMPTY_FORM = {
  kind: 'quiz', quizKey: '', due: '', count: '10', book: '', chapters: '', mode: '', retries: true, prompt: '', placeIds: [],
};

// Search the map's places and pick up to MAX_PLACES for a map activity.
function PlacePicker({ value, onChange }) {
  const { t } = useLanguage();
  const [places, setPlaces] = useState(null);
  const [search, setSearch] = useState('');
  useEffect(() => {
    getPlaces().then(setPlaces).catch(() => setPlaces([]));
  }, []);
  const byId = Object.fromEntries((places || []).map((p) => [p.id, p]));
  const q = search.trim().toLowerCase();
  const matches = (places || [])
    .filter((p) => !value.includes(p.id))
    .filter((p) => p.name.toLowerCase().includes(q) || (p.aliases || []).some((a) => a.toLowerCase().includes(q)))
    .slice(0, 8);

  return (
    <div className={styles.label}>
      {t('classes.placesLabel', { n: value.length, max: MAX_PLACES })}
      {value.length > 0 && (
        <div className={styles.chipRow}>
          {value.map((id) => (
            <button
              type="button"
              key={id}
              className={styles.placeChip}
              onClick={() => onChange(value.filter((x) => x !== id))}
              title={t('classes.remove')}
            >
              {byId[id]?.name ?? id} ×
            </button>
          ))}
        </div>
      )}
      {value.length < MAX_PLACES && (
        <>
          <input
            className={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('classes.searchPlaces')}
          />
          {q && (
            <ul className={styles.placeResults}>
              {matches.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => { onChange([...value, p.id]); setSearch(''); }}>{p.name}</button>
                </li>
              ))}
              {matches.length === 0 && <li className={styles.meta}>{t('map.noMatches')}</li>}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function AssignForm({ cls, quizzes, onDone }) {
  const { language, t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const { kind } = form;
  const isQuiz = kind === 'quiz';
  const usesQuestions = isQuiz || kind === 'custom';
  const textKind = kind === 'reading' || kind === 'discussion';
  const bankSize = (cls.class_questions || []).length;
  const books = isQuiz ? QUIZ_BOOKS[form.quizKey] : null;
  // Chapters can be narrowed for single-book quizzes, once a book is picked in
  // a multi-book quiz, and for any book in a reading or discussion.
  const maxChapters = isQuiz
    ? (books ? (form.book ? getBookById(form.book).chapters : null) : QUIZ_CHAPTERS[form.quizKey])
    : (textKind && form.book ? getBookById(form.book).chapters : null);
  const ready = {
    quiz: Boolean(form.quizKey),
    custom: bankSize > 0,
    reading: Boolean(form.book),
    discussion: Boolean(form.prompt.trim()),
    map: form.placeIds.length > 0,
  }[kind];
  const showOptions = (isQuiz && form.quizKey) || (kind === 'custom' && bankSize > 0);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!ready) {
      setError(t({
        quiz: 'classes.errGeneric', custom: 'classes.errBank', reading: 'classes.errBook',
        discussion: 'classes.errPrompt', map: 'classes.errPlaces',
      }[kind]));
      return;
    }
    const count = Number(form.count);
    if (usesQuestions && (!Number.isInteger(count) || count < 1 || count > 50)) {
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
        kind,
        quizKey: form.quizKey,
        dueAt: endOfDay(form.due),
        questionCount: usesQuestions ? count : 10,
        chapters,
        book: isQuiz ? (books ? form.book : '') : textKind ? form.book : '',
        mode: usesQuestions ? form.mode : '',
        allowRetries: usesQuestions ? form.retries : true,
        prompt: form.prompt.trim(),
        placeIds: form.placeIds,
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
      <div className={styles.kindTabs} role="tablist">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            className={`${styles.kindTab} ${kind === k ? styles.kindTabOn : ''}`}
            onClick={() => { setForm({ ...EMPTY_FORM, kind: k, due: form.due }); setError(''); }}
          >
            {t(`classes.kind${k[0].toUpperCase()}${k.slice(1)}`)}
          </button>
        ))}
      </div>

      {kind === 'custom' && (
        <p className={styles.hint}>
          {bankSize > 0 ? t('classes.customHint', { n: bankSize }) : t('classes.customEmpty')}
        </p>
      )}

      {kind === 'map' && <PlacePicker value={form.placeIds} onChange={(ids) => set('placeIds', ids)} />}

      {(kind === 'discussion' || kind === 'map') && (
        <label className={styles.label}>
          {kind === 'discussion' ? t('classes.prompt') : t('classes.mapInstructions')}
          <textarea
            className={styles.input}
            rows={kind === 'discussion' ? 3 : 2}
            maxLength={1000}
            value={form.prompt}
            onChange={(e) => set('prompt', e.target.value)}
            placeholder={kind === 'discussion' ? t('classes.promptPlaceholder') : t('classes.mapInstructionsPlaceholder')}
          />
        </label>
      )}

      {textKind && (
        <div className={styles.row}>
          <label className={styles.label}>
            {kind === 'reading' ? t('classes.book') : t('classes.bookOptional')}
            <select
              className={styles.input}
              value={form.book}
              onChange={(e) => setForm({ ...form, book: e.target.value, chapters: '' })}
            >
              <option value="">—</option>
              {allBooks.map((b) => <option key={b.id} value={b.id}>{bookLabel(b.id, language)}</option>)}
            </select>
          </label>
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
      )}

      <div className={styles.row}>
        {isQuiz && (
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
        )}
        <label className={styles.label}>
          {t('classes.dueDate')}
          <input className={styles.input} type="date" value={form.due} onChange={(e) => set('due', e.target.value)} />
        </label>
      </div>

      {showOptions && (
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
          {isQuiz && (
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
          )}
          <label className={styles.check}>
            <input type="checkbox" checked={form.retries} onChange={(e) => set('retries', e.target.checked)} />
            {t('classes.allowRetries')}
          </label>
        </>
      )}
      {error && <div className={styles.error}>{error}</div>}
      <button className={styles.primary} type="submit" disabled={!ready || busy}>
        {busy ? t('login.pleaseWait') : t('classes.assignBtn')}
      </button>
    </form>
  );
}

const EMPTY_QUESTION = { question: '', options: ['', '', '', ''], correct: 0 };

// The class's own question bank (assigned with the "Class questions" kind).
function ClassQuestions({ cls, onChange }) {
  const { t } = useLanguage();
  const questions = cls.class_questions || [];
  const [form, setForm] = useState(EMPTY_QUESTION);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function add(e) {
    e.preventDefault();
    setError('');
    const filled = form.options.map((o, i) => ({ o: o.trim(), i })).filter((x) => x.o);
    if (!form.question.trim() || filled.length < 2) {
      setError(t('classes.errQuestion'));
      return;
    }
    const correctIndex = filled.findIndex((x) => x.i === form.correct);
    if (correctIndex < 0) {
      setError(t('classes.errCorrect'));
      return;
    }
    setBusy(true);
    try {
      await addClassQuestion({
        classId: cls.id, question: form.question.trim(), options: filled.map((x) => x.o), correctIndex,
      });
      setForm(EMPTY_QUESTION);
      onChange();
    } catch {
      setError(t('classes.errGeneric'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className={styles.bank}>
      <summary>{t('classes.classQuestions', { n: questions.length })}</summary>
      {questions.length > 0 && (
        <ul className={styles.list}>
          {questions.map((q) => (
            <li key={q.id} className={styles.item}>
              <div className={styles.itemMain} dir="auto">
                <div>{q.question}</div>
                <div className={styles.meta}>{t('classes.correctAnswer', { a: q.options[q.correct_index] })}</div>
              </div>
              <button
                type="button"
                className={`${styles.textBtn} ${styles.danger}`}
                onClick={async () => {
                  if (!window.confirm(t('classes.deleteQuestionConfirm'))) return;
                  try { await deleteClassQuestion(q.id); onChange(); } catch { setError(t('classes.errGeneric')); }
                }}
              >
                {t('classes.delete')}
              </button>
            </li>
          ))}
        </ul>
      )}
      <form className={styles.form} onSubmit={add} style={{ marginTop: 10 }}>
        <label className={styles.label}>
          {t('classes.newQuestion')}
          <textarea
            className={styles.input}
            rows={2}
            maxLength={500}
            dir="auto"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
        </label>
        <div className={styles.optionGrid}>
          {form.options.map((o, i) => (
            <label key={i} className={styles.optionRow}>
              <input
                type="radio"
                name={`correct-${cls.id}`}
                checked={form.correct === i}
                onChange={() => setForm({ ...form, correct: i })}
                aria-label={t('classes.markCorrect')}
              />
              <input
                className={styles.input}
                dir="auto"
                maxLength={200}
                value={o}
                onChange={(e) => setForm({ ...form, options: form.options.map((x, j) => (j === i ? e.target.value : x)) })}
                placeholder={t('classes.optionN', { n: i + 1 })}
              />
            </label>
          ))}
        </div>
        <p className={styles.hint}>{t('classes.optionsHint')}</p>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.secondary} type="submit" disabled={busy} style={{ alignSelf: 'flex-start' }}>
          {t('classes.addQuestion')}
        </button>
      </form>
    </details>
  );
}

function Announcements({ cls, onChange }) {
  const { language, t } = useLanguage();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const posts = [...(cls.class_posts || [])].sort((a, b) => b.created_at.localeCompare(a.created_at));

  async function post(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError('');
    try {
      await addClassPost(cls.id, text.trim());
      setText('');
      onChange();
    } catch {
      setError(t('classes.errGeneric'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <p className={styles.sectionLabel}>{t('classes.announcements')}</p>
      <form className={styles.form} onSubmit={post}>
        <textarea
          className={styles.input}
          rows={2}
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('classes.postPlaceholder')}
        />
        <button className={styles.secondary} type="submit" disabled={busy || !text.trim()} style={{ alignSelf: 'flex-start' }}>
          {t('classes.postBtn')}
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      {posts.length > 0 && (
        <ul className={styles.list} style={{ marginTop: 10 }}>
          {posts.map((p) => (
            <li key={p.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div className={styles.postBody}>{p.body}</div>
                <div className={styles.meta}>{formatDue(p.created_at, language)}</div>
              </div>
              <button
                className={`${styles.textBtn} ${styles.danger}`}
                onClick={async () => {
                  if (!window.confirm(t('classes.deletePostConfirm'))) return;
                  try { await deleteClassPost(p.id); onChange(); } catch { setError(t('classes.errGeneric')); }
                }}
              >
                {t('classes.delete')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ClassCard({ cls, quizzes, onChange }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const joinUrl = `${window.location.origin}/join?code=${cls.join_code}`;
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

      <Announcements cls={cls} onChange={onChange} />
      <ClassQuestions cls={cls} onChange={onChange} />

      <p className={styles.sectionLabel}>{t('classes.assignments')}</p>
      <AssignForm cls={cls} quizzes={quizzes} onDone={onChange} />
      {assignments.length > 0 && (
        <ul className={styles.list} style={{ marginTop: 10 }}>
          {assignments.map((a) => (
            <li key={a.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div className={styles.clamp}>{assignmentTitle(a, quizzes, t, language)}</div>
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
