import Icon from './Icon';
import styles from './LiveParts.module.css';

// A ring that drains as time runs out: green → yellow → red, pulsing at the end.
export default function TimerRing({ remaining, total, paused = false, size = 96 }) {
  const frac = total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0;
  const R = 44;
  const C = 2 * Math.PI * R;
  const color = frac > 0.5 ? '#4ade80' : frac > 0.25 ? '#facc15' : '#f87171';
  const low = remaining <= 5 && !paused;
  return (
    <div className={`${styles.ring} ${low ? styles.ringLow : ''}`} style={{ width: size, height: size }} role="timer" aria-live="off">
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={R} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={styles.ringNum} style={{ fontSize: size * 0.38 }}>{paused ? <Icon name="pause" size={size * 0.34} /> : Math.ceil(remaining)}</span>
    </div>
  );
}
