import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>The Tanaj Study Hub</h1>
        <p className={styles.subtext}>The Tanaj Hub is an interactive platform to learn Torah, Neviim, and Ketuvim
          with quizzes and summaries</p>
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
          <strong>Helpful Notes</strong>
          <div className={styles.btnRow}>
          <button className="nav-btn" onClick={() => navigate('/notes')}>Helpful Notes</button>
          </div>
        </div>
      </div>
      <footer style={{ textAlign: 'center', padding: '2rem', color: '#888', fontSize: '0.85rem' }}>
  Made by Jacky Fnounou 
</footer>
    </div>

  );
}
