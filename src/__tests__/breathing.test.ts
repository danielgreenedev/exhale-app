import {
  DEFAULT_RHYTHM,
  getNextPhase,
  getPhaseAtTime,
  getPhaseLookahead,
  getRhythm,
  easeInOutCubic,
  isRhythmId,
  normalizeRhythmId,
  PHASE_LOOKAHEAD_SECONDS,
  RHYTHMS,
} from '@/lib/breathing';

const DEFAULT_CYCLE_DURATION = RHYTHMS[DEFAULT_RHYTHM].cycleDuration;

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

  it('returns exhale at the inhale/exhale boundary (t=4)', () => {
    const { config, timeInPhase, phaseIndex } = getPhaseAtTime(4);
    expect(config.phase).toBe('exhale');
    expect(timeInPhase).toBe(0);
    expect(phaseIndex).toBe(1);
  });

  it('returns exhale mid-phase at t=5', () => {
    const { config, timeInPhase } = getPhaseAtTime(5);
    expect(config.phase).toBe('exhale');
    expect(timeInPhase).toBe(1);
  });

  it('clamps at cycle end and returns the last visible phase at t=8', () => {
    const { config, phaseIndex } = getPhaseAtTime(8);
    expect(config.phase).toBe('exhale');
    expect(phaseIndex).toBe(1);
  });

  it('clamps beyond cycle end gracefully', () => {
    const { config } = getPhaseAtTime(999);
    expect(config.phase).toBe('exhale');
  });

  it('timeInPhase never exceeds phase duration', () => {
    for (let t = 0; t < DEFAULT_CYCLE_DURATION; t += 0.1) {
      const { config, timeInPhase } = getPhaseAtTime(t);
      expect(timeInPhase).toBeGreaterThanOrEqual(0);
      expect(timeInPhase).toBeLessThanOrEqual(config.duration);
    }
  });

  it('covers all phases as t sweeps through a full cycle', () => {
    const seen = new Set<string>();
    for (let t = 0; t < DEFAULT_CYCLE_DURATION; t += 0.5) {
      seen.add(getPhaseAtTime(t).config.phase);
    }
    expect(seen).toEqual(new Set(['inhale', 'exhale']));
  });
});

describe('RHYTHMS registry', () => {
  it('exposes standard, gentle, box, and flow rhythms', () => {
    expect(Object.keys(RHYTHMS).sort()).toEqual(['box', 'flow', 'gentle', 'standard']);
  });

  it('standard rhythm uses the 4-4-4-4 Box timing', () => {
    const phases = RHYTHMS.standard.pattern.map((p) => p.phase);
    expect(phases).toEqual(['inhale', 'hold', 'exhale', 'hold']);
    expect(RHYTHMS.standard.pattern.map((p) => p.duration)).toEqual([4, 4, 4, 4]);
    expect(RHYTHMS.standard.pattern[3].targetOrbScale).toBe(0.45);
    expect(RHYTHMS.standard.cycleDuration).toBe(16);
    expect(RHYTHMS.standard.sessionCycles).toEqual({ quick: 11, short: 19, medium: 26, long: 38 });
  });

  it('gentle rhythm is the default for new users', () => {
    expect(DEFAULT_RHYTHM).toBe('gentle');
  });

  it('gentle rhythm uses the 4-4 Soft timing without holds', () => {
    const phases = RHYTHMS.gentle.pattern.map((p) => p.phase);
    expect(phases).toEqual(['inhale', 'exhale']);
    expect(RHYTHMS.gentle.pattern.map((p) => p.duration)).toEqual([4, 4]);
    expect(RHYTHMS.gentle.cycleDuration).toBe(8);
  });

  it('flow rhythm uses the 4-6 hold-less timing', () => {
    const phases = RHYTHMS.flow.pattern.map((p) => p.phase);
    expect(phases).toEqual(['inhale', 'exhale']);
    expect(RHYTHMS.flow.pattern.map((p) => p.duration)).toEqual([4, 6]);
    expect(RHYTHMS.flow.cycleDuration).toBe(10);
  });

  it('each rhythm exposes its expected visible phase order', () => {
    expect(RHYTHMS.standard.pattern.map((p) => p.phase)).toEqual(['inhale', 'hold', 'exhale', 'hold']);
    expect(RHYTHMS.gentle.pattern.map((p) => p.phase)).toEqual(['inhale', 'exhale']);
    expect(RHYTHMS.box.pattern.map((p) => p.phase)).toEqual(['inhale', 'hold', 'exhale']);
    expect(RHYTHMS.flow.pattern.map((p) => p.phase)).toEqual(['inhale', 'exhale']);
  });

  it('box storage id exposes the 4-7-8 structured timing', () => {
    expect(RHYTHMS.box.pattern.map((p) => p.duration)).toEqual([4, 7, 8]);
    expect(RHYTHMS.box.cycleDuration).toBe(19);
    expect(RHYTHMS.box.sessionCycles).toEqual({ quick: 9, short: 16, medium: 22, long: 32 });
    expect(RHYTHMS.box.label).toBe('Relax');
  });

  it('current rhythms do not include a post-exhale phase', () => {
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
      expect(RHYTHMS[id].pattern.some((p) => (p.phase as string) === 'rest')).toBe(false);
    });
  });

  it('Inhale and Exhale always have positive durations; Hold is optional and may repeat', () => {
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
      const pattern = RHYTHMS[id].pattern;
      const inhale = pattern.find((p) => p.phase === 'inhale');
      const exhale = pattern.find((p) => p.phase === 'exhale');
      const holds = pattern.filter((p) => p.phase === 'hold');
      expect(inhale?.duration).toBeGreaterThan(0);
      expect(exhale?.duration).toBeGreaterThan(0);
      holds.forEach((hold) => expect(hold.duration).toBeGreaterThan(0));
    });
  });

  it('each rhythm reports its true cycle duration', () => {
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
      const summed = RHYTHMS[id].pattern.reduce((acc, p) => acc + p.duration, 0);
      expect(RHYTHMS[id].cycleDuration).toBe(summed);
    });
  });

  it('each rhythm keeps the guided exhale at least as long as the guided inhale', () => {
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
      const inhale = RHYTHMS[id].pattern.find((p) => p.phase === 'inhale');
      const exhale = RHYTHMS[id].pattern.find((p) => p.phase === 'exhale');
      expect(exhale?.duration).toBeGreaterThanOrEqual(inhale?.duration ?? 0);
    });
  });

  it('rhythm labels and descriptions stay human-facing', () => {
    expect(RHYTHMS.standard.label).toBe('Box');
    expect(RHYTHMS.gentle.label).toBe('Soft');
    expect(RHYTHMS.box.label).toBe('Relax');
    expect(RHYTHMS.flow.label).toBe('Flow');

    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
      expect(RHYTHMS[id].description).not.toContain('breaths/min');
      expect(RHYTHMS[id].description).not.toMatch(/\d-\d-\d-\d/);
    });
  });

  it('session-cycle counts keep each label within one cycle of its target duration', () => {
    const targetsSec = { quick: 180, short: 300, medium: 420, long: 600 } as const;
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
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
  it('accepts the four known rhythms', () => {
    expect(isRhythmId('standard')).toBe(true);
    expect(isRhythmId('gentle')).toBe(true);
    expect(isRhythmId('box')).toBe(true);
    expect(isRhythmId('flow')).toBe(true);
  });

  it('rejects unknown strings and non-strings', () => {
    expect(isRhythmId('full')).toBe(false);
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
    expect(getRhythm('box').id).toBe('box');
  });

  it('maps legacy Full/Slow ids to the structured rhythm storage id', () => {
    expect(getRhythm('full').id).toBe('box');
    expect(getRhythm('slow').id).toBe('box');
  });

  it('falls back to the default rhythm for unknown or empty input', () => {
    expect(getRhythm('classic').id).toBe(DEFAULT_RHYTHM);
    expect(getRhythm(null).id).toBe(DEFAULT_RHYTHM);
    expect(getRhythm(undefined).id).toBe(DEFAULT_RHYTHM);
    expect(getRhythm('').id).toBe(DEFAULT_RHYTHM);
  });
});

describe('getNextPhase', () => {
  it('returns the next phase in the default Soft order', () => {
    expect(getNextPhase(0).phase).toBe('exhale');
    expect(getNextPhase(1).phase).toBe('inhale');
  });

  it('supports Box as a four-phase rhythm with duplicate Hold phases', () => {
    expect(getNextPhase(0, RHYTHMS.standard).phase).toBe('hold');
    expect(getNextPhase(1, RHYTHMS.standard).phase).toBe('exhale');
    expect(getNextPhase(2, RHYTHMS.standard).phase).toBe('hold');
    expect(getNextPhase(3, RHYTHMS.standard).phase).toBe('inhale');
  });

  it('supports Flow as a true two-phase rhythm', () => {
    const flow = RHYTHMS.flow;
    expect(getNextPhase(0, flow).phase).toBe('exhale');
    expect(getNextPhase(1, flow).phase).toBe('inhale');
  });
});

describe('getPhaseLookahead', () => {
  it('uses the full PHASE_LOOKAHEAD_SECONDS for phases of 3.2s or longer', () => {
    RHYTHMS.box.pattern.filter((p) => p.duration > 0).forEach((p) => {
      expect(getPhaseLookahead(p)).toBe(PHASE_LOOKAHEAD_SECONDS);
    });
  });

  it('caps the lookahead at 25% of phase duration for short phases', () => {
    expect(getPhaseLookahead({ ...RHYTHMS.standard.pattern[1], duration: 1 })).toBe(0.25);
    expect(getPhaseLookahead({ ...RHYTHMS.gentle.pattern[0], duration: 3 })).toBe(0.75);
  });

  it('returns 0 for a defensive zero-duration phase object', () => {
    expect(getPhaseLookahead({ ...RHYTHMS.standard.pattern[0], duration: 0 })).toBe(0);
  });

  it('never returns a value exceeding 25% of phase duration', () => {
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
      RHYTHMS[id].pattern.forEach((p) => {
        if (p.duration > 0) {
          expect(getPhaseLookahead(p)).toBeLessThanOrEqual(p.duration * 0.25 + 1e-9);
        }
      });
    });
  });
});

describe('getPhaseAtTime with the Flow rhythm', () => {
  // Flow is a true 4-6 two-phase cycle.
  const flow = RHYTHMS.flow;

  it('returns inhale at t=0 and across the Inhale window', () => {
    expect(getPhaseAtTime(0, flow).config.phase).toBe('inhale');
    expect(getPhaseAtTime(2, flow).config.phase).toBe('inhale');
    expect(getPhaseAtTime(3.99, flow).config.phase).toBe('inhale');
  });

  it('returns Exhale at t=4', () => {
    const { config, phaseIndex } = getPhaseAtTime(4, flow);
    expect(config.phase).toBe('exhale');
    expect(phaseIndex).toBe(1);
  });

  it('stays in Exhale through the end of the cycle', () => {
    expect(getPhaseAtTime(9.99, flow).config.phase).toBe('exhale');
    expect(getPhaseAtTime(10, flow).config.phase).toBe('exhale');
  });

  it('Hold is not part of the Flow pattern', () => {
    expect(flow.pattern.map((p) => p.phase)).toEqual(['inhale', 'exhale']);
    for (let t = 0; t < flow.cycleDuration; t += 0.1) {
      expect(getPhaseAtTime(t, flow).config.phase).not.toBe('hold');
    }
  });

  it('covers Inhale and Exhale as t sweeps a full cycle', () => {
    const seen = new Set<string>();
    for (let t = 0; t < flow.cycleDuration; t += 0.1) {
      seen.add(getPhaseAtTime(t, flow).config.phase);
    }
    expect(seen).toEqual(new Set(['inhale', 'exhale']));
  });
});

describe('getPhaseAtTime with a non-default rhythm', () => {
  it('uses gentle pattern boundaries when passed the gentle rhythm', () => {
    // Soft is 4-4 = 8s cycle.
    const gentle = RHYTHMS.gentle;
    expect(getPhaseAtTime(0, gentle).config.phase).toBe('inhale');
    expect(getPhaseAtTime(3.99, gentle).config.phase).toBe('inhale');
    expect(getPhaseAtTime(4, gentle).config.phase).toBe('exhale');
    expect(getPhaseAtTime(7.99, gentle).config.phase).toBe('exhale');
    expect(getPhaseAtTime(8, gentle).config.phase).toBe('exhale');
  });

  it('uses box pattern boundaries when passed the box rhythm', () => {
    // The `box` storage id now carries the 4-7-8 rhythm.
    const box = RHYTHMS.box;
    expect(getPhaseAtTime(0, box).config.phase).toBe('inhale');
    expect(getPhaseAtTime(3.99, box).config.phase).toBe('inhale');
    expect(getPhaseAtTime(4, box).config.phase).toBe('hold');
    expect(getPhaseAtTime(11, box).config.phase).toBe('exhale');
    expect(getPhaseAtTime(18.99, box).config.phase).toBe('exhale');
    expect(getPhaseAtTime(19, box).config.phase).toBe('exhale');
  });
});

describe('normalizeRhythmId', () => {
  it('keeps current ids and maps legacy ids to the structured rhythm storage id', () => {
    expect(normalizeRhythmId('standard')).toBe('standard');
    expect(normalizeRhythmId('box')).toBe('box');
    expect(normalizeRhythmId('full')).toBe('box');
    expect(normalizeRhythmId('slow')).toBe('box');
  });

  it('returns null or the provided fallback for unknown values', () => {
    expect(normalizeRhythmId('classic')).toBeNull();
    expect(normalizeRhythmId('classic', 'gentle')).toBe('gentle');
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
