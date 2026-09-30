// Loads supabase/content/*.json into the Supabase content tables.
//
//   npm run import:content                 all tables
//   npm run import:content -- midrashim    just the tables you name
//
// Rows are matched by primary key: existing rows are updated, new rows added.
// Nothing is deleted — rows that exist only in the database are left alone.
// Run supabase/content_setup.sql in the SQL Editor first.

import { TABLES, adminClient, readContent } from './lib/supabaseAdmin.mjs';

const only = process.argv.slice(2);
const unknown = only.filter((t) => !TABLES.some((x) => x.name === t));
if (unknown.length) {
  console.error(`Unknown table(s): ${unknown.join(', ')}. Choose from: ${TABLES.map((t) => t.name).join(', ')}`);
  process.exit(1);
}

const db = adminClient();
for (const { name } of TABLES) {
  if (only.length && !only.includes(name)) continue;
  const rows = readContent(name);
  process.stdout.write(`${name}: ${rows.length} rows… `);
  await db.upsert(name, rows);
  console.log('done');
}
console.log('\nImport finished.');
