import type { SessionRecord } from '@/hooks/useSessionStats';

export function sessionKey(session: SessionRecord): string {
  return `${session.date}|${session.duration}|${session.cycles}|${session.length}`;
}

export function missingLocalSessions(
  localSessions: SessionRecord[],
  cloudSessions: SessionRecord[]
): SessionRecord[] {
  const cloudCounts = new Map<string, number>();

  cloudSessions.forEach((session) => {
    const key = sessionKey(session);
    cloudCounts.set(key, (cloudCounts.get(key) ?? 0) + 1);
  });

  return localSessions.filter((session) => {
    const key = sessionKey(session);
    const count = cloudCounts.get(key) ?? 0;
    if (count > 0) {
      cloudCounts.set(key, count - 1);
      return false;
    }
    return true;
  });
}

export function sortSessionsByDate(sessions: SessionRecord[]): SessionRecord[] {
  return [...sessions].sort((a, b) => a.date.localeCompare(b.date));
}

export function mergeSyncedSessions(
  cloudSessions: SessionRecord[],
  syncedLocalSessions: SessionRecord[]
): SessionRecord[] {
  return sortSessionsByDate([...cloudSessions, ...syncedLocalSessions]);
}
