// Vercel function: POST /api/delete-account  (Authorization: Bearer <user token>)
//
// Permanently deletes the account that owns the token. Deleting a user needs
// the secret key, so it can't happen in the browser. Quiz attempts, notes,
// suggestions and the profile go with it: every table that points at
// auth.users uses `on delete cascade`.
//
// The user id always comes from Supabase's answer about the token, never from
// the request, so nobody can delete someone else's account.
//
// Environment variables: SUPABASE_SECRET_KEY and VITE_SUPABASE_URL, the same
// ones api/translate-commentary.js uses.

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export async function POST(request) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return json({ error: 'Account deletion is not configured.' }, 503);

  const token = (request.headers.get('authorization') || '').match(/^Bearer (.+)$/)?.[1];
  if (!token) return json({ error: 'Not logged in.' }, 401);

  const who = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
  });
  if (!who.ok) return json({ error: 'Not logged in.' }, 401);
  const { id } = await who.json();
  if (!id) return json({ error: 'Not logged in.' }, 401);

  const removed = await fetch(`${url}/auth/v1/admin/users/${id}`, {
    method: 'DELETE',
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!removed.ok) return json({ error: 'Could not delete the account.' }, 502);

  return json({ deleted: true });
}
