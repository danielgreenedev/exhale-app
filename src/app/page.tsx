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
  const [orbScale, setOrbScaleState] = useState<number>(1);
  const [firstVisit, setFirstVisit] = useState(false);

  const updateOrbScale = (scale: number) => {
    setOrbScaleState(scale);
    try { localStorage.setItem('exhale-orb-scale', String(scale)); } catch { /* unavailable */ }
  };

  useEffect(() => {
    try {
      const v = parseFloat(localStorage.getItem('exhale-orb-scale') ?? '1') || 1;
      setOrbScaleState(v);
      if (!localStorage.getItem('exhale-visited')) setFirstVisit(true);
    } catch { /* unavailable */ }
  }, []);

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

  const dismissFirstVisit = () => {
    setFirstVisit(false);
    try { localStorage.setItem('exhale-visited', '1'); } catch { /* unavailable */ }
  };

  const start = () => {
    dismissFirstVisit();
    router.push(`/game?length=${selected}`);
  };
  const resume = () => {
    if (!resumeData) return;
    router.push(`/game?length=${resumeData.length}&resume=${resumeData.elapsed.toFixed(1)}`);
  };

  return (
    <div className="min-h-screen bg-[#090c0a] flex flex-col items-center px-6 text-white">
      {/* Warm forest glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(145,40%,22%,0.20) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm w-full my-auto py-8">

        {/* Logo orb */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative orb-breathe" aria-hidden="true">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-300/60 to-emerald-600/40 shadow-[0_0_48px_rgba(110,231,183,0.22)]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            <div className="absolute inset-[-14px] rounded-full border border-emerald-400/20 shadow-[0_0_18px_rgba(110,231,183,0.12)]" />
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-[0.25em] sm:tracking-[0.38em] uppercase text-white/90">
              Exhale
            </h1>
            <p className="text-white/50 text-sm tracking-[0.12em] font-light text-center">
              Guided breathing for a calmer mind
            </p>
          </div>
        </div>

        {/* Session length picker — label removed, implied by context */}
        <div
          className="flex flex-col gap-2 w-full"
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
          {SESSION_OPTIONS.map((opt) => (
            <button
              key={opt.length}
              onClick={() => setSelected(opt.length)}
              role="radio"
              aria-checked={selected === opt.length}
              aria-label={`${opt.label}, ${opt.description}`}
              tabIndex={selected === opt.length ? 0 : -1}
              className={`
                w-full py-3 px-6 rounded-2xl border transition-all duration-300 text-left flex justify-between items-center
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

        {/* First-visit hint — one sentence, dismisses permanently */}
        {firstVisit && (
          <div className="flex items-start justify-between w-full gap-3 px-1 -mb-1">
            <p className="text-white/38 text-xs font-light leading-relaxed">
              The orb guides your pace — just follow along.
            </p>
            <button
              onClick={dismissFirstVisit}
              aria-label="Dismiss hint"
              className="text-white/25 hover:text-white/50 text-xs shrink-0 transition-colors duration-200 mt-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Begin button */}
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
            className="w-full py-4 px-6 rounded-2xl border border-white/15 text-white/45 hover:border-white/26 hover:text-white/65 transition-all duration-300 -mt-2 flex flex-col items-center gap-0.5"
          >
            <span className="text-sm tracking-[0.18em] uppercase font-light">
              ↩ Resume {resumeData.length}
            </span>
            <span className="text-xs tracking-[0.1em] font-light opacity-60 normal-case">
              {formatDuration(Math.floor(resumeData.elapsed))} in · from your last session
            </span>
          </button>
        )}

        {/* Secondary controls — orb size and practice history together below the fold */}
        <div className="flex flex-col gap-3 w-full pt-3 border-t border-white/6">
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-white/30 text-xs tracking-[0.14em] uppercase font-light">Orb size</span>
            <div className="flex gap-4 items-end">
              {([0.75, 1.0, 1.25] as const).map((scale, i) => {
                const sizes = ['w-3 h-3', 'w-4 h-4', 'w-5 h-5'] as const;
                const labels = ['S', 'M', 'L'] as const;
                const active = Math.abs(orbScale - scale) < 0.01;
                return (
                  <button
                    key={scale}
                    onClick={() => updateOrbScale(scale)}
                    aria-label={`Orb size ${labels[i]}`}
                    aria-pressed={active}
                    className="flex flex-col items-center gap-1.5 p-1 transition-opacity duration-300"
                    style={{ opacity: active ? 0.95 : 0.38 }}
                  >
                    <div className={`${sizes[i]} rounded-full bg-white`} />
                    <span className="text-white text-[9px] tracking-widest font-light">{labels[i]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => router.push('/stats')}
            className="w-full py-3 rounded-2xl border border-white/18 text-white/45 text-xs tracking-[0.18em] uppercase font-light hover:border-white/32 hover:text-white/65 hover:bg-white/4 active:scale-[0.98] transition-all duration-300"
            aria-label="View practice history"
          >
            Practice history
          </button>
        </div>

      </div>
    </div>
  );
}
