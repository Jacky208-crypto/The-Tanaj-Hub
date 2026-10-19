// Fills in quiz_questions.question_type (who said to whom, places, numbers, …)
// with a best guess from each question's English wording — see
// classifyQuestion in src/data/questionTypes.js.
//
//   npm run classify:questions               questions with no type yet
//   npm run classify:questions -- --all      re-guess every question (overwrites!)
//   npm run classify:questions -- --dry-run  just print what it would do
//
// Fix individual guesses in /admin → Quiz questions (the "Question type" field).

import { adminClient } from './lib/supabaseAdmin.mjs';
import { classifyQuestion, QUESTION_TYPE_IDS } from '../src/data/questionTypes.js';

const args = process.argv.slice(2);
const all = args.includes('--all');
const dryRun = args.includes('--dry-run');

const db = adminClient();
const questions = await db.selectAll('quiz_questions', 'quiz_key,sort_order,id');
if (!dryRun && questions.length && !('question_type' in questions[0])) {
  console.error('quiz_questions has no question_type column yet — run supabase/content_setup.sql in the SQL Editor first.');
  process.exit(1);
}
const placeNames = new Set();
for (const p of await db.selectAll('places', 'id')) {
  for (const n of [p.name, ...(p.aliases ?? [])]) placeNames.add(n.toLowerCase());
}

const todo = questions.filter((q) => all || !q.question_type);
const byType = Object.fromEntries(QUESTION_TYPE_IDS.map((t) => [t, []]));
for (const q of todo) {
  const type = classifyQuestion(q, placeNames);
  if (type !== q.question_type) byType[type].push(q.id);
}

for (const [type, ids] of Object.entries(byType)) console.log(`${type.padEnd(12)} ${ids.length}`);
if (dryRun) process.exit(0);

// One PATCH per type, in batches so the URL stays short.
const BATCH = 150;
for (const [type, ids] of Object.entries(byType)) {
  for (let i = 0; i < ids.length; i += BATCH) {
    await db.update('quiz_questions', `id=in.(${ids.slice(i, i + BATCH).join(',')})`, { question_type: type });
  }
}
const changed = Object.values(byType).reduce((n, ids) => n + ids.length, 0);
console.log(`\nTagged ${changed} question(s). Run npm run export:content to save them to supabase/content/.`);
