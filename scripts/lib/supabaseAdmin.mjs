// Shared by the content scripts (import / export / validate). Talks to
// Supabase's REST API with the SECRET key, which bypasses Row-Level Security —
// so this only ever runs on your machine, never in the website.
//
// Needs two lines in .env (run scripts with `node --env-file=.env ...`,
// which the npm scripts already do):
//   VITE_SUPABASE_URL=...            (already there)
//   SUPABASE_SECRET_KEY=sb_secret_...  Dashboard → Project Settings → API Keys
//                                      (older projects: the "service_role" key)
//
// The name deliberately does NOT start with VITE_, so Vite never puts it in
// the site bundle.

import { readFileSync, writeFileSync } from 'node:fs';

export const CONTENT_DIR = new URL('../../supabase/content/', import.meta.url);

// Tables in dependency order (parents before children), with the columns
// exports are sorted by so backups diff cleanly in git.
export const TABLES = [
  { name: 'quizzes', order: 'sort_order,key' },
  { name: 'quiz_questions', order: 'quiz_key,sort_order,id' },
  { name: 'note_topics', order: 'sort_order,slug' },
  { name: 'note_entries', order: 'topic_slug,sort_order,id' },
  { name: 'midrashim', order: 'sort_order,id' },
  { name: 'places', order: 'id' },
];

export function readContent(table) {
  return JSON.parse(readFileSync(new URL(`${table}.json`, CONTENT_DIR), 'utf8'));
}

// Sort in JS (plain code-point order) rather than trusting the database's
// collation, so the same rows always serialize in the same order.
export function sortRows(rows, order) {
  const keys = order.split(',');
  const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  return [...rows].sort((x, y) => {
    for (const k of keys) {
      const c = cmp(x[k], y[k]);
      if (c) return c;
    }
    return 0;
  });
}

export function writeContent(table, rows) {
  writeFileSync(new URL(`${table}.json`, CONTENT_DIR), JSON.stringify(rows, null, 2) + '\n');
}

export function adminClient({ required = true } = {}) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    if (!required) return null;
    console.error(
      'Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.\n' +
      'Add the secret key from Supabase → Project Settings → API Keys, then re-run.'
    );
    process.exit(1);
  }

  const headers = { apikey: key, 'Content-Type': 'application/json' };
  // Legacy service_role keys are JWTs and also go in Authorization;
  // the newer sb_secret_ keys must only be sent as `apikey`.
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;

  async function request(path, init = {}) {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      ...init,
      headers: { ...headers, ...init.headers },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`${init.method || 'GET'} ${path} → HTTP ${res.status}: ${body}`);
    }
    return res.status === 204 || res.headers.get('content-length') === '0' ? null : res.json();
  }

  return {
    // Every row of a table, in pages (Supabase returns at most 1000 per request).
    async selectAll(table, order) {
      const rows = [];
      const PAGE = 1000;
      for (let offset = 0; ; offset += PAGE) {
        // Stable paging needs a stable order; the final order is set by sortRows.
        const page = await request(`${table}?select=*&order=${order}&limit=${PAGE}&offset=${offset}`);
        rows.push(...page);
        if (page.length < PAGE) return rows;
      }
    },

    // Insert or update by primary key, in batches.
    async upsert(table, rows) {
      const BATCH = 500;
      for (let i = 0; i < rows.length; i += BATCH) {
        await request(table, {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(rows.slice(i, i + BATCH)),
        });
      }
    },
  };
}
