// Curated "notable midrash" entries (src/data/midrashim.json), looked up by
// the verses they're anchored to. Anchors use Sefaria's book names
// ("Genesis 14:13") so they line up with book.sefaria.

import midrashim from '../data/midrashim.json';
import { allBooks } from '../data/books';

// Entries start as "draft" and only become public once reviewed; drafts are
// still shown on the local dev server so they can be checked in context.
const visible = midrashim.filter((m) => m.status === 'reviewed' || import.meta.env.DEV);

const byVerse = new Map();
for (const entry of visible) {
  for (const anchor of entry.anchors) {
    if (!byVerse.has(anchor)) byVerse.set(anchor, []);
    byVerse.get(anchor).push(entry);
  }
}

const bookBySefaria = new Map(allBooks.map((b) => [b.sefaria, b]));

export function getMidrashimForVerse(sefariaBook, chapter, verse) {
  return byVerse.get(`${sefariaBook} ${chapter}:${verse}`) || [];
}

// Verse numbers in a chapter that have at least one entry, for the ✨ markers.
export function getMidrashVersesInChapter(sefariaBook, chapter) {
  const prefix = `${sefariaBook} ${chapter}:`;
  const verses = new Set();
  for (const anchor of byVerse.keys()) {
    if (anchor.startsWith(prefix)) verses.add(Number(anchor.slice(prefix.length)));
  }
  return verses;
}

// "Genesis 14:13" → { book, chapter, verse, label: "Bereshit 14:13" }
export function parseAnchor(anchor) {
  const m = anchor.match(/^(.*) (\d+):(\d+)$/);
  if (!m) return null;
  const book = bookBySefaria.get(m[1]);
  if (!book) return null;
  return { book, chapter: Number(m[2]), verse: Number(m[3]), label: `${book.label} ${m[2]}:${m[3]}` };
}

// Entries are stored as { en, he, es }; the site's languages are
// english / hebrew / spanish. Falls back to English if a translation is missing.
const LANG_KEY = { english: 'en', hebrew: 'he', spanish: 'es' };
export function localized(field, language) {
  if (!field) return '';
  return field[LANG_KEY[language]] || field.en || '';
}
