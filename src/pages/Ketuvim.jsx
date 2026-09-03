import { useNavigate } from 'react-router-dom';
import { ketuvimBooks } from '../data/books';
import { useLanguage } from '../context/LanguageContext';
import styles from './SectionPage.module.css';

export default function Ketuvim() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('ketuvim.title')}</h1>
      <p className={styles.subtext}>{t('ketuvim.subtext')}</p>
      <div className={styles.btnGroup}>
        {ketuvimBooks.map((book) => (
          <button key={book.id} className="nav-btn" onClick={() => navigate(`/book/${book.id}`)}>
            {book.label}
          </button>
        ))}
      </div>
      <button className="nav-btn" style={{ marginTop: 30, backgroundColor: 'var(--text-muted)' }} onClick={() => navigate('/')}>
        {t('nav.home')}
      </button>
    </div>
  );
}
