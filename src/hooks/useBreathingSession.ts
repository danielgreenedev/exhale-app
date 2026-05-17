'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BREATHING_PATTERN,
  CYCLE_DURATION,
  SESSION_CYCLES,
  SessionLength,
  PhaseConfig,
  getPhaseAtTime,
} from '@/lib/breathing';

export type SessionState = 'idle' | 'intro' | 'running' | 'paused' | 'complete';

export interface BreathingSessionState {
  sessionState: SessionState;
  currentPhase: PhaseConfig;
  phaseIndex: number;
  phaseProgress: number;   // 0–1 progress through current phase
  sessionProgress: number; // 0–1 progress through total session
  cycleNumber: number;
  totalCycles: number;
  timeRemaining: number;   // seconds remaining in phase
  elapsedTotal: number;    // total elapsed seconds
  sessionDuration: number; // total session duration in seconds
}

export function useBreathingSession(sessionLength: SessionLength, initialElapsed = 0) {
  const totalCycles = SESSION_CYCLES[sessionLength];
  const sessionDuration = totalCycles * CYCLE_DURATION;

  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [elapsedTotal, setElapsedTotal] = useState(initialElapsed);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(initialElapsed);

  const tick = useCallback(() => {
    if (!startTimeRef.current) return;
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;

    if (elapsed >= sessionDuration) {
      setElapsedTotal(sessionDuration);
      setSessionState('complete');
      return;
    }

    setElapsedTotal(elapsed);
    rafRef.current = requestAnimationFrame(tick);
  }, [sessionDuration]);

  const start = useCallback(() => {
    startTimeRef.current = performance.now() - pausedAtRef.current * 1000;
    setSessionState('running');
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (startTimeRef.current) {
      pausedAtRef.current = (performance.now() - startTimeRef.current) / 1000;
    }
    setSessionState('paused');
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    setElapsedTotal(0);
    setSessionState('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Derive phase state from elapsed time
  const elapsedInCycle = elapsedTotal % CYCLE_DURATION;
  const cycleNumber = Math.floor(elapsedTotal / CYCLE_DURATION) + 1;
  const { config: currentPhase, timeInPhase, phaseIndex } = getPhaseAtTime(elapsedInCycle);
  const phaseProgress = timeInPhase / currentPhase.duration;
  const sessionProgress = elapsedTotal / sessionDuration;
  const timeRemaining = Math.ceil(currentPhase.duration - timeInPhase);

  return {
    sessionState,
    currentPhase,
    phaseIndex,
    phaseProgress,
    sessionProgress,
    cycleNumber: Math.min(cycleNumber, totalCycles),
    totalCycles,
    timeRemaining,
    elapsedTotal,
    sessionDuration,
    start,
    pause,
    reset,
    totalPhasesCompleted: BREATHING_PATTERN.length * (cycleNumber - 1) + phaseIndex,
  };
}
