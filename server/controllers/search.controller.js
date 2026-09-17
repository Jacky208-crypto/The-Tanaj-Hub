// controllers/search.controller.js
//
// Would hold a server-side version of the search in src/lib/tanajSearch.js:
// fetch + cache the Sefaria (Hebrew/English) and Bolls (Spanish) text once
// on the server, then answer /api/search/:lang?q=... from that cache instead
// of making every visitor's browser re-download and re-scan all 39 books.
