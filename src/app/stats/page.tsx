'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { readStats, computeStats, storageAvailable, SessionRecord } from '@/hooks/useSessionStats';
import { SURFACE_GLOWS } from '@/lib/colors';
import { supabase } from '@/lib/supabase';

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function StatsPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [storageOk, setStorageOk] = useState(true);

  const [email, setEmail] = useState('');
  const [linkedEmail, setLinkedEmail] = useState<string | null>(null);
  const [linkConfirmed, setLinkConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    setStorageOk(storageAvailable());
    setSessions(readStats().sessions);

    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setLinkedEmail(data.user.email);
        setLinkConfirmed(!!data.user.email_confirmed_at);
      }
    });
  }, []);

  const handleLink = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setLinkError('');
    const { error } = await supabase.auth.updateUser({ email });
    setSubmitting(false);
    if (error) {
      setLinkError(error.message);
    } else {
      setLinkedEmail(email);
      setLinkConfirmed(false);
      setEmail('');
    }
  };

  const handleResend = async () => {
    if (!linkedEmail) return;
    setSubmitting(true);
    setLinkError('');
    const { error } = await supabase.auth.updateUser({ email: linkedEmail });
    setSubmitting(false);
    if (error) setLinkError(error.message);
  };

  const handleReset = () => {
    setLinkedEmail(null);
    setLinkConfirmed(false);
    setLinkError('');
    setEmail('');
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

            {/* Milestones */}
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
            Remember on other devices
          </p>
          {linkConfirmed && linkedEmail ? (
            <p className="text-still-white/58 text-sm font-light leading-relaxed">
              Synced to {linkedEmail}. Sign in with the same email on any device to sync your practice there.
            </p>
          ) : linkedEmail ? (
            <div className="flex flex-col gap-3">
              <p className="text-still-white/58 text-sm font-light leading-relaxed">
                Check {linkedEmail} for a confirmation link. Open it on any device to start syncing your practice there.
              </p>
              <p className="text-still-white/48 text-xs font-light leading-relaxed">
                On mobile, long-press the link and choose <span className="text-still-white/70">copy link address</span>, then paste it into your browser. Some mail apps quietly preview the link first, which can invalidate it.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={submitting}
                  className="flex-1 min-h-11 py-2 rounded-2xl border border-still-white/18 text-still-white/68 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/30 hover:text-still-white/85 hover:bg-still-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {submitting ? 'Sending…' : 'Send again'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={submitting}
                  className="flex-1 min-h-11 py-2 rounded-2xl text-still-white/52 text-xs tracking-[0.18em] uppercase font-light hover:text-still-white/75 hover:bg-still-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  Use another
                </button>
              </div>
              {linkError && (
                <p className="text-amber-100/72 text-xs font-light leading-relaxed text-center">
                  {linkError}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleLink} className="flex flex-col gap-2">
              <label htmlFor="link-email" className="sr-only">Email</label>
              <input
                id="link-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                required
                disabled={submitting}
                className="w-full min-h-11 px-4 py-3 rounded-2xl bg-transparent border border-still-white/18 text-still-white/85 placeholder:text-still-white/40 text-sm tracking-[0.04em] font-light focus:border-still-white/35 focus:outline-none transition-colors duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={submitting || !email}
                className="w-full min-h-11 py-3 rounded-2xl border border-emerald-pulse/35 bg-emerald-pulse/10 text-emerald-100/95 text-xs tracking-[0.2em] uppercase font-light hover:border-emerald-pulse/55 hover:bg-emerald-pulse/16 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
              >
                {submitting ? 'Sending…' : 'Send link'}
              </button>
              {linkError && (
                <p className="text-amber-100/72 text-xs font-light leading-relaxed text-center mt-1">
                  {linkError}
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
