import { PHASE_COLORS } from '@/lib/colors';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
export type SessionLength = 'quick' | 'short' | 'medium' | 'long';
export type RhythmId = 'standard' | 'gentle' | 'slow';

export const DEFAULT_SESSION_LENGTH: SessionLength = 'quick';
export const DEFAULT_ORB_SCALE = 1;
export const DEFAULT_RHYTHM: RhythmId = 'standard';
export const RHYTHM_STORAGE_KEY = 'exhale-rhythm';

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
  label: string;
  description: string;
  pattern: PhaseConfig[];
  cycleDuration: number;
  sessionCycles: Record<SessionLength, number>;
}

// All rhythms share the same per-phase identity (label, instruction, color, target orb scale)
// and differ only in per-phase duration. The instructions are intentionally permissive across
// rhythms; the "Hold gently, keep it easy" copy was softened after iPhone tester feedback and
// stays unchanged here.
const BASE_PHASES: Omit<PhaseConfig, 'duration'>[] = [
  {
    phase: 'inhale',
    label: 'Inhale',
    instruction: 'Breathe in slowly through your nose',
    targetOrbScale: 1.0,
    color: PHASE_COLORS.inhale.color,
    glowColor: PHASE_COLORS.inhale.glowColor,
  },
  {
    phase: 'hold',
    label: 'Hold',
    instruction: 'Hold gently, keep it easy',
    targetOrbScale: 1.0,
    color: PHASE_COLORS.hold.color,
    glowColor: PHASE_COLORS.hold.glowColor,
  },
  {
    phase: 'exhale',
    label: 'Exhale',
    instruction: 'Breathe out slowly through your mouth',
    targetOrbScale: 0.45,
    color: PHASE_COLORS.exhale.color,
    glowColor: PHASE_COLORS.exhale.glowColor,
  },
  {
    phase: 'rest',
    label: 'Rest',
    instruction: 'Rest naturally, then return when ready',
    targetOrbScale: 0.45,
    color: PHASE_COLORS.rest.color,
    glowColor: PHASE_COLORS.rest.glowColor,
  },
];

// Target session durations in seconds, mapped from the human-facing minute labels.
// Cycle counts are derived per rhythm so each session length stays close to its label.
const SESSION_LENGTH_TARGETS: Record<SessionLength, number> = {
  quick: 180,   // ~3 min
  short: 300,   // ~5 min
  medium: 420,  // ~7 min
  long: 600,    // ~10 min
};

function buildPattern(durations: [number, number, number, number]): PhaseConfig[] {
  return BASE_PHASES.map((base, i) => ({ ...base, duration: durations[i] }));
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
  description: string,
  durations: [number, number, number, number]
): Rhythm {
  const pattern = buildPattern(durations);
  const cycleDuration = sumDurations(pattern);
  return {
    id,
    label,
    description,
    pattern,
    cycleDuration,
    sessionCycles: recalibrateCycles(cycleDuration),
  };
}

export const RHYTHMS: Record<RhythmId, Rhythm> = {
  standard: buildRhythm(
    'standard',
    'Standard',
    'Balanced 4-4-6-8 pattern. The default for first-time users.',
    [4, 4, 6, 8]
  ),
  gentle: buildRhythm(
    'gentle',
    'Gentle',
    'Shorter cycle with a lighter hold and a more permissive exhale. Good for new users or anyone who feels rushed by the standard pace.',
    [3, 2, 4, 4]
  ),
  slow: buildRhythm(
    'slow',
    'Slow',
    'Longer inhale, longer hold, and a much longer exhale. Good for experienced breathwork users. Slow rather than Deep to avoid colliding with the Deep sound texture label.',
    [6, 6, 10, 4]
  ),
};

export function isRhythmId(value: unknown): value is RhythmId {
  return value === 'standard' || value === 'gentle' || value === 'slow';
}

export function getRhythm(id: RhythmId | string | null | undefined): Rhythm {
  return isRhythmId(id) ? RHYTHMS[id] : RHYTHMS[DEFAULT_RHYTHM];
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
  const last = rhythm.pattern[rhythm.pattern.length - 1];
  return { config: last, timeInPhase: last.duration, phaseIndex: rhythm.pattern.length - 1 };
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

// Back-compat aliases for the default rhythm. Existing consumers (useBreathingSession,
// BreathingOrb, GameHUD, useAudioEngine, game/page.tsx) still read these. Remove once those
// consumers have been migrated to read from a selected rhythm explicitly.
export const BREATHING_PATTERN: PhaseConfig[] = RHYTHMS[DEFAULT_RHYTHM].pattern;
export const CYCLE_DURATION: number = RHYTHMS[DEFAULT_RHYTHM].cycleDuration;
export const SESSION_CYCLES: Record<SessionLength, number> = RHYTHMS[DEFAULT_RHYTHM].sessionCycles;
