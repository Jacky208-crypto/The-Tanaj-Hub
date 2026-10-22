import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookLabel } from '../../data/books';
import { createUserNote, updateUserNote, deleteUserNote } from '../../lib/supabaseClient';
import RichNoteEditor from './RichNoteEditor';
import { noteStrings } from './noteStrings';
import { PASSUK_COLORS, anchorRef, isEmptyHtml } from './noteUtils';
import styles from './PassukNotes.module.css';

const SAVE_DELAY = 700;

// Does this pasuk note cover `verse`?
const covers = (note, verse) => note.verse_from && note.verse_from <= verse && verse <= (note.verse_to || note.verse_from);

// "My note" section at the bottom of the commentary panel. Two kinds of note:
//  - Whole perek: one note per chapter that stays open while clicking from
//    pasuk to pasuk.
//  - This pasuk: a note on the selected pasuk. On the next pasuk the user can
//    "continue" it (it then covers 2:4–5) or start a separate one.
// Saves automatically. `notes` are the user's notes on this chapter (owned by
// the reader so it can highlight quoted pesukim).
export default function PassukNotes({
  book, chapter, verse, verseText, readerLanguage, notes, setNotes, notesError, pendingAction, onActionDone,
}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const s = noteStrings(language);
  const [scope, setScope] = useState('passuk'); // 'passuk' | 'perek'
  const [color, setColor] = useState('yellow');
  const [status, setStatus] = useState(null); // 'saving' | 'saved' | 'error'
  const [error, setError] = useState('');
  const [separateAt, setSeparateAt] = useState(null); // verse where "start a separate note" was chosen
  const [editor, setEditor] = useState(null);
  const slotIds = useRef({}); // editor slot → note id (bridges the gap before `notes` updates)
  const chains = useRef({}); // editor slot → promise of its last save, so saves run in order
  const pending = useRef(null); // { timer, run } — debounced save not sent yet

  const perekNote = notes.find((n) => !n.verse_from);
  const passukNote = notes.find((n) => covers(n, verse));
  const prevNote = !passukNote && separateAt !== verse
    ? notes.find((n) => n.verse_from && (n.verse_to || n.verse_from) === verse - 1)
    : null;
  const activeNote = scope === 'perek' ? perekNote : passukNote;

  // One editor "slot" per note: the perek, or the first pasuk a pasuk note
  // covers. A note that grows to 2:4–5 keeps the same slot (and editor).
  const slot = scope === 'perek' ? 'perek' : `v${passukNote?.verse_from ?? verse}`;
  const slotKey = `${book.id}:${chapter}:${slot}`;
  if (activeNote) slotIds.current[slotKey] = activeNote.id;
  const anchor = scope === 'perek'
    ? { book_id: book.id, chapter, verse_from: null, verse_to: null }
    : { book_id: book.id, chapter, verse_from: verse, verse_to: verse };

  const upsert = (note) => setNotes((prev) => [note, ...prev.filter((n) => n.id !== note.id)]);

  function persist(key, noteAnchor, html) {
    setStatus('saving');
    const run = async () => {
      const id = slotIds.current[key];
      if (id && isEmptyHtml(html)) {
        await deleteUserNote(id);
        delete slotIds.current[key];
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else if (id) {
        upsert(await updateUserNote(id, { body: html }));
      } else if (!isEmptyHtml(html)) {
        const created = await createUserNote({ title: '', body: html, anchor: noteAnchor });
        slotIds.current[key] = created.id;
        upsert(created);
      }
    };
    const next = (chains.current[key] || Promise.resolve()).then(run);
    chains.current[key] = next.catch(() => {});
    next
      .then(() => setStatus('saved'))
      .catch((e) => {
        setStatus('error');
        setError(/book_id|verse_from|column/i.test(e.message) ? s.migrationNeeded : e.message || s.saveError);
      });
  }

  function flush() {
    if (!pending.current) return;
    clearTimeout(pending.current.timer);
    const { run } = pending.current;
    pending.current = null;
    run();
  }

  function onChange(html) {
    if (pending.current) clearTimeout(pending.current.timer);
    const key = slotKey;
    const noteAnchor = anchor;
    const run = () => persist(key, noteAnchor, html);
    pending.current = { run, timer: setTimeout(() => { pending.current = null; run(); }, SAVE_DELAY) };
  }

  // Save right away when switching pasuk/perek, or when the panel closes.
  useEffect(() => flush, [slotKey]);

  async function continueNote() {
    flush();
    try {
      upsert(await updateUserNote(prevNote.id, { verse_to: verse }));
    } catch (e) {
      setStatus('error');
      setError(e.message || s.saveError);
    }
  }

  async function endBefore() {
    flush();
    try {
      upsert(await updateUserNote(passukNote.id, { verse_to: verse - 1 }));
      setSeparateAt(verse);
    } catch (e) {
      setStatus('error');
      setError(e.message || s.saveError);
    }
  }

  const label = (from, to) => `${bookLabel(book.id, readerLanguage)} ${chapter}:${to && to > from ? `${from}–${to}` : from}`;

  function quote(text, from = verse, to = null) {
    if (!editor) return;
    editor.chain().focus().insertPassukQuote({
      bookId: book.id, chapter, verse: from, verseTo: to && to > from ? to : null,
      label: label(from, to), text, lang: readerLanguage, color,
    }, { atEnd: true }).run();
  }

  function askQuestion(from = verse, to = null) {
    if (!editor) return;
    editor.chain().focus().insertCallout({ kind: 'question', ref: label(from, to) }, '', { atEnd: true }).run();
  }

  // Actions started from a text selection in the reader ("Highlight & quote",
  // "Question on this"). Wait until the right pasuk's editor is ready.
  useEffect(() => {
    if (!pendingAction || !editor || pendingAction.verse !== verse) return;
    const { type, text, verse: from, verseTo } = pendingAction;
    quote(text, from, verseTo);
    if (type === 'question') askQuestion(from, verseTo);
    onActionDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAction, editor, verse]);

  if (!user) {
    return (
      <section className={styles.section}>
        <h3 className={styles.title}>✎ {s.myNote}</h3>
        <p className={styles.muted}>{s.loginToNote}</p>
        <Link className={styles.loginBtn} to="/login">{s.login}</Link>
      </section>
    );
  }

  const ref = anchorRef(activeNote, language);

  return (
    <section className={styles.section} id="passuk-notes">
      <div className={styles.headRow}>
        <h3 className={styles.title}>✎ {s.myNote}</h3>
        <span className={styles.status} aria-live="polite">
          {status === 'saving' ? s.saving : status === 'saved' ? `✓ ${s.saved}` : ''}
        </span>
      </div>

      <div className={styles.scopeToggle} role="tablist">
        {[['passuk', s.thisPassuk], ['perek', s.wholePerek]].map(([id, text]) => (
          <button
            key={id}
            role="tab"
            aria-selected={scope === id}
            className={`${styles.scopeBtn} ${scope === id ? styles.scopeActive : ''}`}
            onClick={() => { flush(); setScope(id); }}
          >
            {text}
          </button>
        ))}
      </div>

      {notesError && <p className={styles.error}>{s.migrationNeeded}</p>}

      {scope === 'passuk' && prevNote ? (
        <div className={styles.continueBox}>
          <button className={styles.continueBtn} onClick={continueNote}>
            ↪ {s.continueFrom(anchorRef(prevNote, language))}
          </button>
          <p className={styles.muted}>{s.continueHint}</p>
          <button className={styles.linkBtn} onClick={() => setSeparateAt(verse)}>{s.newPassukNote}</button>
        </div>
      ) : (
        <>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => quote(verseText)} disabled={!editor}>
              ❝ {s.quotePassuk}
            </button>
            <span className={styles.colors}>
              {PASSUK_COLORS.map((c) => (
                <button
                  key={c}
                  className={`${styles.dot} ${styles[`dot_${c}`]} ${color === c ? styles.dotActive : ''}`}
                  onClick={() => setColor(c)}
                  aria-label={`${s.highlight}: ${c}`}
                  title={s.highlight}
                />
              ))}
            </span>
            <button className={styles.actionBtn} onClick={() => askQuestion()} disabled={!editor}>
              ? {s.askQuestion}
            </button>
          </div>

          {ref && scope === 'passuk' && passukNote.verse_to > passukNote.verse_from && (
            <p className={styles.rangeNote}>
              <span dir="ltr">{ref}</span>
              {verse === passukNote.verse_to && (
                <button className={styles.linkBtn} onClick={endBefore}>
                  {s.endHere(label(verse - 1))}
                </button>
              )}
            </p>
          )}

          <RichNoteEditor
            key={slotKey}
            content={activeNote?.body || ''}
            onChange={onChange}
            language={language}
            placeholder={scope === 'perek' ? s.perekPh : s.passukPh}
            onReady={setEditor}
            compact
          />
        </>
      )}

      {status === 'error' && <p className={styles.error}>{error}</p>}

      {activeNote && (
        <Link className={styles.openLink} to={`/notes?tab=mine&note=${activeNote.id}`}>
          {s.openInMyNotes} →
        </Link>
      )}
    </section>
  );
}
