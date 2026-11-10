import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Captcha from '../components/Captcha';
import { captchaEnabled } from '../lib/captcha';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, requestPasswordReset, isConfigured } = useAuth();
  const { language, t } = useLanguage();

  // 'login', 'signup' or 'forgot'. Links here can pick one through `state.mode`.
  const [mode, setMode] = useState(location.state?.mode || 'login');
  // Pages that send people here to log in pass `from` so they come back after.
  const returnTo = location.state?.from || '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaKey, setCaptchaKey] = useState(0); // bump for a fresh, single-use token
  const newCaptcha = () => { setCaptchaToken(null); setCaptchaKey((k) => k + 1); };
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError('');
    setInfo('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!isConfigured) {
      setError(t('login.errNotConfigured'));
      return;
    }
    if (captchaEnabled && !captchaToken) {
      setError(t('login.errCaptcha'));
      return;
    }
    if (mode === 'forgot') {
      if (!email) {
        setError(t('login.errMissingEmail'));
        return;
      }
      setBusy(true);
      try {
        await requestPasswordReset(email, captchaToken);
        setInfo(t('login.resetSent'));
      } catch (err) {
        setError(err.message || t('login.errGeneric'));
      } finally {
        setBusy(false);
        newCaptcha();
      }
      return;
    }
    if (!email || !password) {
      setError(t('login.errMissingFields'));
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError(t('login.errMissingName'));
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError(t('login.errPasswordLength'));
      return;
    }
    if (mode === 'signup' && !ageConfirmed) {
      setError(t('login.errAge'));
      return;
    }

    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email, password, captchaToken);
        navigate(returnTo);
      } else {
        const result = await signUp(email, password, name.trim(), captchaToken);
        if (result.needsConfirmation) {
          setInfo(t('login.infoConfirmEmail'));
          setMode('login');
        } else {
          navigate(returnTo);
        }
      }
    } catch (err) {
      setError(err.message || t('login.errGeneric'));
    } finally {
      setBusy(false);
      newCaptcha();
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>
          {mode === 'login' ? t('login.logIn') : mode === 'signup' ? t('login.createAccount') : t('login.forgotTitle')}
        </h1>
        <p className={styles.subtext}>
          {mode === 'login' ? t('login.welcomeBack') : mode === 'signup' ? t('login.signUpSubtitle') : t('login.forgotSubtitle')}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className={styles.label}>
              {t('login.name')}
              <input
                className={styles.input}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('login.namePlaceholder')}
              />
            </label>
          )}
          <label className={styles.label}>
            {t('login.email')}
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          {mode !== 'forgot' && (
            <label className={styles.label}>
              {t('login.password')}
              <input
                className={styles.input}
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>
          )}
          {mode === 'login' && (
            <button type="button" className={styles.forgot} onClick={() => switchMode('forgot')}>
              {t('login.forgotLink')}
            </button>
          )}
          {mode === 'signup' && (
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
              />
              <span>
                {t('login.ageConfirm')} <Link to="/privacy">{t('home.privacyLink')}</Link>
              </span>
            </label>
          )}

          <Captcha onToken={setCaptchaToken} resetKey={captchaKey} language={language} />
          {error && <div className={styles.error}>{error}</div>}
          {info && <div className={styles.info}>{info}</div>}

          <button className="nav-btn" type="submit" disabled={busy}>
            {busy
              ? t('login.pleaseWait')
              : mode === 'login'
                ? t('login.logInBtn')
                : mode === 'signup'
                  ? t('login.signUpBtn')
                  : t('login.sendResetBtn')}
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className={styles.divider}><span>{t('login.or')}</span></div>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={() => {
                setError('');
                if (!isConfigured) {
                  setError(t('login.errNotConfigured'));
                  return;
                }
                if (mode === 'signup' && !ageConfirmed) {
                  setError(t('login.errAge'));
                  return;
                }
                signInWithGoogle();
              }}
            >
              <svg className={styles.googleIcon} viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
              </svg>
              {t('login.signInGoogle')}
            </button>
            <p className={styles.note}>
              {t('login.googleNote')} <Link to="/privacy">{t('home.privacyLink')}</Link>
            </p>
          </>
        )}

        <div className={styles.toggle}>
          {mode === 'login' ? (
            <>
              {t('login.noAccount')}{' '}
              <button className={styles.linkBtn} onClick={() => switchMode('signup')}>
                {t('login.signUpLink')}
              </button>
            </>
          ) : mode === 'signup' ? (
            <>
              {t('login.haveAccount')}{' '}
              <button className={styles.linkBtn} onClick={() => switchMode('login')}>
                {t('login.logInLink')}
              </button>
            </>
          ) : (
            <button className={styles.linkBtn} onClick={() => switchMode('login')}>
              {t('login.backToLogin')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
