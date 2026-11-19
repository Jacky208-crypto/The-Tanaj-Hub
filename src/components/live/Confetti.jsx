import { useEffect, useRef } from 'react';
import styles from './LiveParts.module.css';

const COLORS = ['#f5c518', '#ff5d73', '#4cc9f0', '#80ed99', '#c77dff', '#ffffff'];

// A burst of falling confetti on a canvas that covers its parent. Does nothing
// for people who asked for reduced motion.
export default function Confetti({ duration = 5000, count = 160 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const canvas = ref.current;
    const c = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    size();
    const W = canvas.width;
    const bits = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: -Math.random() * canvas.height * 0.5,
      w: (6 + Math.random() * 8) * dpr,
      h: (10 + Math.random() * 10) * dpr,
      vx: (Math.random() - 0.5) * 3 * dpr,
      vy: (2 + Math.random() * 4) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    let raf;
    const start = performance.now();
    const frame = (now) => {
      const elapsed = now - start;
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.globalAlpha = elapsed > duration - 800 ? Math.max(0, (duration - elapsed) / 800) : 1;
      for (const b of bits) {
        b.x += b.vx; b.y += b.vy; b.rot += b.vr; b.vy += 0.02 * dpr;
        c.save();
        c.translate(b.x, b.y);
        c.rotate(b.rot);
        c.fillStyle = b.color;
        c.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        c.restore();
      }
      if (elapsed < duration) raf = requestAnimationFrame(frame);
      else c.clearRect(0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [duration, count]);

  return <canvas ref={ref} className={styles.confetti} aria-hidden="true" />;
}
