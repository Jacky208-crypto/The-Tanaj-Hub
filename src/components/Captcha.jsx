import { useEffect, useRef } from 'react';
import { TURNSTILE_SITE_KEY as SITE_KEY } from '../lib/captcha';

// Cloudflare Turnstile, for Supabase's CAPTCHA protection on sign-up, log-in,
// password reset and class (anonymous) accounts. Renders nothing until
// VITE_TURNSTILE_SITE_KEY is set, so forms keep working before it's set up.

const LANG = { english: 'en', spanish: 'es', hebrew: 'he' };

let scriptPromise = null;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = () => { scriptPromise = null; reject(new Error('Turnstile failed to load')); };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

// Tokens are single-use: change `resetKey` after every submit for a fresh one.
export default function Captcha({ onToken, resetKey, language }) {
  const box = useRef(null);
  const callback = useRef(onToken);
  useEffect(() => { callback.current = onToken; }, [onToken]);

  useEffect(() => {
    if (!SITE_KEY) return undefined;
    let widget = null;
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !box.current) return;
        widget = turnstile.render(box.current, {
          sitekey: SITE_KEY,
          language: LANG[language] || 'auto',
          callback: (token) => callback.current(token),
          'expired-callback': () => callback.current(null),
          'error-callback': () => callback.current(null),
        });
      })
      .catch(() => callback.current(null));
    return () => {
      cancelled = true;
      if (widget !== null) window.turnstile?.remove(widget);
    };
  }, [resetKey, language]);

  if (!SITE_KEY) return null;
  return <div ref={box} style={{ minHeight: 65 }} />;
}
