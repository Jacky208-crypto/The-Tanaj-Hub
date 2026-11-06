// Pre-translate every Sefaria commentary on a book into English with DeepL and
// save it in Supabase's commentary_translations table, so visitors never wait
// for DeepL (the site reads that table directly; see api/translate-commentary.js).
//
//   npm run preload:commentary -- --dry-run     count characters first (no DeepL, no writes)
//   npm run preload:commentary                  translate and save (Melachim Bet = "II Kings")
//
// Options:
//   --dry-run              fetch the texts and report how many DeepL characters it would take
//   --book "II Kings"      Sefaria book title (default: II Kings)
//   --chapters 1-25        chapter range (default: 1-25)
//   --only "Malbim,Radak"  only these commentators (Sefaria names, comma separated)
//   --max-chars 200000     stop after this many characters (re-run later to continue)
//
// Safe to re-run: refs that already have segments_en are skipped, and refs where
// Sefaria already has an English version are skipped (the site shows Sefaria's
// own English first, same as api/translate-commentary.js).
//
// Needs in .env: VITE_SUPABASE_URL, SUPABASE_SECRET_KEY, DEEPL_API_KEY
// (npm script already passes --env-file=.env).

import { adminClient } from './lib/supabaseAdmin.mjs';

// ---- options ---------------------------------------------------------------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const DRY_RUN = flag('dry-run');
const BOOK = opt('book', 'II Kings');
const [FIRST_CH, LAST_CH] = opt('chapters', '1-25').split('-').map(Number);
const ONLY = opt('only', '') ? new Set(opt('only', '').split(',').map((s) => s.trim())) : null;
const MAX_CHARS = Number(opt('max-chars', Infinity));

const SEFARIA_CONCURRENCY = 4;
const DEEPL_BATCH_TEXTS = 50;      // DeepL: at most 50 texts per request
const DEEPL_BATCH_BYTES = 100_000; // DeepL: request body limit is 128 KiB
const SAVE_EVERY = 10;             // rows per Supabase write

// ---- helpers (same cleaning rules as api/translate-commentary.js) ------------
const NIQQUD = /[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const flatten = (t) => (Array.isArray(t) ? t.flatMap(flatten) : t ? [t] : []);

function stripFootnotes(html) {
  let out = html.replace(/<sup[^>]*class="footnote-marker"[^>]*>.*?<\/sup>/g, '');
  let start;
  while ((start = out.search(/<i[^>]*class="footnote"[^>]*>/)) !== -1) {
    const tag = /<\/?i\b[^>]*>/g;
    tag.lastIndex = start;
    let depth = 0;
    let end = out.length;
    let m;
    while ((m = tag.exec(out))) {
      depth += m[0].startsWith('</') ? -1 : 1;
      if (depth === 0) { end = tag.lastIndex; break; }
    }
    out = out.slice(0, start) + out.slice(end);
  }
  return out.trim();
}

// "Rashi on II Kings 2:3:1" → "Rashi on II Kings 2:3" (same as the site)
function collapseCommentaryRef(ref) {
  const m = ref.match(/^(.* \d+:\d+):\d+$/);
  return m ? m[1] : ref;
}

async function fetchRetry(url, init, label) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, init);
    } catch (e) {
      if (attempt >= 4) throw new Error(`${label}: ${e.message}`);
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    if (res.ok) return res;
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await sleep(1500 * 2 ** attempt);
      continue;
    }
    throw Object.assign(new Error(`${label}: HTTP ${res.status}`), { status: res.status });
  }
}

async function pool(items, size, worker) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        await worker(items[i], i);
      }
    })
  );
}

// ---- Sefaria ------------------------------------------------------------------
// Every commentary ref anchored anywhere in the book, grouped by commentator.
async function collectRefs() {
  const groups = new Map(); // commentator → Set(ref)
  for (let ch = FIRST_CH; ch <= LAST_CH; ch++) {
    const res = await fetchRetry(
      `https://www.sefaria.org/api/links/${encodeURIComponent(`${BOOK}.${ch}`)}?with_text=0`,
      undefined,
      `links ${BOOK} ${ch}`
    );
    const links = await res.json();
    if (!Array.isArray(links)) throw new Error(`links ${BOOK} ${ch}: ${links?.error || 'unexpected response'}`);
    for (const link of links) {
      if (link.category !== 'Commentary') continue;
      const title = link.collectiveTitle?.en || link.index_title;
      if (!title || (ONLY && !ONLY.has(title))) continue;
      if (!groups.has(title)) groups.set(title, new Set());
      groups.get(title).add(collapseCommentaryRef(link.ref));
    }
    process.stdout.write(`\rCollecting commentary refs… chapter ${ch}/${LAST_CH}`);
  }
  process.stdout.write('\n');
  return groups;
}

async function fetchSource(ref) {
  const res = await fetchRetry(
    `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?version=english&version=hebrew`,
    undefined,
    `text ${ref}`
  );
  const data = await res.json();
  if (data.error) throw new Error(`text ${ref}: ${data.error}`);
  const en = data.versions?.find((v) => v.language === 'en');
  const he = data.versions?.find((v) => v.language === 'he');
  const enSegments = flatten(en?.text).map(stripFootnotes).filter(Boolean);
  if (enSegments.length) return { ref: data.ref || ref, from: 'EN' };
  return {
    ref: data.ref || ref,
    from: 'HE',
    version: he?.versionTitle || null,
    segments: flatten(he?.text).map((s) => stripFootnotes(s).replace(NIQQUD, '')).filter(Boolean),
  };
}

// ---- Supabase -----------------------------------------------------------------
async function alreadySaved(db, refs) {
  const saved = new Set();
  if (!db) return saved;
  for (let i = 0; i < refs.length; i += 40) {
    const list = refs.slice(i, i + 40).map((r) => `"${r.replace(/["\\]/g, '\\$&')}"`).join(',');
    const rows = await db.select(
      'commentary_translations',
      `select=ref&segments_en=not.is.null&ref=in.(${encodeURIComponent(list)})`
    );
    rows.forEach((r) => saved.add(r.ref));
  }
  return saved;
}

// ---- DeepL --------------------------------------------------------------------
const deeplKey = process.env.DEEPL_API_KEY;
const deeplHost = deeplKey?.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';

async function deeplRemaining() {
  const res = await fetchRetry(
    `https://${deeplHost}/v2/usage`,
    { headers: { Authorization: `DeepL-Auth-Key ${deeplKey}` } },
    'DeepL usage'
  );
  const u = await res.json();
  return { used: u.character_count, limit: u.character_limit, left: u.character_limit - u.character_count };
}

async function deeplTranslate(texts) {
  const out = [];
  let i = 0;
  while (i < texts.length) {
    const batch = [];
    let bytes = 0;
    while (i < texts.length && batch.length < DEEPL_BATCH_TEXTS && (!batch.length || bytes + Buffer.byteLength(texts[i]) < DEEPL_BATCH_BYTES)) {
      bytes += Buffer.byteLength(texts[i]);
      batch.push(texts[i++]);
    }
    const res = await fetchRetry(
      `https://${deeplHost}/v2/translate`,
      {
        method: 'POST',
        headers: { Authorization: `DeepL-Auth-Key ${deeplKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: batch, source_lang: 'HE', target_lang: 'EN-US', tag_handling: 'html' }),
      },
      'DeepL'
    );
    const data = await res.json();
    out.push(...data.translations.map((t) => t.text));
  }
  return out;
}

// ---- main ---------------------------------------------------------------------
const db = adminClient({ required: !DRY_RUN });
if (!DRY_RUN && !deeplKey) {
  console.error('Missing DEEPL_API_KEY in .env.');
  process.exit(1);
}

console.log(`${DRY_RUN ? '[dry run] ' : ''}Commentaries on ${BOOK} ${FIRST_CH}-${LAST_CH}${ONLY ? ` (only ${[...ONLY].join(', ')})` : ''}`);

const groups = await collectRefs();
const plan = []; // { title, ref, version, segments, chars }
const stats = new Map(); // commentator → counts

for (const [title, refSet] of groups) {
  const refs = [...refSet];
  const saved = await alreadySaved(db, refs);
  const s = { refs: refs.length, saved: 0, english: 0, empty: 0, todo: 0, chars: 0 };
  stats.set(title, s);

  const pending = refs.filter((r) => {
    if (saved.has(r)) { s.saved++; return false; }
    return true;
  });
  const seen = new Set();
  await pool(pending, SEFARIA_CONCURRENCY, async (ref) => {
    try {
      const src = await fetchSource(ref);
      if (seen.has(src.ref) || saved.has(src.ref)) return;
      seen.add(src.ref);
      if (src.from === 'EN') { s.english++; return; }
      if (!src.segments.length) { s.empty++; return; }
      const chars = src.segments.reduce((n, x) => n + x.length, 0);
      s.todo++;
      s.chars += chars;
      plan.push({ title, ref: src.ref, version: src.version, segments: src.segments, chars });
    } catch (e) {
      console.warn(`\n  skipped ${ref}: ${e.message}`);
    }
  });
  console.log(`  ${title.padEnd(24)} ${String(s.refs).padStart(4)} refs · ${String(s.todo).padStart(4)} to translate (${s.chars.toLocaleString()} chars) · ${s.english} have Sefaria English · ${s.saved} already saved`);
}

const totalChars = plan.reduce((n, p) => n + p.chars, 0);
console.log(`\nTotal to translate: ${plan.length} refs, ${totalChars.toLocaleString()} characters.`);

if (DRY_RUN || !plan.length) {
  if (DRY_RUN && deeplKey) {
    const u = await deeplRemaining();
    console.log(`DeepL quota left this period: ${u.left.toLocaleString()} of ${u.limit.toLocaleString()} characters.`);
  }
  process.exit(0);
}

const quota = await deeplRemaining();
console.log(`DeepL quota left this period: ${quota.left.toLocaleString()} of ${quota.limit.toLocaleString()} characters.`);
const budget = Math.min(quota.left, MAX_CHARS);
if (totalChars > budget) {
  console.log(`That is more than the budget (${budget.toLocaleString()}). Translating as many as fit; re-run later (or with --only) to continue.`);
}

let spent = 0;
let done = 0;
let buffer = [];
const flush = async () => {
  if (!buffer.length) return;
  await db.upsert('commentary_translations', buffer);
  buffer = [];
};

try {
  for (const p of plan) {
    if (spent + p.chars > budget) continue; // a shorter one later may still fit
    const segments = await deeplTranslate(p.segments);
    spent += p.chars;
    done++;
    buffer.push({ ref: p.ref, he_version: p.version, segments_en: segments });
    if (buffer.length >= SAVE_EVERY) await flush();
    process.stdout.write(`\rTranslated ${done}/${plan.length} refs (${spent.toLocaleString()} chars)`);
  }
} catch (e) {
  console.error(`\nStopped: ${e.message}${e.status === 456 ? ' (DeepL quota used up)' : ''}`);
  process.exitCode = 1;
} finally {
  await flush();
}
console.log(`\nSaved ${done} of ${plan.length} refs. Re-run any time; saved ones are skipped.`);
