import { renderHook, act } from '@testing-library/react';
import { useBreathingSession } from '@/hooks/useBreathingSession';

// --- Mock setup ---
// jsdom's RAF schedules callbacks but never fires them synchronously.
// We replace it (and performance.now) so tests can drive time explicitly.

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

/**
 * Advance fake time by `ms` milliseconds.
 * Fires all pending RAF callbacks once, then wraps in act() so React
 * flushes the resulting state updates.
 */
function advance(ms: number) {
  mockTime += ms;
  act(() => {
    const pending = rafQueue.splice(0);
    pending.forEach((cb) => cb(mockTime));
  });
}

// ---------------------------------------------------------------------------

describe('useBreathingSession — initial state', () => {
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

describe('useBreathingSession — start / pause / resume', () => {
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
    advance(2000); // 2 s into inhale

    const elapsedBeforePause = result.current.elapsedTotal;
    act(() => { result.current.pause(); });

    // Time advances on the clock but no RAF fires — elapsed should stay frozen
    mockTime += 5000;
    expect(result.current.elapsedTotal).toBeCloseTo(elapsedBeforePause, 1);

    act(() => { result.current.start(); }); // resume
    advance(1000);
    expect(result.current.elapsedTotal).toBeGreaterThan(elapsedBeforePause);
  });
});

describe('useBreathingSession — reset', () => {
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

describe('useBreathingSession — phase progression', () => {
  it('is in inhale phase during t=0–4s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(2000);
    expect(result.current.currentPhase.phase).toBe('inhale');
  });

  it('is in hold phase during t=4–8s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(5000);
    expect(result.current.currentPhase.phase).toBe('hold');
  });

  it('is in exhale phase during t=8–14s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(10000);
    expect(result.current.currentPhase.phase).toBe('exhale');
  });

  it('is in rest phase during t=14–18s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(15000);
    expect(result.current.currentPhase.phase).toBe('rest');
  });

  it('wraps back to inhale at the start of the second cycle (t≈18s)', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(18500);
    expect(result.current.currentPhase.phase).toBe('inhale');
    expect(result.current.cycleNumber).toBe(2);
  });

  it('timeRemaining counts down within a phase', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(1000); // 1 s into inhale (4 s phase)
    expect(result.current.timeRemaining).toBeLessThanOrEqual(4);
    expect(result.current.timeRemaining).toBeGreaterThan(0);
  });
});

describe('useBreathingSession — session completion', () => {
  it('completes after all cycles elapse', () => {
    const { result } = renderHook(() => useBreathingSession('quick')); // 10 × 18s = 180s
    act(() => { result.current.start(); });
    // Fire enough ticks to exceed sessionDuration
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

describe('useBreathingSession — resume from initialElapsed', () => {
  it('starts mid-session when initialElapsed is provided', () => {
    // 9 s in = mid-exhale (exhale starts at 8 s)
    const { result } = renderHook(() => useBreathingSession('short', 9));
    expect(result.current.currentPhase.phase).toBe('exhale');
  });

  it('elapsedRef matches initialElapsed before start', () => {
    const { result } = renderHook(() => useBreathingSession('short', 5));
    expect(result.current.elapsedRef.current).toBe(5);
  });
});
