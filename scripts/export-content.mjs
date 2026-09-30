// Saves every content table from Supabase into supabase/content/*.json.
//
//   npm run export:content
//
// Run it after editing content in the Table Editor (or on the site) and
// commit the result: it's your backup, and git shows exactly what changed.
// Timestamps are left out so unchanged rows don't show up as diffs.

import { TABLES, adminClient, sortRows, writeContent } from './lib/supabaseAdmin.mjs';

const db = adminClient();
for (const { name, order } of TABLES) {
  const rows = await db.selectAll(name, order);
  const clean = rows.map(({ created_at, updated_at, ...row }) => row);
  writeContent(name, sortRows(clean, order));
  console.log(`${name}: ${rows.length} rows`);
}
console.log('\nSaved to supabase/content/. Review with `git diff supabase/content` and commit.');
