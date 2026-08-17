import { useNavigate } from 'react-router-dom';
import { neviimRishonimBooks, neviimAjaranimBooks } from '../data/books';
import { useLanguage } from '../context/LanguageContext';
import styles from './SectionPage.module.css';

export default function Neviim() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('neviim.title')}</h1>
      <p className={styles.subtext}>{t('neviim.subtext')}</p>

      <h2 className={styles.subtitle}>{t('neviim.rishonim')}</h2>
      <div className={styles.btnGroup}>
        {neviimRishonimBooks.map((book) => (
          <button key={book.id} className="nav-btn" onClick={() => navigate(`/book/${book.id}`)}>
            {book.label}
          </button>
        ))}
      </div>

      <h2 className={styles.subtitle}>{t('neviim.ajaronim')}</h2>
      <div className={styles.btnGroup}>
        {neviimAjaranimBooks.map((book) => (
          <button key={book.id} className="nav-btn" onClick={() => navigate(`/book/${book.id}`)}>
            {book.label}
          </button>
        ))}
      </div>

      <button className="nav-btn" style={{ marginTop: 30, backgroundColor: '#444' }} onClick={() => navigate('/')}>
        {t('nav.home')}
      </button>
    </div>
  );
}
