'use client';

import { useRef, useCallback } from 'react';
import { BreathingPhase } from '@/lib/breathing';

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);
  const ambientNodesRef = useRef<AudioNode[]>([]);
  const enabledRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = getCtx();
    enabledRef.current = true;

    ambientNodesRef.current.forEach((node) => {
      try { (node as OscillatorNode | AudioBufferSourceNode).stop(); } catch { /* already stopped */ }
    });
    ambientNodesRef.current = [];

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3);
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Small-room reverb — synthetic decaying-noise impulse response
    const revLen = Math.floor(ctx.sampleRate * 1.8);
    const revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch);
      for (let i = 0; i < revLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 2.2);
      }
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = revBuf;
    reverbRef.current = reverb;

    const revGain = ctx.createGain();
    revGain.gain.value = 0.30;
    reverb.connect(revGain);
    revGain.connect(master);
    reverbGainRef.current = revGain;

    // Gentle breeze: band-pass filtered white noise
    // Lower center frequencies (260→180, 420→300) for warmer, less airy character
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
    bp1.frequency.value = 180;
    bp1.Q.value = 0.7;

    const bp2 = ctx.createBiquadFilter();
    bp2.type = 'bandpass';
    bp2.frequency.value = 300;
    bp2.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.09;

    noise.connect(bp1);
    bp1.connect(noiseGain);
    noise.connect(bp2);
    bp2.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    // Sub-bass grounding: A1 (55Hz) sine — felt more than heard, adds body
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 55;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.030;
    sub.connect(subGain);
    subGain.connect(master);
    sub.start();
    ambientNodesRef.current.push(sub);

    // G major chord: G3 + B3 + D4 + G4
    // Adding the major third (B3) over the previous open-fifth voicing adds emotional warmth
    const chordFreqs: [number, number, number][] = [
      [196.00,  0.00,  1.00],  // G3 — root, full weight
      [246.94, -0.06,  0.60],  // B3 — major third (new)
      [293.66,  0.10,  0.40],  // D4 — fifth
      [392.00, -0.07,  0.20],  // G4 — octave
    ];

    const chordGain = ctx.createGain();
    chordGain.gain.value = 0.20;
    chordGain.connect(master);
    chordGain.connect(reverb); // chord through reverb for spaciousness

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

  const stopAmbient = useCallback((duration = 2.0) => {
    enabledRef.current = false;
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + duration);
    }
  }, []);

  const pauseAmbient = useCallback(() => {
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.5);
    }
  }, []);

  const resumeAmbient = useCallback(() => {
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0.18, ctxRef.current.currentTime + 1.2);
    }
  }, []);

  // Warm chime cue on each phase change
  const playCue = useCallback((phase: BreathingPhase) => {
    if (!enabledRef.current) return;
    const ctx = getCtx();
    const master = masterGainRef.current;
    const reverb = reverbRef.current;
    if (!master) return;

    const cueMap: Record<BreathingPhase, [number, number]> = {
      inhale: [523.25, 783.99],  // C5 + G5 — light, open
      hold:   [440.00, 659.25],  // A4 + E5 — warm, stable
      exhale: [392.00, 587.33],  // G4 + D5 — soft, settling
      rest:   [329.63, 493.88],  // E4 + B4 — quiet, grounded
    };

    const [root, fifth] = cueMap[phase];
    const now = ctx.currentTime;

    // Low-pass filter — remove harsh upper harmonics from triangle waves
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1600;
    lp.Q.value = 0.5;
    lp.connect(master);          // dry signal
    if (reverb) lp.connect(reverb); // wet signal → reverb → revGain → master

    // Sub-octave root — sine one octave below, adds warmth and body
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = root / 2;
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.025, now + 0.50);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    subOsc.connect(subGain);
    subGain.connect(lp);
    subOsc.start(now);
    subOsc.stop(now + 2.3);

    // Root note — slower attack (0.35s vs 0.18s) for a bloom rather than a ping
    const rootOsc = ctx.createOscillator();
    rootOsc.type = 'triangle';
    rootOsc.frequency.value = root;
    const rootGain = ctx.createGain();
    rootGain.gain.setValueAtTime(0, now);
    rootGain.gain.linearRampToValueAtTime(0.082, now + 0.35);
    rootGain.gain.setValueAtTime(0.055, now + 0.80);
    rootGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
    rootOsc.connect(rootGain);
    rootGain.connect(lp);
    rootOsc.start(now);
    rootOsc.stop(now + 2.5);

    // Fifth — softer, slightly delayed onset
    const fifthOsc = ctx.createOscillator();
    fifthOsc.type = 'triangle';
    fifthOsc.frequency.value = fifth;
    const fifthGain = ctx.createGain();
    fifthGain.gain.setValueAtTime(0, now);
    fifthGain.gain.linearRampToValueAtTime(0.030, now + 0.45);
    fifthGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    fifthOsc.connect(fifthGain);
    fifthGain.connect(lp);
    fifthOsc.start(now);
    fifthOsc.stop(now + 2.1);
  }, [getCtx]);

  return { startAmbient, stopAmbient, pauseAmbient, resumeAmbient, playCue };
}
