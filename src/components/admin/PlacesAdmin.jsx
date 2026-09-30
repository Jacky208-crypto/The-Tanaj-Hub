import { useState } from 'react';
import { insertRow, updateRow, deleteRow, slugify } from '../../lib/adminApi';
import { PLACE_TYPES, TIME_PERIODS } from '../../data/places';
import { torahBooks, neviimRishonimBooks, neviimAjaranimBooks, ketuvimBooks } from '../../data/books';
import styles from '../../pages/Admin.module.css';
import { Loading, Field, LangInputs, TextInput, ChipPicker, PublishedToggle, EditorShell } from './AdminKit';
import { useAdminRows, useEditor, listToText, textToList, orNull } from './adminHelpers';

const BOOK_GROUPS = [
  { label: 'Torah', books: torahBooks },
  { label: 'Neviim Rishonim', books: neviimRishonimBooks },
  { label: 'Neviim Ajaronim', books: neviimAjaranimBooks },
  { label: 'Ketuvim', books: ketuvimBooks },
];

function toForm(row) {
  return {
    id: row?.id ?? '',
    name: row?.name ?? '',
    lat: row?.lat ?? '',
    lng: row?.lng ?? '',
    type: row?.type ?? 'city',
    books: row?.books ?? [],
    periods: row?.periods ?? [],
    aliases: listToText(row?.aliases),
    description_en: row?.description_en ?? '',
    description_es: row?.description_es ?? '',
    description_he: row?.description_he ?? '',
    published: row?.published ?? true,
  };
}

function toRow(form) {
  if (!form.name.trim()) throw new Error('The place needs a name.');
  const lat = Number(form.lat);
  const lng = Number(form.lng);
  if (form.lat === '' || !Number.isFinite(lat) || lat < -90 || lat > 90) throw new Error('Latitude must be a number between -90 and 90.');
  if (form.lng === '' || !Number.isFinite(lng) || lng < -180 || lng > 180) throw new Error('Longitude must be a number between -180 and 180.');
  if (!form.books.length) throw new Error('Pick at least one book the place appears in.');
  return {
    name: form.name.trim(),
    lat,
    lng,
    type: form.type,
    books: form.books,
    periods: form.periods,
    aliases: textToList(form.aliases),
    description_en: orNull(form.description_en),
    description_es: orNull(form.description_es),
    description_he: orNull(form.description_he),
    published: form.published !== false,
  };
}

function PlaceEditor({ row, onDone }) {
  const isNew = !row;
  const { form, set, busy, error, onSave, onDelete } = useEditor(toForm(row), {
    save: (f) => {
      if (!isNew) return updateRow('places', 'id', row.id, toRow(f));
      const id = slugify(f.id || f.name);
      if (!id) throw new Error('The place needs an id (letters and numbers).');
      return insertRow('places', { id, ...toRow(f) });
    },
    remove: () => deleteRow('places', 'id', row.id),
    onDone,
  });
  const hasCoords = form.lat !== '' && form.lng !== '';

  return (
    <EditorShell
      title={isNew ? 'New place' : `Edit ${row.name}`}
      isNew={isNew} busy={busy} error={error}
      onBack={() => onDone()} onSave={onSave} onDelete={onDelete}
    >
      <div className={styles.twoCol}>
        <Field label="Name">
          <TextInput value={form.name} onChange={(v) => set('name', v)} />
        </Field>
        <Field label="Id" hint={isNew ? `Leave empty to use “${slugify(form.name) || '…'}”. Can’t be changed later.` : 'Can’t be changed.'}>
          <TextInput value={isNew ? form.id : row.id} onChange={(v) => set('id', v)} disabled={!isNew} />
        </Field>
      </div>

      <div className={styles.twoCol}>
        <Field label="Latitude">
          <TextInput value={String(form.lat)} onChange={(v) => set('lat', v)} inputMode="decimal" placeholder="31.7054" />
        </Field>
        <Field label="Longitude" hint={hasCoords ? (
          <a href={`https://www.google.com/maps?q=${form.lat},${form.lng}`} target="_blank" rel="noreferrer">Check on Google Maps ↗</a>
        ) : null}>
          <TextInput value={String(form.lng)} onChange={(v) => set('lng', v)} inputMode="decimal" placeholder="35.2066" />
        </Field>
      </div>

      <Field label="Type">
        <ChipPicker
          options={PLACE_TYPES.map((t) => ({ value: t, label: t }))}
          value={[form.type]}
          onChange={(v) => set('type', v.find((t) => t !== form.type) ?? form.type)}
        />
      </Field>

      <Field label="Books it appears in">
        {BOOK_GROUPS.map((g) => (
          <div key={g.label} className={styles.chipGroup}>
            <div className={styles.chipGroupLabel}>{g.label}</div>
            <ChipPicker
              options={g.books.map((b) => ({ value: b.id, label: b.label }))}
              value={form.books}
              onChange={(v) => set('books', v)}
            />
          </div>
        ))}
      </Field>

      <Field label="Time periods">
        <ChipPicker options={TIME_PERIODS.map((p) => ({ value: p, label: p }))} value={form.periods} onChange={(v) => set('periods', v)} />
      </Field>

      <Field label="Other names" hint="Separate with commas. Used by the map search.">
        <TextInput value={form.aliases} onChange={(v) => set('aliases', v)} />
      </Field>

      <LangInputs label="What happened here" hint="Shown in the place’s popup on the map." form={form} set={set} field="description" multiline rows={3} optional />

      <PublishedToggle form={form} set={set} what="place" />
    </EditorShell>
  );
}

export default function PlacesAdmin({ notify }) {
  const { rows, error, reload } = useAdminRows('places', 'select=*&order=name');
  const [search, setSearch] = useState('');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [editing, setEditing] = useState(null);

  if (editing) {
    return (
      <PlaceEditor
        row={editing === 'new' ? null : editing}
        onDone={(message) => {
          setEditing(null);
          if (message) { notify(message); reload(); }
        }}
      />
    );
  }

  const q = search.trim().toLowerCase();
  const shown = (rows || []).filter((p) =>
    (!q || p.name.toLowerCase().includes(q) || p.aliases.some((a) => a.toLowerCase().includes(q))) &&
    (!onlyMissing || !p.description_en));

  return (
    <>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search places…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <label className={styles.check}>
          <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} />
          No description yet
        </label>
        <button className={styles.primaryBtn} onClick={() => setEditing('new')}>+ New place</button>
      </div>
      {!rows ? <Loading error={error} onRetry={reload} /> : (
        <>
          <div className={styles.count}>{shown.length} of {rows.length} places</div>
          <ul className={styles.list}>
            {shown.slice(0, 200).map((p) => (
              <li key={p.id}>
                <button className={styles.item} onClick={() => setEditing(p)}>
                  <span className={styles.itemMain}>
                    <span className={styles.itemTitle}>{p.name}</span>
                    <span className={styles.itemMeta}>{p.type} · {p.books.length} book{p.books.length === 1 ? '' : 's'}</span>
                  </span>
                  {p.description_en && <span className={styles.badge}>described</span>}
                  {!p.published && <span className={`${styles.badge} ${styles.badgeHidden}`}>hidden</span>}
                </button>
              </li>
            ))}
            {shown.length > 200 && <li className={styles.empty}>Showing the first 200 — search to narrow it down.</li>}
            {!shown.length && <li className={styles.empty}>No places match.</li>}
          </ul>
        </>
      )}
    </>
  );
}
