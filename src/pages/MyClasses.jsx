import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getStudentClasses, getMyAssignmentAttempts, getMyResponses, leaveClass, saveResponse, removeResponse,
  getClassQuestions, getLeaderboard, getMyActivityDates, activeLiveGame,
} from '../lib/supabaseClient';
import { getQuizzes, pick } from '../lib/content';
import { formatScore } from '../components/QuizReport';
import QuizPlayer from '../components/QuizPlayer';
import { formatDue } from '../lib/dates';
import { assignmentQuiz, assignmentSummary, assignmentTitle, customQuiz, firstChapter } from '../lib/assignments';
import styles from './Classes.module.css';

const POSTS_SHOWN = 2;
const BOARD_SHOWN = 5;

// Days in a row (ending today, or yesterday if nothing yet today) with any
// quiz, reading or answer.
function streakDays(isoDates) {
  const days = new Set(isoDates.map((d) => new Date(d).toDateString()));
  const day = new Date();
  if (!days.has(day.toDateString())) day.setDate(day.getDate() - 1);
  let n = 0;
  while (days.has(day.toDateString())) {
    n += 1;
    day.setDate(day.getDate() - 1);
  }
  return n;
}

// The class's points table (only when the teacher turned it on): the top
// few, plus my own row if I'm further down.
function Leaderboard({ rows }) {
  const { t } = useLanguage();
  if (!rows?.length) return null;
  const meIndex = rows.findIndex((r) => r.is_me);
  const shown = rows.slice(0, BOARD_SHOWN);
  const extra = meIndex >= BOARD_SHOWN ? [rows[meIndex]] : [];
  const rank = (r) => rows.indexOf(r) + 1;
  return (
    <>
      <p className={styles.sectionLabel}>{t('classes.leaderboard')}</p>
      <div className={styles.board}>
        {[...shown, ...extra].map((r) => (
          <div key={`${r.nickname}-${rank(r)}`} className={`${styles.boardRow} ${r.is_me ? styles.boardMe : ''}`}>
            <span><span className={styles.boardRank}>{rank(r)}.</span> {r.nickname}{r.is_me && ` (${t('classes.you')})`}</span>
            <span>{t('classes.points', { n: r.points })}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// A discussion question: the student's answer, saved on demand.
function DiscussionAnswer({ a, response, onSaved }) {
  const { t } = useLanguage();
  const [text, setText] = useState(response?.answer ?? '');
  const [state, setState] = useState('idle'); // idle | saving | saved | error
  const changed = text.trim() !== (response?.answer ?? '').trim();

  async function save() {
    setState('saving');
    try {
      await saveResponse(a.id, text.trim());
      setState('saved');
      onSaved();
    } catch {
      setState('error');
    }
  }

  return (
    <div className={styles.answerBox}>
      <textarea
        className={styles.input}
        rows={3}
        maxLength={4000}
        value={text}
        onChange={(e) => { setText(e.target.value); setState('idle'); }}
        placeholder={t('classes.yourAnswer')}
        dir="auto"
      />
      <div className={styles.buttonRow} style={{ marginTop: 6 }}>
        <button className={styles.primary} onClick={save} disabled={!text.trim() || !changed || state === 'saving'}>
          {state === 'saving' ? t('login.pleaseWait') : t('classes.saveAnswer')}
        </button>
        {state === 'saved' && <span className={styles.done}>{t('classes.answerSaved')}</span>}
        {state === 'error' && <span className={styles.danger}>{t('classes.errGeneric')}</span>}
      </div>
    </div>
  );
}

// Student view: the classes I'm in, their announcements and assignments.
export default function MyClasses() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { language, t } = useLanguage();
  const [classes, setClasses] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [responses, setResponses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(null); // the quiz object handed to QuizPlayer
  const [allPosts, setAllPosts] = useState({}); // class id → show every announcement
  const [boards, setBoards] = useState({}); // class id → leaderboard rows
  const [streak, setStreak] = useState(0);
  const [liveGames, setLiveGames] = useState({}); // class id → game in progress

  // Errors clear on success, not up front: load() runs inside an effect.
  const load = useCallback(() => {
    Promise.all([getStudentClasses(), getMyAssignmentAttempts(), getMyResponses(), getQuizzes()])
      .then(([c, a, r, q]) => {
        setClasses(c); setAttempts(a); setResponses(r); setQuizzes(q || []); setError('');
        const withBoard = c.filter((m) => m.classes.show_leaderboard);
        return Promise.all(withBoard.map((m) => getLeaderboard(m.classes.id).catch(() => [])))
          .then((lists) => setBoards(Object.fromEntries(withBoard.map((m, i) => [m.classes.id, lists[i]]))));
      })
      .catch(() => setError(t('classes.errGeneric')));
    getMyActivityDates().then((dates) => setStreak(streakDays(dates))).catch(() => {});
  }, [t]);

  useEffect(() => { if (user) load(); }, [user, load]);

  // Look for live games now and every 15 s while this page is open.
  const classIds = (classes || []).map((m) => m.classes.id).join(',');
  useEffect(() => {
    if (!classIds) return undefined;
    const ids = classIds.split(',');
    const check = () => Promise.all(ids.map((id) => activeLiveGame(id).catch(() => null)))
      .then((games) => setLiveGames(Object.fromEntries(ids.map((id, i) => [id, games[i]]))));
    check();
    const timer = setInterval(check, 15000);
    return () => clearInterval(timer);
  }, [classIds]);

  if (!loading && !user) return <Navigate to="/join" replace />;

  if (playing) {
    return <QuizPlayer quiz={playing} onBack={() => { setPlaying(null); load(); }} />;
  }

  const quizByKey = Object.fromEntries(quizzes.map((q) => [q.key, q]));
  const responseFor = Object.fromEntries(responses.map((r) => [r.assignment_id, r]));
  // Best attempt per quiz assignment.
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

  async function toggleRead(a) {
    try {
      if (responseFor[a.id]) await removeResponse(a.id);
      else await saveResponse(a.id);
      load();
    } catch {
      setError(t('classes.errGeneric'));
    }
  }

  async function startCustom(a, classId) {
    try {
      const questions = await getClassQuestions(classId);
      setPlaying({ ...customQuiz(a, questions, 'Class questions'), displayLabel: t('classes.kindCustom') });
    } catch {
      setError(t('classes.errGeneric'));
    }
  }

  function renderAssignment(a, cls) {
    const kind = a.kind || 'quiz';
    const due = a.due_at && t('classes.due', { date: formatDue(a.due_at, language) });
    const chapter = firstChapter(a);
    const openText = a.book && (
      <Link className={styles.textLink} to={`/book/${a.book}?chapter=${chapter}`}>{t('classes.openText')}</Link>
    );

    if (kind === 'quiz' || kind === 'custom') {
      const quiz = quizByKey[a.quiz_key];
      const result = best[a.id];
      return (
        <li key={a.id} className={styles.item}>
          <div className={styles.itemMain}>
            <div>{kind === 'custom' ? t('classes.kindCustom') : quiz ? pick(quiz, 'label', language) : a.quiz_key}</div>
            <div className={styles.meta}>{assignmentSummary(a, t, language)}</div>
            <div className={styles.meta}>
              {due && <>{due} · </>}
              {result
                ? <span className={styles.done}>{t('classes.done', { score: `${formatScore(Number(result.score))}/${result.total}` })}</span>
                : t('classes.notStarted')}
            </div>
          </div>
          {!(result && a.allow_retries === false) && (
            <button
              className={result ? styles.secondary : styles.primary}
              onClick={() => (kind === 'custom'
                ? startCustom(a, cls.id)
                : setPlaying({
                  ...assignmentQuiz(a, quiz ? pick(quiz, 'label', 'english') : a.quiz_key),
                  displayLabel: quiz ? pick(quiz, 'label', language) : a.quiz_key,
                }))}
            >
              {result ? t('classes.again') : t('classes.start')}
            </button>
          )}
        </li>
      );
    }

    if (kind === 'map') {
      const done = responseFor[a.id];
      return (
        <li key={a.id} className={styles.item}>
          <div className={styles.itemMain}>
            <div>{assignmentTitle(a, quizzes, t, language)}</div>
            {a.prompt && <div className={styles.meta} dir="auto">{a.prompt}</div>}
            <div className={styles.meta}>
              {due && <>{due} · </>}
              {done ? <span className={styles.done}>{t('classes.doneCheck')}</span> : t('classes.notDone')}
            </div>
          </div>
          <Link className={done ? styles.secondary : styles.primary} to={`/map?activity=${a.id}`}>
            {done ? t('classes.openMapAgain') : t('classes.openMap')}
          </Link>
        </li>
      );
    }

    if (kind === 'reading') {
      const done = responseFor[a.id];
      return (
        <li key={a.id} className={styles.item}>
          <div className={styles.itemMain}>
            <div>{assignmentTitle(a, quizzes, t, language)}</div>
            <div className={styles.meta}>
              {due && <>{due} · </>}
              {done ? <span className={styles.done}>{t('classes.doneCheck')}</span> : t('classes.notDone')}
              {' · '}{openText}
            </div>
          </div>
          <button className={done ? styles.secondary : styles.primary} onClick={() => toggleRead(a)}>
            {done ? t('classes.undo') : t('classes.markDone')}
          </button>
        </li>
      );
    }

    // discussion
    const response = responseFor[a.id];
    return (
      <li key={a.id} className={`${styles.item} ${styles.itemStack}`}>
        <div className={styles.itemMain}>
          <div className={styles.prompt} dir="auto">{a.prompt}</div>
          <div className={styles.meta}>
            {[t('classes.kindDiscussion'), due].filter(Boolean).join(' · ')}
            {response && <> · <span className={styles.done}>{t('classes.answered')}</span></>}
            {openText && <> · {openText}</>}
          </div>
        </div>
        <DiscussionAnswer key={response?.updated_at ?? 'new'} a={a} response={response} onSaved={load} />
      </li>
    );
  }

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>{t('classes.myTitle')}</h1>
        {streak > 0 && <span className={styles.streak}>{t('classes.streak', { n: streak })}</span>}
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
            (a.due_at || '9999').localeCompare(b.due_at || '9999') || a.created_at.localeCompare(b.created_at));
          const posts = [...(cls.class_posts || [])].sort((a, b) => b.created_at.localeCompare(a.created_at));
          const shownPosts = allPosts[cls.id] ? posts : posts.slice(0, POSTS_SHOWN);
          return (
            <div key={cls.id} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardTitle}>{cls.name}</span>
                <span className={styles.meta}>{t('classes.youAre', { name: nickname })}</span>
              </div>
              {liveGames[cls.id] && (
                <div className={styles.liveBanner}>
                  <span>{t('live.bannerText')}</span>
                  <Link className={styles.primary} to={`/live/${liveGames[cls.id]}`}>{t('live.joinGame')}</Link>
                </div>
              )}

              {posts.length > 0 && (
                <>
                  <p className={styles.sectionLabel}>{t('classes.announcements')}</p>
                  {shownPosts.map((p) => (
                    <div key={p.id} className={styles.post}>
                      <div className={styles.postBody} dir="auto">{p.body}</div>
                      <div className={styles.meta}>{formatDue(p.created_at, language)}</div>
                    </div>
                  ))}
                  {posts.length > POSTS_SHOWN && !allPosts[cls.id] && (
                    <button className={styles.textBtn} onClick={() => setAllPosts((s) => ({ ...s, [cls.id]: true }))}>
                      {t('classes.showAllPosts', { n: posts.length })}
                    </button>
                  )}
                </>
              )}

              <Leaderboard rows={boards[cls.id]} />

              <p className={styles.sectionLabel}>{t('classes.assigned')}</p>
              {assignments.length === 0 ? (
                <p className={styles.empty}>{t('classes.noAssignments')}</p>
              ) : (
                <ul className={styles.list}>{assignments.map((a) => renderAssignment(a, cls))}</ul>
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
