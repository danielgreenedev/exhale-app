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

  it('returns rest mid-phase at t=16', () => {
    const { config, timeInPhase } = getPhaseAtTime(16);
    expect(config.phase).toBe('rest');
    expect(timeInPhase).toBe(2);
  });

  it('clamps at cycle end and returns last phase at t=18', () => {
    const { config, phaseIndex } = getPhaseAtTime(18);
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
  it('exposes standard, gentle, box, and flow rhythms', () => {
    expect(Object.keys(RHYTHMS).sort()).toEqual(['box', 'flow', 'gentle', 'standard']);
  });

  it('standard rhythm uses the 4-4-6-4 Steady timing', () => {
    const phases = RHYTHMS.standard.pattern.map((p) => p.phase);
    expect(phases).toEqual(['inhale', 'hold', 'exhale', 'rest']);
    expect(RHYTHMS.standard.pattern.map((p) => p.duration)).toEqual([4, 4, 6, 4]);
    expect(RHYTHMS.standard.cycleDuration).toBe(18);
    expect(RHYTHMS.standard.sessionCycles).toEqual({ quick: 10, short: 17, medium: 23, long: 33 });
  });

  it('flow rhythm uses the 4-0-6-2 hold-less timing', () => {
    const phases = RHYTHMS.flow.pattern.map((p) => p.phase);
    expect(phases).toEqual(['inhale', 'hold', 'exhale', 'rest']);
    expect(RHYTHMS.flow.pattern.map((p) => p.duration)).toEqual([4, 0, 6, 2]);
    expect(RHYTHMS.flow.cycleDuration).toBe(12);
  });

  it('each rhythm has four phases in the expected order', () => {
    (['standard', 'gentle', 'flow'] as const).forEach((id) => {
      const phases = RHYTHMS[id].pattern.map((p) => p.phase);
      expect(phases).toEqual(['inhale', 'hold', 'exhale', 'rest']);
    });
    expect(RHYTHMS.box.pattern.map((p) => p.phase)).toEqual(['inhale', 'hold', 'exhale', 'hold']);
  });

  it('box rhythm uses equal timing with a second Hold after Exhale', () => {
    expect(RHYTHMS.box.pattern.map((p) => p.duration)).toEqual([4, 4, 4, 4]);
    expect(RHYTHMS.box.cycleDuration).toBe(16);
    expect(RHYTHMS.box.sessionCycles).toEqual({ quick: 11, short: 19, medium: 26, long: 38 });
    expect(RHYTHMS.box.pattern[3].label).toBe('Hold');
    expect(RHYTHMS.box.pattern[3].instruction).toBe('Hold gently after exhale');
  });

  it('Inhale and Exhale always have positive durations; Hold and final pause may be zero', () => {
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
      const pattern = RHYTHMS[id].pattern;
      expect(pattern[0].duration).toBeGreaterThan(0); // inhale
      expect(pattern[2].duration).toBeGreaterThan(0); // exhale
      expect(pattern[1].duration).toBeGreaterThanOrEqual(0); // hold may be 0 (flow)
      expect(pattern[3].duration).toBeGreaterThanOrEqual(0); // rest/second hold may be 0 (future rhythms)
    });
  });

  it('each rhythm reports its true cycle duration', () => {
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
      const summed = RHYTHMS[id].pattern.reduce((acc, p) => acc + p.duration, 0);
      expect(RHYTHMS[id].cycleDuration).toBe(summed);
    });
  });

  it('rhythm labels and descriptions stay human-facing', () => {
    expect(RHYTHMS.standard.label).toBe('Steady');
    expect(RHYTHMS.gentle.label).toBe('Soft');
    expect(RHYTHMS.box.label).toBe('Box');
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

  it('maps legacy Full/Slow ids to Box', () => {
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
  it('returns the next phase in canonical order', () => {
    expect(getNextPhase(0).phase).toBe('hold');
    expect(getNextPhase(1).phase).toBe('exhale');
    expect(getNextPhase(2).phase).toBe('rest');
  });

  it('wraps from rest back to inhale', () => {
    expect(getNextPhase(3).phase).toBe('inhale');
  });

  it('skips zero-duration phases (Flow rhythm has Hold=0)', () => {
    const flow = RHYTHMS.flow;
    // From Inhale (index 0), the next visible phase is Exhale, not the zero-duration Hold.
    expect(getNextPhase(0, flow).phase).toBe('exhale');
    // From Hold (index 1, zero duration), next is still Exhale.
    expect(getNextPhase(1, flow).phase).toBe('exhale');
    // From Exhale (index 2), next is the brief Relax.
    expect(getNextPhase(2, flow).phase).toBe('rest');
    // From Relax (index 3), wrap back to Inhale (also skipping Hold).
    expect(getNextPhase(3, flow).phase).toBe('inhale');
  });
});

describe('getPhaseLookahead', () => {
  it('uses the full PHASE_LOOKAHEAD_SECONDS for phases of 3.2s or longer', () => {
    // Steady Inhale 4s, Hold 4s, Exhale 6s, Relax 4s — all at or above the 3.2s breakpoint.
    RHYTHMS.standard.pattern.forEach((p) => {
      expect(getPhaseLookahead(p)).toBe(PHASE_LOOKAHEAD_SECONDS);
    });
    // Box Inhale 4s, Hold 4s, Exhale 4s, Hold 4s - also all above.
    RHYTHMS.box.pattern.forEach((p) => {
      expect(getPhaseLookahead(p)).toBe(PHASE_LOOKAHEAD_SECONDS);
    });
  });

  it('caps the lookahead at 25% of phase duration for short phases', () => {
    // Soft Hold 2s -> 0.5s; Soft Inhale 3s -> 0.75s; Soft Exhale 4s -> 0.8s (unchanged); Relax 4s -> 0.8s.
    expect(getPhaseLookahead(RHYTHMS.gentle.pattern[0])).toBe(0.75); // inhale 3s
    expect(getPhaseLookahead(RHYTHMS.gentle.pattern[1])).toBe(0.5);  // hold 2s
    expect(getPhaseLookahead(RHYTHMS.gentle.pattern[2])).toBe(PHASE_LOOKAHEAD_SECONDS); // exhale 4s
    expect(getPhaseLookahead(RHYTHMS.gentle.pattern[3])).toBe(PHASE_LOOKAHEAD_SECONDS); // relax 4s
  });

  it('caps Flow Relax (2s) to 0.5s', () => {
    const flowRelax = RHYTHMS.flow.pattern[3];
    expect(getPhaseLookahead(flowRelax)).toBe(0.5);
  });

  it('returns 0 for zero-duration phases (Flow Hold)', () => {
    const flowHold = RHYTHMS.flow.pattern[1];
    expect(flowHold.duration).toBe(0);
    expect(getPhaseLookahead(flowHold)).toBe(0);
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
  // Flow is 4-0-6-2 = 12s cycle. Phase index 1 (Hold) has zero duration.
  const flow = RHYTHMS.flow;

  it('returns inhale at t=0 and across the Inhale window', () => {
    expect(getPhaseAtTime(0, flow).config.phase).toBe('inhale');
    expect(getPhaseAtTime(2, flow).config.phase).toBe('inhale');
    expect(getPhaseAtTime(3.99, flow).config.phase).toBe('inhale');
  });

  it('skips the zero-duration Hold and returns Exhale at t=4', () => {
    const { config, phaseIndex } = getPhaseAtTime(4, flow);
    expect(config.phase).toBe('exhale');
    expect(phaseIndex).toBe(2);
  });

  it('stays in Exhale until t=10, then returns Relax', () => {
    expect(getPhaseAtTime(9.99, flow).config.phase).toBe('exhale');
    expect(getPhaseAtTime(10, flow).config.phase).toBe('rest');
    expect(getPhaseAtTime(11.99, flow).config.phase).toBe('rest');
  });

  it('the zero-duration Hold is never the active phase', () => {
    for (let t = 0; t < flow.cycleDuration; t += 0.1) {
      const { phaseIndex } = getPhaseAtTime(t, flow);
      expect(phaseIndex).not.toBe(1);
    }
  });

  it('covers Inhale, Exhale, and Relax as t sweeps a full cycle (Hold is unreachable)', () => {
    const seen = new Set<string>();
    for (let t = 0; t < flow.cycleDuration; t += 0.1) {
      seen.add(getPhaseAtTime(t, flow).config.phase);
    }
    expect(seen).toEqual(new Set(['inhale', 'exhale', 'rest']));
  });
});

describe('getPhaseAtTime with a non-default rhythm', () => {
  it('uses gentle pattern boundaries when passed the gentle rhythm', () => {
    // Soft is 3-2-4-4 = 13s cycle.
    const gentle = RHYTHMS.gentle;
    expect(getPhaseAtTime(0, gentle).config.phase).toBe('inhale');
    expect(getPhaseAtTime(2.99, gentle).config.phase).toBe('inhale');
    expect(getPhaseAtTime(3, gentle).config.phase).toBe('hold');
    expect(getPhaseAtTime(5, gentle).config.phase).toBe('exhale');
    expect(getPhaseAtTime(9, gentle).config.phase).toBe('rest');
    expect(getPhaseAtTime(12.99, gentle).config.phase).toBe('rest');
  });

  it('uses box pattern boundaries when passed the box rhythm', () => {
    // Box is 4-4-4-4 = 16s cycle, with a second Hold after Exhale.
    const box = RHYTHMS.box;
    expect(getPhaseAtTime(0, box).config.phase).toBe('inhale');
    expect(getPhaseAtTime(3.99, box).config.phase).toBe('inhale');
    expect(getPhaseAtTime(4, box).config.phase).toBe('hold');
    expect(getPhaseAtTime(8, box).config.phase).toBe('exhale');
    expect(getPhaseAtTime(12, box).config.phase).toBe('hold');
    expect(getPhaseAtTime(15.99, box).config.phase).toBe('hold');
  });
});

describe('normalizeRhythmId', () => {
  it('keeps current ids and maps legacy ids to Box', () => {
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
