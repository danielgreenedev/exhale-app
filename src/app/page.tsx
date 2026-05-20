'use client';

import { useCallback, useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  DEFAULT_ORB_SCALE,
  DEFAULT_RHYTHM,
  DEFAULT_SESSION_LENGTH,
  RHYTHMS,
  RHYTHM_STORAGE_KEY,
  RhythmId,
  SessionLength,
  isRhythmId,
} from '@/lib/breathing';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import {
  DEFAULT_SOUND_PALETTE,
  SOUND_PALETTES,
  SoundPaletteId,
} from '@/lib/sound';
import { PolicyFooter } from '@/components/PolicyFooter';
import { readStats, computeStats } from '@/hooks/useSessionStats';
import { SURFACE_GLOWS } from '@/lib/colors';
import { useUserId } from '@/lib/auth';
import { logAppEvent } from '@/lib/appEvents';
import {
  PracticeSettings,
  isSessionLengthValue,
  readLocalPracticeSettings,
  saveUserSettings,
  syncUserSettings,
  writeLocalPracticeSettings,
} from '@/lib/settingsSync';

function isSessionLength(v: unknown): v is SessionLength {
  return isSessionLengthValue(v);
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

interface SessionOption {
  length: SessionLength;
  label: string;
  ariaLabel: string;
}

type SetupTab = 'sequence' | 'visual' | 'audio';

const SETUP_TABS: Array<{ id: SetupTab; label: string }> = [
  { id: 'sequence', label: 'Sequence' },
  { id: 'visual', label: 'Visual' },
  { id: 'audio', label: 'Audio' },
];

// Keep the first decision as simple as possible. Rhythm-specific breath counts
// stay in the rhythm helper so the length picker remains only about time.
const SESSION_OPTIONS: SessionOption[] = [
  { length: 'quick', label: '3 min', ariaLabel: '3 minute session' },
  { length: 'short', label: '5 min', ariaLabel: '5 minute session' },
  { length: 'medium', label: '7 min', ariaLabel: '7 minute session' },
  { length: 'long', label: '10 min', ariaLabel: '10 minute session' },
];

const SOUND_TEXTURE_PALETTES = SOUND_PALETTES.filter((palette) => palette.id !== 'off');
const SOUND_OFF_PALETTE = SOUND_PALETTES.find((palette) => palette.id === 'off');
const SELECTED_SETTING_CLASS = 'border-emerald-pulse/60 bg-emerald-pulse/10 text-emerald-100/90 hover:border-emerald-pulse/75 hover:bg-emerald-pulse/15 hover:text-emerald-50';

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
  const urlRhythm = searchParams.get('rhythm');
  const initialLength: SessionLength = isSessionLength(urlLength) ? urlLength : DEFAULT_SESSION_LENGTH;
  const initialRhythm: RhythmId = isRhythmId(urlRhythm) ? urlRhythm : DEFAULT_RHYTHM;

  const [selectedLength, setSelectedLength] = useState<SessionLength>(initialLength);
  const [selectedRhythm, setSelectedRhythm] = useState<RhythmId>(initialRhythm);
  const [homeStat, setHomeStat] = useState<{ sessions: number } | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [orbScale, setOrbScaleState] = useState<number>(DEFAULT_ORB_SCALE);
  const [soundPalette, setSoundPaletteState] = useState<SoundPaletteId>(DEFAULT_SOUND_PALETTE);
  const [firstVisit, setFirstVisit] = useState(false);
  const [showSessionSetup, setShowSessionSetup] = useState(false);
  const [showSequenceTiming, setShowSequenceTiming] = useState(false);
  const [setupTab, setSetupTab] = useState<SetupTab>('sequence');
  const [previewingSound, setPreviewingSound] = useState<SoundPaletteId | null>(null);
  const [previewingRhythm, setPreviewingRhythm] = useState<RhythmId | null>(null);

  const describedRhythm = RHYTHMS[previewingRhythm ?? selectedRhythm];
  const sessionOptions = SESSION_OPTIONS;
  const settingsSyncedRef = useRef(false);
  const previewStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSettingsRef = useRef<Partial<PracticeSettings>>({});
  const { previewPalette, stopAmbient } = useAudioEngine(soundPalette);
  const userId = useUserId();

  // Trailing debounce on cloud writes. Rapid clicks through Circle Size, Sound, etc.
  // batch into one upsert ~400ms after the last change. localStorage writes stay
  // immediate; only the network round-trip is debounced.
  const queueSettingsSave = useCallback((settings: Partial<PracticeSettings>) => {
    if (!userId) return;
    pendingSettingsRef.current = { ...pendingSettingsRef.current, ...settings };
    if (settingsSaveTimerRef.current) clearTimeout(settingsSaveTimerRef.current);
    settingsSaveTimerRef.current = setTimeout(() => {
      settingsSaveTimerRef.current = null;
      const pending = pendingSettingsRef.current;
      pendingSettingsRef.current = {};
      if (Object.keys(pending).length === 0) return;
      saveUserSettings(userId, pending).then(({ error }) => {
        if (error) console.error('[supabase] user_settings upsert failed:', error);
      });
    }, 400);
  }, [userId]);

  // Flush any pending changes if userId rotates (anon -> permanent) or on unmount.
  // Fire-and-forget; we don't block the cleanup on the request.
  useEffect(() => {
    return () => {
      if (settingsSaveTimerRef.current) {
        clearTimeout(settingsSaveTimerRef.current);
        settingsSaveTimerRef.current = null;
      }
      if (userId && Object.keys(pendingSettingsRef.current).length > 0) {
        const pending = pendingSettingsRef.current;
        pendingSettingsRef.current = {};
        saveUserSettings(userId, pending).catch(() => {});
      }
    };
  }, [userId]);

  const updateOrbScale = (scale: number) => {
    setOrbScaleState(scale);
    try { writeLocalPracticeSettings({ orbScale: scale }); } catch { /* unavailable */ }
    queueSettingsSave({ orbScale: scale });
  };

  const updateSoundPalette = (palette: SoundPaletteId) => {
    if (previewStatusTimerRef.current) {
      clearTimeout(previewStatusTimerRef.current);
      previewStatusTimerRef.current = null;
    }

    setSoundPaletteState(palette);
    try { writeLocalPracticeSettings({ soundPalette: palette }); } catch { /* unavailable */ }
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
    queueSettingsSave({ soundPalette: palette });
  };

  const updateSessionLength = (length: SessionLength) => {
    setSelectedLength(length);
    try { writeLocalPracticeSettings({ sessionLength: length }); } catch { /* unavailable */ }
    logAppEvent(userId, 'timer_selected', { length });
    queueSettingsSave({ sessionLength: length });
  };

  const updateRhythm = (id: RhythmId) => {
    setSelectedRhythm(id);
    try { writeLocalPracticeSettings({ rhythm: id }); } catch { /* unavailable */ }
    queueSettingsSave({ rhythm: id });
  };

  useEffect(() => {
    try {
      const settings = readLocalPracticeSettings(initialLength, initialRhythm);
      setOrbScaleState(settings.orbScale);
      setSoundPaletteState(settings.soundPalette);
      if (!isSessionLength(urlLength)) {
        setSelectedLength(settings.sessionLength);
      }
      if (!isRhythmId(urlRhythm)) {
        setSelectedRhythm(settings.rhythm);
      }
      if (!localStorage.getItem('exhale-visited')) setFirstVisit(true);
      const { sessions } = readStats();
      if (sessions.length > 0) {
        const { totalSessions } = computeStats(sessions);
        setHomeStat({ sessions: totalSessions });
      }
    } catch { /* unavailable */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync settings with Supabase: restore cloud settings on first load, push local on new users
  useEffect(() => {
    if (!userId || settingsSyncedRef.current) return;
    settingsSyncedRef.current = true;

    syncUserSettings(userId, selectedLength, selectedRhythm)
      .then(({ settings, error }) => {
        setOrbScaleState(settings.orbScale);
        setSoundPaletteState(settings.soundPalette);
        if (!isSessionLength(urlLength)) setSelectedLength(settings.sessionLength);
        if (!isRhythmId(urlRhythm)) setSelectedRhythm(settings.rhythm);
        if (error) {
          console.error('[supabase] user_settings sync failed:', error);
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

  return (
    <main className="min-h-screen bg-forest-night flex flex-col items-center px-4 sm:px-6 text-still-white">
      {/* Warm forest glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: SURFACE_GLOWS.home }}
      />

      <div className="relative z-10 flex w-full max-w-[18rem] flex-col items-center gap-4 py-8 sm:max-w-sm sm:py-12">

        {/* Logo orb */}
        <div className="flex flex-col items-center gap-3.5">
          <div className="h-28 sm:h-32 flex items-center justify-center" aria-hidden="true">
            <div
              className="transition-transform duration-500 ease-out"
              style={{ transform: `scale(${orbScale})` }}
            >
              <div className="relative h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20 orb-breathe">
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 36% 30%, rgba(202,224,211,0.68) 0%, rgba(94,158,118,0.60) 46%, rgba(31,82,52,0.64) 100%)',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(245,245,242,0.14) 0%, rgba(245,245,242,0) 56%)' }}
                />
                <div
                  className="absolute inset-[-12px] rounded-full border sm:inset-[-14px]"
                  style={{ borderColor: 'rgba(93,177,132,0.20)' }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-[0.25em] sm:tracking-[0.38em] uppercase text-still-white/90">
              Exhale
            </h1>
            <p className="text-still-white/72 text-sm tracking-[0.04em] font-light text-center">
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
            {sessionOptions.map((opt) => {
              const active = selectedLength === opt.length;
              return (
                <label
                  key={opt.length}
                  className={`
                    min-h-14 sm:min-h-16 rounded-2xl border transition-all duration-300 flex items-center justify-center text-center cursor-pointer
                    ${active
                      ? SELECTED_SETTING_CLASS
                      : 'border-still-white/26 text-still-white/80 hover:border-still-white/40 hover:bg-still-white/5 hover:text-still-white/92'}
                    has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-emerald-200/80
                  `}
                >
                  <input
                    type="radio"
                    name="length"
                    value={opt.length}
                    checked={active}
                    onChange={() => updateSessionLength(opt.length)}
                    aria-label={opt.ariaLabel}
                    className="sr-only"
                  />
                  <span className="text-[1.08rem] leading-none font-extralight tracking-[0.04em]">{opt.label}</span>
                </label>
              );
            })}
          </fieldset>

        {firstVisit && <input type="hidden" name="first" value="1" />}

        {/* Begin button */}
        <button
          type="submit"
          aria-label="Begin breathing session"
          className="w-full py-4 sm:py-5 rounded-2xl bg-emerald-pulse border border-emerald-pulse text-forest-night text-sm tracking-[0.2em] uppercase font-semibold hover:bg-emerald-200 hover:border-emerald-200 active:scale-[0.98] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-100/85"
        >
          Begin
        </button>
        </form>

        {/* Resume button — only shown within 60s of exiting a session */}
        {resumeData && (
          <Link
            href={`/game?length=${resumeData.length}&resume=${resumeData.elapsed.toFixed(1)}`}
            aria-label={`Resume ${resumeData.length} session, ${formatDuration(Math.floor(resumeData.elapsed))} in`}
            className="w-full py-3.5 px-6 rounded-2xl border border-still-white/22 text-still-white/68 hover:border-still-white/34 hover:text-still-white/84 transition-all duration-300 -mt-1 flex flex-col items-center gap-0.5"
          >
            <span className="text-sm tracking-[0.18em] uppercase font-light">
              ↩ Resume {resumeData.length}
            </span>
            <span className="text-xs tracking-[0.04em] font-light text-still-white/64 normal-case">
              {formatDuration(Math.floor(resumeData.elapsed))} in · from your last session
            </span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setShowSessionSetup((show) => !show)}
          aria-expanded={showSessionSetup}
          aria-controls="session-setup"
          className="w-full min-h-11 py-3 rounded-2xl border border-still-white/22 text-still-white/68 text-xs tracking-[0.18em] uppercase font-light hover:border-still-white/34 hover:text-still-white/84 hover:bg-still-white/5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-center"
        >
          <span>Session setup</span>
          <DisclosureCaret open={showSessionSetup} />
        </button>

        {showSessionSetup && (
          <section
            id="session-setup"
            aria-label="Session setup"
            className="w-full border-y border-still-white/10 py-2 flex flex-col gap-3"
          >
            <div
              className="grid grid-cols-3 gap-1 rounded-lg border border-still-white/10 bg-still-white/[0.02] p-1"
              role="tablist"
              aria-label="Session setup sections"
            >
              {SETUP_TABS.map((tab) => {
                const active = setupTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`setup-tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="session-setup-panel"
                    onClick={() => setSetupTab(tab.id)}
                    className={`
                      min-h-10 rounded-md border text-[10px] tracking-[0.1em] uppercase font-light transition-all duration-300
                      ${active
                        ? SELECTED_SETTING_CLASS
                        : 'border-transparent text-still-white/58 hover:border-still-white/18 hover:bg-still-white/5 hover:text-still-white/78'}
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-emerald-200/80
                    `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div
              id="session-setup-panel"
              role="tabpanel"
              aria-labelledby={`setup-tab-${setupTab}`}
              className="w-full"
            >
              {setupTab === 'sequence' && (
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-col gap-2 w-full px-1" role="radiogroup" aria-labelledby="sequence-label">
                    <span id="sequence-label" className="text-still-white/62 text-xs tracking-[0.14em] uppercase font-light">
                      Choose your pace
                    </span>
                    <div className="overflow-hidden rounded-lg border border-still-white/10 bg-still-white/[0.02]">
                      <div className="grid grid-cols-4 gap-1 p-1">
                        {(Object.values(RHYTHMS)).map((r) => {
                          const active = selectedRhythm === r.id;
                          const sig = r.pattern.map((p) => p.duration).join('-');
                          return (
                            <label
                              key={r.id}
                              onMouseEnter={() => setPreviewingRhythm(r.id)}
                              onMouseLeave={() => setPreviewingRhythm(null)}
                              onFocus={() => setPreviewingRhythm(r.id)}
                              onBlur={() => setPreviewingRhythm(null)}
                              className={`
                                min-h-11 min-w-0 flex items-center justify-center rounded-md border px-0.5 cursor-pointer transition-all duration-300
                                ${active
                                  ? SELECTED_SETTING_CLASS
                                  : 'border-still-white/16 text-still-white/58 hover:border-still-white/30 hover:text-still-white/78'}
                                has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-emerald-200/80
                              `}
                            >
                              <input
                                type="radio"
                                name="rhythm"
                                value={r.id}
                                form="session-form"
                                checked={active}
                                aria-label={`${r.label} pace. ${r.summary}. ${r.description} Timing ${sig}.`}
                                aria-describedby="rhythm-description"
                                onChange={() => updateRhythm(r.id)}
                                className="sr-only"
                              />
                              <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[10px] tracking-[0.02em] uppercase font-light leading-none">
                                {r.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      <p
                        id="rhythm-description"
                        className="min-h-[2.75rem] border-t border-still-white/10 px-3 py-2 text-xs leading-relaxed tracking-[0.04em] text-still-white/70"
                      >
                        <span className="uppercase tracking-[0.14em] text-still-white/78">{describedRhythm.label}</span>
                        <span className="px-1.5 text-still-white/32">/</span>
                        {describedRhythm.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-expanded={showSequenceTiming}
                    aria-controls="sequence-timing"
                    onClick={() => setShowSequenceTiming((show) => !show)}
                    className="self-center inline-flex min-h-10 min-w-36 items-center justify-center gap-2 rounded-lg border border-still-white/18 bg-still-white/[0.025] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-still-white/62 transition-all duration-300 hover:border-still-white/30 hover:bg-still-white/[0.055] hover:text-still-white/82 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-emerald-200/80"
                  >
                    <span>{showSequenceTiming ? 'Hide timing' : 'View timing'}</span>
                    <DisclosureCaret open={showSequenceTiming} />
                  </button>

                  {showSequenceTiming && (
                    <div id="sequence-timing" className="pt-1">
                      {describedRhythm.pattern.map((phase) => {
                        const mutedPhase = describedRhythm.id === 'flow' && phase.phase === 'hold';
                        return (
                          <div
                            key={phase.phase}
                            className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 border-b border-still-white/8 last:border-b-0 transition-opacity duration-300 ${mutedPhase ? 'opacity-45' : 'opacity-100'}`}
                          >
                            <div
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: phase.color,
                              }}
                              aria-hidden="true"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-still-white/82 text-[11px] leading-tight tracking-[0.22em] uppercase font-light">
                                {phase.label}
                              </p>
                              <p className="text-still-white/58 text-[11px] tracking-[0.04em] font-light leading-snug normal-case">
                                {phase.instruction}
                              </p>
                            </div>
                            <span className="text-still-white/62 text-[11px] tabular-nums tracking-[0.12em] font-light">
                              {phase.duration}s
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {setupTab === 'visual' && (
                <div className="flex flex-col gap-3 w-full px-1">
                  <div className="flex items-center justify-between w-full">
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
                </div>
              )}

              {setupTab === 'audio' && (
                <div className="flex flex-col gap-3 w-full px-1" role="radiogroup" aria-labelledby="sound-label">
                  <div className="flex items-center justify-between gap-3">
                    <span id="sound-label" className="text-still-white/62 text-xs tracking-[0.14em] uppercase font-light">
                      Background sound
                    </span>

                    {SOUND_OFF_PALETTE && (
                      <label
                        title={SOUND_OFF_PALETTE.ariaLabel}
                        className={`
                          min-h-11 min-w-16 flex items-center justify-center gap-1.5 rounded-lg border px-2 text-[10px] tracking-[0.12em] uppercase font-light cursor-pointer transition-all duration-300
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
                        <span>Off</span>
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
                    {previewingSoundLabel ? `Previewing ${previewingSoundLabel} background sound.` : soundPalette === 'off' ? 'Background sound is off.' : ''}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {homeStat && (
          <div className="flex flex-col gap-3 w-full pt-3 border-t border-still-white/10">
            <Link
              href="/stats"
              className="w-full min-h-14 py-3 rounded-2xl border border-still-white/20 text-still-white/60 hover:border-still-white/34 hover:text-still-white/78 hover:bg-still-white/5 active:scale-[0.98] transition-all duration-300 flex flex-col items-center justify-center gap-0.5 text-center"
              aria-label={`View practice history, ${homeStat.sessions} session${homeStat.sessions !== 1 ? 's' : ''}`}
            >
              <span className="text-xs tracking-[0.18em] uppercase font-light">Practice history</span>
              <span className="text-[10px] leading-none tracking-[0.04em] font-light text-still-white/50 normal-case">
                {homeStat.sessions} session{homeStat.sessions !== 1 ? 's' : ''}
              </span>
            </Link>
          </div>
        )}

        <PolicyFooter />

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
