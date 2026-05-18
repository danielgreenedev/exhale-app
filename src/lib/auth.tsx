'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthState {
  userId: string | null;
  email: string | null;
  pendingEmail: string | null;
  isAnonymous: boolean;
  ready: boolean;
  refreshUser: () => Promise<void>;
  signOutToAnonymous: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  userId: null,
  email: null,
  pendingEmail: null,
  isAnonymous: true,
  ready: false,
  refreshUser: async () => {},
  signOutToAnonymous: async () => {},
});

function userIsAnonymous(user: User | null): boolean {
  if (!user) return true;
  return Boolean((user as User & { is_anonymous?: boolean }).is_anonymous ?? !user.email);
}

function snapshotUser(user: User | null): Omit<AuthState, 'refreshUser' | 'signOutToAnonymous'> {
  return {
    userId: user?.id ?? null,
    email: user?.email ?? null,
    pendingEmail: (user as User & { new_email?: string | null } | null)?.new_email ?? null,
    isAnonymous: userIsAnonymous(user),
    ready: true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<Omit<AuthState, 'refreshUser' | 'signOutToAnonymous'>>({
    userId: null,
    email: null,
    pendingEmail: null,
    isAnonymous: true,
    ready: false,
  });
  const initRef = useRef(false);

  const setAnonymousUser = useCallback(async () => {
    const { data } = await supabase.auth.signInAnonymously();
    setAuthState(snapshotUser(data.user ?? null));
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) {
      setAuthState(snapshotUser(user));
      return;
    }
    await setAnonymousUser();
  }, [setAnonymousUser]);

  const signOutToAnonymous = useCallback(async () => {
    await supabase.auth.signOut();
    await setAnonymousUser();
  }, [setAnonymousUser]);

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
          setAuthState(snapshotUser(user));
          return;
        }
        await supabase.auth.signOut();
      }
      await setAnonymousUser();
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(snapshotUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [setAnonymousUser]);

  return (
    <AuthContext.Provider value={{ ...authState, refreshUser, signOutToAnonymous }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useUserId() {
  return useContext(AuthContext).userId;
}
