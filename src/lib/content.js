// Site content stored in Supabase (see supabase/content_setup.sql):
// quizzes, study notes, midrashim and map places. Anyone can read published
// rows; signed-in admins also see unpublished ones / midrash drafts.
//
// Each loader caches its result (see below), and forgets a failed request so
// the next call retries.

import { getFreshSession, loadSession } from './supabaseClient';
import { cached as cachedLoad, clearCache } from './cache';

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

// Content changes rarely, so each loader keeps its result in memory and in
// IndexedDB: a repeat visit shows it with no request, and anything older than
// CONTENT_MAX_AGE is refreshed quietly in the background. Admins also receive
// drafts, so what is stored is kept per account.
const CONTENT_MAX_AGE = 6 * 60 * 60 * 1000;
const CONTENT_PREFIX = 'content:';
function cached(name, load) {
  return () => cachedLoad(`${CONTENT_PREFIX}${loadSession()?.user?.id || 'anon'}:${name}`, load, { maxAge: CONTENT_MAX_AGE });
}

// After an admin edit, so the next visit to a page loads the new content.
export function clearContentCache() {
  clearCache(CONTENT_PREFIX);
}

// Columns are one per language (label_en, label_es, label_he); the site's
// languages are english / spanish / hebrew. Falls back to English.
const SUFFIX = { english: 'en', spanish: 'es', hebrew: 'he' };
export function pick(row, field, language) {
  if (!row) return '';
  return row[`${field}_${SUFFIX[language]}`] || row[`${field}_en`] || '';
}

// ---- Quizzes ----

export const getQuizzes = cached('quizzes', () =>
  request('quizzes?select=key,label_en,label_es,label_he,description_en,description_es,description_he&order=sort_order')
);

// `howMany` random questions drawn from the given quizzes, picked by the database.
// `chapters` ({ shemot: [1, 2, 24], … }) optionally limits single-book quizzes
// to those perakim; `books` ({ neviimAjaronim: { yona: [], yeshayahu: [1, 2] } })
// limits multi-book quizzes to those books ([] = whole book) and perakim.
// `types` (['who_to_whom', 'places']) keeps only those question types.
export function getRandomQuestions(quizKeys, howMany, chapters, books, types) {
  const body = { quiz_keys: quizKeys, how_many: howMany };
  if (chapters && Object.keys(chapters).length) body.chapters = chapters;
  if (books && Object.keys(books).length) body.books = books;
  if (types?.length) body.types = types;
  return request('rpc/random_quiz_questions', { method: 'POST', body: JSON.stringify(body) });
}

// Specific questions by id (for "Review my mistakes"). Unpublished ones are
// left out for visitors by Row-Level Security.
const questionsById = new Map(); // questions already fetched this visit
export async function getQuestionsByIds(ids) {
  if (!ids.length) return [];
  const missing = ids.filter((id) => !questionsById.has(id));
  if (missing.length) {
    const rows = await request(`quiz_questions?select=*&id=in.(${missing.join(',')})`);
    for (const row of rows) questionsById.set(row.id, row);
  }
  return ids.map((id) => questionsById.get(id)).filter(Boolean);
}

// ---- Study notes ----

// Topics in order, each with its entries in order.
export const getNoteTopics = cached('note-topics', () =>
  request('note_topics?select=*,note_entries(*)&order=sort_order&note_entries.order=sort_order')
);

// ---- Midrashim ----

export const getMidrashimRows = cached('midrashim', () => selectAll('midrashim', 'select=*&order=sort_order'));

// ---- Map places ----

export const getPlaces = cached('places', () => selectAll('places', 'select=*&order=id'));
