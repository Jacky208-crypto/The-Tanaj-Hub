import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getUserNotes,
  createUserNote,
  updateUserNote,
  deleteUserNote,
} from '../lib/supabaseClient';
import { getNoteTopics, pick } from '../lib/content';
import ContentStatus from '../components/ContentStatus';
import RichNoteEditor, { RichNoteView } from '../components/notes/RichNoteEditor';
import { noteStrings } from '../components/notes/noteStrings';
import {
  anchorRef, anchorTitle, isEmptyHtml, extractQuestions, toggleQuestionInHtml, readerLink,
} from '../components/notes/noteUtils';
import styles from './Notes.module.css';
import { EditIcon, TrashIcon, BookIcon } from '../components/notes/icons';

const MY_NOTES = '__my_notes__';

// Languages the notes can be read in, and the page's own labels in each.
const NOTE_LANGUAGES = ['english', 'spanish', 'hebrew'];
const LANGUAGE_NAMES = { english: 'English', spanish: 'Español', hebrew: 'עברית' };
const STRINGS = {
  english: {
    titlePh: 'Title', bodyPh: 'Write your note…', saving: 'Saving…', cancel: 'Cancel',
    myNotes: 'My Notes', personalTitle: 'Your personal notes',
    personalText: 'Log in to write and save your own notes. They are stored on your account and available on any device.',
    signUp: 'Sign up', newNote: 'New note', saveNote: 'Save note', addNote: '+ Add note',
    empty: 'No notes yet. Add your first one!', saveChanges: 'Save changes',
    untitled: '(Untitled)', edit: 'Edit', del: 'Delete',
    saveError: 'Could not save your note.', deleteError: 'Could not delete that note.',
  },
  spanish: {
    titlePh: 'Título', bodyPh: 'Escribe tu apunte…', saving: 'Guardando…', cancel: 'Cancelar',
    myNotes: 'Mis Apuntes', personalTitle: 'Tus apuntes personales',
    personalText: 'Inicia sesión para escribir y guardar tus propios apuntes. Se guardan en tu cuenta y estarán disponibles en cualquier dispositivo.',
    signUp: 'Crear cuenta', newNote: 'Nuevo apunte', saveNote: 'Guardar apunte', addNote: '+ Añadir apunte',
    empty: 'Aún no tienes apuntes. ¡Añade el primero!', saveChanges: 'Guardar cambios',
    untitled: '(Sin título)', edit: 'Editar', del: 'Eliminar',
    saveError: 'No se pudo guardar tu apunte.', deleteError: 'No se pudo eliminar ese apunte.',
  },
  hebrew: {
    titlePh: 'כותרת', bodyPh: 'כתוב את ההערה שלך…', saving: 'שומר…', cancel: 'ביטול',
    myNotes: 'ההערות שלי', personalTitle: 'ההערות האישיות שלך',
    personalText: 'התחבר כדי לכתוב ולשמור הערות משלך. הן נשמרות בחשבון שלך וזמינות בכל מכשיר.',
    signUp: 'הרשמה', newNote: 'הערה חדשה', saveNote: 'שמור הערה', addNote: '+ הוסף הערה',
    empty: 'אין עדיין הערות. הוסף את הראשונה!', saveChanges: 'שמור שינויים',
    untitled: '(ללא כותרת)', edit: 'עריכה', del: 'מחיקה',
    saveError: 'לא ניתן היה לשמור את ההערה.', deleteError: 'לא ניתן היה למחוק את ההערה.',
  },
};

// Note editor used for both adding a new note and editing in place: a title
// plus the rich editor (body is HTML). Defined at module scope so it keeps a
// stable identity (no focus loss on re-render).
function NoteEditor({ s, language, title, body, onTitle, onBody, onSave, onCancel, busy, error, saveLabel }) {
  return (
    <>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        placeholder={s.titlePh}
        dir="auto"
        style={{
          width: '100%', padding: '0.6rem 0.75rem', marginBottom: '0.6rem',
          border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 'bold',
          boxSizing: 'border-box', background: 'var(--bg-elevated)', color: 'var(--text-primary)',
        }}
      />
      <RichNoteEditor content={body} onChange={onBody} language={language} placeholder={s.bodyPh} />
      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button
          className="nav-btn"
          disabled={busy || (!title.trim() && isEmptyHtml(body))}
          onClick={onSave}
        >
          {busy ? s.saving : saveLabel}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)',
            borderRadius: '8px', padding: '0.4rem 1rem', cursor: 'pointer',
          }}
        >
          {s.cancel}
        </button>
      </div>
    </>
  );
}

export default function Notes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { language: uiLanguage, t } = useLanguage();
  const [topics, setTopics] = useState(null); // study-note topics from Supabase
  const [topicsError, setTopicsError] = useState(null);
  const [topicsReload, setTopicsReload] = useState(0);
  // /notes?tab=mine&note=<id> (from the reader's "Open in My Notes") opens a personal note.
  const linkedNote = searchParams.get('note');
  const [chosenTopic, setChosenTopic] = useState(
    searchParams.get('tab') === 'mine' || linkedNote ? MY_NOTES : null
  ); // topic slug or MY_NOTES
  const activeTopic = chosenTopic ?? topics?.[0]?.slug ?? null;
  const [language, setLanguage] = useState(NOTE_LANGUAGES.includes(uiLanguage) ? uiLanguage : 'english');
  const s = STRINGS[language];
  const ns = noteStrings(language);
  const isRTL = language === 'hebrew';

  // ---- Personal notes state ----
  const [myNotes, setMyNotes] = useState([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [noteError, setNoteError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'anchored' | 'questions'

  useEffect(() => {
    let active = true;
    getNoteTopics()
      .then((rows) => { if (active) setTopics(rows); })
      .catch((e) => { if (active) setTopicsError(e.message); });
    return () => { active = false; };
  }, [topicsReload]);

  useEffect(() => {
    if (!user) { setMyNotes([]); return; }
    let active = true;
    getUserNotes()
      .then((rows) => { if (active) setMyNotes(rows); })
      .catch(() => { if (active) setMyNotes([]); });
    return () => { active = false; };
  }, [user]);

  // Scroll to the note the reader linked to, once it has loaded.
  useEffect(() => {
    if (!linkedNote || !myNotes.length) return;
    document.getElementById(`note-${linkedNote}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [linkedNote, myNotes]);

  function resetDraft() {
    setDraftTitle('');
    setDraftBody('');
    setEditingId(null);
    setAdding(false);
    setNoteError('');
  }

  function startAdd() {
    setEditingId(null);
    setDraftTitle('');
    setDraftBody('');
    setNoteError('');
    setAdding(true);
  }

  async function handleSaveNote() {
    if (!draftTitle.trim() && isEmptyHtml(draftBody)) return;
    setBusy(true);
    setNoteError('');
    try {
      if (editingId) {
        const updated = await updateUserNote(editingId, {
          title: draftTitle.trim(),
          body: draftBody,
        });
        setMyNotes((prev) => prev.map((n) => (n.id === editingId ? updated : n)));
      } else {
        const created = await createUserNote({
          title: draftTitle.trim(),
          body: draftBody,
        });
        setMyNotes((prev) => [created, ...prev]);
      }
      resetDraft();
    } catch (err) {
      setNoteError(err.message || s.saveError);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(note) {
    setAdding(false);
    setEditingId(note.id);
    setDraftTitle(note.title || '');
    setDraftBody(note.body || '');
    setNoteError('');
  }

  async function handleDeleteNote(id) {
    setBusy(true);
    try {
      await deleteUserNote(id);
      setMyNotes((prev) => prev.filter((n) => n.id !== id));
      if (editingId === id) resetDraft();
    } catch (err) {
      setNoteError(err.message || s.deleteError);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleQuestion(note, index) {
    try {
      const updated = await updateUserNote(note.id, { body: toggleQuestionInHtml(note.body, index) });
      setMyNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
    } catch (err) {
      setNoteError(err.message || s.saveError);
    }
  }

  const shownNotes = filter === 'anchored' ? myNotes.filter((n) => n.book_id) : myNotes;
  const questions = filter === 'questions'
    ? myNotes.flatMap((note) => extractQuestions(note).map((q) => ({ ...q, note })))
    : [];

  const current = topics?.find((n) => n.slug === activeTopic);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={`nav-btn ${styles.homeBtn}`} onClick={() => navigate('/')}>
          {t('nav.home')}
        </button>
        <h1 className={styles.title}>{t('notes.title')}</h1>
      </div>

      {/* Language Toggle */}
      <div className={styles.langToggle}>
        {NOTE_LANGUAGES.map(lang => (
          <button
            key={lang}
            className={`${styles.langBtn} ${language === lang ? styles.langActive : ''}`}
            onClick={() => setLanguage(lang)}
            lang={lang === 'hebrew' ? 'he' : undefined}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
      </div>
 
      {/* Everything below follows the chosen language's direction (Hebrew reads right to left). */}
      <div dir={isRTL ? 'rtl' : 'ltr'} lang={isRTL ? 'he' : undefined}>
      <div className={styles.topicBar}>
        {topics?.map((n) => (
          <button
            key={n.slug}
            className={`${styles.topicBtn} ${activeTopic === n.slug ? styles.active : ''}`}
            onClick={() => setChosenTopic(n.slug)}
          >
            {pick(n, 'title', language)}
          </button>
        ))}
        <button
          className={`${styles.topicBtn} ${activeTopic === MY_NOTES ? styles.active : ''}`}
          onClick={() => setChosenTopic(MY_NOTES)}
        >
          {s.myNotes}
        </button>
      </div>

      {activeTopic === MY_NOTES ? (
        <div className={styles.entries}>
          {!user ? (
            <div className={styles.card} style={{ textAlign: 'center' }}>
              <h2 className={styles.cardTitle}>
                {s.personalTitle}
              </h2>
              <p className={styles.cardText}>
                {s.personalText}
              </p>
              <button
                className="nav-btn"
                style={{ marginTop: '0.75rem' }}
                onClick={() => navigate('/login', { state: { mode: 'signup' } })}
              >
                {s.signUp}
              </button>
            </div>
          ) : (
            <>
              {/* Add a note: a button that reveals the editor when clicked */}
              {adding ? (
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    {s.newNote}
                  </h2>
                  <NoteEditor
                    s={s}
                    language={language}
                    title={draftTitle}
                    body={draftBody}
                    onTitle={setDraftTitle}
                    onBody={setDraftBody}
                    onSave={handleSaveNote}
                    onCancel={resetDraft}
                    busy={busy}
                    error={noteError}
                    saveLabel={s.saveNote}
                  />
                </div>
              ) : (
                <button
                  className="nav-btn"
                  style={{ display: 'block', margin: '0 auto 1.25rem' }}
                  onClick={startAdd}
                >
                  {s.addNote}
                </button>
              )}

              {myNotes.length > 0 && (
                <div className={styles.filterBar}>
                  {[['all', ns.all], ['anchored', ns.onPesukim], ['questions', ns.questions]].map(([id, label]) => (
                    <button
                      key={id}
                      className={`${styles.filterBtn} ${filter === id ? styles.filterActive : ''}`}
                      onClick={() => setFilter(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {filter === 'questions' ? (
                questions.length === 0 ? (
                  <p className={styles.cardText} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    {ns.noQuestions}
                  </p>
                ) : (
                  questions.map((q) => (
                    <div key={`${q.note.id}-${q.index}`} className={`${styles.card} ${styles.questionCard} ${q.answered ? styles.questionAnswered : ''}`}>
                      <label className={styles.questionCheck}>
                        <input type="checkbox" checked={q.answered} onChange={() => handleToggleQuestion(q.note, q.index)} />
                        <span>{q.answered ? ns.answeredLabel : ns.unanswered}</span>
                      </label>
                      <p className={styles.questionText} dir="auto">{q.text}</p>
                      <div className={styles.questionMeta}>
                        {(q.ref || anchorRef(q.note, language)) && (
                          <span className={styles.anchorChip} dir="ltr"><BookIcon size={14} /> {q.ref || anchorRef(q.note, language)}</span>
                        )}
                        <span>{q.note.title || anchorTitle(q.note, ns, language) || s.untitled}</span>
                        <button className={styles.linkBtn} onClick={() => { setFilter('all'); startEdit(q.note); }}>
                          {ns.openNote}
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : shownNotes.length === 0 && !adding ? (
                <p className={styles.cardText} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  {s.empty}
                </p>
              ) : (
                shownNotes.map((note) => (
                  <div
                    key={note.id}
                    id={`note-${note.id}`}
                    className={`${styles.card} ${linkedNote === note.id ? styles.cardLinked : ''}`}
                  >
                    {editingId === note.id ? (
                      <NoteEditor
                        s={s}
                        language={language}
                        title={draftTitle}
                        body={draftBody}
                        onTitle={setDraftTitle}
                        onBody={setDraftBody}
                        onSave={handleSaveNote}
                        onCancel={resetDraft}
                        busy={busy}
                        error={noteError}
                        saveLabel={s.saveChanges}
                      />
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ minWidth: 0 }}>
                            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }} dir="auto">
                              {note.title || anchorTitle(note, ns, language) || s.untitled}
                            </h2>
                            {note.book_id && (
                              <Link
                                className={styles.anchorChip}
                                to={readerLink(note.book_id, note.chapter, note.verse_from)}
                                title={ns.goToPassuk}
                              >
                                <BookIcon size={14} /> <span dir="ltr">{anchorRef(note, language)}</span>
                              </Link>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                            <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.editBtn}`}
                              onClick={() => startEdit(note)}
                              title={s.edit}
                              aria-label={s.edit}
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.deleteBtn}`}
                              onClick={() => handleDeleteNote(note.id)}
                              title={s.del}
                              aria-label={s.del}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                        {note.body && (
                          <div className={styles.noteBody}>
                            <RichNoteView content={note.body} language={language} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      ) : !current ? (
        <ContentStatus
          error={topicsError}
          onRetry={() => { setTopicsError(null); setTopicsReload((k) => k + 1); }}
        />
      ) : (
      <div className={styles.entries}>
        {current.note_entries.map((entry) => {
          const table = pick(entry, 'table', language);
          const body = pick(entry, 'body', language);
          return (
          <div key={entry.id} className={styles.card}>
            <h2 className={styles.cardTitle}>
              {pick(entry, 'title', language)}
            </h2>
            {table ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {table.headers.map((h, j) => (
                        <th key={j}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td key={k}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {body && (
                  <p className={styles.cardText} style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}>
                    {body}
                  </p>
                )}
              </div>
            ) : (
              <p className={styles.cardText} style={{ whiteSpace: 'pre-line' }}>
                {body}
              </p>
            )}
          </div>
          );
        })}
      </div>
      )}
      </div>
    </div>
  );
}