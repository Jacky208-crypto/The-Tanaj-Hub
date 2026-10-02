import { useState } from 'react';
import { updateRow } from '../../lib/adminApi';
import styles from '../../pages/Admin.module.css';
import { Loading } from './AdminKit';
import { useAdminRows } from './adminHelpers';
import { QuestionEditor } from './QuestionsAdmin';
import { QUIZ_BOOKS, getBookById, bookLabel } from '../../data/books';

// Quiz questions suggested by visitors (supabase/submissions_setup.sql).
// Accepting one opens the question editor pre-filled with it; the database
// emails the visitor as soon as that question is published.

const LANG_CODE = { english: 'en', spanish: 'es', hebrew: 'he' };
const LANG_TAG = { english: 'EN', spanish: 'ES', hebrew: 'HE' };

// For multi-book quizzes, the book named in the visitor's source
// ("Yona 2:1", "Jonah 2", "יונה ב") — '' when none is recognised.
function bookFromSource(source, quizKey) {
  const text = source?.toLowerCase() ?? '';
  const names = (QUIZ_BOOKS[quizKey] ?? []).flatMap((b) =>
    [getBookById(b).label, getBookById(b).sefaria, bookLabel(b, 'hebrew')].map((name) => [name.toLowerCase(), b]));
  // Longest names first, so "II Chronicles" isn't read as "I Chronicles".
  return names.sort((a, b) => b[0].length - a[0].length).find(([name]) => text.includes(name))?.[1] ?? '';
}

// The perek in a visitor's source: "Bereshit 25:27" → 25, "Shemot 3" → 3,
// "בראשית כה, כז" → 25. '' when there's none to find (the admin fills it in).
const GEMATRIA = { א: 1, ב: 2, ג: 3, ד: 4, ה: 5, ו: 6, ז: 7, ח: 8, ט: 9, י: 10, כ: 20, ך: 20, ל: 30, מ: 40, ם: 40, נ: 50, ן: 50, ס: 60, ע: 70, פ: 80, ף: 80, צ: 90, ץ: 90, ק: 100 };
function chapterFromSource(source) {
  const m = source?.match(/(\d+)\s*[:.,]\s*\d+/) || source?.match(/(\d+)\s*$/);
  if (m) return Number(m[1]);
  const he = source?.match(/\s([א-ת]{1,3})[׳'"״]?\s*[,:]/) || source?.match(/\s([א-ת]{1,3})[׳'"״]?\s*$/);
  return he ? [...he[1]].reduce((sum, ch) => sum + (GEMATRIA[ch] ?? 0), 0) || '' : '';
}

function Suggestion({ s, quizLabel }) {
  return (
    <div className={styles.suggestion} dir={s.language === 'hebrew' ? 'rtl' : undefined}>
      <div className={styles.itemMeta}>
        {quizLabel(s.quiz_key)} · {LANG_TAG[s.language]} · {s.submitter_name || 'No name'} &lt;{s.email}&gt; · {new Date(s.created_at).toLocaleDateString()}
      </div>
      <p className={styles.suggestionQuestion}>{s.question}</p>
      <ol className={styles.suggestionAnswers}>
        {s.options.map((o, i) => (
          <li key={i} className={i === s.correct_index ? styles.suggestionCorrect : undefined}>
            {i === s.correct_index ? '✓ ' : ''}{o}
          </li>
        ))}
      </ol>
      {s.source && <div className={styles.itemMeta}>Source: {s.source}</div>}
    </div>
  );
}

function statusBadge(s) {
  if (s.status === 'pending') return <span className={`${styles.badge} ${styles.badgeDraft}`}>pending</span>;
  if (s.status === 'rejected') return <span className={`${styles.badge} ${styles.badgeHidden}`}>rejected</span>;
  if (!s.quiz_question_id) return <span className={styles.badge}>question deleted</span>;
  return s.notified_at
    ? <span className={styles.badge}>emailed ✓</span>
    : <span className={`${styles.badge} ${styles.badgeDraft}`}>accepted · not published yet</span>;
}

export default function SuggestionsAdmin({ notify }) {
  const quizzes = useAdminRows('quizzes', 'select=key,label_en&order=sort_order').rows;
  const [status, setStatus] = useState('pending');
  const { rows, error, reload } = useAdminRows(
    'question_submissions',
    `select=*&status=eq.${status}&order=created_at.${status === 'pending' ? 'asc' : 'desc'}`,
  );
  const pendingState = useAdminRows('question_submissions', 'select=id&status=eq.pending');
  const [open, setOpen] = useState(null);       // the suggestion being looked at
  const [accepting, setAccepting] = useState(false);
  const [busy, setBusy] = useState(false);
  const quizLabel = (key) => quizzes?.find((q) => q.key === key)?.label_en ?? key;
  // Existing positions in the suggestion's quiz, so the new question goes last.
  const orders = useAdminRows(
    'quiz_questions',
    open ? `select=sort_order&quiz_key=eq.${open.quiz_key}` : 'select=id&limit=0',
  ).rows;

  const refresh = (message) => {
    setOpen(null);
    setAccepting(false);
    if (message) notify(message);
    reload();
    pendingState.reload();
  };

  const setSubmissionStatus = async (s, next, message) => {
    setBusy(true);
    try {
      await updateRow('question_submissions', 'id', s.id, { status: next, reviewed_at: next === 'pending' ? null : new Date().toISOString() });
      refresh(message);
    } catch (e) {
      notify(e.message);
    }
    setBusy(false);
  };

  if (!quizzes) return <Loading />;

  if (open && accepting) {
    if (!orders) return <Loading />;
    const code = LANG_CODE[open.language];
    return (
      <>
        <Suggestion s={open} quizLabel={quizLabel} />
        <p className={styles.hint}>
          Their {LANG_TAG[open.language]} text is filled in below — add the other languages (English is required), polish anything you like, and save.
          If “Published” is on, the question goes live and {open.email} gets an email right away; leave it off to keep it as a draft
          (they’re emailed whenever you publish it later, e.g. with “Publish all”).
        </p>
        <QuestionEditor
          title="Accept suggestion"
          prefill={{
            quiz_key: open.quiz_key,
            [`question_${code}`]: open.question,
            [`options_${code}`]: open.options,
            correct_index: open.correct_index,
            book: bookFromSource(open.source, open.quiz_key),
            chapter: chapterFromSource(open.source),
            published: true,
          }}
          quizzes={quizzes}
          quizKey={open.quiz_key}
          nextOrder={Math.max(0, ...orders.map((r) => r.sort_order)) + 1}
          afterCreate={(saved) => updateRow('question_submissions', 'id', open.id, {
            status: 'accepted',
            quiz_question_id: saved.id,
            reviewed_at: new Date().toISOString(),
          })}
          onDone={(message) => (message ? refresh('Accepted.') : setAccepting(false))}
        />
      </>
    );
  }

  if (open) {
    return (
      <div className={styles.editor}>
        <div className={styles.editorHead}>
          <button className={styles.secondaryBtn} onClick={() => setOpen(null)} disabled={busy}>← Back</button>
          <h2 className={styles.editorTitle}>Suggestion</h2>
          {statusBadge(open)}
        </div>
        <Suggestion s={open} quizLabel={quizLabel} />
        <div className={styles.actions}>
          {open.status === 'pending' && (
            <>
              <button className={styles.primaryBtn} onClick={() => setAccepting(true)} disabled={busy}>Accept → create question</button>
              <button className={styles.secondaryBtn} onClick={() => setSubmissionStatus(open, 'rejected', 'Rejected (no email is sent).')} disabled={busy}>Reject</button>
            </>
          )}
          {open.status === 'rejected' && (
            <button className={styles.secondaryBtn} onClick={() => setSubmissionStatus(open, 'pending', 'Moved back to pending.')} disabled={busy}>Move back to pending</button>
          )}
          {open.status === 'accepted' && !open.notified_at && open.quiz_question_id && (
            <p className={styles.hint}>The question is saved but not published. Publish it in Quiz questions → Drafts to review and {open.email} is emailed automatically.</p>
          )}
        </div>
      </div>
    );
  }

  const pending = pendingState.rows?.length;
  return (
    <>
      <div className={styles.toolbar}>
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending ({pending ?? '…'})</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {!rows ? <Loading error={error} onRetry={reload} /> : (
        <>
          <div className={styles.count}>{rows.length} {status} suggestion{rows.length === 1 ? '' : 's'}</div>
          <ul className={styles.list}>
            {rows.map((s) => (
              <li key={s.id}>
                <button className={styles.item} onClick={() => setOpen(s)}>
                  <span className={styles.itemMain}>
                    <span className={styles.itemTitle} dir="auto">{s.question}</span>
                    <span className={styles.itemMeta}>
                      {quizLabel(s.quiz_key)} · {LANG_TAG[s.language]} · {s.submitter_name || s.email} · ✓ {s.options[s.correct_index]}
                    </span>
                  </span>
                  {statusBadge(s)}
                </button>
              </li>
            ))}
            {!rows.length && <li className={styles.empty}>{status === 'pending' ? 'No suggestions waiting — all caught up.' : `No ${status} suggestions.`}</li>}
          </ul>
        </>
      )}
    </>
  );
}
