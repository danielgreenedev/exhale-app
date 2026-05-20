'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PolicyFooter } from '@/components/PolicyFooter';

interface Quote {
  text: string;
  attribution?: string | null;
}

const FALLBACK_QUOTES: Quote[] = [
  { text: "The quieter you become, the more you can hear.", attribution: "Ram Dass" },
  { text: "Breath is the bridge between the body and the mind.", attribution: "Thich Nhat Hanh" },
  { text: "In stillness, everything that needs to come will come." },
  { text: "You cannot always control what happens, only how you breathe through it." },
  { text: "Rest is not the absence of effort. It is the presence of ease." },
];

interface Props {
  totalCycles: number;
  sessionDuration: number;
  storageNote?: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export default function SessionComplete({ totalCycles, sessionDuration, storageNote, onRestart, onMenu }: Props) {
  const minutes = Math.floor(sessionDuration / 60);
  const seconds = sessionDuration % 60;
  const [quote, setQuote] = useState<Quote>(
    () => FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
  );

  useEffect(() => {
    supabase
      .from('quotes')
      .select('text, attribution')
      .eq('active', true)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setQuote(data[Math.floor(Math.random() * data.length)] as Quote);
        }
      });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-forest-night text-still-white px-8">
      <div className="flex flex-col items-center gap-8 max-w-sm text-center animate-fade-in">
        {/* Warm amber orb */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300/75 to-amber-600/50 shadow-[0_0_60px_rgba(251,191,36,0.30)]" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <div className="absolute inset-[-14px] rounded-full border border-amber-400/20 shadow-[0_0_18px_rgba(251,191,36,0.10)]" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-amber-200/90">
            Complete
          </h1>
          <p className="text-still-white/68 text-base font-light leading-relaxed">
            You completed {totalCycles} breath cycles
          </p>
          <p className="text-still-white/58 text-sm tracking-widest">
            {minutes}:{seconds.toString().padStart(2, '0')} of calm
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <p className="text-still-white/58 text-sm font-light leading-relaxed tracking-[0.04em]">
            &ldquo;{quote.text}&rdquo;
          </p>
          {quote.attribution && (
            <p className="text-still-white/55 text-xs tracking-[0.1em] font-light">
              &mdash; {quote.attribution}
            </p>
          )}
        </div>

        {storageNote && (
          <p className="text-amber-100/72 text-xs font-light text-center leading-relaxed -mt-2 px-2">
            This session wasn&apos;t saved, storage is unavailable (private browsing or quota exceeded).
          </p>
        )}

        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={onRestart}
            className="w-full min-h-11 py-4 rounded-2xl border border-amber-400/45 bg-amber-400/8 text-amber-100/95 text-sm tracking-[0.2em] uppercase font-light hover:border-amber-400/65 hover:text-amber-50 hover:bg-amber-400/14 transition-all duration-300"
          >
            Breathe Again
          </button>
          <button
            onClick={onMenu}
            className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/58 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/30 hover:text-still-white/75 hover:bg-still-white/5 transition-all duration-300"
          >
            Back to Menu
          </button>
        </div>

        <PolicyFooter />
      </div>
    </main>
  );
}
