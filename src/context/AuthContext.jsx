import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as auth from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const signOut = useCallback(async () => {
    const session = auth.loadSession();
    await auth.signOut(session?.access_token);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isConfigured: auth.isConfigured,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
