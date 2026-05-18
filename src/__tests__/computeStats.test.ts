import { computeStats, SessionRecord } from '@/hooks/useSessionStats';

// Pin "today" so streak tests are deterministic
const TODAY = '2026-05-18';
const YESTERDAY = '2026-05-17';
const TWO_DAYS_AGO = '2026-05-16';
const THREE_DAYS_AGO = '2026-05-15';
const EIGHT_DAYS_AGO = '2026-05-10';

function session(date: string, duration = 300): SessionRecord {
  return { date, duration, cycles: 10, length: 'short' };
}

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(`${TODAY}T12:00:00Z`));
});

afterAll(() => {
  jest.useRealTimers();
});

describe('computeStats — empty', () => {
  it('returns zero values for an empty session list', () => {
    const stats = computeStats([]);
    expect(stats.totalSessions).toBe(0);
    expect(stats.totalMinutes).toBe(0);
    expect(stats.thisWeek).toBe(0);
    expect(stats.streak).toBe(0);
    expect(stats.totalDays).toBe(0);
  });
});

describe('computeStats — totals', () => {
  it('counts total sessions correctly', () => {
    const { totalSessions } = computeStats([session(TODAY), session(YESTERDAY)]);
    expect(totalSessions).toBe(2);
  });

  it('sums durations and rounds to minutes', () => {
    const sessions = [session(TODAY, 90), session(TODAY, 90)]; // 180s = 3m
    expect(computeStats(sessions).totalMinutes).toBe(3);
  });

  it('rounds minutes correctly (149s → 2m, 150s → 3m)', () => {
    expect(computeStats([session(TODAY, 149)]).totalMinutes).toBe(2);
    expect(computeStats([session(TODAY, 150)]).totalMinutes).toBe(3);
  });

  it('counts unique practice days correctly', () => {
    const sessions = [session(TODAY), session(TODAY), session(YESTERDAY)];
    expect(computeStats(sessions).totalDays).toBe(2);
  });
});

describe('computeStats — this week', () => {
  it('counts sessions within the last 7 days', () => {
    const sessions = [session(TODAY), session(YESTERDAY), session(EIGHT_DAYS_AGO)];
    expect(computeStats(sessions).thisWeek).toBe(2);
  });

  it('returns 0 when all sessions are older than 7 days', () => {
    expect(computeStats([session(EIGHT_DAYS_AGO)]).thisWeek).toBe(0);
  });
});

describe('computeStats — streak', () => {
  it('counts a streak starting today', () => {
    const sessions = [session(TODAY), session(YESTERDAY), session(TWO_DAYS_AGO)];
    expect(computeStats(sessions).streak).toBe(3);
  });

  it('counts a streak starting yesterday (session not yet done today)', () => {
    const sessions = [session(YESTERDAY), session(TWO_DAYS_AGO)];
    expect(computeStats(sessions).streak).toBe(2);
  });

  it('returns 0 when the most recent session is older than yesterday', () => {
    expect(computeStats([session(TWO_DAYS_AGO)]).streak).toBe(0);
  });

  it('stops the streak at the first gap', () => {
    // today + yesterday + (gap) + three days ago — streak is 2, not 3
    const sessions = [session(TODAY), session(YESTERDAY), session(THREE_DAYS_AGO)];
    expect(computeStats(sessions).streak).toBe(2);
  });

  it('counts multiple sessions on the same day as one streak day', () => {
    const sessions = [session(TODAY), session(TODAY), session(YESTERDAY)];
    expect(computeStats(sessions).streak).toBe(2);
  });

  it('returns a streak of 1 for a single session today', () => {
    expect(computeStats([session(TODAY)]).streak).toBe(1);
  });

  it('returns a streak of 1 for a single session yesterday', () => {
    expect(computeStats([session(YESTERDAY)]).streak).toBe(1);
  });
});
