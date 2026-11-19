import { useMemo } from 'react';
import qrcode from 'qrcode-generator';
import styles from './LiveParts.module.css';

// A QR code for `value`, drawn as one SVG path (dark modules on white).
export default function Qr({ value, label }) {
  const { size, d } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let path = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) if (qr.isDark(r, c)) path += `M${c + 2},${r + 2}h1v1h-1z`;
    }
    return { size: n + 4, d: path };
  }, [value]);
  return (
    <svg className={styles.qr} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#fff" />
      <path d={d} fill="#0a0a1f" />
    </svg>
  );
}
