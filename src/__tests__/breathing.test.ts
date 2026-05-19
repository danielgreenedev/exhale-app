import {
  DEFAULT_RHYTHM,
  getPhaseAtTime,
  getRhythm,
  easeInOutCubic,
  isRhythmId,
  RHYTHMS,
} from '@/lib/breathing';

const STANDARD_CYCLE_DURATION = RHYTHMS.standard.cycleDuration;

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
    for (let t = 0; t < STANDARD_CYCLE_DURATION; t += 0.1) {
      const { config, timeInPhase } = getPhaseAtTime(t);
      expect(timeInPhase).toBeGreaterThanOrEqual(0);
      expect(timeInPhase).toBeLessThanOrEqual(config.duration);
    }
  });

  it('covers all phases as t sweeps through a full cycle', () => {
    const seen = new Set<string>();
    for (let t = 0; t < STANDARD_CYCLE_DURATION; t += 0.5) {
      seen.add(getPhaseAtTime(t).config.phase);
    }
    expect(seen).toEqual(new Set(['inhale', 'hold', 'exhale', 'rest']));
  });
});

describe('RHYTHMS registry', () => {
  it('exposes standard, gentle, and slow rhythms', () => {
    expect(Object.keys(RHYTHMS).sort()).toEqual(['gentle', 'slow', 'standard']);
  });

  it('standard rhythm preserves the canonical 4-4-6-8 timing', () => {
    const phases = RHYTHMS.standard.pattern.map((p) => p.phase);
    expect(phases).toEqual(['inhale', 'hold', 'exhale', 'rest']);
    expect(RHYTHMS.standard.pattern.map((p) => p.duration)).toEqual([4, 4, 6, 8]);
    expect(RHYTHMS.standard.cycleDuration).toBe(22);
    expect(RHYTHMS.standard.sessionCycles).toEqual({ quick: 8, short: 14, medium: 19, long: 27 });
  });

  it('each rhythm has four phases in the canonical order with positive durations', () => {
    (['standard', 'gentle', 'slow'] as const).forEach((id) => {
      const phases = RHYTHMS[id].pattern.map((p) => p.phase);
      expect(phases).toEqual(['inhale', 'hold', 'exhale', 'rest']);
      RHYTHMS[id].pattern.forEach((p) => expect(p.duration).toBeGreaterThan(0));
    });
  });

  it('each rhythm reports its true cycle duration', () => {
    (['standard', 'gentle', 'slow'] as const).forEach((id) => {
      const summed = RHYTHMS[id].pattern.reduce((acc, p) => acc + p.duration, 0);
      expect(RHYTHMS[id].cycleDuration).toBe(summed);
    });
  });

  it('session-cycle counts keep each label within one cycle of its target duration', () => {
    const targetsSec = { quick: 180, short: 300, medium: 420, long: 600 } as const;
    (['standard', 'gentle', 'slow'] as const).forEach((id) => {
      const rhythm = RHYTHMS[id];
      (['quick', 'short', 'medium', 'long'] as const).forEach((len) => {
        const actual = rhythm.sessionCycles[len] * rhythm.cycleDuration;
        // Within half a cycle either side of the target — guarantees the minute label stays honest.
        expect(Math.abs(actual - targetsSec[len])).toBeLessThanOrEqual(rhythm.cycleDuration / 2);
      });
    });
  });
});

describe('isRhythmId', () => {
  it('accepts the three known rhythms', () => {
    expect(isRhythmId('standard')).toBe(true);
    expect(isRhythmId('gentle')).toBe(true);
    expect(isRhythmId('slow')).toBe(true);
  });

  it('rejects unknown strings and non-strings', () => {
    expect(isRhythmId('classic')).toBe(false);
    expect(isRhythmId('')).toBe(false);
    expect(isRhythmId(null)).toBe(false);
    expect(isRhythmId(undefined)).toBe(false);
    expect(isRhythmId(42)).toBe(false);
  });
});

describe('getRhythm', () => {
  it('returns the requested rhythm when given a valid id', () => {
    expect(getRhythm('gentle').id).toBe('gentle');
    expect(getRhythm('slow').id).toBe('slow');
  });

  it('falls back to the default rhythm for unknown or empty input', () => {
    expect(getRhythm('classic').id).toBe(DEFAULT_RHYTHM);
    expect(getRhythm(null).id).toBe(DEFAULT_RHYTHM);
    expect(getRhythm(undefined).id).toBe(DEFAULT_RHYTHM);
    expect(getRhythm('').id).toBe(DEFAULT_RHYTHM);
  });
});

describe('getPhaseAtTime with a non-default rhythm', () => {
  it('uses gentle pattern boundaries when passed the gentle rhythm', () => {
    // Gentle is 3-2-4-4 = 13s cycle.
    const gentle = RHYTHMS.gentle;
    expect(getPhaseAtTime(0, gentle).config.phase).toBe('inhale');
    expect(getPhaseAtTime(2.99, gentle).config.phase).toBe('inhale');
    expect(getPhaseAtTime(3, gentle).config.phase).toBe('hold');
    expect(getPhaseAtTime(5, gentle).config.phase).toBe('exhale');
    expect(getPhaseAtTime(9, gentle).config.phase).toBe('rest');
    expect(getPhaseAtTime(12.99, gentle).config.phase).toBe('rest');
  });

  it('uses deep pattern boundaries when passed the deep rhythm', () => {
    // Deep is 6-6-10-4 = 26s cycle.
    const deep = RHYTHMS.slow;
    expect(getPhaseAtTime(0, deep).config.phase).toBe('inhale');
    expect(getPhaseAtTime(5.99, deep).config.phase).toBe('inhale');
    expect(getPhaseAtTime(6, deep).config.phase).toBe('hold');
    expect(getPhaseAtTime(12, deep).config.phase).toBe('exhale');
    expect(getPhaseAtTime(22, deep).config.phase).toBe('rest');
    expect(getPhaseAtTime(25.99, deep).config.phase).toBe('rest');
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
