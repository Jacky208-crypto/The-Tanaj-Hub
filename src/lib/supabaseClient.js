// Lightweight Supabase Auth client using the GoTrue REST API.
// No external dependency required — works as long as the .env keys are set.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

const AUTH_URL = `${SUPABASE_URL}/auth/v1`;
const STORAGE_KEY = 'tanaj.session';

function headers() {
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
  };
}

// ---- Session persistence (localStorage = "saved forever" on this device) ----
export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Compute an absolute expiry timestamp (seconds) from the token response.
function withExpiry(session) {
  if (!session) return null;
  const expiresIn = session.expires_in ?? 3600;
  return { ...session, expires_at: Math.floor(Date.now() / 1000) + expiresIn };
}

async function parse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    const msg =
      body?.error_description ||
      body?.msg ||
      body?.error ||
      body?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return body;
}

// ---- Auth actions ----
export async function signUp(email, password, name) {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: 'POST',
    headers: headers(),
    // `data` is stored as user_metadata on the Supabase user record.
    body: JSON.stringify({ email, password, data: { name } }),
  });
  const data = await parse(res);
  // If email confirmation is OFF, signup returns a session with access_token.
  if (data?.access_token) {
    const session = withExpiry(data);
    saveSession(session);
    return { session, user: data.user, needsConfirmation: false };
  }
  // Email confirmation required — no token yet.
  return { session: null, user: data?.user ?? data, needsConfirmation: true };
}

export async function signIn(email, password) {
  const res = await fetch(`${AUTH_URL}/token?grant_type=password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  const data = await parse(res);
  const session = withExpiry(data);
  saveSession(session);
  return { session, user: data.user };
}

export async function refresh(refreshToken) {
  const res = await fetch(`${AUTH_URL}/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await parse(res);
  const session = withExpiry(data);
  saveSession(session);
  return session;
}

export async function signOut(accessToken) {
  try {
    if (accessToken) {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        headers: { ...headers(), Authorization: `Bearer ${accessToken}` },
      });
    }
  } catch {
    // Ignore network errors on logout — we clear the local session regardless.
  }
  saveSession(null);
}

// Restore a valid session on app load, refreshing the token if it's expired.
export async function restoreSession() {
  const session = loadSession();
  if (!session?.access_token) return null;

  const now = Math.floor(Date.now() / 1000);
  // Refresh if expired or within 60s of expiring.
  if (session.expires_at && session.expires_at - now < 60) {
    if (!session.refresh_token) {
      saveSession(null);
      return null;
    }
    try {
      return await refresh(session.refresh_token);
    } catch {
      saveSession(null);
      return null;
    }
  }
  return session;
}
