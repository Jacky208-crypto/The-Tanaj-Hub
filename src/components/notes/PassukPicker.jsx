import { useState } from 'react';
import { allBooks, bookLabel } from '../../data/books';
import { fetchChapterVerses } from '../../lib/verseText';
import styles from './RichNote.module.css';

const LANGS = [
  { id: 'hebrew', label: 'עברית' },
  { id: 'english', label: 'English' },
  { id: 'spanish', label: 'Español' },
];

// Dialog for quoting any pasuk (or run of pesukim) into a note.
// Calls onPick(attrs for a passukQuote node).
export default function PassukPicker({ s, language, onPick, onClose }) {
  const [bookId, setBookId] = useState(allBooks[0].id);
  const [chapter, setChapter] = useState(1);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState('');
  const [lang, setLang] = useState(language === 'hebrew' ? 'hebrew' : language);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const book = allBooks.find((b) => b.id === bookId);

  async function add(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const verses = await fetchChapterVerses(book.sefaria, chapter, lang);
      const end = Math.max(from, Number(to) || from);
      const picked = verses.slice(from - 1, end);
      if (!picked.length) throw new Error('empty');
      const lastVerse = from + picked.length - 1;
      const range = lastVerse > from ? `${from}–${lastVerse}` : `${from}`;
      onPick({
        bookId, chapter, verse: from, verseTo: lastVerse > from ? lastVerse : null,
        label: `${bookLabel(bookId, lang)} ${chapter}:${range}`,
        text: picked.join(' '),
        lang,
      });
    } catch {
      setError(s.loadError);
      setBusy(false);
    }
  }

  return (
    <div className={styles.modalBackdrop} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className={styles.modal} onSubmit={add}>
        <h3 className={styles.modalTitle}>{s.pickPassuk}</h3>
        <label className={styles.field}>
          <span>{s.book}</span>
          <select value={bookId} onChange={(e) => { setBookId(e.target.value); setChapter(1); }}>
            {allBooks.map((b) => (
              <option key={b.id} value={b.id}>{bookLabel(b.id, language)}</option>
            ))}
          </select>
        </label>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span>{s.chapter}</span>
            <input type="number" min={1} max={book.chapters} value={chapter}
              onChange={(e) => setChapter(Math.min(book.chapters, Math.max(1, Number(e.target.value) || 1)))} />
          </label>
          <label className={styles.field}>
            <span>{s.verse}</span>
            <input type="number" min={1} value={from} onChange={(e) => setFrom(Math.max(1, Number(e.target.value) || 1))} />
          </label>
          <label className={styles.field}>
            <span>{s.to}</span>
            <input type="number" min={from} value={to} placeholder="—" onChange={(e) => setTo(e.target.value)} />
          </label>
        </div>
        <label className={styles.field}>
          <span>{s.language}</span>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
        </label>
        {error && <p className={styles.modalError}>{error}</p>}
        <div className={styles.modalActions}>
          <button type="submit" className="nav-btn" disabled={busy}>{busy ? s.loading : s.add}</button>
          <button type="button" className={styles.ghostBtn} onClick={onClose}>{s.cancel}</button>
        </div>
      </form>
    </div>
  );
}
