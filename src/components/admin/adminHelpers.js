// Hooks and helpers shared by the admin sections (components are in AdminKit.jsx).

import { useEffect, useState } from 'react';
import { listRows } from '../../lib/adminApi';

export const LANGS = [
  { code: 'en', tag: 'EN' },
  { code: 'es', tag: 'ES' },
  { code: 'he', tag: 'HE', rtl: true },
];

// Rows of a table for a list view. Changing `query` or calling reload() refetches.
export function useAdminRows(table, query) {
  const [state, setState] = useState({ rows: null, error: null, key: null });
  const [reloadKey, setReloadKey] = useState(0);
  const key = `${table}?${query}#${reloadKey}`;
  useEffect(() => {
    let active = true;
    listRows(table, query)
      .then((rows) => { if (active) setState({ rows, error: null, key }); })
      .catch((e) => { if (active) setState({ rows: null, error: e.message, key }); });
    return () => { active = false; };
  }, [table, query, key]);
  const current = state.key === key;
  return {
    rows: current ? state.rows : null,
    error: current ? state.error : null,
    reload: () => setReloadKey((k) => k + 1),
  };
}

// Form state for an editor, with a setter for one field and save/delete
// helpers that handle busy + error state. `save` gets the form and must
// return a promise; throw an Error to show a message.
export function useEditor(initial, { save, remove, onDone }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const run = async (action, message) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      onDone(message);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return {
    form,
    set,
    busy,
    error,
    onSave: () => run(() => save(form), 'Saved.'),
    onDelete: remove
      ? () => {
          if (window.confirm('Delete this permanently? This can’t be undone (your last `npm run export:content` backup still has it).')) {
            run(() => remove(form), 'Deleted.');
          }
        }
      : undefined,
  };
}

// Text fields for lists: "a, b, c" or one per line ↔ arrays.
export const listToText = (arr, sep = ', ') => (arr || []).join(sep);
export const textToList = (text) =>
  String(text || '').split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
export const linesToList = (text) =>
  String(text || '').split('\n').map((s) => s.trim()).filter(Boolean);

// '' → null so optional translations fall back to English on the site.
export const orNull = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
