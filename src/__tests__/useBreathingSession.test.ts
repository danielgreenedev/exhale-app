import { renderHook, act } from '@testing-library/react';
import { useBreathingSession } from '@/hooks/useBreathingSession';
import { RHYTHMS } from '@/lib/breathing';

// jsdom's RAF schedules callbacks but never fires them synchronously.
// Replace it, and performance.now, so tests can drive time explicitly.

let mockTime = 0;
const rafQueue: FrameRequestCallback[] = [];

beforeEach(() => {
  mockTime = 0;
  rafQueue.length = 0;

  jest.spyOn(window.performance, 'now').mockImplementation(() => mockTime);

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    rafQueue.push(cb);
    return rafQueue.length;
  });

  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    const i = (id as number) - 1;
    if (i >= 0 && i < rafQueue.length) rafQueue[i] = () => {};
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

function advance(ms: number) {
  mockTime += ms;
  act(() => {
    const pending = rafQueue.splice(0);
    pending.forEach((cb) => cb(mockTime));
  });
}

describe('useBreathingSession - initial state', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    expect(result.current.sessionState).toBe('idle');
  });

  it('exposes the correct totalCycles for each session length', () => {
    expect(renderHook(() => useBreathingSession('quick')).result.current.totalCycles).toBe(10);
    expect(renderHook(() => useBreathingSession('short')).result.current.totalCycles).toBe(17);
    expect(renderHook(() => useBreathingSession('medium')).result.current.totalCycles).toBe(23);
    expect(renderHook(() => useBreathingSession('long')).result.current.totalCycles).toBe(33);
  });

  it('starts at cycle 1', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    expect(result.current.cycleNumber).toBe(1);
  });

  it('starts with the inhale phase', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    expect(result.current.currentPhase.phase).toBe('inhale');
  });
});

describe('useBreathingSession - start / pause / resume', () => {
  it('transitions to running when start() is called', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    expect(result.current.sessionState).toBe('running');
  });

  it('transitions to paused when pause() is called while running', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    act(() => { result.current.pause(); });
    expect(result.current.sessionState).toBe('paused');
  });

  it('resumes from the same elapsed position after pause/resume', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(2000);

    const elapsedBeforePause = result.current.elapsedTotal;
    act(() => { result.current.pause(); });

    mockTime += 5000;
    expect(result.current.elapsedTotal).toBeCloseTo(elapsedBeforePause, 1);

    act(() => { result.current.start(); });
    advance(1000);
    expect(result.current.elapsedTotal).toBeGreaterThan(elapsedBeforePause);
  });
});

describe('useBreathingSession - reset', () => {
  it('resets back to idle with zero elapsed', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(3000);
    act(() => { result.current.reset(); });
    expect(result.current.sessionState).toBe('idle');
    expect(result.current.elapsedTotal).toBe(0);
    expect(result.current.cycleNumber).toBe(1);
  });
});

describe('useBreathingSession - phase progression', () => {
  it('is in inhale phase during t=0-4s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(2000);
    expect(result.current.currentPhase.phase).toBe('inhale');
  });

  it('is in hold phase during t=4-8s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(5000);
    expect(result.current.currentPhase.phase).toBe('hold');
  });

  it('is in exhale phase during t=8-14s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(10000);
    expect(result.current.currentPhase.phase).toBe('exhale');
  });

  it('is in rest phase during t=14-18s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(15000);
    expect(result.current.currentPhase.phase).toBe('rest');
  });

  it('wraps back to inhale at the start of the second cycle around t=18s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(18500);
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.cycleNumber).toBe(2);
  });

  it('timeRemaining counts down within a phase', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(1000);
    expect(result.current.timeRemaining).toBeLessThanOrEqual(4);
    expect(result.current.timeRemaining).toBeGreaterThan(0);
  });

  it('exposes the next phase before the current phase changes', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(3500);
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.nextPhase.phase).toBe('hold');
    expect(result.current.phaseLeadProgress).toBeGreaterThan(0);
  });

  it('keeps phase lead inactive outside the final transition beat', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(1000);
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.phaseLeadProgress).toBe(0);
  });
});

describe('useBreathingSession - session completion', () => {
  it('completes after all cycles elapse', () => {
    const { result } = renderHook(() => useBreathingSession('quick')); // 10 x 18s = 180s
    act(() => { result.current.start(); });
    for (let t = 0; t <= 181_000; t += 1000) advance(1000);
    expect(result.current.sessionState).toBe('complete');
  });

  it('sessionProgress reaches 1 on completion', () => {
    const { result } = renderHook(() => useBreathingSession('quick'));
    act(() => { result.current.start(); });
    for (let t = 0; t <= 181_000; t += 1000) advance(1000);
    expect(result.current.sessionProgress).toBeCloseTo(1, 2);
  });
});

describe('useBreathingSession - resume from initialElapsed', () => {
  it('starts mid-session when initialElapsed is provided', () => {
    const { result } = renderHook(() => useBreathingSession('short', 9));
    expect(result.current.currentPhase.phase).toBe('exhale');
  });

  it('elapsedRef matches initialElapsed before start', () => {
    const { result } = renderHook(() => useBreathingSession('short', 5));
    expect(result.current.elapsedRef.current).toBe(5);
  });
});

describe('useBreathingSession - alternate rhythm', () => {
  it('uses the gentle rhythm cycle duration and cycle count', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.gentle));
    expect(result.current.cycleDuration).toBe(13);
    expect(result.current.totalCycles).toBe(23);
    expect(result.current.sessionDuration).toBe(13 * 23);
    expect(result.current.rhythm.id).toBe('gentle');
  });

  it('uses the deep rhythm cycle duration and cycle count', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.full));
    expect(result.current.cycleDuration).toBe(28);
    expect(result.current.totalCycles).toBe(11);
    expect(result.current.rhythm.id).toBe('full');
  });

  it('respects gentle rhythm phase boundaries during a running session', () => {
    // Soft (internal id: gentle) is 3-2-4-4 = 13s cycle.
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.gentle));
    act(() => { result.current.start(); });

    advance(1000); // t=1s, inhale window 0-3
    expect(result.current.currentPhase.phase).toBe('inhale');

    advance(3000); // t=4s, hold window 3-5
    expect(result.current.currentPhase.phase).toBe('hold');

    advance(3000); // t=7s, exhale window 5-9
    expect(result.current.currentPhase.phase).toBe('exhale');

    advance(5000); // t=12s, rest window 9-13
    expect(result.current.currentPhase.phase).toBe('rest');

    advance(2000); // t=14s, wraps into cycle 2 inhale
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.cycleNumber).toBe(2);
  });

  it('locks the rhythm at first render even if the parent re-renders with a different rhythm', () => {
    const { result, rerender } = renderHook(
      ({ r }) => useBreathingSession('short', 0, r),
      { initialProps: { r: RHYTHMS.gentle } }
    );
    expect(result.current.rhythm.id).toBe('gentle');
    rerender({ r: RHYTHMS.full });
    expect(result.current.rhythm.id).toBe('gentle');
    expect(result.current.cycleDuration).toBe(13);
  });
});

describe('useBreathingSession - proportional anticipation cue cap', () => {
  // The hook's RAF tick throttles state updates by an updateKey that quantizes leadProgress
  // to quarters: floor(leadProgress * 4). A test that chains two advance() calls inside one
  // bucket sees stale state. Each test below uses a fresh renderHook + single advance, and
  // picks sample points that cross a quarter boundary so the updateKey actually changes.

  // Steady (internal id: standard) Inhale is 4s; cap doesn't engage (4 * 0.25 = 1s > 0.8s ceiling).
  // Lead window stays at the full 0.8s, activating at t=3.2s.
  it('Steady Inhale lead is inactive at t=2.5s (0.7s before the 0.8s window opens)', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(2500);
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.phaseLeadProgress).toBe(0);
  });

  it('Steady Inhale lead is active at t=3.5s (0.3s into the 0.8s window)', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(3500);
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.phaseLeadProgress).toBeGreaterThan(0);
  });

  // Soft Hold is 2s; cap engages at 25% = 0.5s. Hold runs t=3..5.
  // Under the old 0.8s constant, t=4.3s (0.7s before end) would have leadProgress > 0;
  // under the cap, the lead window only opens at t=4.5s.
  it('Soft Hold lead is inactive at t=4.3s (0.7s before end, outside the 0.5s cap)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.gentle));
    act(() => { result.current.start(); });
    advance(4300);
    expect(result.current.currentPhase.phase).toBe('hold');
    expect(result.current.phaseLeadProgress).toBe(0);
  });

  it('Soft Hold lead is active at t=4.8s (0.2s before end, inside the 0.5s cap)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.gentle));
    act(() => { result.current.start(); });
    advance(4800);
    expect(result.current.currentPhase.phase).toBe('hold');
    expect(result.current.phaseLeadProgress).toBeGreaterThan(0);
  });

  // Flow Relax is 2s; cap engages at 25% = 0.5s. Flow is 4-0-6-2 so Relax runs t=10..12.
  // Under the old constant, t=11.3s would have leadProgress > 0; under the cap, only t=11.5s+.
  it('Flow Relax lead is inactive at t=11.3s (0.7s before end, outside the 0.5s cap)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.flow));
    act(() => { result.current.start(); });
    advance(11300);
    expect(result.current.currentPhase.phase).toBe('rest');
    expect(result.current.phaseLeadProgress).toBe(0);
  });

  it('Flow Relax lead is active at t=11.8s (0.2s before end, inside the 0.5s cap)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.flow));
    act(() => { result.current.start(); });
    advance(11800);
    expect(result.current.currentPhase.phase).toBe('rest');
    expect(result.current.phaseLeadProgress).toBeGreaterThan(0);
  });

  // Regression guard for the imperceptibility-risk phase. Full Exhale is 10s — at 8% of phase,
  // the 0.8s lead is already the narrowest readable window. If anyone tightens the formula
  // (e.g., caps long phases too), the cue here would shrink further and become invisible.
  // Full is 6-6-10-6, so Exhale runs t=12..22. At t=21.5s (0.5s before end), with the 0.8s
  // lookahead intact, leadProgress should be (0.8 - 0.5) / 0.8 = 0.375.
  it('Full Exhale (10s phase) keeps the full 0.8s lead — imperceptibility regression guard', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.full));
    act(() => { result.current.start(); });
    advance(21500);
    expect(result.current.currentPhase.phase).toBe('exhale');
    expect(result.current.phaseLeadProgress).toBeCloseTo(0.375, 2);
  });

  it('Full Exhale lead is inactive at t=21.0s (1.0s before end, outside the 0.8s window)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.full));
    act(() => { result.current.start(); });
    advance(21000);
    expect(result.current.currentPhase.phase).toBe('exhale');
    expect(result.current.phaseLeadProgress).toBe(0);
  });

  // Flow's Hold has zero duration. During Inhale (t=0..4), the anticipation cue's nextPhase
  // must target Exhale (not Hold), so the user sees the right incoming color and hears the
  // right pre-cue tone.
  it('Flow Inhale anticipation targets Exhale, skipping the zero-duration Hold', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.flow));
    act(() => { result.current.start(); });
    advance(3500); // t=3.5s, inside Flow's 0.8s lead window before the Inhale→Exhale handoff
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.nextPhase.phase).toBe('exhale');
    expect(result.current.phaseLeadProgress).toBeGreaterThan(0);
  });

  // The cap is the same proportional formula as the design sketch. This is a sweep check that
  // for each rhythm/non-zero phase the lead is at most 25% of phase duration. Catches anyone
  // who tries to "tune" PHASE_LOOKAHEAD_SECONDS up without updating the cap.
  it('lead window never exceeds 25% of phase duration on any rhythm', () => {
    (['standard', 'gentle', 'full', 'flow'] as const).forEach((id) => {
      const rhythm = RHYTHMS[id];
      const { result } = renderHook(() => useBreathingSession('short', 0, rhythm));
      let accumulated = 0;
      rhythm.pattern.forEach((phase) => {
        if (phase.duration === 0) {
          accumulated += phase.duration;
          return;
        }
        // Sample 26% into the phase from the end — should still be outside the lead window.
        const sampleSecsBeforeEnd = phase.duration * 0.26;
        const targetMs = (accumulated + phase.duration - sampleSecsBeforeEnd) * 1000;
        // Reset to t=0 and advance to the sample point.
        act(() => { result.current.reset(); });
        act(() => { result.current.start(); });
        advance(targetMs);
        expect(result.current.currentPhase.phase).toBe(phase.phase);
        expect(result.current.phaseLeadProgress).toBe(0);
        accumulated += phase.duration;
      });
    });
  });
});
