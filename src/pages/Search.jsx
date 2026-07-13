import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  searchTanaj,
  normalizeForMatch,
  TRANSLATION_LABELS,
} from '../lib/tanajSearch';
import styles from './Search.module.css';

const LANGUAGES = ['hebrew', 'english', 'spanish'];
const LANG_LABELS = { hebrew: 'Hebrew', english: 'English', spanish: 'Español' };

const PLACEHOLDERS = {
  hebrew: 'חפש מילה…  (e.g. ברית)',
  english: 'Search a word…  (e.g. covenant)',
  spanish: 'Busca una palabra…  (p. ej. pacto)',
};

// Split a verse into pieces, wrapping the tokens that match the query.
function Highlighted({ text, query, lang, matchWhole }) {
  const nq = normalizeForMatch(query, lang);
  if (!nq) return <>{text}</>;

  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\s+$/.test(part)) return part;
        const bare = part.replace(/[^\p{L}\p{N}'’]/gu, '');
        const np = normalizeForMatch(bare, lang);
        const hit = matchWhole ? np === nq : np.length > 0 && np.includes(nq);
        return hit ? (
          <mark key={i} className={styles.mark}>
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </>
  );
}

export default function Search() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState('hebrew');
  const [query, setQuery] = useState('');
  const [matchWhole, setMatchWhole] = useState(false);

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [searchedLang, setSearchedLang] = useState('hebrew');
  const [searchedWhole, setSearchedWhole] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const performSearch = useCallback(async (term, lang, whole) => {
    if (!term) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setProgress('Searching…');
    setError(null);
    setResults([]);
    setTotal(0);
    setSearched(true);
    setSearchedTerm(term);
    setSearchedLang(lang);
    setSearchedWhole(whole);

    try {
      const { total: t, results: r } = await searchTanaj(term, lang, {
        matchWhole: whole,
        signal: controller.signal,
        onProgress: setProgress,
      });
      setResults(r);
      setTotal(t);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const runSearch = useCallback(
    (e) => {
      if (e) e.preventDefault();
      performSearch(query.trim(), language, matchWhole);
    },
    [performSearch, query, language, matchWhole]
  );

  // Toggling "whole word" re-runs the search so non-whole matches drop out.
  const handleWholeToggle = (checked) => {
    setMatchWhole(checked);
    if (searched && searchedTerm) {
      performSearch(searchedTerm, searchedLang, checked);
    }
  };

  const isRTL = searchedLang === 'hebrew';

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tanaj Search</h1>

      <button
        className="nav-btn"
        style={{ display: 'block', margin: '0 auto 24px' }}
        onClick={() => navigate('/')}
      >
        ← Home
      </button>

      <p className={styles.subtext}>
        Search a word and see every verse it appears in across the Tanaj.
      </p>

      <div className={styles.langToggle}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            className={`${styles.langBtn} ${language === lang ? styles.langActive : ''}`}
            onClick={() => setLanguage(lang)}
          >
            {LANG_LABELS[lang]}
          </button>
        ))}
      </div>

      <form className={styles.searchBar} onSubmit={runSearch}>
        <input
          className={styles.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDERS[language]}
          dir={language === 'hebrew' ? 'rtl' : 'ltr'}
          autoFocus
        />
        <button className={styles.searchBtn} type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <label className={styles.wholeWord}>
        <input
          type="checkbox"
          checked={matchWhole}
          onChange={(e) => handleWholeToggle(e.target.checked)}
        />
        Match whole word only
      </label>

      <p className={styles.editionNote}>Searching {TRANSLATION_LABELS[language]}</p>

      {loading && <p className={styles.status}>{progress || 'Searching the Tanaj…'}</p>}

      {error && (
        <div className={styles.error}>
          <p>Something went wrong: {error}</p>
          <button className="chapter-btn" onClick={() => runSearch()}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && searched && (
        <>
          <p className={styles.count}>
            {total === 0
              ? `No matches for “${searchedTerm}”.`
              : `${total} match${total === 1 ? '' : 'es'} for “${searchedTerm}”.`}
          </p>

          <div className={styles.results}>
            {results.map((r) => (
              <button
                key={r.key}
                className={styles.result}
                onClick={() => navigate(`/book/${r.bookId}?chapter=${r.chapter}`)}
              >
                <span className={styles.ref}>
                  {r.bookLabel} {r.chapter}:{r.verse}
                </span>
                <span
                  className={styles.verse}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  <Highlighted
                    text={r.text}
                    query={searchedTerm}
                    lang={searchedLang}
                    matchWhole={searchedWhole}
                  />
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
