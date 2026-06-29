'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { AuthError, Provider, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Distinguish "server says this session is invalid" from "we couldn't reach
// the server." Only the former should drop the user back to anonymous; a
// transient network blip or 5xx should preserve the cached session so synced
// users don't get bounced out by a flaky connection.
function isInvalidSessionError(error: AuthError | null | undefined): boolean {
  if (!error) return false;
  return error.status === 401 || error.status === 403;
}

interface AuthState {
  userId: string | null;
  email: string | null;
  pendingEmail: string | null;
  isAnonymous: boolean;
  ready: boolean;
  refreshUser: () => Promise<void>;
  signOutToAnonymous: () => Promise<void>;
  startOAuthBackupSync: (provider: AuthProviderName) => Promise<{ error?: string }>;
  startGoogleBackupSync: () => Promise<{ error?: string }>;
  startAppleBackupSync: () => Promise<{ error?: string }>;
  startEmailSignIn: (email: string) => Promise<{ error?: string }>;
}

type AuthSnapshot = Omit<
  AuthState,
  'refreshUser' | 'signOutToAnonymous' | 'startOAuthBackupSync' | 'startGoogleBackupSync' | 'startAppleBackupSync' | 'startEmailSignIn'
>;

export type AuthProviderName = 'google' | 'apple';

const PROVIDER_LABELS: Record<AuthProviderName, string> = {
  google: 'Google',
  apple: 'Apple',
};

const AuthContext = createContext<AuthState>({
  userId: null,
  email: null,
  pendingEmail: null,
  isAnonymous: true,
  ready: false,
  refreshUser: async () => {},
  signOutToAnonymous: async () => {},
  startOAuthBackupSync: async () => ({}),
  startGoogleBackupSync: async () => ({}),
  startAppleBackupSync: async () => ({}),
  startEmailSignIn: async () => ({}),
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
      if (error && !isInvalidSessionError(error)) {
        reportLocalAuthFallback('user refresh hit transient error; preserving session', error);
        return;
      }
    } catch (error) {
      reportLocalAuthFallback('user refresh failed; preserving session', error);
      return;
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

  const startOAuthBackupSync = useCallback(async (provider: AuthProviderName): Promise<{ error?: string }> => {
    const providerLabel = PROVIDER_LABELS[provider];

    if (shouldUseLocalOnlyAuth()) {
      return {
        error: `${providerLabel} sign-in needs Supabase auth enabled for local testing. Set exhale-enable-local-supabase to 1 and reload.`,
      };
    }

    const redirectTo = typeof window === 'undefined'
      ? undefined
      : `${window.location.origin}/stats?sync=${provider}`;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const credentials = {
        provider: provider as Provider,
        options: { redirectTo },
      };

      const shouldLinkExistingUser = Boolean(session?.user && !userIsAnonymous(session.user));

      const { data, error } = shouldLinkExistingUser
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
      reportLocalAuthFallback(`${provider} sign-in failed`, error);
      return { error: `${providerLabel} sign-in could not start. Please try again.` };
    }
  }, []);

  const startGoogleBackupSync = useCallback(
    () => startOAuthBackupSync('google'),
    [startOAuthBackupSync]
  );

  const startAppleBackupSync = useCallback(
    () => startOAuthBackupSync('apple'),
    [startOAuthBackupSync]
  );

  const startEmailSignIn = useCallback(async (email: string): Promise<{ error?: string }> => {
    if (shouldUseLocalOnlyAuth()) {
      return {
        error: 'Email sign-in needs Supabase auth enabled for local testing. Set exhale-enable-local-supabase to 1 and reload.',
      };
    }

    const emailRedirectTo = typeof window === 'undefined'
      ? undefined
      : `${window.location.origin}/stats?sync=email`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      reportLocalAuthFallback('email sign-in failed', error);
      return { error: 'Email sign-in could not start. Please try again.' };
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
          // poison every subsequent write with FK violations. Only sign out on
          // a real auth invalidation (401/403); transient failures keep the
          // cached session so a momentary network blip doesn't log users out.
          const { data: { user }, error } = await supabase.auth.getUser();
          if (user && !error) {
            if (active) setAuthState(snapshotUser(user));
            return;
          }
          if (error && !isInvalidSessionError(error)) {
            reportLocalAuthFallback('bootstrap getUser hit transient error; using cached session', error);
            if (active) setAuthState(snapshotUser(session.user));
            return;
          }
          await supabase.auth.signOut();
        }
      } catch (error) {
        reportLocalAuthFallback('auth bootstrap failed', error);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            if (active) setAuthState(snapshotUser(session.user));
            return;
          }
        } catch {
          // fall through to anonymous
        }
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
    <AuthContext.Provider
      value={{
        ...authState,
        refreshUser,
        signOutToAnonymous,
        startOAuthBackupSync,
        startGoogleBackupSync,
        startAppleBackupSync,
        startEmailSignIn,
      }}
    >
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
