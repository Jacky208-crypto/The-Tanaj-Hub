import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { liveAnswer, liveJoin } from '../lib/supabaseClient';
import { TEAM_COLORS, TEAM_NAMES, optionTexts, questionText, useLiveGame } from '../lib/live';
import { usePageTitle } from '../lib/pageTitle';
import Shape from '../components/live/Shapes';
import Icon from '../components/live/Icon';
import TimerRing from '../components/live/TimerRing';
import Confetti from '../components/live/Confetti';
import Leaderboard from '../components/live/Leaderboard';
import styles from './Live.module.css';

// Student: /live/:gameId — answer on your own device. The teacher's QR code
// opens this with ?code=<class code>, which also covers students who haven't
// joined the class yet.
export default function LivePlay() {
  const { gameId } = useParams();
  const [params] = useSearchParams();
  const code = params.get('code') || '';
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { language, t } = useLanguage();
  const { state, error, remaining, countdown, paused, refresh } = useLiveGame(user ? gameId : null);
  const [picked, setPicked] = useState({}); // question index → option chosen here
  const [answerError, setAnswerError] = useState('');
  const [notInClass, setNotInClass] = useState(false);
  const buzzed = useRef(-1);
  usePageTitle(!state ? null
    : state.phase === 'lobby' ? t('a11y.liveLobby', { name: state.title })
      : state.phase === 'ended' ? t('a11y.liveFinal')
        : t('a11y.liveQuestion', { i: state.index + 1, n: state.total }));

  useEffect(() => {
    if (!user) return;
    liveJoin(gameId).then(refresh).catch((e) => {
      if (/not allowed/i.test(e.message || '')) setNotInClass(true);
    });
  }, [user, gameId, refresh]);

  // A short buzz when the answer is revealed (phones that support it).
  const phase = state?.phase;
  const index = state?.index;
  useEffect(() => {
    if (phase === 'reveal' && buzzed.current !== index) {
      buzzed.current = index;
      try { navigator.vibrate?.(150); } catch { /* not supported */ }
    }
  }, [phase, index]);

  const joinUrl = `/join?${code ? `code=${encodeURIComponent(code)}&` : ''}next=${encodeURIComponent(`/live/${gameId}`)}`;
  if (!loading && !user) return <Navigate to={joinUrl} replace />;

  async function answer(i) {
    if (!state || picked[state.index] !== undefined || countdown > 0 || paused) return;
    const idx = state.index;
    setPicked((p) => ({ ...p, [idx]: i }));
    setAnswerError('');
    try {
      await liveAnswer(gameId, i);
    } catch (err) {
      setAnswerError(/time is up/i.test(err.message || '') ? t('live.tooLate') : t('live.errAnswer'));
    }
    refresh();
  }

  const q = state?.question;
  const options = optionTexts(q, language);
  const me = state?.me || {};
  const chosen = state ? (picked[state.index] ?? (me.answered ? me.option : undefined)) : undefined;
  const teamName = (n) => TEAM_NAMES[language]?.[n] ?? TEAM_NAMES.english[n];
  const teamBadge = state?.teams > 0 && me.team != null && (
    <span className={styles.teamBadge} style={{ background: TEAM_COLORS[me.team] }}>{t('live.onTeam', { name: teamName(me.team) })}</span>
  );

  let body;
  if (notInClass && !state) {
    body = (
      <div className={styles.playCard}>
        <div className={styles.bigIcon}><Icon name="key" size="1em" /></div>
        <h1 className={styles.resultText}>{t('live.joinClassFirst')}</h1>
        <button className={styles.go} onClick={() => navigate(joinUrl)}>{t('classes.joinTitle')}</button>
      </div>
    );
  } else if (error && !state) {
    body = <p className={styles.playCard}>{t('live.errLoad')}</p>;
  } else if (!state) {
    body = <p className={styles.playCard}>{t('content.loading')}</p>;
  } else if (me.kicked) {
    body = (
      <div className={styles.playCard}>
        <div className={styles.bigIcon}><Icon name="userX" size="1em" /></div>
        <h1 className={styles.resultText}>{t('live.kicked')}</h1>
        <button className={styles.ghost} onClick={() => navigate('/my-classes')}>{t('classes.navClasses')}</button>
      </div>
    );
  } else if (state.phase === 'lobby') {
    body = (
      <div className={styles.playCard}>
        <div className={`${styles.bigIcon} ${styles.goodText}`}><Icon name="circleCheck" size="1em" /></div>
        <h1 className={styles.resultText}>{t('live.youreIn')}</h1>
        {teamBadge}
        <p className={styles.muted}>{t('live.waitingStart')}</p>
        <div className={styles.count}>
          <span className={styles.countNum}>{state.players}</span>
          <span>{t('live.playersJoined')}</span>
        </div>
      </div>
    );
  } else if (state.phase === 'question' && countdown > 0) {
    body = (
      <div className={styles.playCard} aria-live="polite">
        <div className={styles.countdownLabel}>{t('live.getReady')}</div>
        <div key={countdown} className={styles.countdownNum} style={{ fontSize: 'clamp(120px, 40vw, 240px)' }}>{countdown}</div>
      </div>
    );
  } else if (state.phase === 'question' && q) {
    const locked = chosen !== undefined;
    const timeUp = remaining === 0 && !locked;
    body = (
      <>
        {paused && <div className={styles.pausedBanner}><Icon name="pause" size={20} /> {t('live.pausedPlayer')}</div>}
        <div className={styles.playBar} style={{ justifyContent: 'center' }}>
          <TimerRing remaining={remaining ?? 0} total={state.seconds} paused={paused} size={64} />
        </div>
        <div key={state.index} className={styles.playQ} dir="auto">{questionText(q, language)}</div>
        <div className={`${styles.playTiles} ${options.length > 4 ? styles.many : ''}`}>
          {options.map((o, i) => (
            <button
              key={`${state.index}-${i}`}
              className={`${styles.tile} ${styles[`t${i}`]} ${locked && chosen !== i ? styles.dim : ''} ${chosen === i ? styles.picked : ''}`}
              style={{ '--i': i }}
              onClick={() => answer(i)}
              disabled={locked || timeUp || paused}
              dir="auto"
            >
              <span className={styles.tileIcon}><Shape index={i} size={34} /></span>
              <span className={styles.tileText}>{o}</span>
            </button>
          ))}
        </div>
        <p className={styles.statusLine} aria-live="polite">
          {answerError || (locked ? t('live.lockedIn') : timeUp ? t('live.tooLate') : '')}
        </p>
      </>
    );
  } else if (state.phase === 'reveal' && q) {
    const right = me.correct === true;
    body = (
      <div className={styles.playCard}>
        <div className={`${styles.bigIcon} ${!me.answered ? styles.warnText : right ? styles.goodText : styles.badText}`}>
          <Icon name={!me.answered ? 'clock' : right ? 'circleCheck' : 'circleX'} size="1em" />
        </div>
        <p className={`${styles.resultText} ${right ? styles.goodText : styles.badText}`}>
          {!me.answered ? t('live.noAnswer') : right ? t('live.correctShort') : t('live.wrong')}
        </p>
        {right && <div className={styles.pts}>+{me.points}</div>}
        {me.streak >= 2 && <div className={styles.streakBig}><Icon name="flame" size={20} /> {t('live.streakBadge', { n: me.streak })}</div>}
        {!right && (
          <p className={styles.muted} dir="auto">
            {t('live.answerWas', { a: options[q.correct_index] ?? '' })}
          </p>
        )}
        <p className={styles.rankLine}>{t('live.yourScore', { n: me.score, rank: me.rank ?? '—' })}</p>
        <p className={styles.muted}>{t('live.waitingNext')}</p>
      </div>
    );
  } else {
    const podium = me.rank != null && me.rank <= 3 && me.score > 0;
    const leaders = (state.leaders || []).map((l, i) => ({ ...l, prev_rank: i + 1, delta: 0, teams_on: state.teams > 0 }));
    body = (
      <div className={styles.playCard} style={{ width: '100%' }}>
        {podium && <Confetti />}
        <div className={styles.bigIcon} style={{ color: podium ? ['#facc15', '#d1d5db', '#e08a3c'][me.rank - 1] : '#fff' }}>
          <Icon name={podium ? 'medal' : 'flag'} size="1em" />
        </div>
        <h1 className={styles.resultText}>{t('live.gameOver')}</h1>
        <p className={styles.rankLine}>{t('live.yourScore', { n: me.score ?? 0, rank: me.rank ?? '—' })}</p>
        {teamBadge}
        {leaders.length > 0 && <Leaderboard leaders={leaders} t={t} />}
        <button className={styles.ghost} style={{ marginTop: 12 }} onClick={() => navigate('/my-classes')}>{t('classes.navClasses')}</button>
      </div>
    );
  }

  return (
    <div className={styles.stage} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.play}>
        <div className={styles.playBar}>
          <button className={styles.ghost} onClick={() => navigate('/my-classes')}>{t('live.leave')}</button>
          {state?.title && <strong className={styles.stageTitle} style={{ textAlign: 'center' }}>{state.title}</strong>}
          {state && !me.kicked && <span className={styles.scoreChip}>{me.score ?? 0}</span>}
        </div>
        {body}
      </div>
    </div>
  );
}
