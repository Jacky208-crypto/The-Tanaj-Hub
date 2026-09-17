// routes/search.routes.js
//
// src/lib/tanajSearch.js currently does full-Tanakh search entirely in the
// browser: the first search downloads all 39 books from Sefaria (Hebrew +
// English) and paginates Bolls' API for Spanish, then scans client-side.
// Every visitor repeats that same download.
//
// Would hold, if search ever moves server-side:
//   GET /:lang?q=...  -> search cached/indexed Tanakh text, returning matches
//                        in the same { total, results } shape tanajSearch.js
//                        already expects, so Search.jsx wouldn't need to change
//
// Needs somewhere to cache the whole Tanakh server-side once (in memory, or
// a `tanaj_text` table) instead of every browser re-downloading it.
