'use client';

import { useState } from 'react';

const QUOTES = [
  "The quieter you become, the more you can hear.",
  "Breath is the bridge between the body and the mind.",
  "In stillness, everything that needs to come will come.",
  "You cannot always control what happens — only how you breathe through it.",
  "Rest is not the absence of effort. It is the presence of ease.",
];

interface Props {
  totalCycles: number;
  sessionDuration: number;
  onRestart: () => void;
  onMenu: () => void;
}

export default function SessionComplete({ totalCycles, sessionDuration, onRestart, onMenu }: Props) {
  const minutes = Math.floor(sessionDuration / 60);
  const seconds = sessionDuration % 60;
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#090c0a] text-white px-8">
      <div className="flex flex-col items-center gap-8 max-w-sm text-center animate-fade-in">
        {/* Warm amber orb */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300/75 to-amber-600/50 shadow-[0_0_60px_rgba(251,191,36,0.30)]" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-amber-200/90">
            Complete
          </h1>
          <p className="text-white/60 text-base font-light leading-relaxed">
            You completed {totalCycles} breath cycles
          </p>
          <p className="text-white/38 text-sm tracking-widest">
            {minutes}:{seconds.toString().padStart(2, '0')} of calm
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <p className="text-white/40 text-sm font-light italic leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl border border-amber-400/45 bg-amber-400/8 text-amber-200/90 text-sm tracking-[0.2em] uppercase font-light hover:border-amber-400/65 hover:text-amber-100 hover:bg-amber-400/14 transition-all duration-300"
          >
            Breathe Again
          </button>
          <button
            onClick={onMenu}
            className="w-full py-2 text-white/28 text-xs tracking-[0.2em] uppercase font-light hover:text-white/50 transition-colors duration-300"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
