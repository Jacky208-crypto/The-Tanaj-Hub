import { useEffect, useRef, useState } from 'react';
import Confetti from './Confetti';
import Icon from './Icon';
import { TEAM_COLORS } from '../../lib/live';
import styles from './LiveParts.module.css';

// Final results: 3rd, then 2nd, then 1st rises with a burst of confetti.
export default function Podium({ leaders, t, onWinner }) {
  const [celebrate, setCelebrate] = useState(false);
  const winner = useRef(onWinner);
  useEffect(() => { winner.current = onWinner; });
  useEffect(() => {
    const id = setTimeout(() => { setCelebrate(true); winner.current?.(); }, 3400);
    return () => clearTimeout(id);
  }, []);

  const top = leaders.slice(0, 3);
  // Visual order: 2nd, 1st, 3rd. Delays: 3rd first, then 2nd, then the winner.
  const slots = [
    { p: top[1], place: 2, delay: '1.6s' },
    { p: top[0], place: 1, delay: '3s' },
    { p: top[2], place: 3, delay: '0.3s' },
  ];
  return (
    <div className={styles.podiumWrap}>
      {celebrate && <Confetti />}
      <div className={styles.podium}>
        {slots.map(({ p, place, delay }) => (
          <div key={place} className={styles.podiumCol} style={{ '--delay': delay }}>
            {p ? (
              <>
                <div className={styles.podiumName}>
                  {place === 1 && <span className={styles.crown}><Icon name="crown" size={30} /></span>}
                  {p.team != null && p.teams_on && <span className={styles.lbTeam} style={{ background: TEAM_COLORS[p.team] }} />}
                  {p.nickname}
                </div>
                <div className={styles.podiumScore}>{t('live.pointsShort', { n: p.score })}</div>
              </>
            ) : <div className={styles.podiumName}>&nbsp;</div>}
            <div className={`${styles.podiumBlock} ${styles[`place${place}`]}`}><span>{place}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
