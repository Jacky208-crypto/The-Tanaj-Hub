// Site content stored in Supabase (see supabase/content_setup.sql):
// quizzes, study notes, midrashim and map places. Anyone can read published
// rows; signed-in admins also see unpublished ones / midrash drafts.
//
// Each loader caches its result for the rest of the visit, and forgets a
// failed request so the next call retries.

import { getFreshSession } from './supabaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const REST_URL = `${SUPABASE_URL}/rest/v1`;

// Send the user's token when signed in (so admins get drafts). It's refreshed
// first if needed — an expired token would make Supabase reject even public reads.
async function headers() {
  const h = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
  const session = await getFreshSession();
  if (session?.access_token) h.Authorization = `Bearer ${session.access_token}`;
  return h;
}

async function request(path, init = {}) {
  const res = await fetch(`${REST_URL}/${path}`, { ...init, headers: { ...(await headers()), ...init.headers } });
  if (!res.ok) throw new Error(`Could not load content (HTTP ${res.status})`);
  return res.json();
}

// Supabase returns at most 1000 rows per request, so page through big tables.
async function selectAll(table, query) {
  const rows = [];
  const PAGE = 1000;
  for (let offset = 0; ; offset += PAGE) {
    const page = await request(`${table}?${query}&limit=${PAGE}&offset=${offset}`);
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

const caches = [];
function cached(load) {
  let promise = null;
  caches.push(() => { promise = null; });
  return () => {
    if (!promise) promise = load().catch((e) => { promise = null; throw e; });
    return promise;
  };
}

// After an admin edit, so the next visit to a page loads the new content.
export function clearContentCache() {
  caches.forEach((clear) => clear());
}

// Columns are one per language (label_en, label_es, label_he); the site's
// languages are english / spanish / hebrew. Falls back to English.
const SUFFIX = { english: 'en', spanish: 'es', hebrew: 'he' };
export function pick(row, field, language) {
  if (!row) return '';
  return row[`${field}_${SUFFIX[language]}`] || row[`${field}_en`] || '';
}

// ---- Quizzes ----

export const getQuizzes = cached(() =>
  request('quizzes?select=key,label_en,label_es,label_he,description_en,description_es,description_he&order=sort_order')
);

// `howMany` random questions drawn from the given quizzes, picked by the database.
export function getRandomQuestions(quizKeys, howMany) {
  return request('rpc/random_quiz_questions', {
    method: 'POST',
    body: JSON.stringify({ quiz_keys: quizKeys, how_many: howMany }),
  });
}

// ---- Study notes ----

// Topics in order, each with its entries in order.
export const getNoteTopics = cached(() =>
  request('note_topics?select=*,note_entries(*)&order=sort_order&note_entries.order=sort_order')
);

// ---- Midrashim ----

export const getMidrashimRows = cached(() => selectAll('midrashim', 'select=*&order=sort_order'));

// ---- Map places ----

export const getPlaces = cached(() => selectAll('places', 'select=*&order=id'));
