'use client';

import { PhaseConfig } from '@/lib/breathing';

interface Props {
  currentPhase: PhaseConfig;
  timeRemaining: number;
  cycleNumber: number;
  totalCycles: number;
  sessionProgress: number;
}

export default function GameHUD({
  currentPhase,
  timeRemaining,
  cycleNumber,
  totalCycles,
  sessionProgress,
}: Props) {
  const minutesLeft = Math.ceil(((totalCycles - cycleNumber + 1) * 16) / 60);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none select-none">
      {/* Top: cycle count */}
      <div className="pt-8 text-center">
        <p className="text-white/30 text-sm tracking-[0.2em] uppercase font-light">
          Breath {cycleNumber} of {totalCycles}
        </p>
      </div>

      {/* Center: phase label + countdown — positioned below orb center */}
      <div className="flex flex-col items-center gap-3 translate-y-[110px]">
        <h2
          className="text-4xl font-extralight tracking-[0.35em] uppercase transition-all duration-700"
          style={{ color: currentPhase.color }}
        >
          {currentPhase.label}
        </h2>
        <p className="text-white/45 text-sm tracking-widest font-light">
          {currentPhase.instruction}
        </p>
        <div
          className="text-6xl font-thin tabular-nums transition-colors duration-700"
          style={{ color: currentPhase.color, opacity: 0.7 }}
        >
          {timeRemaining}
        </div>
      </div>

      {/* Bottom: session time remaining */}
      <div className="pb-10 flex flex-col items-center gap-2">
        <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${sessionProgress * 100}%`,
              backgroundColor: currentPhase.color,
              opacity: 0.5,
            }}
          />
        </div>
        <p className="text-white/20 text-xs tracking-[0.15em] uppercase font-light mt-1">
          ~{minutesLeft} min remaining
        </p>
      </div>
    </div>
  );
}
