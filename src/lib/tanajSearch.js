// Tanaj Search — full-Tanakh word search across Hebrew, English and Spanish.
//
// Sources are the SAME ones the chapter reader uses, so search results match
// exactly what a user sees when they open a chapter:
//   • Hebrew  — Sefaria "Miqra according to the Masorah" (the Jewish Masoretic text)
//   • English — Sefaria JPS (Tanakh: The Holy Scriptures, published by JPS)
//   • Spanish — Sefaria "Tanaj Español", trans. Rav Yehuda Ribco, 2026
//
// All three are fetched whole-book from Sefaria (once, then cached in memory)
// and scanned client-side, which lets us ignore vowel points, be case-insensitive
// and highlight matches ourselves with the same logic for every language.

import { allBooks } from '../data/books';

// The exact JPS English edition the reader requests.
const JPS_VERSION = 'Tanakh: The Holy Scriptures, published by JPS';
// The exact Sefaria Spanish edition the reader requests.
const SPANISH_VERSION = 'spanish|Tanaj Español, trans. Rav Yehuda Ribco, 2026 [es]';

export const TRANSLATION_LABELS = {
  hebrew: 'Hebrew',
  english: 'English',
  spanish: 'Español',
};

// ---- Text cleaning (mirrors the reader's cleanVerse) ----------------------

function cleanVerse(text, lang) {
  if (!text) return '';
  let cleaned = String(text)
    .replace(/<[^>]+>/g, '')
    .replace(/&[#a-z0-9]+;/gi, ' ')
    .replace(/\{[^}]+\}/g, '')
    .replace(/^\d+\./, '');

  if (lang === 'english') {
    cleaned = cleaned
      .replace(/\bv\.\s*\d+[\d\s;:,cf.-]*/gi, '')
      .replace(/\b(cf|see|cp)\.\s*[\d\s;:,v.-]*/gi, '')
      .replace(/\bGreek(\s+and\s+\w+)?\s+(read|reads)[^.]*\./gi, '')
      .replace(/\bSyriac\s+(read|reads)[^.]*\./gi, '')
      .replace(/\bHebrew\s+(read|reads)[^.]*\./gi, '')
      .replace(/\bLXX[^.]*\./gi, '')
      .replace(/\bsome\s+(mss?|manuscripts?)[^.]*\./gi, '')
      .replace(/\blit\.\s*[^,;.]*/gi, '');
  }
  return cleaned
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalise for matching/highlighting: lowercase, and for Hebrew drop vowel
// points + cantillation marks (U+0591–U+05C7, which also covers the maqaf).
export function normalizeForMatch(text, lang) {
  if (!text) return '';
  let out = String(text).toLowerCase();
  if (lang === 'hebrew') {
    out = out.replace(/[֑-ׇ]/g, '');
  }
  return out;
}

// Normalise while remembering where each normalised character came from, so a
// match found in the normalised string can be mapped back to a span of the
// ORIGINAL text (keeping the reader's vowel points, punctuation, etc.).
//
// Returns { norm, map } where norm is the normalised string and map[i] is the
// index in `src` that norm[i] came from. map has one extra sentinel entry,
// map[norm.length] === src.length, so an exclusive end index is always valid.
function normalizeWithMap(src, lang) {
  const hebrew = lang === 'hebrew';
  let norm = '';
  const map = [];
  for (let i = 0; i < src.length; i++) {
    const code = src.charCodeAt(i);
    // Hebrew vowel points, cantillation and the maqaf carry no letter, and the
    // matcher ignores them — so does the map.
    if (hebrew && code >= 0x0591 && code <= 0x05c7) continue;
    const low = src[i].toLowerCase();
    for (const c of low) {
      norm += c;
      map.push(i);
    }
  }
  map.push(src.length);
  return { norm, map };
}

const WORD_CHAR = /[\p{L}\p{N}]/u;

// The single source of truth for "does this word appear here": returns every
// match of `query` in `text` as a { start, stop } span of ORIGINAL indices.
// Both the search (to decide whether a verse is a result) and the UI (to draw
// the highlights) go through this, so they can never disagree.
export function findMatchRanges(text, query, lang, matchWhole) {
  const src = String(text ?? '');
  const nq = normalizeForMatch(query, lang);
  if (!src || !nq) return [];

  const { norm, map } = normalizeWithMap(src, lang);
  const ranges = [];
  let from = 0;
  for (;;) {
    const idx = norm.indexOf(nq, from);
    if (idx === -1) break;
    const end = idx + nq.length;
    if (matchWhole) {
      const before = idx > 0 ? norm[idx - 1] : '';
      const after = end < norm.length ? norm[end] : '';
      if (WORD_CHAR.test(before) || WORD_CHAR.test(after)) {
        from = idx + 1; // overlapping partial word — keep scanning past it
        continue;
      }
    }
    ranges.push({ start: map[idx], stop: map[end] });
    from = end;
  }
  return ranges;
}

function flatten(seg) {
  return Array.isArray(seg) ? seg.map(flatten).join(' ') : String(seg ?? '');
}

// ---- Sefaria whole-book cache (Hebrew + JPS English + Spanish) ------------

const bookCache = {}; // book.id -> { he: [[verse,…]], en: [[verse,…]], es: [[verse,…]] }

async function fetchSpanishBook(book, signal) {
  const url =
    `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(book.sefaria)}` +
    `?version=${encodeURIComponent(SPANISH_VERSION)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Could not load ${book.label} (HTTP ${res.status})`);
  const data = await res.json();
  const text = data.versions?.[0]?.text;
  return (Array.isArray(text) ? text : []).map((ch) =>
    (Array.isArray(ch) ? ch : [ch]).map((v) => cleanVerse(flatten(v), 'spanish'))
  );
}

async function fetchBook(book, signal) {
  const url =
    `https://www.sefaria.org/api/texts/${encodeURIComponent(book.sefaria)}` +
    `?context=0&pad=0&commentary=0&ven=${encodeURIComponent(JPS_VERSION)}`;
  const [res, esChapters] = await Promise.all([
    fetch(url, { signal }),
    fetchSpanishBook(book, signal),
  ]);
  if (!res.ok) throw new Error(`Could not load ${book.label} (HTTP ${res.status})`);
  const data = await res.json();

  const heChapters = (Array.isArray(data.he) ? data.he : []).map((ch) =>
    (Array.isArray(ch) ? ch : [ch]).map((v) => cleanVerse(flatten(v), 'hebrew'))
  );
  const enChapters = (Array.isArray(data.text) ? data.text : []).map((ch) =>
    (Array.isArray(ch) ? ch : [ch]).map((v) => cleanVerse(flatten(v), 'english'))
  );
  bookCache[book.id] = { he: heChapters, en: enChapters, es: esChapters };
}

// Fetch every uncached book, a few at a time. onProgress(loaded, total).
async function ensureAllBooks(onProgress, signal) {
  const pending = allBooks.filter((b) => !bookCache[b.id]);
  let done = allBooks.length - pending.length;
  if (onProgress) onProgress(done, allBooks.length);

  const CONCURRENCY = 6;
  let idx = 0;
  async function worker() {
    while (idx < pending.length) {
      const book = pending[idx++];
      await fetchBook(book, signal);
      done++;
      if (onProgress) onProgress(done, allBooks.length);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker)
  );
}

const CACHE_KEY = { hebrew: 'he', english: 'en', spanish: 'es' };

async function searchSefaria(term, lang, { matchWhole, signal, onProgress }) {
  if (onProgress) onProgress('Loading Tanaj text…');
  await ensureAllBooks(
    (loaded, total) =>
      onProgress && onProgress(`Loading Tanaj text… ${loaded}/${total} books`),
    signal
  );
  if (onProgress) onProgress('Searching…');

  const results = [];

  for (const book of allBooks) {
    const chapters = bookCache[book.id][CACHE_KEY[lang]];
    chapters.forEach((verses, ci) => {
      verses.forEach((verse, vi) => {
        // Same predicate the UI highlights with: a verse is a result iff it has
        // at least one highlightable span.
        if (findMatchRanges(verse, term, lang, matchWhole).length > 0) {
          results.push({
            key: `${book.id}-${ci + 1}-${vi + 1}`,
            bookId: book.id,
            bookLabel: book.label,
            chapter: ci + 1,
            verse: vi + 1,
            text: verse,
          });
        }
      });
    });
  }
  return { total: results.length, results };
}

/**
 * Search the whole Tanakh for `query` in one language.
 * @returns {Promise<{total:number, results:Array}>}
 */
export async function searchTanaj(query, lang, opts = {}) {
  const term = query.trim();
  if (!term) return { total: 0, results: [] };
  return searchSefaria(term, lang, opts);
}
