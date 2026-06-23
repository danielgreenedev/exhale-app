'use client';

import { useEffect, useState } from 'react';
import { PolicyFooter } from '@/components/PolicyFooter';
import { OrbMark } from '@/components/OrbMark';
import type { SessionLength } from '@/lib/breathing';
import { loadCompletionQuote, type Quote } from '@/lib/completionQuote';

interface Props {
  totalCycles: number;
  sessionLength: SessionLength;
  storageNote?: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

const SESSION_LENGTH_LABELS: Record<SessionLength, string> = {
  quick: '3 minutes',
  short: '5 minutes',
  medium: '7 minutes',
  long: '10 minutes',
};

export default function SessionComplete({ totalCycles, sessionLength, storageNote, onRestart, onMenu }: Props) {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let active = true;

    loadCompletionQuote().then((nextQuote) => {
      if (active) setQuote(nextQuote);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-forest-night text-still-white px-8">
      <div className="flex flex-col items-center gap-8 max-w-sm text-center animate-fade-in">
        <OrbMark size="complete" tone="amber" ring />

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-amber-200/90">
            Complete
          </h1>
          <p className="text-still-white/68 text-base font-light leading-relaxed">
            You completed {totalCycles} breath cycles
          </p>
          <p className="text-still-white/58 text-sm tracking-[0.04em]">
            {SESSION_LENGTH_LABELS[sessionLength]} complete
          </p>
        </div>

        <div
          className="flex min-h-[6.75rem] w-full flex-col justify-center gap-2 mt-2"
          aria-busy={!quote}
          aria-live="polite"
        >
          {quote && (
            <>
              <p className="text-still-white/58 text-sm font-light leading-relaxed tracking-[0.04em]">
                &ldquo;{quote.text}&rdquo;
              </p>
              {quote.attribution && (
                <p className="text-still-white/55 text-xs tracking-[0.04em] font-light">
                  - {quote.attribution}
                </p>
              )}
            </>
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
