import { useCallback, useEffect, useState } from 'react';
import { liveState } from './supabaseClient';

const SUFFIX = { english: 'en', spanish: 'es', hebrew: 'he' };
export const LETTERS = 'ABCDEF';

export function questionText(q, language) {
  return q?.[`question_${SUFFIX[language]}`] || q?.question_en || '';
}

export function optionTexts(q, language) {
  return q?.[`options_${SUFFIX[language]}`] || q?.options_en || [];
}

function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A question as stored in a game: answers shuffled once (the same order in
// every language), correct_index pointing at the right one.
export function snapshotQuestion(q) {
  const order = shuffled(q.options_en.map((_, i) => i));
  const reorder = (opts) => (opts ? order.map((i) => opts[i]) : null);
  return {
    id: q.id,
    question_en: q.question_en,
    question_es: q.question_es || null,
    question_he: q.question_he || null,
    options_en: reorder(q.options_en),
    options_es: reorder(q.options_es),
    options_he: reorder(q.options_he),
    correct_index: order.indexOf(q.correct_index),
  };
}

export function pickQuestions(rows, count) {
  return shuffled(rows).slice(0, count).map(snapshotQuestion);
}

// Polls live_game_state every `intervalMs` and keeps a countdown in step with
// the server's clock. refresh() asks again right away (after a button press).
//   remaining — seconds left to answer (frozen while paused); null outside a question
//   countdown — whole seconds until the first question opens (the 3-2-1), else 0
export function useLiveGame(gameId, intervalMs = 1500) {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0); // server clock − this device's clock
  const [tick, setTick] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!gameId) return undefined;
    let active = true;
    const load = () => liveState(gameId)
      .then((s) => {
        if (!active) return;
        setState(s);
        setOffset(new Date(s.now).getTime() - Date.now());
        setError(null);
      })
      .catch((e) => { if (active) setError(e.message || 'error'); });
    load();
    const id = setInterval(load, intervalMs);
    return () => { active = false; clearInterval(id); };
  }, [gameId, intervalMs, tick]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  let remaining = null;
  let countdown = 0;
  if (state?.phase === 'question' && state.started_at) {
    const clock = state.paused_at ? new Date(state.paused_at).getTime() : now + offset;
    const elapsed = (clock - new Date(state.started_at).getTime()) / 1000;
    remaining = Math.max(0, state.seconds - Math.max(0, elapsed));
    if (elapsed < 0) countdown = Math.ceil(-elapsed);
  }
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { state, error, remaining, countdown, paused: Boolean(state?.paused_at), refresh };
}

// ---- Teams ----
export const TEAM_COLORS = ['#d6213f', '#1a5fb4', '#b45309', '#2a7a2e', '#7a3fb0', '#0f766e'];
export const TEAM_NAMES = {
  english: ['Red', 'Blue', 'Gold', 'Green', 'Purple', 'Teal'],
  spanish: ['Rojo', 'Azul', 'Dorado', 'Verde', 'Morado', 'Turquesa'],
  hebrew: ['אדום', 'כחול', 'זהב', 'ירוק', 'סגול', 'טורקיז'],
};

// ---- Results ----
export function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// A spreadsheet-ready CSV of a live_report: one row per student.
export function reportCsv(report, language) {
  const qs = report.questions || [];
  const rows = [['Nickname', 'Team', 'Score', 'Answered', 'Correct', 'Accuracy %']];
  for (const p of report.players || []) {
    rows.push([p.nickname, TEAM_NAMES[language]?.[p.team] ?? '', p.score, p.answered, p.correct,
      qs.length ? Math.round((p.correct / qs.length) * 100) : 0]);
  }
  rows.push([]);
  rows.push(['Question', 'Answered', 'Correct', 'Correct %']);
  for (const q of qs) {
    rows.push([questionText(q.question, language), q.answered, q.correct,
      q.answered ? Math.round((q.correct / q.answered) * 100) : 0]);
  }
  // BOM so Excel reads Hebrew and accents correctly.
  return `\ufeff${rows.map((r) => r.map(csvCell).join(',')).join('\r\n')}`;
}

export function downloadText(filename, text, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
