import {
  mergeSyncedSessions,
  missingLocalSessions,
  sessionKey,
  sortSessionsByDate,
} from '@/lib/sessionSync';
import type { SessionRecord } from '@/hooks/useSessionStats';

function session(
  date: string,
  duration = 300,
  cycles = 10,
  length: SessionRecord['length'] = 'quick'
): SessionRecord {
  return { date, duration, cycles, length };
}

describe('session sync helpers', () => {
  it('uses date, duration, cycles, and length as the duplicate key', () => {
    expect(sessionKey(session('2026-05-18', 300, 10, 'quick'))).toBe('2026-05-18|300|10|quick');
  });

  it('returns only local sessions missing from cloud history', () => {
    const shared = session('2026-05-18', 300);
    const localOnly = session('2026-05-19', 420, 17, 'short');

    expect(missingLocalSessions([shared, localOnly], [shared])).toEqual([localOnly]);
  });

  it('preserves duplicate local sessions beyond the number already in cloud', () => {
    const duplicate = session('2026-05-18', 300);

    expect(missingLocalSessions([duplicate, duplicate], [duplicate])).toEqual([duplicate]);
  });

  it('does not treat same-day sessions with different lengths as duplicates', () => {
    const quick = session('2026-05-18', 300, 10, 'quick');
    const short = session('2026-05-18', 420, 17, 'short');

    expect(missingLocalSessions([quick, short], [quick])).toEqual([short]);
  });

  it('sorts merged cloud and synced local sessions by date', () => {
    const merged = mergeSyncedSessions(
      [session('2026-05-20'), session('2026-05-18')],
      [session('2026-05-19')]
    );

    expect(merged.map((record) => record.date)).toEqual([
      '2026-05-18',
      '2026-05-19',
      '2026-05-20',
    ]);
  });

  it('sortSessionsByDate does not mutate the input array', () => {
    const original = [session('2026-05-20'), session('2026-05-18')];
    const sorted = sortSessionsByDate(original);

    expect(sorted.map((record) => record.date)).toEqual(['2026-05-18', '2026-05-20']);
    expect(original.map((record) => record.date)).toEqual(['2026-05-20', '2026-05-18']);
  });
});
