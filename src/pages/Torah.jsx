import { useNavigate } from 'react-router-dom';
import { torahBooks } from '../data/books';
import styles from './SectionPage.module.css';

export default function Torah() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Torah</h1>
      <p className={styles.subtext}>The Torah is the foundational text of the Hebrew Bible and Judaism.</p>
      <div className={styles.btnGroup}>
        {torahBooks.map((book) => (
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
