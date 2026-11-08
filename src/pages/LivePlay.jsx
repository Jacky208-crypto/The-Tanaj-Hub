import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { liveAnswer, liveJoin } from '../lib/supabaseClient';
import { LETTERS, optionTexts, questionText, useLiveGame } from '../lib/live';
import styles from './Live.module.css';

// Student: /live/:gameId — answer on your own device.
export default function LivePlay() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { language, t } = useLanguage();
  const { state, error, remaining, refresh } = useLiveGame(user ? gameId : null);
  const [picked, setPicked] = useState({}); // question index → option chosen here
  const [answerError, setAnswerError] = useState('');

  useEffect(() => {
    if (!user) return;
    liveJoin(gameId).then(refresh).catch(() => {});
  }, [user, gameId, refresh]);

  if (!loading && !user) return <Navigate to="/join" replace />;

  async function answer(i) {
    if (!state || picked[state.index] !== undefined) return;
    const index = state.index;
    setPicked((p) => ({ ...p, [index]: i }));
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

  let body;
  if (error && !state) {
    body = <div className={styles.error}>{t('live.errLoad')}</div>;
  } else if (!state) {
    body = <p className={styles.sub}>{t('content.loading')}</p>;
  } else if (state.phase === 'lobby') {
    body = (
      <div className={`${styles.card} ${styles.center}`}>
        <h1 className={styles.title}>{t('live.youreIn')}</h1>
        <p className={styles.sub}>{t('live.waitingStart')}</p>
        <div className={styles.bigNumber}>{state.players}</div>
        <p className={styles.sub}>{t('live.playersJoined')}</p>
      </div>
    );
  } else if (state.phase === 'question' && q) {
    const locked = chosen !== undefined;
    const timeUp = remaining === 0 && !locked;
    body = (
      <div className={styles.card}>
        <div className={styles.progressRow}>
          <span>{t('live.questionOf', { i: state.index + 1, n: state.total })}</span>
          <span className={`${styles.timer} ${remaining !== null && remaining <= 5 ? styles.timerLow : ''}`}>
            {Math.ceil(remaining ?? 0)}
          </span>
        </div>
        <p className={styles.question} dir="auto">{questionText(q, language)}</p>
        <div className={styles.options}>
          {options.map((o, i) => (
            <button
              key={i}
              className={`${styles.option} ${styles[`opt${i}`]} ${locked && chosen !== i ? styles.faded : ''} ${chosen === i ? styles.picked : ''}`}
              onClick={() => answer(i)}
              disabled={locked || timeUp}
              dir="auto"
            >
              <span className={styles.letter}>{LETTERS[i]}</span>
              <span>{o}</span>
            </button>
          ))}
        </div>
        <p className={`${styles.sub} ${styles.center}`} style={{ marginTop: 14 }}>
          {answerError || (locked ? t('live.lockedIn') : timeUp ? t('live.tooLate') : '')}
        </p>
      </div>
    );
  } else if (state.phase === 'reveal' && q) {
    const right = me.correct === true;
    body = (
      <div className={`${styles.card} ${styles.center}`}>
        <p className={styles.sub}>{t('live.questionOf', { i: state.index + 1, n: state.total })}</p>
        <p className={`${styles.result} ${right ? styles.good : styles.bad}`}>
          {!me.answered ? t('live.noAnswer') : right ? t('live.correct', { n: me.points }) : t('live.wrong')}
        </p>
        <p className={styles.sub} dir="auto">
          {t('live.answerWas', { a: `${LETTERS[q.correct_index]}. ${options[q.correct_index] ?? ''}` })}
        </p>
        <p className={styles.podium}>{t('live.yourScore', { n: me.score, rank: me.rank ?? '—' })}</p>
        <p className={styles.sub}>{t('live.waitingNext')}</p>
      </div>
    );
  } else {
    body = (
      <div className={`${styles.card} ${styles.center}`}>
        <h1 className={styles.title}>{t('live.gameOver')}</h1>
        <p className={styles.podium}>{t('live.yourScore', { n: me.score ?? 0, rank: me.rank ?? '—' })}</p>
        <div className={styles.leaders}>
          {(state.leaders || []).map((l, i) => (
            <div key={`${l.nickname}-${i}`} className={styles.leader}>
              <span><span className={styles.rank}>{i + 1}.</span> {l.nickname}</span>
              <span>{t('live.pointsShort', { n: l.score })}</span>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={() => navigate('/my-classes')}>{t('classes.navClasses')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={`${styles.inner} ${styles.narrow}`}>
        <div className={styles.topRow}>
          <button className={styles.back} onClick={() => navigate('/my-classes')}>{t('live.leave')}</button>
          {state?.title && <strong>{state.title}</strong>}
        </div>
        {body}
      </div>
    </div>
  );
}
