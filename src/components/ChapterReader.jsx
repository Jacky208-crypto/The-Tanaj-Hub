import { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './ChapterReader.module.css';

const LANGUAGES = ['hebrew', 'english', 'spanish'];
const LANG_LABELS = {
  hebrew: 'Hebrew',
  english: 'English',
  spanish: 'Español',
};

function cleanVerse(text, lang) {
  if (!text) return '';

  let cleaned = text
    .replace(/<[^>]+>/g, '')
    .replace(/&[#a-z0-9]+;/gi, ' ')
    .replace(/\{[^\}]+\}/g, '')
    .replace(/^\d+\./, '');

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
  if (lang === 'spanish') {
    cleaned = cleaned
      .replace(/Jehov[áa]/gi, 'Hashem')
      .replace(/JAH/gi, 'Hashem')
      .replace(/Ezequiel/g, 'Yejezkel')
      .replace(/Adán/g, 'Adam')
      .replace(/Eva/g, 'Javá')
      .replace(/Abel/g, 'Hebel')
      .replace(/Enoc/g, 'Janoj')
      .replace(/Enos/g, 'Enosh')
      .replace(/Lamec/g, 'Lemej')
      .replace(/Set/g, 'Shet')
      .replace(/Noé/g, 'Noaj')
      .replace(/Isaac/g, 'Itzjak')
      .replace(/Jacob/g, 'Yaakov')
      .replace(/José/g, 'Yosef')
      .replace(/Gosén/g, 'Goshen')
      .replace(/Moisés/g, 'Moshe')
      .replace(/Josué/g, 'Yehoshua')
      .replace(/Aod/g, 'Ehud')
      .replace(/Isaías/g, 'Yeshayahu')
      .replace(/Jeremías/g, 'Yirmiyahu')
      .replace(/Oseas/g, 'Hoshea')
      .replace(/Abdías/g, 'Ovadiá')
      .replace(/Miqueas/g, 'Mija')
      .replace(/Sofonías/g, 'Tzefania')
      .replace(/Hageo/g, 'Jagai')
      .replace(/Zacarías/g, 'Zejaria')
      .replace(/Malaquías/g, 'Malaji')
      .replace(/Judá/g, 'Yehuda')
      .replace(/Jerusalén/g, 'Yerushalaim')
      .replace(/Baasa/g, 'Baasha')
      .replace(/Acab/g, 'Ajab')
      .replace(/Samaria/g, 'Shomron')
      .replace(/Sansón/g, 'Shimshon')
  }

  return cleaned
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const SEFARIA_TO_BOLLS_ID = {
  'Genesis': 1, 'Exodus': 2, 'Leviticus': 3, 'Numbers': 4, 'Deuteronomy': 5,
  'Joshua': 6, 'Judges': 7, 'Ruth': 8, 'I Samuel': 9, 'II Samuel': 10,
  'I Kings': 11, 'II Kings': 12, 'I Chronicles': 13, 'II Chronicles': 14,
  'Ezra': 15, 'Nehemiah': 16, 'Esther': 17, 'Job': 18, 'Psalms': 19,
  'Proverbs': 20, 'Ecclesiastes': 21, 'Song of Songs': 22, 'Isaiah': 23,
  'Jeremiah': 24, 'Lamentations': 25, 'Ezekiel': 26, 'Daniel': 27,
  'Hosea': 28, 'Joel': 29, 'Amos': 30, 'Obadiah': 31, 'Jonah': 32,
  'Micah': 33, 'Nahum': 34, 'Habakkuk': 35, 'Zephaniah': 36,
  'Haggai': 37, 'Zechariah': 38, 'Malachi': 39,
};

async function fetchSpanishFromBolls(sefariaBookName, chapterNum) {
  const bookId = SEFARIA_TO_BOLLS_ID[sefariaBookName];
  
  // ADD THIS:
  console.log('fetchSpanishFromBolls called with:', sefariaBookName, chapterNum, '→ bookId:', bookId);
  
  if (!bookId) throw new Error(`No Spanish mapping for book: ${sefariaBookName}`);

  const url = `https://bolls.life/get-text/RV1960/${bookId}/${chapterNum}/`;
  console.log('Fetching URL:', url);
  
  const res = await fetch(url);
  console.log('Response status:', res.status);
  
  const verses = await res.json();
  console.log('Verses received:', verses.length, verses[0]);

  if (!verses.length) throw new Error('No verses returned — chapter may be empty.');
  return verses.map(v => cleanVerse(v.text, 'spanish'));
}

export default function ChapterReader({ book, initialChapter = null }) {
  const { t } = useLanguage();
  const [activeChapter, setActiveChapter] = useState(null);
  const [hebrewVerses, setHebrewVerses] = useState([]);
  const [englishVerses, setEnglishVerses] = useState([]);
  const [spanishVerses, setSpanishVerses] = useState([]);
  const [language, setLanguage] = useState('hebrew');
  const [loading, setLoading] = useState(false);
  const [loadingSpanish, setLoadingSpanish] = useState(false);
  const [error, setError] = useState(null);
  const [spanishError, setSpanishError] = useState(null);

  const spanishCache = useRef({});

  const loadChapter = useCallback(async (chapterNum) => {
    setActiveChapter(chapterNum);
    setLoading(true);
    setError(null);
    setSpanishError(null);

    setHebrewVerses([]);
    setEnglishVerses([]);
    setSpanishVerses([]);

    try {
      const res = await fetch(
        `https://www.sefaria.org/api/texts/${encodeURIComponent(book.sefaria)}.${chapterNum}?commentary=0&context=0&pad=0&ven=Tanakh:%20The%20Holy%20Scriptures,%20published%20by%20JPS`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setEnglishVerses(data.text.map(v => cleanVerse(v, 'english')));
      setHebrewVerses(data.he.map(v => cleanVerse(v, 'hebrew')));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [book]);

  // When arriving from Tanaj Search (/book/:id?chapter=N), open that chapter.
  useEffect(() => {
    if (initialChapter) loadChapter(initialChapter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id, initialChapter]);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
  
    if (lang === 'spanish' && activeChapter !== null) {
      const cacheKey = `${book.id}-${activeChapter}`;
  
      if (spanishCache.current[cacheKey]) {
        setSpanishVerses(spanishCache.current[cacheKey]);
        return;
      }
  
      setLoadingSpanish(true);
      setSpanishError(null);
  
      try {
        const verses = await fetchSpanishFromBolls(book.sefaria, activeChapter);
        
        console.log('Spanish verses fetched:', verses.length, verses.slice(0, 2));
        
        if (!verses.length) throw new Error('No verses returned — chapter may be empty.');
        
        spanishCache.current[cacheKey] = verses;
        setSpanishVerses(verses);
      } catch (e) {
        console.error('Spanish fetch error:', e);
        setSpanishError(e.message);
      } finally {
        setLoadingSpanish(false);
      }
    }
  };

  const goBack = () => {
    setActiveChapter(null);
    setHebrewVerses([]);
    setEnglishVerses([]);
    setSpanishVerses([]);
    setError(null);
    setSpanishError(null);
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
      <p className={styles.selectLabel}>{t('chapterReader.selectChapter')}</p>

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
            {t('chapterReader.backToChapters')}
          </button>

          <div className={styles.langToggle}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                className={`${styles.langBtn} ${language === lang ? styles.langActive : ''}`}
                onClick={() => handleLanguageChange(lang)}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          {loading && <p className={styles.loading}>{t('chapterReader.loadingChapter')}</p>}
          {loadingSpanish && <p className={styles.loading}>{t('chapterReader.loadingSpanish')}</p>}

          {error && (
            <div className={styles.error}>
              <p>{t('chapterReader.errorLoading', { chapter: activeChapter })}</p>
              <p>{error}</p>
              <button className="chapter-btn" onClick={() => loadChapter(activeChapter)}>
                {t('chapterReader.tryAgain')}
              </button>
            </div>
          )}

        {language === 'spanish' && spanishError && (
              <div className={styles.error}>
                <p>No se pudo cargar la traducción en español.</p>
                <p style={{ fontSize: '0.85em', opacity: 0.7 }}>{spanishError}</p>
                <button className="chapter-btn" onClick={() => handleLanguageChange('spanish')}>
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !loadingSpanish && !error && currentVerses.length > 0 && (
              <>
                <h2 className={styles.chapterTitle}>{`פרק ${activeChapter}`}</h2>
                {currentVerses.map((verse, i) => (
                  <div key={i} className={styles.verse}>
                    <span className={styles.verseNumber}>{i + 1}.</span>
                    <span style={{ direction: isRTL ? 'rtl' : 'ltr' }}>{verse}</span>
                  </div>
                ))}
              </>
            )}

          </div>
        )}
    </div>
  );
}