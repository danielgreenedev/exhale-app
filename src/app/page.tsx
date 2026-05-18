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
import { logAppEvent } from '@/lib/appEvents';

const SESSION_LENGTHS: SessionLength[] = ['quick', 'short', 'medium', 'long'];
function isSessionLength(v: unknown): v is SessionLength {
  return SESSION_LENGTHS.includes(v as SessionLength);
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

const SESSION_OPTIONS: { length: SessionLength; label: string; ariaLabel: string; description: string }[] = [
  { length: 'quick',  label: '3 min',  ariaLabel: '3 minutes',  description: `${SESSION_CYCLES.quick} breaths` },
  { length: 'short',  label: '5 min',  ariaLabel: '5 minutes',  description: `${SESSION_CYCLES.short} breaths` },
  { length: 'medium', label: '7 min',  ariaLabel: '7 minutes',  description: `${SESSION_CYCLES.medium} breaths` },
  { length: 'long',   label: '10 min', ariaLabel: '10 minutes', description: `${SESSION_CYCLES.long} breaths` },
];

const SOUND_TEXTURE_PALETTES = SOUND_PALETTES.filter((palette) => palette.id !== 'off');
const SOUND_OFF_PALETTE = SOUND_PALETTES.find((palette) => palette.id === 'off');
const SELECTED_SETTING_CLASS = 'border-emerald-pulse/60 bg-emerald-pulse/10 text-emerald-100/90 hover:border-emerald-pulse/75 hover:bg-emerald-pulse/15 hover:text-emerald-50';
const SETTINGS_COLLAPSE_SESSION_COUNT = 3;

interface ResumeData {
  length: SessionLength;
  elapsed: number;
}

const RESUME_KEY = 'exhale-resume';
const RESUME_WINDOW_MS = 60_000;

function MutedSoundIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-4 w-4"
    >
      <path
        d="M4 9v6h4l5 4V5L8 9H4z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m17 10 4 4m0-4-4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DisclosureCaret({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-2 w-2 border-b border-r border-current transition-transform duration-300 ${open ? '-translate-y-0.5 rotate-[-135deg]' : '-translate-y-1 rotate-45'}`}
    />
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const urlLength = searchParams.get('length');
  const initialLength: SessionLength = isSessionLength(urlLength) ? urlLength : 'short';

  const [selectedLength, setSelectedLength] = useState<SessionLength>(initialLength);
  const [homeStat, setHomeStat] = useState<{ sessions: number } | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [orbScale, setOrbScaleState] = useState<number>(1);
  const [soundPalette, setSoundPaletteState] = useState<SoundPaletteId>(DEFAULT_SOUND_PALETTE);
  const [firstVisit, setFirstVisit] = useState(false);
  const [showRhythmPreview, setShowRhythmPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [previewingSound, setPreviewingSound] = useState<SoundPaletteId | null>(null);
  const settingsSyncedRef = useRef(false);
  const previewStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    if (previewStatusTimerRef.current) {
      clearTimeout(previewStatusTimerRef.current);
      previewStatusTimerRef.current = null;
    }

    setSoundPaletteState(palette);
    try { localStorage.setItem(SOUND_STORAGE_KEY, palette); } catch { /* unavailable */ }
    if (palette === 'off') {
      setPreviewingSound(null);
      stopAmbient(0.45);
    } else {
      setPreviewingSound(palette);
      previewStatusTimerRef.current = setTimeout(() => {
        setPreviewingSound((current) => current === palette ? null : current);
        previewStatusTimerRef.current = null;
      }, 3800);
      void previewPalette(palette).catch(() => {
        if (previewStatusTimerRef.current) {
          clearTimeout(previewStatusTimerRef.current);
          previewStatusTimerRef.current = null;
        }
        setPreviewingSound(null);
        stopAmbient(0.2);
      });
    }
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
    logAppEvent(userId, 'timer_selected', { length });
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
        const { totalSessions } = computeStats(sessions);
        setHomeStat({ sessions: totalSessions });
        setShowSettings(totalSessions < SETTINGS_COLLAPSE_SESSION_COUNT);
      }
    } catch { /* unavailable */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    return () => {
      if (previewStatusTimerRef.current) {
        clearTimeout(previewStatusTimerRef.current);
        previewStatusTimerRef.current = null;
      }
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

  const previewingSoundLabel = SOUND_PALETTES.find((palette) => palette.id === previewingSound)?.label;
  const completedSessions = homeStat?.sessions ?? 0;
  const settingsCollapseEnabled = completedSessions >= SETTINGS_COLLAPSE_SESSION_COUNT;

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
              className="transition-transform duration-500 ease-out"
              style={{ transform: `scale(${orbScale})` }}
            >
              <div className="relative h-20 w-20 orb-breathe">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-300/60 to-emerald-600/40 shadow-[0_0_48px_rgba(110,231,183,0.22)]" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                <div className="absolute inset-[-14px] rounded-full border border-emerald-400/20 shadow-[0_0_18px_rgba(110,231,183,0.12)]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-[0.25em] sm:tracking-[0.38em] uppercase text-still-white/90">
              Exhale
            </h1>
            <p className="text-still-white/62 text-sm tracking-[0.12em] font-light text-center">
              Guided breathing for a calmer mind
            </p>
          </div>
        </div>

        {/* Session length picker — label removed, implied by context */}
        <form
          id="session-form"
          className="flex flex-col gap-4 w-full"
          action="/game"
          method="get"
          onSubmit={dismissFirstVisit}
        >
          <fieldset className="grid grid-cols-2 gap-2 w-full sm:grid-cols-4" aria-label="Session length">
            {SESSION_OPTIONS.map((opt) => {
              const active = selectedLength === opt.length;
              return (
                <label
                  key={opt.length}
                  className={`
                    min-h-[72px] rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 text-center cursor-pointer
                    ${active
                      ? SELECTED_SETTING_CLASS
                      : 'border-still-white/22 text-still-white/74 hover:border-still-white/38 hover:bg-still-white/5 hover:text-still-white/88'}
                    has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-emerald-200/80
                  `}
                >
                  <input
                    type="radio"
                    name="length"
                    value={opt.length}
                    checked={active}
                    onChange={() => updateSessionLength(opt.length)}
                    aria-label={`${opt.ariaLabel}, ${opt.description}`}
                    className="sr-only"
                  />
                  <span className="text-[1.05rem] leading-none font-extralight tracking-[0.04em]">{opt.label}</span>
                  <span className={`text-[10px] leading-none tracking-[0.14em] ${active ? 'text-emerald-100/90' : 'text-still-white/68'}`}>{opt.description}</span>
                </label>
              );
            })}
          </fieldset>

        {firstVisit && <input type="hidden" name="first" value="1" />}

        {/* Begin button */}
        <button
          type="submit"
          aria-label="Begin breathing session"
          className="w-full py-5 rounded-2xl bg-emerald-pulse border border-emerald-pulse text-forest-night text-sm tracking-[0.28em] uppercase font-light hover:bg-emerald-200 hover:border-emerald-200 active:scale-[0.98] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-100/85"
        >
          Begin
        </button>
        </form>

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

        <button
          type="button"
          onClick={() => setShowRhythmPreview((show) => !show)}
          aria-expanded={showRhythmPreview}
          aria-controls="rhythm-preview"
          className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/60 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/30 hover:text-still-white/78 hover:bg-still-white/5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-center"
        >
          <span>View sequence</span>
          <DisclosureCaret open={showRhythmPreview} />
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
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 border-b border-still-white/8 last:border-b-0"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: phase.color, boxShadow: `0 0 16px ${phase.glowColor}` }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-still-white/82 text-[11px] leading-tight tracking-[0.22em] uppercase font-light">
                    {phase.label}
                  </p>
                  <p className="text-still-white/58 text-[11px] tracking-[0.06em] font-light leading-snug normal-case">
                    {phase.instruction}
                  </p>
                </div>
                <span className="text-still-white/62 text-[11px] tabular-nums tracking-[0.12em] font-light">
                  {phase.duration}s
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Secondary controls — circle size and practice history together below the fold */}
        <div className="flex flex-col gap-3 w-full pt-3 border-t border-still-white/10">
          {settingsCollapseEnabled && (
            <button
              type="button"
              onClick={() => setShowSettings((show) => !show)}
              aria-expanded={showSettings}
              aria-controls="home-settings"
              className="w-full min-h-11 py-3 rounded-2xl border border-still-white/18 text-still-white/60 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/30 hover:text-still-white/78 hover:bg-still-white/5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-center"
            >
              <span>Settings</span>
              <DisclosureCaret open={showSettings} />
            </button>
          )}

          {(!settingsCollapseEnabled || showSettings) && (
            <div id="home-settings" className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-still-white/62 text-xs tracking-[0.14em] uppercase font-light">Circle size</span>
            <div className="flex gap-4 items-end" role="radiogroup" aria-label="Circle size">
              {([0.75, 1.0, 1.25] as const).map((scale, i) => {
                const sizes = ['w-3 h-3', 'w-4 h-4', 'w-5 h-5'] as const;
                const labels = ['S', 'M', 'L'] as const;
                const active = Math.abs(orbScale - scale) < 0.01;
                return (
                  <label
                    key={scale}
                    className={`
                      min-h-11 min-w-11 flex flex-col items-center justify-center gap-1.5 rounded-lg border cursor-pointer transition-all duration-300
                      ${active
                        ? SELECTED_SETTING_CLASS
                        : 'border-transparent text-still-white/60 hover:border-still-white/16 hover:bg-still-white/5 hover:text-still-white/80'}
                      has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-emerald-200/80
                    `}
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
                    <div className={`${sizes[i]} rounded-full transition-colors duration-300 ${active ? 'bg-emerald-pulse' : 'bg-still-white/70'}`} />
                    <span className="text-[10px] tracking-widest font-light">{labels[i]}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full px-1" role="radiogroup" aria-labelledby="sound-label">
            <div className="flex items-center justify-between gap-3">
              <span id="sound-label" className="text-still-white/62 text-xs tracking-[0.14em] uppercase font-light">
                Sound
              </span>

              {SOUND_OFF_PALETTE && (
                <label
                  title={SOUND_OFF_PALETTE.ariaLabel}
                  className={`
                    min-h-11 min-w-11 flex items-center justify-center rounded-lg border cursor-pointer transition-all duration-300
                    ${soundPalette === SOUND_OFF_PALETTE.id
                      ? SELECTED_SETTING_CLASS
                      : 'border-still-white/16 text-still-white/58 hover:border-still-white/30 hover:bg-still-white/5 hover:text-still-white/78'}
                    has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-emerald-200/80
                  `}
                >
                  <input
                    type="radio"
                    name="sound"
                    value={SOUND_OFF_PALETTE.id}
                    form="session-form"
                    checked={soundPalette === SOUND_OFF_PALETTE.id}
                    aria-label={SOUND_OFF_PALETTE.ariaLabel}
                    onChange={() => updateSoundPalette(SOUND_OFF_PALETTE.id)}
                    className="sr-only"
                  />
                  <MutedSoundIcon />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {SOUND_TEXTURE_PALETTES.map((palette) => {
                const active = soundPalette === palette.id;
                const previewing = previewingSound === palette.id;
                return (
                  <label
                    key={palette.id}
                    title={palette.ariaLabel}
                    className={`
                      min-h-11 flex items-center justify-center rounded-lg border px-1 text-[10px] tracking-[0.12em] uppercase font-light cursor-pointer transition-all duration-300
                      ${active
                        ? SELECTED_SETTING_CLASS
                        : 'border-still-white/16 text-still-white/58 hover:border-still-white/30 hover:text-still-white/78'}
                      has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-emerald-200/80
                    `}
                  >
                    <input
                      type="radio"
                      name="sound"
                      value={palette.id}
                      form="session-form"
                      checked={active}
                      aria-label={palette.ariaLabel}
                      onChange={() => updateSoundPalette(palette.id)}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1.5">
                      {palette.label}
                      {previewing && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-emerald-100 motion-safe:animate-pulse"
                        />
                      )}
                    </span>
                  </label>
                );
              })}
            </div>

            <p className="sr-only" aria-live="polite">
              {previewingSoundLabel ? `Previewing ${previewingSoundLabel} sound.` : soundPalette === 'off' ? 'Sound is off.' : ''}
            </p>
          </div>
            </div>
          )}

          <Link
            href="/stats"
            className="w-full min-h-14 py-3 rounded-2xl border border-still-white/20 text-still-white/60 hover:border-still-white/34 hover:text-still-white/78 hover:bg-still-white/5 active:scale-[0.98] transition-all duration-300 flex flex-col items-center justify-center gap-0.5 text-center"
            aria-label={homeStat ? `View practice history, ${homeStat.sessions} session${homeStat.sessions !== 1 ? 's' : ''}` : 'View practice history'}
          >
            <span className="text-xs tracking-[0.18em] uppercase font-light">Practice history</span>
            {homeStat && (
              <span className="text-[10px] leading-none tracking-[0.12em] font-light text-still-white/50 normal-case">
                {homeStat.sessions} session{homeStat.sessions !== 1 ? 's' : ''}
              </span>
            )}
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
