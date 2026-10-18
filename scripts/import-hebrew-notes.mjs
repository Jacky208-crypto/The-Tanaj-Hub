// Copies ONLY the Hebrew columns of the study notes (title_he, body_he,
// table_he) from supabase/content/*.json into Supabase.
//
//   npm run import:notes-he
//
// Unlike `npm run import:content`, this never touches the English or Spanish
// columns, so edits made on the site since the last export are kept.

import { adminClient, readContent } from './lib/supabaseAdmin.mjs';

const db = adminClient();

const topics = readContent('note_topics');
for (const t of topics) {
  await db.update('note_topics', `slug=eq.${encodeURIComponent(t.slug)}`, { title_he: t.title_he });
}
console.log(`note_topics: ${topics.length} Hebrew titles updated`);

const entries = readContent('note_entries');
for (const e of entries) {
  await db.update('note_entries', `id=eq.${e.id}`, {
    title_he: e.title_he,
    body_he: e.body_he,
    table_he: e.table_he,
  });
}
console.log(`note_entries: ${entries.length} Hebrew notes updated`);
console.log('\nDone. Reload the Helpful Notes page and pick עברית.');
