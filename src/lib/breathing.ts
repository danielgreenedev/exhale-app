import { PHASE_COLORS } from '@/lib/colors';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
export type SessionLength = 'quick' | 'short' | 'medium' | 'long';

export const DEFAULT_SESSION_LENGTH: SessionLength = 'quick';
export const DEFAULT_ORB_SCALE = 1;

export interface PhaseConfig {
  phase: BreathingPhase;
  duration: number; // seconds
  label: string;
  instruction: string;
  targetOrbScale: number; // 0–1 relative to max radius
  color: string; // HSL string
  glowColor: string;
}

export const BREATHING_PATTERN: PhaseConfig[] = [
  {
    phase: 'inhale',
    duration: 4,
    label: 'Inhale',
    instruction: 'Breathe in slowly through your nose',
    targetOrbScale: 1.0,
    color: PHASE_COLORS.inhale.color,
    glowColor: PHASE_COLORS.inhale.glowColor,
  },
  {
    phase: 'hold',
    duration: 4,
    label: 'Hold',
    instruction: 'Hold gently, keep it easy',
    targetOrbScale: 1.0,
    color: PHASE_COLORS.hold.color,
    glowColor: PHASE_COLORS.hold.glowColor,
  },
  {
    phase: 'exhale',
    duration: 6,
    label: 'Exhale',
    instruction: 'Breathe out slowly through your mouth',
    targetOrbScale: 0.45,
    color: PHASE_COLORS.exhale.color,
    glowColor: PHASE_COLORS.exhale.glowColor,
  },
  {
    phase: 'rest',
    duration: 8,
    label: 'Rest',
    instruction: 'Rest naturally, then return when ready',
    targetOrbScale: 0.45,
    color: PHASE_COLORS.rest.color,
    glowColor: PHASE_COLORS.rest.glowColor,
  },
];

export const CYCLE_DURATION = BREATHING_PATTERN.reduce((acc, p) => acc + p.duration, 0); // 22s

export const SESSION_CYCLES: Record<SessionLength, number> = {
  quick: 8,    // ~2m 56s
  short: 14,   // ~5m 8s
  medium: 19,  // ~6m 58s
  long: 27,    // ~9m 54s
};

export function getPhaseAtTime(elapsedInCycle: number): { config: PhaseConfig; timeInPhase: number; phaseIndex: number } {
  let accumulated = 0;
  for (let i = 0; i < BREATHING_PATTERN.length; i++) {
    const config = BREATHING_PATTERN[i];
    if (elapsedInCycle < accumulated + config.duration) {
      return { config, timeInPhase: elapsedInCycle - accumulated, phaseIndex: i };
    }
    accumulated += config.duration;
  }
  const last = BREATHING_PATTERN[BREATHING_PATTERN.length - 1];
  return { config: last, timeInPhase: last.duration, phaseIndex: BREATHING_PATTERN.length - 1 };
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
