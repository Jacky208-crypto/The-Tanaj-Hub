// Vercel function: POST /api/translate-commentary  { ref: "Rashi on Genesis 1:2" }
// → { ref, segments: [html, ...] }  (Spanish)
//
// Sefaria has no Spanish for Rashi, Ramban, midrash…, so the first time a
// visitor opens one in Spanish we translate Sefaria's English with DeepL and
// save it in the commentary_translations table (supabase/commentary_translations_setup.sql).
// The browser reads that table directly, so this only runs for refs nobody
// has opened in Spanish yet.
//
// The English is always fetched from Sefaria here, never taken from the
// request, so the DeepL key can't be used to translate arbitrary text.
//
// Environment variables (Vercel → Project → Settings → Environment Variables,
// and .env for local dev):
//   DEEPL_API_KEY        DeepL API key (free keys end in ":fx")
//   SUPABASE_SECRET_KEY  same secret key the content scripts use
//   VITE_SUPABASE_URL    already set for the site

import { cleanSpanishNames } from '../src/lib/spanishText.js';

// Longest English text we'll translate for one ref. Commentary on a verse is
// usually a few thousand characters (Ramban on Genesis 1:1 is ~19k); this
// stops someone requesting a whole book through a long midrash ref.
const MAX_CHARS = 50000;
// DeepL accepts at most 50 texts per request.
const DEEPL_BATCH = 50;

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

async function fetchEnglish(ref) {
  const res = await fetch(
    `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?version=english`
  );
  if (!res.ok) throw new Error(`Sefaria HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  const en = data.versions?.find((v) => v.language === 'en');
  return {
    ref: data.ref || ref,
    version: en?.versionTitle || null,
    segments: flatten(en?.text).map(stripFootnotes).filter(Boolean),
  };
}

async function deepl(texts) {
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
        source_lang: 'EN',
        target_lang: 'ES',
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

async function readSaved(ref) {
  const res = await supabase(
    `commentary_translations?select=ref,segments_es&ref=eq.${encodeURIComponent(ref)}`
  );
  if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
  const [row] = await res.json();
  return row || null;
}

export async function POST(request) {
  if (!process.env.DEEPL_API_KEY || !process.env.SUPABASE_SECRET_KEY) {
    return json({ error: 'Translation is not configured.' }, 503);
  }

  let ref;
  try {
    ({ ref } = await request.json());
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }
  if (typeof ref !== 'string' || !ref.trim() || ref.length > 200) {
    return json({ error: 'Missing ref.' }, 400);
  }

  try {
    const saved = await readSaved(ref);
    if (saved) return json({ ref: saved.ref, segments: saved.segments_es });

    const en = await fetchEnglish(ref);
    if (!en.segments.length) return json({ error: 'No English text to translate.' }, 404);
    const chars = en.segments.reduce((n, s) => n + s.length, 0);
    if (chars > MAX_CHARS) return json({ error: 'Text too long to translate.' }, 413);

    // Sefaria may normalize the ref ("Rashi on Gen 1:2" → "Rashi on Genesis 1:2").
    if (en.ref !== ref) {
      const savedNormalized = await readSaved(en.ref);
      if (savedNormalized) return json({ ref: en.ref, segments: savedNormalized.segments_es });
    }

    const segments = (await deepl(en.segments)).map(cleanSpanishNames);

    // ignore-duplicates: if two visitors translate the same ref at once, keep the first.
    const save = await supabase('commentary_translations', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates' },
      body: JSON.stringify({ ref: en.ref, en_version: en.version, segments_es: segments }),
    });
    if (!save.ok) console.error('Could not save translation', en.ref, save.status, await save.text());

    return json({ ref: en.ref, segments });
  } catch (e) {
    console.error('translate-commentary', ref, e);
    return json({ error: e.message }, 502);
  }
}
