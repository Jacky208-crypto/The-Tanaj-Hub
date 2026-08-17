import { useEffect, useRef, useState } from 'react';
import { useLanguage, LANGUAGES, LANGUAGE_LABELS, LANGUAGE_CODES } from '../context/LanguageContext';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
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
        aria-label={t('home.languageLabel')}
        aria-expanded={open}
      >
        <svg
          className={styles.globe}
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
        </svg>
        <span className={styles.code}>{LANGUAGE_CODES[language]}</span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              role="menuitem"
              className={`${styles.option} ${lang === language ? styles.optionActive : ''}`}
              onClick={() => {
                setLanguage(lang);
                setOpen(false);
              }}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
