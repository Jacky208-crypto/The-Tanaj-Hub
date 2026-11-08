import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  activeLiveGame, getClassQuestions, liveEnd, liveNext, liveReveal, startLiveGame,
} from '../lib/supabaseClient';
import { getQuizzes, getRandomQuestions, pick } from '../lib/content';
import { LETTERS, optionTexts, pickQuestions, questionText, useLiveGame } from '../lib/live';
import styles from './Live.module.css';

// Teacher: pick questions and start a game for the class.
function LiveSetup({ classId, onStarted }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [quizzes, setQuizzes] = useState([]);
  const [bank, setBank] = useState([]);
  const [running, setRunning] = useState(null);
  const [form, setForm] = useState({ source: '', count: '10', seconds: '20' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuizzes().then((q) => setQuizzes(q || [])).catch(() => {});
    getClassQuestions(classId).then(setBank).catch(() => {});
    activeLiveGame(classId).then(setRunning).catch(() => {});
  }, [classId]);

  async function start(e) {
    e.preventDefault();
    if (!form.source) return;
    setBusy(true);
    setError('');
    try {
      const count = Number(form.count);
      let rows;
      let title;
      if (form.source === 'custom') {
        rows = bank.map((q) => ({ id: q.id, question_en: q.question, options_en: q.options, correct_index: q.correct_index }));
        title = t('classes.kindCustom');
      } else {
        rows = await getRandomQuestions([form.source], count);
        title = quizzes.find((q) => q.key === form.source)?.label_en ?? form.source;
      }
      const questions = pickQuestions(rows, count);
      if (!questions.length) throw new Error('none');
      onStarted(await startLiveGame(classId, { title, questions, seconds: Number(form.seconds) }));
    } catch {
      setError(t('live.errStart'));
      setBusy(false);
    }
  }

  return (
    <div className={`${styles.inner} ${styles.narrow}`}>
      <div className={styles.topRow}>
        <button className={styles.back} onClick={() => navigate('/teach')}>{t('classes.backToClasses')}</button>
      </div>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('live.setupTitle')}</h1>
        <p className={styles.sub}>{t('live.setupHint')}</p>
        {running && (
          <div className={styles.actions} style={{ justifyContent: 'flex-start', marginTop: 0, marginBottom: 16 }}>
            <button className={styles.secondary} onClick={() => onStarted(running)}>{t('live.resume')}</button>
          </div>
        )}
        <form className={styles.form} onSubmit={start}>
          <label className={styles.label}>
            {t('live.questionsFrom')}
            <select className={styles.input} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              <option value="">—</option>
              {bank.length > 0 && <option value="custom">{t('classes.kindCustom')} ({bank.length})</option>}
              {quizzes.map((q) => <option key={q.key} value={q.key}>{pick(q, 'label', language)}</option>)}
            </select>
          </label>
          <div className={styles.row}>
            <label className={styles.label}>
              {t('classes.questionCount')}
              <select className={styles.input} value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })}>
                {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className={styles.label}>
              {t('live.secondsPerQuestion')}
              <select className={styles.input} value={form.seconds} onChange={(e) => setForm({ ...form, seconds: e.target.value })}>
                {[10, 20, 30, 45].map((n) => <option key={n} value={n}>{t('live.seconds', { n })}</option>)}
              </select>
            </label>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.primary} type="submit" disabled={!form.source || busy}>
            {busy ? t('login.pleaseWait') : t('live.createGame')}
          </button>
        </form>
      </div>
    </div>
  );
}

function Leaders({ leaders, t }) {
  return (
    <div className={styles.leaders}>
      {leaders.map((l, i) => (
        <div key={`${l.nickname}-${i}`} className={`${styles.leader} ${i < 3 ? styles.podium : ''}`}>
          <span><span className={styles.rank}>{i + 1}.</span> {l.nickname}</span>
          <span>{t('live.pointsShort', { n: l.score })}</span>
        </div>
      ))}
    </div>
  );
}

// Teacher: the screen shown on the board.
function LiveHost({ gameId, onNew }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { state, error, remaining, refresh } = useLiveGame(gameId);
  const [acting, setActing] = useState(false);
  const autoRevealed = useRef(-1);

  const act = (fn) => async () => {
    setActing(true);
    try { await fn(gameId); } catch { /* the next poll shows the real state */ }
    setActing(false);
    refresh();
  };

  // Reveal on its own when time runs out or everyone has answered.
  useEffect(() => {
    if (!state || state.phase !== 'question' || autoRevealed.current === state.index) return;
    const everyone = state.players > 0 && state.answered >= state.players;
    if (remaining === 0 || everyone) {
      autoRevealed.current = state.index;
      liveReveal(gameId).then(refresh).catch(() => {});
    }
  }, [state, remaining, gameId, refresh]);

  if (error && !state) return <div className={styles.inner}><div className={styles.error}>{t('live.errLoad')}</div></div>;
  if (!state) return <div className={styles.inner}><p className={styles.sub}>{t('content.loading')}</p></div>;

  const q = state.question;
  const options = optionTexts(q, language);
  const shown = state.phase === 'reveal' || state.phase === 'ended';
  const last = state.index + 1 >= state.total;

  return (
    <div className={styles.inner}>
      <div className={styles.topRow}>
        <button className={styles.back} onClick={() => navigate('/teach')}>{t('classes.backToClasses')}</button>
        <strong>{state.title}</strong>
        {state.phase !== 'ended' && (
          <button className={styles.danger} onClick={() => window.confirm(t('live.endConfirm')) && act(liveEnd)()}>
            {t('live.endGame')}
          </button>
        )}
      </div>

      {state.phase === 'lobby' && (
        <div className={`${styles.card} ${styles.center}`}>
          <h1 className={styles.title}>{t('live.lobbyTitle')}</h1>
          <p className={styles.sub}>{t('live.lobbyHint')}</p>
          <div className={styles.bigNumber}>{state.players}</div>
          <p className={styles.sub}>{t('live.playersJoined')}</p>
          <div className={styles.chips}>
            {(state.nicknames || []).map((n, i) => <span key={`${n}-${i}`} className={styles.chip}>{n}</span>)}
          </div>
          <div className={styles.actions}>
            <button className={styles.primary} onClick={act(liveNext)} disabled={acting}>
              {t('live.startGame', { n: state.total })}
            </button>
          </div>
        </div>
      )}

      {(state.phase === 'question' || state.phase === 'reveal') && q && (
        <div className={styles.card}>
          <div className={styles.progressRow}>
            <span>{t('live.questionOf', { i: state.index + 1, n: state.total })}</span>
            {state.phase === 'question' && (
              <span className={`${styles.timer} ${remaining !== null && remaining <= 5 ? styles.timerLow : ''}`}>
                {Math.ceil(remaining ?? 0)}
              </span>
            )}
            <span>{t('live.answeredOf', { a: state.answered, n: state.players })}</span>
          </div>
          <p className={styles.question} dir="auto">{questionText(q, language)}</p>
          <div className={styles.options}>
            {options.map((o, i) => (
              <div
                key={i}
                className={`${styles.option} ${styles[`opt${i}`]} ${shown && i !== q.correct_index ? styles.faded : ''}`}
                dir="auto"
              >
                <span className={styles.letter}>{LETTERS[i]}</span>
                <span>{o}</span>
                {shown && <span className={styles.count}>{state.counts?.[i] ?? 0}{i === q.correct_index ? ' ✓' : ''}</span>}
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            {state.phase === 'question' && (
              <button className={styles.secondary} onClick={act(liveReveal)} disabled={acting}>{t('live.revealNow')}</button>
            )}
            {state.phase === 'reveal' && (
              <button className={styles.primary} onClick={act(liveNext)} disabled={acting}>
                {last ? t('live.showFinal') : t('live.nextQuestion')}
              </button>
            )}
          </div>
          {state.phase === 'reveal' && state.leaders?.length > 0 && <Leaders leaders={state.leaders} t={t} />}
        </div>
      )}

      {state.phase === 'ended' && (
        <div className={`${styles.card} ${styles.center}`}>
          <h1 className={styles.title}>{t('live.finalTitle')}</h1>
          {state.leaders?.length ? <Leaders leaders={state.leaders} t={t} /> : <p className={styles.sub}>{t('live.noPlayers')}</p>}
          <div className={styles.actions}>
            <button className={styles.primary} onClick={onNew}>{t('live.playAgain')}</button>
            <button className={styles.secondary} onClick={() => navigate('/teach')}>{t('classes.backToClasses')}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// /teach/:classId/live — setup, then ?game=<id> for the host screen.
export default function TeachLive() {
  const { classId } = useParams();
  const [params, setParams] = useSearchParams();
  const { user, loading, isTeacher, teacherChecked } = useAuth();
  const { language, t } = useLanguage();
  const gameId = params.get('game');

  if (!loading && !user) return <Navigate to="/login" state={{ from: `/teach/${classId}/live` }} replace />;

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      {teacherChecked && !isTeacher && <div className={styles.inner}><p className={styles.sub}>{t('classes.notTeacher')}</p></div>}
      {isTeacher && (gameId
        ? <LiveHost gameId={gameId} onNew={() => setParams({})} />
        : <LiveSetup classId={classId} onStarted={(id) => setParams({ game: id })} />)}
    </div>
  );
}
