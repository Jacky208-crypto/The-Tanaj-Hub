import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { exportMyData } from '../lib/supabaseClient';
import styles from './Account.module.css';

function saveJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tanaj-hub-my-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Account() {
  const navigate = useNavigate();
  const { user, loading, isAdmin, isAnonymous, deleteAccount } = useAuth();
  const { language, t } = useLanguage();
  const [downloading, setDownloading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [typedEmail, setTypedEmail] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // `deleting` stays true after a successful delete, which logs the person out.
  if (!loading && !user) {
    return deleting
      ? <Navigate to="/" replace />
      : <Navigate to="/login" state={{ from: '/account' }} replace />;
  }

  // Google-only accounts have no password to change.
  const hasPassword = user?.app_metadata?.providers?.includes('email')
    ?? user?.app_metadata?.provider === 'email';

  async function handleDownload() {
    setError('');
    setDownloading(true);
    try {
      saveJson(await exportMyData());
    } catch {
      setError(t('account.errGeneric'));
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    setError('');
    // Class accounts have no email, so they type a word instead.
    const expected = (user.email || t('account.deleteWord')).toLowerCase();
    if (typedEmail.trim().toLowerCase() !== expected) {
      setError(user.email ? t('account.errEmail') : t('account.errWord'));
      return;
    }
    setDeleting(true);
    try {
      await deleteAccount();
    } catch {
      setError(t('account.errGeneric'));
      setDeleting(false);
    }
  }

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/')}>{t('nav.home')}</button>
        <h1 className={styles.title}>{t('account.title')}</h1>
        {user && (
          <>
            <p className={styles.sub}>
              {user.user_metadata?.name && <>{user.user_metadata.name} · </>}
              {user.email ? <span dir="ltr">{user.email}</span> : t('classes.anonAccount')}
            </p>
            {isAnonymous && <p className={styles.sub}>{t('classes.anonAccountNote')}</p>}
            <div className={styles.card}>
              <button className={styles.action} onClick={handleDownload} disabled={downloading}>
                {downloading ? t('account.downloading') : t('account.download')}
              </button>
              {hasPassword && (
                <button className={styles.action} onClick={() => navigate('/reset-password')}>
                  {t('account.changePassword')}
                </button>
              )}
              {!isAdmin && !confirming && (
                <button
                  className={`${styles.action} ${styles.danger}`}
                  onClick={() => { setConfirming(true); setError(''); }}
                >
                  {t('account.delete')}
                </button>
              )}
              {confirming && (
                <form className={styles.form} onSubmit={handleDelete}>
                  <div className={styles.error}>{t('account.deleteWarning')}</div>
                  <label className={styles.label}>
                    {user.email
                      ? t('account.deleteConfirmLabel')
                      : t('account.deleteTypeWord', { word: t('account.deleteWord') })}
                    <input
                      className={styles.input}
                      type={user.email ? 'email' : 'text'}
                      dir="ltr"
                      autoComplete="off"
                      value={typedEmail}
                      onChange={(e) => setTypedEmail(e.target.value)}
                    />
                  </label>
                  <div className={styles.row}>
                    <button className={`${styles.action} ${styles.danger}`} type="submit" disabled={deleting}>
                      {deleting ? t('login.pleaseWait') : t('account.deleteConfirmBtn')}
                    </button>
                    <button
                      className={styles.action}
                      type="button"
                      onClick={() => { setConfirming(false); setTypedEmail(''); setError(''); }}
                    >
                      {t('account.cancel')}
                    </button>
                  </div>
                </form>
              )}
              {error && <div className={styles.error}>{error}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
