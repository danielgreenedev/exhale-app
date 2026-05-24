'use client';

import { useCallback, useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BreathingOrb from '@/components/BreathingOrb';
import GameHUD from '@/components/GameHUD';
import SessionComplete from '@/components/SessionComplete';
import { useBreathingSession } from '@/hooks/useBreathingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useSessionStats } from '@/hooks/useSessionStats';
import {
  DEFAULT_ORB_SCALE,
  DEFAULT_RHYTHM,
  DEFAULT_SESSION_LENGTH,
  RHYTHMS,
  RHYTHM_STORAGE_KEY,
  SessionLength,
  getRhythm,
  isRhythmId,
} from '@/lib/breathing';
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
const SILENT_MODE_HINT_MS = 5000;

function shouldOfferSilentModeHint() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
}

function isMetaInAppBrowser() {
  if (typeof navigator === 'undefined') return false;
  return /(FBAN|FBAV|FB_IAB|FB4A|FBIOS|MessengerForiOS|MessengerLite|FBAN\/Messenger|FB_IAB\/MESSENGER|Orca)/i.test(navigator.userAgent);
}

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

function SoundOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" opacity="0.78" />
      <path
        d="M17.2 8.7a4.7 4.7 0 0 1 0 6.6M20.4 5.5a9.2 9.2 0 0 1 0 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.72"
      />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" opacity="0.62" />
      <path
        d="m18 9 4 4m0-4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.72"
      />
    </svg>
  );
}

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lengthParam = (searchParams.get('length') ?? DEFAULT_SESSION_LENGTH) as SessionLength;
  const initialElapsed = Math.max(0, parseFloat(searchParams.get('resume') ?? '0') || 0);
  const isFirstVisit = searchParams.get('first') === '1';
  const orbParam = parseFloat(searchParams.get('orb') ?? '');
  const soundParam = searchParams.get('sound');
  const rhythmParam = searchParams.get('rhythm');

  // URL param wins so a deep-linked /game?rhythm=gentle starts in that rhythm.
  // Otherwise read whatever was last saved on this device. Falls back to standard.
  const rhythm = useMemo(() => {
    if (isRhythmId(rhythmParam)) return RHYTHMS[rhythmParam];
    try {
      const stored = localStorage.getItem(RHYTHM_STORAGE_KEY);
      return getRhythm(stored);
    } catch {
      return RHYTHMS[DEFAULT_RHYTHM];
    }
  }, [rhythmParam]);

  const {
    sessionState,
    currentPhase,
    phaseIndex,
    sessionProgress,
    cycleNumber,
    totalCycles,
    timeRemaining,
    nextPhase,
    phaseLeadProgress,
    elapsedTotal,
    elapsedRef,
    sessionDuration,
    start,
    pause,
    reset,
    totalPhasesCompleted,
  } = useBreathingSession(lengthParam, initialElapsed, rhythm);

  const { saveSession } = useSessionStats();
  const userId = useUserId();

  // Read orb scale once from localStorage — set on the home screen, not changed mid-session
  const orbScale = useMemo<number>(() => {
    if (Number.isFinite(orbParam) && orbParam >= 0.75 && orbParam <= 1.25) return orbParam;
    try { return parseFloat(localStorage.getItem('exhale-orb-scale') ?? String(DEFAULT_ORB_SCALE)) || DEFAULT_ORB_SCALE; } catch { return DEFAULT_ORB_SCALE; }
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

  const {
    startAmbient,
    stopAmbient,
    scheduleAmbientStop,
    pauseAmbient,
    resumeAmbient,
    playCue,
    playAnticipationCue,
  } = useAudioEngine(soundPalette, rhythm);

  const [audioActive, setAudioActive] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [showExitGuard, setShowExitGuard] = useState(false);
  // Settling: count-in before first breath. Skipped when resuming.
  const [settling, setSettling] = useState(initialElapsed === 0);
  const [sessionSaveError, setSessionSaveError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [metaInAppBrowser, setMetaInAppBrowser] = useState(false);
  const [showSilentModeHint, setShowSilentModeHint] = useState(false);

  const prevPhaseIndexRef = useRef(-1);
  const anticipationCueRef = useRef(-1);
  const audioStartedRef = useRef(false);
  const silentModeHintShownRef = useRef(false);
  const sessionSavedRef = useRef(false);
  const sessionStartedEventRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);
  const silentHintTimerRef = useRef<number | null>(null);
  const exitGuardRef = useRef<HTMLDivElement>(null);
  const exitGuardResumeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const showSilentModeHintBriefly = useCallback(() => {
    setShowSilentModeHint(true);
    if (silentHintTimerRef.current !== null) window.clearTimeout(silentHintTimerRef.current);
    silentHintTimerRef.current = window.setTimeout(() => {
      setShowSilentModeHint(false);
      silentHintTimerRef.current = null;
    }, SILENT_MODE_HINT_MS);
  }, []);

  const beginAudio = useCallback(async () => {
    if (audioStartedRef.current) return;

    audioStartedRef.current = true;
    try {
      const started = await startAmbient();
      setAudioActive(started);
      if (!started) {
        audioStartedRef.current = false;
        setShowAudioPrompt(soundPalette !== 'off');
        return;
      }
      setShowAudioPrompt(false);
    } catch {
      audioStartedRef.current = false;
      setAudioActive(false);
      setShowAudioPrompt(soundPalette !== 'off');
    }
  }, [soundPalette, startAmbient]);

  const toggleAudio = useCallback(async () => {
    if (audioActive) {
      setShowSilentModeHint(false);
      if (silentHintTimerRef.current !== null) {
        window.clearTimeout(silentHintTimerRef.current);
        silentHintTimerRef.current = null;
      }
      stopAmbient(0.5);
      setAudioActive(false);
      audioStartedRef.current = false;
    } else {
      audioStartedRef.current = false;
      await beginAudio();
      showSilentModeHintBriefly();
    }
  }, [audioActive, stopAmbient, beginAudio, showSilentModeHintBriefly]);

  // Detect fullscreen support and known in-app browser limitations.
  useEffect(() => {
    const inMetaPreview = isMetaInAppBrowser();
    setMetaInAppBrowser(inMetaPreview);
    setFullscreenSupported(!inMetaPreview && !!document.documentElement.requestFullscreen);
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
      if (silentHintTimerRef.current !== null) {
        window.clearTimeout(silentHintTimerRef.current);
        silentHintTimerRef.current = null;
      }
    };
  }, [beginAudio]);

  useEffect(() => {
    if (settling || !audioActive || soundPalette === 'off') return;
    if (silentModeHintShownRef.current || !shouldOfferSilentModeHint()) return;

    silentModeHintShownRef.current = true;
    showSilentModeHintBriefly();
  }, [audioActive, settling, showSilentModeHintBriefly, soundPalette]);

  // Give the Web Audio clock its own completion deadline so ambient sound fades out even
  // when Chrome throttles React/RAF work in a background tab.
  useEffect(() => {
    if (sessionState !== 'running' || !audioActive) return;

    const remainingSeconds = Math.max(0, sessionDuration - elapsedRef.current);
    scheduleAmbientStop(remainingSeconds, 1.0);
  }, [audioActive, elapsedRef, scheduleAmbientStop, sessionDuration, sessionState]);

  // Play phase cue when phase changes
  useEffect(() => {
    if (phaseIndex !== prevPhaseIndexRef.current && sessionState === 'running') {
      playCue(rhythm.pattern[phaseIndex].phase);
      prevPhaseIndexRef.current = phaseIndex;
      anticipationCueRef.current = -1;
    }
  }, [phaseIndex, sessionState, playCue, rhythm]);

  // Soft pre-cue in the last beat before the next phase so the transition is less sudden.
  useEffect(() => {
    if (sessionState !== 'running' || phaseLeadProgress <= 0) return;
    if (anticipationCueRef.current === totalPhasesCompleted) return;

    playAnticipationCue(nextPhase.phase);
    anticipationCueRef.current = totalPhasesCompleted;
  }, [sessionState, phaseLeadProgress, totalPhasesCompleted, nextPhase, playAnticipationCue]);

  // Record a start only once the guided rhythm begins, not during the settle-in screen.
  useEffect(() => {
    if (sessionState !== 'running' || sessionStartedEventRef.current) return;

    sessionStartedEventRef.current = true;
    logAppEvent(userId, 'session_started', {
      length: lengthParam,
      rhythm: rhythm.id,
      duration: sessionDuration,
      cycles: totalCycles,
      resumed: initialElapsed > 0,
      initial_elapsed: Math.round(initialElapsed),
      sound: soundPalette,
      orb_scale: orbScale,
    });
  }, [sessionState, userId, lengthParam, rhythm, sessionDuration, totalCycles, initialElapsed, soundPalette, orbScale]);

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
        rhythm: rhythm.id,
      });
    }
  }, [sessionState, stopAmbient, saveSession, sessionDuration, totalCycles, lengthParam, rhythm, userId]);

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
        rhythm: rhythm.id,
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
        rhythm: rhythm.id,
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
        sessionLength={lengthParam}
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
          rhythm={rhythm}
        />
      </div>

      {/* HUD overlay — hidden during the count-in so it doesn't clash with "Settle in" */}
      {!settling && (
        <GameHUD
          currentPhase={currentPhase}
          timeRemaining={timeRemaining}
          cycleNumber={cycleNumber}
          totalCycles={totalCycles}
          centerHidden={sessionState === 'paused'}
          rhythm={rhythm}
        />
      )}

      {/* Settle-in overlay — aligned to the phase HUD so it feels like the first instruction state */}
      {settling && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-between pointer-events-none select-none transition-opacity duration-700" data-exhale-settle aria-live="polite">
          <div className="pt-8 w-full flex items-start justify-center relative" aria-hidden="true">
            <p className="invisible text-sm tracking-[0.2em] uppercase font-light">Breath 1 of 1</p>
          </div>
          <div className="flex w-full max-w-[calc(100vw-2rem)] translate-y-[clamp(46px,12vh,100px)] flex-col items-center gap-1.5 px-4 landscape:translate-y-[clamp(28px,7vh,56px)]">
            <p
              className="exhale-settle-title text-center text-3xl font-semibold tracking-[0.3em] uppercase text-still-white"
              style={{ textShadow: '0 2px 16px rgba(15,23,18,0.85), 0 1px 4px rgba(15,23,18,0.9)' }}
            >
              Settling in
            </p>
            <p
              className="exhale-settle-subtitle min-h-8 max-w-[27rem] px-1 text-center text-sm font-light leading-snug tracking-[0.04em] text-still-white"
              style={{ textShadow: '0 2px 14px rgba(15,23,18,0.92), 0 1px 4px rgba(15,23,18,0.9)' }}
            >
              Breathe normally
            </p>
            <div className="invisible mt-0 text-6xl font-thin tabular-nums text-still-white/92" aria-hidden="true">
              4
            </div>
          </div>
          <div className="pb-[calc(7rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-1.5">
            <p
              className={`exhale-settle-hint max-w-[17rem] px-4 text-center text-xs leading-relaxed tracking-[0.04em] font-light ${isFirstVisit ? 'text-still-white/68' : 'invisible'}`}
              style={{ textShadow: '0 1px 8px rgba(15,23,18,0.75)' }}
            >
              Inhale, hold, exhale, then breathe naturally.
            </p>
          </div>
        </div>
      )}

      {/* Pause/Resume button — bottom left */}
      {!settling && (sessionState === 'running' || sessionState === 'paused') && (
        <button
          onClick={handleTogglePause}
          className="absolute bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.75rem))] left-6 min-h-11 min-w-20 text-still-white/72 hover:text-still-white/92 text-xs tracking-[0.2em] uppercase font-light border border-still-white/22 hover:border-still-white/38 hover:bg-still-white/5 px-4 py-2 rounded-lg transition-all duration-300"
          aria-label={sessionState === 'paused' ? 'Resume session' : 'Pause session'}
        >
          {sessionState === 'paused' ? 'Resume' : 'Pause'}
        </button>
      )}

      {/* Exit button — bottom right */}
      {!showExitGuard && (settling || sessionState === 'running' || sessionState === 'paused') && (
        <button
          onClick={requestExit}
          className={`absolute bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.75rem))] right-6 min-h-11 min-w-20 text-xs tracking-[0.2em] uppercase font-light border px-4 py-2 rounded-lg transition-all duration-300 ${settling ? 'text-still-white/55 hover:text-still-white/75 border-still-white/18 hover:border-still-white/30 hover:bg-still-white/5' : 'text-still-white/62 hover:text-still-white/82 border-still-white/22 hover:border-still-white/38 hover:bg-still-white/5'}`}
          aria-label="Exit session"
        >
          ← Exit
        </button>
      )}

      {/* Sound toggle — bottom center, away from fullscreen */}
      {!showExitGuard && !settling && (sessionState === 'running' || sessionState === 'paused') && (
        <div className="absolute bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.75rem))] left-1/2 z-10 -translate-x-1/2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (soundPalette !== 'off') void toggleAudio();
            }}
            onKeyDown={(e) => e.stopPropagation()}
            disabled={soundPalette === 'off'}
            aria-label={
              soundPalette === 'off'
                ? 'Sound is off from Session setup'
                : audioActive
                  ? 'Turn sound off'
                  : 'Turn sound on'
            }
            aria-pressed={soundPalette !== 'off' ? audioActive : false}
            title={
              soundPalette === 'off'
                ? 'Sound is off from Session setup'
                : audioActive
                  ? 'Turn sound off'
                  : 'Turn sound on'
            }
            className={`min-h-11 min-w-11 rounded-lg border transition-all duration-300 flex items-center justify-center ${
              audioActive
                ? 'border-emerald-pulse/34 bg-emerald-pulse/10 text-emerald-100/90 hover:border-emerald-pulse/52 hover:bg-emerald-pulse/15'
                : 'border-still-white/22 text-still-white/62 hover:border-still-white/38 hover:bg-still-white/5 hover:text-still-white/82'
            } disabled:pointer-events-none disabled:border-still-white/12 disabled:text-still-white/40`}
          >
            {audioActive ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
          {(showAudioPrompt || showSilentModeHint) && soundPalette !== 'off' && (
            <p
              className="absolute bottom-full left-1/2 mb-2 w-max max-w-[13rem] -translate-x-1/2 text-center text-[11px] font-light tracking-[0.04em] text-still-white/62"
              style={{ textShadow: '0 1px 6px rgba(15,23,18,0.65)' }}
            >
              {showAudioPrompt ? 'tap for sound' : 'still quiet? check silent mode'}
            </p>
          )}
        </div>
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
              style={{ textShadow: '0 1px 8px rgba(15,23,18,0.7)' }}
            >
              Paused
            </p>
            <p
              className="text-still-white/58 text-xs tracking-[0.18em] font-light"
              style={{ textShadow: '0 1px 6px rgba(15,23,18,0.6)' }}
            >
              tap · space to resume
            </p>
          </div>
        </div>
      )}


      {/* Fullscreen toggle — top right (hidden on iOS Safari) */}
      {metaInAppBrowser && !showExitGuard && !settling && (
        <p
          className="absolute right-5 top-20 max-w-[10.5rem] text-right text-[10px] font-light uppercase leading-snug tracking-[0.1em] text-still-white/55"
          style={{ textShadow: '0 1px 8px rgba(15,23,18,0.72)' }}
        >
          Tap menu to open in browser for sound or fullscreen
        </p>
      )}

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
                style={{ textShadow: '0 2px 12px rgba(15,23,18,0.8)' }}
              >
                Leave this session?
              </p>
              <p
                id="exit-guard-description"
                className="text-still-white/62 text-xs tracking-[0.04em] font-light"
                style={{ textShadow: '0 1px 6px rgba(15,23,18,0.6)' }}
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
