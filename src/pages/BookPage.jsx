import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getBookById } from '../data/books';
import ChapterReader from '../components/ChapterReader';
import { useLanguage } from '../context/LanguageContext';
import styles from './BookPage.module.css';

export default function BookPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const book = getBookById(bookId);
  const chapterParam = Number(searchParams.get('chapter'));
  const initialChapter =
    book && chapterParam >= 1 && chapterParam <= book.chapters ? chapterParam : null;

  if (!book) {
    return (
      <div className={styles.notFound}>
        <p>{t('bookPage.notFound')}</p>
        <button className="nav-btn" onClick={() => navigate('/')}>{t('nav.home')}</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className="back-btn" onClick={() => navigate(-1)}>{t('nav.back')}</button>
        <h1 className={styles.title}>{book.label}</h1>
      </div>
      <ChapterReader book={book} initialChapter={initialChapter} />
    </div>
  );
}
