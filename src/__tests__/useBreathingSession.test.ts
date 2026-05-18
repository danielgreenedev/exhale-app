import { renderHook, act } from '@testing-library/react';
import { useBreathingSession } from '@/hooks/useBreathingSession';

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
    expect(renderHook(() => useBreathingSession('quick')).result.current.totalCycles).toBe(8);
    expect(renderHook(() => useBreathingSession('short')).result.current.totalCycles).toBe(14);
    expect(renderHook(() => useBreathingSession('medium')).result.current.totalCycles).toBe(19);
    expect(renderHook(() => useBreathingSession('long')).result.current.totalCycles).toBe(27);
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

  it('is in rest phase during t=14-22s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(18000);
    expect(result.current.currentPhase.phase).toBe('rest');
  });

  it('wraps back to inhale at the start of the second cycle around t=22s', () => {
    const { result } = renderHook(() => useBreathingSession('short'));
    act(() => { result.current.start(); });
    advance(22500);
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
});

describe('useBreathingSession - session completion', () => {
  it('completes after all cycles elapse', () => {
    const { result } = renderHook(() => useBreathingSession('quick')); // 8 x 22s = 176s
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
