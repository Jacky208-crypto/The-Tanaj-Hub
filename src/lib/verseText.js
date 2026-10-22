import { applySpanishFixes, cleanSpanishNames, unwrapSpanishBrackets } from './spanishText';

// Fetching and cleaning Sefaria verse text, shared by the chapter reader and
// the "insert a pasuk" picker in My Notes.

export function cleanVerse(text, lang) {
  if (!text) return '';

  let cleaned = text
    .replace(/<[^>]+>/g, '')
    .replace(/&[#a-z0-9]+;/gi, ' ')
    .replace(/\{[^\}]+\}/g, '')
    .replace(/^\d+\./, '');

  if (lang === 'english') {
    cleaned = cleaned
      .replace(/\bv\.\s*\d+[\d\s;:,cf\.-]*/gi, '')
      .replace(/\b(cf|see|cp)\.\s*[\d\s;:,v\.-]*/gi, '')
      .replace(/[a-z]\b(?=\s*(Cf|See|cf|see))/g, '')
      .replace(/[a-zA-Z](?=Cf\.|See\s)/g, '')
      .replace(/\b(Cf|cf|See|see|Cp|cp)\.\s*[\w\s\d;:,v\.\-ff]*/g, '')
      .replace(/\b[a-z]\s+(Num|Lev|Gen|Deut|Exod|Josh|Judg|Sam|Kgs|Isa|Jer|Ezek|Hos|Amos|Ps|Prov|Job|Dan|Ezra|Neh|Chr)\.\s*[\d:.ff\s,]*/g, '')
      .replace(/\bGreek(\s+and\s+\w+)?\s+(read|reads)[^.]*\./gi, '')
      .replace(/\bSyriac\s+(read|reads)[^.]*\./gi, '')
      .replace(/\bHebrew\s+(read|reads)[^.]*\./gi, '')
      .replace(/\bLXX[^.]*\./gi, '')
      .replace(/\bsome\s+(mss?|manuscripts?)[^.]*\./gi, '')
      .replace(/\blit\.\s*[^,;.]*/gi, '')
      .replace(/\bsee\s+[\d:-]+/gi, '')
      .replace(/\b[Ee]gyptian for[^.]*\./g, '');
  }
  if (lang === 'spanish') {
    cleaned = cleanSpanishNames(unwrapSpanishBrackets(cleaned));
  }
  return cleaned
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim();
}

// Sefaria's newly-added Spanish translation of the whole Tanakh.
const SPANISH_VERSION = 'spanish|Tanaj Español, trans. Rav Yehuda Ribco, 2026 [es]';

export async function fetchSpanishFromSefaria(sefariaBookName, chapterNum) {
  const url =
    `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(sefariaBookName)}.${chapterNum}` +
    `?version=${encodeURIComponent(SPANISH_VERSION)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  const verses = data.versions?.[0]?.text;
  if (!verses?.length) throw new Error('No verses returned — chapter may be empty.');
  return applySpanishFixes(sefariaBookName, chapterNum, verses).map(v => cleanVerse(v, 'spanish'));
}

// Hebrew + JPS English for a whole chapter.
export async function fetchChapterText(sefariaBookName, chapterNum) {
  const res = await fetch(
    `https://www.sefaria.org/api/texts/${encodeURIComponent(sefariaBookName)}.${chapterNum}?commentary=0&context=0&pad=0&ven=Tanakh:%20The%20Holy%20Scriptures,%20published%20by%20JPS`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return {
    english: data.text.map(v => cleanVerse(v, 'english')),
    hebrew: data.he.map(v => cleanVerse(v, 'hebrew')),
  };
}

// One chapter's verses in 'hebrew' | 'english' | 'spanish'.
export async function fetchChapterVerses(sefariaBookName, chapterNum, lang) {
  if (lang === 'spanish') return fetchSpanishFromSefaria(sefariaBookName, chapterNum);
  const text = await fetchChapterText(sefariaBookName, chapterNum);
  return text[lang] || text.hebrew;
}
