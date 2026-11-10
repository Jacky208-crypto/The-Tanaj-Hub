// After `vite build`: write a copy of dist/index.html for each public page with
// its own <title>, description, canonical URL and social tags. Nothing visible
// changes — the same app loads — but crawlers get page-specific metadata
// without having to run JavaScript. Vercel serves these static files before
// falling back to the SPA rewrite.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { allBooks, torahBooks, neviimRishonimBooks, neviimAjaranimBooks, ketuvimBooks } from '../src/data/books.js';

const SITE = 'https://thetanajhub.com';
const dist = new URL('../dist/', import.meta.url);
const template = readFileSync(new URL('index.html', dist), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const pages = [
  {
    path: 'quiz',
    title: 'Tanaj Practice Questions – Free Tanach / Tanakh Quizzes by Book & Chapter | The Tanaj Hub',
    description: 'Free Tanaj practice questions and quizzes (Tanach / Tanakh). Test yourself on any book and chapter of Torah, Nevi\'im and Ketuvim, with instant results and a report of what to review.',
  },
  {
    path: 'torah',
    title: 'Torah – Read, Study & Quiz the Five Books of Moses | The Tanaj Hub',
    description: 'Study the Torah (Chumash): Bereshit, Shemot, Vaikra, Bamidbar and Devarim. Read in Hebrew, English or Spanish, then test yourself with practice questions.',
  },
  {
    path: 'neviim',
    title: 'Nevi\'im – Read, Study & Quiz the Prophets | The Tanaj Hub',
    description: 'Study Nevi\'im (the Prophets) of the Tanach / Tanakh, from Yehoshua to Malachi. Read in Hebrew, English or Spanish, with summaries and practice questions.',
  },
  {
    path: 'ketuvim',
    title: 'Ketuvim – Read, Study & Quiz the Writings | The Tanaj Hub',
    description: 'Study Ketuvim (the Writings) of the Tanach / Tanakh: Tehilim, Mishlei, Iyov, Rut, Ester, Daniel and more. Hebrew, English and Spanish text with quizzes.',
  },
  {
    path: 'search',
    title: 'Search the Tanaj – Search Tanach / Tanakh Text in Hebrew, English & Spanish | The Tanaj Hub',
    description: 'Search the full text of the Tanaj (Tanach / Tanakh) in Hebrew, English or Spanish and jump straight to the pasuk.',
  },
  {
    path: 'notes',
    title: 'Tanaj Study Notes – Take & Organize Tanach Notes | The Tanaj Hub',
    description: 'Take your own study notes on the Tanaj (Tanach / Tanakh), attach pesukim, and keep everything organized by book and chapter.',
  },
  {
    path: 'map',
    title: 'Tanaj Map – Places of the Tanach / Tanakh | The Tanaj Hub',
    description: 'Explore an interactive map of places in the Tanaj (Tanach / Tanakh) and see where the stories happened.',
  },
  {
    path: 'schools',
    title: 'Tanaj for Schools & Teachers – Classes, Assignments & Live Quizzes | The Tanaj Hub',
    description: 'Run Tanaj (Tanach / Tanakh) classes online: assign quizzes, track student results, print worksheets and play live quiz games.',
  },
  {
    path: 'privacy',
    title: 'Privacy Policy | The Tanaj Hub',
    description: 'How The Tanaj Hub handles your data.',
  },
];

const sectionOf = (id) =>
  torahBooks.some((b) => b.id === id) ? 'Torah'
  : neviimRishonimBooks.some((b) => b.id === id) || neviimAjaranimBooks.some((b) => b.id === id) ? 'Nevi\'im'
  : 'Ketuvim';

for (const b of allBooks) {
  pages.push({
    path: `book/${b.id}`,
    title: `${b.label} (${b.sefaria}) – Read, Study & Quiz | Tanaj / Tanach / Tanakh | The Tanaj Hub`,
    description: `Study ${b.label} (${b.sefaria}), ${b.chapters} chapter${b.chapters === 1 ? '' : 's'} of ${sectionOf(b.id)} in the Tanaj (Tanach / Tanakh). Read in Hebrew, English or Spanish, with commentary and practice questions.`,
  });
}

function render(p) {
  const url = `${SITE}/${p.path}`;
  const t = esc(p.title);
  const d = esc(p.description);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
}

for (const p of pages) {
  const dir = new URL(`${p.path}/`, dist);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL('index.html', dir), render(p));
}
console.log(`prerender-meta: wrote ${pages.length} pages`);
