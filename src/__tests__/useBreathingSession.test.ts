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
    expect(renderHook(() => useBreathingSession('quick')).result.current.totalCycles).toBe(15);
    expect(renderHook(() => useBreathingSession('short')).result.current.totalCycles).toBe(25);
    expect(renderHook(() => useBreathingSession('medium')).result.current.totalCycles).toBe(35);
    expect(renderHook(() => useBreathingSession('long')).result.current.totalCycles).toBe(50);
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

  it('is in hold phase during t=4-6s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(5000);
    expect(result.current.currentPhase.phase).toBe('hold');
  });

  it('is in exhale phase during t=6-12s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(10000);
    expect(result.current.currentPhase.phase).toBe('exhale');
  });

  it('stays in exhale at the end of the cycle because there is no post-exhale phase', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(11900);
    expect(result.current.currentPhase.phase).toBe('exhale');
  });

  it('wraps back to inhale at the start of the second cycle around t=12s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(12500);
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
    const { result } = renderHook(() => useBreathingSession('quick')); // 15 x 12s = 180s
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
    expect(result.current.cycleDuration).toBe(9);
    expect(result.current.totalCycles).toBe(33);
    expect(result.current.sessionDuration).toBe(9 * 33);
    expect(result.current.rhythm.id).toBe('gentle');
  });

  it('uses the box rhythm cycle duration and cycle count', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.box));
    expect(result.current.cycleDuration).toBe(19);
    expect(result.current.totalCycles).toBe(16);
    expect(result.current.rhythm.id).toBe('box');
  });

  it('respects gentle rhythm phase boundaries during a running session', () => {
    // Soft (internal id: gentle) is a 3-1-5 cycle with no post-exhale phase.
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.gentle));
    act(() => { result.current.start(); });

    advance(1000); // t=1s, inhale window 0-3
    expect(result.current.currentPhase.phase).toBe('inhale');

    advance(2500); // t=3.5s, hold window 3-4
    expect(result.current.currentPhase.phase).toBe('hold');

    advance(1000); // t=4.5s, exhale window 4-9
    expect(result.current.currentPhase.phase).toBe('exhale');

    advance(5000); // t=9.5s, wraps into cycle 2 inhale
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.cycleNumber).toBe(2);
  });

  it('locks the rhythm at first render even if the parent re-renders with a different rhythm', () => {
    const { result, rerender } = renderHook(
      ({ r }) => useBreathingSession('short', 0, r),
      { initialProps: { r: RHYTHMS.gentle } }
    );
    expect(result.current.rhythm.id).toBe('gentle');
    rerender({ r: RHYTHMS.box });
    expect(result.current.rhythm.id).toBe('gentle');
    expect(result.current.cycleDuration).toBe(9);
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

  // Soft Hold is 1s; cap engages at 25% = 0.25s. Hold runs t=3..4.
  // Under the old 0.8s constant, t=3.6s (0.4s before end) would have leadProgress > 0;
  // under the cap, the lead window only opens at t=3.75s.
  it('Soft Hold lead is inactive at t=3.6s (0.4s before end, outside the 0.25s cap)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.gentle));
    act(() => { result.current.start(); });
    advance(3600);
    expect(result.current.currentPhase.phase).toBe('hold');
    expect(result.current.phaseLeadProgress).toBe(0);
  });

  it('Soft Hold lead is active at t=3.85s (0.15s before end, inside the 0.25s cap)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.gentle));
    act(() => { result.current.start(); });
    advance(3850);
    expect(result.current.currentPhase.phase).toBe('hold');
    expect(result.current.phaseLeadProgress).toBeGreaterThan(0);
  });

  it('Flow Exhale lead is inactive at t=9.0s (1.0s before end, outside the 0.8s window)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.flow));
    act(() => { result.current.start(); });
    advance(9000);
    expect(result.current.currentPhase.phase).toBe('exhale');
    expect(result.current.phaseLeadProgress).toBe(0);
  });

  it('Flow Exhale lead targets Inhale in the two-phase loop', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.flow));
    act(() => { result.current.start(); });
    advance(9500);
    expect(result.current.currentPhase.phase).toBe('exhale');
    expect(result.current.nextPhase.phase).toBe('inhale');
    expect(result.current.phaseLeadProgress).toBeGreaterThan(0);
  });

  // 4-7-8 Exhale is 8s, so the 0.8s lead remains the full readable window.
  // The `box` storage id's Exhale runs t=11..19. At t=18.5s (0.5s before end),
  // leadProgress should be (0.8 - 0.5) / 0.8 = 0.375.
  it('4-7-8 Exhale keeps the full 0.8s lead', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.box));
    act(() => { result.current.start(); });
    advance(18500);
    expect(result.current.currentPhase.phase).toBe('exhale');
    expect(result.current.phaseLeadProgress).toBeCloseTo(0.375, 2);
  });

  it('4-7-8 Exhale lead is inactive at t=18.0s (1.0s before end, outside the 0.8s window)', () => {
    const { result } = renderHook(() => useBreathingSession('short', 0, RHYTHMS.box));
    act(() => { result.current.start(); });
    advance(18000);
    expect(result.current.currentPhase.phase).toBe('exhale');
    expect(result.current.phaseLeadProgress).toBe(0);
  });

  // Flow has no Hold phase. During Inhale (t=0..4), the anticipation cue's nextPhase
  // targets Exhale directly, so the user sees the right incoming color and hears the
  // right pre-cue tone.
  it('Flow Inhale anticipation targets Exhale directly', () => {
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
    (['standard', 'gentle', 'box', 'flow'] as const).forEach((id) => {
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
