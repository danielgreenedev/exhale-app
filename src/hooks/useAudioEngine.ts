'use client';

import { useRef, useCallback } from 'react';
import { BreathingPhase } from '@/lib/breathing';

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientNodesRef = useRef<AudioNode[]>([]);
  const enabledRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = getCtx();
    enabledRef.current = true;

    // Stop any previously running ambient nodes
    ambientNodesRef.current.forEach((node) => {
      try { (node as OscillatorNode | AudioBufferSourceNode).stop(); } catch { /* already stopped */ }
    });
    ambientNodesRef.current = [];

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.065, ctx.currentTime + 3);
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Gentle breeze: band-pass filtered white noise
    const bufSize = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    ambientNodesRef.current.push(noise);

    const bp1 = ctx.createBiquadFilter();
    bp1.type = 'bandpass';
    bp1.frequency.value = 260;
    bp1.Q.value = 0.6;

    const bp2 = ctx.createBiquadFilter();
    bp2.type = 'bandpass';
    bp2.frequency.value = 420;
    bp2.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.22;

    noise.connect(bp1);
    bp1.connect(noiseGain);
    noise.connect(bp2);
    bp2.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    // Warm triangle chord: G3 + D4 + G4 (open, natural fifths)
    const chordFreqs: [number, number, number][] = [
      [196.0,  0.0,   1.0],   // G3, no detune, full weight
      [293.66, 0.12,  0.55],  // D4, tiny detune
      [392.0,  -0.08, 0.30],  // G4, tiny detune
    ];

    const chordGain = ctx.createGain();
    chordGain.gain.value = 0.09;
    chordGain.connect(master);

    chordFreqs.forEach(([freq, detune, weight]) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq + detune;
      const g = ctx.createGain();
      g.gain.value = weight;
      osc.connect(g);
      g.connect(chordGain);
      osc.start();
      ambientNodesRef.current.push(osc);
    });
  }, [getCtx]);

  const stopAmbient = useCallback(() => {
    enabledRef.current = false;
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 2.0);
    }
  }, []);

  const pauseAmbient = useCallback(() => {
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.5);
    }
  }, []);

  const resumeAmbient = useCallback(() => {
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0.065, ctxRef.current.currentTime + 1.2);
    }
  }, []);

  // Gentle chime-like cue on each phase change
  const playCue = useCallback((phase: BreathingPhase) => {
    if (!enabledRef.current) return;
    const ctx = getCtx();

    // Pentatonic notes — natural, consonant, non-clinical
    const cueMap: Record<BreathingPhase, [number, number]> = {
      inhale: [523.25, 783.99],  // C5 + G5 — light, open
      hold:   [440.00, 659.25],  // A4 + E5 — warm, stable
      exhale: [392.00, 587.33],  // G4 + D5 — soft, settling
      rest:   [329.63, 493.88],  // E4 + B4 — quiet, grounded
    };

    const [root, fifth] = cueMap[phase];

    // Root note — triangle for warmth, soft bloom + gentle tail
    const rootOsc = ctx.createOscillator();
    rootOsc.type = 'triangle';
    rootOsc.frequency.value = root;
    const rootGain = ctx.createGain();
    rootGain.gain.setValueAtTime(0, ctx.currentTime);
    rootGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.18);
    rootGain.gain.setValueAtTime(0.055, ctx.currentTime + 0.5);
    rootGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
    rootOsc.connect(rootGain);
    rootGain.connect(ctx.destination);
    rootOsc.start(ctx.currentTime);
    rootOsc.stop(ctx.currentTime + 2.1);

    // Fifth — softer, sits behind the root
    const fifthOsc = ctx.createOscillator();
    fifthOsc.type = 'triangle';
    fifthOsc.frequency.value = fifth;
    const fifthGain = ctx.createGain();
    fifthGain.gain.setValueAtTime(0, ctx.currentTime);
    fifthGain.gain.linearRampToValueAtTime(0.032, ctx.currentTime + 0.22);
    fifthGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
    fifthOsc.connect(fifthGain);
    fifthGain.connect(ctx.destination);
    fifthOsc.start(ctx.currentTime);
    fifthOsc.stop(ctx.currentTime + 1.7);
  }, [getCtx]);

  return { startAmbient, stopAmbient, pauseAmbient, resumeAmbient, playCue };
}
