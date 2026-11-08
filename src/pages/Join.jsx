import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { classCodeExists, joinClass } from '../lib/supabaseClient';
import Captcha from '../components/Captcha';
import { captchaEnabled } from '../lib/captcha';
import styles from './Classes.module.css';

// Students join a class with the teacher's code and a nickname. Without an
// account they get an anonymous "class account" (no email); with one, the
// class is added to it. A teacher's share link prefills ?code=.
export default function Join() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, loading, signInAnonymously } = useAuth();
  const { language, t } = useLanguage();
  const [code, setCode] = useState(params.get('code') || '');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const cleanCode = code.trim().toUpperCase();
    const cleanName = nickname.trim();
    if (!cleanCode || !cleanName) {
      setError(t('classes.errMissing'));
      return;
    }
    setBusy(true);
    try {
      if (!user) {
        // Check the code first so a typo doesn't create a class account.
        if ((await classCodeExists(cleanCode)) === false) {
          setError(t('classes.errCode'));
          setBusy(false);
          return;
        }
        if (captchaEnabled && !captchaToken) {
          setError(t('login.errCaptcha'));
          setBusy(false);
          return;
        }
        // A token is used once, whatever happens next.
        setCaptchaToken(null);
        setCaptchaKey((k) => k + 1);
        await signInAnonymously(cleanName, captchaToken);
      }
      await joinClass(cleanCode, cleanName);
      navigate('/my-classes');
    } catch (err) {
      const msg = err.message || '';
      setError(/no class/i.test(msg) ? t('classes.errCode')
        : /nickname is taken/i.test(msg) ? t('classes.errNickTaken')
        : t('classes.errGeneric'));
      setBusy(false);
    }
  }

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={`${styles.inner} ${styles.narrow}`}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>{t('classes.joinTitle')}</h1>
        <p className={styles.sub}>{t('classes.joinSubtitle')}</p>
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              {t('classes.code')}
              <input
                className={`${styles.input} ${styles.codeInput}`}
                dir="ltr"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="K7QM-2XPA"
              />
            </label>
            <label className={styles.label}>
              {t('classes.nickname')}
              <input
                className={styles.input}
                autoComplete="off"
                maxLength={40}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t('classes.nicknamePlaceholder')}
              />
            </label>
            {!loading && !user && <Captcha onToken={setCaptchaToken} resetKey={captchaKey} language={language} />}
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.primary} type="submit" disabled={busy || loading}>
              {busy ? t('login.pleaseWait') : t('classes.joinBtn')}
            </button>
          </form>
          {!loading && !user && (
            <>
              <p className={styles.hint}>{t('classes.anonNote')}</p>
              <p className={styles.hint}>
                {t('classes.haveAccount')}{' '}
                <button
                  className={styles.textBtn}
                  onClick={() => navigate('/login', { state: { from: `/join${code ? `?code=${encodeURIComponent(code.trim())}` : ''}` } })}
                >
                  {t('classes.logInFirst')}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
