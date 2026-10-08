import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import styles from './Notes.module.css';

const MY_NOTES = '__my_notes__';

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// Controlled note editor used for both adding a new note and editing in place.
// Defined at module scope so it keeps a stable identity (no focus loss on re-render).
function NoteEditor({ language, title, body, onTitle, onBody, onSave, onCancel, busy, error, saveLabel }) {
  return (
    <>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        placeholder={language === 'spanish' ? 'Título' : 'Title'}
        style={{
          width: '100%', padding: '0.6rem 0.75rem', marginBottom: '0.6rem',
          border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem',
          boxSizing: 'border-box', background: 'var(--bg-elevated)', color: 'var(--text-primary)',
        }}
      />
      <textarea
        value={body}
        onChange={(e) => onBody(e.target.value)}
        placeholder={language === 'spanish' ? 'Escribe tu apunte…' : 'Write your note…'}
        rows={5}
        style={{
          width: '100%', padding: '0.6rem 0.75rem',
          border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem',
          resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
          background: 'var(--bg-elevated)', color: 'var(--text-primary)',
        }}
      />
      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button
          className="nav-btn"
          disabled={busy || (!title.trim() && !body.trim())}
          onClick={onSave}
        >
          {busy ? (language === 'spanish' ? 'Guardando…' : 'Saving…') : saveLabel}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)',
            borderRadius: '8px', padding: '0.4rem 1rem', cursor: 'pointer',
          }}
        >
          {language === 'spanish' ? 'Cancelar' : 'Cancel'}
        </button>
      </div>
    </>
  );
}

export default function Notes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language: uiLanguage, t } = useLanguage();
  const [topics, setTopics] = useState(null); // study-note topics from Supabase
  const [topicsError, setTopicsError] = useState(null);
  const [topicsReload, setTopicsReload] = useState(0);
  const [chosenTopic, setChosenTopic] = useState(null); // topic slug or MY_NOTES
  const activeTopic = chosenTopic ?? topics?.[0]?.slug ?? null;
  const [language, setLanguage] = useState(uiLanguage === 'spanish' ? 'spanish' : 'english');

  // ---- Personal notes state ----
  const [myNotes, setMyNotes] = useState([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [noteError, setNoteError] = useState('');

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
    if (!draftTitle.trim() && !draftBody.trim()) return;
    setBusy(true);
    setNoteError('');
    try {
      if (editingId) {
        const updated = await updateUserNote(editingId, {
          title: draftTitle.trim(),
          body: draftBody.trim(),
        });
        setMyNotes((prev) => prev.map((n) => (n.id === editingId ? updated : n)));
      } else {
        const created = await createUserNote({
          title: draftTitle.trim(),
          body: draftBody.trim(),
        });
        setMyNotes((prev) => [created, ...prev]);
      }
      resetDraft();
    } catch (err) {
      setNoteError(err.message || 'Could not save your note.');
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
      setNoteError(err.message || 'Could not delete that note.');
    } finally {
      setBusy(false);
    }
  }

  const current = topics?.find((n) => n.slug === activeTopic);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('notes.title')}</h1>
      <button className="nav-btn" style={{ marginTop: 30, backgroundColor: 'var(--text-muted)' }} onClick={() => navigate('/')}>
        {t('nav.home')}
      </button>

      {/* Language Toggle */}
      <div className={styles.langToggle}>
        {['english', 'spanish'].map(lang => (
          <button
            key={lang}
            className={`${styles.langBtn} ${language === lang ? styles.langActive : ''}`}
            onClick={() => setLanguage(lang)}
          >
            {lang === 'english' ? 'English' : 'Español'}
          </button>
        ))}
      </div>
 
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
          {language === 'spanish' ? 'Mis Apuntes' : 'My Notes'}
        </button>
      </div>

      {activeTopic === MY_NOTES ? (
        <div className={styles.entries}>
          {!user ? (
            <div className={styles.card} style={{ textAlign: 'center' }}>
              <h2 className={styles.cardTitle}>
                {language === 'spanish' ? 'Tus apuntes personales' : 'Your personal notes'}
              </h2>
              <p className={styles.cardText}>
                {language === 'spanish'
                  ? 'Inicia sesión para escribir y guardar tus propios apuntes. Se guardan en tu cuenta y estarán disponibles en cualquier dispositivo.'
                  : 'Log in to write and save your own notes. They are stored on your account and available on any device.'}
              </p>
              <button
                className="nav-btn"
                style={{ marginTop: '0.75rem' }}
                onClick={() => navigate('/login', { state: { mode: 'signup' } })}
              >
                {language === 'spanish' ? 'Crear cuenta' : 'Sign up'}
              </button>
            </div>
          ) : (
            <>
              {/* Add a note: a button that reveals the editor when clicked */}
              {adding ? (
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    {language === 'spanish' ? 'Nuevo apunte' : 'New note'}
                  </h2>
                  <NoteEditor
                    language={language}
                    title={draftTitle}
                    body={draftBody}
                    onTitle={setDraftTitle}
                    onBody={setDraftBody}
                    onSave={handleSaveNote}
                    onCancel={resetDraft}
                    busy={busy}
                    error={noteError}
                    saveLabel={language === 'spanish' ? 'Guardar apunte' : 'Save note'}
                  />
                </div>
              ) : (
                <button
                  className="nav-btn"
                  style={{ display: 'block', margin: '0 auto 1.25rem' }}
                  onClick={startAdd}
                >
                  {language === 'spanish' ? '+ Añadir apunte' : '+ Add note'}
                </button>
              )}

              {myNotes.length === 0 && !adding ? (
                <p className={styles.cardText} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  {language === 'spanish'
                    ? 'Aún no tienes apuntes. ¡Añade el primero!'
                    : 'No notes yet. Add your first one!'}
                </p>
              ) : (
                myNotes.map((note) => (
                  <div key={note.id} className={styles.card}>
                    {editingId === note.id ? (
                      <NoteEditor
                        language={language}
                        title={draftTitle}
                        body={draftBody}
                        onTitle={setDraftTitle}
                        onBody={setDraftBody}
                        onSave={handleSaveNote}
                        onCancel={resetDraft}
                        busy={busy}
                        error={noteError}
                        saveLabel={language === 'spanish' ? 'Guardar cambios' : 'Save changes'}
                      />
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>
                            {note.title || (language === 'spanish' ? '(Sin título)' : '(Untitled)')}
                          </h2>
                          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                            <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.editBtn}`}
                              onClick={() => startEdit(note)}
                              title={language === 'spanish' ? 'Editar' : 'Edit'}
                              aria-label={language === 'spanish' ? 'Editar' : 'Edit'}
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.deleteBtn}`}
                              onClick={() => handleDeleteNote(note.id)}
                              title={language === 'spanish' ? 'Eliminar' : 'Delete'}
                              aria-label={language === 'spanish' ? 'Eliminar' : 'Delete'}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                        {note.body && (
                          <p className={styles.cardText} style={{ whiteSpace: 'pre-line' }}>{note.body}</p>
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
  );
}