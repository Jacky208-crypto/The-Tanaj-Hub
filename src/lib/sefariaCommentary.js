// Commentary for a single verse, pulled from Sefaria.
//
// Two steps, both lazy and cached in memory:
//   1. fetchVerseSources(book, chapter, verse) — Sefaria's /api/links for the
//      verse, grouped by commentator (Rashi, Ramban…) or midrash collection.
//      Genesis 1:1 alone has ~1,800 links, so we surface a short curated list
//      of commentators first and tuck the rest behind "More commentaries".
//   2. fetchSourceText(group) — the actual Hebrew + English text for one group,
//      fetched only when the user opens it.

// Shown first, in this order, whenever Sefaria has them for the verse.
const FEATURED_COMMENTATORS = [
  'Rashi',
  'Steinsaltz',
  'Ramban',
  'Ibn Ezra',
  'Sforno',
  'Rashbam',
  'Or HaChaim',
  'Radak',
  'Metzudat David',
  'Metzudat Zion',
  'Malbim',
  'Ralbag',
];

// Midrash texts are whole passages, so cap how many we fetch per collection.
const MAX_REFS_PER_GROUP = 8;

const linksCache = new Map();
const textCache = new Map();

// "Rashi on Genesis 1:2:3" → "Rashi on Genesis 1:2", so one request returns
// every comment the commentator made on the verse.
function collapseCommentaryRef(ref) {
  const m = ref.match(/^(.* \d+:\d+):\d+$/);
  return m ? m[1] : ref;
}

export async function fetchVerseSources(sefariaBook, chapter, verse) {
  const key = `${sefariaBook}.${chapter}.${verse}`;
  if (linksCache.has(key)) return linksCache.get(key);

  const res = await fetch(
    `https://www.sefaria.org/api/links/${encodeURIComponent(key)}?with_text=0`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const links = await res.json();
  if (!Array.isArray(links)) throw new Error(links?.error || 'Unexpected response');

  const groups = new Map();
  for (const link of links) {
    if (link.category !== 'Commentary' && link.category !== 'Midrash') continue;
    const title = link.collectiveTitle?.en || link.index_title;
    if (!title) continue;

    if (!groups.has(title)) {
      groups.set(title, {
        id: title,
        title,
        heTitle: link.collectiveTitle?.he || link.heTitle || title,
        category: link.category,
        refs: [],
      });
    }
    const group = groups.get(title);
    const ref = link.category === 'Commentary' ? collapseCommentaryRef(link.ref) : link.ref;
    if (!group.refs.includes(ref)) group.refs.push(ref);
  }

  const all = [...groups.values()];
  const byCount = (a, b) => b.refs.length - a.refs.length;

  const featured = FEATURED_COMMENTATORS
    .map((name) => groups.get(name))
    .filter((g) => g && g.category === 'Commentary');
  const otherCommentary = all
    .filter((g) => g.category === 'Commentary' && !FEATURED_COMMENTATORS.includes(g.title))
    .sort(byCount);
  const midrash = all.filter((g) => g.category === 'Midrash').sort(byCount);

  // Rashi doesn't comment on every verse; the panel still lists him so his
  // absence is explained rather than looking like a bug.
  const result = { featured, otherCommentary, midrash, hasRashi: groups.has('Rashi') };
  linksCache.set(key, result);
  return result;
}

// Keep Sefaria's light formatting (bold headwords, italics) but nothing else,
// and drop translator footnotes, which read as noise in a small panel.
function sanitize(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  doc.querySelectorAll('sup.footnote-marker, i.footnote, .footnote').forEach((el) => el.remove());

  const ALLOWED = new Set(['B', 'STRONG', 'I', 'EM', 'BR', 'SMALL', 'BIG']);
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      walk(child);
      if (ALLOWED.has(child.tagName)) {
        [...child.attributes].forEach((a) => child.removeAttribute(a.name));
      } else {
        child.replaceWith(...child.childNodes);
      }
    });
  };
  const root = doc.body.firstChild;
  walk(root);
  return root.innerHTML.trim();
}

function flatten(text) {
  if (Array.isArray(text)) return text.flatMap(flatten);
  return text ? [text] : [];
}

async function fetchRef(ref) {
  const res = await fetch(
    `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?version=english&version=hebrew`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);

  const en = data.versions?.find((v) => v.language === 'en');
  const he = data.versions?.find((v) => v.language === 'he');
  return {
    ref: data.ref || ref,
    heRef: data.heRef || ref,
    en: flatten(en?.text).map(sanitize).filter(Boolean),
    he: flatten(he?.text).map(sanitize).filter(Boolean),
    enVersion: en?.versionTitle || null,
    heVersion: he?.versionTitle || null,
  };
}

// Returns an array of passages: [{ ref, heRef, en: [html], he: [html], ... }]
export async function fetchSourceText(group) {
  const refs = group.refs.slice(0, MAX_REFS_PER_GROUP);
  const key = refs.join('|');
  if (textCache.has(key)) return textCache.get(key);

  const settled = await Promise.allSettled(refs.map(fetchRef));
  const passages = settled
    .filter((s) => s.status === 'fulfilled')
    .map((s) => s.value)
    .filter((p) => p.en.length || p.he.length);
  if (!passages.length) throw new Error('No text available for this source.');

  const result = { passages, truncated: group.refs.length > refs.length };
  textCache.set(key, result);
  return result;
}
