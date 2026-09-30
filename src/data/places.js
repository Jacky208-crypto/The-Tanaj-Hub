// Filter options for the Biblical Map. The places themselves live in the
// Supabase `places` table (derived from OpenBible.info Bible Geocoding,
// CC BY 4.0 — https://www.openbible.info/geo/). Coordinates are OpenBible's
// "most likely" identification per place (rivers/regions use a centroid);
// `books` link to ids in books.js; `periods` are editorial eras derived from
// the books each place appears in. Add what happened at a place in its
// description_en / _es / _he columns.
//
// A place's `type` and `periods` must use these exact values.
export const PLACE_TYPES = ['city','region','mountain','river','water'];
export const TIME_PERIODS = ["Patriarchs","Exodus & Wilderness","Conquest & Judges","United Monarchy","Kingdom Era","The Prophets","Return & Second Temple"];
