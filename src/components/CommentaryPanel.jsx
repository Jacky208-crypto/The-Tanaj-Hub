import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchVerseSources, fetchSourceText, fetchSpanishText } from '../lib/sefariaCommentary';
import { getMidrashimForVerse, parseAnchor, localized, useMidrashIndex } from '../lib/midrashim';
import PassukNotes from './notes/PassukNotes';
import { noteStrings } from './notes/noteStrings';
import styles from './CommentaryPanel.module.css';

// Midrash collections shown before "More midrash" (sorted by how many
// passages each has on the verse).
const MIDRASH_PREVIEW = 5;

// Curated midrash entries are selected as "midrash:<id>" so they can share
// the `selected` state with Sefaria commentators.
const MIDRASH_PREFIX = 'midrash:';

// Side panel (bottom sheet on phones) listing the commentators for the
// selected verse. Stays mounted while the user clicks through verses, so an
// open commentator (e.g. Rashi) follows them from verse to verse.
export default function CommentaryPanel({
  book, chapter, verse, verseText, verseRTL, readerLanguage, initialSelected = null, onClose,
  notes, setNotes, notesError, pendingAction, onActionDone,
}) {
  const { t, language } = useLanguage();
  const midrashIndex = useMidrashIndex();
  const bodyRef = useRef(null);
  const [sources, setSources] = useState(null);
  const [sourcesError, setSourcesError] = useState(null);
  const [selected, setSelected] = useState(initialSelected); // commentator title or midrash:<id>
  const [text, setText] = useState(null);
  const [textError, setTextError] = useState(null);
  // Spanish visitors start on the (machine-translated) Spanish.
  const [textLang, setTextLang] = useState(language === 'spanish' ? 'es' : 'en');
  const [esText, setEsText] = useState(null); // { [ref]: [html] }
  const [esError, setEsError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showMoreMidrash, setShowMoreMidrash] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Load the list of commentators for this verse.
  useEffect(() => {
    let cancelled = false;
    setSources(null);
    setSourcesError(null);
    setShowMore(false);
    setShowMoreMidrash(false);
    fetchVerseSources(book.sefaria, chapter, verse)
      .then((s) => { if (!cancelled) setSources(s); })
      .catch((e) => { if (!cancelled) setSourcesError(e.message); });
    return () => { cancelled = true; };
  }, [book.sefaria, chapter, verse, reloadKey]);

  const allGroups = sources
    ? [...sources.featured, ...sources.otherCommentary, ...sources.midrash]
    : [];
  const group = allGroups.find((g) => g.id === selected) || null;

  const midrashim = getMidrashimForVerse(midrashIndex, book.sefaria, chapter, verse);
  const isMidrashSelected = selected?.startsWith(MIDRASH_PREFIX);
  const midrash = isMidrashSelected
    ? midrashim.find((m) => MIDRASH_PREFIX + m.id === selected) || null
    : null;

  // An open midrash that isn't anchored to the newly clicked verse → back to the list.
  // (Wait for the entries to load, or a midrash opened from a link would be dropped.)
  useEffect(() => {
    if (midrashIndex && isMidrashSelected && !midrash) setSelected(null);
  }, [midrashIndex, isMidrashSelected, midrash]);

  // Load the text of the open commentator. If it has nothing on this verse,
  // fall back to the list.
  useEffect(() => {
    if (!sources || !selected || isMidrashSelected) return;
    if (!group) { setSelected(null); return; }
    let cancelled = false;
    setText(null);
    setTextError(null);
    fetchSourceText(group)
      .then((r) => { if (!cancelled) setText(r); })
      .catch((e) => { if (!cancelled) setTextError(e.message); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources, selected]);

  // Spanish is translated only when asked for — it costs DeepL characters
  // the first time anyone opens a commentary in Spanish.
  useEffect(() => {
    if (textLang !== 'es' || !text) return;
    let cancelled = false;
    setEsText(null);
    setEsError(null);
    fetchSpanishText(text.passages)
      .then((r) => { if (!cancelled) setEsText(r); })
      .catch(() => { if (!cancelled) setEsError(t('commentary.translateError')); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textLang, text]);

  const uiRTL = language === 'hebrew';

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const refLabel = `${book.label} ${chapter}:${verse}`;

  const renderRow = (g) => (
    <li key={g.id}>
      <button className={styles.row} onClick={() => setSelected(g.id)}>
        <span className={styles.rowTitle}>{g.title}</span>
        <span className={styles.rowHe}>{g.heTitle}</span>
        {g.refs.length > 1 && <span className={styles.count}>{g.refs.length}</span>}
        <span className={styles.chevron}>›</span>
      </button>
    </li>
  );

  const hasEn = text?.passages.some((p) => p.en.length);
  const hasHe = text?.passages.some((p) => p.he.length);

  return (
    <aside className={styles.panel} aria-label={t('commentary.title')}>
      <header className={styles.header}>
        {group || midrash ? (
          <button className={styles.iconBtn} onClick={() => setSelected(null)} aria-label={t('commentary.back')}>
            ←
          </button>
        ) : (
          <span className={styles.iconSpacer} />
        )}
        <div className={styles.headerTitle}>
          <div className={styles.headerMain}>
            {midrash ? `${t('commentary.highlights')}` : group ? group.title : t('commentary.title')}
          </div>
          <div className={styles.headerSub}>{refLabel}</div>
        </div>
        <button
          className={styles.iconBtn}
          onClick={() => bodyRef.current?.querySelector('#passuk-notes')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label={noteStrings(language).myNote}
          title={noteStrings(language).myNote}
        >
          ✎
        </button>
        <button className={styles.iconBtn} onClick={onClose} aria-label={t('commentary.close')}>
          ✕
        </button>
      </header>

      <div className={styles.body} ref={bodyRef}>
        <blockquote className={styles.verseQuote} dir={verseRTL ? 'rtl' : 'ltr'}>
          {verseText}
        </blockquote>

        {midrash && (
          <article className={styles.midrash} dir={uiRTL ? 'rtl' : 'ltr'}>
            <span className={styles.typeBadge}>{t(`commentary.types.${midrash.type}`)}</span>
            <h2 className={styles.midrashTitle}>{localized(midrash.title, language)}</h2>
            <p className={styles.midrashStory}>{localized(midrash.story, language)}</p>

            {midrash.otherView && (
              <div className={styles.otherView}>
                <div className={styles.otherViewLabel}>{t('commentary.otherView')}</div>
                <p>{localized(midrash.otherView, language)}</p>
              </div>
            )}

            <h3 className={styles.sectionLabel}>{t('commentary.sources')}</h3>
            <ul className={styles.sourceList}>
              {midrash.sources.map((ref) => (
                <li key={ref}>
                  <a
                    href={`https://www.sefaria.org/${encodeURIComponent(ref.replace(/ /g, '_'))}`}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                  >
                    {ref} ↗
                  </a>
                </li>
              ))}
            </ul>

            {midrash.anchors.length > 1 && (
              <>
                <h3 className={styles.sectionLabel}>{t('commentary.alsoIn')}</h3>
                <div className={styles.anchorChips}>
                  {midrash.anchors.map(parseAnchor).filter(Boolean).map((a) => {
                    const current = a.book.id === book.id && a.chapter === chapter && a.verse === verse;
                    if (current) return null;
                    return (
                      <Link
                        key={a.label}
                        className={styles.anchorChip}
                        dir="ltr"
                        to={`/book/${a.book.id}?chapter=${a.chapter}&verse=${a.verse}&lang=${readerLanguage}&midrash=${midrash.id}`}
                      >
                        {a.label}
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </article>
        )}

        {!group && !midrash && midrashim.length > 0 && (
          <section>
            <h3 className={`${styles.sectionLabel} ${styles.highlightLabel}`}>{t('commentary.highlights')}</h3>
            <ul className={styles.list}>
              {midrashim.map((m) => (
                <li key={m.id}>
                  <button className={`${styles.row} ${styles.midrashRow}`} onClick={() => setSelected(MIDRASH_PREFIX + m.id)}>
                    <span className={styles.midrashRowText} dir={uiRTL ? 'rtl' : 'ltr'}>
                      <span className={styles.typeBadgeSmall}>{t(`commentary.types.${m.type}`)}</span>
                      <span className={styles.rowTitle}>{localized(m.title, language)}</span>
                    </span>
                    <span className={styles.chevron}>›</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!group && !midrash && (
          <>
            {!sources && !sourcesError && <p className={styles.status}>{t('commentary.loading')}</p>}
            {sourcesError && (
              <div className={styles.status}>
                <p>{t('commentary.error')}</p>
                <button className={styles.linkBtn} onClick={() => setReloadKey((k) => k + 1)}>
                  {t('chapterReader.tryAgain')}
                </button>
              </div>
            )}
            {sources && allGroups.length === 0 && midrashim.length === 0 && (
              <p className={styles.status}>{t('commentary.none')}</p>
            )}

            {sources && (sources.featured.length > 0 || sources.otherCommentary.length > 0 || !sources.hasRashi) && (
              <section>
                <h3 className={styles.sectionLabel}>{t('commentary.commentary')}</h3>
                <ul className={styles.list}>
                  {!sources.hasRashi && (
                    <li>
                      <div className={`${styles.row} ${styles.rowDisabled}`}>
                        <span className={styles.rowTitle}>Rashi</span>
                        <span className={styles.rowNote}>{t('commentary.noRashi')}</span>
                        <span className={styles.rowHe}>רש"י</span>
                      </div>
                    </li>
                  )}
                  {sources.featured.map(renderRow)}
                </ul>
                {sources.otherCommentary.length > 0 && (
                  <>
                    <button className={styles.moreBtn} onClick={() => setShowMore((v) => !v)}>
                      {showMore ? '▾' : '▸'} {t('commentary.more', { count: sources.otherCommentary.length })}
                    </button>
                    {showMore && <ul className={styles.list}>{sources.otherCommentary.map(renderRow)}</ul>}
                  </>
                )}
              </section>
            )}

            {sources?.midrash.length > 0 && (
              <section>
                <h3 className={styles.sectionLabel}>{t('commentary.midrash')}</h3>
                <ul className={styles.list}>
                  {sources.midrash.slice(0, MIDRASH_PREVIEW).map(renderRow)}
                </ul>
                {sources.midrash.length > MIDRASH_PREVIEW && (
                  <>
                    <button className={styles.moreBtn} onClick={() => setShowMoreMidrash((v) => !v)}>
                      {showMoreMidrash ? '▾' : '▸'}{' '}
                      {t('commentary.moreMidrash', { count: sources.midrash.length - MIDRASH_PREVIEW })}
                    </button>
                    {showMoreMidrash && (
                      <ul className={styles.list}>{sources.midrash.slice(MIDRASH_PREVIEW).map(renderRow)}</ul>
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}

        {group && (
          <>
            {!text && !textError && <p className={styles.status}>{t('commentary.loading')}</p>}
            {textError && <p className={styles.status}>{textError}</p>}

            {text && (
              <>
                {hasEn && (
                  <div className={styles.langToggle}>
                    <button
                      className={`${styles.langBtn} ${textLang === 'es' ? styles.langActive : ''}`}
                      onClick={() => setTextLang('es')}
                    >
                      Español
                    </button>
                    <button
                      className={`${styles.langBtn} ${textLang === 'en' ? styles.langActive : ''}`}
                      onClick={() => setTextLang('en')}
                    >
                      English
                    </button>
                    {hasHe && (
                      <button
                        className={`${styles.langBtn} ${textLang === 'he' ? styles.langActive : ''}`}
                        onClick={() => setTextLang('he')}
                      >
                        עברית
                      </button>
                    )}
                  </div>
                )}

                {textLang === 'es' && hasEn && (
                  esError ? <p className={styles.status}>{esError}</p>
                    : !esText ? <p className={styles.status}>{t('commentary.loading')}</p>
                    : <p className={styles.machineNote}>{t('commentary.machineTranslated')}</p>
                )}

                {!(textLang === 'es' && hasEn && !esText && !esError) && text.passages.map((p) => {
                  const useHe = textLang === 'he' ? p.he.length > 0 : p.en.length === 0;
                  // Spanish falls back to English for a passage that couldn't be translated.
                  const es = !useHe && textLang === 'es' ? esText?.[p.ref] : null;
                  const segments = useHe ? p.he : es || p.en;
                  return (
                    <article key={p.ref} className={styles.passage}>
                      {group.category === 'Midrash' && (
                        <div className={styles.passageRef}>{useHe ? p.heRef : p.ref}</div>
                      )}
                      {segments.map((html, i) => (
                        <p
                          key={i}
                          className={useHe ? styles.segmentHe : styles.segment}
                          dir={useHe ? 'rtl' : 'ltr'}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      ))}
                      <div className={styles.attribution}>
                        {t('commentary.via')}{' '}
                        <a
                          href={`https://www.sefaria.org/${encodeURIComponent(p.ref.replace(/ /g, '_'))}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Sefaria
                        </a>
                        {(useHe ? p.heVersion : p.enVersion) && ` · ${useHe ? p.heVersion : p.enVersion}`}
                        {es && ` · DeepL`}
                      </div>
                    </article>
                  );
                })}

                {text.truncated && (
                  <a
                    className={styles.linkBtn}
                    href={`https://www.sefaria.org/${encodeURIComponent(`${book.sefaria}.${chapter}.${verse}`)}?with=${encodeURIComponent(group.title)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('commentary.seeAll', { count: group.refs.length })}
                  </a>
                )}
              </>
            )}
          </>
        )}

        <PassukNotes
          book={book}
          chapter={chapter}
          verse={verse}
          verseText={verseText}
          readerLanguage={readerLanguage}
          notes={notes}
          setNotes={setNotes}
          notesError={notesError}
          pendingAction={pendingAction}
          onActionDone={onActionDone}
        />
      </div>
    </aside>
  );
}
