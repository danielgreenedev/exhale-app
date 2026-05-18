import {
  BREATHING_PATTERN,
  CYCLE_DURATION,
  getPhaseAtTime,
  easeInOutCubic,
} from '@/lib/breathing';

describe('BREATHING_PATTERN', () => {
  it('has four phases in the correct order', () => {
    const phases = BREATHING_PATTERN.map((p) => p.phase);
    expect(phases).toEqual(['inhale', 'hold', 'exhale', 'rest']);
  });

  it('totals to CYCLE_DURATION', () => {
    const total = BREATHING_PATTERN.reduce((acc, p) => acc + p.duration, 0);
    expect(total).toBe(CYCLE_DURATION);
    expect(CYCLE_DURATION).toBe(22);
  });
});

describe('getPhaseAtTime', () => {
  it('returns inhale at t=0', () => {
    const { config, timeInPhase, phaseIndex } = getPhaseAtTime(0);
    expect(config.phase).toBe('inhale');
    expect(timeInPhase).toBe(0);
    expect(phaseIndex).toBe(0);
  });

  it('returns inhale mid-phase at t=2', () => {
    const { config, timeInPhase } = getPhaseAtTime(2);
    expect(config.phase).toBe('inhale');
    expect(timeInPhase).toBe(2);
  });

  it('returns hold at the inhale/hold boundary (t=4)', () => {
    const { config, timeInPhase, phaseIndex } = getPhaseAtTime(4);
    expect(config.phase).toBe('hold');
    expect(timeInPhase).toBe(0);
    expect(phaseIndex).toBe(1);
  });

  it('returns hold mid-phase at t=6', () => {
    const { config, timeInPhase } = getPhaseAtTime(6);
    expect(config.phase).toBe('hold');
    expect(timeInPhase).toBe(2);
  });

  it('returns exhale at the hold/exhale boundary (t=8)', () => {
    const { config, timeInPhase, phaseIndex } = getPhaseAtTime(8);
    expect(config.phase).toBe('exhale');
    expect(timeInPhase).toBe(0);
    expect(phaseIndex).toBe(2);
  });

  it('returns exhale mid-phase at t=11', () => {
    const { config, timeInPhase } = getPhaseAtTime(11);
    expect(config.phase).toBe('exhale');
    expect(timeInPhase).toBe(3);
  });

  it('returns rest at the exhale/rest boundary (t=14)', () => {
    const { config, timeInPhase, phaseIndex } = getPhaseAtTime(14);
    expect(config.phase).toBe('rest');
    expect(timeInPhase).toBe(0);
    expect(phaseIndex).toBe(3);
  });

  it('returns rest mid-phase at t=18', () => {
    const { config, timeInPhase } = getPhaseAtTime(18);
    expect(config.phase).toBe('rest');
    expect(timeInPhase).toBe(4);
  });

  it('clamps at cycle end and returns last phase at t=22', () => {
    const { config, phaseIndex } = getPhaseAtTime(22);
    expect(config.phase).toBe('rest');
    expect(phaseIndex).toBe(3);
  });

  it('clamps beyond cycle end gracefully', () => {
    const { config } = getPhaseAtTime(999);
    expect(config.phase).toBe('rest');
  });

  it('timeInPhase never exceeds phase duration', () => {
    for (let t = 0; t < CYCLE_DURATION; t += 0.1) {
      const { config, timeInPhase } = getPhaseAtTime(t);
      expect(timeInPhase).toBeGreaterThanOrEqual(0);
      expect(timeInPhase).toBeLessThanOrEqual(config.duration);
    }
  });

  it('covers all phases as t sweeps through a full cycle', () => {
    const seen = new Set<string>();
    for (let t = 0; t < CYCLE_DURATION; t += 0.5) {
      seen.add(getPhaseAtTime(t).config.phase);
    }
    expect(seen).toEqual(new Set(['inhale', 'hold', 'exhale', 'rest']));
  });
});

describe('easeInOutCubic', () => {
  it('returns 0 at t=0', () => {
    expect(easeInOutCubic(0)).toBe(0);
  });

  it('returns 1 at t=1', () => {
    expect(easeInOutCubic(1)).toBe(1);
  });

  it('returns 0.5 at t=0.5 (symmetric midpoint)', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });

  it('is monotonically increasing', () => {
    let prev = easeInOutCubic(0);
    for (let t = 0.05; t <= 1; t += 0.05) {
      const curr = easeInOutCubic(t);
      expect(curr).toBeGreaterThan(prev);
      prev = curr;
    }
  });

  it('output stays in [0, 1] for inputs in [0, 1]', () => {
    for (let t = 0; t <= 1; t += 0.01) {
      const v = easeInOutCubic(t);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});
