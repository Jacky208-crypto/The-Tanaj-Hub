import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../data/books';
import ChapterReader from '../components/ChapterReader';
import styles from './BookPage.module.css';

export default function BookPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const book = getBookById(bookId);

  if (!book) {
    return (
      <div className={styles.notFound}>
        <p>Book not found.</p>
        <button className="nav-btn" onClick={() => navigate('/')}>← Home</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.title}>{book.label}</h1>
      </div>
      <ChapterReader book={book} />
    </div>
  );
}
