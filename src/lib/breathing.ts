import { PHASE_COLORS } from '@/lib/colors';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale';
export type SessionLength = 'quick' | 'short' | 'medium' | 'long';
export type RhythmId = 'standard' | 'gentle' | 'box' | 'flow';

export const DEFAULT_SESSION_LENGTH: SessionLength = 'quick';
export const DEFAULT_ORB_SCALE = 1;
export const DEFAULT_RHYTHM: RhythmId = 'gentle';
export const RHYTHM_STORAGE_KEY = 'exhale-rhythm';
export const PHASE_LOOKAHEAD_SECONDS = 0.8;

export interface PhaseConfig {
  phase: BreathingPhase;
  duration: number; // seconds
  label: string;
  instruction: string;
  targetOrbScale: number; // 0–1 relative to max radius
  color: string; // HSL string
  glowColor: string;
}

export interface Rhythm {
  id: RhythmId;
  label: string;        // Short name shown on the rhythm tile (e.g., "Box").
  summary: string;      // One-word relative descriptor for aria labels and helper context.
  description: string;  // Short scannable phrase shown in the connected rhythm helper.
  pattern: PhaseConfig[];
  cycleDuration: number;
  sessionCycles: Record<SessionLength, number>;
}

// Rhythms are variable-length: Flow is a true Inhale/Exhale loop, while
// Box includes a second Hold at the exhaled scale. There is no hidden rest phase.
const PHASE_DETAILS: Record<BreathingPhase, Omit<PhaseConfig, 'duration'>> = {
  inhale: {
    phase: 'inhale',
    label: 'Inhale',
    instruction: 'Breathe in slowly through your nose',
    targetOrbScale: 1.0,
    color: PHASE_COLORS.inhale.color,
    glowColor: PHASE_COLORS.inhale.glowColor,
  },
  hold: {
    phase: 'hold',
    label: 'Hold',
    instruction: 'Hold gently, keep it easy',
    targetOrbScale: 1.0,
    color: PHASE_COLORS.hold.color,
    glowColor: PHASE_COLORS.hold.glowColor,
  },
  exhale: {
    phase: 'exhale',
    label: 'Exhale',
    instruction: 'Breathe out slowly through your mouth',
    targetOrbScale: 0.45,
    color: PHASE_COLORS.exhale.color,
    glowColor: PHASE_COLORS.exhale.glowColor,
  },
};

// Target session durations in seconds, mapped from the human-facing minute labels.
// Cycle counts are derived per rhythm so each session length stays close to its label.
const SESSION_LENGTH_TARGETS: Record<SessionLength, number> = {
  quick: 180,   // ~3 min
  short: 300,   // ~5 min
  medium: 420,  // ~7 min
  long: 600,    // ~10 min
};

function phaseConfig(
  phase: BreathingPhase,
  duration: number,
  targetOrbScale = PHASE_DETAILS[phase].targetOrbScale
): PhaseConfig {
  return { ...PHASE_DETAILS[phase], duration, targetOrbScale };
}

function sumDurations(pattern: PhaseConfig[]): number {
  return pattern.reduce((acc, p) => acc + p.duration, 0);
}

function recalibrateCycles(cycleDuration: number): Record<SessionLength, number> {
  return {
    quick: Math.max(1, Math.round(SESSION_LENGTH_TARGETS.quick / cycleDuration)),
    short: Math.max(1, Math.round(SESSION_LENGTH_TARGETS.short / cycleDuration)),
    medium: Math.max(1, Math.round(SESSION_LENGTH_TARGETS.medium / cycleDuration)),
    long: Math.max(1, Math.round(SESSION_LENGTH_TARGETS.long / cycleDuration)),
  };
}

function buildRhythm(
  id: RhythmId,
  label: string,
  summary: string,
  description: string,
  pattern: Array<readonly [BreathingPhase, number] | readonly [BreathingPhase, number, number]>
): Rhythm {
  const phasePattern = pattern.map(([phase, duration, targetOrbScale]) => phaseConfig(phase, duration, targetOrbScale));
  const cycleDuration = sumDurations(phasePattern);
  return {
    id,
    label,
    summary,
    description,
    pattern: phasePattern,
    cycleDuration,
    sessionCycles: recalibrateCycles(cycleDuration),
  };
}

export const RHYTHMS: Record<RhythmId, Rhythm> = {
  standard: buildRhythm(
    'standard',
    'Box',
    'Structured',
    'Even pacing with a hold after each breath.',
    [['inhale', 4], ['hold', 4], ['exhale', 4], ['hold', 4, 0.45]]
  ),
  gentle: buildRhythm(
    'gentle',
    'Soft',
    'Accessible',
    'No holds, an easy in and out.',
    [['inhale', 4], ['exhale', 4]]
  ),
  box: buildRhythm(
    'box',
    'Relax',
    'Classic',
    'Long hold, longer release. Keep it easy.',
    [['inhale', 4], ['hold', 7], ['exhale', 8]]
  ),
  flow: buildRhythm(
    'flow',
    'Flow',
    'Continuous',
    'No holds, just inhale and longer exhale.',
    [['inhale', 4], ['exhale', 6]]
  ),
};

export function isRhythmId(value: unknown): value is RhythmId {
  return value === 'standard' || value === 'gentle' || value === 'box' || value === 'flow';
}

export function normalizeRhythmId(value: unknown): RhythmId | null;
export function normalizeRhythmId(value: unknown, fallback: RhythmId): RhythmId;
export function normalizeRhythmId(value: unknown, fallback: RhythmId | null = null): RhythmId | null {
  if (isRhythmId(value)) return value;
  if (value === 'full' || value === 'slow') return 'box';
  return fallback;
}

export function getRhythm(id: RhythmId | string | null | undefined): Rhythm {
  return RHYTHMS[normalizeRhythmId(id, DEFAULT_RHYTHM)];
}

export function getPhaseAtTime(
  elapsedInCycle: number,
  rhythm: Rhythm = RHYTHMS[DEFAULT_RHYTHM]
): { config: PhaseConfig; timeInPhase: number; phaseIndex: number } {
  let accumulated = 0;
  for (let i = 0; i < rhythm.pattern.length; i++) {
    const config = rhythm.pattern[i];
    if (elapsedInCycle < accumulated + config.duration) {
      return { config, timeInPhase: elapsedInCycle - accumulated, phaseIndex: i };
    }
    accumulated += config.duration;
  }
  const lastIndex = rhythm.pattern.length - 1;
  const last = rhythm.pattern[lastIndex];
  return { config: last, timeInPhase: last.duration, phaseIndex: lastIndex };
}

// The effective anticipation-cue lead window for a given phase. Capped at 25% of phase duration
// so short phases don't have a lead that occupies too much of the phase and reads as jittery.
// Long phases use the full PHASE_LOOKAHEAD_SECONDS constant.
export function getPhaseLookahead(phase: PhaseConfig): number {
  if (phase.duration <= 0) return 0;
  return Math.min(PHASE_LOOKAHEAD_SECONDS, phase.duration * 0.25);
}

export function getNextPhase(phaseIndex: number, rhythm: Rhythm = RHYTHMS[DEFAULT_RHYTHM]): PhaseConfig {
  const len = rhythm.pattern.length;
  return rhythm.pattern[(phaseIndex + 1) % len];
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function getOrbScale(phase: PhaseConfig, progress: number, prevScale: number): number {
  const target = phase.targetOrbScale;
  if (phase.phase === 'inhale') return prevScale + (target - prevScale) * easeInOutCubic(progress);
  if (phase.phase === 'exhale') return prevScale + (target - prevScale) * easeInOutCubic(progress);
  return target;
}
