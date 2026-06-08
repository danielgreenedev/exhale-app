'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_RHYTHM, PhaseConfig, RHYTHMS, Rhythm } from '@/lib/breathing';

const PHASE_FADE_MS = 960;
const phaseLabelShadow = '0 1px 2px rgba(8,14,10,1), 0 5px 20px rgba(8,14,10,0.92), 0 0 30px rgba(8,14,10,0.58)';
const instructionShadow = '0 1px 2px rgba(8,14,10,0.98), 0 4px 18px rgba(8,14,10,0.88), 0 0 26px rgba(8,14,10,0.54)';

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

  const labelOpacity = settled ? 0.84 : 0.92;
  const instructionOpacity = settled ? 0.62 : 0.84;
  const timerIsLoadBearing = currentPhase.phase === 'hold' || currentPhase.phase === 'rest';
  const timerOpacity = !settled ? 0.78 : timerIsLoadBearing ? 0.56 : 0.14;

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

      {/* Center: phase label + instruction + countdown, floating over the orb */}
      {!centerHidden && (
        <div className="flex w-full max-w-[calc(100vw-2rem)] flex-col items-center gap-0 translate-y-[clamp(46px,12vh,100px)] landscape:translate-y-[clamp(28px,7vh,56px)]">
          <div className="relative flex w-full flex-col items-center gap-1.5 px-4">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[min(25rem,92vw)] -translate-x-1/2 -translate-y-[57%] rounded-full bg-forest-night/40 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative h-11 w-full min-w-0 flex items-center justify-center">
              {previousPhase && (
                <h2
                  className="exhale-phase-out absolute inset-x-0 text-center text-[2rem] font-semibold leading-none tracking-[0.16em] text-still-white/92 uppercase sm:text-4xl"
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
                className={`absolute inset-x-0 text-center text-[2rem] font-semibold leading-none tracking-[0.16em] text-still-white/92 uppercase sm:text-4xl ${previousPhase ? 'exhale-phase-in' : ''}`}
                style={{
                  ['--phase-opacity' as string]: labelOpacity,
                  textShadow: phaseLabelShadow,
                  opacity: labelOpacity,
                }}
                aria-live="polite"
              >
                {currentPhase.label}
              </h2>
            </div>

            <div className="relative flex min-h-12 w-full max-w-[18rem] items-center justify-center sm:max-w-[28rem]">
              {previousPhase && (
                <p
                  className="exhale-phase-out absolute inset-x-0 px-1 text-center text-base font-light leading-snug tracking-[0.02em] text-still-white/86"
                  style={{
                    ['--phase-opacity' as string]: instructionOpacity,
                    textShadow: instructionShadow,
                    opacity: instructionOpacity,
                  }}
                  aria-hidden="true"
                >
                  {previousPhase.instruction}
                </p>
              )}
              <p
                className={`absolute inset-x-0 px-1 text-center text-base font-light leading-snug tracking-[0.02em] text-still-white/86 ${previousPhase ? 'exhale-phase-in' : ''}`}
                style={{
                  ['--phase-opacity' as string]: instructionOpacity,
                  textShadow: instructionShadow,
                  opacity: instructionOpacity,
                }}
              >
                {currentPhase.instruction}
              </p>
            </div>

          <div
            className="text-6xl font-thin tabular-nums text-still-white/86 mt-0"
            style={{
              textShadow: '0 2px 20px rgba(15,23,18,0.9)',
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
