import { useCallback, useEffect, useState } from 'react';
import { adminRpc } from '../../lib/adminApi';
import styles from '../../pages/Admin.module.css';
import { Field, Loading, TextInput } from './AdminKit';

// Who may create classes (supabase/classes_setup.sql). Teachers are added by
// email, so it works before they sign up: they get the Teach page as soon as
// they log in with that email.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TeachersAdmin({ notify }) {
  const [rows, setRows] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    adminRpc('admin_list_teachers')
      .then((r) => { setRows(r || []); setLoadError(null); })
      .catch((e) => setLoadError(e.message));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function add(e) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL.test(clean)) {
      setError('Enter a valid email address.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await adminRpc('admin_add_teacher', { teacher_email: clean, school_name: school.trim() || null });
      setEmail('');
      setSchool('');
      notify(`${clean} is now a teacher.`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(row) {
    if (!window.confirm(`Remove ${row.email} as a teacher? They can no longer create classes or open the Teach page. Their existing classes stay.`)) return;
    try {
      await adminRpc('admin_remove_teacher', { teacher_email: row.email });
      notify(`${row.email} is no longer a teacher.`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <form className={styles.editor} onSubmit={add}>
        <div className={styles.twoCol}>
          <Field label="Teacher's email" hint="The email they sign up or log in with.">
            <TextInput type="email" value={email} onChange={setEmail} placeholder="teacher@school.org" />
          </Field>
          <Field label="School (optional)">
            <TextInput value={school} onChange={setSchool} placeholder="School name" />
          </Field>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <button type="submit" className={styles.primaryBtn} disabled={busy}>
            {busy ? 'Adding…' : 'Add teacher'}
          </button>
        </div>
      </form>

      {!rows ? (
        <Loading error={loadError} onRetry={load} />
      ) : rows.length === 0 ? (
        <div className={styles.empty}>No teachers yet.</div>
      ) : (
        <ul className={styles.list}>
          {rows.map((r) => (
            <li key={r.email}>
              <div className={styles.item} style={{ cursor: 'default' }}>
                <span className={styles.itemMain}>
                  <span className={styles.itemTitle}>{r.name ? `${r.name} · ${r.email}` : r.email}</span>
                  <span className={styles.itemMeta}>
                    {[r.school, `added ${new Date(r.added_at).toLocaleDateString()}`, r.has_account ? `${r.class_count} active class${r.class_count === 1 ? '' : 'es'}` : null]
                      .filter(Boolean).join(' · ')}
                  </span>
                </span>
                {r.has_account
                  ? <span className={styles.badge}>has account</span>
                  : <span className={`${styles.badge} ${styles.badgeDraft}`}>waiting for sign-up</span>}
                <button type="button" className={styles.dangerBtn} onClick={() => remove(r)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
