import { useNavigate } from 'react-router-dom';
import { ketuvimBooks } from '../data/books';
import styles from './SectionPage.module.css';

export default function Ketuvim() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Ketuvim</h1>
      <p className={styles.subtext}>Ketuvim reflects the spiritual, emotional, and philosophical experiences of the Jewish people throughout history.</p>
      <div className={styles.btnGroup}>
        {ketuvimBooks.map((book) => (
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
