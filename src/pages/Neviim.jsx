import { useNavigate } from 'react-router-dom';
import { neviimRishonimBooks, neviimAjaranimBooks } from '../data/books';
import styles from './SectionPage.module.css';

export default function Neviim() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Neviim</h1>
      <p className={styles.subtext}>Neviim records how Hashem spoke through prophets to guide, warn, and inspire the people of Israel.</p>

      <h2 className={styles.subtitle}>Neviim Rishonim</h2>
      <div className={styles.btnGroup}>
        {neviimRishonimBooks.map((book) => (
          <button key={book.id} className="nav-btn" onClick={() => navigate(`/book/${book.id}`)}>
            {book.label}
          </button>
        ))}
      </div>

      <h2 className={styles.subtitle}>Neviim Ajaronim</h2>
      <div className={styles.btnGroup}>
        {neviimAjaranimBooks.map((book) => (
          <button key={book.id} className="nav-btn" onClick={() => navigate(`/book/${book.id}`)}>
            {book.label}
          </button>
        ))}
      </div>

      <button className="nav-btn" style={{ marginTop: 30, backgroundColor: '#444' }} onClick={() => navigate('/')}>
        ← Home
      </button>
    </div>
  );
}
