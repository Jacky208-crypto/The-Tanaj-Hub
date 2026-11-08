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

// When Supabase's CAPTCHA protection is on, sign-up / log-in / reset calls
// must carry a Cloudflare Turnstile token (see src/components/Captcha.jsx).
function security(captchaToken) {
  return captchaToken ? { gotrue_meta_security: { captcha_token: captchaToken } } : {};
}

// ---- Auth actions ----
export async function signUp(email, password, name, captchaToken) {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: 'POST',
    headers: headers(),
    // `data` is stored as user_metadata on the Supabase user record.
    body: JSON.stringify({ email, password, data: { name }, ...security(captchaToken) }),
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
  const isRecovery = params.get('type') === 'recovery';

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
  // A password-reset link always ends on the new-password form, even if
  // Supabase fell back to the Site URL because the redirect isn't allow-listed.
  if (isRecovery && window.location.pathname !== '/reset-password') {
    window.location.replace('/reset-password');
    return session;
  }
  window.history.replaceState(
    null,
    '',
    window.location.pathname + window.location.search
  );
  return session;
}

export async function signIn(email, password, captchaToken) {
  const res = await fetch(`${AUTH_URL}/token?grant_type=password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password, ...security(captchaToken) }),
  });
  const data = await parse(res);
  const session = withExpiry(data);
  saveSession(session);
  return { session, user: data.user };
}

// Emails a password-reset link. Supabase answers the same way whether or not
// the email has an account, so this can't reveal who is signed up.
export async function requestPasswordReset(email, captchaToken) {
  const redirectTo = `${window.location.origin}/reset-password`;
  const res = await fetch(`${AUTH_URL}/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, ...security(captchaToken) }),
  });
  await parse(res);
}

// A class account: no email or password (supabase/classes_setup.sql). Needs
// "Allow anonymous sign-ins" switched on in Supabase. The nickname goes in
// user_metadata.name so the home page can greet the student.
export async function signInAnonymously(name, captchaToken) {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ data: name ? { name } : {}, ...security(captchaToken) }),
  });
  const data = await parse(res);
  const session = withExpiry(data);
  saveSession(session);
  return session;
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

// The saved session, refreshed first if its token has expired or is about to
// (tokens last an hour, and a tab can stay open much longer than that).
// Returns null if not logged in or the session can no longer be refreshed.
let refreshing = null;
export async function getFreshSession() {
  const session = loadSession();
  if (!session?.access_token) return null;
  const now = Math.floor(Date.now() / 1000);
  if (!session.expires_at || session.expires_at - now > 60) return session;
  if (!session.refresh_token) return null;
  // Several requests may notice at once; share one refresh between them.
  refreshing ??= refresh(session.refresh_token)
    .then((fresh) => {
      const merged = { ...fresh, user: fresh.user ?? session.user };
      saveSession(merged);
      return merged;
    })
    .catch(() => null)
    .finally(() => { refreshing = null; });
  return refreshing;
}

// Returns { token, userId } for the signed-in user, or null if not logged in.
async function currentAuth() {
  const session = await getFreshSession();
  if (!session?.access_token || !session?.user?.id) return null;
  return { token: session.access_token, userId: session.user.id };
}

// Whether the signed-in account is in public.admins (see content_setup.sql).
export async function checkIsAdmin() {
  const me = await currentAuth();
  if (!me) return false;
  const res = await fetch(`${REST_URL}/rpc/is_admin`, {
    method: 'POST',
    headers: dataHeaders(me.token),
    body: '{}',
  });
  return (await parse(res)) === true;
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
// `details` is the per-question report (see QuizReport.jsx) and `mode` is
// 'choice' or 'free'. Both need the columns added in user_data_setup.sql
// section 1b — if they're missing, the score alone is saved instead.
export async function saveQuizAttempt({ quizLabel, score, total, mode, details, assignmentId }) {
  const me = await currentAuth();
  if (!me) return null; // not logged in — nothing to save
  const post = async (body) => {
    const res = await fetch(`${REST_URL}/quiz_attempts`, {
      method: 'POST',
      headers: dataHeaders(me.token, { Prefer: 'return=representation' }),
      body: JSON.stringify({
        user_id: me.userId,
        quiz_label: quizLabel,
        total,
        ...(assignmentId ? { assignment_id: assignmentId } : {}),
        ...body,
      }),
    });
    const data = await parse(res);
    return Array.isArray(data) ? data[0] : data;
  };
  try {
    return await post({ score, mode: mode || 'choice', details: details || null });
  } catch (e) {
    if (!details) throw e;
    // Older database without the report columns (or score still an integer).
    return post({ score: Math.floor(score) });
  }
}

export async function getQuizAttempts() {
  const me = await currentAuth();
  if (!me) return [];
  const res = await fetch(
    `${REST_URL}/quiz_attempts?user_id=eq.${me.userId}&order=created_at.desc`,
    { headers: dataHeaders(me.token) }
  );
  return (await parse(res)) || [];
}

// ---- Personal notes ----
export async function getUserNotes() {
  const me = await currentAuth();
  if (!me) return [];
  const res = await fetch(
    `${REST_URL}/user_notes?user_id=eq.${me.userId}&order=updated_at.desc`,
    { headers: dataHeaders(me.token) }
  );
  return (await parse(res)) || [];
}

// Notes anchored to one chapter (perek notes and pasuk notes), for the reader.
export async function getUserNotesForChapter(bookId, chapter) {
  const me = await currentAuth();
  if (!me) return [];
  const res = await fetch(
    `${REST_URL}/user_notes?user_id=eq.${me.userId}&book_id=eq.${encodeURIComponent(bookId)}&chapter=eq.${chapter}&order=updated_at.desc`,
    { headers: dataHeaders(me.token) }
  );
  return (await parse(res)) || [];
}

// `anchor` is optional: { book_id, chapter, verse_from, verse_to } (see user_data_setup.sql).
export async function createUserNote({ title, body, anchor }) {
  const me = await currentAuth();
  if (!me) throw new Error('Please log in to save notes.');
  const res = await fetch(`${REST_URL}/user_notes`, {
    method: 'POST',
    headers: dataHeaders(me.token, { Prefer: 'return=representation' }),
    body: JSON.stringify({ user_id: me.userId, title, body, ...anchor }),
  });
  const data = await parse(res);
  return Array.isArray(data) ? data[0] : data;
}

// Only the fields passed are changed (e.g. just `body`, or an anchor's verse_to).
export async function updateUserNote(id, fields) {
  const me = await currentAuth();
  if (!me) throw new Error('Please log in to save notes.');
  const res = await fetch(`${REST_URL}/user_notes?id=eq.${id}`, {
    method: 'PATCH',
    headers: dataHeaders(me.token, { Prefer: 'return=representation' }),
    body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }),
  });
  const data = await parse(res);
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteUserNote(id) {
  const me = await currentAuth();
  if (!me) throw new Error('Please log in to manage notes.');
  const res = await fetch(`${REST_URL}/user_notes?id=eq.${id}`, {
    method: 'DELETE',
    headers: dataHeaders(me.token),
  });
  if (!res.ok) await parse(res); // throws with a useful message
  return true;
}

// ---- Suggested quiz questions (see supabase/submissions_setup.sql) ----
// The database fills in the account's email and keeps the suggestion
// "pending" until an admin reviews it.
export async function submitQuestion({ language, quizKey, question, options, correctIndex, source }) {
  const me = await currentAuth();
  if (!me) throw new Error('Please log in to suggest a question.');
  const res = await fetch(`${REST_URL}/question_submissions`, {
    method: 'POST',
    headers: dataHeaders(me.token, { Prefer: 'return=minimal' }),
    body: JSON.stringify({
      user_id: me.userId,
      language,
      quiz_key: quizKey,
      question,
      options,
      correct_index: correctIndex,
      source: source || null,
    }),
  });
  await parse(res);
}

export async function getMySubmissions() {
  const me = await currentAuth();
  if (!me) return [];
  const res = await fetch(
    `${REST_URL}/question_submissions?user_id=eq.${me.userId}&select=id,quiz_key,question,status,created_at&order=created_at.desc`,
    { headers: dataHeaders(me.token) }
  );
  return (await parse(res)) || [];
}

// ---- Classes (supabase/classes_setup.sql) ----
// Row-Level Security decides what each account sees: teachers their own
// classes, students the classes they joined.

async function authed(path, init = {}) {
  const me = await currentAuth();
  if (!me) throw new Error('Not logged in.');
  const res = await fetch(`${REST_URL}/${path}`, {
    ...init,
    headers: dataHeaders(me.token, init.headers),
  });
  return { me, data: await parse(res) };
}

async function rpc(name, args = {}) {
  const { data } = await authed(`rpc/${name}`, { method: 'POST', body: JSON.stringify(args) });
  return data;
}

// Whether the signed-in account is in public.teachers.
export async function checkIsTeacher() {
  const me = await currentAuth();
  if (!me) return false;
  return (await rpc('is_teacher')) === true;
}

export function createClass(name) {
  return rpc('create_class', { class_name: name });
}

// Checked before creating a class account, so a mistyped code doesn't leave an
// unused anonymous account behind. Works logged out. Returns null (unknown)
// if the check isn't installed yet (supabase/classes_setup.sql section 4).
export async function classCodeExists(code) {
  try {
    const res = await fetch(`${REST_URL}/rpc/class_code_exists`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ code }),
    });
    if (!res.ok) return null;
    return (await res.json()) === true;
  } catch {
    return null;
  }
}

// Returns the class id. Throws "No class has that code." for a wrong code.
export function joinClass(code, nickname) {
  return rpc('join_class', { code, nick: nickname });
}

// Student: the classes I'm in, each with its assignments.
export async function getStudentClasses() {
  const me = await currentAuth();
  if (!me) return [];
  const { data } = await authed(
    `class_members?user_id=eq.${me.userId}` +
    '&select=nickname,joined_at,classes(id,name,archived,assignments(id,quiz_key,due_at,created_at,question_count,chapters,book,mode,allow_retries))' +
    '&order=joined_at.desc'
  );
  return (data || []).filter((m) => m.classes && !m.classes.archived);
}

// Student: my attempts on assignments, newest first.
export async function getMyAssignmentAttempts() {
  const me = await currentAuth();
  if (!me) return [];
  const { data } = await authed(
    `quiz_attempts?user_id=eq.${me.userId}&assignment_id=not.is.null` +
    '&select=assignment_id,score,total,created_at&order=created_at.desc'
  );
  return data || [];
}

export async function leaveClass(classId) {
  const me = await currentAuth();
  if (!me) throw new Error('Not logged in.');
  await authed(`class_members?class_id=eq.${classId}&user_id=eq.${me.userId}`, { method: 'DELETE' });
}

// Teacher: my (not archived) classes with their students and assignments.
export async function getTeacherClasses() {
  const me = await currentAuth();
  if (!me) return [];
  const { data } = await authed(
    `classes?teacher_id=eq.${me.userId}&archived=is.false` +
    '&select=id,name,join_code,created_at,class_members(user_id,nickname,joined_at),assignments(id,quiz_key,due_at,created_at,question_count,chapters,book,mode,allow_retries)' +
    '&order=created_at.desc'
  );
  return data || [];
}

export async function addAssignment({ classId, quizKey, dueAt, questionCount, chapters, book, mode, allowRetries }) {
  const { data } = await authed('assignments', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      class_id: classId,
      quiz_key: quizKey,
      due_at: dueAt || null,
      question_count: questionCount || 10,
      chapters: chapters || null,
      book: book || null,
      mode: mode || null,
      allow_retries: allowRetries !== false,
    }),
  });
  return Array.isArray(data) ? data[0] : data;
}

// Teacher: one class with its students, assignments and every attempt made
// on those assignments (Row-Level Security only returns those).
export async function getClassResults(classId) {
  const { data: rows } = await authed(
    `classes?id=eq.${classId}` +
    '&select=id,name,join_code,created_at,class_members(user_id,nickname,joined_at),assignments(id,quiz_key,due_at,created_at,question_count,chapters,book,mode,allow_retries)'
  );
  const cls = rows?.[0];
  if (!cls) return null;
  const ids = (cls.assignments || []).map((a) => a.id);
  let attempts = [];
  if (ids.length) {
    const { data } = await authed(
      `quiz_attempts?assignment_id=in.(${ids.join(',')})` +
      '&select=id,user_id,assignment_id,score,total,mode,details,created_at&order=created_at.asc'
    );
    attempts = data || [];
  }
  return { cls, attempts };
}

export async function deleteAssignment(id) {
  await authed(`assignments?id=eq.${id}`, { method: 'DELETE' });
}

export async function removeStudent(classId, userId) {
  await authed(`class_members?class_id=eq.${classId}&user_id=eq.${userId}`, { method: 'DELETE' });
}

export async function archiveClass(id) {
  await authed(`classes?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ archived: true }) });
}

// ---- Account ----
export async function updatePassword(password) {
  const session = await getFreshSession();
  if (!session?.access_token) throw new Error('Not logged in.');
  const res = await fetch(`${AUTH_URL}/user`, {
    method: 'PUT',
    headers: dataHeaders(session.access_token),
    body: JSON.stringify({ password }),
  });
  return parse(res);
}

// Everything stored for this account, for the "Download my data" button.
export async function exportMyData() {
  const me = await currentAuth();
  if (!me) throw new Error('Not logged in.');
  const read = async (table) => {
    const res = await fetch(`${REST_URL}/${table}?user_id=eq.${me.userId}&select=*`, {
      headers: dataHeaders(me.token),
    });
    return (await parse(res)) || [];
  };
  const [user, quizAttempts, notes, suggestions] = await Promise.all([
    getUser(me.token),
    read('quiz_attempts'),
    read('user_notes'),
    read('question_submissions'),
  ]);
  return {
    account: {
      name: user.user_metadata?.name ?? null,
      email: user.email,
      createdAt: user.created_at,
    },
    quizAttempts,
    notes,
    suggestions,
  };
}

// Permanently deletes the signed-in account (see api/delete-account.js).
export async function deleteAccount() {
  const session = await getFreshSession();
  if (!session?.access_token) throw new Error('Not logged in.');
  const res = await fetch('/api/delete-account', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  await parse(res);
  saveSession(null);
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
