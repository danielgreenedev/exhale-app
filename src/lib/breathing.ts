import { PHASE_COLORS } from '@/lib/colors';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
export type SessionLength = 'quick' | 'short' | 'medium' | 'long';
export type RhythmId = 'standard' | 'gentle' | 'full' | 'flow';

export const DEFAULT_SESSION_LENGTH: SessionLength = 'quick';
export const DEFAULT_ORB_SCALE = 1;
export const DEFAULT_RHYTHM: RhythmId = 'standard';
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
  label: string;        // Short name shown on the rhythm tile (e.g., "Steady").
  summary: string;      // One-word relative descriptor for aria labels and helper context.
  description: string;  // Short scannable phrase shown in the connected rhythm helper.
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
    // The phase enum stays 'rest' as the canonical discriminator across rhythm presets.
    // "Relax" keeps grammatical parity with the other labels; the instruction carries
    // the clarification beta testers needed so it cannot be mistaken for a pause.
    phase: 'rest',
    label: 'Relax',
    instruction: 'Breathe naturally',
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
  summary: string,
  description: string,
  durations: [number, number, number, number]
): Rhythm {
  const pattern = buildPattern(durations);
  const cycleDuration = sumDurations(pattern);
  return {
    id,
    label,
    summary,
    description,
    pattern,
    cycleDuration,
    sessionCycles: recalibrateCycles(cycleDuration),
  };
}

export const RHYTHMS: Record<RhythmId, Rhythm> = {
  standard: buildRhythm(
    'standard',
    'Steady',
    'Balanced',
    'A balanced, grounding baseline rhythm.',
    [4, 4, 6, 8]
  ),
  gentle: buildRhythm(
    'gentle',
    'Soft',
    'Accessible',
    'Shorter, lighter cycles for easier breathing.',
    [3, 2, 4, 4]
  ),
  full: buildRhythm(
    'full',
    'Full',
    'Deep',
    'A slower, deeper rhythm with longer breaths.',
    [6, 6, 10, 4]
  ),
  flow: buildRhythm(
    'flow',
    'Flow',
    'Continuous',
    'No hold, steady momentum.',
    [4, 0, 6, 2]
  ),
};

export function isRhythmId(value: unknown): value is RhythmId {
  return value === 'standard' || value === 'gentle' || value === 'full' || value === 'flow';
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

// The effective anticipation-cue lead window for a given phase. Capped at 25% of phase duration
// so short phases (Soft 2s Hold, Flow 2s Relax) don't have a lead that occupies 40% of the
// phase and reads as jittery. Long phases use the full PHASE_LOOKAHEAD_SECONDS constant.
// Zero-duration phases return 0; getPhaseAtTime never makes them active, but defensive coding.
export function getPhaseLookahead(phase: PhaseConfig): number {
  if (phase.duration <= 0) return 0;
  return Math.min(PHASE_LOOKAHEAD_SECONDS, phase.duration * 0.25);
}

export function getNextPhase(phaseIndex: number, rhythm: Rhythm = RHYTHMS[DEFAULT_RHYTHM]): PhaseConfig {
  // Skip zero-duration phases so anticipation cues never lead into a phase with no screen time.
  // Flow (4-0-6-2) has a zero-duration Hold; without this skip, the cue between Inhale and Exhale
  // would target Hold and never reach Exhale.
  const len = rhythm.pattern.length;
  for (let i = 1; i <= len; i++) {
    const next = rhythm.pattern[(phaseIndex + i) % len];
    if (next.duration > 0) return next;
  }
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
