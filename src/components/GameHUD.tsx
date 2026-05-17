'use client';

import { PhaseConfig, CYCLE_DURATION } from '@/lib/breathing';

interface Props {
  currentPhase: PhaseConfig;
  timeRemaining: number;
  cycleNumber: number;
  totalCycles: number;
  sessionProgress: number;
  audioActive: boolean;
}

export default function GameHUD({
  currentPhase,
  timeRemaining,
  cycleNumber,
  totalCycles,
  sessionProgress,
  audioActive,
}: Props) {
  const minutesLeft = Math.ceil(((totalCycles - cycleNumber + 1) * CYCLE_DURATION) / 60);
  const settled = cycleNumber >= 2;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none select-none">
      {/* Top: cycle count + audio indicator */}
      <div className="pt-8 w-full flex items-start justify-center relative">
        <p
          className="text-white/60 text-sm tracking-[0.2em] uppercase font-light"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
          aria-live="polite"
          aria-label={`Breath ${cycleNumber} of ${totalCycles}`}
        >
          Breath {cycleNumber} of {totalCycles}
        </p>
        <div
          className="absolute right-6 top-0"
          aria-label={audioActive ? 'Audio on' : 'Audio off'}
          title={audioActive ? 'Audio on' : 'Audio off'}
        >
          {audioActive ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-40">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
              <path
                d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-20">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
              <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Center: phase label + instruction + countdown — float in space, no backdrop */}
      <div className="flex flex-col items-center gap-0 translate-y-[110px] landscape:translate-y-[60px]">
        <div className="flex flex-col items-center gap-3 px-10">
          <h2
            className="text-3xl font-semibold tracking-[0.3em] uppercase text-white"
            style={{
              textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
              opacity: settled ? 0.55 : 1,
              transition: 'opacity 4s ease',
            }}
            aria-live="polite"
          >
            {currentPhase.label}
          </h2>

          <p
            className="text-white text-sm tracking-wide font-normal text-center"
            style={{
              textShadow: '0 1px 10px rgba(0,0,0,0.85)',
              opacity: settled ? 0.28 : 0.78,
              transition: 'opacity 5s ease',
            }}
          >
            {currentPhase.instruction}
          </p>

          <div
            className="text-6xl font-thin tabular-nums text-white/90 mt-1"
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
              opacity: settled ? 0 : 1,
              transition: 'opacity 4s ease',
            }}
            role="timer"
            aria-hidden={settled ? 'true' : undefined}
            aria-label={settled ? undefined : `${timeRemaining} seconds remaining`}
          >
            {timeRemaining}
          </div>
        </div>
      </div>

      {/* Bottom: session progress */}
      <div className="pb-10 flex flex-col items-center gap-2">
        <div
          className="w-48 h-[2px] bg-white/15 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(sessionProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Session progress"
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${sessionProgress * 100}%`,
              backgroundColor: currentPhase.color,
              opacity: 0.7,
            }}
          />
        </div>
        <p
          className="text-white/50 text-xs tracking-[0.15em] uppercase font-light mt-1"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
        >
          ~{minutesLeft} min remaining
        </p>
        <p className="text-white/22 text-xs tracking-[0.1em] font-light mt-1" aria-hidden="true">
          space · pause &nbsp;·&nbsp; esc · exit
        </p>
      </div>
    </div>
  );
}
