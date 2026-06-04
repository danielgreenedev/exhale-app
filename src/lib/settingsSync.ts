'use client';

import {
  DEFAULT_ORB_SCALE,
  DEFAULT_RHYTHM,
  DEFAULT_SESSION_LENGTH,
  RHYTHM_STORAGE_KEY,
  RhythmId,
  SessionLength,
  isRhythmId,
  normalizeRhythmId,
} from '@/lib/breathing';
import {
  DEFAULT_SOUND_PALETTE,
  isSoundPaletteId,
  SOUND_STORAGE_KEY,
  SoundPaletteId,
} from '@/lib/sound';
import { supabase } from '@/lib/supabase';

export const ORB_SCALE_STORAGE_KEY = 'exhale-orb-scale';
export const SESSION_LENGTH_STORAGE_KEY = 'exhale-session-length';

const SESSION_LENGTHS: SessionLength[] = ['quick', 'short', 'medium', 'long'];

export interface PracticeSettings {
  orbScale: number;
  soundPalette: SoundPaletteId;
  sessionLength: SessionLength;
  rhythm: RhythmId;
}

interface CloudSettingsRow {
  orb_scale: number | null;
  sound_palette: string | null;
  session_length: string | null;
  rhythm: string | null;
}

export function isSessionLengthValue(value: unknown): value is SessionLength {
  return SESSION_LENGTHS.includes(value as SessionLength);
}

export function readLocalPracticeSettings(
  fallbackLength: SessionLength = DEFAULT_SESSION_LENGTH,
  fallbackRhythm: RhythmId = DEFAULT_RHYTHM
): PracticeSettings {
  if (typeof window === 'undefined') {
    return {
      orbScale: DEFAULT_ORB_SCALE,
      soundPalette: DEFAULT_SOUND_PALETTE,
      sessionLength: fallbackLength,
      rhythm: fallbackRhythm,
    };
  }

  const orbScale =
    parseFloat(localStorage.getItem(ORB_SCALE_STORAGE_KEY) ?? String(DEFAULT_ORB_SCALE)) ||
    DEFAULT_ORB_SCALE;
  const storedSound = localStorage.getItem(SOUND_STORAGE_KEY);
  const storedLength = localStorage.getItem(SESSION_LENGTH_STORAGE_KEY);
  const storedRhythm = localStorage.getItem(RHYTHM_STORAGE_KEY);

  return {
    orbScale,
    soundPalette: isSoundPaletteId(storedSound) ? storedSound : DEFAULT_SOUND_PALETTE,
    sessionLength: isSessionLengthValue(storedLength) ? storedLength : fallbackLength,
    rhythm: normalizeRhythmId(storedRhythm, fallbackRhythm),
  };
}

export function writeLocalPracticeSettings(settings: Partial<PracticeSettings>) {
  if (typeof window === 'undefined') return;

  if (typeof settings.orbScale === 'number') {
    localStorage.setItem(ORB_SCALE_STORAGE_KEY, String(settings.orbScale));
  }
  if (settings.soundPalette && isSoundPaletteId(settings.soundPalette)) {
    localStorage.setItem(SOUND_STORAGE_KEY, settings.soundPalette);
  }
  if (settings.sessionLength && isSessionLengthValue(settings.sessionLength)) {
    localStorage.setItem(SESSION_LENGTH_STORAGE_KEY, settings.sessionLength);
  }
  if (settings.rhythm && isRhythmId(settings.rhythm)) {
    localStorage.setItem(RHYTHM_STORAGE_KEY, settings.rhythm);
  }
}

function normalizeCloudSettings(row: CloudSettingsRow): PracticeSettings {
  return {
    orbScale: typeof row.orb_scale === 'number' ? row.orb_scale : DEFAULT_ORB_SCALE,
    soundPalette: isSoundPaletteId(row.sound_palette) ? row.sound_palette : DEFAULT_SOUND_PALETTE,
    sessionLength: isSessionLengthValue(row.session_length) ? row.session_length : DEFAULT_SESSION_LENGTH,
    rhythm: normalizeRhythmId(row.rhythm, DEFAULT_RHYTHM),
  };
}

export async function saveUserSettings(userId: string, settings: Partial<PracticeSettings>) {
  const payload: {
    user_id: string;
    orb_scale?: number;
    sound_palette?: SoundPaletteId;
    session_length?: SessionLength;
    rhythm?: RhythmId;
    updated_at: string;
  } = {
    user_id: userId,
    updated_at: new Date().toISOString(),
  };

  if (typeof settings.orbScale === 'number') payload.orb_scale = settings.orbScale;
  if (settings.soundPalette) payload.sound_palette = settings.soundPalette;
  if (settings.sessionLength) payload.session_length = settings.sessionLength;
  if (settings.rhythm) payload.rhythm = settings.rhythm;

  return supabase.from('user_settings').upsert(payload, { onConflict: 'user_id' });
}

export async function syncUserSettings(
  userId: string,
  fallbackLength: SessionLength = DEFAULT_SESSION_LENGTH,
  fallbackRhythm: RhythmId = DEFAULT_RHYTHM
) {
  const localSettings = readLocalPracticeSettings(fallbackLength, fallbackRhythm);
  const { data, error } = await supabase
    .from('user_settings')
    .select('orb_scale, sound_palette, session_length, rhythm')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return {
      settings: localSettings,
      error: 'Cloud settings could not load. This device will keep its current setup.',
    };
  }

  if (data) {
    const cloudSettings = normalizeCloudSettings(data as CloudSettingsRow);
    writeLocalPracticeSettings(cloudSettings);
    return { settings: cloudSettings };
  }

  const { error: upsertError } = await saveUserSettings(userId, localSettings);

  return {
    settings: localSettings,
    error: upsertError ? 'This device setup could not sync yet.' : undefined,
  };
}
