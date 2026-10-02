import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { submitQuestion, getMySubmissions } from '../lib/supabaseClient';
import { getQuizzes, pick } from '../lib/content';
import styles from './Suggest.module.css';

const EMPTY = { quizKey: '', question: '', correct: '', wrong: ['', '', ''], source: '' };

// Database errors (supabase/submissions_setup.sql) → translation keys.
const ERRORS = {
  submission_too_many_pending: 'suggest.errTooMany',
  submission_question_length: 'suggest.errLength',
  submission_option_length: 'suggest.errLength',
  submission_source_length: 'suggest.errLength',
};

// Visitors suggest quiz questions here; an admin reviews them in
// /admin → Suggestions, and the database emails the person once it's published.
export default function Suggest() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();
  const [quizzes, setQuizzes] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [mine, setMine] = useState([]);
  const [mineKey, setMineKey] = useState(0);

  useEffect(() => {
    getQuizzes().then(setQuizzes).catch(() => setQuizzes([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    getMySubmissions()
      .then((rows) => { if (active) setMine(rows); })
      .catch(() => {});
    return () => { active = false; };
  }, [user, mineKey]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const quizKey = form.quizKey || quizzes?.[0]?.key || '';
  const quizLabel = (key) => pick(quizzes?.find((q) => q.key === key), 'label', language) || key;

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const answers = [form.correct, ...form.wrong].map((a) => a.trim());
    if (!form.question.trim() || answers.some((a) => !a)) return setError(t('suggest.errMissing'));
    if (new Set(answers.map((a) => a.toLowerCase())).size < answers.length) return setError(t('suggest.errDuplicateAnswers'));
    setBusy(true);
    try {
      await submitQuestion({
        language,
        quizKey,
        question: form.question.trim(),
        options: answers,
        correctIndex: 0,
        source: form.source.trim(),
      });
      setSent(true);
      setForm({ ...EMPTY, quizKey });
      setMineKey((k) => k + 1);
    } catch (err) {
      const key = Object.keys(ERRORS).find((code) => err.message?.includes(code));
      setError(key ? t(ERRORS[key]) : err.message);
    } finally {
      setBusy(false);
    }
  }

  const header = (
    <>
      <button className={styles.back} onClick={() => navigate('/quiz')}>{t('nav.back')}</button>
      <h1 className={styles.title}>{t('suggest.title')}</h1>
      <p className={styles.intro}>{t('suggest.intro')}</p>
    </>
  );

  if (loading) return <div className={styles.page}><div className={styles.inner}>{header}</div></div>;

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          {header}
          <div className={styles.card}>
            <p style={{ marginTop: 0 }}>{t('suggest.loginPrompt')}</p>
            <button className={styles.submit} onClick={() => navigate('/login', { state: { from: '/suggest' } })}>
              {t('suggest.logIn')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {header}
        <div className={styles.card}>
          {sent ? (
            <>
              <div className={styles.thanks}>{t('suggest.thanks')}</div>
              <button className={styles.secondary} onClick={() => setSent(false)}>{t('suggest.another')}</button>
            </>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.label}>
                {t('suggest.quiz')}
                <select className={styles.input} value={quizKey} onChange={(e) => set('quizKey', e.target.value)}>
                  {quizzes?.map((q) => <option key={q.key} value={q.key}>{pick(q, 'label', language)}</option>)}
                </select>
              </label>
              <label className={styles.label}>
                {t('suggest.question')}
                <textarea
                  className={styles.input}
                  rows={3}
                  maxLength={600}
                  value={form.question}
                  placeholder={t('suggest.questionPlaceholder')}
                  onChange={(e) => set('question', e.target.value)}
                />
              </label>
              <label className={styles.label}>
                {t('suggest.correct')}
                <input
                  className={`${styles.input} ${styles.correct}`}
                  maxLength={200}
                  value={form.correct}
                  onChange={(e) => set('correct', e.target.value)}
                />
              </label>
              <div className={styles.label}>
                {t('suggest.wrong')}
                <div className={styles.wrongList}>
                  {form.wrong.map((w, i) => (
                    <input
                      key={i}
                      className={styles.input}
                      maxLength={200}
                      value={w}
                      placeholder={t('suggest.wrongPlaceholder', { n: i + 1 })}
                      aria-label={t('suggest.wrongPlaceholder', { n: i + 1 })}
                      onChange={(e) => set('wrong', form.wrong.map((x, j) => (j === i ? e.target.value : x)))}
                    />
                  ))}
                </div>
              </div>
              <label className={styles.label}>
                {t('suggest.source')}
                <input
                  className={styles.input}
                  maxLength={200}
                  value={form.source}
                  placeholder={t('suggest.sourcePlaceholder')}
                  onChange={(e) => set('source', e.target.value)}
                />
              </label>
              {error && <div className={styles.error}>{error}</div>}
              <button type="submit" className={styles.submit} disabled={busy || !quizzes?.length}>
                {busy ? t('suggest.sending') : t('suggest.submit')}
              </button>
            </form>
          )}
        </div>

        {mine.length > 0 && (
          <>
            <h2 className={styles.yoursTitle}>{t('suggest.yours')}</h2>
            <ul className={styles.list}>
              {mine.map((s) => (
                <li key={s.id} className={styles.item}>
                  <span className={styles.itemText}>
                    {s.question}
                    <span className={styles.itemMeta}>
                      {quizLabel(s.quiz_key)} · {new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </span>
                  <span className={`${styles.badge} ${styles[`badge_${s.status}`] || ''}`}>
                    {t(`suggest.status.${s.status}`)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
