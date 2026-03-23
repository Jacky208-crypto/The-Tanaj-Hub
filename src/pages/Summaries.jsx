import { useNavigate } from 'react-router-dom';
import styles from './Summaries.module.css';

const torahBooks = ['Bereshit', 'Shemot', 'Vaikra', 'Bamidbar', 'Devarim'];
const neviimBooks = ['Yehoshua', 'Shoftim', 'Shmuel Alef', 'Shmuel Bet', 'Melajim Alef', 'Melajim Bet'];

// Future: uncomment when summaries are added
// const neviimAjaranimBooks = [...];
// const ketuvimBooks = [...];

export default function Summaries() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Book Summaries</h1>
      <h2 className={styles.subtitle}>Choose a Book</h2>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Torah</p>
        <div className={styles.btnGroup}>
          {torahBooks.map((book) => (
            <button key={book} className="nav-btn" disabled>
              {book}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Neviim Rishonim</p>
        <div className={styles.btnGroup}>
          {neviimBooks.map((book) => (
            <button key={book} className="nav-btn" disabled>
              {book}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.comingSoon}>📖 Book summaries coming soon!</p>

      <button
        className="nav-btn"
        style={{ display: 'block', margin: '30px auto 0', backgroundColor: '#444' }}
        onClick={() => navigate('/')}
      >
        ← Home
      </button>
    </div>
  );
}
