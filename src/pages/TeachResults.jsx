import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getClassResults } from '../lib/supabaseClient';
import { getQuizzes, pick } from '../lib/content';
import { formatDue } from '../lib/dates';
import { assignmentSummary } from '../lib/assignments';
import QuizReport, { RESULT_POINTS, formatScore } from '../components/QuizReport';
import styles from './Classes.module.css';

const pctOf = (a) => (a.total ? Number(a.score) / a.total : 0);
const pctText = (p) => `${Math.round(p * 100)}%`;

// One student's attempts on one assignment → best, tries, late.
function summarize(attempts, assignment) {
  if (!attempts?.length) return null;
  const best = attempts.reduce((b, a) => (pctOf(a) > pctOf(b) ? a : b));
  const first = attempts[0]; // attempts arrive oldest first
  const late = Boolean(assignment.due_at) && first.created_at > assignment.due_at;
  return { best, tries: attempts.length, late, pct: pctOf(best) };
}

// The questions most of the class missed (half credit counts as half a miss).
function hardestQuestions(attempts, limit = 5) {
  const byQuestion = new Map();
  for (const attempt of attempts) {
    for (const d of attempt.details || []) {
      const key = d.question_id || d.question;
      const row = byQuestion.get(key) || { question: d.question, correct: d.correct, lang: d.lang, asked: 0, missed: 0 };
      row.asked += 1;
      row.missed += 1 - (RESULT_POINTS[d.result] ?? 0);
      byQuestion.set(key, row);
    }
  }
  return [...byQuestion.values()]
    .filter((q) => q.missed > 0)
    .sort((a, b) => b.missed / b.asked - a.missed / a.asked || b.asked - a.asked)
    .slice(0, limit);
}

function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Teacher dashboard for one class: who finished each assignment, scores,
// the questions the class found hardest, and each student's full report.
export default function TeachResults() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user, loading, isTeacher, teacherChecked } = useAuth();
  const { language, t } = useLanguage();
  const [data, setData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [focus, setFocus] = useState(null); // assignment id for "hardest questions"
  const [open, setOpen] = useState(null);   // { student, assignment, attempt } report shown

  const load = useCallback(() => {
    Promise.all([getClassResults(classId), getQuizzes()])
      .then(([d, q]) => { setData(d); setQuizzes(q || []); setError(''); })
      .catch(() => setError(t('classes.errGeneric')));
  }, [classId, t]);
  useEffect(() => { if (isTeacher) load(); }, [isTeacher, load]);

  const view = useMemo(() => {
    if (!data) return null;
    const { cls, attempts } = data;
    const assignments = [...(cls.assignments || [])].sort((a, b) => a.created_at.localeCompare(b.created_at));
    const members = new Map((cls.class_members || []).map((m) => [m.user_id, m.nickname]));
    // Students who left still appear if they did assigned work.
    const studentIds = new Set([...members.keys(), ...attempts.map((a) => a.user_id)]);
    const students = [...studentIds]
      .map((id) => ({ id, name: members.get(id) ?? null }))
      .sort((a, b) => (a.name === null) - (b.name === null) || (a.name || '').localeCompare(b.name || ''));
    const grid = {};
    for (const a of attempts) ((grid[a.user_id] ??= {})[a.assignment_id] ??= []).push(a);
    return { cls, assignments, students, grid, attempts, memberCount: members.size };
  }, [data]);

  if (!loading && !user) return <Navigate to="/login" state={{ from: `/teach/${classId}` }} replace />;

  const quizLabel = (key) => {
    const q = quizzes.find((x) => x.key === key);
    return q ? pick(q, 'label', language) : key;
  };
  const studentName = (s) => s.name ?? t('classes.leftClass');

  function exportCsv() {
    const { cls, assignments, students, grid } = view;
    const header = [t('classes.csvStudent')];
    for (const a of assignments) {
      const name = `${quizLabel(a.quiz_key)} (${a.due_at
        ? t('classes.due', { date: formatDue(a.due_at, language) })
        : t('classes.assignedOn', { date: formatDue(a.created_at, language) })})`;
      header.push(name, `${name} – ${t('classes.csvTries')}`, `${name} – ${t('classes.csvLate')}`);
    }
    const lines = [header.map(csvCell).join(',')];
    for (const s of students) {
      const row = [studentName(s)];
      for (const a of assignments) {
        const r = summarize(grid[s.id]?.[a.id], a);
        row.push(r ? `${formatScore(Number(r.best.score))}/${r.best.total}` : '', r ? r.tries : 0, r?.late ? t('classes.yes') : '');
      }
      lines.push(row.map(csvCell).join(','));
    }
    // The BOM makes Excel read Hebrew and accents correctly.
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cls.name.replace(/[^\p{L}\p{N}]+/gu, '-')}-results.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Default: the newest assignment anyone has done (else the newest one).
  const focusAssignment = view?.assignments.find((a) => a.id === focus)
    ?? [...(view?.assignments ?? [])].reverse().find((a) => view.attempts.some((x) => x.assignment_id === a.id))
    ?? view?.assignments.at(-1);
  const hardest = focusAssignment ? hardestQuestions(view.attempts.filter((a) => a.assignment_id === focusAssignment.id)) : [];

  return (
    <div className={styles.page} dir={language === 'hebrew' ? 'rtl' : 'ltr'}>
      <div className={`${styles.inner} ${styles.wide}`}>
        <button className={styles.back} onClick={() => navigate('/teach')}>{t('classes.backToClasses')}</button>
        <h1 className={styles.title}>{view ? view.cls.name : t('classes.resultsTitle')}</h1>
        {error && <div className={styles.error}>{error}</div>}
        {teacherChecked && !isTeacher && <p className={styles.empty}>{t('classes.notTeacher')}</p>}
        {data === null && isTeacher && !error && <p className={styles.empty}>{t('content.loading')}</p>}
        {view && (
          <>
            <p className={styles.sub}>
              {t('classes.students', { n: view.memberCount })} · {t('classes.assignmentsCount', { n: view.assignments.length })}
            </p>

            {view.assignments.length === 0 ? (
              <div className={styles.card}><p className={styles.empty}>{t('classes.noResultsYet')}</p></div>
            ) : (
              <>
                {/* Per-assignment summary */}
                <div className={styles.statGrid}>
                  {view.assignments.map((a) => {
                    // Counts and averages cover current students only.
                    const rows = view.students
                      .filter((s) => s.name !== null)
                      .map((s) => summarize(view.grid[s.id]?.[a.id], a))
                      .filter(Boolean);
                    const avg = rows.length ? rows.reduce((sum, r) => sum + r.pct, 0) / rows.length : null;
                    return (
                      <button
                        key={a.id}
                        className={`${styles.stat} ${focusAssignment?.id === a.id ? styles.statOn : ''}`}
                        onClick={() => setFocus(a.id)}
                      >
                        <span className={styles.statTitle}>{quizLabel(a.quiz_key)}</span>
                        <span className={styles.meta}>
                          {a.due_at ? t('classes.due', { date: formatDue(a.due_at, language) }) : assignmentSummary(a, t, language)}
                        </span>
                        <span className={styles.statNumber}>{t('classes.finishedOf', { done: rows.length, n: view.memberCount })}</span>
                        <span className={styles.meta}>
                          {avg === null ? t('classes.noAverage') : t('classes.average', { pct: pctText(avg) })}
                          {rows.some((r) => r.late) && ` · ${t('classes.lateCount', { n: rows.filter((r) => r.late).length })}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Student × assignment grid */}
                <div className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardTitle}>{t('classes.byStudent')}</span>
                    <button className={styles.secondary} onClick={exportCsv}>{t('classes.exportCsv')}</button>
                  </div>
                  {view.students.length === 0 ? (
                    <p className={styles.empty}>{t('classes.noStudents')}</p>
                  ) : (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>{t('classes.csvStudent')}</th>
                            {view.assignments.map((a) => (
                              <th key={a.id}>
                                {quizLabel(a.quiz_key)}
                                <span className={styles.thMeta}>
                                  {a.due_at
                                    ? t('classes.due', { date: formatDue(a.due_at, language) })
                                    : t('classes.assignedOn', { date: formatDue(a.created_at, language) })}
                                </span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {view.students.map((s) => (
                            <tr key={s.id}>
                              <th className={s.name === null ? styles.leftClass : undefined}>{studentName(s)}</th>
                              {view.assignments.map((a) => {
                                const r = summarize(view.grid[s.id]?.[a.id], a);
                                if (!r) return <td key={a.id} className={styles.notStarted}>{t('classes.notStarted')}</td>;
                                const band = r.pct >= 0.8 ? styles.good : r.pct >= 0.5 ? styles.ok : styles.low;
                                return (
                                  <td key={a.id}>
                                    <button
                                      className={`${styles.cell} ${band}`}
                                      onClick={() => setOpen({ student: studentName(s), assignment: a, attempt: r.best })}
                                      title={t('classes.seeReport')}
                                    >
                                      {formatScore(Number(r.best.score))}/{r.best.total}
                                      {r.tries > 1 && <span className={styles.tries}> ×{r.tries}</span>}
                                      {r.late && <span className={styles.lateTag}>{t('classes.late')}</span>}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {open && (
                  <div className={styles.card}>
                    <div className={styles.cardHead}>
                      <span className={styles.cardTitle}>{open.student} · {quizLabel(open.assignment.quiz_key)}</span>
                      <span className={styles.meta}>{formatDue(open.attempt.created_at, language)}</span>
                    </div>
                    <QuizReport
                      details={open.attempt.details}
                      score={Number(open.attempt.score)}
                      total={open.attempt.total}
                      onClose={() => setOpen(null)}
                      closeLabel={t('classes.closeReport')}
                    />
                  </div>
                )}

                {/* Hardest questions for the selected assignment */}
                {focusAssignment && (
                  <div className={styles.card}>
                    <div className={styles.cardHead}>
                      <span className={styles.cardTitle}>{t('classes.hardestTitle')}</span>
                      <span className={styles.meta}>{quizLabel(focusAssignment.quiz_key)}</span>
                    </div>
                    {hardest.length === 0 ? (
                      <p className={styles.empty}>{t('classes.hardestNone')}</p>
                    ) : (
                      <ul className={styles.list}>
                        {hardest.map((q) => (
                          <li key={q.question} className={styles.item}>
                            <div className={styles.itemMain} dir={q.lang === 'hebrew' ? 'rtl' : undefined}>
                              <div>{q.question}</div>
                              <div className={styles.meta}>{t('classes.correctAnswer', { a: q.correct })}</div>
                            </div>
                            <span className={styles.missRate}>
                              {t('classes.missedBy', { n: formatScore(q.missed), asked: q.asked })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
