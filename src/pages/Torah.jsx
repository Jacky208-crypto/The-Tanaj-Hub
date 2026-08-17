import { useNavigate } from 'react-router-dom';
import { torahBooks } from '../data/books';
import { useLanguage } from '../context/LanguageContext';
import styles from './SectionPage.module.css';

export default function Torah() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('torah.title')}</h1>
      <p className={styles.subtext}>{t('torah.subtext')}</p>
      <div className={styles.btnGroup}>
        {torahBooks.map((book) => (
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
