// Reads and writes for the /admin pages. Requests carry the signed-in user's
// token; Supabase's Row-Level Security only lets accounts in public.admins
// change content (see supabase/content_setup.sql), so this file can't do
// anything a non-admin isn't already blocked from.

import { getFreshSession } from './supabaseClient';
import { clearContentCache } from './content';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const REST_URL = `${SUPABASE_URL}/rest/v1`;

// Database rule names → what to tell the person editing.
const FRIENDLY = {
  correct_index_in_range: 'Pick which answer is correct.',
  options_same_length: 'Each language needs the same number of answers.',
  midrashim_type_check: 'Choose a type from the list.',
  midrashim_status_check: 'Status must be draft or reviewed.',
  places_type_check: 'Choose a place type from the list.',
};

function friendlyError(body, status) {
  const msg = body?.message || body?.error_description || `Request failed (${status})`;
  for (const [rule, text] of Object.entries(FRIENDLY)) if (msg.includes(rule)) return text;
  if (body?.code === '23505') return 'Something with this id already exists — choose a different id.';
  if (body?.code === '23503') return 'This refers to something that doesn’t exist (or other rows still depend on it).';
  if (body?.code === '23502') return `Missing a required field${body.message?.match(/"(\w+)"/) ? `: ${body.message.match(/"(\w+)"/)[1]}` : ''}.`;
  if (status === 401 || status === 403) return 'Your session expired or you’re not an admin. Log in again.';
  return msg;
}

async function request(path, init = {}) {
  const session = await getFreshSession();
  if (!session) throw new Error('Please log in again.');
  const res = await fetch(`${REST_URL}/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(friendlyError(body, res.status));
  return body;
}

// Every row matching `query` (paged past Supabase's 1000-row limit).
export async function listRows(table, query) {
  const rows = [];
  const PAGE = 1000;
  for (let offset = 0; ; offset += PAGE) {
    const page = await request(`${table}?${query}&limit=${PAGE}&offset=${offset}`);
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

// Writes return the saved row. An empty result means Row-Level Security
// silently skipped it — i.e. this account isn't an admin.
function savedRow(rows) {
  if (!rows?.length) throw new Error('Not saved — this account isn’t allowed to edit content.');
  clearContentCache();
  return rows[0];
}

export async function insertRow(table, row) {
  return savedRow(await request(table, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(row),
  }));
}

export async function updateRow(table, key, id, changes) {
  return savedRow(await request(`${table}?${key}=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(changes),
  }));
}

// Same change to every row matching a PostgREST filter ("published=eq.false").
// Returns how many rows were changed.
export async function updateWhere(table, filter, changes) {
  const rows = await request(`${table}?${filter}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(changes),
  });
  savedRow(rows);
  return rows.length;
}

export async function deleteRow(table, key, id) {
  savedRow(await request(`${table}?${key}=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  }));
}

// 'Og survived the Flood!' → 'og-survived-the-flood'
export function slugify(text) {
  return String(text || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
