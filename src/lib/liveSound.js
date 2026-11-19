// Tiny synthesized sound effects for the live game (no audio files). Off by
// default so a classroom isn't surprised; the host turns it on with the speaker
// button (or M) and the choice is remembered on this device.
const KEY = 'tanaj-live-sound';
let ctx = null;
let lobbyTimer = null;
const listeners = new Set();

export function soundOn() {
  try { return window.localStorage.getItem(KEY) === '1'; } catch { return false; }
}

export function setSoundOn(on) {
  try { window.localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* private mode */ }
  if (!on) stopLobbyLoop();
  listeners.forEach((fn) => fn(on));
}

export function onSoundChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// One note: frequency Hz, starts `at` seconds from now, lasts `len` seconds.
function note(freq, at, len, { type = 'sine', gain = 0.12 } = {}) {
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + len + 0.05);
}

const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5, A4 = 440, D5 = 587.33;

const SOUNDS = {
  join: () => note(880, 0, 0.12, { type: 'triangle', gain: 0.08 }),
  tick: () => note(1200, 0, 0.05, { type: 'square', gain: 0.04 }),
  beep: () => note(660, 0, 0.18, { type: 'triangle' }),
  go: () => { note(C5, 0, 0.12, { type: 'triangle' }); note(G5, 0.1, 0.28, { type: 'triangle' }); },
  reveal: () => { note(A4, 0, 0.12, { type: 'triangle' }); note(D5, 0.12, 0.25, { type: 'triangle' }); },
  correct: () => { note(C5, 0, 0.12); note(E5, 0.1, 0.12); note(G5, 0.2, 0.3); },
  wrong: () => { note(200, 0, 0.25, { type: 'sawtooth', gain: 0.06 }); note(150, 0.2, 0.3, { type: 'sawtooth', gain: 0.06 }); },
  drum: () => note(110, 0, 0.35, { type: 'triangle', gain: 0.2 }),
  finish: () => {
    [C5, E5, G5, C6].forEach((f, i) => note(f, i * 0.14, 0.3, { type: 'triangle' }));
    note(C6, 0.6, 0.8, { type: 'triangle' }); note(G5, 0.6, 0.8, { type: 'triangle' });
  },
};

export function play(name) {
  if (!soundOn()) return;
  try { SOUNDS[name]?.(); } catch { /* audio not available */ }
}

// A soft looping arpeggio under the lobby.
export function startLobbyLoop() {
  if (!soundOn() || lobbyTimer) return;
  const seq = [C5, E5, G5, E5, A4, C5, E5, C5];
  let i = 0;
  lobbyTimer = setInterval(() => {
    if (!soundOn()) return;
    try { note(seq[i % seq.length], 0, 0.35, { type: 'triangle', gain: 0.035 }); } catch { /* ignore */ }
    i += 1;
  }, 420);
}

export function stopLobbyLoop() {
  clearInterval(lobbyTimer);
  lobbyTimer = null;
}
