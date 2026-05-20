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
  startGoogleBackupSync: () => Promise<{ error?: string }>;
}

type AuthSnapshot = Omit<
  AuthState,
  'refreshUser' | 'signOutToAnonymous' | 'startGoogleBackupSync'
>;

const AuthContext = createContext<AuthState>({
  userId: null,
  email: null,
  pendingEmail: null,
  isAnonymous: true,
  ready: false,
  refreshUser: async () => {},
  signOutToAnonymous: async () => {},
  startGoogleBackupSync: async () => ({}),
});

function userIsAnonymous(user: User | null): boolean {
  if (!user) return true;
  return Boolean((user as User & { is_anonymous?: boolean }).is_anonymous ?? !user.email);
}

function snapshotUser(user: User | null): AuthSnapshot {
  return {
    userId: user?.id ?? null,
    email: user?.email ?? null,
    pendingEmail: (user as User & { new_email?: string | null } | null)?.new_email ?? null,
    isAnonymous: userIsAnonymous(user),
    ready: true,
  };
}

function reportLocalAuthFallback(context: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[supabase] ${context}; continuing with local-only settings.`, error);
  }
}

function shouldUseLocalOnlyAuth(): boolean {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') return false;
  const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocalHost) return false;

  try {
    return localStorage.getItem('exhale-enable-local-supabase') !== '1';
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthSnapshot>({
    userId: null,
    email: null,
    pendingEmail: null,
    isAnonymous: true,
    ready: false,
  });
  const initRef = useRef(false);

  const setAnonymousUser = useCallback(async () => {
    if (shouldUseLocalOnlyAuth()) {
      setAuthState(snapshotUser(null));
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      setAuthState(snapshotUser(data.user ?? null));
    } catch (error) {
      reportLocalAuthFallback('anonymous sign-in failed', error);
      setAuthState(snapshotUser(null));
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (shouldUseLocalOnlyAuth()) {
      setAuthState(snapshotUser(null));
      return;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setAuthState(snapshotUser(user));
        return;
      }
    } catch (error) {
      reportLocalAuthFallback('user refresh failed', error);
    }
    await setAnonymousUser();
  }, [setAnonymousUser]);

  const signOutToAnonymous = useCallback(async () => {
    if (shouldUseLocalOnlyAuth()) {
      setAuthState(snapshotUser(null));
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      reportLocalAuthFallback('sign-out failed', error);
    }
    await setAnonymousUser();
  }, [setAnonymousUser]);

  const startGoogleBackupSync = useCallback(async (): Promise<{ error?: string }> => {
    if (shouldUseLocalOnlyAuth()) {
      return {
        error: 'Google Backup & Sync needs Supabase auth enabled for local testing. Set exhale-enable-local-supabase to 1 and reload.',
      };
    }

    const redirectTo = typeof window === 'undefined'
      ? undefined
      : `${window.location.origin}/stats?sync=google`;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const credentials = {
        provider: 'google' as const,
        options: { redirectTo },
      };

      const { data, error } = session?.user
        ? await supabase.auth.linkIdentity(credentials)
        : await supabase.auth.signInWithOAuth(credentials);

      if (error) {
        return { error: error.message };
      }

      if (data?.url && typeof window !== 'undefined') {
        window.location.assign(data.url);
      }

      return {};
    } catch (error) {
      reportLocalAuthFallback('google backup sync failed', error);
      return { error: 'Google Backup & Sync could not start. Please try again.' };
    }
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    if (shouldUseLocalOnlyAuth()) {
      setAuthState(snapshotUser(null));
      return;
    }

    let active = true;

    void (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Server-validate the JWT so a token for a deleted user can't silently
          // poison every subsequent write with FK violations.
          const { data: { user }, error } = await supabase.auth.getUser();
          if (user && !error) {
            if (active) setAuthState(snapshotUser(user));
            return;
          }
          await supabase.auth.signOut();
        }
      } catch (error) {
        reportLocalAuthFallback('auth bootstrap failed', error);
      }
      if (active) await setAnonymousUser();
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(snapshotUser(session?.user ?? null));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [setAnonymousUser]);

  return (
    <AuthContext.Provider value={{ ...authState, refreshUser, signOutToAnonymous, startGoogleBackupSync }}>
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
