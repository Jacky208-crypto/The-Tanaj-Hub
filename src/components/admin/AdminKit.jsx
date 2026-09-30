// Building blocks shared by the admin sections (questions, places, midrashim,
// notes). The admin area is English-only: it's a tool for the site's editors,
// not part of the trilingual site.

import styles from '../../pages/Admin.module.css';
import { LANGS } from './adminHelpers';

export function Loading({ error, onRetry }) {
  return (
    <div className={styles.empty}>
      {error ? (
        <>
          <p>{error}</p>
          {onRetry && <button className={styles.secondaryBtn} onClick={onRetry}>Try again</button>}
        </>
      ) : 'Loading…'}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      {children}
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
}

export function TextInput({ value, onChange, rtl, multiline, rows = 3, ...rest }) {
  const props = {
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
    dir: rtl ? 'rtl' : undefined,
    ...rest,
  };
  return multiline
    ? <textarea className={styles.textarea} rows={rows} {...props} />
    : <input type="text" className={styles.input} {...props} />;
}

// One input per language for `${field}_en/_es/_he` on the form object.
export function LangInputs({ label, hint, form, set, field, multiline, rows, optional }) {
  return (
    <Field label={label} hint={hint}>
      <div className={styles.langRows}>
        {LANGS.map((l) => (
          <div key={l.code} className={styles.langRow}>
            <span className={styles.langTag}>{l.tag}</span>
            <TextInput
              value={form[`${field}_${l.code}`]}
              onChange={(v) => set(`${field}_${l.code}`, v)}
              rtl={l.rtl}
              multiline={multiline}
              rows={rows}
              placeholder={optional || l.code !== 'en' ? ' ' : ''}
            />
          </div>
        ))}
      </div>
    </Field>
  );
}

// Toggleable chips for picking several values from a fixed list.
export function ChipPicker({ options, value, onChange }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className={styles.chips}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`${styles.chip} ${value.includes(o.value) ? styles.chipOn : ''}`}
          onClick={() => toggle(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PublishedToggle({ form, set, what }) {
  return (
    <Field hint={`When off, visitors don’t see this ${what}; you still do.`}>
      <label className={styles.check}>
        <input type="checkbox" checked={form.published !== false} onChange={(e) => set('published', e.target.checked)} />
        Published
      </label>
    </Field>
  );
}

// Frame around every edit form: title, back, save / delete buttons, errors.
export function EditorShell({ title, isNew, busy, error, onBack, onSave, onDelete, deleteLabel = 'Delete', children }) {
  return (
    <div className={styles.editor}>
      <div className={styles.editorHead}>
        <button className={styles.secondaryBtn} onClick={onBack} disabled={busy}>← Back</button>
        <h2 className={styles.editorTitle}>{title}</h2>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
        {children}
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <button type="submit" className={styles.primaryBtn} disabled={busy}>
            {busy ? 'Saving…' : isNew ? 'Create' : 'Save changes'}
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={onBack} disabled={busy}>Cancel</button>
          <span className={styles.spacer} />
          {!isNew && onDelete && (
            <button type="button" className={styles.dangerBtn} onClick={onDelete} disabled={busy}>{deleteLabel}</button>
          )}
        </div>
      </form>
    </div>
  );
}
