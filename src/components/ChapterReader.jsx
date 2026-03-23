import { useState, useCallback } from 'react';
import styles from './ChapterReader.module.css';

export default function ChapterReader({ book }) {
  const [activeChapter, setActiveChapter] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadChapter = useCallback(async (chapterNum) => {
    setActiveChapter(chapterNum);
    setLoading(true);
    setError(null);
    setVerses([]);
    try {
      const res = await fetch(
        `https://www.sefaria.org/api/texts/${book.sefaria}.${chapterNum}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setVerses(data.he || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [book]);

  const goBack = () => {
    setActiveChapter(null);
    setVerses([]);
    setError(null);
  };

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

          {loading && <p className={styles.loading}>Loading chapter...</p>}

          {error && (
            <div className={styles.error}>
              <p>Error loading chapter {activeChapter}</p>
              <p>{error}</p>
              <button className="chapter-btn" onClick={() => loadChapter(activeChapter)}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && verses.length > 0 && (
            <>
              <h2 className={styles.chapterTitle}>פרק {activeChapter}</h2>
              {verses.map((verse, i) => (
                <div key={i} className={styles.verse}>
                  <span className={styles.verseNumber}>{i + 1}.</span>
                  <span style={{ direction: 'rtl' }} dangerouslySetInnerHTML={{ __html: verse }} />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
