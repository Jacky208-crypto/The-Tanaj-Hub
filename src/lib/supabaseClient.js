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

// Redirect the browser to Google via Supabase's OAuth endpoint.
// Supabase sends the user back to `redirect_to` with the token in the URL hash.
export function signInWithGoogle() {
  const redirectTo = window.location.origin;
  const url =
    `${AUTH_URL}/authorize?provider=google` +
    `&redirect_to=${encodeURIComponent(redirectTo)}`;
  window.location.href = url;
}

// Fetch the user record for an access token (used after OAuth redirect).
export async function getUser(accessToken) {
  const res = await fetch(`${AUTH_URL}/user`, {
    headers: { ...headers(), Authorization: `Bearer ${accessToken}` },
  });
  return parse(res);
}

// After returning from Google, the token arrives in the URL hash. Parse it,
// save the session, and clean the hash out of the address bar.
export async function handleOAuthCallback() {
  if (!window.location.hash) return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get('access_token');
  if (!accessToken) return null;

  const session = withExpiry({
    access_token: accessToken,
    refresh_token: params.get('refresh_token'),
    expires_in: Number(params.get('expires_in')) || 3600,
    token_type: params.get('token_type'),
  });
  try {
    session.user = await getUser(accessToken);
  } catch {
    // If the user lookup fails, we still keep the token.
  }
  saveSession(session);
  window.history.replaceState(
    null,
    '',
    window.location.pathname + window.location.search
  );
  return session;
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

// ---- Data layer (PostgREST REST API) ----
// These read/write per-user rows. Row-Level Security on the tables guarantees
// each account only ever sees its own data, so we just attach the user's token.

const REST_URL = `${SUPABASE_URL}/rest/v1`;

// Returns { token, userId } for the signed-in user, or null if not logged in.
function currentAuth() {
  const session = loadSession();
  if (!session?.access_token || !session?.user?.id) return null;
  return { token: session.access_token, userId: session.user.id };
}

function dataHeaders(token, extra = {}) {
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}

// ---- Quiz attempts ----
export async function saveQuizAttempt({ quizLabel, score, total }) {
  const me = currentAuth();
  if (!me) return null; // not logged in — nothing to save
  const res = await fetch(`${REST_URL}/quiz_attempts`, {
    method: 'POST',
    headers: dataHeaders(me.token, { Prefer: 'return=representation' }),
    body: JSON.stringify({
      user_id: me.userId,
      quiz_label: quizLabel,
      score,
      total,
    }),
  });
  const data = await parse(res);
  return Array.isArray(data) ? data[0] : data;
}

export async function getQuizAttempts() {
  const me = currentAuth();
  if (!me) return [];
  const res = await fetch(
    `${REST_URL}/quiz_attempts?user_id=eq.${me.userId}&order=created_at.desc`,
    { headers: dataHeaders(me.token) }
  );
  return (await parse(res)) || [];
}

// ---- Personal notes ----
export async function getUserNotes() {
  const me = currentAuth();
  if (!me) return [];
  const res = await fetch(
    `${REST_URL}/user_notes?user_id=eq.${me.userId}&order=updated_at.desc`,
    { headers: dataHeaders(me.token) }
  );
  return (await parse(res)) || [];
}

export async function createUserNote({ title, body }) {
  const me = currentAuth();
  if (!me) throw new Error('Please log in to save notes.');
  const res = await fetch(`${REST_URL}/user_notes`, {
    method: 'POST',
    headers: dataHeaders(me.token, { Prefer: 'return=representation' }),
    body: JSON.stringify({ user_id: me.userId, title, body }),
  });
  const data = await parse(res);
  return Array.isArray(data) ? data[0] : data;
}

export async function updateUserNote(id, { title, body }) {
  const me = currentAuth();
  if (!me) throw new Error('Please log in to save notes.');
  const res = await fetch(`${REST_URL}/user_notes?id=eq.${id}`, {
    method: 'PATCH',
    headers: dataHeaders(me.token, { Prefer: 'return=representation' }),
    body: JSON.stringify({ title, body, updated_at: new Date().toISOString() }),
  });
  const data = await parse(res);
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteUserNote(id) {
  const me = currentAuth();
  if (!me) throw new Error('Please log in to manage notes.');
  const res = await fetch(`${REST_URL}/user_notes?id=eq.${id}`, {
    method: 'DELETE',
    headers: dataHeaders(me.token),
  });
  if (!res.ok) await parse(res); // throws with a useful message
  return true;
}

// Restore a valid session on app load, refreshing the token if it's expired.
export async function restoreSession() {
  // If we just came back from a Google sign-in, adopt that session first.
  const oauth = await handleOAuthCallback();
  if (oauth) return oauth;

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
