import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  return (
    <div className={styles.page}>
      <div className={styles.authBar}>
        {loading ? null : user ? (
          <>
            <span className={styles.welcome}>
              Hi, {user.user_metadata?.name || user.email}
            </span>
            <button className={styles.authBtn} onClick={signOut}>Log out</button>
          </>
        ) : (
          <>
            <button className={styles.authBtn} onClick={() => navigate('/login')}>
              Log in
            </button>
            <button
              className={styles.authBtn}
              onClick={() => navigate('/login', { state: { mode: 'signup' } })}
            >
              Sign up
            </button>
          </>
        )}
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>The Tanaj Study Hub</h1>
        <p className={styles.subtext}> The Tanaj Hub is an interactive platform to learn Tanaj with quizzes and summaries</p>
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
          <div className={styles.card}>
            <strong>Tanaj Search</strong>
            <div className={styles.btnRow}>
              <button className="nav-btn" onClick={() => navigate('/search')}>Tanaj Search</button>
            </div>
          </div>
          <div className={styles.card}>
            <strong>Places Map</strong>
            <div className={styles.btnRow}>
            <button className="nav-btn" onClick={() => navigate('/map')}>Places Map</button>
            </div>
          </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#888', fontSize: '0.85rem' }}>
  Made by Jacky Fnounou
</footer>
    </div>

  );
}
