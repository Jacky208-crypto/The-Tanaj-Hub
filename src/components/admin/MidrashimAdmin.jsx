import { useState } from 'react';
import { Link } from 'react-router-dom';
import { insertRow, updateRow, deleteRow, slugify } from '../../lib/adminApi';
import { allBooks } from '../../data/books';
import styles from '../../pages/Admin.module.css';
import { Loading, Field, LangInputs, TextInput, EditorShell } from './AdminKit';
import { useAdminRows, useEditor, listToText, textToList, linesToList } from './adminHelpers';

// Must match the check in supabase/content_setup.sql and commentary.types.* in translations.js.
const TYPES = ['identity', 'crossover', 'backstory', 'connection', 'wonder', 'measure'];
const bookBySefaria = new Map(allBooks.map((b) => [b.sefaria, b]));

// Problems with one anchor line ("Genesis 14:13"), or null if it's fine.
// (Sefaria checks — does the verse/source really exist — are in `npm run validate:midrash`.)
function anchorProblem(anchor) {
  const m = anchor.match(/^(.*) (\d+):(\d+)$/);
  if (!m) return `“${anchor}” should look like “Genesis 14:13”.`;
  const book = bookBySefaria.get(m[1]);
  if (!book) return `“${m[1]}” isn’t a book name the site knows (use Sefaria’s English name, e.g. “I Samuel”).`;
  if (Number(m[2]) < 1 || Number(m[2]) > book.chapters) return `${book.label} has ${book.chapters} chapters, not ${m[2]}.`;
  return null;
}

function siteLink(anchor, id) {
  const m = anchor.match(/^(.*) (\d+):(\d+)$/);
  const book = m && bookBySefaria.get(m[1]);
  return book ? `/book/${book.id}?chapter=${m[2]}&verse=${m[3]}&midrash=${id}` : null;
}

function toForm(row) {
  return {
    ...row,
    id: row?.id ?? '',
    type: row?.type ?? 'backstory',
    status: row?.status ?? 'draft',
    characters: listToText(row?.characters),
    anchors: listToText(row?.anchors, '\n'),
    sources: listToText(row?.sources, '\n'),
  };
}

function toRow(form) {
  for (const f of ['title', 'story']) {
    for (const l of ['en', 'es', 'he']) {
      if (!form[`${f}_${l}`]?.trim()) throw new Error(`Every midrash needs a ${f} in all three languages (missing ${l.toUpperCase()}).`);
    }
  }
  const otherView = ['en', 'es', 'he'].map((l) => form[`other_view_${l}`]?.trim() || '');
  if (otherView.some(Boolean) && !otherView.every(Boolean)) {
    throw new Error('Fill in the other view in all three languages, or leave it empty.');
  }
  const anchors = linesToList(form.anchors);
  if (!anchors.length) throw new Error('Add at least one verse anchor.');
  const bad = anchors.map(anchorProblem).find(Boolean);
  if (bad) throw new Error(bad);
  const sources = linesToList(form.sources);
  if (!sources.length) throw new Error('Add at least one source.');
  return {
    type: form.type,
    status: form.status,
    title_en: form.title_en.trim(), title_es: form.title_es.trim(), title_he: form.title_he.trim(),
    story_en: form.story_en.trim(), story_es: form.story_es.trim(), story_he: form.story_he.trim(),
    other_view_en: otherView[0] || null, other_view_es: otherView[1] || null, other_view_he: otherView[2] || null,
    characters: textToList(form.characters).map((c) => c.toLowerCase()),
    anchors,
    sources,
  };
}

function MidrashEditor({ row, nextOrder, onDone }) {
  const isNew = !row;
  const { form, set, busy, error, onSave, onDelete } = useEditor(toForm(row), {
    save: (f) => {
      if (!isNew) return updateRow('midrashim', 'id', row.id, toRow(f));
      const id = slugify(f.id || f.title_en);
      if (!id) throw new Error('The midrash needs an id.');
      return insertRow('midrashim', { id, ...toRow(f), sort_order: nextOrder });
    },
    remove: () => deleteRow('midrashim', 'id', row.id),
    onDone,
  });
  const anchorLines = linesToList(form.anchors);
  const problems = anchorLines.map(anchorProblem).filter(Boolean);
  const preview = !isNew && anchorLines[0] && !problems.length ? siteLink(anchorLines[0], row.id) : null;

  return (
    <EditorShell
      title={isNew ? 'New midrash' : 'Edit midrash'}
      isNew={isNew} busy={busy} error={error}
      onBack={() => onDone()} onSave={onSave} onDelete={onDelete}
    >
      <div className={styles.twoCol}>
        <Field label="Status" hint={form.status === 'draft' ? 'Drafts are only visible to admins.' : 'Live for everyone.'}>
          <select className={styles.select} value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="reviewed">Reviewed (live)</option>
          </select>
        </Field>
        <Field label="Type">
          <select className={styles.select} value={form.type} onChange={(e) => set('type', e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Id" hint={isNew ? `Leave empty to use “${slugify(form.title_en) || '…'}”. Can’t be changed later.` : 'Can’t be changed — shared links use it.'}>
        <TextInput value={isNew ? form.id : row.id} onChange={(v) => set('id', v)} disabled={!isNew} />
      </Field>

      <LangInputs label="Title" form={form} set={set} field="title" />
      <LangInputs label="Story" form={form} set={set} field="story" multiline rows={5} />
      <LangInputs label="Other view (optional)" hint="A dissenting opinion from the sources, if any." form={form} set={set} field="other_view" multiline rows={2} optional />

      <Field
        label="Verse anchors"
        hint={problems.length ? <span style={{ color: 'var(--danger)' }}>{problems[0]}</span> : 'One per line, Sefaria style: “Genesis 14:13”. The ✨ appears on each of these verses.'}
      >
        <TextInput value={form.anchors} onChange={(v) => set('anchors', v)} multiline rows={3} placeholder="Genesis 14:13" />
      </Field>

      <Field label="Sources" hint="One per line, as Sefaria names them: “Niddah 61a”, “Bereshit Rabbah 42:8”.">
        <TextInput value={form.sources} onChange={(v) => set('sources', v)} multiline rows={3} />
      </Field>

      <Field label="Characters" hint="Lowercase ids, separated by commas: og, avraham, moshe">
        <TextInput value={form.characters} onChange={(v) => set('characters', v)} />
      </Field>

      {preview && <p className={styles.hint}><Link to={preview}>View it on the site ↗</Link> (save first to see your changes)</p>}
      {form.status === 'reviewed' && row?.status === 'draft' && (
        <p className={styles.hint}>Before publishing: run <code>npm run validate:midrash</code> to check every verse and source exists on Sefaria.</p>
      )}
    </EditorShell>
  );
}

export default function MidrashimAdmin({ notify }) {
  const { rows, error, reload } = useAdminRows('midrashim', 'select=*&order=sort_order');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [editing, setEditing] = useState(null);

  if (editing) {
    return (
      <MidrashEditor
        row={editing === 'new' ? null : editing}
        nextOrder={Math.max(0, ...(rows || []).map((r) => r.sort_order)) + 1}
        onDone={(message) => {
          setEditing(null);
          if (message) { notify(message); reload(); }
        }}
      />
    );
  }

  const q = search.trim().toLowerCase();
  const shown = (rows || []).filter((m) =>
    (status === 'all' || m.status === status) &&
    (!q || [m.id, m.title_en, m.title_es, m.title_he, ...m.anchors, ...m.characters].some((t) => t?.toLowerCase().includes(q))));
  const drafts = (rows || []).filter((m) => m.status === 'draft').length;

  return (
    <>
      <div className={styles.toolbar}>
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="draft">Drafts ({drafts})</option>
          <option value="reviewed">Reviewed</option>
        </select>
        <input className={styles.search} placeholder="Search titles, verses, characters…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className={styles.primaryBtn} onClick={() => setEditing('new')}>+ New midrash</button>
      </div>
      {!rows ? <Loading error={error} onRetry={reload} /> : (
        <>
          <div className={styles.count}>{shown.length} of {rows.length} midrashim</div>
          <ul className={styles.list}>
            {shown.map((m) => (
              <li key={m.id}>
                <button className={styles.item} onClick={() => setEditing(m)}>
                  <span className={styles.itemMain}>
                    <span className={styles.itemTitle}>{m.title_en}</span>
                    <span className={styles.itemMeta}>{m.type} · {m.anchors.join(', ')}</span>
                  </span>
                  {m.status === 'draft' && <span className={`${styles.badge} ${styles.badgeDraft}`}>draft</span>}
                </button>
              </li>
            ))}
            {!shown.length && <li className={styles.empty}>No midrashim match.</li>}
          </ul>
        </>
      )}
    </>
  );
}
