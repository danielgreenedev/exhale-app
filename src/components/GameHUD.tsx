'use client';

import { useEffect, useRef, useState } from 'react';
import { PhaseConfig, CYCLE_DURATION } from '@/lib/breathing';

interface Props {
  currentPhase: PhaseConfig;
  timeRemaining: number;
  cycleNumber: number;
  totalCycles: number;
  sessionProgress: number;
  centerHidden?: boolean;
}

export default function GameHUD({
  currentPhase,
  timeRemaining,
  cycleNumber,
  totalCycles,
  sessionProgress,
  centerHidden = false,
}: Props) {
  const minutesLeft = Math.ceil(((totalCycles - cycleNumber + 1) * CYCLE_DURATION) / 60);
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

  const labelOpacity = settled ? 0.7 : 1;
  const instructionOpacity = settled ? 0 : 0.82;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none select-none">
      {/* Top: cycle count */}
      <div className="pt-8 w-full flex items-start justify-center relative">
        <p
          className="text-still-white/65 text-sm tracking-[0.2em] uppercase font-light"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
          aria-live="polite"
          aria-label={`Breath ${cycleNumber} of ${totalCycles}`}
        >
          Breath {cycleNumber} of {totalCycles}
        </p>
      </div>

      {/* Center: phase label + instruction + countdown — float in space, no backdrop */}
      {!centerHidden && (
        <div className="flex flex-col items-center gap-0 translate-y-[clamp(50px,13vh,110px)] landscape:translate-y-[clamp(30px,7vh,60px)]">
        <div className="flex flex-col items-center gap-3 px-10">
          <div className="relative h-10 min-w-64 flex items-center justify-center">
            {previousPhase && (
              <h2
                className="exhale-phase-out absolute inset-x-0 text-center text-3xl font-semibold tracking-[0.3em] uppercase text-still-white"
                style={{
                  ['--phase-opacity' as string]: labelOpacity,
                  textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
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
                textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
                opacity: labelOpacity,
              }}
              aria-live="polite"
            >
              {currentPhase.label}
            </h2>
          </div>

          <div className="relative min-h-6 w-[min(80vw,26rem)] flex items-center justify-center">
            {previousPhase && (
              <p
                className="exhale-phase-out absolute inset-x-0 text-still-white text-sm tracking-[0.12em] font-light text-center"
                style={{
                  ['--phase-opacity' as string]: instructionOpacity,
                  textShadow: '0 1px 10px rgba(0,0,0,0.85)',
                  opacity: instructionOpacity,
                }}
                aria-hidden="true"
              >
                {previousPhase.instruction}
              </p>
            )}
            <p
              className={`absolute inset-x-0 text-still-white text-sm tracking-[0.12em] font-light text-center ${previousPhase ? 'exhale-phase-in' : ''}`}
              style={{
                ['--phase-opacity' as string]: instructionOpacity,
                textShadow: '0 1px 10px rgba(0,0,0,0.85)',
                opacity: instructionOpacity,
                transition: 'opacity 5s ease',
              }}
            >
              {currentPhase.instruction}
            </p>
          </div>

          <div
            className="text-6xl font-thin tabular-nums text-still-white/90 mt-1"
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
              opacity: settled ? 0.58 : 1,
              transition: 'opacity 4s ease',
            }}
            role="timer"
            aria-label={`${timeRemaining} seconds remaining`}
          >
            {timeRemaining}
          </div>
        </div>
        </div>
      )}

      {/* Bottom: session progress — lifted above the bottom control row + sound tooltip on small screens */}
      <div className="pb-[calc(7rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-2">
        <div
          className="w-48 h-[2px] bg-still-white/18 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(sessionProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Session progress"
        >
          <div
            className="h-full w-full origin-left rounded-full transition-transform duration-300"
            style={{
              transform: `scaleX(${sessionProgress})`,
              backgroundColor: currentPhase.color,
              opacity: 0.7,
            }}
          />
        </div>
        {!settled && (
          <p
            className="text-still-white/62 text-xs tracking-[0.15em] uppercase font-light mt-1"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            ~{minutesLeft} min remaining
          </p>
        )}
        <p className="hidden sm:block text-still-white/55 text-xs tracking-[0.1em] font-light mt-1" aria-hidden="true">
          space · pause &nbsp;·&nbsp; esc · exit
        </p>
      </div>
    </div>
  );
}
