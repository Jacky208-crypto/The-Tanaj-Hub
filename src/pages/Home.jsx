import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>The Tanaj Study Hub</h1>
        <p className={styles.subtext}>Study, read, and explore the Tanaj. It mantains and protects the world!</p>
      </header>

      <div className={styles.control}>
        <div className={styles.card}>
          <strong>Study Texts</strong>
          <div className={styles.btnRow}>
            <button className="nav-btn" onClick={() => navigate('/torah')}>Torah</button>
            <button className="nav-btn" onClick={() => navigate('/neviim')}>Neviim</button>
            <button className="nav-btn" onClick={() => navigate('/ketuvim')}>Ketuvim</button>
          </div>
        </div>
      </div>

      <div className={styles.control}>
        <div className={styles.card}>
          <strong>Practice Questions</strong>
          <div className={styles.btnRow}>
            <button className="nav-btn" onClick={() => navigate('/quiz')}>Practice Questions</button>
          </div>
        </div>
        <div className={styles.card}>
          <strong>Book Summaries</strong>
          <div className={styles.btnRow}>
            <button className="nav-btn" onClick={() => navigate('/summaries')}>Book Summaries</button>
          </div>
        </div>
      </div>
    </div>
  );
}
