'use client';

import { useRef, useCallback } from 'react';
import { BreathingPhase } from '@/lib/breathing';

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const droneRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const enabledRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = getCtx();
    enabledRef.current = true;

    // Low drone: two slightly detuned sine waves for warmth
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
    masterGain.connect(ctx.destination);
    droneGainRef.current = masterGain;

    [174, 174.8].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(masterGain);
      osc.start();
      // Store first one so we can stop later
      if (freq === 174) droneRef.current = osc;
    });
  }, [getCtx]);

  const stopAmbient = useCallback(() => {
    enabledRef.current = false;
    if (droneGainRef.current) {
      const ctx = getCtx();
      droneGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    }
  }, [getCtx]);

  // Plays a gentle tonal cue when the phase changes
  const playCue = useCallback((phase: BreathingPhase) => {
    if (!enabledRef.current) return;
    const ctx = getCtx();

    const freqMap: Record<BreathingPhase, number> = {
      inhale: 528,
      hold: 432,
      exhale: 396,
      rest: 285,
    };

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freqMap[phase];
    osc.connect(gain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.3);

    // Add a soft harmonic overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.value = freqMap[phase] * 1.5;
    osc2.connect(gain2);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 1.1);
  }, [getCtx]);

  return { startAmbient, stopAmbient, playCue };
}
