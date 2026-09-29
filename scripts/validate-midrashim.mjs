// Checks src/data/midrashim.json before entries go live.
//
//   node scripts/validate-midrashim.mjs            schema + Sefaria checks + coverage
//   node scripts/validate-midrashim.mjs --offline  schema checks only
//
// For every entry it verifies: required fields in all three languages, a known
// type, unique id, every anchor is a real verse of a book the site has, and
// every source ref opens on Sefaria. Then it prints how many entries each book
// has so gaps are easy to spot.

import { readFileSync } from 'node:fs';
import { allBooks } from '../src/data/books.js';

const TYPES = ['identity', 'crossover', 'backstory', 'connection', 'wonder', 'measure'];
const LANGS = ['en', 'he', 'es'];
const offline = process.argv.includes('--offline');

const entries = JSON.parse(readFileSync(new URL('../src/data/midrashim.json', import.meta.url), 'utf8'));
const bookBySefaria = new Map(allBooks.map((b) => [b.sefaria, b]));
const errors = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);

// ---- Schema ----
const ids = new Set();
for (const e of entries) {
  const id = e.id || '(missing id)';
  if (!e.id || !/^[a-z0-9-]+$/.test(e.id)) err(id, 'id must be kebab-case');
  if (ids.has(e.id)) err(id, 'duplicate id');
  ids.add(e.id);
  if (!TYPES.includes(e.type)) err(id, `unknown type "${e.type}"`);
  if (!['draft', 'reviewed'].includes(e.status)) err(id, `status must be draft or reviewed`);
  for (const field of ['title', 'story']) {
    for (const l of LANGS) if (!e[field]?.[l]?.trim()) err(id, `missing ${field}.${l}`);
  }
  if (e.otherView) for (const l of LANGS) if (!e.otherView[l]?.trim()) err(id, `missing otherView.${l}`);
  if (!Array.isArray(e.anchors) || !e.anchors.length) err(id, 'needs at least one anchor');
  if (!Array.isArray(e.sources) || !e.sources.length) err(id, 'needs at least one source');
  for (const a of e.anchors || []) {
    const m = a.match(/^(.*) (\d+):(\d+)$/);
    if (!m) { err(id, `bad anchor format "${a}"`); continue; }
    const book = bookBySefaria.get(m[1]);
    if (!book) err(id, `anchor book not on the site: "${a}"`);
    else if (Number(m[2]) > book.chapters) err(id, `anchor chapter out of range: "${a}"`);
  }
}

// ---- Sefaria: anchors are real verses, sources exist ----
async function refExists(ref) {
  const res = await fetch(`https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?version=english`);
  if (!res.ok) return false;
  const data = await res.json();
  return !data.error && (data.versions?.length ?? 0) > 0;
}

if (!offline) {
  const refs = new Map(); // ref -> [ids]
  for (const e of entries) for (const r of [...(e.anchors || []), ...(e.sources || [])]) {
    if (!refs.has(r)) refs.set(r, []);
    refs.get(r).push(e.id);
  }
  const list = [...refs.keys()];
  const CONCURRENCY = 8;
  for (let i = 0; i < list.length; i += CONCURRENCY) {
    await Promise.all(list.slice(i, i + CONCURRENCY).map(async (ref) => {
      let ok = false;
      try { ok = await refExists(ref); } catch { ok = false; }
      if (!ok) for (const id of refs.get(ref)) err(id, `ref not found on Sefaria: "${ref}"`);
    }));
  }
}

// ---- Report ----
const perBook = new Map(allBooks.map((b) => [b.label, 0]));
for (const e of entries) {
  const books = new Set((e.anchors || []).map((a) => bookBySefaria.get(a.replace(/ \d+:\d+$/, ''))?.label).filter(Boolean));
  for (const b of books) perBook.set(b, perBook.get(b) + 1);
}
const reviewed = entries.filter((e) => e.status === 'reviewed').length;
console.log(`\n${entries.length} entries (${reviewed} reviewed, ${entries.length - reviewed} draft)\n`);
console.log('Entries per book:');
console.log([...perBook].map(([b, n]) => `  ${n ? String(n).padStart(3) : '  -'}  ${b}`).join('\n'));

if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`\nAll checks passed${offline ? ' (offline)' : ''}.`);
