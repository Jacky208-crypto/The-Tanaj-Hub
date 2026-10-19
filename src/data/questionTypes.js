// Question types, used to filter custom quizzes ("only who-said-to-whom
// questions from Shemot 1–10"). Stored in quiz_questions.question_type.
// The ids must match the check constraint in supabase/content_setup.sql.
export const QUESTION_TYPES = [
  { id: 'who_to_whom', label_en: 'Who said it / to whom', label_es: '¿Quién le dijo a quién?', label_he: 'מי אמר למי' },
  { id: 'about_whom', label_en: 'About whom was it said', label_es: '¿Sobre quién se dijo?', label_he: 'על מי נאמר' },
  { id: 'who', label_en: 'Who did it', label_es: '¿Quién lo hizo?', label_he: 'מי עשה' },
  { id: 'fill_blank', label_en: 'Complete the verse', label_es: 'Completa el versículo', label_he: 'השלם את הפסוק' },
  { id: 'numbers', label_en: 'Numbers & dates', label_es: 'Números y fechas', label_he: 'מספרים ותאריכים' },
  { id: 'places', label_en: 'Places', label_es: 'Lugares', label_he: 'מקומות' },
  { id: 'why', label_en: 'Why?', label_es: '¿Por qué?', label_he: 'למה?' },
  { id: 'source', label_en: 'Which book / source', label_es: '¿De qué libro?', label_he: 'מאיזה ספר' },
  { id: 'details', label_en: 'Events & details', label_es: 'Hechos y detalles', label_he: 'אירועים ופרטים' },
];

export const QUESTION_TYPE_IDS = QUESTION_TYPES.map((t) => t.id);

// ---- Automatic classification ----
// A best guess from the English wording, used to tag existing questions
// (npm run classify:questions) and to pre-fill the admin editor. Rules run in
// order and the first match wins. `placeNames` (lower-case names and aliases
// from the places table) lets answers like "Beer Sheva / Hebron / …" count as
// a places question.

const count = (list, test) => list.filter(test).length;

const SMALL_NUMBER = /^(once|twice|three times|never|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty|forty|fifty|sixty|seventy|hundred|a hundred|a thousand)\b/i;
const isNumberAnswer = (o) =>
  /^(about |more than |less than |only |the )?[\d,.]+(\s|$|[×x\-–:;])/i.test(o) ||
  (SMALL_NUMBER.test(o) && o.split(' ').length <= 4);

// "Moshe to Aharon", "H' to Israel"
const isToAnswer = (o) => / to (the )?[A-Z']/.test(o) || /^(H'|Hashem) to /.test(o);

export function classifyQuestion(q, placeNames = new Set()) {
  const s = (q.question_en ?? '').trim();
  const o = (q.options_en ?? []).map((a) => (a ?? '').trim());
  const isPlaceAnswer = (a) => {
    const name = a.toLowerCase().replace(/^(in|to|at|from|on|the|mount)\s+/, '').replace(/^(the|mount)\s+/, '');
    return placeNames.has(name) || placeNames.has(name.split(/[,;(]/)[0].trim());
  };

  if (/which book|where is it written|where does it (say|appear)|which parash|which psalm|to whom is this psalm attributed|when did david compose|which (letter|chapter|perek|section)|which of the books/i.test(s)) {
    return 'source';
  }
  if (/who (told|said|sent word|asked|wrote|says)( (this|it|that))?( (and )?to) (who|whom|quien)|who to whom|who about whom|who told (who|whom)|who said (who|whom)|to whom was it said|who said (this|it)? ?(and )?to whom|who, (for|to) whom/i.test(s)
      || (count(o, isToAnswer) >= 3 && /["“”']|who/i.test(s))
      || /who says (it|this)|who said (it|this)|which prophet said|^who said\b|— who said|who is speaking|who spoke/i.test(s)) {
    return 'who_to_whom';
  }
  if (/fill in the blank|_{2,}|(—|–)\s*["”]?\s*$/i.test(s)) return 'fill_blank';
  if (/about whom|said about|of whom (is|was) it said|about (what|which)|which .* is it from|is it said of|— who\??\s*(\(.*\))?$/i.test(s)) {
    return 'about_whom';
  }
  if (/\bhow (many|much|old|long)\b|what (age|number)|in (which|what) year|on which day|which day of|what (were|are|was) the dimensions/i.test(s)
      || count(o, isNumberAnswer) >= 3) {
    return 'numbers';
  }
  if (/(^|[,—:;]\s*|\b(and|or) )(from |to )?where (did|was|were|is|are|do|does|had|would|will|could|should|shall)\b|which (city|place|mountain|river|land|town|region|country|valley|sea|desert|well)|what (city|place|mountain|river|town|land|region)|name of the (place|city|mountain|river|town)|from which mountain|(to|in|at|from) (which|what) (place|city|town|mountain)/i.test(s)
      || count(o, isPlaceAnswer) >= 3) {
    return 'places';
  }
  if (/^(why|for what reason|what was the reason)|\bwhy (did|was|were|is|does|do|could|should|must|would|had)\b/i.test(s)) return 'why';
  if (/^(who|whom|whose)\b|^(to|by|with|from|for) whom|who (was|were|is|did)\b|which (king|prophet|judge|son|sons|daughter|tribe|kohen|man|woman|spy|officer)\b|whose (son|daughter|wife|father)|name of (his|her|the) (son|wife|father|mother|servant|daughter)|what was the name of/i.test(s)) {
    return 'who';
  }
  return 'details';
}
