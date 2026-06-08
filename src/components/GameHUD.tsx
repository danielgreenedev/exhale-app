'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_RHYTHM, PhaseConfig, RHYTHMS, Rhythm } from '@/lib/breathing';

const PHASE_FADE_MS = 960;
const phaseLabelShadow = '0 1px 2px rgba(8,14,10,1), 0 4px 14px rgba(8,14,10,1), 0 0 28px rgba(8,14,10,0.78)';

interface Props {
  currentPhase: PhaseConfig;
  timeRemaining: number;
  cycleNumber: number;
  totalCycles: number;
  centerHidden?: boolean;
  rhythm?: Rhythm;
}

export default function GameHUD({
  currentPhase,
  timeRemaining,
  cycleNumber,
  totalCycles,
  centerHidden = false,
  rhythm = RHYTHMS[DEFAULT_RHYTHM],
}: Props) {
  const minutesLeft = Math.ceil(((totalCycles - cycleNumber + 1) * rhythm.cycleDuration) / 60);
  const settled = cycleNumber >= 2;
  const [previousPhase, setPreviousPhase] = useState<PhaseConfig | null>(null);
  const lastPhaseRef = useRef(currentPhase);

  useEffect(() => {
    if (currentPhase.phase === lastPhaseRef.current.phase) return;

    setPreviousPhase(lastPhaseRef.current);
    lastPhaseRef.current = currentPhase;

    const timeout = window.setTimeout(() => setPreviousPhase(null), PHASE_FADE_MS);
    return () => window.clearTimeout(timeout);
  }, [currentPhase]);

  const labelOpacity = settled ? 0.9 : 0.96;
  const timerIsLoadBearing = currentPhase.phase === 'hold' || currentPhase.phase === 'rest';
  const timerOpacity = !settled ? 0.88 : timerIsLoadBearing ? 0.76 : 0.34;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none select-none">
      {/* Top: cycle count */}
      <div className="pt-8 w-full flex items-start justify-center relative">
        <p
          className="text-still-white/72 text-sm tracking-[0.2em] uppercase font-light"
          style={{ textShadow: '0 1px 8px rgba(15,23,18,0.7)' }}
          aria-live="polite"
          aria-label={`Breath ${cycleNumber} of ${totalCycles}`}
        >
          Breath {cycleNumber} of {totalCycles}
        </p>
      </div>

      {/* Center: phase label + countdown, floating over the orb */}
      {!centerHidden && (
        <div className="flex w-full max-w-[calc(100vw-2rem)] flex-col items-center gap-0 translate-y-[clamp(46px,12vh,100px)] landscape:translate-y-[clamp(28px,7vh,56px)]">
          <div className="relative flex w-full flex-col items-center gap-3 px-4">
            <div
              className="exhale-hud-backplate pointer-events-none absolute left-1/2 top-1/2 h-44 w-[min(24rem,88vw)] -translate-x-1/2 -translate-y-[52%] rounded-full bg-forest-night/42 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative flex h-16 w-full min-w-0 items-center justify-center">
              {previousPhase && (
                <h2
                  className="exhale-phase-label exhale-phase-out absolute inset-x-0 text-center text-[2.75rem] font-semibold leading-none tracking-[0.12em] text-still-white/95 uppercase sm:text-5xl"
                  style={{
                    ['--phase-opacity' as string]: labelOpacity,
                    textShadow: phaseLabelShadow,
                    opacity: labelOpacity,
                  }}
                  aria-hidden="true"
                >
                  {previousPhase.label}
                </h2>
              )}
              <h2
                className={`exhale-phase-label absolute inset-x-0 text-center text-[2.75rem] font-semibold leading-none tracking-[0.12em] text-still-white/95 uppercase sm:text-5xl ${previousPhase ? 'exhale-phase-in' : ''}`}
                style={{
                  ['--phase-opacity' as string]: labelOpacity,
                  textShadow: phaseLabelShadow,
                  opacity: labelOpacity,
                }}
                aria-live="polite"
                aria-label={`${currentPhase.label}. ${currentPhase.instruction}`}
              >
                {currentPhase.label}
              </h2>
            </div>

            <div
              className="exhale-phase-timer mt-0 text-7xl font-thin leading-none tabular-nums text-still-white/90 sm:text-8xl"
              style={{
                textShadow: '0 1px 2px rgba(8,14,10,0.98), 0 4px 18px rgba(8,14,10,0.96), 0 0 24px rgba(8,14,10,0.62)',
                opacity: timerOpacity,
                transition: 'opacity 700ms ease',
              }}
              role="timer"
              aria-label={`${timeRemaining} seconds remaining`}
            >
              {timeRemaining}
            </div>
          </div>
        </div>
      )}

      {/* Bottom: quiet time-remaining hint + desktop keyboard hint — session progress now lives on the canvas session ring */}
      <div className="pb-[calc(7rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-1.5">
        {!settled && (
          <p
            className="text-still-white/70 text-xs tracking-[0.15em] uppercase font-light"
            style={{ textShadow: '0 1px 6px rgba(15,23,18,0.6)' }}
          >
            ~{minutesLeft} min remaining
          </p>
        )}
        <p className="hidden sm:block text-still-white/60 text-xs tracking-[0.1em] font-light" aria-hidden="true">
          space · pause &nbsp;·&nbsp; esc · exit
        </p>
      </div>
    </div>
  );
}
