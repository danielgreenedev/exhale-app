'use client';

interface Props {
  totalCycles: number;
  sessionDuration: number;
  onRestart: () => void;
  onMenu: () => void;
}

export default function SessionComplete({ totalCycles, sessionDuration, onRestart, onMenu }: Props) {
  const minutes = Math.floor(sessionDuration / 60);
  const seconds = sessionDuration % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#05060f] text-white px-8">
      <div className="flex flex-col items-center gap-8 max-w-sm text-center animate-fade-in">
        {/* Glowing orb icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-300/80 to-teal-500/60 shadow-[0_0_60px_rgba(45,212,191,0.4)]" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase text-teal-300/90">
            Complete
          </h1>
          <p className="text-white/50 text-base font-light leading-relaxed">
            You completed {totalCycles} breath cycles
          </p>
          <p className="text-white/30 text-sm tracking-widest">
            {minutes}:{seconds.toString().padStart(2, '0')} of calm
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full mt-4">
          <p className="text-white/35 text-sm font-light italic">
            "The quieter you become, the more you can hear."
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full mt-2">
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl border border-teal-400/30 text-teal-300/80 text-sm tracking-[0.2em] uppercase font-light hover:border-teal-400/60 hover:text-teal-300 hover:bg-teal-400/5 transition-all duration-300"
          >
            Breathe Again
          </button>
          <button
            onClick={onMenu}
            className="w-full py-4 rounded-2xl text-white/25 text-sm tracking-[0.2em] uppercase font-light hover:text-white/50 transition-all duration-300"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
