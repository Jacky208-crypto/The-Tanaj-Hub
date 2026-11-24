// Two-level cache for data that rarely changes (Tanach text, Sefaria
// commentary, site content): memory for the current visit, IndexedDB so the
// next visit (or the same perek opened again) needs no network at all.
//
//   cached(key, load, { maxAge })  → value
//
// - A memory hit returns instantly. A hit in IndexedDB younger than `maxAge`
//   is used as is; older entries are still returned right away and refreshed
//   in the background (stale-while-revalidate), so the screen never waits.
// - Requests for the same key that are already in flight share one fetch.
// - Failed loads are never stored; the next call retries.
// - Every storage call is wrapped: private windows or blocked storage just
//   mean "memory only".

const DB_NAME = 'tanaj-cache';
const STORE = 'kv';
const VERSION_PREFIX = 'v1:'; // bump to discard everything stored by older code

export const DAY = 24 * 60 * 60 * 1000;

const memory = new Map(); // key → { value, at }
const inflight = new Map(); // key → Promise

let dbPromise = null;
function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        if (typeof indexedDB === 'undefined') return resolve(null);
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

async function dbGet(key) {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function dbSet(key, record) {
  const db = await openDb();
  if (!db) return;
  try {
    db.transaction(STORE, 'readwrite').objectStore(STORE).put(record, key);
  } catch { /* storage full or unavailable: memory still works */ }
}

async function dbDeletePrefix(prefix) {
  const db = await openDb();
  if (!db) return;
  try {
    const store = db.transaction(STORE, 'readwrite').objectStore(STORE);
    const range = IDBKeyRange.bound(prefix, `${prefix}￿`);
    store.delete(range);
  } catch { /* nothing to clear */ }
}

function refresh(k, load) {
  if (inflight.has(k)) return inflight.get(k);
  const p = Promise.resolve()
    .then(load)
    .then((value) => {
      const record = { value, at: Date.now() };
      memory.set(k, record);
      dbSet(k, record);
      return value;
    })
    .finally(() => inflight.delete(k));
  inflight.set(k, p);
  return p;
}

export async function cached(key, load, { maxAge = DAY } = {}) {
  const k = VERSION_PREFIX + key;

  const hit = memory.get(k);
  if (hit && Date.now() - hit.at < maxAge) return hit.value;
  if (inflight.has(k)) return inflight.get(k);

  const stored = hit || (await dbGet(k));
  if (stored && 'value' in stored) {
    memory.set(k, stored);
    if (Date.now() - stored.at >= maxAge) {
      // Out of date: show what we have now, fetch the fresh copy quietly.
      refresh(k, load).catch(() => {});
    }
    return stored.value;
  }
  // Another caller may have started this load while IndexedDB was answering.
  return inflight.get(k) || refresh(k, load);
}

// The stored value (memory, then IndexedDB) without loading anything, or undefined.
export async function lookup(key, { maxAge = DAY } = {}) {
  const k = VERSION_PREFIX + key;
  const rec = memory.get(k) || (await dbGet(k));
  if (!rec || !('value' in rec) || Date.now() - rec.at >= maxAge) return undefined;
  memory.set(k, rec);
  return rec.value;
}

// Save a value you already have.
export function store(key, value) {
  const k = VERSION_PREFIX + key;
  const record = { value, at: Date.now() };
  memory.set(k, record);
  dbSet(k, record);
}

// The value if it is already in memory (no network, no waiting), else undefined.
export function peek(key) {
  return memory.get(VERSION_PREFIX + key)?.value;
}

// Warm the cache without caring about the result or errors (prefetching).
export function prefetch(key, load, options) {
  if (memory.has(VERSION_PREFIX + key)) return;
  cached(key, load, options).catch(() => {});
}

// Forget everything whose key starts with `prefix`.
export function clearCache(prefix = '') {
  const full = VERSION_PREFIX + prefix;
  for (const k of [...memory.keys()]) if (k.startsWith(full)) memory.delete(k);
  return dbDeletePrefix(full);
}

// Run `fn` when the browser is idle (or soon after, where that isn't supported).
export function whenIdle(fn) {
  if (typeof requestIdleCallback === 'function') requestIdleCallback(fn, { timeout: 3000 });
  else setTimeout(fn, 800);
}
