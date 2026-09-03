import { useEffect, useRef, useState } from 'react';
import { useTheme, THEMES, THEME_LABEL_KEYS } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './ThemeSwitcher.module.css';

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="4" y1="12" x2="1.5" y2="12" />
      <line x1="22.5" y1="12" x2="20" y2="12" />
      <line x1="4.9" y1="4.9" x2="6.6" y2="6.6" />
      <line x1="17.4" y1="17.4" x2="19.1" y2="19.1" />
      <line x1="4.9" y1="19.1" x2="6.6" y2="17.4" />
      <line x1="17.4" y1="6.6" x2="19.1" y2="4.9" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
    </svg>
  );
}

export default function ThemeSwitcher() {
  const { theme, setTheme, isDark } = useTheme();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-label={t('home.themeLabel')}
        aria-expanded={open}
      >
        {isDark ? <MoonIcon className={styles.icon} /> : <SunIcon className={styles.icon} />}
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {THEMES.map((th) => (
            <button
              key={th}
              type="button"
              role="menuitem"
              className={`${styles.option} ${th === theme ? styles.optionActive : ''}`}
              onClick={() => {
                setTheme(th);
                setOpen(false);
              }}
            >
              {t(THEME_LABEL_KEYS[th])}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
