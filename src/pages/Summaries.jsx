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
      <h1 className={styles.title}>Helpful Notes</h1>
      

      <p className={styles.comingSoon}>📖 Notes coming soon!</p>

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
