'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readStats, computeStats, storageAvailable, SessionRecord } from '@/hooks/useSessionStats';

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function StatsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [storageOk, setStorageOk] = useState(true);

  useEffect(() => {
    setStorageOk(storageAvailable());
    setSessions(readStats().sessions);
  }, []);

  const { totalSessions, totalMinutes, thisWeek, streak, totalDays } = computeStats(sessions);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="min-h-screen bg-[#090c0a] flex flex-col items-center justify-center px-6 text-white">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(145,40%,22%,0.14) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 max-w-sm w-full">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-extralight tracking-[0.4em] uppercase text-white/80">
            Practice
          </h1>
          <p className="text-white/30 text-xs tracking-[0.15em] font-light">Your breathing history</p>
        </div>

        {!storageOk && (
          <p className="text-white/25 text-xs font-light text-center leading-relaxed -mb-4">
            Session history requires storage access to save.
          </p>
        )}

        {totalSessions === 0 ? (
          <p className="text-white/30 text-sm font-light text-center leading-relaxed">
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
                  className="flex justify-between items-baseline py-5 border-b border-white/6"
                >
                  <span className="text-xs tracking-[0.15em] uppercase font-light text-white/35">
                    {label}
                  </span>
                  <span className="text-2xl font-extralight text-white/80">{value}</span>
                </div>
              ))}
            </div>

            {/* Milestones */}
            <div className="flex flex-col gap-4 w-full">
              <p className="text-white/25 text-xs tracking-[0.15em] uppercase font-light">
                Milestones
              </p>
              <div className="flex gap-5">
                {[25, 50, 75, 100].map((milestone) => {
                  const earned = totalSessions >= milestone;
                  return (
                    <div key={milestone} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700"
                        style={{
                          background: earned ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.03)',
                          border: earned ? '1px solid rgba(52,211,153,0.30)' : '1px solid rgba(255,255,255,0.07)',
                        }}
                        aria-label={earned ? `${milestone} sessions milestone achieved` : `${milestone} sessions milestone`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          style={{ color: earned ? 'rgba(110,231,183,0.85)' : 'rgba(255,255,255,0.12)' }}
                          aria-hidden="true"
                        >
                          <rect x="8.5" y="2" width="3" height="16" rx="1.5" />
                          <rect x="2" y="8.5" width="16" height="3" rx="1.5" />
                        </svg>
                      </div>
                      <span
                        className="text-xs tracking-widest font-light"
                        style={{ color: earned ? 'rgba(110,231,183,0.65)' : 'rgba(255,255,255,0.16)' }}
                      >
                        {milestone}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-0 w-full">
              <p className="text-white/25 text-xs tracking-[0.15em] uppercase font-light mb-4">
                Recent sessions
              </p>
              {sessions
                .slice(-5)
                .reverse()
                .map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-white/5"
                  >
                    <span className="text-white/45 text-sm font-light">{formatDate(s.date)}</span>
                    <span className="text-white/25 text-xs tracking-widest">
                      {Math.round(s.duration / 60)}m · {s.cycles} breaths
                    </span>
                  </div>
                ))}
            </div>
          </>
        )}

        <button
          onClick={() => router.push('/')}
          className="w-full py-3 rounded-2xl border border-white/15 text-white/35 text-xs tracking-[0.2em] uppercase font-light hover:border-white/28 hover:text-white/55 transition-all duration-300"
          aria-label="Back to home"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
