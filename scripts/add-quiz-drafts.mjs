// Adds new quiz questions to Supabase as DRAFTS (published = false), so they
// stay out of every quiz until an admin reviews and publishes them in
// /admin → Quiz questions → "Drafts".
//
//   npm run add:questions -- path/to/drafts.json
//   npm run add:questions -- path/to/drafts.json --dry-run   (check only)
//
// The file is a JSON array of rows shaped like supabase/content/quiz_questions.json,
// without id / sort_order / published:
//   { "quiz_key": "bereshit",
//     "question_en": "...", "question_es": "...", "question_he": "...",
//     "options_en": [4 answers], "options_es": [...], "options_he": [...],
//     "correct_index": 0,
//     "chapter": 25,             ← the perek; required
//     "book": "yona",            ← multi-book quizzes only (QUIZ_BOOKS in src/data/books.js)
//     "submission_id": "..." }   ← optional: the visitor suggestion this came from
//                                  (npm run suggestions). The suggestion is marked
//                                  accepted and linked, so publishing the draft
//                                  emails the visitor.
//
// Only inserts — never changes existing rows. A question whose English text
// already exists in that quiz is skipped.

import { readFileSync } from 'node:fs';
import { adminClient } from './lib/supabaseAdmin.mjs';
import { QUIZ_CHAPTERS, QUIZ_BOOKS, getBookById } from '../src/data/books.js';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('Usage: npm run add:questions -- path/to/drafts.json [--dry-run]');
  process.exit(1);
}

const drafts = JSON.parse(readFileSync(file, 'utf8'));
const db = adminClient();
const quizKeys = new Set((await db.selectAll('quizzes', 'key')).map((q) => q.key));
const existing = await db.selectAll('quiz_questions', 'quiz_key,sort_order');
const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const seen = new Set(existing.map((q) => `${q.quiz_key}|${norm(q.question_en)}`));
const nextOrder = {};
for (const q of existing) nextOrder[q.quiz_key] = Math.max(nextOrder[q.quiz_key] ?? 0, q.sort_order + 1);

const problems = [];
const rows = [];
drafts.forEach((d, i) => {
  const label = `#${i + 1} (${d.question_en?.slice(0, 50) ?? 'no question'})`;
  if (!quizKeys.has(d.quiz_key)) return problems.push(`${label}: unknown quiz_key "${d.quiz_key}"`);
  for (const l of ['en', 'es', 'he']) {
    if (!d[`question_${l}`]?.trim()) problems.push(`${label}: missing question_${l}`);
    const opts = d[`options_${l}`];
    if (!Array.isArray(opts) || opts.length !== 4 || opts.some((o) => !o?.trim())) {
      problems.push(`${label}: options_${l} must be 4 non-empty answers`);
    }
  }
  if (!Number.isInteger(d.correct_index) || d.correct_index < 0 || d.correct_index > 3) {
    problems.push(`${label}: correct_index must be 0–3`);
  }
  const books = QUIZ_BOOKS[d.quiz_key];
  if (books && !books.includes(d.book)) problems.push(`${label}: book must be one of ${books.join(', ')}`);
  const maxChapter = books ? getBookById(d.book)?.chapters : QUIZ_CHAPTERS[d.quiz_key];
  if (maxChapter && !(Number.isInteger(d.chapter) && d.chapter >= 1 && d.chapter <= maxChapter)) {
    problems.push(`${label}: chapter must be the perek, 1–${maxChapter}`);
  }
  const key = `${d.quiz_key}|${norm(d.question_en ?? '')}`;
  if (seen.has(key)) return console.log(`skip (already exists): ${label}`);
  seen.add(key);
  rows.push({
    submission_id: d.submission_id,
    quiz_key: d.quiz_key,
    sort_order: (nextOrder[d.quiz_key] = (nextOrder[d.quiz_key] ?? 1) + 1) - 1,
    question_en: d.question_en.trim(), question_es: d.question_es.trim(), question_he: d.question_he.trim(),
    options_en: d.options_en, options_es: d.options_es, options_he: d.options_he,
    correct_index: d.correct_index,
    book: books ? d.book : null,
    chapter: maxChapter ? d.chapter : null,
    published: false,
  });
});

if (problems.length) {
  console.error(`Nothing added — fix these first:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
if (dryRun) {
  console.log(`OK: ${rows.length} draft(s) would be added.`);
} else if (rows.length) {
  const linked = rows.filter((r) => r.submission_id);
  const strip = ({ submission_id, ...row }) => row;
  const plain = rows.filter((r) => !r.submission_id).map(strip);
  if (plain.length) await db.upsert('quiz_questions', plain);
  for (const r of linked) {
    const [saved] = await db.insert('quiz_questions', [strip(r)]);
    await db.update('question_submissions', `id=eq.${r.submission_id}`, {
      status: 'accepted', quiz_question_id: saved.id, reviewed_at: new Date().toISOString(),
    });
  }
  if (linked.length) console.log(`Linked ${linked.length} to visitor suggestions (they're emailed when published).`);
  console.log(`Added ${rows.length} draft question(s). Review them in /admin → Quiz questions → Drafts.`);
} else {
  console.log('Nothing new to add.');
}
