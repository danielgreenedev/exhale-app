'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readStats, computeStats, storageAvailable, writeStats } from '@/hooks/useSessionStats';
import type { SessionRecord } from '@/hooks/useSessionStats';
import { SURFACE_GLOWS } from '@/lib/colors';
import { mergeSyncedSessions, missingLocalSessions } from '@/lib/sessionSync';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { syncUserSettings } from '@/lib/settingsSync';
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
const SIGN_IN_COPY = 'Sign in to track your history across all devices.';

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

function friendlyOAuthError(message?: string): string {
  const text = (message ?? '').toLowerCase();
  if (text.includes('manual') && text.includes('link')) {
    return 'Google sync needs identity linking enabled in Supabase first.';
  }
  if (looksLikeExistingEmailError(message)) {
    return 'That Google email is attached to an older Exhale email sign-in. Contact support if this is your account.';
  }
  if (text.includes('provider') || text.includes('not enabled')) {
    return 'Google sync is not ready yet. Check the Supabase Google provider setup.';
  }
  if ((text.includes('already') && text.includes('linked')) || text.includes('identity_already')) {
    return 'That Google account is already connected. Try Sign In With Google again.';
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
  } = useAuth();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [storageOk, setStorageOk] = useState(true);

  const [code, setCode] = useState('');
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [submitMode, setSubmitMode] = useState<SubmitMode | null>(null);
  const [syncedEmail, setSyncedEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [hasGoogleIdentity, setHasGoogleIdentity] = useState(false);
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
      if (!ready || syncState === 'codeSent' || syncState === 'verifying') return;

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

    setError(friendlyOAuthError(oauthError));
    window.history.replaceState(null, '', '/stats');
  }, []);

  useEffect(() => {
    if (!ready || !userId || isAnonymous) {
      setHasGoogleIdentity(false);
      return;
    }

    let active = true;

    void supabase.auth.getUserIdentities().then(({ data, error: identitiesError }) => {
      if (!active || identitiesError) return;
      setHasGoogleIdentity(data.identities.some((identity) => identity.provider === 'google'));
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

  const handleGoogleSync = async () => {
    setBusy(true);
    setError('');
    const { error: googleError } = await startGoogleBackupSync();
    if (googleError) {
      setError(friendlyOAuthError(googleError));
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  const handleStopSync = async () => {
    setBusy(true);
    setError('');
    await signOutToAnonymous();
    setSyncState('idle');
    setSyncedEmail(null);
    setCode('');
    setSessions(readStats().sessions);
    setBusy(false);
  };

  const { totalSessions, totalMinutes, totalDays } = computeStats(sessions);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

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
              {[
                { label: 'Sessions', value: String(totalSessions) },
                { label: 'Total time', value: timeLabel },
                { label: 'Days practiced', value: String(totalDays) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-baseline py-5 border-b border-still-white/10"
                >
                  <span className="text-xs tracking-[0.15em] uppercase font-light text-still-white/58">
                    {label}
                  </span>
                  <span className="text-2xl font-extralight text-still-white/86">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-0 w-full">
              <p className="text-still-white/52 text-xs tracking-[0.15em] uppercase font-light mb-4">
                Recent sessions
              </p>
              {sessions
                .slice(-5)
                .reverse()
                .map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-still-white/10"
                  >
                    <span className="text-still-white/62 text-sm font-light">{formatDate(s.date)}</span>
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
              {!hasGoogleIdentity && (
                <button
                  type="button"
                  onClick={handleGoogleSync}
                  disabled={busy}
                  className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 bg-still-white/[0.03] text-still-white/72 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/30 hover:bg-still-white/[0.06] hover:text-still-white/86 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {busy ? 'Opening Google...' : 'Sign In With Google'}
                </button>
              )}
              <button
                type="button"
                onClick={handleStopSync}
                disabled={busy}
                className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/58 text-xs tracking-[0.2em] uppercase font-light hover:border-still-white/30 hover:text-still-white/75 hover:bg-still-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
              >
                {busy ? 'Signing out...' : 'Sign out here'}
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
                We sent a {expectedCodeLength(submitMode)}-digit code to {syncedEmail}. Open the email and enter the code below.
              </p>
              <p className="text-still-white/55 text-xs font-light leading-relaxed -mt-1">
                This is an older email-code sign-in step. Finish it once, then use Google next time.
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
              <button
                type="button"
                onClick={handleGoogleSync}
                disabled={busy}
                className={`w-full min-h-11 py-3 rounded-2xl border text-xs tracking-[0.18em] uppercase font-light disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ${
                  totalSessions === 0
                    ? 'border-still-white/14 text-still-white/58 hover:border-still-white/24 hover:text-still-white/72'
                    : 'border-still-white/18 bg-still-white/[0.03] text-still-white/72 hover:border-still-white/30 hover:bg-still-white/[0.06] hover:text-still-white/86'
                }`}
              >
                {busy ? 'Opening Google...' : 'Sign In With Google'}
              </button>
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
