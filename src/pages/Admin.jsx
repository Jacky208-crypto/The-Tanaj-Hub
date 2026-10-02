import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuestionsAdmin from '../components/admin/QuestionsAdmin';
import PlacesAdmin from '../components/admin/PlacesAdmin';
import MidrashimAdmin from '../components/admin/MidrashimAdmin';
import NotesAdmin from '../components/admin/NotesAdmin';
import SuggestionsAdmin from '../components/admin/SuggestionsAdmin';
import styles from './Admin.module.css';

const TABS = [
  { id: 'questions', label: 'Quiz questions', Component: QuestionsAdmin },
  { id: 'suggestions', label: 'Suggestions', Component: SuggestionsAdmin },
  { id: 'places', label: 'Map places', Component: PlacesAdmin },
  { id: 'midrashim', label: 'Midrashim', Component: MidrashimAdmin },
  { id: 'notes', label: 'Study notes', Component: NotesAdmin },
];

// Content editor for accounts in public.admins. Loaded lazily from App.jsx,
// so regular visitors never download it. (The database enforces who may
// write; hiding the page is just for tidiness.)
export default function Admin() {
  const navigate = useNavigate();
  const { user, loading, isAdmin, adminChecked } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((t) => t.id === params.get('tab')) ?? TABS[0];
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  const notify = (text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 3000);
  };

  const header = (
    <div className={styles.header}>
      <button className="back-btn" onClick={() => navigate('/')}>← Home</button>
      <h1 className={styles.title}>Admin</h1>
    </div>
  );

  if (loading || (user && !adminChecked)) {
    return <div className={styles.page}><div className={styles.inner}>{header}<div className={styles.gate}>Loading…</div></div></div>;
  }
  if (!user || !isAdmin) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          {header}
          <div className={styles.gate}>
            <p>{user ? 'This account doesn’t have admin access.' : 'Log in with an admin account to edit content.'}</p>
            {!user && <button className="nav-btn" onClick={() => navigate('/login')}>Log in</button>}
          </div>
        </div>
      </div>
    );
  }

  const Section = tab.Component;
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {header}
        <nav className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${t.id === tab.id ? styles.tabOn : ''}`}
              onClick={() => setParams({ tab: t.id })}
            >
              {t.label}
            </button>
          ))}
        </nav>
        {message && <div className={styles.success}>{message} Changes are live on the site.</div>}
        <Section key={tab.id} notify={notify} />
      </div>
    </div>
  );
}
