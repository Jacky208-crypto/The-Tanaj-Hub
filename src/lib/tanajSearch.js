// Tanaj Search — full-Tanakh word search across Hebrew, English and Spanish.
//
// Sources are the SAME ones the chapter reader uses, so search results match
// exactly what a user sees when they open a chapter:
//   • Hebrew  — Sefaria "Miqra according to the Masorah" (the Jewish Masoretic text)
//   • English — Sefaria JPS (Tanakh: The Holy Scriptures, published by JPS)
//   • Spanish — Bolls Reina-Valera 1960 (the reader's Spanish edition)
//
// Hebrew/English are fetched whole-book from Sefaria (once, then cached in memory)
// and scanned client-side, which lets us ignore vowel points, be case-insensitive
// and highlight matches ourselves. Spanish uses the Bolls search endpoint.

import { allBooks } from '../data/books';

// The exact JPS English edition the reader requests.
const JPS_VERSION = 'Tanakh: The Holy Scriptures, published by JPS';

export const TRANSLATION_LABELS = {
  hebrew: 'Hebrew — Miqra according to the Masorah',
  english: 'English — JPS (Jewish Publication Society)',
  spanish: 'Español — Reina-Valera 1960',
};

// Bolls numeric book ids (Tanakh only), keyed by the Sefaria name in books.js.
const SEFARIA_TO_BOLLS_ID = {
  Genesis: 1, Exodus: 2, Leviticus: 3, Numbers: 4, Deuteronomy: 5,
  Joshua: 6, Judges: 7, Ruth: 8, 'I Samuel': 9, 'II Samuel': 10,
  'I Kings': 11, 'II Kings': 12, 'I Chronicles': 13, 'II Chronicles': 14,
  Ezra: 15, Nehemiah: 16, Esther: 17, Job: 18, Psalms: 19,
  Proverbs: 20, Ecclesiastes: 21, 'Song of Songs': 22, Isaiah: 23,
  Jeremiah: 24, Lamentations: 25, Ezekiel: 26, Daniel: 27,
  Hosea: 28, Joel: 29, Amos: 30, Obadiah: 31, Jonah: 32,
  Micah: 33, Nahum: 34, Habakkuk: 35, Zephaniah: 36,
  Haggai: 37, Zechariah: 38, Malachi: 39,
};
const BOOK_BY_BOLLS_ID = {};
for (const book of allBooks) {
  const id = SEFARIA_TO_BOLLS_ID[book.sefaria];
  if (id) BOOK_BY_BOLLS_ID[id] = book;
}

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
  if (lang === 'spanish') {
    cleaned = cleaned.replace(/Jehov[áa]/g, 'Hashem').replace(/JAH/g, 'Hashem');
  }

  return cleaned
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalise for matching/highlighting: lowercase, and for Hebrew drop vowel
// points + cantillation marks (U+0591–U+05C7) and the maqaf.
export function normalizeForMatch(text, lang) {
  if (!text) return '';
  let out = String(text).toLowerCase();
  if (lang === 'hebrew') {
    out = out.replace(/[֑-ׇ]/g, '').replace(/־/g, ' ');
  }
  return out;
}

function flatten(seg) {
  return Array.isArray(seg) ? seg.map(flatten).join(' ') : String(seg ?? '');
}

// ---- Sefaria whole-book cache (Hebrew + JPS English) -----------------------

const bookCache = {}; // book.id -> { he: [[verse,…]], en: [[verse,…]] }

async function fetchBook(book, signal) {
  const url =
    `https://www.sefaria.org/api/texts/${encodeURIComponent(book.sefaria)}` +
    `?context=0&pad=0&commentary=0&ven=${encodeURIComponent(JPS_VERSION)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Could not load ${book.label} (HTTP ${res.status})`);
  const data = await res.json();

  const heChapters = (Array.isArray(data.he) ? data.he : []).map((ch) =>
    (Array.isArray(ch) ? ch : [ch]).map((v) => cleanVerse(flatten(v), 'hebrew'))
  );
  const enChapters = (Array.isArray(data.text) ? data.text : []).map((ch) =>
    (Array.isArray(ch) ? ch : [ch]).map((v) => cleanVerse(flatten(v), 'english'))
  );
  bookCache[book.id] = { he: heChapters, en: enChapters };
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

async function searchSefaria(term, lang, { matchWhole, signal, onProgress }) {
  if (onProgress) onProgress('Loading Tanaj text…');
  await ensureAllBooks(
    (loaded, total) =>
      onProgress && onProgress(`Loading Tanaj text… ${loaded}/${total} books`),
    signal
  );
  if (onProgress) onProgress('Searching…');

  const nq = normalizeForMatch(term, lang);
  const results = [];

  for (const book of allBooks) {
    const chapters = bookCache[book.id][lang === 'hebrew' ? 'he' : 'en'];
    chapters.forEach((verses, ci) => {
      verses.forEach((verse, vi) => {
        const nv = normalizeForMatch(verse, lang);
        let hit;
        if (matchWhole) {
          const re = new RegExp(
            `(^|[^\\p{L}\\p{N}])${escapeRegExp(nq)}([^\\p{L}\\p{N}]|$)`,
            'u'
          );
          hit = re.test(nv);
        } else {
          hit = nv.includes(nq);
        }
        if (hit) {
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

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---- Spanish (Bolls Reina-Valera 1960) ------------------------------------

async function searchBolls(term, { matchWhole, signal, onProgress }) {
  if (onProgress) onProgress('Searching…');
  const PAGE_LIMIT = 200;
  const MAX_PAGES = 40;
  const collected = [];
  let total = 0;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url =
      `https://bolls.life/v2/find/RV1960?search=${encodeURIComponent(term)}` +
      `&match_case=false&match_whole=${matchWhole}` +
      `&book=ot&limit=${PAGE_LIMIT}&page=${page}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Search failed (HTTP ${res.status})`);
    const data = await res.json();

    total = data.total ?? total;
    const rows = Array.isArray(data.results) ? data.results : [];
    if (rows.length === 0) break;

    for (const row of rows) {
      const book = BOOK_BY_BOLLS_ID[row.book];
      if (!book) continue;
      collected.push({
        key: `${row.book}-${row.chapter}-${row.verse}`,
        bookId: book.id,
        bookLabel: book.label,
        chapter: row.chapter,
        verse: row.verse,
        text: cleanVerse(row.text, 'spanish'),
      });
    }
    if (collected.length >= total || rows.length < PAGE_LIMIT) break;
  }

  const order = new Map(allBooks.map((b, i) => [b.id, i]));
  collected.sort((a, b) => {
    const bo = order.get(a.bookId) - order.get(b.bookId);
    if (bo !== 0) return bo;
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verse - b.verse;
  });
  return { total: total || collected.length, results: collected };
}

/**
 * Search the whole Tanakh for `query` in one language.
 * @returns {Promise<{total:number, results:Array}>}
 */
export async function searchTanaj(query, lang, opts = {}) {
  const term = query.trim();
  if (!term) return { total: 0, results: [] };
  if (lang === 'spanish') return searchBolls(term, opts);
  return searchSefaria(term, lang, opts);
}
