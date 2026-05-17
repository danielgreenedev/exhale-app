'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionLength, SESSION_CYCLES } from '@/lib/breathing';

const SESSION_OPTIONS: { length: SessionLength; label: string; description: string }[] = [
  { length: 'short', label: '5 min', description: `${SESSION_CYCLES.short} breaths` },
  { length: 'medium', label: '7 min', description: `${SESSION_CYCLES.medium} breaths` },
  { length: 'long', label: '10 min', description: `${SESSION_CYCLES.long} breaths` },
];

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<SessionLength>('medium');

  const start = () => {
    router.push(`/game?length=${selected}`);
  };

  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col items-center justify-center px-6 text-white">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, hsla(210,80%,30%,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-12 max-w-sm w-full">
        {/* Logo orb */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/70 to-blue-600/50 shadow-[0_0_50px_rgba(96,165,250,0.35)]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/25 to-transparent" />
            {/* Inner glow ring */}
            <div className="absolute inset-[-8px] rounded-full border border-blue-400/15" />
            <div className="absolute inset-[-18px] rounded-full border border-blue-400/10" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-5xl font-extralight tracking-[0.4em] uppercase text-white/90">
              Exhale
            </h1>
            <p className="text-white/35 text-sm tracking-[0.15em] font-light text-center">
              Guided breathing for a calmer mind
            </p>
          </div>
        </div>

        {/* Pattern info */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-white/25 text-xs tracking-[0.15em] uppercase font-light">
            4 · 4 · 6 · 2 breathing pattern
          </p>
          <div className="flex gap-4 text-white/20 text-xs font-light">
            <span>Inhale 4s</span>
            <span>·</span>
            <span>Hold 4s</span>
            <span>·</span>
            <span>Exhale 6s</span>
            <span>·</span>
            <span>Rest 2s</span>
          </div>
        </div>

        {/* Session length picker */}
        <div className="flex flex-col gap-3 w-full">
          <p className="text-white/30 text-xs tracking-[0.2em] uppercase font-light text-center mb-1">
            Choose session length
          </p>
          {SESSION_OPTIONS.map((opt) => (
            <button
              key={opt.length}
              onClick={() => setSelected(opt.length)}
              className={`
                w-full py-4 px-6 rounded-2xl border transition-all duration-300 text-left flex justify-between items-center
                ${selected === opt.length
                  ? 'border-blue-400/50 bg-blue-400/10 text-white/90'
                  : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
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
          className="w-full py-5 rounded-2xl bg-blue-500/15 border border-blue-400/35 text-blue-300/90 text-sm tracking-[0.3em] uppercase font-light hover:bg-blue-500/25 hover:border-blue-400/60 hover:text-blue-200 active:scale-[0.98] transition-all duration-300"
        >
          Begin
        </button>

        <p className="text-white/15 text-xs font-light text-center leading-relaxed">
          Find a comfortable position · breathe naturally · let the orb guide you
        </p>
      </div>
    </div>
  );
}
