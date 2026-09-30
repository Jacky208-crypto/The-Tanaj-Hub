import { useState } from 'react';
import { insertRow, updateRow, deleteRow, slugify } from '../../lib/adminApi';
import styles from '../../pages/Admin.module.css';
import { Loading, Field, LangInputs, TextInput, PublishedToggle, EditorShell } from './AdminKit';
import { LANGS, useAdminRows, useEditor, orNull } from './adminHelpers';

// Tables are edited as text: first line = headers, one line per row,
// cells separated by " | ". Stored as { headers: [...], rows: [[...]] }.
function tableToText(table) {
  if (!table) return '';
  return [table.headers, ...table.rows].map((r) => r.join(' | ')).join('\n');
}

function textToTable(text, tag) {
  const lines = String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return null;
  const [headers, ...rows] = lines.map((l) => l.split('|').map((c) => c.trim()));
  const bad = rows.findIndex((r) => r.length !== headers.length);
  if (bad >= 0) {
    throw new Error(`${tag} table: row ${bad + 1} has ${rows[bad].length} cells but there are ${headers.length} headers.`);
  }
  return { headers, rows };
}

function toForm(row, topicSlug) {
  const form = { ...row, topic_slug: row?.topic_slug ?? topicSlug, published: row?.published ?? true };
  for (const { code } of LANGS) form[`tabletext_${code}`] = tableToText(row?.[`table_${code}`]);
  return form;
}

function toRow(form) {
  if (!form.title_en?.trim()) throw new Error('The English title is required.');
  const tables = Object.fromEntries(LANGS.map((l) => [l.code, textToTable(form[`tabletext_${l.code}`], l.tag)]));
  if (!form.body_en?.trim() && !tables.en) throw new Error('Add English text, an English table, or both.');
  return {
    topic_slug: form.topic_slug,
    title_en: form.title_en.trim(),
    title_es: orNull(form.title_es),
    title_he: orNull(form.title_he),
    body_en: orNull(form.body_en),
    body_es: orNull(form.body_es),
    body_he: orNull(form.body_he),
    table_en: tables.en,
    table_es: tables.es,
    table_he: tables.he,
    published: form.published !== false,
  };
}

function EntryEditor({ row, topics, topicSlug, nextOrder, onDone }) {
  const isNew = !row;
  const { form, set, busy, error, onSave, onDelete } = useEditor(toForm(row, topicSlug), {
    save: (f) => (isNew
      ? insertRow('note_entries', { ...toRow(f), sort_order: nextOrder })
      : updateRow('note_entries', 'id', row.id, toRow(f))),
    remove: () => deleteRow('note_entries', 'id', row.id),
    onDone,
  });

  return (
    <EditorShell
      title={isNew ? 'New note' : 'Edit note'}
      isNew={isNew} busy={busy} error={error}
      onBack={() => onDone()} onSave={onSave} onDelete={onDelete}
    >
      <Field label="Topic">
        <select className={styles.select} value={form.topic_slug} onChange={(e) => set('topic_slug', e.target.value)}>
          {topics.map((t) => <option key={t.slug} value={t.slug}>{t.title_en}</option>)}
        </select>
      </Field>
      <LangInputs label="Title" form={form} set={set} field="title" />
      <LangInputs label="Text" hint="Line breaks are kept." form={form} set={set} field="body" multiline rows={8} optional />
      <Field
        label="Table (optional)"
        hint="First line is the headers, then one line per row. Separate cells with |   e.g.  # | King | Years"
      >
        <div className={styles.langRows}>
          {LANGS.map((l) => (
            <div key={l.code} className={styles.langRow}>
              <span className={styles.langTag}>{l.tag}</span>
              <TextInput
                value={form[`tabletext_${l.code}`]}
                onChange={(v) => set(`tabletext_${l.code}`, v)}
                rtl={l.rtl}
                multiline
                rows={l.code === 'en' || form[`tabletext_${l.code}`] ? 6 : 2}
                style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, whiteSpace: 'pre', overflowX: 'auto' }}
              />
            </div>
          ))}
        </div>
      </Field>
      <PublishedToggle form={form} set={set} what="note" />
    </EditorShell>
  );
}

function TopicEditor({ row, nextOrder, onDone }) {
  const isNew = !row;
  const { form, set, busy, error, onSave, onDelete } = useEditor({ ...row, published: row?.published ?? true }, {
    save: (f) => {
      if (!f.title_en?.trim()) throw new Error('The English title is required.');
      const fields = {
        title_en: f.title_en.trim(), title_es: orNull(f.title_es), title_he: orNull(f.title_he),
        published: f.published !== false,
      };
      if (!isNew) return updateRow('note_topics', 'slug', row.slug, fields);
      return insertRow('note_topics', { slug: slugify(f.title_en), ...fields, sort_order: nextOrder });
    },
    remove: () => deleteRow('note_topics', 'slug', row.slug),
    onDone,
  });
  return (
    <EditorShell
      title={isNew ? 'New topic' : 'Edit topic'}
      isNew={isNew} busy={busy} error={error}
      onBack={() => onDone()} onSave={onSave} onDelete={onDelete}
      deleteLabel="Delete topic and all its notes"
    >
      <LangInputs label="Topic name" hint="The button on the Notes page." form={form} set={set} field="title" />
      <PublishedToggle form={form} set={set} what="topic" />
    </EditorShell>
  );
}

export default function NotesAdmin({ notify }) {
  const topicsState = useAdminRows('note_topics', 'select=*&order=sort_order');
  const topics = topicsState.rows;
  const [topicSlug, setTopicSlug] = useState(null);
  const activeTopic = topicSlug ?? topics?.[0]?.slug;
  const { rows, error, reload } = useAdminRows(
    'note_entries',
    activeTopic ? `select=*&topic_slug=eq.${activeTopic}&order=sort_order` : 'select=id&limit=0',
  );
  const [editing, setEditing] = useState(null); // { kind: 'entry'|'topic', row }

  if (!topics) return <Loading error={topicsState.error} onRetry={topicsState.reload} />;

  const done = (message) => {
    setEditing(null);
    if (message) { notify(message); reload(); topicsState.reload(); }
  };

  if (editing?.kind === 'topic') {
    return (
      <TopicEditor
        row={editing.row}
        nextOrder={Math.max(0, ...topics.map((t) => t.sort_order)) + 1}
        onDone={(message) => {
          if (message === 'Deleted.') setTopicSlug(null);
          done(message);
        }}
      />
    );
  }
  if (editing?.kind === 'entry') {
    return (
      <EntryEditor
        row={editing.row}
        topics={topics}
        topicSlug={activeTopic}
        nextOrder={Math.max(0, ...(rows || []).map((r) => r.sort_order)) + 1}
        onDone={done}
      />
    );
  }

  const topic = topics.find((t) => t.slug === activeTopic);
  return (
    <>
      <div className={styles.toolbar}>
        <select className={styles.select} value={activeTopic ?? ''} onChange={(e) => setTopicSlug(e.target.value)}>
          {topics.map((t) => <option key={t.slug} value={t.slug}>{t.title_en}{t.published ? '' : ' (hidden)'}</option>)}
        </select>
        {topic && <button className={styles.secondaryBtn} onClick={() => setEditing({ kind: 'topic', row: topic })}>Edit topic</button>}
        <button className={styles.secondaryBtn} onClick={() => setEditing({ kind: 'topic', row: null })}>+ New topic</button>
        <span className={styles.spacer} />
        {topic && <button className={styles.primaryBtn} onClick={() => setEditing({ kind: 'entry', row: null })}>+ New note</button>}
      </div>
      {!topic ? <div className={styles.empty}>No topics yet — add one.</div> : !rows ? <Loading error={error} onRetry={reload} /> : (
        <ul className={styles.list}>
          {rows.map((r) => (
            <li key={r.id}>
              <button className={styles.item} onClick={() => setEditing({ kind: 'entry', row: r })}>
                <span className={styles.itemMain}>
                  <span className={styles.itemTitle}>{r.title_en}</span>
                  <span className={styles.itemMeta}>{r.table_en ? `table · ${r.table_en.rows.length} rows` : `${(r.body_en || '').length} characters`}</span>
                </span>
                {!r.title_es && <span className={styles.badge}>no ES</span>}
                {!r.published && <span className={`${styles.badge} ${styles.badgeHidden}`}>hidden</span>}
              </button>
            </li>
          ))}
          {!rows.length && <li className={styles.empty}>No notes in this topic yet.</li>}
        </ul>
      )}
    </>
  );
}
