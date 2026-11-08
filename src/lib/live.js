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
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const remaining = state?.phase === 'question' && state.started_at
    ? Math.max(0, state.seconds - (now + offset - new Date(state.started_at).getTime()) / 1000)
    : null;
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { state, error, remaining, refresh };
}
