import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getQuizzes, pick } from '../lib/content';
import { bookLabel } from '../data/books';
import styles from './QuizReport.module.css';

// Points for each result. Free-response answers are graded by the player.
export const RESULT_POINTS = { right: 1, half: 0.5, wrong: 0 };

// 7 → "7", 7.5 → "7.5"
export function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

// The sefer a question belongs to: multi-book quizzes store the book id on
// each question; single-book quizzes are named by their quiz key.
function seferLabel(item, quizzes, language) {
  if (item.book) return bookLabel(item.book, language);
  const quiz = quizzes?.find((q) => q.key === item.quiz_key);
  return quiz ? pick(quiz, 'label', language) : item.quiz_key || '—';
}

const RESULT_ICON = { right: '✅', half: '🟡', wrong: '❌' };

// details: [{ quiz_key, book, chapter, mode, question, answer, correct, result, lang }]
export default function QuizReport({ details, score, total, onClose, closeLabel }) {
  const { t, language } = useLanguage();
  const [quizzes, setQuizzes] = useState(null);

  useEffect(() => {
    let active = true;
    getQuizzes().then((rows) => { if (active) setQuizzes(rows); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const items = details || [];
  const pct = total ? score / total : 0;

  // Points per sefer, in the order they first appear.
  const bySefer = [];
  for (const item of items) {
    const key = item.book || item.quiz_key || '?';
    let row = bySefer.find((r) => r.key === key);
    if (!row) {
      row = { key, item, points: 0, count: 0 };
      bySefer.push(row);
    }
    row.points += RESULT_POINTS[item.result] ?? 0;
    row.count += 1;
  }

  // The sefer with the lowest share of points, if anything was missed there.
  const weakest = [...bySefer]
    .filter((r) => r.points < r.count)
    .sort((a, b) => a.points / a.count - b.points / b.count)[0];

  const message =
    pct >= 0.9 ? t('quizReport.feedbackGreat')
      : pct >= 0.7 ? t('quizReport.feedbackGood')
      : pct >= 0.5 ? t('quizReport.feedbackOk')
      : t('quizReport.feedbackLow');

  const rtl = language === 'hebrew';

  return (
    <div className={styles.report} dir={rtl ? 'rtl' : 'ltr'}>
      <h2 className={styles.title}>{t('quizReport.title')}</h2>
      <p className={styles.bigScore}>
        {formatScore(score)} / {total}
        <span className={styles.pct}> ({Math.round(pct * 100)}%)</span>
      </p>

      <div className={styles.feedback}>
        <p>{message}</p>
        {weakest && bySefer.length > 1 && (
          <p>{t('quizReport.reviewSefer', { sefer: seferLabel(weakest.item, quizzes, language) })}</p>
        )}
      </div>

      {bySefer.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>{t('quizReport.bySefer')}</h3>
          <div className={styles.seferList}>
            {bySefer.map((r) => {
              const share = r.count ? r.points / r.count : 0;
              return (
                <div key={r.key} className={styles.seferRow}>
                  <span className={styles.seferName}>{seferLabel(r.item, quizzes, language)}</span>
                  <span className={styles.bar} aria-hidden="true">
                    <span className={styles.barFill} style={{ width: `${Math.round(share * 100)}%` }} />
                  </span>
                  <strong>{formatScore(r.points)}/{r.count}</strong>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h3 className={styles.sectionTitle}>{t('quizReport.questions')}</h3>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const itemRtl = item.lang === 'hebrew';
          return (
            <li key={i} className={`${styles.item} ${styles[item.result] || ''}`}>
              <div className={styles.itemHead}>
                <span className={styles.icon}>{RESULT_ICON[item.result]}</span>
                <span className={styles.meta}>
                  {seferLabel(item, quizzes, language)}
                  {item.chapter ? ` · ${t('quizReport.perek', { n: item.chapter })}` : ''}
                  {' · '}
                  {item.mode === 'free' ? t('quizReport.modeFree') : t('quizReport.modeChoice')}
                </span>
              </div>
              <p className={styles.question} dir={itemRtl ? 'rtl' : 'ltr'}>{item.question}</p>
              <p className={styles.answer} dir={itemRtl ? 'rtl' : 'ltr'}>
                <span className={styles.label}>{t('quizReport.yourAnswer')}</span> {item.answer || '—'}
              </p>
              {item.result !== 'right' && (
                <p className={styles.answer} dir={itemRtl ? 'rtl' : 'ltr'}>
                  <span className={styles.label}>{t('quizReport.correctAnswer')}</span> {item.correct}
                </p>
              )}
              {item.mode === 'free' && (
                <p className={styles.selfGrade}>
                  {t('quizReport.selfGraded', { grade: t(`quizPlayer.grade.${item.result}`) })}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {onClose && (
        <button className={styles.closeBtn} onClick={onClose}>
          {closeLabel || t('quizReport.close')}
        </button>
      )}
    </div>
  );
}
