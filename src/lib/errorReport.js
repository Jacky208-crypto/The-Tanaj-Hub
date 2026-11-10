// Anonymous crash reports to our own database (supabase/classes_setup.sql
// section 18). Sends the page path (no query string, no ids), the error
// message and stack, and the browser — never anything about the person.

const URL_BASE = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_KEY;

const MAX_PER_PAGE_LOAD = 5;
const sent = new Set();

// Noise that says nothing about our code: flaky school wifi, browser
// extensions, and harmless layout notices.
const IGNORE = /ResizeObserver|^Script error|Failed to fetch|NetworkError|Load failed|Network request failed|AbortError|extension:\/\//i;

const cleanPath = () => window.location.pathname
  .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ':id');

export function reportError(error, extra = '') {
  try {
    if (!URL_BASE || !KEY) return;
    const message = String(error?.message || error || '').trim();
    if (!message || IGNORE.test(message) || IGNORE.test(String(error?.stack || ''))) return;
    const key = `${cleanPath()}|${message}`;
    if (sent.has(key) || sent.size >= MAX_PER_PAGE_LOAD) return;
    sent.add(key);
    fetch(`${URL_BASE}/rest/v1/rpc/log_client_error`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', apikey: KEY },
      body: JSON.stringify({
        msg: extra ? `${extra}: ${message}` : message,
        stack_text: error?.stack || null,
        page_path: cleanPath(),
        agent_text: navigator.userAgent,
      }),
    }).catch(() => {});
  } catch {
    // Reporting must never break the page.
  }
}

let started = false;
export function startErrorReporting() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('error', (e) => reportError(e.error || e.message));
  window.addEventListener('unhandledrejection', (e) => reportError(e.reason, 'Unhandled promise'));
}
