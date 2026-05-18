'use client';

import { useCallback, useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BreathingOrb from '@/components/BreathingOrb';
import GameHUD from '@/components/GameHUD';
import SessionComplete from '@/components/SessionComplete';
import { useBreathingSession } from '@/hooks/useBreathingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useSessionStats } from '@/hooks/useSessionStats';
import { SessionLength, BREATHING_PATTERN } from '@/lib/breathing';
import { useUserId } from '@/lib/auth';
import { logAppEvent } from '@/lib/appEvents';
import {
  DEFAULT_SOUND_PALETTE,
  isSoundPaletteId,
  SOUND_STORAGE_KEY,
  SoundPaletteId,
} from '@/lib/sound';

const RESUME_KEY = 'exhale-resume';
const SETTLE_DURATION_MS = 8000;

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
  const isFirstVisit = searchParams.get('first') === '1';
  const orbParam = parseFloat(searchParams.get('orb') ?? '');
  const soundParam = searchParams.get('sound');

  const {
    sessionState,
    currentPhase,
    phaseIndex,
    sessionProgress,
    cycleNumber,
    totalCycles,
    timeRemaining,
    elapsedTotal,
    elapsedRef,
    sessionDuration,
    start,
    pause,
    reset,
  } = useBreathingSession(lengthParam, initialElapsed);

  const { saveSession } = useSessionStats();
  const userId = useUserId();

  // Read orb scale once from localStorage — set on the home screen, not changed mid-session
  const orbScale = useMemo<number>(() => {
    if (Number.isFinite(orbParam) && orbParam >= 0.75 && orbParam <= 1.25) return orbParam;
    try { return parseFloat(localStorage.getItem('exhale-orb-scale') ?? '1') || 1; } catch { return 1; }
  }, [orbParam]);

  const soundPalette = useMemo<SoundPaletteId>(() => {
    if (isSoundPaletteId(soundParam)) return soundParam;
    try {
      const stored = localStorage.getItem(SOUND_STORAGE_KEY);
      return isSoundPaletteId(stored) ? stored : DEFAULT_SOUND_PALETTE;
    } catch {
      return DEFAULT_SOUND_PALETTE;
    }
  }, [soundParam]);

  const { startAmbient, stopAmbient, pauseAmbient, resumeAmbient, playCue } = useAudioEngine(soundPalette);

  const [audioActive, setAudioActive] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [showExitGuard, setShowExitGuard] = useState(false);
  // Settling: count-in before first breath. Skipped when resuming.
  const [settling, setSettling] = useState(initialElapsed === 0);
  const [sessionSaveError, setSessionSaveError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  const prevPhaseIndexRef = useRef(-1);
  const audioStartedRef = useRef(false);
  const sessionSavedRef = useRef(false);
  const sessionStartedEventRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);
  const exitGuardRef = useRef<HTMLDivElement>(null);
  const exitGuardResumeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const beginAudio = useCallback(async () => {
    if (audioStartedRef.current) return;

    audioStartedRef.current = true;
    try {
      const started = await startAmbient();
      setAudioActive(started);
      setShowAudioPrompt(false);
    } catch {
      audioStartedRef.current = false;
      setAudioActive(false);
      setShowAudioPrompt(soundPalette !== 'off');
    }
  }, [soundPalette, startAmbient]);

  const toggleAudio = useCallback(async () => {
    if (audioActive) {
      stopAmbient(0.5);
      setAudioActive(false);
      audioStartedRef.current = false;
    } else {
      audioStartedRef.current = false;
      await beginAudio();
    }
  }, [audioActive, stopAmbient, beginAudio]);

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

  const clearSettleTimer = useCallback(() => {
    if (settleTimerRef.current === null) return;

    window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = null;
  }, []);

  const startGuidedSession = useCallback(() => {
    clearSettleTimer();
    setSettling(false);
    start();
  }, [clearSettleTimer, start]);

  const scheduleGuidedStart = useCallback(() => {
    clearSettleTimer();
    settleTimerRef.current = window.setTimeout(startGuidedSession, SETTLE_DURATION_MS);
  }, [clearSettleTimer, startGuidedSession]);

  const handleExitGuardResume = useCallback(() => {
    setShowExitGuard(false);
    if (settling) {
      scheduleGuidedStart();
    } else if (sessionState === 'paused') {
      start();
      resumeAmbient();
    }
  }, [settling, scheduleGuidedStart, sessionState, start, resumeAmbient]);

  // Clear stale resume state on mount
  useEffect(() => {
    clearResumeState();
  }, []);

  // Count-in settle, then start session
  useEffect(() => {
    if (initialElapsed > 0) {
      // Resuming — start immediately, no settle
      setSettling(false);
      start();
      return;
    }
    scheduleGuidedStart();
    return clearSettleTimer;
  }, [clearSettleTimer, initialElapsed, scheduleGuidedStart, start]);

  // Start audio on first user interaction (autoplay policy)
  useEffect(() => {
    const handleInteract = () => {
      void beginAudio();
    };
    window.addEventListener('click', handleInteract, { once: true });
    window.addEventListener('touchstart', handleInteract, { once: true });
    window.addEventListener('keydown', handleInteract, { once: true });

    void beginAudio();

    return () => {
      window.removeEventListener('click', handleInteract);
      window.removeEventListener('touchstart', handleInteract);
      window.removeEventListener('keydown', handleInteract);
    };
  }, [beginAudio]);

  // Play phase cue when phase changes
  useEffect(() => {
    if (phaseIndex !== prevPhaseIndexRef.current && sessionState === 'running') {
      playCue(BREATHING_PATTERN[phaseIndex].phase);
      prevPhaseIndexRef.current = phaseIndex;
    }
  }, [phaseIndex, sessionState, playCue]);

  // Record a start only once the guided rhythm begins, not during the settle-in screen.
  useEffect(() => {
    if (sessionState !== 'running' || sessionStartedEventRef.current) return;

    sessionStartedEventRef.current = true;
    logAppEvent(userId, 'session_started', {
      length: lengthParam,
      duration: sessionDuration,
      cycles: totalCycles,
      resumed: initialElapsed > 0,
      initial_elapsed: Math.round(initialElapsed),
      sound: soundPalette,
      orb_scale: orbScale,
    });
  }, [sessionState, userId, lengthParam, sessionDuration, totalCycles, initialElapsed, soundPalette, orbScale]);

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
      logAppEvent(userId, 'session_complete', {
        duration: sessionDuration,
        cycles: totalCycles,
        length: lengthParam,
      });
    }
  }, [sessionState, stopAmbient, saveSession, sessionDuration, totalCycles, lengthParam, userId]);

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
      if (e.code === 'Escape' && sessionState !== 'complete') {
        // Let the browser handle fullscreen exit; don't also show exit guard
        if (document.fullscreenElement) return;
        if (showExitGuard) {
          handleExitGuardResume();
          return;
        }
        if (settling) { clearSettleTimer(); setShowExitGuard(true); return; }
        if (sessionState === 'running') { pause(); pauseAmbient(); }
        setShowExitGuard(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [sessionState, settling, pause, start, pauseAmbient, resumeAmbient, fullscreenSupported, showExitGuard, clearSettleTimer, handleExitGuardResume]);

  useEffect(() => {
    if (!showExitGuard) return;

    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    exitGuardResumeRef.current?.focus();

    const handleTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const dialog = exitGuardRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTrap);
    return () => {
      document.removeEventListener('keydown', handleTrap);
      restoreFocusRef.current?.focus();
    };
  }, [showExitGuard]);

  const doExit = () => {
    if (settling) {
      clearSettleTimer();
      logAppEvent(userId, 'session_exited', {
        length: lengthParam,
        elapsed: 0,
        duration: sessionDuration,
        cycles: totalCycles,
        phase: 'settle',
        started: false,
        resumed: false,
      });
    } else if (sessionState === 'running' || sessionState === 'paused') {
      const elapsed = Math.round(elapsedRef.current);
      saveResumeState(lengthParam, elapsedRef.current);
      logAppEvent(userId, 'session_exited', {
        length: lengthParam,
        elapsed,
        duration: sessionDuration,
        cycles: totalCycles,
        cycle_number: cycleNumber,
        phase: currentPhase.phase,
        resumed: initialElapsed > 0,
      });
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

  const requestExit = () => {
    if (settling) {
      clearSettleTimer();
      setShowExitGuard(true);
      return;
    }
    if (sessionState === 'running') {
      pause();
      pauseAmbient();
    }
    setShowExitGuard(true);
  };

  if (sessionState === 'complete') {
    return (
      <SessionComplete
        totalCycles={totalCycles}
        sessionDuration={sessionDuration}
        storageNote={sessionSaveError}
        onRestart={() => router.push(`/?length=${lengthParam}`)}
        onMenu={() => router.push('/')}
      />
    );
  }

  return (
    <main className="relative w-screen h-screen bg-forest-night overflow-hidden" data-exhale-game data-settled={settling ? 'false' : 'true'}>
      {/* Canvas fills the whole screen */}
      <div className="absolute inset-0">
        <BreathingOrb
          currentPhase={currentPhase}
          elapsedRef={elapsedRef}
          sessionDuration={sessionDuration}
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
          audioPrompt={showAudioPrompt}
          centerHidden={sessionState === 'paused'}
          onToggleAudio={soundPalette !== 'off' ? toggleAudio : undefined}
        />
      )}

      {/* Settle-in overlay — fades in heading first, then subtitle, then both fade before breathing starts */}
      {settling && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none z-10 transition-opacity duration-700" data-exhale-settle aria-live="polite">
          <p
            className="exhale-settle-title text-still-white/78 text-2xl tracking-[0.3em] uppercase font-extralight"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}
          >
            Settle in
          </p>
          <p
            className="exhale-settle-subtitle text-still-white/58 text-xs tracking-[0.22em] font-light"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
          >
            breathe normally
          </p>
          {isFirstVisit && (
            <p
              className="exhale-settle-hint absolute bottom-16 text-still-white/52 text-[10px] tracking-[0.18em] font-light"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            >
              the circle leads, just follow
            </p>
          )}
        </div>
      )}

      {/* Pause/Resume button — bottom left */}
      {!settling && (sessionState === 'running' || sessionState === 'paused') && (
        <button
          onClick={handleTogglePause}
          className="absolute bottom-6 left-6 min-h-11 min-w-20 text-still-white/72 hover:text-still-white/92 text-xs tracking-[0.2em] uppercase font-light border border-still-white/22 hover:border-still-white/38 hover:bg-still-white/5 px-4 py-2 rounded-lg transition-all duration-300"
          aria-label={sessionState === 'paused' ? 'Resume session' : 'Pause session'}
        >
          {sessionState === 'paused' ? 'Resume' : 'Pause'}
        </button>
      )}

      {/* Exit button — bottom right */}
      {!showExitGuard && (settling || sessionState === 'running' || sessionState === 'paused') && (
        <button
          onClick={requestExit}
          className={`absolute bottom-6 right-6 min-h-11 min-w-20 text-xs tracking-[0.2em] uppercase font-light border px-4 py-2 rounded-lg transition-all duration-300 ${settling ? 'text-still-white/48 hover:text-still-white/72 border-still-white/16 hover:border-still-white/30 hover:bg-still-white/5' : 'text-still-white/62 hover:text-still-white/82 border-still-white/22 hover:border-still-white/38 hover:bg-still-white/5'}`}
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
              className="text-still-white/64 text-sm tracking-[0.4em] uppercase font-extralight"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            >
              Paused
            </p>
            <p
              className="text-still-white/58 text-xs tracking-[0.18em] font-light"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            >
              tap · space to resume
            </p>
          </div>
        </div>
      )}


      {/* Fullscreen toggle — top right (hidden on iOS Safari) */}
      {fullscreenSupported && !showExitGuard && !settling && (
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="absolute top-6 right-6 min-h-11 min-w-11 flex items-center justify-center rounded-lg text-still-white/58 hover:text-still-white/82 hover:bg-still-white/5 transition-colors duration-300"
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
          className="absolute inset-0 flex items-center justify-center bg-forest-night/85 z-20"
          onClick={handleExitGuardResume}
        >
          <div
            ref={exitGuardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-guard-title"
            aria-describedby="exit-guard-description"
            className="flex flex-col items-center gap-8 px-10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <p
                id="exit-guard-title"
                className="text-still-white/90 text-xl font-extralight tracking-[0.25em] uppercase"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
              >
                Leave this session?
              </p>
              <p
                id="exit-guard-description"
                className="text-still-white/62 text-xs tracking-[0.1em] font-light"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                {settling ? 'You can come back whenever you are ready.' : 'Your progress is saved for 60 seconds.'}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-52">
              <button
                ref={exitGuardResumeRef}
                onClick={handleExitGuardResume}
                className="w-full min-h-11 py-4 rounded-2xl border border-emerald-pulse/45 bg-emerald-pulse/10 text-emerald-100/95 text-sm tracking-[0.22em] uppercase font-light hover:bg-emerald-pulse/18 hover:border-emerald-pulse/65 transition-all duration-300"
              >
                Resume
              </button>
              <button
                onClick={() => { setShowExitGuard(false); doExit(); }}
                className="w-full min-h-11 py-3 rounded-2xl text-still-white/62 text-sm tracking-[0.22em] uppercase font-light hover:text-still-white/80 hover:bg-still-white/5 transition-colors duration-300"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense>
      <GameContent />
    </Suspense>
  );
}
