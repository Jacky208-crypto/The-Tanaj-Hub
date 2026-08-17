import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <LanguageSwitcher />

        <div className={styles.authBar}>
          {loading ? null : user ? (
            <>
              <span className={styles.welcome}>
                {t('home.greeting', { name: user.user_metadata?.name || user.email })}
              </span>
              <button className={styles.authBtn} onClick={signOut}>{t('home.logOut')}</button>
            </>
          ) : (
            <>
              <button className={styles.authBtn} onClick={() => navigate('/login')}>
                {t('home.logIn')}
              </button>
              <button
                className={styles.authBtn}
                onClick={() => navigate('/login', { state: { mode: 'signup' } })}
              >
                {t('home.signUp')}
              </button>
            </>
          )}
        </div>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>The Tanaj Study Hub</h1>
        <p className={styles.subtext}>{t('home.subtitle')}</p>
      </header>

      <div className={styles.control}>
        <div className={styles.card}>
          <strong>{t('home.studyTexts')}</strong>
          <div className={styles.btnRow}>
            <button className="nav-btn" onClick={() => navigate('/torah')}>Torah</button>
            <button className="nav-btn" onClick={() => navigate('/neviim')}>Neviim</button>
            <button className="nav-btn" onClick={() => navigate('/ketuvim')}>Ketuvim</button>
          </div>
        </div>
      </div>

      <div className={styles.control}>
          <div className={styles.card}>
            <strong>{t('home.practiceQuestions')}</strong>
            <div className={styles.btnRow}>
              <button className="nav-btn" onClick={() => navigate('/quiz')}>{t('home.practiceQuestions')}</button>
            </div>
          </div>

          <div className={styles.card}>
            <strong>{t('home.helpfulNotes')}</strong>
            <div className={styles.btnRow}>
            <button className="nav-btn" onClick={() => navigate('/notes')}>{t('home.helpfulNotes')}</button>
            </div>
          </div>
          <div className={styles.card}>
            <strong>{t('home.tanajSearch')}</strong>
            <div className={styles.btnRow}>
              <button className="nav-btn" onClick={() => navigate('/search')}>{t('home.tanajSearch')}</button>
            </div>
          </div>
          <div className={styles.card}>
            <strong>{t('home.biblicalMap')}</strong>
            <div className={styles.btnRow}>
            <button className="nav-btn" onClick={() => navigate('/map')}>{t('home.biblicalMap')}</button>
            </div>
          </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#888', fontSize: '0.85rem' }}>
  {t('home.footer')}
</footer>
    </div>

  );
}
