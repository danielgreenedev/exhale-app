export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
export type SessionLength = 'quick' | 'short' | 'medium' | 'long';

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
    color: 'hsl(198, 45%, 63%)',
    glowColor: 'hsla(198, 45%, 63%, 0.28)',
  },
  {
    phase: 'hold',
    duration: 4,
    label: 'Hold',
    instruction: 'Hold gently and comfortably',
    targetOrbScale: 1.0,
    color: 'hsl(40, 55%, 61%)',
    glowColor: 'hsla(40, 55%, 61%, 0.28)',
  },
  {
    phase: 'exhale',
    duration: 6,
    label: 'Exhale',
    instruction: 'Breathe out slowly through your mouth',
    targetOrbScale: 0.45,
    color: 'hsl(148, 35%, 53%)',
    glowColor: 'hsla(148, 35%, 53%, 0.28)',
  },
  {
    phase: 'rest',
    duration: 2,
    label: 'Rest',
    instruction: 'Rest naturally before the next breath',
    targetOrbScale: 0.45,
    color: 'hsl(348, 42%, 66%)',
    glowColor: 'hsla(348, 42%, 66%, 0.28)',
  },
];

export const CYCLE_DURATION = BREATHING_PATTERN.reduce((acc, p) => acc + p.duration, 0); // 16s

export const SESSION_CYCLES: Record<SessionLength, number> = {
  quick: 11,   // ~2m 56s
  short: 20,   // ~5m 20s
  medium: 26,  // ~6m 56s
  long: 37,    // ~9m 52s
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
