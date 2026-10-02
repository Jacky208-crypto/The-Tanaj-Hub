import { useState } from 'react';
import { insertRow, updateRow, updateWhere, deleteRow } from '../../lib/adminApi';
import styles from '../../pages/Admin.module.css';
import { Loading, Field, LangInputs, TextInput, PublishedToggle, EditorShell } from './AdminKit';
import { LANGS, useAdminRows, useEditor, orNull } from './adminHelpers';
import { QUIZ_CHAPTERS, QUIZ_BOOKS, getBookById } from '../../data/books';

const ANSWERS = 4;

// Edit form ↔ database row. Answers are kept as a list of
// { en, es, he } so each answer's three translations sit side by side.
function toForm(row, quizKey) {
  return {
    ...row,
    quiz_key: row?.quiz_key ?? quizKey,
    published: row?.published ?? true,
    answers: Array.from({ length: ANSWERS }, (_, i) => ({
      en: row?.options_en?.[i] ?? '',
      es: row?.options_es?.[i] ?? '',
      he: row?.options_he?.[i] ?? '',
    })),
    correct_index: row?.correct_index ?? null,
    book: row?.book ?? '',
    chapter: row?.chapter ?? '',
  };
}

// How many perakim the question's book has: single-book quizzes have a fixed
// book; multi-book quizzes (QUIZ_BOOKS) need the book picked first.
function maxChapter(form) {
  if (QUIZ_BOOKS[form.quiz_key]) return getBookById(form.book)?.chapters ?? null;
  return QUIZ_CHAPTERS[form.quiz_key] ?? null;
}

// { book, chapter } for the row; both are required, but book only for multi-book quizzes.
function toPlace(form) {
  const multi = QUIZ_BOOKS[form.quiz_key];
  if (multi && !multi.includes(form.book)) throw new Error('Pick the book this question is about.');
  const max = maxChapter(form);
  const n = Number(form.chapter);
  if (!max) return { book: null, chapter: Number.isInteger(n) && n >= 1 ? n : null }; // a quiz with no books listed
  if (form.chapter === '' || !Number.isInteger(n) || n < 1 || n > max) {
    throw new Error(`Enter the perek this question is about (1–${max}).`);
  }
  return { book: multi ? form.book : null, chapter: n };
}

function toRow(form) {
  if (!form.question_en?.trim()) throw new Error('The English question is required.');
  if (form.answers.some((a) => !a.en.trim())) throw new Error(`Fill in all ${ANSWERS} English answers.`);
  if (form.correct_index === null) throw new Error('Pick which answer is correct (the circle on its row).');
  const options = {};
  for (const { code, tag } of LANGS) {
    const list = form.answers.map((a) => a[code].trim());
    const filled = list.filter(Boolean).length;
    if (code !== 'en' && filled && filled < ANSWERS) {
      throw new Error(`Fill in all ${ANSWERS} ${tag} answers, or leave them all empty to use English.`);
    }
    options[code] = filled ? list : null;
  }
  return {
    quiz_key: form.quiz_key,
    question_en: form.question_en.trim(),
    question_es: orNull(form.question_es),
    question_he: orNull(form.question_he),
    options_en: options.en,
    options_es: options.es,
    options_he: options.he,
    correct_index: form.correct_index,
    ...toPlace(form),
    published: form.published !== false,
  };
}

// `prefill` starts a new question from other values (e.g. a visitor's
// suggestion); `afterCreate(savedRow)` runs once a new question is saved.
export function QuestionEditor({ row, prefill, quizzes, quizKey, nextOrder, onDone, afterCreate, title }) {
  const isNew = !row;
  const { form, set, busy, error, onSave, onDelete } = useEditor(toForm(row ?? prefill, quizKey), {
    save: async (f) => {
      if (!isNew) return updateRow('quiz_questions', 'id', row.id, toRow(f));
      const saved = await insertRow('quiz_questions', { ...toRow(f), sort_order: nextOrder });
      await afterCreate?.(saved);
    },
    remove: isNew ? undefined : () => deleteRow('quiz_questions', 'id', row.id),
    onDone,
  });
  const setAnswer = (i, code, value) =>
    set('answers', form.answers.map((a, j) => (j === i ? { ...a, [code]: value } : a)));

  return (
    <EditorShell
      title={title ?? (isNew ? 'New question' : 'Edit question')}
      isNew={isNew} busy={busy} error={error}
      onBack={() => onDone()} onSave={onSave} onDelete={onDelete}
    >
      <Field label="Quiz">
        <select className={styles.select} value={form.quiz_key} onChange={(e) => set('quiz_key', e.target.value)}>
          {quizzes.map((q) => <option key={q.key} value={q.key}>{q.label_en}</option>)}
        </select>
      </Field>

      {QUIZ_BOOKS[form.quiz_key] && (
        <Field label="Book" hint="Which book of this quiz the question is about.">
          <select className={styles.select} value={form.book} onChange={(e) => set('book', e.target.value)}>
            <option value="">Choose…</option>
            {QUIZ_BOOKS[form.quiz_key].map((b) => <option key={b} value={b}>{getBookById(b).label}</option>)}
          </select>
        </Field>
      )}

      <Field label="Perek" hint={`The chapter the question is about${maxChapter(form) ? ` (1–${maxChapter(form)})` : ''}. Players can pick perakim when they build a quiz.`}>
        <TextInput
          type="number"
          min={1}
          max={maxChapter(form) ?? undefined}
          value={form.chapter}
          onChange={(v) => set('chapter', v)}
          style={{ maxWidth: '8rem' }}
        />
      </Field>

      <LangInputs label="Question" form={form} set={set} field="question" multiline rows={2} />

      <Field label="Answers" hint="Click the circle next to the correct answer. Spanish and Hebrew are optional, but if you fill one in, fill all four in the same order.">
        <div className={styles.answers}>
          <div className={`${styles.answer} ${styles.answerHeadRow}`}>
            <span />
            {LANGS.map((l) => <span key={l.code} className={styles.answerHead}>{l.tag}</span>)}
          </div>
          {form.answers.map((a, i) => (
            <div key={i} className={`${styles.answer} ${form.correct_index === i ? styles.answerCorrect : ''}`}>
              <input
                type="radio"
                name="correct"
                className={styles.radio}
                checked={form.correct_index === i}
                onChange={() => set('correct_index', i)}
                aria-label={`Answer ${i + 1} is correct`}
              />
              {LANGS.map((l) => (
                <TextInput
                  key={l.code}
                  value={a[l.code]}
                  onChange={(v) => setAnswer(i, l.code, v)}
                  rtl={l.rtl}
                  placeholder={`${l.tag} answer ${i + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
      </Field>

      <PublishedToggle form={form} set={set} what="question" />
    </EditorShell>
  );
}

// The quiz picker also offers "Drafts": unpublished questions from every quiz
// (new ones come in this way from `npm run add:questions`), to review and publish.
const DRAFTS = '__drafts__';

export default function QuestionsAdmin({ notify }) {
  const quizzesState = useAdminRows('quizzes', 'select=key,label_en&order=sort_order');
  const quizzes = quizzesState.rows;
  const draftsState = useAdminRows('quiz_questions', 'select=id&published=eq.false');
  const draftCount = draftsState.rows?.length;
  const [quizKey, setQuizKey] = useState(null);
  const activeQuiz = quizKey ?? (draftCount ? DRAFTS : quizzes?.[0]?.key);
  const showingDrafts = activeQuiz === DRAFTS;
  const { rows, error, reload } = useAdminRows(
    'quiz_questions',
    showingDrafts ? 'select=*&published=eq.false&order=quiz_key,sort_order'
      : activeQuiz ? `select=*&quiz_key=eq.${activeQuiz}&order=sort_order` : 'select=id&limit=0',
  );
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | row
  const [publishing, setPublishing] = useState(false);
  const quizLabel = (key) => quizzes?.find((x) => x.key === key)?.label_en ?? key;

  if (!quizzes) return <Loading error={quizzesState.error} onRetry={quizzesState.reload} />;

  if (editing) {
    const editQuiz = editing === 'new' ? (showingDrafts ? quizzes[0].key : activeQuiz) : editing.quiz_key;
    return (
      <QuestionEditor
        row={editing === 'new' ? null : editing}
        quizzes={quizzes}
        quizKey={editQuiz}
        nextOrder={Math.max(0, ...(rows || []).filter((r) => r.quiz_key === editQuiz).map((r) => r.sort_order)) + 1}
        onDone={(message) => {
          setEditing(null);
          if (message) { notify(message); reload(); draftsState.reload(); }
        }}
      />
    );
  }

  const q = search.trim().toLowerCase();
  const shown = (rows || []).filter((r) =>
    !q || [r.question_en, r.question_es, r.question_he, ...r.options_en].some((t) => t?.toLowerCase().includes(q)));

  // Publishes exactly the drafts listed (by id), so a draft added meanwhile
  // (e.g. by `npm run add:questions`) isn't published unseen.
  const publishAll = async () => {
    if (!window.confirm(`Publish all ${rows.length} drafts? They’ll appear in the quizzes right away.`)) return;
    setPublishing(true);
    try {
      const count = await updateWhere('quiz_questions', `id=in.(${rows.map((r) => r.id).join(',')})`, { published: true });
      notify(`Published ${count} question${count === 1 ? '' : 's'}.`);
      reload();
      draftsState.reload();
    } catch (e) {
      notify(e.message);
    }
    setPublishing(false);
  };

  return (
    <>
      <div className={styles.toolbar}>
        <select className={styles.select} value={activeQuiz} onChange={(e) => setQuizKey(e.target.value)}>
          <option value={DRAFTS}>Drafts to review ({draftCount ?? '…'})</option>
          {quizzes.map((x) => <option key={x.key} value={x.key}>{x.label_en}</option>)}
        </select>
        <input className={styles.search} placeholder="Search questions and answers…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className={styles.primaryBtn} onClick={() => setEditing('new')}>+ New question</button>
      </div>
      {showingDrafts && (
        <div className={styles.toolbar}>
          <p className={styles.hint}>Drafts are hidden from every quiz. Open one, check it, tick “Published” and save to make it live — or publish them all at once.</p>
          <span className={styles.spacer} />
          {rows?.length > 0 && (
            <button className={styles.secondaryBtn} onClick={publishAll} disabled={publishing}>
              {publishing ? 'Publishing…' : `Publish all ${rows.length}`}
            </button>
          )}
        </div>
      )}
      {!rows ? <Loading error={error} onRetry={reload} /> : (
        <>
          <div className={styles.count}>{shown.length} of {rows.length} {showingDrafts ? 'drafts' : 'questions'}</div>
          <ul className={styles.list}>
            {shown.map((r) => (
              <li key={r.id}>
                <button className={styles.item} onClick={() => setEditing(r)}>
                  <span className={styles.itemMain}>
                    <span className={styles.itemTitle}>{r.question_en}</span>
                    <span className={styles.itemMeta}>{showingDrafts && `${quizLabel(r.quiz_key)} · `}{r.chapter && `${r.book ? `${getBookById(r.book)?.label ?? r.book} ` : 'Perek '}${r.chapter} · `}✓ {r.options_en[r.correct_index]}</span>
                  </span>
                  {!r.chapter && <span className={styles.badge}>no perek</span>}
                  {!r.question_es && <span className={styles.badge}>no ES</span>}
                  {!r.question_he && <span className={styles.badge}>no HE</span>}
                  {!r.published && <span className={`${styles.badge} ${styles.badgeDraft}`}>draft</span>}
                </button>
              </li>
            ))}
            {!shown.length && <li className={styles.empty}>{showingDrafts ? 'No drafts waiting — all caught up.' : 'No questions match.'}</li>}
          </ul>
        </>
      )}
    </>
  );
}
