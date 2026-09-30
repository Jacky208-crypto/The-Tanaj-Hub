// Curated "notable midrash" entries (the Supabase `midrashim` table), looked
// up by the verses they're anchored to. Anchors use Sefaria's book names
// ("Genesis 14:13") so they line up with book.sefaria.

import { useEffect, useState } from 'react';
import { allBooks } from '../data/books';
import { getMidrashimRows } from './content';

// Rows have one column per language (title_en, title_he, …); the panel works
// with { en, he, es } objects, so regroup them once when they arrive.
function toEntry(row) {
  const byLang = (field) =>
    row[`${field}_en`] == null ? null : { en: row[`${field}_en`], he: row[`${field}_he`], es: row[`${field}_es`] };
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    title: byLang('title'),
    story: byLang('story'),
    otherView: byLang('other_view'),
    characters: row.characters,
    anchors: row.anchors,
    sources: row.sources,
  };
}

// Supabase only returns drafts to admins, so everything that arrives is shown.
function buildIndex(rows) {
  const byVerse = new Map();
  for (const entry of rows.map(toEntry)) {
    for (const anchor of entry.anchors) {
      if (!byVerse.has(anchor)) byVerse.set(anchor, []);
      byVerse.get(anchor).push(entry);
    }
  }
  return byVerse;
}

// The index for the most recently loaded rows. Rows are cached in content.js;
// after an admin edit clears that cache, new rows arrive and it's rebuilt.
let indexedRows = null;
let index = null;

// The verse → entries index, or null until it has loaded. A failed load
// just means no ✨ markers; the reader and Sefaria commentary still work.
export function useMidrashIndex() {
  const [loaded, setLoaded] = useState(index);
  useEffect(() => {
    let active = true;
    getMidrashimRows()
      .then((rows) => {
        if (rows !== indexedRows) {
          indexedRows = rows;
          index = buildIndex(rows);
        }
        if (active) setLoaded(index);
      })
      .catch((e) => console.warn('Midrashim unavailable:', e.message));
    return () => { active = false; };
  }, []);
  return loaded;
}

const bookBySefaria = new Map(allBooks.map((b) => [b.sefaria, b]));

export function getMidrashimForVerse(midrashIndex, sefariaBook, chapter, verse) {
  return midrashIndex?.get(`${sefariaBook} ${chapter}:${verse}`) || [];
}

// Verse numbers in a chapter that have at least one entry, for the ✨ markers.
export function getMidrashVersesInChapter(midrashIndex, sefariaBook, chapter) {
  const prefix = `${sefariaBook} ${chapter}:`;
  const verses = new Set();
  for (const anchor of midrashIndex?.keys() ?? []) {
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
