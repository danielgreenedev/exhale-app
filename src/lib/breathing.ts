export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
export type SessionLength = 'short' | 'medium' | 'long';

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
    color: 'hsl(210, 80%, 65%)',
    glowColor: 'hsla(210, 80%, 65%, 0.3)',
  },
  {
    phase: 'hold',
    duration: 4,
    label: 'Hold',
    instruction: 'Hold gently and comfortably',
    targetOrbScale: 1.0,
    color: 'hsl(270, 70%, 70%)',
    glowColor: 'hsla(270, 70%, 70%, 0.3)',
  },
  {
    phase: 'exhale',
    duration: 6,
    label: 'Exhale',
    instruction: 'Breathe out slowly through your mouth',
    targetOrbScale: 0.45,
    color: 'hsl(160, 65%, 55%)',
    glowColor: 'hsla(160, 65%, 55%, 0.3)',
  },
  {
    phase: 'rest',
    duration: 2,
    label: 'Rest',
    instruction: 'Rest naturally before the next breath',
    targetOrbScale: 0.45,
    color: 'hsl(45, 75%, 62%)',
    glowColor: 'hsla(45, 75%, 62%, 0.3)',
  },
];

export const CYCLE_DURATION = BREATHING_PATTERN.reduce((acc, p) => acc + p.duration, 0); // 16s

export const SESSION_CYCLES: Record<SessionLength, number> = {
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

// Smooth easing between 0 and 1 using cubic ease-in-out
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Compute animated orb scale based on phase progress (0–1)
export function getOrbScale(phase: PhaseConfig, progress: number, prevScale: number): number {
  const target = phase.targetOrbScale;
  if (phase.phase === 'inhale') return prevScale + (target - prevScale) * easeInOutCubic(progress);
  if (phase.phase === 'exhale') return prevScale + (target - prevScale) * easeInOutCubic(progress);
  return target; // hold / rest — stay at target
}
