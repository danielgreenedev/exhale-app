'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext<string | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Server-validate the JWT so a token for a deleted user can't silently
        // poison every subsequent write with FK violations.
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
          setUserId(user.id);
          return;
        }
        await supabase.auth.signOut();
      }
      const { data } = await supabase.auth.signInAnonymously();
      if (data.user) setUserId(data.user.id);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={userId}>{children}</AuthContext.Provider>;
}

export function useUserId() {
  return useContext(AuthContext);
}
