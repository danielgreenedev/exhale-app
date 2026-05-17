'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BreathingOrb from '@/components/BreathingOrb';
import GameHUD from '@/components/GameHUD';
import SessionComplete from '@/components/SessionComplete';
import { useBreathingSession } from '@/hooks/useBreathingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useSessionStats } from '@/hooks/useSessionStats';
import { SessionLength, BREATHING_PATTERN } from '@/lib/breathing';

const RESUME_KEY = 'exhale-resume';

function saveResumeState(length: SessionLength, elapsed: number) {
  try {
    sessionStorage.setItem(RESUME_KEY, JSON.stringify({ length, elapsed, timestamp: Date.now() }));
  } catch {
    // sessionStorage unavailable
  }
}

function clearResumeState() {
  try { sessionStorage.removeItem(RESUME_KEY); } catch { /* unavailable */ }
}

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lengthParam = (searchParams.get('length') ?? 'medium') as SessionLength;
  const initialElapsed = Math.max(0, parseFloat(searchParams.get('resume') ?? '0') || 0);

  const {
    sessionState,
    currentPhase,
    phaseIndex,
    phaseProgress,
    sessionProgress,
    cycleNumber,
    totalCycles,
    timeRemaining,
    elapsedTotal,
    sessionDuration,
    start,
    pause,
    reset,
  } = useBreathingSession(lengthParam, initialElapsed);

  const { startAmbient, stopAmbient, pauseAmbient, resumeAmbient, playCue } = useAudioEngine();
  const { saveSession } = useSessionStats();

  const [audioActive, setAudioActive] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [showExitGuard, setShowExitGuard] = useState(false);
  const prevPhaseIndexRef = useRef(-1);
  const audioStartedRef = useRef(false);
  const sessionSavedRef = useRef(false);

  // Clear any stale resume state on mount (we're resuming or starting fresh)
  useEffect(() => {
    clearResumeState();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Start session immediately on mount
  useEffect(() => {
    start();
  }, [start]);

  // Start audio on first user interaction (autoplay policy)
  useEffect(() => {
    const handleInteract = () => {
      if (!audioStartedRef.current) {
        audioStartedRef.current = true;
        startAmbient();
        setAudioActive(true);
        setShowAudioPrompt(false);
      }
    };
    window.addEventListener('click', handleInteract, { once: true });
    window.addEventListener('touchstart', handleInteract, { once: true });
    window.addEventListener('keydown', handleInteract, { once: true });

    const tryAutoStart = async () => {
      try {
        startAmbient();
        audioStartedRef.current = true;
        setAudioActive(true);
      } catch {
        setShowAudioPrompt(true);
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

  // Save session and stop audio on complete
  useEffect(() => {
    if (sessionState === 'complete' && !sessionSavedRef.current) {
      sessionSavedRef.current = true;
      clearResumeState();
      stopAmbient();
      setAudioActive(false);
      saveSession({
        date: new Date().toISOString().split('T')[0],
        duration: sessionDuration,
        cycles: totalCycles,
        length: lengthParam,
      });
    }
  }, [sessionState, stopAmbient, saveSession, sessionDuration, totalCycles, lengthParam]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && sessionState !== 'complete') {
        e.preventDefault();
        if (sessionState === 'running') {
          pause();
          pauseAmbient();
        } else if (sessionState === 'paused') {
          start();
          resumeAmbient();
        }
      }
      if (e.code === 'Escape' && sessionState !== 'complete') {
        if (showExitGuard) {
          setShowExitGuard(false);
          if (sessionState === 'paused') { start(); resumeAmbient(); }
          return;
        }
        if (sessionState === 'running') { pause(); pauseAmbient(); }
        setShowExitGuard(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [sessionState, pause, start, pauseAmbient, resumeAmbient, stopAmbient, router, lengthParam, elapsedTotal, showExitGuard]);

  const doExit = () => {
    if (sessionState === 'running' || sessionState === 'paused') {
      saveResumeState(lengthParam, elapsedTotal);
    }
    stopAmbient();
    setAudioActive(false);
    router.push('/');
  };

  const handleExit = () => doExit();

  const handleTogglePause = () => {
    if (sessionState === 'running') {
      pause();
      pauseAmbient();
    } else if (sessionState === 'paused') {
      start();
      resumeAmbient();
    }
  };

  if (sessionState === 'complete') {
    return (
      <SessionComplete
        totalCycles={totalCycles}
        sessionDuration={sessionDuration}
        onRestart={() => {
          reset();
          sessionSavedRef.current = false;
          prevPhaseIndexRef.current = -1;
          setTimeout(() => {
            start();
            startAmbient();
            setAudioActive(true);
          }, 300);
        }}
        onMenu={() => router.push('/')}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen bg-[#090c0a] overflow-hidden">
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
        audioActive={audioActive}
      />

      {/* Pause/Resume button — top left */}
      {(sessionState === 'running' || sessionState === 'paused') && (
        <button
          onClick={handleTogglePause}
          className="absolute top-6 left-6 text-white/65 hover:text-white/90 text-xs tracking-[0.2em] uppercase font-light transition-colors duration-300"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          aria-label={sessionState === 'paused' ? 'Resume session' : 'Pause session'}
        >
          {sessionState === 'paused' ? '▶ Resume' : '⏸ Pause'}
        </button>
      )}

      {/* Exit button — top right */}
      <button
        onClick={handleExit}
        className="absolute top-6 right-6 text-white/45 hover:text-white/75 text-xs tracking-[0.2em] uppercase font-light transition-colors duration-300"
        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
        aria-label="Exit session"
      >
        ✕ Exit
      </button>

      {/* Paused indicator */}
      {sessionState === 'paused' && !showExitGuard && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white/25 text-sm tracking-[0.4em] uppercase font-extralight">
            Paused
          </p>
        </div>
      )}

      {/* Audio prompt — shown when autoplay is blocked */}
      {showAudioPrompt && (
        <p
          className="absolute bottom-28 left-0 right-0 text-center text-white/40 text-xs tracking-[0.14em] font-light pointer-events-none"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
        >
          tap anywhere to enable audio
        </p>
      )}

      {/* Exit guard overlay */}
      {showExitGuard && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 z-20"
          onClick={() => { setShowExitGuard(false); if (sessionState === 'paused') { start(); resumeAmbient(); } }}
        >
          <div
            className="flex flex-col items-center gap-8 px-10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <p
                className="text-white/88 text-xl font-extralight tracking-[0.25em] uppercase"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
              >
                Leave this session?
              </p>
              <p
                className="text-white/42 text-xs tracking-[0.1em] font-light"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                Your progress is saved for 60 seconds.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-52">
              <button
                onClick={() => { setShowExitGuard(false); if (sessionState === 'paused') { start(); resumeAmbient(); } }}
                className="w-full py-4 rounded-2xl border border-emerald-400/45 bg-emerald-400/10 text-emerald-200/90 text-sm tracking-[0.22em] uppercase font-light hover:bg-emerald-400/18 hover:border-emerald-400/65 transition-all duration-300"
              >
                Resume
              </button>
              <button
                onClick={() => { setShowExitGuard(false); doExit(); }}
                className="w-full py-3 rounded-2xl text-white/38 text-sm tracking-[0.22em] uppercase font-light hover:text-white/65 transition-colors duration-300"
              >
                Exit
              </button>
            </div>
          </div>
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
