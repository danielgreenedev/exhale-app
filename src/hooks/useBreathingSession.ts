'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  DEFAULT_RHYTHM,
  RHYTHMS,
  Rhythm,
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

/**
 * Drives the active breathing session.
 *
 * Rhythm is captured at first render and held for the hook's lifetime; per product design
 * users cannot change rhythm mid-session, so the RAF tick closure can safely close over a
 * single stable rhythm without re-creating each parent render.
 */
export function useBreathingSession(
  sessionLength: SessionLength,
  initialElapsed = 0,
  rhythm: Rhythm = RHYTHMS[DEFAULT_RHYTHM]
) {
  const rhythmRef = useRef(rhythm);
  const activeRhythm = rhythmRef.current;

  const totalCycles = activeRhythm.sessionCycles[sessionLength];
  const cycleDuration = activeRhythm.cycleDuration;
  const sessionDuration = totalCycles * cycleDuration;

  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [elapsedTotal, setElapsedTotal] = useState(initialElapsed);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(initialElapsed);
  // Continuous elapsed — updated every frame, read by canvas without triggering React renders
  const elapsedRef = useRef(initialElapsed);
  // Throttle React re-renders: only re-render when timer digit or phase boundary changes
  const lastUpdateKeyRef = useRef(-1);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;

    elapsedRef.current = elapsed;

    if (elapsed >= sessionDuration) {
      setElapsedTotal(sessionDuration);
      setSessionState('complete');
      return;
    }

    const elapsedInCycle = elapsed % cycleDuration;
    const { config: phase, timeInPhase, phaseIndex: pi } = getPhaseAtTime(elapsedInCycle, activeRhythm);
    const tr = Math.ceil(phase.duration - timeInPhase);
    const updateKey = pi * 100 + tr;
    if (updateKey !== lastUpdateKeyRef.current) {
      lastUpdateKeyRef.current = updateKey;
      setElapsedTotal(elapsed);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [sessionDuration, cycleDuration, activeRhythm]);

  const start = useCallback(() => {
    startTimeRef.current = performance.now() - pausedAtRef.current * 1000;
    setSessionState('running');
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (startTimeRef.current !== null) {
      pausedAtRef.current = (performance.now() - startTimeRef.current) / 1000;
      elapsedRef.current = pausedAtRef.current;
    }
    setSessionState('paused');
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    elapsedRef.current = 0;
    setElapsedTotal(0);
    setSessionState('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Derive phase state from elapsed time
  const elapsedInCycle = elapsedTotal % cycleDuration;
  const cycleNumber = Math.floor(elapsedTotal / cycleDuration) + 1;
  const { config: currentPhase, timeInPhase, phaseIndex } = getPhaseAtTime(elapsedInCycle, activeRhythm);
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
    elapsedRef,
    sessionDuration,
    rhythm: activeRhythm,
    cycleDuration,
    start,
    pause,
    reset,
    totalPhasesCompleted: activeRhythm.pattern.length * (cycleNumber - 1) + phaseIndex,
  };
}
