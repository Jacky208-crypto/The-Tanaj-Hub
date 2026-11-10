// Vercel function: POST /api/translate-commentary  { ref: "Rashi on Genesis 1:2", lang: "es" | "en" }
// → { ref, segments: [html, ...] }
//
// Sefaria has no Spanish for Rashi, Ramban, midrash…, and no English at all
// for many commentators (Metzudat Zion, Malbim on Neviim…). The first time a
// visitor opens one of these we translate it with DeepL, from Sefaria's English
// when it has one and otherwise from the Hebrew, and save it in the
// commentary_translations table (supabase/commentary_translations_setup.sql).
// The browser reads that table directly, so this only runs for refs nobody
// has opened in that language yet.
//
// The source text is always fetched from Sefaria here, never taken from the
// request, so the DeepL key can't be used to translate arbitrary text.
//
// Environment variables (Vercel → Project → Settings → Environment Variables,
// and .env for local dev):
//   DEEPL_API_KEY        DeepL API key (free keys end in ":fx")
//   SUPABASE_SECRET_KEY  same secret key the content scripts use
//   VITE_SUPABASE_URL    already set for the site

import { cleanSpanishNames } from '../src/lib/spanishText.js';

// Longest source text we'll translate for one ref. Commentary on a verse is
// usually a few thousand characters (Ramban on Genesis 1:1 is ~19k); this
// stops someone requesting a whole book through a long midrash ref.
const MAX_CHARS = 50000;
// DeepL accepts at most 50 texts per request.
const DEEPL_BATCH = 50;

const TARGETS = {
  es: { deepl: 'ES', column: 'segments_es' },
  en: { deepl: 'EN-US', column: 'segments_en' },
};

// Vowel points and cantillation (not maqaf or sof pasuq). DeepL bills per
// character and the vocalized editions are about twice as long without
// saying anything more.
const NIQQUD = /[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g;

// Best-effort limit on NEW translations per visitor (cache hits are free and
// don't count). Memory is per serverless instance, so this is a speed bump,
// not a guarantee: also set a monthly character cap in the DeepL dashboard.
const WINDOW_MS = 60_000;
const MAX_NEW_PER_WINDOW = 20;
const recent = new Map();

function tooMany(request) {
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) {
    for (const [k, v] of recent) if (now - v[v.length - 1] > WINDOW_MS) recent.delete(k);
  }
  return hits.length > MAX_NEW_PER_WINDOW;
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function flatten(text) {
  if (Array.isArray(text)) return text.flatMap(flatten);
  return text ? [text] : [];
}

// Drop translator footnotes (the browser hides them anyway) so we don't pay
// to translate them. <i class="footnote"> can contain nested <i>, so match
// tags by depth rather than with one regex.
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

async function fetchSource(ref) {
  const res = await fetch(
    `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?version=english&version=hebrew`
  );
  if (!res.ok) throw new Error(`Sefaria HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  const en = data.versions?.find((v) => v.language === 'en');
  const he = data.versions?.find((v) => v.language === 'he');
  const enSegments = flatten(en?.text).map(stripFootnotes).filter(Boolean);
  if (enSegments.length) {
    return { ref: data.ref || ref, from: 'EN', version: en.versionTitle || null, segments: enSegments };
  }
  return {
    ref: data.ref || ref,
    from: 'HE',
    version: he?.versionTitle || null,
    segments: flatten(he?.text).map((s) => stripFootnotes(s).replace(NIQQUD, '')).filter(Boolean),
  };
}

async function deepl(texts, from, to) {
  const key = process.env.DEEPL_API_KEY;
  const host = key.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';
  const out = [];
  for (let i = 0; i < texts.length; i += DEEPL_BATCH) {
    const res = await fetch(`https://${host}/v2/translate`, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts.slice(i, i + DEEPL_BATCH),
        source_lang: from,
        target_lang: to,
        tag_handling: 'html',
      }),
    });
    if (!res.ok) throw new Error(`DeepL HTTP ${res.status}`);
    const data = await res.json();
    out.push(...data.translations.map((t) => t.text));
  }
  return out;
}

function supabase(path, init = {}) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...init.headers },
  });
}

async function readSaved(ref, column) {
  const res = await supabase(
    `commentary_translations?select=*&ref=eq.${encodeURIComponent(ref)}`
  );
  if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
  const [row] = await res.json();
  return row?.[column] ? { ref: row.ref, segments: row[column] } : null;
}

export async function POST(request) {
  if (!process.env.DEEPL_API_KEY || !process.env.SUPABASE_SECRET_KEY) {
    return json({ error: 'Translation is not configured.' }, 503);
  }

  let ref, lang;
  try {
    ({ ref, lang = 'es' } = await request.json());
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }
  if (typeof ref !== 'string' || !ref.trim() || ref.length > 200) {
    return json({ error: 'Missing ref.' }, 400);
  }
  const target = TARGETS[lang];
  if (!target) return json({ error: 'Unsupported language.' }, 400);

  try {
    const saved = await readSaved(ref, target.column);
    if (saved) return json(saved);

    if (tooMany(request)) return json({ error: 'Too many requests. Try again in a minute.' }, 429);

    const source = await fetchSource(ref);
    if (!source.segments.length) return json({ error: 'No text to translate.' }, 404);
    // Sefaria's own English is better than a machine one, and the browser shows it.
    if (lang === 'en' && source.from === 'EN') return json({ error: 'Already in English.' }, 409);
    const chars = source.segments.reduce((n, s) => n + s.length, 0);
    if (chars > MAX_CHARS) return json({ error: 'Text too long to translate.' }, 413);

    // Sefaria may normalize the ref ("Rashi on Gen 1:2" → "Rashi on Genesis 1:2").
    if (source.ref !== ref) {
      const savedNormalized = await readSaved(source.ref, target.column);
      if (savedNormalized) return json(savedNormalized);
    }

    const translated = await deepl(source.segments, source.from, target.deepl);
    const segments = lang === 'es' ? translated.map(cleanSpanishNames) : translated;

    // A ref's languages share one row, so merge: this only sets the columns
    // sent here. Rows that already had this language returned early above.
    const save = await supabase('commentary_translations', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({
        ref: source.ref,
        [source.from === 'EN' ? 'en_version' : 'he_version']: source.version,
        [target.column]: segments,
      }),
    });
    if (!save.ok) console.error('Could not save translation', source.ref, save.status, await save.text());

    return json({ ref: source.ref, segments });
  } catch (e) {
    console.error('translate-commentary', ref, e);
    return json({ error: e.message }, 502);
  }
}
