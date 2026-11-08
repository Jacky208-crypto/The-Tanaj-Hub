import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { addClassNote, deleteClassNote, getClassNotes, getMyTeachingClasses } from '../../lib/supabaseClient';
import styles from './ClassVerseNotes.module.css';

// "From your teacher": class notes on this pasuk / perek, shown in the
// commentary panel above the reader's own notes (supabase/classes_setup.sql
// section 12). Teachers also get a small form to add one for a class.
// Renders nothing for visitors, and for students with no notes here.
export default function ClassVerseNotes({ book, chapter, verse }) {
  const { user, isTeacher } = useAuth();
  const { t } = useLanguage();
  const [notes, setNotes] = useState([]);
  const [teaching, setTeaching] = useState([]);
  const [form, setForm] = useState({ classId: '', scope: 'pasuk', body: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    getClassNotes(book.id, chapter).then(setNotes).catch(() => setNotes([]));
  }, [book.id, chapter]);
  useEffect(() => { if (user) load(); }, [user, load]);

  useEffect(() => {
    if (!isTeacher) return;
    getMyTeachingClasses().then(setTeaching).catch(() => setTeaching([]));
  }, [isTeacher]);

  if (!user) return null;
  const here = notes.filter((n) => n.verse === null || n.verse === verse);
  if (!here.length && !(isTeacher && teaching.length)) return null;
  const classId = form.classId || teaching[0]?.id;

  async function add(e) {
    e.preventDefault();
    if (!form.body.trim() || !classId) return;
    setBusy(true);
    setError('');
    try {
      await addClassNote({
        classId, bookId: book.id, chapter, verse: form.scope === 'pasuk' ? verse : null, body: form.body.trim(),
      });
      setForm((f) => ({ ...f, body: '' }));
      load();
    } catch {
      setError(t('classes.errGeneric'));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!window.confirm(t('classes.deleteNoteConfirm'))) return;
    try {
      await deleteClassNote(id);
      load();
    } catch {
      setError(t('classes.errGeneric'));
    }
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{t('classes.classNotesTitle')}</h3>
      {here.map((n) => (
        <div key={n.id} className={styles.note}>
          <div className={styles.body} dir="auto">{n.body}</div>
          <div className={styles.meta}>
            {n.classes?.name}
            {' · '}
            {n.verse === null ? t('classes.notePerek') : t('classes.notePasuk')}
            {n.classes?.teacher_id === user.id && (
              <button type="button" className={styles.delete} onClick={() => remove(n.id)}>{t('classes.delete')}</button>
            )}
          </div>
        </div>
      ))}
      {isTeacher && teaching.length > 0 && (
        <form className={styles.form} onSubmit={add}>
          <div className={styles.row}>
            {teaching.length > 1 && (
              <select
                className={styles.input}
                value={classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                aria-label={t('classes.noteClass')}
              >
                {teaching.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <select
              className={styles.input}
              value={form.scope}
              onChange={(e) => setForm({ ...form, scope: e.target.value })}
              aria-label={t('classes.noteScope')}
            >
              <option value="pasuk">{t('classes.notePasuk')}</option>
              <option value="perek">{t('classes.notePerek')}</option>
            </select>
          </div>
          <textarea
            className={styles.input}
            rows={2}
            maxLength={2000}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder={t('classes.classNotePlaceholder')}
            dir="auto"
          />
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.add} type="submit" disabled={busy || !form.body.trim()}>
            {t('classes.addNoteBtn')}
          </button>
        </form>
      )}
    </section>
  );
}
