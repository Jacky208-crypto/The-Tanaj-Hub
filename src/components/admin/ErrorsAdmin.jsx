import { useCallback, useEffect, useState } from 'react';
import { adminRpc } from '../../lib/adminApi';
import styles from '../../pages/Admin.module.css';
import { Loading } from './AdminKit';

// Crash reports sent by the site (supabase/classes_setup.sql section 18),
// grouped by message. Reports are anonymous and deleted after 30 days.
export default function ErrorsAdmin({ notify }) {
  const [rows, setRows] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [open, setOpen] = useState(null);

  const load = useCallback(() => {
    adminRpc('admin_list_errors')
      .then((r) => { setRows(r || []); setLoadError(null); })
      .catch((e) => setLoadError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function clearAll() {
    if (!window.confirm('Delete all error reports?')) return;
    try {
      await adminRpc('admin_clear_errors');
      notify('Error reports cleared.');
      load();
    } catch (err) {
      setLoadError(err.message);
    }
  }

  if (!rows) return <Loading error={loadError} onRetry={load} />;
  return (
    <div>
      <div className={styles.toolbar}>
        <span className={styles.count}>
          {rows.length === 0 ? 'No errors in the last 30 days.' : `${rows.length} different error${rows.length === 1 ? '' : 's'}`}
        </span>
        <button type="button" className={styles.secondaryBtn} onClick={load}>Refresh</button>
        {rows.length > 0 && <button type="button" className={styles.dangerBtn} onClick={clearAll}>Clear all</button>}
      </div>
      {rows.length > 0 && (
        <ul className={styles.list}>
          {rows.map((r) => (
            <li key={r.message}>
              <button
                type="button"
                className={styles.item}
                aria-expanded={open === r.message}
                onClick={() => setOpen(open === r.message ? null : r.message)}
              >
                <span className={styles.itemMain}>
                  <span className={styles.itemTitle}>{r.message}</span>
                  <span className={styles.itemMeta}>
                    {r.page} · last {new Date(r.last_seen).toLocaleString()}
                  </span>
                </span>
                <span className={`${styles.badge} ${r.times > 1 ? styles.badgeDraft : ''}`}>{r.times}×</span>
              </button>
              {open === r.message && (
                <pre style={{ margin: 0, padding: '8px 12px', fontSize: 12, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: 'var(--text-secondary)' }}>
                  {`${r.agent}\n\n${r.stack || '(no stack)'}`}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
