import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as auth from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // { userId, isAdmin } from the last admin check, so a stale answer for a
  // previous account is never used for the current one.
  const [adminCheck, setAdminCheck] = useState(null);

  // On first load, restore any saved session (refreshing the token if needed).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const session = await auth.restoreSession();
        if (active && session?.user) setUser(session.user);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Ask Supabase whether this account is in public.admins.
  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    auth.checkIsAdmin()
      .catch(() => false)
      .then((isAdmin) => { if (active) setAdminCheck({ userId: user.id, isAdmin }); });
    return () => { active = false; };
  }, [user?.id]);
  const adminChecked = Boolean(user) && adminCheck?.userId === user.id;
  const isAdmin = adminChecked && adminCheck.isAdmin;

  // Same for public.teachers (supabase/classes_setup.sql).
  const [teacherCheck, setTeacherCheck] = useState(null);
  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    auth.checkIsTeacher()
      .catch(() => false)
      .then((isTeacher) => { if (active) setTeacherCheck({ userId: user.id, isTeacher }); });
    return () => { active = false; };
  }, [user?.id]);
  const teacherChecked = Boolean(user) && teacherCheck?.userId === user.id;
  const isTeacher = teacherChecked && teacherCheck.isTeacher;

  const signIn = useCallback(async (email, password) => {
    const { user: u } = await auth.signIn(email, password);
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(async (email, password, name) => {
    const result = await auth.signUp(email, password, name);
    if (result.user && !result.needsConfirmation) setUser(result.user);
    return result;
  }, []);

  const signInWithGoogle = useCallback(() => {
    auth.signInWithGoogle();
  }, []);

  const signOut = useCallback(async () => {
    const session = auth.loadSession();
    await auth.signOut(session?.access_token);
    setUser(null);
  }, []);

  // A no-email class account for joining with a code.
  const signInAnonymously = useCallback(async (name) => {
    const session = await auth.signInAnonymously(name);
    setUser(session.user);
    return session.user;
  }, []);

  const deleteAccount = useCallback(async () => {
    await auth.deleteAccount();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
    adminChecked,
    isTeacher,
    teacherChecked,
    isAnonymous: Boolean(user?.is_anonymous),
    signInAnonymously,
    isConfigured: auth.isConfigured,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    deleteAccount,
    requestPasswordReset: auth.requestPasswordReset,
    updatePassword: auth.updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
