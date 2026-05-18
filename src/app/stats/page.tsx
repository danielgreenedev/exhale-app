'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { readStats, computeStats, storageAvailable, SessionRecord } from '@/hooks/useSessionStats';
import { SURFACE_GLOWS } from '@/lib/colors';
import { mergeSyncedSessions, missingLocalSessions } from '@/lib/sessionSync';
import { supabase } from '@/lib/supabase';

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
const SYNC_SCOPE_COPY = 'Only these sync: practice history, timer length, circle size, and sound choice.';

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

  return {
    sessions: mergeSyncedSessions(cloudSessions, (inserted ?? sessionsToSync) as SessionRecord[]),
  };
}

export default function StatsPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [storageOk, setStorageOk] = useState(true);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [submitMode, setSubmitMode] = useState<SubmitMode | null>(null);
  const [syncedEmail, setSyncedEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setStorageOk(storageAvailable());

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.email && user.email_confirmed_at) {
        setSyncedEmail(user.email);
        setSyncState('synced');
        const result = await loadSyncedSessions(user.id);
        setSessions(result.sessions);
        if (result.error) setError(result.error);
      } else {
        setSessions(readStats().sessions);
        if (user?.new_email) {
          setSyncedEmail(user.new_email);
          setEmail(user.new_email);
          setSubmitMode('link');
          setSyncState('codeSent');
        }
      }
    })();
  }, []);

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setCode('');
    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail) {
      setBusy(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: { shouldCreateUser: false },
    });

    if (!signInError) {
      setSubmitMode('signin');
      setSyncedEmail(targetEmail);
      setSyncState('codeSent');
      setBusy(false);
      return;
    }

    const text = (signInError.message ?? '').toLowerCase();
    const isUserNotFound =
      text.includes('signups not allowed') ||
      text.includes('user not found') ||
      text.includes('not registered');

    if (isUserNotFound) {
      const { error: updateError } = await supabase.auth.updateUser({ email: targetEmail });
      if (updateError) {
        setError(friendlySyncError(updateError.message));
        setBusy(false);
        return;
      }
      setSubmitMode('link');
      setSyncedEmail(targetEmail);
      setSyncState('codeSent');
      setBusy(false);
      return;
    }

    setError(friendlySyncError(signInError.message));
    setBusy(false);
  };

  const submitCode = async (codeValue: string) => {
    if (codeValue.length !== 6 || !syncedEmail || !submitMode) return;
    setSyncState('verifying');
    setError('');

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: syncedEmail,
      token: codeValue,
      type: submitMode === 'signin' ? 'email' : 'email_change',
    });

    if (verifyError) {
      setError(friendlySyncError(verifyError.message));
      setSyncState('codeSent');
      return;
    }

    // Reload so the new session, settings, and cloud sessions all pick up fresh
    window.location.reload();
  };

  const handleCodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setCode(cleaned);
    if (cleaned.length === 6) {
      void submitCode(cleaned);
    }
  };

  const handleVerifyClick = () => {
    if (code.length === 6) void submitCode(code);
  };

  const { totalSessions, totalMinutes, thisWeek, streak, totalDays } = computeStats(sessions);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <main className="min-h-screen bg-forest-night flex flex-col items-center justify-center px-6 text-still-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: SURFACE_GLOWS.stats }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 max-w-sm w-full">
        <div className="flex flex-col items-center gap-5">
          <div className="relative orb-breathe" aria-hidden="true">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-300/60 to-emerald-600/40 shadow-[0_0_36px_rgba(110,231,183,0.20)]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            <div className="absolute inset-[-10px] rounded-full border border-emerald-400/20 shadow-[0_0_14px_rgba(110,231,183,0.10)]" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-still-white/88">
              Practice
            </h1>
            <p className="text-still-white/55 text-xs tracking-[0.15em] font-light">Your breathing history</p>
          </div>
        </div>

        {!storageOk && (
          <p className="text-amber-100/72 text-xs font-light text-center leading-relaxed -mb-4">
            Session history requires storage access to save.
          </p>
        )}

        {totalSessions === 0 ? (
          <p className="text-still-white/58 text-sm font-light text-center leading-relaxed">
            No sessions yet. Complete your first session to begin tracking your practice.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-0 w-full">
              {[
                { label: 'Sessions', value: String(totalSessions) },
                { label: 'This week', value: String(thisWeek) },
                { label: 'Total time', value: timeLabel },
                { label: 'Days practiced', value: String(totalDays) },
                { label: 'Day streak', value: String(streak) },
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

            <div className="flex flex-col gap-4 w-full">
              <p className="text-still-white/52 text-xs tracking-[0.15em] uppercase font-light">
                Milestones
              </p>
              <div className="grid grid-cols-4 gap-3" role="list" aria-label="Practice milestones">
                {[25, 50, 75, 100].map((milestone) => {
                  const earned = totalSessions >= milestone;
                  return (
                    <div
                      key={milestone}
                      className="flex flex-col items-center gap-2"
                      role="listitem"
                      aria-label={earned ? `${milestone} sessions milestone achieved` : `${milestone} sessions milestone not yet reached`}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                        style={{
                          background: earned ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.03)',
                          border: earned ? '1px solid rgba(52,211,153,0.30)' : '1px solid rgba(255,255,255,0.07)',
                        }}
                        aria-hidden="true"
                      >
                        {earned ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="rgba(110,231,183,0.85)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="4 10 8 14 16 6" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{ color: 'rgba(255,255,255,0.12)' }}
                            aria-hidden="true"
                          >
                            <rect x="8.5" y="2" width="3" height="16" rx="1.5" />
                            <rect x="2" y="8.5" width="16" height="3" rx="1.5" />
                          </svg>
                        )}
                      </div>
                      <span
                        aria-hidden="true"
                        className="text-xs tracking-widest font-light"
                        style={{ color: earned ? 'rgba(110,231,183,0.78)' : 'rgba(245,245,242,0.62)' }}
                      >
                        {milestone}
                      </span>
                    </div>
                  );
                })}
              </div>
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

        <div className="flex flex-col gap-3 w-full pt-2 border-t border-still-white/10">
          <p className="text-still-white/52 text-xs tracking-[0.15em] uppercase font-light">
            Sync across devices
          </p>

          {syncState === 'synced' && syncedEmail ? (
            <div className="flex flex-col gap-2">
              <p className="text-still-white/58 text-sm font-light leading-relaxed">
                Synced to {syncedEmail}. Use this email on another device to access your practice there.
              </p>
              <p className="text-still-white/42 text-xs font-light leading-relaxed">
                {SYNC_SCOPE_COPY}
              </p>
              {error && (
                <p className="text-amber-100/72 text-xs font-light leading-relaxed">
                  {error}
                </p>
              )}
            </div>
          ) : (syncState === 'codeSent' || syncState === 'verifying') && syncedEmail ? (
            <div className="flex flex-col gap-3">
              <p className="text-still-white/58 text-sm font-light leading-relaxed">
                We sent a 6-digit code to {syncedEmail}. Open the email and enter the code below.
              </p>
              <p className="text-still-white/42 text-xs font-light leading-relaxed -mt-1">
                {SYNC_SCOPE_COPY}
              </p>
              <label htmlFor="otp-code" className="sr-only">6-digit code</label>
              <input
                id="otp-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="------"
                disabled={syncState === 'verifying'}
                autoComplete="one-time-code"
                aria-label="6-digit confirmation code"
                className="w-full min-h-14 px-4 py-3 rounded-2xl bg-transparent border border-still-white/18 text-still-white/90 placeholder:text-still-white/25 text-2xl tracking-[0.5em] font-light text-center tabular-nums focus:border-still-white/40 focus:outline-none transition-colors duration-300 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleVerifyClick}
                disabled={code.length !== 6 || syncState === 'verifying'}
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
            <form onSubmit={handleSendCode} className="flex flex-col gap-2">
              <p className="text-still-white/48 text-xs font-light leading-relaxed -mt-1">
                Enter your email and we&apos;ll send a 6-digit code. Use the same email on another device to keep your practice in sync.
              </p>
              <p className="text-still-white/42 text-xs font-light leading-relaxed">
                {SYNC_SCOPE_COPY}
              </p>
              <label htmlFor="sync-email" className="sr-only">Email</label>
              <input
                id="sync-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                required
                disabled={busy}
                autoComplete="email"
                className="w-full min-h-11 px-4 py-3 rounded-2xl bg-transparent border border-still-white/18 text-still-white/85 placeholder:text-still-white/40 text-sm tracking-[0.04em] font-light focus:border-still-white/35 focus:outline-none transition-colors duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || !email.trim()}
                className="w-full min-h-11 py-3 rounded-2xl border border-emerald-pulse/35 bg-emerald-pulse/10 text-emerald-100/95 text-xs tracking-[0.2em] uppercase font-light hover:border-emerald-pulse/55 hover:bg-emerald-pulse/16 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
              >
                {busy ? 'Sending...' : 'Send code'}
              </button>
              {error && (
                <p className="text-amber-100/72 text-xs font-light leading-relaxed text-center mt-1">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        <Link
          href="/"
          className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/58 text-xs tracking-[0.2em] uppercase font-light hover:border-still-white/30 hover:text-still-white/75 transition-all duration-300 flex items-center justify-center"
          aria-label="Back to home"
        >
          ← Back
        </Link>
      </div>
    </main>
  );
}
