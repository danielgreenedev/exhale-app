'use client';

import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';
import { BreathingPhase, DEFAULT_RHYTHM, RHYTHMS, Rhythm } from '@/lib/breathing';
import { DEFAULT_SOUND_PALETTE, SoundPaletteId } from '@/lib/sound';

type ActiveSoundPaletteId = Exclude<SoundPaletteId, 'off'>;
type NoteConfig = readonly [frequency: number, detune: number, weight: number];

interface AmbientConfig {
  masterVolume: number;
  reverbGain: number;
  reverbSeconds: number;
  reverbDecay: number;
  noiseGain: number;
  noiseFilters: readonly { frequency: number; q: number }[];
  sub?: { frequency: number; gain: number };
  chordGain: number;
  chordNotes: readonly NoteConfig[];
  chordOscType?: OscillatorType;
  cueGain: number;
  cueLowpass: number;
  cueSubGain: number;
  breathMin: number;
  breathMax: number;
}

const AMBIENT_PALETTES: Record<ActiveSoundPaletteId, AmbientConfig> = {
  air: {
    masterVolume: 0.15,
    reverbGain: 0.22,
    reverbSeconds: 1.7,
    reverbDecay: 2.4,
    noiseGain: 0.095,
    noiseFilters: [
      { frequency: 175, q: 0.7 },
      { frequency: 320, q: 0.48 },
    ],
    sub: { frequency: 49, gain: 0.018 },
    chordGain: 0.13,
    chordNotes: [
      [196.0, 0.0, 1.0],
      [293.66, 0.08, 0.42],
      [392.0, -0.05, 0.18],
    ],
    cueGain: 0.62,
    cueLowpass: 1400,
    cueSubGain: 0.014,
    breathMin: 1600,
    breathMax: 4200,
  },
  warm: {
    masterVolume: 0.17,
    reverbGain: 0.36,
    reverbSeconds: 2.2,
    reverbDecay: 2.0,
    noiseGain: 0.055,
    noiseFilters: [
      { frequency: 150, q: 0.68 },
      { frequency: 260, q: 0.44 },
    ],
    sub: { frequency: 55, gain: 0.028 },
    chordGain: 0.22,
    chordNotes: [
      [220.0, 0.0, 1.0],
      [277.18, -0.04, 0.52],
      [329.63, 0.06, 0.38],
      [440.0, -0.03, 0.18],
    ],
    chordOscType: 'sine',
    cueGain: 0.68,
    cueLowpass: 1500,
    cueSubGain: 0.018,
    breathMin: 1400,
    breathMax: 3600,
  },
  low: {
    masterVolume: 0.16,
    reverbGain: 0.18,
    reverbSeconds: 1.6,
    reverbDecay: 2.7,
    noiseGain: 0.05,
    noiseFilters: [
      { frequency: 105, q: 0.78 },
      { frequency: 210, q: 0.5 },
    ],
    sub: { frequency: 44, gain: 0.034 },
    chordGain: 0.14,
    chordNotes: [
      [110.0, 0.0, 0.8],
      [146.83, -0.04, 0.44],
      [220.0, 0.05, 0.26],
    ],
    cueGain: 0.5,
    cueLowpass: 1050,
    cueSubGain: 0.02,
    breathMin: 1000,
    breathMax: 2800,
  },
  quiet: {
    masterVolume: 0.135,
    reverbGain: 0.16,
    reverbSeconds: 1.4,
    reverbDecay: 2.6,
    noiseGain: 0.06,
    noiseFilters: [
      { frequency: 150, q: 0.6 },
      { frequency: 260, q: 0.38 },
    ],
    sub: { frequency: 49, gain: 0.014 },
    chordGain: 0.045,
    chordNotes: [
      [196.0, -0.03, 0.22],
    ],
    chordOscType: 'sine',
    cueGain: 0.34,
    cueLowpass: 900,
    cueSubGain: 0.008,
    breathMin: 1200,
    breathMax: 3000,
  },
};

const CUE_MAP: Record<BreathingPhase, [number, number]> = {
  inhale: [493.88, 739.99],
  hold: [440.0, 659.25],
  exhale: [392.0, 587.33],
  rest: [329.63, 493.88],
};

function isActivePalette(id: SoundPaletteId): id is ActiveSoundPaletteId {
  return id !== 'off';
}

function disconnectNode(node: AudioNode | null) {
  try {
    node?.disconnect();
  } catch {
    // Already disconnected.
  }
}

export function useAudioEngine(
  soundPalette: SoundPaletteId = DEFAULT_SOUND_PALETTE,
  rhythm: Rhythm = RHYTHMS[DEFAULT_RHYTHM]
) {
  // Rhythm is captured at first render and held for the hook lifetime, mirroring the
  // pattern in useBreathingSession and BreathingOrb. The breath-filter ramp timing in
  // playCue reads phase durations from this locked rhythm, so a parent re-render with a
  // fresh rhythm reference does not desynchronize cues already mid-ramp.
  const rhythmRef = useRef(rhythm);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);
  const breathFilterRef = useRef<BiquadFilterNode | null>(null);
  const ambientSourcesRef = useRef<AudioScheduledSourceNode[]>([]);
  const enabledRef = useRef(false);
  const paletteRef = useRef<SoundPaletteId>(soundPalette);
  const stopTimeoutRef = useRef<number | null>(null);
  const scheduledStopTimeoutRef = useRef<number | null>(null);
  const previewTimeoutRef = useRef<number | null>(null);
  // Reverb buffer is expensive to generate (~150k iterations); cache per palette to skip on re-start
  const reverbCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

  useEffect(() => {
    paletteRef.current = soundPalette;
  }, [soundPalette]);

  const clearTimer = useCallback((timerRef: MutableRefObject<number | null>) => {
    if (timerRef.current === null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const stopSources = useCallback(() => {
    clearTimer(stopTimeoutRef);
    clearTimer(scheduledStopTimeoutRef);

    ambientSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
      disconnectNode(source);
    });
    ambientSourcesRef.current = [];

    disconnectNode(reverbRef.current);
    disconnectNode(reverbGainRef.current);
    disconnectNode(masterGainRef.current);
    disconnectNode(breathFilterRef.current);
    reverbRef.current = null;
    reverbGainRef.current = null;
    masterGainRef.current = null;
    breathFilterRef.current = null;
  }, [clearTimer]);

  const startAmbient = useCallback(async (paletteOverride?: SoundPaletteId, fadeIn = 3.0) => {
    const paletteId = paletteOverride ?? paletteRef.current;
    clearTimer(previewTimeoutRef);

    if (!isActivePalette(paletteId)) {
      enabledRef.current = false;
      stopSources();
      return false;
    }

    const config = AMBIENT_PALETTES[paletteId];
    const ctx = getCtx();
    if (ctx.state === 'suspended') await ctx.resume();

    enabledRef.current = true;
    stopSources();

    const now = ctx.currentTime;
    const breathFilter = ctx.createBiquadFilter();
    breathFilter.type = 'lowpass';
    breathFilter.frequency.value = config.breathMin;
    breathFilter.Q.value = 0.5;
    breathFilter.connect(ctx.destination);
    breathFilterRef.current = breathFilter;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(config.masterVolume, now + fadeIn);
    master.connect(breathFilter);
    masterGainRef.current = master;

    let revBuf = reverbCacheRef.current.get(paletteId);
    if (!revBuf) {
      const revLen = Math.floor(ctx.sampleRate * config.reverbSeconds);
      revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch += 1) {
        const data = revBuf.getChannelData(ch);
        for (let i = 0; i < revLen; i += 1) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, config.reverbDecay);
        }
      }
      reverbCacheRef.current.set(paletteId, revBuf);
    }

    const reverb = ctx.createConvolver();
    reverb.buffer = revBuf;
    reverbRef.current = reverb;

    const revGain = ctx.createGain();
    revGain.gain.value = config.reverbGain;
    reverb.connect(revGain);
    revGain.connect(master);
    reverbGainRef.current = revGain;

    const bufSize = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const noiseData = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i += 1) noiseData[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    ambientSourcesRef.current.push(noise);

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = config.noiseGain;
    config.noiseFilters.forEach(({ frequency, q }) => {
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = frequency;
      filter.Q.value = q;
      noise.connect(filter);
      filter.connect(noiseGain);
    });
    noiseGain.connect(master);
    noise.start();

    if (config.sub) {
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = config.sub.frequency;
      const subGain = ctx.createGain();
      subGain.gain.value = config.sub.gain;
      sub.connect(subGain);
      subGain.connect(master);
      sub.start();
      ambientSourcesRef.current.push(sub);
    }

    if (config.chordGain > 0 && config.chordNotes.length > 0) {
      const chordGain = ctx.createGain();
      chordGain.gain.value = config.chordGain;
      chordGain.connect(master);
      chordGain.connect(reverb);

      config.chordNotes.forEach(([frequency, detune, weight]) => {
        const osc = ctx.createOscillator();
        osc.type = config.chordOscType ?? 'triangle';
        osc.frequency.value = frequency + detune;
        const gain = ctx.createGain();
        gain.gain.value = weight;
        osc.connect(gain);
        gain.connect(chordGain);
        osc.start();
        ambientSourcesRef.current.push(osc);
      });
    }

    return true;
  }, [clearTimer, getCtx, stopSources]);

  const stopAmbient = useCallback((duration = 2.0) => {
    enabledRef.current = false;
    clearTimer(scheduledStopTimeoutRef);
    clearTimer(previewTimeoutRef);

    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master || duration <= 0) {
      stopSources();
      return;
    }

    clearTimer(stopTimeoutRef);
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + duration);
    stopTimeoutRef.current = window.setTimeout(stopSources, duration * 1000 + 120);
  }, [clearTimer, stopSources]);

  const scheduleAmbientStop = useCallback((delaySeconds: number, fadeOut = 1.0) => {
    clearTimer(scheduledStopTimeoutRef);

    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master || !enabledRef.current) return false;

    const delay = Math.max(0, delaySeconds);
    const duration = Math.max(0.1, fadeOut);
    const stopAt = ctx.currentTime + delay;

    master.gain.cancelScheduledValues(stopAt);
    master.gain.setTargetAtTime(0, stopAt, Math.max(0.05, duration / 5));

    scheduledStopTimeoutRef.current = window.setTimeout(() => {
      scheduledStopTimeoutRef.current = null;
      enabledRef.current = false;
      stopSources();
    }, (delay + duration) * 1000 + 160);

    return true;
  }, [clearTimer, stopSources]);

  const pauseAmbient = useCallback(() => {
    clearTimer(scheduledStopTimeoutRef);

    if (masterGainRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.5);
    }
  }, [clearTimer]);

  const resumeAmbient = useCallback(() => {
    clearTimer(scheduledStopTimeoutRef);

    const paletteId = paletteRef.current;
    if (!isActivePalette(paletteId)) return;
    if (masterGainRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.linearRampToValueAtTime(AMBIENT_PALETTES[paletteId].masterVolume, now + 1.2);
    }
  }, [clearTimer]);

  const previewPalette = useCallback(async (paletteOverride?: SoundPaletteId) => {
    const started = await startAmbient(paletteOverride, 0.45);
    if (!started) return false;

    previewTimeoutRef.current = window.setTimeout(() => {
      previewTimeoutRef.current = null;
      stopAmbient(0.9);
    }, 3200);

    return true;
  }, [startAmbient, stopAmbient]);

  const playCue = useCallback((phase: BreathingPhase) => {
    const paletteId = paletteRef.current;
    if (!enabledRef.current || !isActivePalette(paletteId)) return;

    const ctx = getCtx();
    const master = masterGainRef.current;
    const reverb = reverbRef.current;
    if (!master) return;

    const config = AMBIENT_PALETTES[paletteId];
    if (config.cueGain <= 0) return;

    const breathFilter = breathFilterRef.current;
    if (breathFilter) {
      const phaseDuration = rhythmRef.current.pattern.find(p => p.phase === phase)?.duration ?? 4;
      const nowB = ctx.currentTime;
      breathFilter.frequency.cancelScheduledValues(nowB);
      if (phase === 'inhale') {
        breathFilter.frequency.setValueAtTime(config.breathMin, nowB);
        breathFilter.frequency.linearRampToValueAtTime(config.breathMax, nowB + phaseDuration);
      } else if (phase === 'hold') {
        breathFilter.frequency.setValueAtTime(config.breathMax, nowB);
      } else if (phase === 'exhale') {
        breathFilter.frequency.setValueAtTime(config.breathMax, nowB);
        breathFilter.frequency.linearRampToValueAtTime(config.breathMin, nowB + phaseDuration);
      } else {
        breathFilter.frequency.setValueAtTime(config.breathMin, nowB);
      }
    }

    const [root, fifth] = CUE_MAP[phase];
    const now = ctx.currentTime;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = config.cueLowpass;
    lowpass.Q.value = 0.5;
    lowpass.connect(master);
    if (reverb) lowpass.connect(reverb);

    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = root / 2;
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(config.cueSubGain, now + 0.55);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.15);
    subOsc.connect(subGain);
    subGain.connect(lowpass);
    subOsc.start(now);
    subOsc.stop(now + 2.25);

    const rootOsc = ctx.createOscillator();
    rootOsc.type = 'triangle';
    rootOsc.frequency.value = root;
    const rootGain = ctx.createGain();
    rootGain.gain.setValueAtTime(0, now);
    rootGain.gain.linearRampToValueAtTime(0.07 * config.cueGain, now + 0.38);
    rootGain.gain.setValueAtTime(0.044 * config.cueGain, now + 0.84);
    rootGain.gain.exponentialRampToValueAtTime(0.001, now + 2.35);
    rootOsc.connect(rootGain);
    rootGain.connect(lowpass);
    rootOsc.start(now);
    rootOsc.stop(now + 2.45);

    const fifthOsc = ctx.createOscillator();
    fifthOsc.type = 'triangle';
    fifthOsc.frequency.value = fifth;
    const fifthGain = ctx.createGain();
    fifthGain.gain.setValueAtTime(0, now);
    fifthGain.gain.linearRampToValueAtTime(0.024 * config.cueGain, now + 0.5);
    fifthGain.gain.exponentialRampToValueAtTime(0.001, now + 1.95);
    fifthOsc.connect(fifthGain);
    fifthGain.connect(lowpass);
    fifthOsc.start(now);
    fifthOsc.stop(now + 2.05);
  }, [getCtx]);

  const playAnticipationCue = useCallback((phase: BreathingPhase) => {
    const paletteId = paletteRef.current;
    if (!enabledRef.current || !isActivePalette(paletteId)) return;

    const ctx = getCtx();
    const master = masterGainRef.current;
    if (!master) return;

    const config = AMBIENT_PALETTES[paletteId];
    if (config.cueGain <= 0) return;

    const [root] = CUE_MAP[phase];
    const now = ctx.currentTime;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = Math.min(config.cueLowpass, 950);
    lowpass.Q.value = 0.45;
    lowpass.connect(master);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = root;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.018 * config.cueGain, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);

    osc.connect(gain);
    gain.connect(lowpass);
    osc.start(now);
    osc.stop(now + 0.7);
  }, [getCtx]);

  useEffect(() => {
    return () => {
      clearTimer(previewTimeoutRef);
      stopSources();
      void ctxRef.current?.close().catch(() => {});
    };
  }, [clearTimer, stopSources]);

  return {
    startAmbient,
    stopAmbient,
    scheduleAmbientStop,
    pauseAmbient,
    resumeAmbient,
    previewPalette,
    playCue,
    playAnticipationCue,
  };
}
