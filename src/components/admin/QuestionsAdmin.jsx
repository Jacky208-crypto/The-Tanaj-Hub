import { useState } from 'react';
import { insertRow, updateRow, updateWhere, deleteRow } from '../../lib/adminApi';
import styles from '../../pages/Admin.module.css';
import { Loading, Field, LangInputs, TextInput, PublishedToggle, EditorShell } from './AdminKit';
import { LANGS, useAdminRows, useEditor, orNull } from './adminHelpers';

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
  };
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
    published: form.published !== false,
  };
}

function QuestionEditor({ row, quizzes, quizKey, nextOrder, onDone }) {
  const isNew = !row;
  const { form, set, busy, error, onSave, onDelete } = useEditor(toForm(row, quizKey), {
    save: (f) => (isNew
      ? insertRow('quiz_questions', { ...toRow(f), sort_order: nextOrder })
      : updateRow('quiz_questions', 'id', row.id, toRow(f))),
    remove: () => deleteRow('quiz_questions', 'id', row.id),
    onDone,
  });
  const setAnswer = (i, code, value) =>
    set('answers', form.answers.map((a, j) => (j === i ? { ...a, [code]: value } : a)));

  return (
    <EditorShell
      title={isNew ? 'New question' : 'Edit question'}
      isNew={isNew} busy={busy} error={error}
      onBack={() => onDone()} onSave={onSave} onDelete={onDelete}
    >
      <Field label="Quiz">
        <select className={styles.select} value={form.quiz_key} onChange={(e) => set('quiz_key', e.target.value)}>
          {quizzes.map((q) => <option key={q.key} value={q.key}>{q.label_en}</option>)}
        </select>
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
                    <span className={styles.itemMeta}>{showingDrafts && `${quizLabel(r.quiz_key)} · `}✓ {r.options_en[r.correct_index]}</span>
                  </span>
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
