import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  activeLiveGame, getClassQuestions, getTeacherClasses, liveAddTime, liveEnd, liveKick, liveNext, livePause, liveReport,
  liveReveal, startLiveGame,
} from '../lib/supabaseClient';
import { getQuizzes, getRandomQuestions, pick } from '../lib/content';
import { QUIZ_BOOKS, QUIZ_CHAPTERS, bookLabel, getBookById, parseChapters } from '../data/books';
import {
  TEAM_COLORS, TEAM_NAMES, downloadText, optionTexts, pickQuestions, questionText, reportCsv, useLiveGame,
} from '../lib/live';
import { onSoundChange, play, setSoundOn, soundOn, startLobbyLoop, stopLobbyLoop } from '../lib/liveSound';
import { usePageTitle } from '../lib/pageTitle';
import Shape from '../components/live/Shapes';
import Icon from '../components/live/Icon';
import TimerRing from '../components/live/TimerRing';
import Qr from '../components/live/Qr';
import Leaderboard from '../components/live/Leaderboard';
import Podium from '../components/live/Podium';
import styles from './Live.module.css';

// Teacher: pick questions and start a game for the class.
function LiveSetup({ classId, onStarted }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [quizzes, setQuizzes] = useState([]);
  const [bank, setBank] = useState([]);
  const [running, setRunning] = useState(null);
  // sources: quiz keys (and 'custom'), any number. chapters: perakim text per
  // single-book quiz (key) or per book of a multi-book quiz (`quiz/book`).
  // bookSel: the books picked inside each multi-book quiz.
  const [form, setForm] = useState({ sources: [], chapters: {}, bookSel: {}, count: '10', seconds: '20', teams: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuizzes().then((q) => setQuizzes(q || [])).catch(() => {});
    getClassQuestions(classId).then(setBank).catch(() => {});
    activeLiveGame(classId).then(setRunning).catch(() => {});
  }, [classId]);

  const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const setChapters = (key, text) => setForm((f) => ({ ...f, chapters: { ...f.chapters, [key]: text } }));
  const toggleBook = (quiz, b) => setForm((f) => ({ ...f, bookSel: { ...f.bookSel, [quiz]: toggle(f.bookSel[quiz] || [], b) } }));
  const labelOf = (key) => (key === 'custom' ? t('classes.kindCustom') : quizzes.find((q) => q.key === key)?.label_en ?? key);

  async function start(e) {
    e.preventDefault();
    if (!form.sources.length) return;
    setBusy(true);
    setError('');
    try {
      const count = Number(form.count);
      const rows = [];
      const quizKeys = form.sources.filter((k) => k !== 'custom');
      if (form.sources.includes('custom')) {
        rows.push(...bank.map((q) => ({ id: q.id, question_en: q.question, options_en: q.options, correct_index: q.correct_index })));
      }
      if (quizKeys.length) {
        // Same perakim rules as practice questions and assignments.
        const chapters = {};
        const books = {};
        for (const key of quizKeys) {
          if (QUIZ_CHAPTERS[key]) {
            const text = (form.chapters[key] || '').trim();
            if (text) chapters[key] = parseOrFail(text, QUIZ_CHAPTERS[key]);
          } else if (QUIZ_BOOKS[key]) {
            const picked = form.bookSel[key] || [];
            if (picked.length) {
              books[key] = {};
              for (const b of picked) {
                const text = (form.chapters[`${key}/${b}`] || '').trim();
                books[key][b] = text ? parseOrFail(text, getBookById(b).chapters) : [];
              }
            }
          }
        }
        rows.push(...await getRandomQuestions(quizKeys, count, chapters, books));
      }
      const questions = pickQuestions(rows, count);
      if (!questions.length) throw new Error('none');
      const names = form.sources.map(labelOf);
      const title = names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ');
      onStarted(await startLiveGame(classId, { title, questions, seconds: Number(form.seconds), teams: form.teams }));
    } catch (err) {
      setError(err.perakim ? t('classes.errChapters', { n: err.perakim }) : t('live.errStart'));
      setBusy(false);
    }
  }

  const chapterBox = (key, max, label) => (
    <label className={styles.label} key={key}>
      {label}
      <input
        className={styles.input}
        dir="ltr"
        value={form.chapters[key] || ''}
        onChange={(e) => setChapters(key, e.target.value)}
        placeholder={t('quiz.chaptersAll', { n: max })}
      />
    </label>
  );

  return (
    <div className={styles.inner} style={{ maxWidth: 680 }}>
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
          <div className={styles.label} role="group" aria-label={t('live.questionsFrom')}>
            {t('live.questionsFrom')}
            <div className={styles.teamPick}>
              {bank.length > 0 && (
                <button type="button" className={styles.teamOpt} aria-pressed={form.sources.includes('custom')}
                  onClick={() => setForm({ ...form, sources: toggle(form.sources, 'custom') })}>
                  {t('classes.kindCustom')} ({bank.length})
                </button>
              )}
              {quizzes.map((q) => (
                <button key={q.key} type="button" className={styles.teamOpt} aria-pressed={form.sources.includes(q.key)}
                  onClick={() => setForm({ ...form, sources: toggle(form.sources, q.key) })}>
                  {pick(q, 'label', language)}
                </button>
              ))}
            </div>
            <span style={{ fontWeight: 'normal', color: 'var(--text-secondary)' }}>{t('live.sourcesHint')}</span>
          </div>

          {form.sources.filter((k) => k !== 'custom' && (QUIZ_CHAPTERS[k] || QUIZ_BOOKS[k])).map((key) => {
            const name = pick(quizzes.find((q) => q.key === key) || {}, 'label', language) || key;
            return (
              <fieldset key={key} className={styles.optBox}>
                <legend>{name}</legend>
                {QUIZ_CHAPTERS[key] && chapterBox(key, QUIZ_CHAPTERS[key], t('classes.chapters'))}
                {QUIZ_BOOKS[key] && (
                  <>
                    <div className={styles.label}>
                      {t('classes.book')}
                      <div className={styles.teamPick}>
                        {QUIZ_BOOKS[key].map((b) => (
                          <button key={b} type="button" className={styles.teamOpt} aria-pressed={(form.bookSel[key] || []).includes(b)}
                            onClick={() => toggleBook(key, b)}>
                            {bookLabel(b, language)}
                          </button>
                        ))}
                      </div>
                      <span style={{ fontWeight: 'normal', color: 'var(--text-secondary)' }}>{t('live.booksHint')}</span>
                    </div>
                    {(form.bookSel[key] || []).map((b) => chapterBox(`${key}/${b}`, getBookById(b).chapters, `${bookLabel(b, language)} — ${t('classes.chapters')}`))}
                  </>
                )}
              </fieldset>
            );
          })}

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
          <div className={styles.label} role="group" aria-label={t('live.teamsLabel')}>
            {t('live.teamsLabel')}
            <div className={styles.teamPick}>
              {[0, 2, 3, 4].map((n) => (
                <button
                  key={n} type="button" className={styles.teamOpt} aria-pressed={form.teams === n}
                  onClick={() => setForm({ ...form, teams: n })}
                >
                  {n === 0 ? t('live.teamsOff') : t('live.teamsN', { n })}
                </button>
              ))}
            </div>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.primary} type="submit" disabled={!form.sources.length || busy}>
            {busy ? t('login.pleaseWait') : t('live.createGame')}
          </button>
        </form>
      </div>
    </div>
  );
}

// "1-5, 8" → [1..5, 8]; a bad range throws an error carrying the book's perakim count.
function parseOrFail(text, max) {
  try {
    return parseChapters(text, max);
  } catch {
    throw Object.assign(new Error('perakim'), { perakim: max });
  }
}

const useSound = () => useSyncExternalStore(onSoundChange, soundOn, () => false);

function useFullscreen() {
  const [full, setFull] = useState(() => Boolean(document.fullscreenElement));
  useEffect(() => {
    const on = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);
  const toggle = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);
  return [full, toggle];
}

// The class report after a game: how each question went, who may need help.
function Report({ gameId, onBack, language, t }) {
  const [report, setReport] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    liveReport(gameId).then(setReport).catch(() => setFailed(true));
  }, [gameId]);

  if (failed) return <div className={styles.report}>{t('live.errLoad')}</div>;
  if (!report) return <div className={styles.report}>{t('content.loading')}</div>;

  const total = report.questions.length;
  const acc = (q) => (q.answered ? Math.round((q.correct / q.answered) * 100) : 0);
  const color = (pct) => (pct >= 70 ? '#4ade80' : pct >= 40 ? '#facc15' : '#f87171');
  const hardest = [...report.questions].sort((a, b) => acc(a) - acc(b));
  const struggling = report.players.filter((p) => total > 0 && p.correct / total < 0.5);
  return (
    <div className={styles.report}>
      <div className={styles.dock} style={{ marginTop: 0, justifyContent: 'space-between' }}>
        <h2 className={styles.sectionTitle} style={{ margin: 0 }}>{t('live.reportTitle')}</h2>
        <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className={styles.ghost} onClick={() => downloadText(`${report.title || 'live-game'}.csv`, reportCsv(report, language))}>
            <Icon name="download" size={16} /> {t('live.downloadCsv')}
          </button>
          <button className={styles.ghost} onClick={onBack}>{t('live.hideReport')}</button>
        </span>
      </div>

      <h3 className={styles.sectionTitle} style={{ textAlign: 'start' }}>{t('live.hardestFirst')}</h3>
      {hardest.map((q) => (
        <div key={q.index} className={styles.reportQ}>
          <div className={styles.reportQText} dir="auto">{q.index + 1}. {questionText(q.question, language)}</div>
          <div className={styles.accTrack}><div className={styles.accFill} style={{ '--w': `${acc(q)}%`, background: color(acc(q)) }} /></div>
          <div className={styles.accMeta}>
            <span className={acc(q) < 50 ? styles.hard : ''}>{t('live.accuracy', { n: acc(q) })}</span>
            <span>{t('live.qCorrect', { c: q.correct, a: q.answered })}</span>
          </div>
        </div>
      ))}

      <h3 className={styles.sectionTitle} style={{ textAlign: 'start' }}>{t('live.needsHelp')}</h3>
      <p className={styles.muted}>{struggling.length ? struggling.map((p) => p.nickname).join(', ') : t('live.noneNeedHelp')}</p>

      <h3 className={styles.sectionTitle} style={{ textAlign: 'start' }}>{t('live.studentsTitle')}</h3>
      <table className={styles.table}>
        <thead>
          <tr><th>{t('live.colName')}</th><th>{t('live.colScore')}</th><th>{t('live.colCorrect')}</th></tr>
        </thead>
        <tbody>
          {report.players.map((p) => (
            <tr key={p.nickname} className={total > 0 && p.correct / total < 0.5 ? styles.needs : ''}>
              <td>{p.nickname}</td><td>{p.score}</td><td>{p.correct} / {total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Teacher: the screen shown on the board.
function LiveHost({ classId, gameId, onNew }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { state, error, remaining, countdown, paused, refresh } = useLiveGame(gameId, 1000);
  const [acting, setActing] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [showBars, setShowBars] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [full, toggleFull] = useFullscreen();
  const sound = useSound();
  const autoRevealed = useRef(-1);
  const prevCountdown = useRef(0);
  const prevPlayers = useRef(0);
  usePageTitle(!state ? null
    : state.phase === 'lobby' ? t('a11y.liveLobby', { name: state.title })
      : state.phase === 'ended' ? t('a11y.liveFinal')
        : t('a11y.liveQuestion', { i: state.index + 1, n: state.total }));

  useEffect(() => {
    getTeacherClasses().then((list) => setJoinCode(list.find((c) => c.id === classId)?.join_code || '')).catch(() => {});
  }, [classId]);

  const act = useCallback((fn, ...args) => async () => {
    setActing(true);
    try { await fn(gameId, ...args); } catch { /* the next poll shows the real state */ }
    setActing(false);
    refresh();
  }, [gameId, refresh]);

  const phase = state?.phase;
  const index = state?.index;

  // Reveal on its own when time runs out or everyone has answered.
  useEffect(() => {
    if (!state || state.phase !== 'question' || countdown > 0 || state.paused_at || autoRevealed.current === state.index) return;
    const everyone = state.players > 0 && state.answered >= state.players;
    if (remaining === 0 || everyone) {
      autoRevealed.current = state.index;
      liveReveal(gameId).then(refresh).catch(() => {});
    }
  }, [state, remaining, countdown, gameId, refresh]);

  // ---- Sounds ----
  useEffect(() => {
    if (phase !== 'lobby' || !sound) return undefined;
    startLobbyLoop();
    return stopLobbyLoop;
  }, [phase, sound]);
  useEffect(() => {
    const n = state?.players ?? 0;
    if (phase === 'lobby' && n > prevPlayers.current) play('join');
    prevPlayers.current = n;
  }, [phase, state?.players]);
  useEffect(() => {
    if (countdown > 0) play('beep');
    else if (prevCountdown.current > 0 && phase === 'question') play('go');
    prevCountdown.current = countdown;
  }, [countdown, phase]);
  const secLeft = remaining === null ? null : Math.ceil(remaining);
  useEffect(() => {
    if (phase === 'question' && !paused && countdown === 0 && secLeft !== null && secLeft > 0 && secLeft <= 5) play('tick');
  }, [secLeft, phase, paused, countdown]);
  useEffect(() => {
    if (phase === 'reveal') play('reveal');
  }, [phase, index]);

  // ---- Keyboard: Space/Enter = next, P = pause, F = fullscreen, M = sound ----
  const primary = useCallback(() => {
    if (!phase || acting) return;
    if (phase === 'lobby' || phase === 'reveal') act(liveNext)();
    else if (phase === 'question' && countdown === 0) act(liveReveal)();
  }, [phase, acting, act, countdown]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const onControl = e.target.closest?.('button, a, input, select, textarea');
      if ((k === ' ' || k === 'enter') && !onControl) { e.preventDefault(); primary(); }
      else if (k === 'p' && phase === 'question') act(livePause, !paused)();
      else if (k === 'f') toggleFull();
      else if (k === 'm') setSoundOn(!soundOn());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [primary, act, paused, phase, toggleFull]);

  if (error && !state) return <div className={styles.stage}><div className={styles.stageBody}><p>{t('live.errLoad')}</p></div></div>;
  if (!state) return <div className={styles.stage}><div className={styles.stageBody}><p>{t('content.loading')}</p></div></div>;

  const q = state.question;
  const options = optionTexts(q, language);
  const shown = state.phase === 'reveal' || state.phase === 'ended';
  const last = state.index + 1 >= state.total;
  const teamsOn = state.teams > 0;
  const teamName = (n) => TEAM_NAMES[language]?.[n] ?? TEAM_NAMES.english[n];
  const leaders = (state.leaders || []).map((l) => ({ ...l, teams_on: teamsOn }));
  const origin = window.location.origin;
  const joinUrl = `${origin}/live/${gameId}${joinCode ? `?code=${encodeURIComponent(joinCode)}` : ''}`;
  const counts = state.counts || [];
  const maxCount = Math.max(1, ...counts);
  const showCounts = shown || (showBars && state.phase === 'question');

  return (
    <div className={styles.stage} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.stageBar}>
        <button className={styles.ghost} onClick={() => navigate('/teach')}>{t('classes.backToClasses')}</button>
        <span className={styles.stageTitle}>{state.title}</span>
        <button className={styles.ghost} onClick={() => setSoundOn(!sound)} aria-pressed={sound} title={t('live.keysHint')}>
          <Icon name={sound ? 'volume' : 'mute'} size={18} /> <span>{sound ? t('live.soundOn') : t('live.soundOff')}</span>
        </button>
        <button className={styles.ghost} onClick={toggleFull}><Icon name={full ? 'minimize' : 'maximize'} size={16} /> {full ? t('live.exitFullscreen') : t('live.fullscreen')}</button>
        {state.phase === 'question' && countdown === 0 && (
          <>
            <button className={styles.ghost} onClick={act(livePause, !paused)} disabled={acting}>
              <Icon name={paused ? 'play' : 'pause'} size={16} /> {paused ? t('live.resume2') : t('live.pause')}
            </button>
            <button className={styles.ghost} onClick={act(liveAddTime, 10)} disabled={acting}>{t('live.addTime')}</button>
            <button className={styles.ghost} onClick={() => setShowBars(!showBars)} aria-pressed={showBars}>
              {showBars ? t('live.hideBars') : t('live.showBars')}
            </button>
          </>
        )}
        {state.phase !== 'ended' && (
          <button className={`${styles.ghost} ${styles.ghostDanger}`} onClick={() => window.confirm(t('live.endConfirm')) && act(liveEnd)()}>
            {t('live.endGame')}
          </button>
        )}
      </div>

      <div className={styles.stageBody}>
        {state.phase === 'lobby' && (
          <div className={styles.lobby}>
            <div className={styles.joinPanel}>
              <p className={styles.joinLabel}>{t('live.joinAt')}</p>
              <div className={styles.qrBox}><Qr value={joinUrl} label={t('live.scanQr')} /></div>
              {joinCode && (
                <>
                  <p className={styles.joinLabel}>{t('live.joinCode')}</p>
                  <p className={styles.joinCode}>{joinCode}</p>
                </>
              )}
              <p className={styles.joinUrl}>{origin.replace(/^https?:\/\//, '')}/join</p>
            </div>
            <div className={styles.lobbyMain}>
              <h1 className={styles.lobbyHeading}>{t('live.lobbyTitle')}</h1>
              <p className={styles.lobbyHint}>{t('live.lobbyHint')}</p>
              <div className={styles.count}>
                <span className={styles.countNum}>{state.players}</span>
                <span>{t('live.playersJoined')}</span>
              </div>
              <div className={styles.bubbles}>
                {state.players === 0 && <span className={styles.waiting}>{t('live.waitingPlayers')}</span>}
                {(state.roster || []).map((p) => (
                  <span key={p.id} className={styles.bubble}>
                    {teamsOn && <span className={styles.bubbleDot} style={{ background: TEAM_COLORS[p.team] }} title={teamName(p.team)} />}
                    {p.nickname}
                    <button className={styles.kick} onClick={act(liveKick, p.id)} aria-label={t('live.removePlayer', { name: p.nickname })} title={t('live.removePlayer', { name: p.nickname })}>×</button>
                  </span>
                ))}
              </div>
              <div className={styles.dock}>
                <button className={styles.go} onClick={act(liveNext)} disabled={acting}>
                  {t('live.startGame', { n: state.total })}
                </button>
              </div>
            </div>
          </div>
        )}

        {state.phase === 'question' && countdown > 0 && (
          <div className={styles.countdownScreen} aria-live="polite">
            <div className={styles.countdownLabel}>{t('live.getReady')}</div>
            <div key={countdown} className={styles.countdownNum}>{countdown}</div>
          </div>
        )}

        {(state.phase === 'reveal' || (state.phase === 'question' && countdown === 0)) && q && (
          <>
            {paused && <div className={styles.pausedBanner}><Icon name="pause" size={22} /> {t('live.paused')}</div>}
            <div className={state.phase === 'reveal' ? styles.split : undefined}>
            <div>
            <div className={styles.qHead}>
              <span className={styles.pill}>{t('live.questionOf', { i: state.index + 1, n: state.total })}</span>
              {state.phase === 'question'
                ? <TimerRing remaining={remaining ?? 0} total={state.seconds} paused={paused} size={104} />
                : <span />}
              <div className={styles.answered}>
                <span className={styles.pill}>{t('live.answeredOf', { a: state.answered, n: state.players })}</span>
                <div className={styles.answeredBar}>
                  <div className={styles.answeredFill} style={{ width: `${state.players ? (state.answered / state.players) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
            <div key={state.index} className={styles.questionBox} dir="auto">{questionText(q, language)}</div>
            <div className={styles.tiles}>
              {options.map((o, i) => {
                const isRight = shown && i === q.correct_index;
                return (
                  <div
                    key={`${state.index}-${i}`}
                    className={`${styles.tile} ${styles[`t${i}`]} ${shown && !isRight ? styles.dim : ''} ${isRight ? styles.right : ''}`}
                    style={{ '--i': i, '--pct': showCounts ? `${(counts[i] ?? 0) / maxCount * 100}%` : '0%' }}
                    dir="auto"
                  >
                    {showCounts && <span className={styles.tileBar} />}
                    <span className={styles.tileIcon}><Shape index={i} size={36} /></span>
                    <span className={styles.tileText}>{o}</span>
                    {isRight && <span className={styles.mark}><Icon name="check" size={34} title="✓" /></span>}
                    {showCounts && <span className={styles.tileNum}>{counts[i] ?? 0}</span>}
                  </div>
                );
              })}
            </div>
            <div className={styles.dock}>
              {state.phase === 'question' && (
                <button className={styles.go} onClick={act(liveReveal)} disabled={acting}>{t('live.revealNow')}</button>
              )}
              {state.phase === 'reveal' && (
                <button className={styles.go} onClick={act(liveNext)} disabled={acting}>
                  {last ? t('live.showFinal') : t('live.nextQuestion')}
                </button>
              )}
            </div>
            </div>
            {state.phase === 'reveal' && (
              <div className={styles.extras}>
                {state.fastest && (
                  <div className={styles.fastest}>
                    <Icon name="zap" size={22} /> {t('live.fastest', { name: state.fastest.nickname, s: (state.fastest.ms / 1000).toFixed(1) })}
                  </div>
                )}
                {teamsOn && state.team_scores?.length > 0 && <TeamBars teams={state.team_scores} name={teamName} />}
                {leaders.length > 0 && <Leaderboard key={`lb-${state.index}`} leaders={leaders} t={t} big />}
              </div>
            )}
            </div>
          </>
        )}

        {state.phase === 'ended' && (
          <>
            <h1 className={styles.finalHead}>{t('live.finalTitle')}</h1>
            {leaders.length ? <Podium leaders={leaders} t={t} onWinner={() => play('finish')} /> : <p className={styles.lobbyHint}>{t('live.noPlayers')}</p>}
            {teamsOn && state.team_scores?.length > 0 && (
              <>
                <h2 className={styles.sectionTitle}>{t('live.teamScores')}</h2>
                <TeamBars teams={state.team_scores} name={teamName} />
              </>
            )}
            {leaders.length > 3 && (
              <div style={{ marginTop: 18 }}>
                <Leaderboard key="final-lb" offset={3} leaders={leaders.slice(3).map((l, i) => ({ ...l, prev_rank: i + 1, delta: 0 }))} t={t} />
              </div>
            )}
            <div className={styles.dock}>
              <button className={styles.go} onClick={() => setShowReport(true)}>{t('live.report')}</button>
              <button className={styles.ghost} onClick={onNew}>{t('live.playAgain')}</button>
              <button className={styles.ghost} onClick={() => navigate('/teach')}>{t('classes.backToClasses')}</button>
            </div>
            {showReport && <Report gameId={gameId} language={language} t={t} onBack={() => setShowReport(false)} />}
          </>
        )}
      </div>
      <p className={styles.keys}>{t('live.keysHint')}</p>
    </div>
  );
}

function TeamBars({ teams, name }) {
  const max = Math.max(1, ...teams.map((x) => x.score));
  return (
    <div className={styles.teamBars}>
      {[...teams].sort((a, b) => b.score - a.score).map((x) => (
        <div key={x.team} className={styles.teamBar}>
          <span className={styles.teamBarName}>{name(x.team)}</span>
          <div className={styles.teamBarTrack}>
            <div className={styles.teamBarFill} style={{ '--w': `${(x.score / max) * 100}%`, background: TEAM_COLORS[x.team] }} />
          </div>
          <span className={styles.teamBarScore}>{x.score}</span>
        </div>
      ))}
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
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'} style={gameId && isTeacher ? { padding: 0, minHeight: 0 } : undefined}>
      {teacherChecked && !isTeacher && <div className={styles.inner}><p className={styles.sub}>{t('classes.notTeacher')}</p></div>}
      {isTeacher && (gameId
        ? <LiveHost classId={classId} gameId={gameId} onNew={() => setParams({})} />
        : <LiveSetup classId={classId} onStarted={(id) => setParams({ game: id })} />)}
    </div>
  );
}
