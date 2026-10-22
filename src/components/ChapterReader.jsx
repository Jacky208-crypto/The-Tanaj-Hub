import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getUserNotesForChapter } from '../lib/supabaseClient';
import { noteStrings } from './notes/noteStrings';
import { quotedVerses } from './notes/noteUtils';
import CommentaryPanel from './CommentaryPanel';
import { getMidrashVersesInChapter, useMidrashIndex } from '../lib/midrashim';
import { fetchChapterText, fetchSpanishFromSefaria } from '../lib/verseText';
import styles from './ChapterReader.module.css';
import { EditIcon, HighlighterIcon, QuestionIcon } from './notes/icons';

const LANGUAGES = ['hebrew', 'english', 'spanish'];
const LANG_LABELS = {
  hebrew: 'Hebrew',
  english: 'English',
  spanish: 'Español',
};

// Character offsets of a selection inside the pasuk text, for quoting just
// that part: { start, end } (start in the first pasuk, end in the last), or
// null when the selection takes in the whole of the pesukim.
function selectedPart(range, verse, verseTo) {
  const textOf = (v) => document.querySelector(`[data-verse="${v}"] [data-verse-text]`);
  const first = textOf(verse);
  const last = textOf(verseTo);
  if (!first || !last) return null;
  const offsetIn = (el, node, offset, fallback) => {
    if (!el.contains(node)) return fallback;
    const r = document.createRange();
    r.selectNodeContents(el);
    r.setEnd(node, offset);
    return r.toString().length;
  };
  let start = offsetIn(first, range.startContainer, range.startOffset, 0);
  let end = offsetIn(last, range.endContainer, range.endOffset, last.textContent.length);
  // Leave out spaces picked up at the edges of the selection.
  while (start < first.textContent.length && /\s/.test(first.textContent[start])) start++;
  while (end > 0 && /\s/.test(last.textContent[end - 1])) end--;
  if (start === 0 && end >= last.textContent.length) return null;
  return { start, end };
}

const MIN_PANEL_WIDTH = 420;
const PANEL_WIDTH_KEY = 'tanaj-commentary-width';

export default function ChapterReader({ book, initialChapter = null, initialVerse = null, initialLanguage = null, initialMidrash = null }) {
  const { t, language: uiLanguage } = useLanguage();
  const { user } = useAuth();
  const ns = noteStrings(uiLanguage);
  const midrashIndex = useMidrashIndex();
  const [activeChapter, setActiveChapter] = useState(null);
  const [hebrewVerses, setHebrewVerses] = useState([]);
  const [englishVerses, setEnglishVerses] = useState([]);
  const [spanishVerses, setSpanishVerses] = useState([]);
  const [language, setLanguage] = useState(initialLanguage || 'hebrew');
  const [loading, setLoading] = useState(false);
  const [loadingSpanish, setLoadingSpanish] = useState(false);
  const [error, setError] = useState(null);
  const [spanishError, setSpanishError] = useState(null);

  const spanishCache = useRef({});
  const verseRefs = useRef({});
  const pendingVerseRef = useRef(null);
  const [highlightVerse, setHighlightVerse] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  // A curated midrash to open in the panel once the verse from the URL renders.
  const pendingMidrashRef = useRef(null);
  const [panelStart, setPanelStart] = useState(null);
  const closeCommentary = useCallback(() => setSelectedVerse(null), []);

  // The user's notes on the open chapter: shown in the panel, and any pasuk
  // quoted in them is highlighted in the text.
  const [chapterNotes, setChapterNotes] = useState([]);
  const [notesError, setNotesError] = useState(null);
  // Text selected in the reader → { left, top, verse, verseTo, text } for the popup.
  const [selectionBar, setSelectionBar] = useState(null);
  // "Highlight & quote" / "Question on this" waiting for the panel's editor.
  const [pendingAction, setPendingAction] = useState(null);
  const clearPendingAction = useCallback(() => setPendingAction(null), []);

  // Commentary panel width on desktop: at least the original 420px, and
  // always leaving room for the text. Remembered on this device.
  const [panelWidth, setPanelWidth] = useState(() => {
    try { return Number(localStorage.getItem(PANEL_WIDTH_KEY)) || MIN_PANEL_WIDTH; } catch { return MIN_PANEL_WIDTH; }
  });
  const resizePanel = useCallback((w) => {
    const next = Math.round(Math.max(MIN_PANEL_WIDTH, Math.min(w, window.innerWidth - 360)));
    setPanelWidth(next);
    try { localStorage.setItem(PANEL_WIDTH_KEY, String(next)); } catch { /* storage unavailable */ }
  }, []);

  const loadChapter = useCallback(async (chapterNum) => {
    setActiveChapter(chapterNum);
    setSelectedVerse(null);
    setLoading(true);
    setError(null);
    setSpanishError(null);

    setHebrewVerses([]);
    setEnglishVerses([]);
    setSpanishVerses([]);

    try {
      const text = await fetchChapterText(book.sefaria, chapterNum);
      setEnglishVerses(text.english);
      setHebrewVerses(text.hebrew);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [book]);

  const currentVerses =
    language === 'hebrew'
      ? hebrewVerses
      : language === 'english'
      ? englishVerses
      : spanishVerses;

  const loadSpanish = useCallback(async (chapterNum) => {
    const cacheKey = `${book.id}-${chapterNum}`;

    if (spanishCache.current[cacheKey]) {
      setSpanishVerses(spanishCache.current[cacheKey]);
      return;
    }

    setLoadingSpanish(true);
    setSpanishError(null);

    try {
      const verses = await fetchSpanishFromSefaria(book.sefaria, chapterNum);
      if (!verses.length) throw new Error('No verses returned — chapter may be empty.');
      spanishCache.current[cacheKey] = verses;
      setSpanishVerses(verses);
    } catch (e) {
      setSpanishError(e.message);
    } finally {
      setLoadingSpanish(false);
    }
  }, [book]);

  // When arriving from Tanaj Search (/book/:id?chapter=N&verse=M&lang=L),
  // open that chapter in the searched language and remember the verse so it
  // can be scrolled to once rendered.
  useEffect(() => {
    if (initialChapter) loadChapter(initialChapter);
    pendingVerseRef.current = initialVerse || null;
    pendingMidrashRef.current = initialVerse && initialMidrash ? initialMidrash : null;
    setHighlightVerse(null);

    const lang = initialLanguage || 'hebrew';
    setLanguage(lang);
    if (lang === 'spanish' && initialChapter) loadSpanish(initialChapter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id, initialChapter, initialVerse, initialLanguage, initialMidrash]);

  // Once the active language's verses have actually rendered, scroll to the
  // verse Tanaj Search sent us to and briefly highlight it.
  const activeLoading = language === 'spanish' ? loadingSpanish : loading;
  const activeError = language === 'spanish' ? spanishError : error;
  useEffect(() => {
    if (activeLoading || activeError || currentVerses.length === 0) return;
    const verseNum = pendingVerseRef.current;
    if (!verseNum) return;

    const el = verseRefs.current[verseNum];
    if (!el) return; // verse divs not painted yet — try again next render
    pendingVerseRef.current = null;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightVerse(verseNum);
    if (pendingMidrashRef.current) {
      setPanelStart(`midrash:${pendingMidrashRef.current}`);
      setSelectedVerse(verseNum);
      pendingMidrashRef.current = null;
    }
    const timer = setTimeout(() => setHighlightVerse(null), 2500);
    return () => clearTimeout(timer);
  }, [activeLoading, activeError, currentVerses]);

  useEffect(() => {
    setChapterNotes([]);
    setNotesError(null);
    if (!user || !activeChapter) return;
    let active = true;
    getUserNotesForChapter(book.id, activeChapter)
      .then((rows) => { if (active) setChapterNotes(rows); })
      .catch((e) => { if (active) setNotesError(e.message); });
    return () => { active = false; };
  }, [user, book.id, activeChapter]);

  const highlighted = useMemo(
    () => (activeChapter ? quotedVerses(chapterNotes, book.id, activeChapter) : new Map()),
    [chapterNotes, book.id, activeChapter]
  );
  const notedVerses = useMemo(() => {
    const set = new Set();
    for (const n of chapterNotes) {
      if (!n.verse_from) continue;
      for (let v = n.verse_from; v <= (n.verse_to || n.verse_from); v++) set.add(v);
    }
    return set;
  }, [chapterNotes]);

  // Show the "Highlight & quote" popup when words of a pasuk are selected.
  useEffect(() => {
    if (!user) return;
    let timer;
    const verseOf = (node) => {
      const el = node?.nodeType === 1 ? node : node?.parentElement;
      return Number(el?.closest('[data-verse]')?.getAttribute('data-verse')) || null;
    };
    const onSelection = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const sel = window.getSelection();
        const text = sel?.toString().replace(/\s+/g, ' ').trim();
        const a = sel && verseOf(sel.anchorNode);
        const b = sel && verseOf(sel.focusNode);
        if (!text || !a || !b) { setSelectionBar(null); return; }
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const verse = Math.min(a, b);
        const verseTo = Math.max(a, b);
        setSelectionBar({
          left: rect.left + rect.width / 2,
          top: rect.bottom + 8,
          verse,
          verseTo,
          text,
          range: selectedPart(range, verse, verseTo),
        });
      }, 200);
    };
    // The popup is placed once, so hide it rather than leave it behind on scroll.
    const onScroll = () => setSelectionBar(null);
    document.addEventListener('selectionchange', onSelection);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      document.removeEventListener('selectionchange', onSelection);
      window.removeEventListener('scroll', onScroll);
    };
  }, [user]);

  // A quote covers the whole pasuk unless it was of part of the text — and the
  // part's offsets only make sense in the language it was quoted in.
  function wholeMark(num) {
    return highlighted.get(num)?.find((m) => m.start === null || m.lang !== language);
  }

  // Wrap the quoted parts of a pasuk in colored <mark>s.
  function markParts(text, marks) {
    if (!marks?.length) return text;
    const ranges = marks
      .map((m) => ({ color: m.color, from: Math.max(0, m.start), to: Math.min(text.length, m.end ?? text.length) }))
      .filter((r) => r.to > r.from)
      .sort((x, y) => x.from - y.from);
    const out = [];
    let at = 0;
    for (const r of ranges) {
      const from = Math.max(r.from, at);
      if (r.to <= from) continue;
      if (from > at) out.push(text.slice(at, from));
      out.push(
        <mark key={from} className={`${styles.partMark} ${styles[`mark_${r.color}`]}`}>{text.slice(from, r.to)}</mark>
      );
      at = r.to;
    }
    if (at < text.length) out.push(text.slice(at));
    return out;
  }

  function runSelectionAction(type) {
    if (!selectionBar) return;
    const { verse, verseTo, text, range } = selectionBar;
    setPanelStart(null);
    setSelectedVerse(verse);
    setPendingAction({ type, verse, verseTo, text, range });
    window.getSelection()?.removeAllRanges();
    setSelectionBar(null);
  }

  // Clicking a pasuk opens the panel — but not when the click ended a text selection.
  function openVerse(num) {
    if (window.getSelection()?.toString().trim()) return;
    setPanelStart(null);
    setSelectedVerse(num);
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (lang === 'spanish' && activeChapter !== null) loadSpanish(activeChapter);
  };

  const handleSelectChapter = (num) => {
    loadChapter(num);
    if (language === 'spanish') loadSpanish(num);
  };

  const goBack = () => {
    setActiveChapter(null);
    setSelectedVerse(null);
    setHebrewVerses([]);
    setEnglishVerses([]);
    setSpanishVerses([]);
    setError(null);
    setSpanishError(null);
  };

  const isRTL = language === 'hebrew';
  const midrashVerses = activeChapter ? getMidrashVersesInChapter(midrashIndex, book.sefaria, activeChapter) : new Set();

  return (
    <div
      className={`${styles.container} ${selectedVerse ? styles.withPanel : ''}`}
      style={{ '--panel-width': `${Math.max(MIN_PANEL_WIDTH, panelWidth)}px` }}
    >
      <p className={styles.selectLabel}>{t('chapterReader.selectChapter')}</p>

      <div className={styles.buttonGrid}>
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`chapter-btn ${activeChapter === num ? 'active' : ''}`}
            onClick={() => handleSelectChapter(num)}
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

            {!activeLoading && !activeError && currentVerses.length > 0 && (
              <>
                <h2 className={styles.chapterTitle}>{`פרק ${activeChapter}`}</h2>
                {currentVerses.map((verse, i) => (
                  <div
                    key={i}
                    ref={(el) => { verseRefs.current[i + 1] = el; }}
                    role="button"
                    tabIndex={0}
                    data-verse={i + 1}
                    onClick={() => openVerse(i + 1)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setPanelStart(null);
                        setSelectedVerse(i + 1);
                      }
                    }}
                    className={`${styles.verse} ${styles.verseClickable} ${selectedVerse === i + 1 ? styles.verseSelected : ''} ${highlightVerse === i + 1 ? styles.verseHighlight : ''} ${wholeMark(i + 1) ? `${styles.verseMarked} ${styles[`mark_${wholeMark(i + 1).color}`]}` : ''}`}
                  >
                    <span className={styles.verseNumber}>
                      {i + 1}.
                      {midrashVerses.has(i + 1) && (
                        <span className={styles.midrashMark} title={t('commentary.highlights')}></span>
                      )}
                      {notedVerses.has(i + 1) && (
                        <span className={styles.noteMark} title={ns.myNote}><EditIcon size={12} /></span>
                      )}
                    </span>
                    <span data-verse-text style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                      {wholeMark(i + 1) ? verse : markParts(verse, highlighted.get(i + 1))}
                    </span>
                  </div>
                ))}
              </>
            )}

          </div>
        )}

      {activeChapter && selectedVerse && currentVerses[selectedVerse - 1] && (
        <CommentaryPanel
          book={book}
          chapter={activeChapter}
          verse={selectedVerse}
          verseText={currentVerses[selectedVerse - 1]}
          verseRTL={isRTL}
          readerLanguage={language}
          initialSelected={panelStart}
          onClose={closeCommentary}
          notes={chapterNotes}
          setNotes={setChapterNotes}
          notesError={notesError}
          pendingAction={pendingAction}
          onActionDone={clearPendingAction}
          width={Math.max(MIN_PANEL_WIDTH, panelWidth)}
          onResize={resizePanel}
        />
      )}

      {selectionBar && (
        <div
          className={styles.selectionBar}
          style={{ left: selectionBar.left, top: selectionBar.top }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button onClick={() => runSelectionAction('quote')}><HighlighterIcon /> {ns.highlightQuote}</button>
          <button onClick={() => runSelectionAction('question')}><QuestionIcon /> {ns.questionOnThis}</button>
        </div>
      )}
    </div>
  );
}