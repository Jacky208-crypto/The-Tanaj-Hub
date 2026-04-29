import { useState, useCallback, useRef } from 'react';
import styles from './ChapterReader.module.css';

const LANGUAGES = ['hebrew', 'english'];
const LANG_LABELS = {
  hebrew: 'Hebrew',
  english: 'English'
};

function cleanVerse(text, lang) {
  if (!text) return '';

  let cleaned = text
    .replace(/<[^>]+>/g, '')           // strip HTML tags
    .replace(/&[#a-z0-9]+;/gi, ' ')   // strip HTML entities
    .replace(/\{[^\}]+\}/g, '')        // strip {footnotes}
    .replace(/^\d+\./, '');            // strip leading verse numbers

  if (lang === 'english') {
      cleaned = cleaned
        .replace(/\bv\.\s*\d+[\d\s;:,cf\.-]*/gi, '')
        .replace(/\b(cf|see|cp)\.\s*[\d\s;:,v\.-]*/gi, '')
        .replace(/[a-z]\b(?=\s*(Cf|See|cf|see))/g, '')
        .replace(/[a-zA-Z](?=Cf\.|See\s)/g, '')
        .replace(/\b(Cf|cf|See|see|Cp|cp)\.\s*[\w\s\d;:,v\.\-ff]*/g, '')
        .replace(/\b[a-z]\s+(Num|Lev|Gen|Deut|Exod|Josh|Judg|Sam|Kgs|Isa|Jer|Ezek|Hos|Amos|Ps|Prov|Job|Dan|Ezra|Neh|Chr)\.\s*[\d:.ff\s,]*/g, '')
        .replace(/\bGreek(\s+and\s+\w+)?\s+(read|reads)[^.]*\./gi, '')
        .replace(/\bSyriac\s+(read|reads)[^.]*\./gi, '')
        .replace(/\bHebrew\s+(read|reads)[^.]*\./gi, '')
        .replace(/\bLXX[^.]*\./gi, '')
        .replace(/\bsome\s+(mss?|manuscripts?)[^.]*\./gi, '')
        .replace(/\blit\.\s*[^,;.]*/gi, '')
        .replace(/\bsee\s+[\d:-]+/gi, '')
        .replace(/\b[Ee]gyptian for[^.]*\./g, '');
    }

  return cleaned
    .replace(/\([^)]*\)/g, '')   // strip (parenthetical notes)
    .replace(/\[[^\]]*\]/g, '')  // strip [bracketed notes]
    .replace(/\s+/g, ' ')
    .trim();
}
async function translateToSpanish(verses) {
  const results = [];

  for (const verse of verses) {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(verse)}&langpair=en|es`
      );
      const data = await res.json();
      results.push(data.responseData?.translatedText || verse);
    } catch {
      results.push(verse);
    }
  }

  return results;
}

export default function ChapterReader({ book }) {
  const [activeChapter, setActiveChapter] = useState(null);
  const [hebrewVerses, setHebrewVerses] = useState([]);
  const [englishVerses, setEnglishVerses] = useState([]);
  const [spanishVerses, setSpanishVerses] = useState([]);
  const [language, setLanguage] = useState('hebrew');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);

  const spanishCache = useRef({});

  const loadChapter = useCallback(async (chapterNum) => {
    setActiveChapter(chapterNum);
    setLoading(true);
    setError(null);

    setHebrewVerses([]);
    setEnglishVerses([]);
    setSpanishVerses([]);

    try {
      const res = await fetch(
        `https://www.sefaria.org/api/texts/${encodeURIComponent(book.sefaria)}.${chapterNum}?commentary=0&context=0&pad=0&ven=Tanakh:%20The%20Holy%20Scriptures,%20published%20by%20JPS`
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // 🔥 CLEAN EVERYTHING HERE
      const cleanEnglish = data.text.map(v => cleanVerse(v, 'english'));
      const cleanHebrew = data.he.map(v => cleanVerse(v, 'hebrew'));

      setHebrewVerses(cleanHebrew);
      setEnglishVerses(cleanEnglish);

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [book]);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);

    if (lang === 'spanish' && activeChapter !== null) {
      const cacheKey = `${book.id}-${activeChapter}`;

      if (spanishCache.current[cacheKey]) {
        setSpanishVerses(spanishCache.current[cacheKey]);
        return;
      }

      if (englishVerses.length > 0) {
        setTranslating(true);

        const translated = await translateToSpanish(englishVerses);

        spanishCache.current[cacheKey] = translated;
        setSpanishVerses(translated);

        setTranslating(false);
      }
    }
  };

  const goBack = () => {
    setActiveChapter(null);
    setHebrewVerses([]);
    setEnglishVerses([]);
    setSpanishVerses([]);
    setError(null);
  };

  const currentVerses =
    language === 'hebrew'
      ? hebrewVerses
      : language === 'english'
      ? englishVerses
      : spanishVerses;

  const isRTL = language === 'hebrew';

  return (
    <div className={styles.container}>
      <p className={styles.selectLabel}>Select a Chapter:</p>

      <div className={styles.buttonGrid}>
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`chapter-btn ${activeChapter === num ? 'active' : ''}`}
            onClick={() => loadChapter(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {activeChapter && (
        <div className={styles.content}>
          <button className="back-btn" onClick={goBack}>
            ← Back to Chapter Selection
          </button>

          {/* Language toggle */}
          <div className={styles.langToggle}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                className={`${styles.langBtn} ${
                  language === lang ? styles.langActive : ''
                }`}
                onClick={() => handleLanguageChange(lang)}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          {loading && <p className={styles.loading}>Loading chapter...</p>}
          {translating && <p className={styles.loading}>Translating to Spanish...</p>}

          {error && (
            <div className={styles.error}>
              <p>Error loading chapter {activeChapter}</p>
              <p>{error}</p>
              <button
                className="chapter-btn"
                onClick={() => loadChapter(activeChapter)}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !translating && !error && currentVerses.length > 0 && (
            <>
              <h2 className={styles.chapterTitle}>
                {`פרק ${activeChapter}`}
              </h2>

              {currentVerses.map((verse, i) => (
                <div key={i} className={styles.verse}>
                  <span className={styles.verseNumber}>{i + 1}.</span>

                  <span style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                    {verse}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}