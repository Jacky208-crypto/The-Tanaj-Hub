import { useEffect, useState } from 'react';
import { TEAM_COLORS } from '../../lib/live';
import Icon from './Icon';
import styles from './LiveParts.module.css';

const ROW = 60; // px per row; keep in step with .lbRow in LiveParts.module.css

// Counts up from `from` to `to` over ~1s.
export function CountUp({ from, to, ms = 1000 }) {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || from === to) {
      const id = requestAnimationFrame(() => setV(to));
      return () => cancelAnimationFrame(id);
    }
    let raf;
    const t0 = performance.now();
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      setV(Math.round(from + (to - from) * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [from, to, ms]);
  return <>{v}</>;
}

// The top players between questions. Each row slides from where it stood
// before this question to where it stands now; the points count up, and a
// "+850" shows what was just earned.
export default function Leaderboard({ leaders, t, big = false, offset = 0 }) {
  const n = leaders.length;
  return (
    <ol className={`${styles.lb} ${big ? styles.lbBig : ''}`} style={{ height: n * ROW }}>
      {leaders.map((l, i) => {
        const from = Math.min((l.prev_rank ?? i + 1) - 1, n);
        const moved = (l.prev_rank ?? i + 1) - (i + 1);
        return (
          <li
            key={l.nickname}
            className={styles.lbRow}
            style={{ '--from': `${from * ROW}px`, '--to': `${i * ROW}px`, top: 0 }}
          >
            <span className={styles.lbRank}>{i + 1 + offset}</span>
            {l.team != null && l.teams_on && <span className={styles.lbTeam} style={{ background: TEAM_COLORS[l.team] }} />}
            <span className={styles.lbName}>{l.nickname}</span>
            {l.streak >= 2 && <span className={styles.lbStreak} title={t('live.streakBadge', { n: l.streak })}><Icon name="flame" size={14} />{l.streak}</span>}
            {moved > 0 && <span className={styles.lbUp} title={t('live.rankUp', { n: moved })}><Icon name="arrowUp" size={14} />{moved}</span>}
            {l.delta > 0 && <span className={styles.lbDelta}>+{l.delta}</span>}
            <span className={styles.lbScore}><CountUp from={l.score - l.delta} to={l.score} /></span>
          </li>
        );
      })}
    </ol>
  );
}
