// Prints visitor-suggested quiz questions that are waiting for review, as
// JSON (see supabase/submissions_setup.sql).
//
//   npm run suggestions
//
// To turn some into translated drafts: write a drafts file for
// `npm run add:questions` with each row's "submission_id" set to the
// suggestion's id — that marks it accepted, and publishing the draft emails
// the visitor. Reject the rest in /admin → Suggestions.

import { adminClient } from './lib/supabaseAdmin.mjs';

const db = adminClient();
const rows = await db.select(
  'question_submissions',
  'select=id,quiz_key,language,question,options,correct_index,source,submitter_name,created_at&status=eq.pending&order=created_at',
);
console.log(JSON.stringify(rows, null, 2));
console.error(`${rows.length} pending suggestion(s).`);
