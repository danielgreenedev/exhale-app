'use client';

import { useEffect, useRef, useState, useMemo, Suspense } from 'react';
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

  // Read orb scale once from localStorage — set on the home screen, not changed mid-session
  const orbScale = useMemo<number>(() => {
    try { return parseFloat(localStorage.getItem('exhale-orb-scale') ?? '1') || 1; } catch { return 1; }
  }, []);

  const [audioActive, setAudioActive] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [showExitGuard, setShowExitGuard] = useState(false);
  // Settling: count-in before first breath. Skipped when resuming.
  const [settling, setSettling] = useState(initialElapsed === 0);
  const [settleOpacity, setSettleOpacity] = useState(0);
  const [settleSubOpacity, setSettleSubOpacity] = useState(0);
  const [sessionSaveError, setSessionSaveError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  const prevPhaseIndexRef = useRef(-1);
  const audioStartedRef = useRef(false);
  const sessionSavedRef = useRef(false);

  // Detect fullscreen support (not available on iOS Safari)
  useEffect(() => {
    setFullscreenSupported(!!document.documentElement.requestFullscreen);
  }, []);

  // Fullscreen state sync
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Clear stale resume state on mount
  useEffect(() => {
    clearResumeState();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Count-in settle, then start session
  useEffect(() => {
    if (initialElapsed > 0) {
      // Resuming — start immediately, no settle
      start();
      return;
    }
    const fadeIn    = setTimeout(() => setSettleOpacity(1), 50);
    const subFadeIn = setTimeout(() => setSettleSubOpacity(1), 1100);
    const fadeOut   = setTimeout(() => { setSettleOpacity(0); setSettleSubOpacity(0); }, 2800);
    const end       = setTimeout(() => { setSettling(false); start(); }, 3500);
    return () => { clearTimeout(fadeIn); clearTimeout(subFadeIn); clearTimeout(fadeOut); clearTimeout(end); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      stopAmbient(5.0);
      setAudioActive(false);
      const saved = saveSession({
        date: new Date().toISOString().split('T')[0],
        duration: sessionDuration,
        cycles: totalCycles,
        length: lengthParam,
      });
      if (!saved) setSessionSaveError(true);
    }
  }, [sessionState, stopAmbient, saveSession, sessionDuration, totalCycles, lengthParam]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && sessionState !== 'complete' && !settling) {
        e.preventDefault();
        if (sessionState === 'running') {
          pause();
          pauseAmbient();
        } else if (sessionState === 'paused') {
          start();
          resumeAmbient();
        }
      }
      if (e.code === 'KeyF' && fullscreenSupported) {
        toggleFullscreen();
      }
      if (e.code === 'Escape' && sessionState !== 'complete' && !settling) {
        // Let the browser handle fullscreen exit; don't also show exit guard
        if (document.fullscreenElement) return;
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
  }, [sessionState, settling, pause, start, pauseAmbient, resumeAmbient, fullscreenSupported, showExitGuard]);

  const doExit = () => {
    if (sessionState === 'running' || sessionState === 'paused') {
      saveResumeState(lengthParam, elapsedTotal);
    }
    stopAmbient();
    setAudioActive(false);
    router.push('/');
  };

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
        storageNote={sessionSaveError}
        onRestart={() => {
          reset();
          sessionSavedRef.current = false;
          sessionSaveError && setSessionSaveError(false);
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
          orbScale={orbScale}
        />
      </div>

      {/* HUD overlay — hidden during the count-in so it doesn't clash with "Settle in" */}
      {!settling && (
        <GameHUD
          currentPhase={currentPhase}
          timeRemaining={timeRemaining}
          cycleNumber={cycleNumber}
          totalCycles={totalCycles}
          sessionProgress={sessionProgress}
          audioActive={audioActive}
        />
      )}

      {/* Settle-in overlay — fades in heading first, then subtitle, then both fade before breathing starts */}
      {settling && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none z-10">
          <p
            className="text-white/70 text-2xl tracking-[0.3em] uppercase font-extralight"
            style={{ opacity: settleOpacity, transition: 'opacity 0.7s ease', textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}
          >
            Settle in
          </p>
          <p
            className="text-white/32 text-xs tracking-[0.22em] font-light"
            style={{ opacity: settleSubOpacity, transition: 'opacity 0.7s ease', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
          >
            breathe naturally
          </p>
        </div>
      )}

      {/* Pause/Resume button — bottom left */}
      {!settling && (sessionState === 'running' || sessionState === 'paused') && (
        <button
          onClick={handleTogglePause}
          className="absolute bottom-6 left-6 text-white/65 hover:text-white/90 text-xs tracking-[0.2em] uppercase font-light border border-white/18 hover:border-white/35 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all duration-300"
          aria-label={sessionState === 'paused' ? 'Resume session' : 'Pause session'}
        >
          {sessionState === 'paused' ? 'Resume' : 'Pause'}
        </button>
      )}

      {/* Exit button — bottom right */}
      {!settling && (
        <button
          onClick={doExit}
          className="absolute bottom-6 right-6 text-white/45 hover:text-white/75 text-xs tracking-[0.2em] uppercase font-light border border-white/18 hover:border-white/35 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all duration-300"
          aria-label="Exit session"
        >
          ← Exit
        </button>
      )}

      {/* Paused — tap anywhere on overlay or press Space to resume */}
      {sessionState === 'paused' && !showExitGuard && !settling && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handleTogglePause}
        >
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <p
              className="text-white/55 text-sm tracking-[0.4em] uppercase font-extralight"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            >
              Paused
            </p>
            <p
              className="text-white/38 text-xs tracking-[0.18em] font-light"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            >
              tap · space to resume
            </p>
          </div>
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

      {/* Fullscreen toggle — top right (hidden on iOS Safari) */}
      {fullscreenSupported && !showExitGuard && !settling && (
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="absolute top-6 right-6 text-white/30 hover:text-white/65 transition-colors duration-300 p-1"
        >
          {isFullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="10" y1="14" x2="3" y2="21" />
              <line x1="21" y1="3" x2="14" y2="10" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          )}
        </button>
      )}

      {/* Exit guard overlay */}
      {showExitGuard && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/65 z-20"
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
