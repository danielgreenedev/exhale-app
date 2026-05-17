'use client';

import { useCallback } from 'react';
import { SessionLength } from '@/lib/breathing';

export interface SessionRecord {
  date: string;
  duration: number;
  cycles: number;
  length: SessionLength;
}

interface StoredStats {
  sessions: SessionRecord[];
}

const STORAGE_KEY = 'exhale-stats';

export function readStats(): StoredStats {
  if (typeof window === 'undefined') return { sessions: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [] };
    return JSON.parse(raw) as StoredStats;
  } catch {
    return { sessions: [] };
  }
}

function writeStats(stats: StoredStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // localStorage unavailable or full
  }
}

export function computeStats(sessions: SessionRecord[]) {
  const totalSessions = sessions.length;
  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const thisWeek = sessions.filter((s) => s.date >= oneWeekAgo).length;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const uniqueDays = [...new Set(sessions.map((s) => s.date))].sort().reverse();
  let streak = 0;
  let checkDate: string | null = uniqueDays[0] === today || uniqueDays[0] === yesterday ? uniqueDays[0] : null;
  if (checkDate) {
    for (const day of uniqueDays) {
      if (day === checkDate) {
        streak++;
        const prev: Date = new Date(new Date(checkDate as string).getTime() - 24 * 60 * 60 * 1000);
        checkDate = prev.toISOString().split('T')[0];
      } else {
        break;
      }
    }
  }

  return { totalSessions, totalMinutes, thisWeek, streak };
}

export function useSessionStats() {
  const saveSession = useCallback((record: SessionRecord) => {
    const stats = readStats();
    stats.sessions.push(record);
    writeStats(stats);
  }, []);

  return { saveSession };
}
