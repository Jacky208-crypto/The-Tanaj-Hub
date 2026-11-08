// Cloudflare Turnstile site key (public). When it's not set, no CAPTCHA is
// shown and forms work as before — set it before turning CAPTCHA on in Supabase.
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
export const captchaEnabled = Boolean(TURNSTILE_SITE_KEY);
