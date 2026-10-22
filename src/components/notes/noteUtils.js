import { bookLabel } from '../../data/books';

// Highlight colors a quoted pasuk can have (also used to mark it in the reader).
export const PASSUK_COLORS = ['yellow', 'green', 'blue', 'pink', 'purple'];

// A note's body is HTML from the rich editor. Notes written before the editor
// existed are plain text — turn those into paragraphs.
export function noteToHtml(body) {
  if (!body) return '';
  if (/^\s*</.test(body)) return body;
  const escape = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return body.split('\n').map((line) => `<p>${escape(line)}</p>`).join('');
}

// True when the editor's HTML has nothing in it worth saving.
export function isEmptyHtml(html) {
  if (!html) return true;
  if (/data-(passuk|sketch|callout)|<table|<hr/.test(html)) return false;
  return !html.replace(/<[^>]+>/g, '').trim();
}

// "Shemot 2:4", "Shemot 2:4–6" or "Shemot 2" for a note anchored to the text.
export function anchorRef(note, language) {
  if (!note?.book_id || !note.chapter) return null;
  const name = bookLabel(note.book_id, language);
  if (!note.verse_from) return `${name} ${note.chapter}`;
  const range = note.verse_to && note.verse_to !== note.verse_from
    ? `${note.verse_from}–${note.verse_to}`
    : `${note.verse_from}`;
  return `${name} ${note.chapter}:${range}`;
}

// Fallback title for an anchored note the user hasn't named.
export function anchorTitle(note, s, language) {
  if (!note?.book_id || !note.chapter) return null;
  if (!note.verse_from) return s.notesOnPerek(bookLabel(note.book_id, language), note.chapter);
  return s.notesOnVerse(anchorRef(note, language));
}

export function readerLink(bookId, chapter, verse, lang) {
  const params = new URLSearchParams({ chapter: String(chapter) });
  if (verse) params.set('verse', String(verse));
  if (lang) params.set('lang', lang);
  return `/book/${bookId}?${params}`;
}

function parse(html) {
  return new DOMParser().parseFromString(noteToHtml(html), 'text/html');
}

// Every Question block in a note: { index, text, ref, answered }.
export function extractQuestions(note) {
  return [...parse(note.body).querySelectorAll('div[data-callout][data-kind="question"]')].map((el, index) => ({
    index,
    text: el.textContent.trim(),
    ref: el.getAttribute('data-ref') || '',
    answered: el.getAttribute('data-answered') === 'true',
  }));
}

// Flip a question's "answered" box straight in the stored HTML.
export function toggleQuestionInHtml(html, index) {
  const doc = parse(html);
  const el = doc.querySelectorAll('div[data-callout][data-kind="question"]')[index];
  if (!el) return html;
  el.setAttribute('data-answered', el.getAttribute('data-answered') === 'true' ? 'false' : 'true');
  return doc.body.innerHTML;
}

// Pesukim of one chapter quoted in these notes → list of highlights
// { color, lang, start, end }. start/end are character offsets into the pasuk
// when only part of it was quoted (end null = to the end of the pasuk);
// both null = the whole pasuk.
export function quotedVerses(notes, bookId, chapter) {
  const verses = new Map();
  const add = (v, mark) => verses.set(v, [...(verses.get(v) || []), mark]);
  for (const note of notes) {
    for (const el of parse(note.body).querySelectorAll('blockquote[data-passuk]')) {
      if (el.getAttribute('data-book') !== bookId || Number(el.getAttribute('data-chapter')) !== chapter) continue;
      const from = Number(el.getAttribute('data-verse'));
      const to = Number(el.getAttribute('data-verse-to')) || from;
      const color = el.getAttribute('data-color') || 'yellow';
      const lang = el.getAttribute('data-lang');
      const partial = el.hasAttribute('data-start');
      const start = Number(el.getAttribute('data-start')) || 0;
      const end = el.hasAttribute('data-end') ? Number(el.getAttribute('data-end')) : null;
      for (let v = from; v <= to; v++) {
        if (!partial) add(v, { color, lang, start: null, end: null });
        else add(v, { color, lang, start: v === from ? start : 0, end: v === to ? end : null });
      }
    }
  }
  return verses;
}
