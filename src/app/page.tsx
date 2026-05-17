'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionLength, SESSION_CYCLES } from '@/lib/breathing';

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

const SESSION_OPTIONS: { length: SessionLength; label: string; description: string }[] = [
  { length: 'quick',  label: '3 minutes',  description: `${SESSION_CYCLES.quick} breaths` },
  { length: 'short',  label: '5 minutes',  description: `${SESSION_CYCLES.short} breaths` },
  { length: 'medium', label: '7 minutes',  description: `${SESSION_CYCLES.medium} breaths` },
  { length: 'long',   label: '10 minutes', description: `${SESSION_CYCLES.long} breaths` },
];

interface ResumeData {
  length: SessionLength;
  elapsed: number;
}

const RESUME_KEY = 'exhale-resume';
const RESUME_WINDOW_MS = 60_000;

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<SessionLength>('short');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESUME_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as ResumeData & { timestamp: number };
      if (Date.now() - data.timestamp < RESUME_WINDOW_MS) {
        setResumeData({ length: data.length, elapsed: data.elapsed });
      } else {
        sessionStorage.removeItem(RESUME_KEY);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const start = () => router.push(`/game?length=${selected}`);
  const resume = () => {
    if (!resumeData) return;
    router.push(`/game?length=${resumeData.length}&resume=${resumeData.elapsed.toFixed(1)}`);
  };

  return (
    <div className="min-h-screen bg-[#090c0a] flex flex-col items-center justify-center px-6 text-white">
      {/* Warm forest glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(145,40%,22%,0.20) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-12 max-w-sm w-full">
        {/* Logo orb — sage green, breathes gently */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative orb-breathe" aria-hidden="true">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-300/60 to-emerald-600/40 shadow-[0_0_48px_rgba(110,231,183,0.22)]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            <div className="absolute inset-[-8px] rounded-full border border-emerald-400/14" />
            <div className="absolute inset-[-18px] rounded-full border border-emerald-400/08" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-[0.25em] sm:tracking-[0.38em] uppercase text-white/90">
              Exhale
            </h1>
            <p className="text-white/50 text-sm tracking-[0.12em] font-light text-center">
              Guided breathing for a calmer mind
            </p>
          </div>
        </div>

        {/* Pattern info */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-white/35 text-xs tracking-[0.14em] uppercase font-light">
            4 · 4 · 6 · 2 breathing pattern
          </p>
          <div
            className="flex gap-4 text-white/28 text-xs font-light"
            aria-label="Inhale 4 seconds, hold 4 seconds, exhale 6 seconds, rest 2 seconds"
          >
            <span>Inhale 4s</span>
            <span aria-hidden="true">·</span>
            <span>Hold 4s</span>
            <span aria-hidden="true">·</span>
            <span>Exhale 6s</span>
            <span aria-hidden="true">·</span>
            <span>Rest 2s</span>
          </div>
        </div>

        {/* Session length picker */}
        <div
          className="flex flex-col gap-3 w-full"
          role="radiogroup"
          aria-label="Session length"
          onKeyDown={(e) => {
            const idx = SESSION_OPTIONS.findIndex((o) => o.length === selected);
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
              e.preventDefault();
              setSelected(SESSION_OPTIONS[Math.min(idx + 1, SESSION_OPTIONS.length - 1)].length);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
              e.preventDefault();
              setSelected(SESSION_OPTIONS[Math.max(idx - 1, 0)].length);
            }
          }}
        >
          <p className="text-white/38 text-xs tracking-[0.18em] uppercase font-light text-center mb-1">
            Choose session length
          </p>
          {SESSION_OPTIONS.map((opt) => (
            <button
              key={opt.length}
              onClick={() => setSelected(opt.length)}
              role="radio"
              aria-checked={selected === opt.length}
              aria-label={`${opt.label}, ${opt.description}`}
              tabIndex={selected === opt.length ? 0 : -1}
              className={`
                w-full py-4 px-6 rounded-2xl border transition-all duration-300 text-left flex justify-between items-center
                ${selected === opt.length
                  ? 'border-emerald-400/45 bg-emerald-400/10 text-white/90'
                  : 'border-white/12 text-white/45 hover:border-white/22 hover:text-white/65'
                }
              `}
            >
              <span className="text-lg font-extralight tracking-wide">{opt.label}</span>
              <span className="text-xs tracking-widest opacity-60">{opt.description}</span>
            </button>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={start}
          aria-label={`Begin ${selected} session`}
          className="w-full py-5 rounded-2xl bg-emerald-700/15 border border-emerald-400/32 text-emerald-200/90 text-sm tracking-[0.28em] uppercase font-light hover:bg-emerald-700/26 hover:border-emerald-400/55 hover:text-emerald-100 active:scale-[0.98] transition-all duration-300"
        >
          Begin
        </button>

        {/* Resume button — only shown within 60s of exiting a session */}
        {resumeData && (
          <button
            onClick={resume}
            aria-label={`Resume ${resumeData.length} session, ${formatDuration(Math.floor(resumeData.elapsed))} in`}
            className="w-full py-4 px-6 rounded-2xl border border-white/15 text-white/45 hover:border-white/26 hover:text-white/65 transition-all duration-300 -mt-6 flex flex-col items-center gap-0.5"
          >
            <span className="text-sm tracking-[0.18em] uppercase font-light">
              ↩ Resume {resumeData.length}
            </span>
            <span className="text-xs tracking-[0.1em] font-light opacity-60 normal-case">
              {formatDuration(Math.floor(resumeData.elapsed))} in · from your last session
            </span>
          </button>
        )}

        <p className="text-white/28 text-xs font-light text-center leading-relaxed">
          Find a comfortable position · breathe naturally · let the orb guide you
        </p>

        {/* Stats link */}
        <button
          onClick={() => router.push('/stats')}
          className="w-full py-3 rounded-2xl border border-white/18 text-white/45 text-xs tracking-[0.18em] uppercase font-light hover:border-white/32 hover:text-white/65 hover:bg-white/4 active:scale-[0.98] transition-all duration-300 -mt-8"
          aria-label="View practice history"
        >
          Practice history
        </button>
      </div>
    </div>
  );
}
