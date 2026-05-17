'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BreathingOrb from '@/components/BreathingOrb';
import GameHUD from '@/components/GameHUD';
import SessionComplete from '@/components/SessionComplete';
import { useBreathingSession } from '@/hooks/useBreathingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { SessionLength, BREATHING_PATTERN } from '@/lib/breathing';

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lengthParam = (searchParams.get('length') ?? 'medium') as SessionLength;

  const {
    sessionState,
    currentPhase,
    phaseIndex,
    phaseProgress,
    sessionProgress,
    cycleNumber,
    totalCycles,
    timeRemaining,
    sessionDuration,
    start,
    reset,
  } = useBreathingSession(lengthParam);

  const { startAmbient, stopAmbient, playCue } = useAudioEngine();
  const prevPhaseIndexRef = useRef(-1);
  const audioStartedRef = useRef(false);

  // Start session on mount after brief intro
  useEffect(() => {
    const t = setTimeout(() => start(), 1200);
    return () => clearTimeout(t);
  }, [start]);

  // Start audio on first user interaction (autoplay policy)
  useEffect(() => {
    const handleInteract = () => {
      if (!audioStartedRef.current) {
        audioStartedRef.current = true;
        startAmbient();
      }
    };
    window.addEventListener('click', handleInteract, { once: true });
    window.addEventListener('touchstart', handleInteract, { once: true });
    window.addEventListener('keydown', handleInteract, { once: true });

    // Auto-start audio if allowed (some browsers permit it)
    const tryAutoStart = async () => {
      try {
        startAmbient();
        audioStartedRef.current = true;
      } catch {
        // Will be started on first interaction
      }
    };
    tryAutoStart();

    return () => {
      window.removeEventListener('click', handleInteract);
      window.removeEventListener('touchstart', handleInteract);
      window.removeEventListener('keydown', handleInteract);
    };
  }, [startAmbient]);

  // Play phase cue when phase changes
  useEffect(() => {
    if (phaseIndex !== prevPhaseIndexRef.current && sessionState === 'running') {
      playCue(BREATHING_PATTERN[phaseIndex].phase);
      prevPhaseIndexRef.current = phaseIndex;
    }
  }, [phaseIndex, sessionState, playCue]);

  // Fade out audio on complete
  useEffect(() => {
    if (sessionState === 'complete') {
      stopAmbient();
    }
  }, [sessionState, stopAmbient]);

  if (sessionState === 'complete') {
    return (
      <SessionComplete
        totalCycles={totalCycles}
        sessionDuration={sessionDuration}
        onRestart={() => {
          reset();
          prevPhaseIndexRef.current = -1;
          setTimeout(() => {
            start();
            startAmbient();
          }, 300);
        }}
        onMenu={() => router.push('/')}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen bg-[#05060f] overflow-hidden">
      {/* Canvas fills the whole screen */}
      <div className="absolute inset-0">
        <BreathingOrb
          currentPhase={currentPhase}
          phaseProgress={phaseProgress}
          sessionProgress={sessionProgress}
        />
      </div>

      {/* HUD overlay */}
      <GameHUD
        currentPhase={currentPhase}
        timeRemaining={timeRemaining}
        cycleNumber={cycleNumber}
        totalCycles={totalCycles}
        sessionProgress={sessionProgress}
      />

      {/* Exit button */}
      <button
        onClick={() => {
          stopAmbient();
          router.push('/');
        }}
        className="absolute top-6 right-6 text-white/20 hover:text-white/50 text-xs tracking-[0.2em] uppercase font-light transition-colors duration-300"
      >
        ✕ Exit
      </button>

      {/* Intro fade-in overlay */}
      {sessionState === 'idle' && (
        <div className="absolute inset-0 bg-[#05060f] flex items-center justify-center">
          <p className="text-white/40 text-sm tracking-[0.3em] uppercase font-light animate-pulse">
            Preparing...
          </p>
        </div>
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense>
      <GameContent />
    </Suspense>
  );
}
