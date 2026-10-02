import { useNavigate } from 'react-router-dom';
import QuizPlayer from '../components/QuizPlayer';
import ContentStatus from '../components/ContentStatus';
import styles from './Quiz.module.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getQuizAttempts } from '../lib/supabaseClient';
import { getQuizzes, pick } from '../lib/content';
import { QUIZ_CHAPTERS, QUIZ_BOOKS, getBookById, bookLabel, parseChapters } from '../data/books';

// The "All Books" card draws from every quiz, so it has no row of its own.
const ALL_BOOKS = {
  label_en: 'All Books',
  label_es: 'Todos los libros',
  label_he: 'כל הספרים',
  description_en: 'Test your knowledge across the entire Tanach!',
  description_es: '¡Pon a prueba tu conocimiento de todo el Tanaj!',
  description_he: '!בחן את הידע שלך על כל התנ״ך',
};

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [mode, setMode] = useState('menu');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [customQuiz, setCustomQuiz] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [chapterText, setChapterText] = useState({}); // quiz key or "quizKey/bookId" → "1-20, 24-28"
  const [pickedBooks, setPickedBooks] = useState({}); // multi-book quiz key → [book ids] (none = all)
  const [chapterError, setChapterError] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState(null); // quiz cards from Supabase
  const [quizzesError, setQuizzesError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    getQuizzes()
      .then((rows) => { if (active) setQuizzes(rows); })
      .catch((e) => { if (active) setQuizzesError(e.message); });
    return () => { active = false; };
  }, [reloadKey]);
  const quizzesStatus = !quizzes && (
    <ContentStatus
      error={quizzesError}
      onRetry={() => { setQuizzesError(null); setReloadKey((k) => k + 1); }}
    />
  );

  /* Load this account's quiz history whenever we return to the menu.
  useEffect(() => {
    if (!user || mode !== 'menu') return;
    let active = true;
    getQuizAttempts()
      .then((rows) => { if (active) setAttempts(rows); })
      .catch(() => { if (active) setAttempts([]); });
    return () => { active = false; };
  }, [user, mode]);

  // Best score (by percentage) per quiz label.
  const bestByQuiz = attempts.reduce((acc, a) => {
    const pct = a.total ? a.score / a.total : 0;
    const prev = acc[a.quiz_label];
    if (!prev || pct > prev.pct) {
      acc[a.quiz_label] = { score: a.score, total: a.total, pct };
    }
    return acc;
  }, {});
  const bestList = Object.entries(bestByQuiz).sort((a, b) => b[1].pct - a[1].pct);
*/
  // 👉 QUIZ MODE
  if (mode === 'quiz' && customQuiz) {
    return (
      <QuizPlayer
        quiz={customQuiz}
        onBack={() => {
          setMode('menu');
          setCustomQuiz(null);
          setSelectedBooks([]);
          setChapterText({});
          setPickedBooks({});
          setChapterError(null);
        }}
      />
    );
  }

  // 👉 BUILDER MODE
  if (mode === 'builder') {
    // Selected quizzes that can be narrowed down: single-book ones by perakim,
    // multi-book ones by books and then perakim.
    const selectedQuizzes = (quizzes || []).filter((q) => selectedBooks.includes(q.key));
    const chapterQuizzes = selectedQuizzes.filter((q) => QUIZ_CHAPTERS[q.key]);
    const multiBookQuizzes = selectedQuizzes.filter((q) => QUIZ_BOOKS[q.key]);

    const startCustomQuiz = () => {
      if (selectedBooks.length === 0) return;
      // Parses one perakim box; throws the message to show when it's invalid.
      const parse = (field, label, max) => {
        try {
          return parseChapters(chapterText[field]?.trim() ?? '', max);
        } catch (e) {
          throw new Error(t('quiz.chaptersInvalid', { book: label, part: e.message, n: max }));
        }
      };
      const chapters = {};
      const books = {};
      try {
        for (const q of chapterQuizzes) {
          const list = parse(q.key, pick(q, 'label', language), QUIZ_CHAPTERS[q.key]);
          if (list.length) chapters[q.key] = list;
        }
        for (const q of multiBookQuizzes) {
          const picked = pickedBooks[q.key] ?? [];
          if (!picked.length) continue;
          books[q.key] = Object.fromEntries(picked.map((b) =>
            [b, parse(`${q.key}/${b}`, bookLabel(b, language), getBookById(b).chapters)]));
        }
      } catch (e) {
        setChapterError(e.message);
        return;
      }
      setChapterError(null);
      setCustomQuiz({
        label: 'Custom Quiz',
        quizKeys: selectedBooks,
        count: questionCount,
        chapters,
        books,
      });
      setMode('quiz');
    };

    const togglePickedBook = (quizKey, bookId) => {
      setPickedBooks((prev) => {
        const list = prev[quizKey] ?? [];
        return { ...prev, [quizKey]: list.includes(bookId) ? list.filter((b) => b !== bookId) : [...list, bookId] };
      });
      setChapterError(null);
    };

    const chapterRow = (field, label, max) => (
      <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ flex: '0 0 130px' }}>{label}</span>
        <input
          value={chapterText[field] ?? ''}
          placeholder={t('quiz.chaptersAll', { n: max })}
          onChange={(e) => {
            setChapterText((prev) => ({ ...prev, [field]: e.target.value }));
            setChapterError(null);
          }}
          dir="ltr"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '0.45rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            font: 'inherit',
          }}
        />
      </label>
    );

    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{t('quiz.createQuizTitle')}</h1>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
          <button
            onClick={() => setMode('menu')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '5px 10px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--bg-hover)';
              e.target.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--text-secondary)';
            }}
          >
            {t('quiz.back')}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          {t('quiz.selected', { n: selectedBooks.length })}
        </p>

        {quizzesStatus}
        <div className={styles.cardGrid}>
          {quizzes?.map((q) => {
            const key = q.key;
            const selected = selectedBooks.includes(key);
            return (
              <div
                key={key}
                className={styles.card}
                style={{
                  border: selected ? '2px solid var(--accent2)' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedBooks((prev) =>
                    prev.includes(key)
                      ? prev.filter(k => k !== key)
                      : [...prev, key]
                  );
                }}
              >
                <p className={styles.cardTitle}>{pick(q, 'label', language)}</p>
              </div>
            );
          })}
        </div>

        {(chapterQuizzes.length > 0 || multiBookQuizzes.length > 0) && (
          <div style={{ maxWidth: '520px', margin: '30px auto 0' }}>
            <p style={{ textAlign: 'center', marginBottom: '4px' }}>{t('quiz.chaptersTitle')}</p>
            <p style={{ textAlign: 'center', marginTop: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {t('quiz.chaptersHint')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chapterQuizzes.map((q) => chapterRow(q.key, pick(q, 'label', language), QUIZ_CHAPTERS[q.key]))}
            </div>

            {multiBookQuizzes.map((q) => {
              const picked = pickedBooks[q.key] ?? [];
              return (
                <div key={q.key} style={{ marginTop: '20px' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>{pick(q, 'label', language)}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {t('quiz.booksHint')}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {QUIZ_BOOKS[q.key].map((b) => {
                      const on = picked.includes(b);
                      return (
                        <button
                          key={b}
                          type="button"
                          aria-pressed={on}
                          onClick={() => togglePickedBook(q.key, b)}
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            background: on ? 'var(--accent2)' : 'var(--bg-hover)',
                            color: on ? 'var(--accent2-text)' : 'var(--text-primary)',
                            fontWeight: on ? 'bold' : 'normal',
                          }}
                        >
                          {bookLabel(b, language)}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {QUIZ_BOOKS[q.key].filter((b) => picked.includes(b)).map((b) =>
                      chapterRow(`${q.key}/${b}`, bookLabel(b, language), getBookById(b).chapters))}
                  </div>
                </div>
              );
            })}

            {chapterError && (
              <p style={{ color: 'var(--danger)', textAlign: 'center', fontSize: '0.9rem' }}>{chapterError}</p>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ marginBottom: '10px' }}>{t('quiz.numberOfQuestions')}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => setQuestionCount(num)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  background: questionCount === num ? 'var(--accent2)' : 'var(--bg-hover)',
                  color: questionCount === num ? 'var(--accent2-text)' : 'var(--text-primary)',
                  fontWeight: questionCount === num ? 'bold' : 'normal',
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <button
            className={styles.goBtn}
            disabled={selectedBooks.length === 0}
            style={{
              opacity: selectedBooks.length === 0 ? 0.5 : 1,
              cursor: selectedBooks.length === 0 ? 'not-allowed' : 'pointer',
              padding: '0.8rem 2rem',
              fontSize: '1rem',
            }}
            onClick={startCustomQuiz}
          >
            {t('quiz.startQuiz')}
          </button>
        </div>
      </div>
    );
  }

  // 👉 MAIN MENU
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('quiz.title')}</h1>

      <button
        className="nav-btn"
        style={{ display: 'block', margin: '0 auto 30px' }}
        onClick={() => navigate('/')}
      >
        {t('nav.home')}
      </button>

      <button
        className="nav-btn"
        style={{ display: 'block', margin: '20px auto' }}
        onClick={() => setMode('builder')}
      >
        {t('quiz.createCustom')}
      </button>

      <button
        className="nav-btn"
        style={{ display: 'block', margin: '0 auto 30px' }}
        onClick={() => navigate('/suggest')}
      >
        {t('suggest.button')}
      </button>

      {user && attempts.length > 0 && (
        <div
          style={{
            maxWidth: '640px',
            margin: '10px auto 30px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
          }}
        >
          <h2 className={styles.subtitle} style={{ marginTop: 0 }}>{t('quiz.yourProgress')}</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 0 }}>
            {t('quiz.completed', { n: attempts.length })}
          </p>

          <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1rem' }}>{t('quiz.bestScores')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {bestList.map(([label, b]) => (
              <div
                key={label}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.95rem' }}
              >
                <span style={{ color: 'var(--text-primary)' }}>{label}</span>
                <strong style={{ color: 'var(--accent2)' }}>
                  {b.score}/{b.total} ({Math.round(b.pct * 100)}%)
                </strong>
              </div>
            ))}
          </div> 

          <h3 style={{ margin: '1rem 0 0.25rem', fontSize: '1rem' }}>{t('quiz.recentAttempts')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {attempts.slice(0, 5).map((a) => (
              <div
                key={a.id}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
              >
                <span>{a.quiz_label}</span>
                <span>
                  {a.score}/{a.total}
                  {a.created_at && (
                    <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!user && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: '0 auto 24px', maxWidth: '520px' }}>
          <button
            className={styles.linkInline}
            onClick={() => navigate('/login', { state: { mode: 'signup' } })}
            style={{ background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', font: 'inherit', textDecoration: 'underline', padding: 0 }}
          >
            {t('quiz.signUp')}
          </button>{' '}
          {t('quiz.signUpPrompt')}
        </p>
      )}

      <h2 className={styles.subtitle}>{t('quiz.ourQuizzes')}</h2>

      {quizzesStatus}
      {quizzes && (
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>{pick(ALL_BOOKS, 'label', language)}</p>
          <p className={styles.cardText}>{pick(ALL_BOOKS, 'description', language)}</p>
          <button
            className={styles.goBtn}
            onClick={() => {
              setCustomQuiz({ label: ALL_BOOKS.label_en, quizKeys: quizzes.map((q) => q.key) });
              setMode('quiz');
            }}
          >
            {t('quiz.go')}
          </button>
        </div>

        {quizzes.map((q) => {
          return (
            <div key={q.key} className={styles.card}>
              <p className={styles.cardTitle}>{pick(q, 'label', language)}</p>
              <p className={styles.cardText}>{pick(q, 'description', language)}</p>
              <button
                className={styles.goBtn}
                onClick={() => {
                  setCustomQuiz({ label: q.label_en, quizKeys: [q.key] });
                  setMode('quiz');
                }}
              >
                {t('quiz.go')}
              </button>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
