'use client';

import { useEffect, useState } from 'react';
import type { ButtonHTMLAttributes, FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { readStats, computeStats, storageAvailable, writeStats } from '@/hooks/useSessionStats';
import type { SessionRecord } from '@/hooks/useSessionStats';
import { PHASE_COLORS, SURFACE_GLOWS } from '@/lib/colors';
import { mergeSyncedSessions, missingLocalSessions } from '@/lib/sessionSync';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { syncUserSettings } from '@/lib/settingsSync';
import {
  clearPendingEmailUpdatesOptIn,
  consumePendingEmailUpdatesOptIn,
  rememberEmailUpdatesOptIn,
  type EmailUpdatesProvider,
} from '@/lib/emailUpdates';
import { PolicyFooter } from '@/components/PolicyFooter';
import { OrbMark } from '@/components/OrbMark';

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

type SyncState = 'idle' | 'codeSent' | 'verifying' | 'synced';
type SubmitMode = 'signin' | 'link';
type BusyAction = EmailUpdatesProvider | 'signout' | null;
type AuthButtonKind = EmailUpdatesProvider;
const SIGN_IN_COPY = 'Sign in to track your history across all devices.';
const PRACTICE_ACCENTS = [
  PHASE_COLORS.inhale.color,
  PHASE_COLORS.hold.color,
  PHASE_COLORS.exhale.color,
] as const;

const AUTH_BUTTON_CLASSES: Record<AuthButtonKind, { base: string; active: string; icon: string }> = {
  google: {
    base: 'border-[#4285f4]/36 text-still-white/70 bg-still-white/[0.02] hover:border-[#4285f4]/90 hover:bg-[#4285f4]/[0.16] hover:text-still-white/95 active:border-[#4285f4]/90 active:bg-[#4285f4]/[0.24]',
    active: 'border-[#4285f4]/90 bg-[#4285f4]/[0.24] text-still-white/95',
    icon: 'border-[#4285f4]/26 bg-still-white/[0.92] group-hover:border-[#4285f4]/45 group-hover:bg-still-white group-active:border-[#4285f4]/65 group-active:bg-still-white',
  },
  apple: {
    base: 'border-still-white/24 text-still-white/72 bg-still-white/[0.035] hover:border-still-white/70 hover:bg-still-white/[0.14] hover:text-still-white/95 active:border-still-white/78 active:bg-still-white/[0.24]',
    active: 'border-still-white/78 bg-still-white/[0.24] text-still-white/95',
    icon: 'border-still-white/24 bg-still-white/[0.06] text-still-white/86 group-hover:bg-still-white/[0.18] group-active:bg-still-white/[0.26]',
  },
  email: {
    base: 'border-emerald-pulse/28 text-emerald-50/72 bg-emerald-pulse/[0.035] hover:border-emerald-pulse/68 hover:bg-emerald-pulse/[0.16] hover:text-emerald-50/95 active:border-emerald-pulse/78 active:bg-emerald-pulse/[0.24]',
    active: 'border-emerald-pulse/78 bg-emerald-pulse/[0.24] text-emerald-50/95',
    icon: 'border-emerald-pulse/24 bg-emerald-pulse/[0.08] text-emerald-100/86 group-hover:bg-emerald-pulse/[0.20] group-active:bg-emerald-pulse/[0.28]',
  },
};

function GoogleMark({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.76-.07-1.49-.2-2.2H12v4.16h5.92a5.06 5.06 0 0 1-2.19 3.32v2.71h3.55c2.08-1.92 3.28-4.75 3.28-7.99z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.71c-.99.66-2.25 1.05-3.73 1.05-2.87 0-5.3-1.94-6.16-4.54H2.18v2.8A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.14a6.61 6.61 0 0 1 0-4.28v-2.8H2.18a11 11 0 0 0 0 9.88l3.66-2.8z"
      />
      <path
        fill="#EA4335"
        d="M12 5.32c1.62 0 3.06.56 4.21 1.65l3.15-3.15A10.57 10.57 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.8C6.7 7.26 9.13 5.32 12 5.32z"
      />
    </svg>
  );
}

function AppleMark({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35-4.88-5.04-4.16-12.69 1.38-12.97 1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </svg>
  );
}

function MailMark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.75" y="5.75" width="16.5" height="12.5" rx="2.6" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}

function AuthButtonIcon({ kind }: { kind: AuthButtonKind }) {
  const iconClassName = 'h-4 w-4';
  if (kind === 'google') return <GoogleMark className={iconClassName} />;
  if (kind === 'apple') return <AppleMark className={iconClassName} />;
  return <MailMark className={iconClassName} />;
}

interface AuthProviderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind: AuthButtonKind;
  pressed?: boolean;
  children: ReactNode;
}

function AuthProviderButton({
  kind,
  pressed = false,
  children,
  className = '',
  ...props
}: AuthProviderButtonProps) {
  const style = AUTH_BUTTON_CLASSES[kind];
  return (
    <button
      {...props}
      className={`group grid w-full min-h-11 grid-cols-[1.75rem_1fr_1.75rem] items-center gap-3 rounded-2xl border px-3 py-3 text-xs tracking-[0.16em] uppercase font-light transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.985] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 sm:tracking-[0.18em] ${style.base} ${pressed ? style.active : ''} ${className}`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-200 ${style.icon}`}
      >
        <AuthButtonIcon kind={kind} />
      </span>
      <span className="min-w-0 text-center leading-relaxed">{children}</span>
      <span aria-hidden="true" />
    </button>
  );
}

export function expectedCodeLength(submitMode: SubmitMode | null): number {
  return submitMode === 'link' ? 8 : 6;
}

function looksLikeExistingEmailError(message?: string): boolean {
  const text = (message ?? '').toLowerCase();
  return (
    text.includes('already registered') ||
    text.includes('already exists') ||
    text.includes('already been registered') ||
    text.includes('email address is already')
  );
}

export function friendlySyncError(message?: string): string {
  const text = (message ?? '').toLowerCase();
  if (text.includes('rate limit') || text.includes('too many') || text.includes('email rate')) {
    return 'Please wait a minute, then try again.';
  }
  if (
    text.includes('token') ||
    text.includes('expired') ||
    text.includes('invalid otp') ||
    text.includes('invalid code')
  ) {
    return 'That code did not work. Check the email and try again.';
  }
  return message || 'Something went quiet on our side. Please try again.';
}

function friendlyOAuthError(message?: string, providerLabel = 'Sign-in'): string {
  const text = (message ?? '').toLowerCase();
  if (text.includes('manual') && text.includes('link')) {
    return `${providerLabel} needs identity linking enabled in Supabase first.`;
  }
  if (looksLikeExistingEmailError(message)) {
    return `That email is attached to an older Exhale sign-in. Contact support if this is your account.`;
  }
  if (text.includes('provider') || text.includes('not enabled')) {
    return `${providerLabel} is not ready yet. Check the Supabase provider setup.`;
  }
  if ((text.includes('already') && text.includes('linked')) || text.includes('identity_already')) {
    return `That account is already connected. Try ${providerLabel} again.`;
  }
  return friendlySyncError(message);
}

function readOAuthReturnError(): string | null {
  if (typeof window === 'undefined') return null;

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return (
    searchParams.get('error_description') ||
    searchParams.get('error') ||
    hashParams.get('error_description') ||
    hashParams.get('error')
  );
}

async function loadSyncedSessions(userId: string): Promise<{ sessions: SessionRecord[]; error?: string }> {
  const { data, error } = await supabase
    .from('breathing_sessions')
    .select('date, duration, cycles, length')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) {
    return {
      sessions: readStats().sessions,
      error: 'Cloud history could not load. Showing sessions saved on this device.',
    };
  }

  const cloudSessions = (data ?? []) as SessionRecord[];
  const localSessions = readStats().sessions;
  const sessionsToSync = missingLocalSessions(localSessions, cloudSessions);

  if (sessionsToSync.length === 0) {
    writeStats({ sessions: cloudSessions });
    return { sessions: cloudSessions };
  }

  const { data: inserted, error: insertError } = await supabase
    .from('breathing_sessions')
    .insert(sessionsToSync.map((session) => ({ user_id: userId, ...session })))
    .select('date, duration, cycles, length');

  if (insertError) {
    return {
      sessions: cloudSessions.length > 0 ? cloudSessions : localSessions,
      error: 'Some sessions are saved on this device but could not sync yet.',
    };
  }

  const mergedSessions = mergeSyncedSessions(cloudSessions, (inserted ?? sessionsToSync) as SessionRecord[]);
  writeStats({ sessions: mergedSessions });

  return { sessions: mergedSessions };
}

export default function StatsPage() {
  const {
    userId,
    email: authEmail,
    pendingEmail,
    isAnonymous,
    ready,
    refreshUser,
    signOutToAnonymous,
    startGoogleBackupSync,
    startAppleBackupSync,
    startEmailSignIn,
  } = useAuth();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [storageOk, setStorageOk] = useState(true);

  const [code, setCode] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailUpdatesOptIn, setEmailUpdatesOptIn] = useState(false);
  const [emailUpdatesMessage, setEmailUpdatesMessage] = useState('');
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [submitMode, setSubmitMode] = useState<SubmitMode | null>(null);
  const [syncedEmail, setSyncedEmail] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const [error, setError] = useState('');
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [showIosInstallTip, setShowIosInstallTip] = useState(false);

  // iOS Safari has no Fullscreen API, so the in-session toggle is hidden on iPhone.
  // Surface a quiet one-time tip on Stats so iOS users know they can get the same
  // immersive feel via Add to Home Screen. Hidden once the app is running in
  // standalone mode (already installed).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isIOS && !isStandalone) setShowIosInstallTip(true);
  }, []);

  useEffect(() => {
    setStorageOk(storageAvailable());

    (async () => {
      if (
        !ready ||
        syncState === 'codeSent' ||
        syncState === 'verifying'
      ) return;

      if (userId && authEmail && !isAnonymous) {
        setSyncedEmail(authEmail);
        setSyncState('synced');
        const [result, settingsResult] = await Promise.all([
          loadSyncedSessions(userId),
          syncUserSettings(userId),
        ]);
        setSessions(result.sessions);
        setError(result.error ?? settingsResult.error ?? '');
      } else {
        setSessions(readStats().sessions);
        if (pendingEmail) {
          setSyncedEmail(pendingEmail);
          setSubmitMode('link');
          setSyncState('codeSent');
        } else {
          setSyncState('idle');
          setSyncedEmail(null);
        }
      }
    })();
  }, [authEmail, isAnonymous, pendingEmail, ready, syncState, userId]);

  useEffect(() => {
    const oauthError = readOAuthReturnError();
    if (!oauthError) return;

    const searchParams = new URLSearchParams(window.location.search);
    const provider = searchParams.get('sync');
    const providerLabel = provider === 'apple'
      ? 'Apple sign-in'
      : provider === 'email'
        ? 'Email sign-in'
        : 'Google sign-in';

    setError(friendlyOAuthError(oauthError, providerLabel));
    window.history.replaceState(null, '', '/stats');
  }, []);

  useEffect(() => {
    if (!ready || !userId || !authEmail || isAnonymous) return;

    let active = true;

    void consumePendingEmailUpdatesOptIn(userId, authEmail).then(({ recorded, error: optInError }) => {
      if (!active) return;
      if (recorded) {
        setEmailUpdatesMessage('Email Updates enabled.');
        return;
      }
      if (optInError && optInError !== 'Email updates will be enabled after sign-in finishes.') {
        setEmailUpdatesMessage('Email Updates could not be enabled yet. Please try again later.');
      }
    });

    return () => {
      active = false;
    };
  }, [authEmail, isAnonymous, ready, userId]);

  useEffect(() => {
    if (!ready || !userId || isAnonymous) {
      setConnectedProviders([]);
      return;
    }

    let active = true;

    void supabase.auth.getUserIdentities().then(({ data, error: identitiesError }) => {
      if (!active || identitiesError) return;
      setConnectedProviders(data.identities.map((identity) => identity.provider));
    });

    return () => {
      active = false;
    };
  }, [isAnonymous, ready, userId]);

  const submitCode = async (codeValue: string) => {
    if (codeValue.length !== expectedCodeLength(submitMode) || !syncedEmail || !submitMode) return;
    setSyncState('verifying');
    setError('');

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: syncedEmail,
      token: codeValue,
      type: submitMode === 'signin' ? 'email' : 'email_change',
    });

    if (verifyError) {
      setError(friendlySyncError(verifyError.message));
      setSyncState('codeSent');
      return;
    }

    let signedInUserId = data.user?.id ?? data.session?.user.id;
    await refreshUser();

    if (!signedInUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      signedInUserId = user?.id;
    }

    if (signedInUserId) {
      const [sessionsResult, settingsResult] = await Promise.all([
        loadSyncedSessions(signedInUserId),
        syncUserSettings(signedInUserId),
      ]);
      setSessions(sessionsResult.sessions);
      setError(sessionsResult.error ?? settingsResult.error ?? '');
    }

    setSyncState('synced');
  };

  const handleCodeChange = (value: string) => {
    const codeLength = expectedCodeLength(submitMode);
    const cleaned = value.replace(/\D/g, '').slice(0, codeLength);
    setCode(cleaned);
    if (cleaned.length === codeLength) {
      void submitCode(cleaned);
    }
  };

  const handleVerifyClick = () => {
    if (code.length === expectedCodeLength(submitMode)) void submitCode(code);
  };

  const prepareEmailUpdatesOptIn = (provider: EmailUpdatesProvider): boolean => {
    setEmailUpdatesMessage('');

    if (!emailUpdatesOptIn) {
      clearPendingEmailUpdatesOptIn();
      return true;
    }

    const remembered = rememberEmailUpdatesOptIn(provider);
    if (!remembered) {
      setError('Email Updates could not be saved in this browser. Leave it unchecked, or enable storage and try again.');
      return false;
    }

    return true;
  };

  const handleProviderSync = async (provider: 'google' | 'apple') => {
    if (!prepareEmailUpdatesOptIn(provider)) return;

    setBusyAction(provider);
    setError('');
    const startProvider = provider === 'google' ? startGoogleBackupSync : startAppleBackupSync;
    const { error: providerError } = await startProvider();
    if (providerError) {
      clearPendingEmailUpdatesOptIn();
      setError(friendlyOAuthError(providerError, provider === 'google' ? 'Google sign-in' : 'Apple sign-in'));
      setBusyAction(null);
      return;
    }
    setBusyAction(null);
  };

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailInput.trim();
    if (!email) {
      setError('Enter your email address to send a sign-in link.');
      return;
    }
    if (!prepareEmailUpdatesOptIn('email')) return;

    setBusyAction('email');
    setError('');
    const { error: emailError } = await startEmailSignIn(email);
    if (emailError) {
      clearPendingEmailUpdatesOptIn();
      setError(friendlySyncError(emailError));
      setBusyAction(null);
      return;
    }

    setSyncedEmail(email);
    setSubmitMode('signin');
    setCode('');
    setSyncState('codeSent');
    setBusyAction(null);
  };

  const handleStopSync = async () => {
    setBusyAction('signout');
    setError('');
    setEmailUpdatesMessage('');
    await signOutToAnonymous();
    setSyncState('idle');
    setSyncedEmail(null);
    setCode('');
    setSessions(readStats().sessions);
    setBusyAction(null);
  };

  const { totalSessions, totalMinutes, totalDays } = computeStats(sessions);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  const statRows = [
    { label: 'Sessions', value: String(totalSessions), color: PHASE_COLORS.inhale.color },
    { label: 'Total time', value: timeLabel, color: PHASE_COLORS.hold.color },
    { label: 'Days practiced', value: String(totalDays), color: PHASE_COLORS.exhale.color },
  ];

  return (
    <main className="min-h-screen bg-forest-night flex flex-col items-center px-4 py-10 sm:px-6 sm:py-14 text-still-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: SURFACE_GLOWS.stats }}
      />

      <div className="relative z-10 flex w-full max-w-[18rem] flex-col items-center gap-10 sm:max-w-sm">
        <div className="flex flex-col items-center gap-5">
          <OrbMark size="stats" ring breathe />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-still-white/88">
              Practice
            </h1>
            <p className="text-still-white/55 text-xs tracking-[0.04em] font-light">Your breathing history</p>
          </div>
        </div>

        {!storageOk && (
          <p className="text-amber-100/72 text-xs font-light text-center leading-relaxed -mb-4">
            Session history requires storage access to save.
          </p>
        )}

        {totalSessions === 0 ? (
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <p className="text-still-white/62 text-sm font-light leading-relaxed">
              Your first completed session will appear here.
            </p>
            <Link
              href="/"
              className="w-full min-h-11 py-3 rounded-2xl border border-emerald-pulse/35 bg-emerald-pulse/10 text-emerald-100/95 text-xs tracking-[0.18em] uppercase font-light hover:border-emerald-pulse/55 hover:bg-emerald-pulse/16 transition-all duration-300 flex items-center justify-center"
            >
              Begin a session
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-0 w-full">
              {statRows.map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex justify-between items-baseline py-5 border-b border-still-white/10"
                >
                  <span className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-light text-still-white/58">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color, opacity: 0.72 }}
                    />
                    <span>{label}</span>
                  </span>
                  <span className="text-2xl font-extralight text-still-white/86">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-0 w-full">
              <p className="flex items-center gap-2 text-still-white/52 text-xs tracking-[0.15em] uppercase font-light mb-4">
                <span className="flex items-center gap-1" aria-hidden="true">
                  {PRACTICE_ACCENTS.map((color) => (
                    <span
                      key={color}
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: color, opacity: 0.66 }}
                    />
                  ))}
                </span>
                <span>Recent sessions</span>
              </p>
              {sessions
                .slice(-5)
                .reverse()
                .map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-still-white/10"
                  >
                    <span className="flex items-center gap-2 text-still-white/62 text-sm font-light">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: PRACTICE_ACCENTS[i % PRACTICE_ACCENTS.length],
                          opacity: 0.58,
                        }}
                      />
                      <span>{formatDate(s.date)}</span>
                    </span>
                    <span className="text-still-white/52 text-xs tracking-widest">
                      {Math.round(s.duration / 60)}m · {s.cycles} breaths
                    </span>
                  </div>
                ))}
            </div>
          </>
        )}

        <div
          id="sync"
          className={`flex flex-col gap-3 w-full border-t border-still-white/10 scroll-mt-6 ${totalSessions === 0 ? 'pt-4 opacity-80' : 'pt-2'}`}
        >
          <p className="text-still-white/58 text-xs tracking-[0.15em] uppercase font-light">
            Sign In
          </p>

          {!ready ? (
            <div className="flex flex-col gap-2">
              <p className="text-still-white/55 text-xs font-light leading-relaxed -mt-1">
                Checking sync on this device.
              </p>
            </div>
          ) : syncState === 'synced' && syncedEmail ? (
            <div className="flex flex-col gap-3">
              <p className="text-still-white/58 text-sm font-light leading-relaxed">
                Signed in as {syncedEmail}. Your history can follow you across devices.
              </p>
              {emailUpdatesMessage && (
                <p className="text-emerald-100/72 text-xs font-light leading-relaxed">
                  {emailUpdatesMessage}
                </p>
              )}
              {!connectedProviders.includes('google') && (
                <AuthProviderButton
                  kind="google"
                  type="button"
                  onClick={() => handleProviderSync('google')}
                  disabled={busyAction !== null}
                  pressed={busyAction === 'google'}
                >
                  {busyAction === 'google' ? 'Opening Google...' : 'Sign In With Google'}
                </AuthProviderButton>
              )}
              {!connectedProviders.includes('apple') && (
                <AuthProviderButton
                  kind="apple"
                  type="button"
                  onClick={() => handleProviderSync('apple')}
                  disabled={busyAction !== null}
                  pressed={busyAction === 'apple'}
                >
                  {busyAction === 'apple' ? 'Opening Apple...' : 'Sign In With Apple'}
                </AuthProviderButton>
              )}
              <button
                type="button"
                onClick={handleStopSync}
                disabled={busyAction !== null}
                className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/58 text-xs tracking-[0.2em] uppercase font-light hover:border-still-white/30 hover:text-still-white/75 hover:bg-still-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
              >
                {busyAction === 'signout' ? 'Signing out...' : 'Sign out here'}
              </button>
              {error && (
                <p className="text-amber-100/72 text-xs font-light leading-relaxed">
                  {error}
                </p>
              )}
            </div>
          ) : (syncState === 'codeSent' || syncState === 'verifying') && syncedEmail ? (
            <div className="flex flex-col gap-3">
              <p className="text-still-white/58 text-sm font-light leading-relaxed">
                We sent a sign-in email to {syncedEmail}. Open the link, or enter the code if the email shows one.
              </p>
              <p className="text-still-white/55 text-xs font-light leading-relaxed -mt-1">
                You can use Google, Apple, or email next time.
              </p>
              <label htmlFor="otp-code" className="sr-only">{expectedCodeLength(submitMode)}-digit code</label>
              <input
                id="otp-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={expectedCodeLength(submitMode)}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="------"
                disabled={syncState === 'verifying'}
                autoComplete="one-time-code"
                aria-label={`${expectedCodeLength(submitMode)}-digit confirmation code`}
                className="w-full min-h-14 px-4 py-3 rounded-2xl bg-transparent border border-still-white/18 text-still-white/90 placeholder:text-still-white/25 text-2xl tracking-[0.5em] font-light text-center tabular-nums focus:border-still-white/40 focus:outline-none transition-colors duration-300 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleVerifyClick}
                disabled={code.length !== expectedCodeLength(submitMode) || syncState === 'verifying'}
                className="w-full min-h-11 py-3 rounded-2xl border border-emerald-pulse/35 bg-emerald-pulse/10 text-emerald-100/95 text-xs tracking-[0.2em] uppercase font-light hover:border-emerald-pulse/55 hover:bg-emerald-pulse/16 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
              >
                {syncState === 'verifying' ? 'Verifying...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSyncState('idle');
                  setSyncedEmail(null);
                  setSubmitMode(null);
                  setCode('');
                }}
                className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/58 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/30 hover:text-still-white/75 hover:bg-still-white/5 transition-all duration-300"
              >
                Use another email
              </button>
              {error && (
                <p className="text-amber-100/72 text-xs font-light leading-relaxed text-center">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-still-white/58 text-xs font-light leading-relaxed -mt-1">
                {SIGN_IN_COPY}
              </p>
              <label
                htmlFor="email-updates"
                className="flex min-h-11 items-start gap-3 rounded-2xl border border-still-white/12 px-3 py-3 text-still-white/58 hover:border-still-white/22 transition-colors duration-300"
              >
                <input
                  id="email-updates"
                  type="checkbox"
                  checked={emailUpdatesOptIn}
                  onChange={(event) => setEmailUpdatesOptIn(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-still-white/30 bg-transparent accent-emerald-pulse"
                />
                <span className="flex flex-col gap-1 text-left">
                  <span className="text-xs tracking-[0.14em] uppercase font-light text-still-white/70">
                    Email Updates
                  </span>
                  <span className="text-xs font-light leading-relaxed text-still-white/55">
                    Optional notes about Exhale. Unchecked means no updates.
                  </span>
                </span>
              </label>
              <AuthProviderButton
                kind="google"
                type="button"
                onClick={() => handleProviderSync('google')}
                disabled={busyAction !== null}
                pressed={busyAction === 'google'}
              >
                {busyAction === 'google' ? 'Opening Google...' : 'Sign In With Google'}
              </AuthProviderButton>
              <AuthProviderButton
                kind="apple"
                type="button"
                onClick={() => handleProviderSync('apple')}
                disabled={busyAction !== null}
                pressed={busyAction === 'apple'}
              >
                {busyAction === 'apple' ? 'Opening Apple...' : 'Sign In With Apple'}
              </AuthProviderButton>
              <form className="flex flex-col gap-2" onSubmit={handleEmailSignIn}>
                <label htmlFor="sign-in-email" className="sr-only">Email address</label>
                <input
                  id="sign-in-email"
                  type="email"
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full min-h-12 rounded-2xl border border-still-white/18 bg-transparent px-4 py-3 text-sm font-light text-still-white/86 placeholder:text-still-white/35 focus:border-still-white/40 focus:outline-none transition-colors duration-300"
                />
                <AuthProviderButton
                  kind="email"
                  type="submit"
                  disabled={busyAction !== null}
                  pressed={busyAction === 'email'}
                >
                  {busyAction === 'email' ? 'Sending Link...' : 'Email Sign In'}
                </AuthProviderButton>
              </form>
              {error && (
                <p className="text-amber-100/72 text-xs font-light leading-relaxed text-center mt-1">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {showIosInstallTip && (
          <p className="text-still-white/55 text-xs font-light leading-relaxed text-center px-2 -mb-1">
            Add Exhale to your Home Screen for full-screen practice. Tap the Share icon in Safari, then Add to Home Screen.
          </p>
        )}

        <Link
          href="/"
          className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/58 text-xs tracking-[0.2em] uppercase font-light hover:border-still-white/30 hover:text-still-white/75 transition-all duration-300 flex items-center justify-center"
          aria-label="Back to home"
        >
          ← Back
        </Link>

        <PolicyFooter />
      </div>
    </main>
  );
}
