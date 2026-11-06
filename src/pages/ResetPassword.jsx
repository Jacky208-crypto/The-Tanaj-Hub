import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './Account.module.css';

// Where a password-reset email lands: the link logs the person in (see
// handleOAuthCallback), then this form sets the new password. The account page
// links here too, for changing a password while logged in.
export default function ResetPassword() {
  const navigate = useNavigate();
  const { user, loading, updatePassword } = useAuth();
  const { language, t } = useLanguage();
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError(t('login.errPasswordLength'));
      return;
    }
    if (password !== repeat) {
      setError(t('reset.errMismatch'));
      return;
    }
    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError(err.message || t('login.errGeneric'));
    } finally {
      setBusy(false);
    }
  }

  let content = null;
  if (done) {
    content = (
      <>
        <div className={styles.info}>{t('reset.done')}</div>
        <button className="nav-btn" onClick={() => navigate('/')}>{t('reset.goHome')}</button>
      </>
    );
  } else if (!loading && !user) {
    content = (
      <>
        <div className={styles.error}>{t('reset.expired')}</div>
        <button className="nav-btn" onClick={() => navigate('/login', { state: { mode: 'forgot' } })}>
          {t('reset.requestNew')}
        </button>
      </>
    );
  } else if (user) {
    content = (
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          {t('reset.newPassword')}
          <input
            className={styles.input}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className={styles.label}>
          {t('reset.confirmPassword')}
          <input
            className={styles.input}
            type="password"
            autoComplete="new-password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
          />
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button className="nav-btn" type="submit" disabled={busy}>
          {busy ? t('login.pleaseWait') : t('reset.saveBtn')}
        </button>
      </form>
    );
  }

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>{t('reset.title')}</h1>
        {!done && user && <p className={styles.sub}>{t('reset.subtitle')}</p>}
        <div className={styles.card}>{content}</div>
      </div>
    </div>
  );
}
