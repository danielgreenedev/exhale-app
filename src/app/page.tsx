'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BREATHING_PATTERN, SessionLength, SESSION_CYCLES } from '@/lib/breathing';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import {
  DEFAULT_SOUND_PALETTE,
  isSoundPaletteId,
  SOUND_PALETTES,
  SOUND_STORAGE_KEY,
  SoundPaletteId,
} from '@/lib/sound';
import { readStats, computeStats } from '@/hooks/useSessionStats';
import { SURFACE_GLOWS } from '@/lib/colors';
import { supabase } from '@/lib/supabase';
import { useUserId } from '@/lib/auth';

const SESSION_LENGTHS: SessionLength[] = ['quick', 'short', 'medium', 'long'];
function isSessionLength(v: unknown): v is SessionLength {
  return SESSION_LENGTHS.includes(v as SessionLength);
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

const SESSION_OPTIONS: { length: SessionLength; label: string; description: string }[] = [
  { length: 'quick',  label: '3 minutes',  description: `${SESSION_CYCLES.quick} breaths` },
  { length: 'short',  label: '5 minutes',  description: `${SESSION_CYCLES.short} breaths` },
  { length: 'medium', label: '7 minutes',  description: `${SESSION_CYCLES.medium} breaths` },
  { length: 'long',   label: '10 minutes', description: `${SESSION_CYCLES.long} breaths` },
];

interface ResumeData {
  length: SessionLength;
  elapsed: number;
}

const RESUME_KEY = 'exhale-resume';
const RESUME_WINDOW_MS = 60_000;

function HomeContent() {
  const searchParams = useSearchParams();
  const urlLength = searchParams.get('length');
  const initialLength: SessionLength = isSessionLength(urlLength) ? urlLength : 'short';

  const [selectedLength, setSelectedLength] = useState<SessionLength>(initialLength);
  const [homeStat, setHomeStat] = useState<{ sessions: number; streak: number } | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [orbScale, setOrbScaleState] = useState<number>(1);
  const [soundPalette, setSoundPaletteState] = useState<SoundPaletteId>(DEFAULT_SOUND_PALETTE);
  const [previewingSound, setPreviewingSound] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const [showRhythmPreview, setShowRhythmPreview] = useState(false);
  const previewResetRef = useRef<number | null>(null);
  const settingsSyncedRef = useRef(false);
  const { previewPalette, stopAmbient } = useAudioEngine(soundPalette);
  const userId = useUserId();

  const updateOrbScale = (scale: number) => {
    setOrbScaleState(scale);
    try { localStorage.setItem('exhale-orb-scale', String(scale)); } catch { /* unavailable */ }
    if (userId) {
      supabase.from('user_settings')
        .upsert({ user_id: userId, orb_scale: scale, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        .then(({ error }) => {
          if (error) console.error('[supabase] user_settings upsert failed:', error);
        });
    }
  };

  const updateSoundPalette = (palette: SoundPaletteId) => {
    if (previewResetRef.current !== null) {
      window.clearTimeout(previewResetRef.current);
      previewResetRef.current = null;
    }
    if (previewingSound) {
      stopAmbient(0.4);
      setPreviewingSound(false);
    }
    setSoundPaletteState(palette);
    try { localStorage.setItem(SOUND_STORAGE_KEY, palette); } catch { /* unavailable */ }
    if (userId) {
      supabase.from('user_settings')
        .upsert({ user_id: userId, sound_palette: palette, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        .then(({ error }) => {
          if (error) console.error('[supabase] user_settings upsert failed:', error);
        });
    }
  };

  const updateSessionLength = (length: SessionLength) => {
    setSelectedLength(length);
    try { localStorage.setItem('exhale-session-length', length); } catch { /* unavailable */ }
    if (userId) {
      supabase.from('user_settings')
        .upsert({ user_id: userId, session_length: length, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        .then(({ error }) => {
          if (error) console.error('[supabase] user_settings upsert failed:', error);
        });
    }
  };

  useEffect(() => {
    try {
      const v = parseFloat(localStorage.getItem('exhale-orb-scale') ?? '1') || 1;
      setOrbScaleState(v);
      const storedSound = localStorage.getItem(SOUND_STORAGE_KEY);
      if (isSoundPaletteId(storedSound)) setSoundPaletteState(storedSound);
      const storedLength = localStorage.getItem('exhale-session-length');
      if (isSessionLength(storedLength) && !isSessionLength(urlLength)) {
        setSelectedLength(storedLength);
      }
      if (!localStorage.getItem('exhale-visited')) setFirstVisit(true);
      const { sessions } = readStats();
      if (sessions.length > 0) {
        const { totalSessions, streak } = computeStats(sessions);
        setHomeStat({ sessions: totalSessions, streak });
      }
    } catch { /* unavailable */ }
  }, [urlLength]);

  // Sync settings with Supabase: restore cloud settings on first load, push local on new users
  useEffect(() => {
    if (!userId || settingsSyncedRef.current) return;
    settingsSyncedRef.current = true;

    supabase.from('user_settings').select('orb_scale, sound_palette, session_length').eq('user_id', userId).maybeSingle()
      .then(({ data }) => {
        if (data) {
          const scale = data.orb_scale as number;
          const sound = data.sound_palette as string;
          const length = data.session_length as string | null;
          try { localStorage.setItem('exhale-orb-scale', String(scale)); } catch { /* unavailable */ }
          try { localStorage.setItem(SOUND_STORAGE_KEY, sound); } catch { /* unavailable */ }
          setOrbScaleState(scale);
          if (isSoundPaletteId(sound)) setSoundPaletteState(sound);
          if (isSessionLength(length)) {
            try { localStorage.setItem('exhale-session-length', length); } catch { /* unavailable */ }
            if (!isSessionLength(urlLength)) setSelectedLength(length);
          }
        } else {
          const localScale = parseFloat(localStorage.getItem('exhale-orb-scale') ?? '1') || 1;
          const localSound = localStorage.getItem(SOUND_STORAGE_KEY) ?? DEFAULT_SOUND_PALETTE;
          const localLength = localStorage.getItem('exhale-session-length') ?? selectedLength;
          supabase.from('user_settings')
            .upsert({ user_id: userId, orb_scale: localScale, sound_palette: localSound, session_length: localLength }, { onConflict: 'user_id' })
            .then(({ error }) => {
              if (error) console.error('[supabase] user_settings upsert failed:', error);
            });
        }
      });
  }, [userId]);

  useEffect(() => {
    return () => {
      if (previewResetRef.current !== null) window.clearTimeout(previewResetRef.current);
      stopAmbient(0.2);
    };
  }, [stopAmbient]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESUME_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as ResumeData & { timestamp: number };
      if (Date.now() - data.timestamp < RESUME_WINDOW_MS) {
        setResumeData({ length: data.length, elapsed: data.elapsed });
      } else {
        sessionStorage.removeItem(RESUME_KEY);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const dismissFirstVisit = () => {
    setFirstVisit(false);
    try { localStorage.setItem('exhale-visited', '1'); } catch { /* unavailable */ }
  };

  const handleSoundPreview = async () => {
    if (previewResetRef.current !== null) {
      window.clearTimeout(previewResetRef.current);
      previewResetRef.current = null;
    }

    if (previewingSound) {
      stopAmbient(0.5);
      setPreviewingSound(false);
      return;
    }

    try {
      const started = await previewPalette(soundPalette);
      setPreviewingSound(started);
      if (started) {
        previewResetRef.current = window.setTimeout(() => {
          setPreviewingSound(false);
          previewResetRef.current = null;
        }, 3700);
      }
    } catch {
      setPreviewingSound(false);
    }
  };

  const circleSizePx = 80 * orbScale;
  const selectedSound = SOUND_PALETTES.find((palette) => palette.id === soundPalette) ?? SOUND_PALETTES[0];

  return (
    <main className="min-h-screen bg-forest-night flex flex-col items-center px-6 text-still-white">
      {/* Warm forest glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: SURFACE_GLOWS.home }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm w-full py-12">

        {/* Logo orb */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 flex items-center justify-center" aria-hidden="true">
            <div
              className="relative orb-breathe transition-[width,height] duration-500 ease-out"
              style={{ width: circleSizePx, height: circleSizePx }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-300/60 to-emerald-600/40 shadow-[0_0_48px_rgba(110,231,183,0.22)]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              <div className="absolute inset-[-14px] rounded-full border border-emerald-400/20 shadow-[0_0_18px_rgba(110,231,183,0.12)]" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-[0.25em] sm:tracking-[0.38em] uppercase text-still-white/90">
              Exhale
            </h1>
            <p className="text-still-white/62 text-sm tracking-[0.12em] font-light text-center">
              Guided breathing for a calmer mind
            </p>
            {homeStat && (
              <Link
                href="/stats"
                className="text-still-white/52 text-xs tracking-[0.12em] font-light hover:text-still-white/72 transition-colors duration-300 mt-0.5"
                aria-label="View practice history"
              >
                {homeStat.streak >= 2 ? `${homeStat.streak}-day streak` : `${homeStat.sessions} session${homeStat.sessions !== 1 ? 's' : ''}`}
              </Link>
            )}
          </div>
        </div>

        {/* Session length picker — label removed, implied by context */}
        <form
          id="session-form"
          className="flex flex-col gap-2 w-full"
          action="/game"
          method="get"
          onSubmit={dismissFirstVisit}
        >
          <fieldset className="flex flex-col gap-2 w-full" aria-label="Session length">
            {SESSION_OPTIONS.map((opt) => (
              <label
                key={opt.length}
                className={`
                  w-full py-3 px-6 rounded-2xl border transition-all duration-300 text-left flex justify-between items-center cursor-pointer
                  border-still-white/18 text-still-white/60 hover:border-still-white/30 hover:text-still-white/78
                  has-[:checked]:border-emerald-pulse/45 has-[:checked]:bg-emerald-pulse/10 has-[:checked]:text-still-white/90
                  has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-emerald-200/80
                `}
              >
                <input
                  type="radio"
                  name="length"
                  value={opt.length}
                  checked={selectedLength === opt.length}
                  onChange={() => updateSessionLength(opt.length)}
                  aria-label={`${opt.label}, ${opt.description}`}
                  className="sr-only"
                />
                <span className="text-lg font-extralight tracking-wide">{opt.label}</span>
                <span className="text-xs tracking-widest text-still-white/62">{opt.description}</span>
              </label>
            ))}
          </fieldset>

        {firstVisit && <input type="hidden" name="first" value="1" />}

        {/* Begin button */}
        <button
          type="submit"
          aria-label="Begin breathing session"
          className="w-full py-5 rounded-2xl bg-emerald-700/15 border border-emerald-pulse/35 text-emerald-100/95 text-sm tracking-[0.28em] uppercase font-light hover:bg-emerald-700/26 hover:border-emerald-pulse/55 hover:text-emerald-50 active:scale-[0.98] transition-all duration-300"
        >
          Begin
        </button>
        </form>

        <button
          type="button"
          onClick={() => setShowRhythmPreview((show) => !show)}
          aria-expanded={showRhythmPreview}
          aria-controls="rhythm-preview"
          className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/60 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/30 hover:text-still-white/78 hover:bg-still-white/5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center text-center"
        >
          Preview rhythm
        </button>

        {showRhythmPreview && (
          <section
            id="rhythm-preview"
            aria-label="Breathing rhythm preview"
            className="w-full border-y border-still-white/10 py-1"
          >
            {BREATHING_PATTERN.map((phase) => (
              <div
                key={phase.phase}
                className="flex items-center gap-4 py-3 border-b border-still-white/8 last:border-b-0"
              >
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: phase.color, boxShadow: `0 0 16px ${phase.glowColor}` }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-still-white/82 text-xs tracking-[0.22em] uppercase font-light">
                    {phase.label}
                  </p>
                  <p className="text-still-white/58 text-xs tracking-[0.06em] font-light leading-relaxed normal-case">
                    {phase.instruction}
                  </p>
                </div>
                <span className="text-still-white/62 text-xs tabular-nums tracking-[0.12em] font-light">
                  {phase.duration}s
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Resume button — only shown within 60s of exiting a session */}
        {resumeData && (
          <Link
            href={`/game?length=${resumeData.length}&resume=${resumeData.elapsed.toFixed(1)}`}
            aria-label={`Resume ${resumeData.length} session, ${formatDuration(Math.floor(resumeData.elapsed))} in`}
            className="w-full py-4 px-6 rounded-2xl border border-still-white/18 text-still-white/60 hover:border-still-white/30 hover:text-still-white/78 transition-all duration-300 -mt-2 flex flex-col items-center gap-0.5"
          >
            <span className="text-sm tracking-[0.18em] uppercase font-light">
              ↩ Resume {resumeData.length}
            </span>
            <span className="text-xs tracking-[0.1em] font-light text-still-white/58 normal-case">
              {formatDuration(Math.floor(resumeData.elapsed))} in · from your last session
            </span>
          </Link>
        )}

        {/* Secondary controls — circle size and practice history together below the fold */}
        <div className="flex flex-col gap-3 w-full pt-3 border-t border-still-white/10">
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-still-white/55 text-xs tracking-[0.14em] uppercase font-light">Circle size</span>
            <div className="flex gap-4 items-end" role="radiogroup" aria-label="Circle size">
              {([0.75, 1.0, 1.25] as const).map((scale, i) => {
                const sizes = ['w-3 h-3', 'w-4 h-4', 'w-5 h-5'] as const;
                const labels = ['S', 'M', 'L'] as const;
                const active = Math.abs(orbScale - scale) < 0.01;
                return (
                  <label
                    key={scale}
                    className="min-h-11 min-w-11 flex flex-col items-center justify-center gap-1.5 rounded-lg text-still-white opacity-60 transition-opacity duration-300 hover:bg-still-white/5 hover:opacity-80 cursor-pointer has-[:checked]:opacity-95 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-emerald-200/80"
                  >
                    <input
                      type="radio"
                      name="orb"
                      value={scale}
                      form="session-form"
                      checked={active}
                      aria-label={`Circle size ${labels[i]}`}
                      onChange={() => updateOrbScale(scale)}
                      className="sr-only"
                    />
                    <div className={`${sizes[i]} rounded-full bg-still-white`} />
                    <span className="text-[10px] tracking-widest font-light">{labels[i]}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full px-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-still-white/55 text-xs tracking-[0.14em] uppercase font-light">Sound</span>
              <button
                type="button"
                onClick={handleSoundPreview}
                disabled={soundPalette === 'off'}
                aria-label={`Preview ${selectedSound.ariaLabel}`}
                className="min-h-11 px-3 rounded-lg border border-still-white/18 text-still-white/58 text-[10px] tracking-[0.16em] uppercase font-light hover:border-still-white/30 hover:text-still-white/78 hover:bg-still-white/5 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-still-white/18 disabled:hover:text-still-white/58 transition-all duration-300"
              >
                {previewingSound ? 'Stop' : 'Listen'}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Sound palette">
              {SOUND_PALETTES.map((palette) => (
                <label
                  key={palette.id}
                  title={palette.ariaLabel}
                  className="min-h-11 flex items-center justify-center rounded-lg border border-still-white/12 px-1 text-still-white/50 text-[10px] tracking-[0.12em] uppercase font-light cursor-pointer hover:border-still-white/28 hover:text-still-white/72 has-[:checked]:border-emerald-pulse/42 has-[:checked]:bg-emerald-pulse/10 has-[:checked]:text-still-white/88 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-emerald-200/80 transition-all duration-300"
                >
                  <input
                    type="radio"
                    name="sound"
                    value={palette.id}
                    form="session-form"
                    checked={soundPalette === palette.id}
                    aria-label={palette.ariaLabel}
                    onChange={() => updateSoundPalette(palette.id)}
                    className="sr-only"
                  />
                  {palette.label}
                </label>
              ))}
            </div>
          </div>

          <Link
            href="/stats"
            className="w-full min-h-11 py-3 rounded-2xl border border-still-white/20 text-still-white/60 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/34 hover:text-still-white/78 hover:bg-still-white/5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center text-center"
            aria-label="View practice history"
          >
            Practice history
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
