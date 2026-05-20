'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_RHYTHM, PhaseConfig, RHYTHMS, Rhythm } from '@/lib/breathing';

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

    const timeout = window.setTimeout(() => setPreviousPhase(null), 520);
    return () => window.clearTimeout(timeout);
  }, [currentPhase]);

  const labelOpacity = settled ? 0.76 : 1;
  const instructionOpacity = settled ? 0 : 0.9;
  const timerIsLoadBearing = currentPhase.phase === 'hold' || currentPhase.phase === 'rest';
  const timerOpacity = !settled ? 1 : timerIsLoadBearing ? 0.68 : 0.18;

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

      {/* Center: phase label + instruction + countdown — float in space, no backdrop */}
      {!centerHidden && (
        <div className="flex w-full max-w-[calc(100vw-2rem)] flex-col items-center gap-0 translate-y-[clamp(46px,12vh,100px)] landscape:translate-y-[clamp(28px,7vh,56px)]">
        <div className="flex w-full flex-col items-center gap-1.5 px-4">
          <div className="relative h-9 w-full min-w-0 flex items-center justify-center">
            {previousPhase && (
              <h2
                className="exhale-phase-out absolute inset-x-0 text-center text-3xl font-semibold tracking-[0.3em] uppercase text-still-white"
                style={{
                  ['--phase-opacity' as string]: labelOpacity,
                  textShadow: '0 2px 16px rgba(15,23,18,0.85), 0 1px 4px rgba(15,23,18,0.9)',
                  opacity: labelOpacity,
                }}
                aria-hidden="true"
              >
                {previousPhase.label}
              </h2>
            )}
            <h2
              className={`absolute inset-x-0 text-center text-3xl font-semibold tracking-[0.3em] uppercase text-still-white ${previousPhase ? 'exhale-phase-in' : ''}`}
              style={{
                ['--phase-opacity' as string]: labelOpacity,
                textShadow: '0 2px 16px rgba(15,23,18,0.85), 0 1px 4px rgba(15,23,18,0.9)',
                opacity: labelOpacity,
              }}
              aria-live="polite"
            >
              {currentPhase.label}
            </h2>
          </div>

          <div className="relative min-h-8 w-full max-w-[27rem] flex items-center justify-center">
            {previousPhase && (
              <p
                className="exhale-phase-out absolute inset-x-0 text-still-white text-sm tracking-[0.04em] font-light text-center leading-snug px-1"
                style={{
                  ['--phase-opacity' as string]: instructionOpacity,
                  textShadow: '0 2px 14px rgba(15,23,18,0.92), 0 1px 4px rgba(15,23,18,0.9)',
                  opacity: instructionOpacity,
                }}
                aria-hidden="true"
              >
                {previousPhase.instruction}
              </p>
            )}
            <p
              className={`absolute inset-x-0 text-still-white text-sm tracking-[0.04em] font-light text-center leading-snug px-1 ${previousPhase ? 'exhale-phase-in' : ''}`}
              style={{
                ['--phase-opacity' as string]: instructionOpacity,
                textShadow: '0 2px 14px rgba(15,23,18,0.92), 0 1px 4px rgba(15,23,18,0.9)',
                opacity: instructionOpacity,
                transition: 'opacity 5s ease',
              }}
            >
              {currentPhase.instruction}
            </p>
          </div>

          <div
            className="text-6xl font-thin tabular-nums text-still-white/92 mt-0"
            style={{
              textShadow: '0 2px 20px rgba(15,23,18,0.9)',
              opacity: timerOpacity,
              transition: 'opacity 520ms ease',
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
