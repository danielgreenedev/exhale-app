# Exhale

Guided breathing app built with Next.js 16, React 19, TypeScript, Tailwind CSS v3.

## Mission

To allow anyone to learn paced breathing as an anxiety coping skill.

## Target Audience

People who don't use self-care apps. The goal is as low friction and as few obstacles as possible to participating. It should also be usable for anyone, including people with existing breathwork experience.

This means: no required sign-up, no required accounts, no onboarding gates, no streaks that guilt, no complexity that intimidates. Every screen should feel like an invitation, not a requirement.

## Core Mechanic

Selectable breathing rhythm exposed inside Session Setup on the home screen. Four visible pace options, default Steady. Internal ids stay `standard`, `gentle`, `full`, and `flow` for storage compatibility:

- **Steady** (`standard`) — 4-4-6-8 (22s cycle). Default for first-time users.
- **Soft** (`gentle`) — 3-2-4-4 (13s cycle, 4.6 breaths/min). Shorter, lighter cycles for easier breathing.
- **Full** (`full`) — 6-6-10-4 (26s cycle, 2.3 breaths/min). Slower, deeper rhythm with longer breaths.
- **Flow** (`flow`) — 4-0-6-2 (12s cycle, 5.0 breaths/min). No hold, steady momentum. Hold phase has zero duration but stays in the canonical four-phase shape; `getNextPhase` skips zero-duration phases so the anticipation cue never lands on Hold during Flow.

Fully guided, with no user input needed during a session. Session lengths: quick (~3m), short (~5m), medium (~7m), long (~10m). Cycle counts are recalibrated per rhythm so each minute label stays close to its target across all four patterns.

The fourth phase is labeled `Relax` (not `Rest`) and its instruction is the single word `Breathe`. The phase exists to let the body do what it naturally wants after exhale, which is to take an inhale on its own time; "Rest" implied stillness in a way that did not match that intent. The phase enum stays `rest` as the internal discriminator. In Steady the phase is long enough for a full normal breath; Soft, Full, and Flow reshape that balance for their respective audiences (Flow trims it to 2s as a transition beat).

Phase transitions have anticipatory support because beta feedback showed that exact boundary changes can take a beat to process. In the final 0.8s of each phase (or 25% of phase duration on short phases — whichever is smaller), the guide ring around the orb picks up the next phase's color and a quiet pre-cue tone plays when sound is on. The cap is set by `getPhaseLookahead(phase)` in `src/lib/breathing.ts`; the ceiling `PHASE_LOOKAHEAD_SECONDS = 0.8` is what most phases use, but Soft's 2s Hold, Soft's 3s Inhale, and Flow's 2s Relax all get a proportionally shorter lead so the cue does not occupy 40% of the phase. No textual HUD cue is shown; an earlier attempt at a `Next [phase]` label competed with the central phase label and countdown for attention, so it was removed.

The active phase label and the Settle In label intentionally share the same semibold, shadowed treatment for legibility over the moving orb. The instruction line below the phase label is compact, brighter than decorative UI text, and shadowed for older/low-vision mobile users.

The center orb is the primary timing object. Keep the outer guide ring and incoming-color lead visibly softer than the orb; graphic-designer feedback showed that a brighter line can feel like the user is already behind because it starts before the orb changes.

## Stack

- `src/app/page.tsx` — home/menu screen
- `src/app/game/page.tsx` — active session screen
- `src/app/stats/page.tsx` — practice history screen
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` — quiet policy pages linked from the shared policy footer
- `src/components/BreathingOrb.tsx` — canvas orb, particles, progress rings; rhythm-aware
- `src/components/GameHUD.tsx` — in-session HUD overlay; rhythm-aware
- `src/components/SessionComplete.tsx` — end-of-session screen
- `src/hooks/useBreathingSession.ts` — RAF-based session state machine; accepts rhythm
- `src/hooks/useAudioEngine.ts` — Web Audio API synthesis (no external files); rhythm-aware breath filter ramp
- `src/hooks/useSessionStats.ts` — localStorage + Supabase session persistence
- `src/lib/breathing.ts` — RHYTHMS registry, phase configs, session lengths, easing math
- `src/lib/sound.ts` — sound palette labels and storage IDs
- `src/lib/auth.tsx` — anonymous-first auth with optional Backup & Sync upgrade
- `src/lib/supabase.ts` — browser Supabase client singleton
- `src/lib/settingsSync.ts` — local/cloud round-trip for orb scale, sound, session length, rhythm
- `src/lib/sessionSync.ts` — local/cloud session merge helpers (dedup-aware)
- `src/lib/appEvents.ts` — Supabase event logging for synced users

## Design Principles

- **Friction is the enemy.** Every extra tap, label, or decision is a barrier for the target user. Cut before adding.
- **The orb is the product.** All UI is secondary to the breathing experience on the canvas.
- **Calm over clever.** No animations for their own sake. Motion should reinforce breathing rhythm.
- **Dark, minimal, emerald accent.** Amber only on session complete (signals closure). No other accent colors.
- **No guilt mechanics.** Stats and streaks are for reflection, not pressure.

## Audio System

Web Audio API synthesis only — no external audio files. Zero load time, works offline.

- Background sound palettes: Off, Air, Warm, Deep, Still. Air is the default.
- Phase cues are synthesized from per-phase tone pairs in `CUE_MAP`; the rhythm-aware breath filter ramps with the active phase duration.
- Autoplay policy is already handled: attempts auto-start, falls back to first user interaction.
- During active sessions, `scheduleAmbientStop` schedules a Web Audio clock fade-out at the guided-session deadline so Chrome background-tab throttling cannot leave the ambient bed running after completion.
- On iPhone-class browsers, the session screen shows a timed "still quiet? check silent mode" hint after Settle In when sound is active. `startAmbient` must not report success unless the Web Audio context is actually running.

## Phase Colors

These shift the entire canvas (orb, glow, rings, particles) during a session:

- Inhale: `hsl(198, 45%, 63%)` — blue
- Hold: `hsl(40, 55%, 61%)` — orange
- Exhale: `hsl(148, 35%, 53%)` — green
- Relax: `hsl(348, 42%, 66%)` — pink (phase enum `rest`)

Amber (`hsl(38, 92%, 65%)` approx) appears only on the session complete screen — it signals closure, not phase.

## localStorage Keys

Do not reuse these keys for new features:

| Key | Storage | Purpose |
|-----|---------|---------|
| `exhale-stats` | localStorage | Session records array |
| `exhale-orb-scale` | localStorage | Circle size preference (0.75 / 1.0 / 1.25) |
| `exhale-sound-palette` | localStorage | Sound palette preference (`air` / `warm` / `low` / `quiet` / `off`; labels are Air / Warm / Deep / Still / mute) |
| `exhale-session-length` | localStorage | Last picked session length (`quick` / `short` / `medium` / `long`) |
| `exhale-rhythm` | localStorage | Last picked breathing rhythm (`standard` / `gentle` / `full` / `flow`) |
| `exhale-visited` | localStorage | First-visit flag (cleared = first visit) |
| `exhale-resume` | sessionStorage | In-progress session state, 60s TTL |

## Supabase Data

Supabase is optional from the user's point of view and only appears through Practice History Backup & Sync. The active direction is email-code sync plus optional Google OAuth via Supabase Auth, while preserving anonymous local use as the default. Google Backup & Sync should use `linkIdentity()` when a Supabase session already exists so anonymous cloud rows can remain attached to the same user id; fall back to `signInWithOAuth()` only when there is no current session.

| Table | Purpose |
|-------|---------|
| `breathing_sessions` | Cloud practice history |
| `user_settings` | Timer length, Circle Size, sound choice, and rhythm |
| `app_events` | Lightweight counts for timer selection, session start, early exit, and completion |
| `quotes` | Rotating inspirational quotes for the session complete screen (read-only via RLS) |

Local development on `localhost` / `127.0.0.1` uses local-only auth by default so blocked Supabase requests do not trigger the Next.js dev overlay during visual QA. To deliberately test local Supabase auth/sync, run `localStorage.setItem('exhale-enable-local-supabase', '1')` in the browser and reload.

## Key UX Decisions

These are intentional — don't undo them without understanding the rationale:

- **No user input during a session** — fully guided, not hold-to-breathe. Reduces intimidation for first-timers who don't know when to inhale.
- **Anonymous by default, Backup & Sync by choice** — users can breathe and keep local history without signing in. Practice History may offer email-code sync and Google OAuth as optional persistence paths, but the home screen and session flow must never become auth-gated.
- **Abstract orb** — chosen over thematic visuals (ocean, lantern, mandala). More universal, less culturally loaded, works for any user.
- **Selectable pace (Steady / Soft / Full / Flow)** — Steady, Soft, Full added after five of six recent beta testers reported rhythm-fit concerns across a range of capacities and preferences. Flow added after four testers (T-2026-05-19-03, -05, -06, -07) converged on Rest/Hold as the friction; Flow removes Hold entirely and shortens Relax to a transition beat. Default stays Steady 4-4-6-8; alternates are accessibility-oriented, not preference-oriented. Rhythm is locked at session start; it does not change mid-session.
- **Fourth phase reframed as `Relax` with instruction `Breathe`** — "Rest" implied stillness when the body actually wants to inhale after exhale. `Relax` keeps imperative-verb parity with Inhale / Hold / Exhale and reads as permission. The instruction collapses to a single word because the label does the framing.
- **Anticipatory cue in the final 0.8s of each phase, or 25% of phase duration, whichever is smaller** — guide-ring picks up the next-phase color and audio plays a quiet pre-cue. The proportional cap keeps the lead from feeling jittery on short phases (Soft Hold, Flow Relax). No HUD text cue (removed because it competed with the central phase label and countdown).
- **8s settle-in before first breath** — gives the user a quiet transition from "reading the screen" to "being in the session."
- **New-user defaults** — Quick / 3 min and medium Circle Size are the first-run defaults so the first session feels short and visually balanced.
- **Session resume (60s window)** — exiting a session shows an exit guard; sessionStorage holds state for 60s so accidental exits don't lose progress.
- **Resume directly below Begin** — when a resumable session exists, the continuation action sits next to the primary start action before Session Setup.
- **Session Setup disclosure** — one quiet drawer below Begin/Resume contains the sequence, Circle Size, and Sound for everyone. There is no completed-session rule for hiding controls.
- **No phase instruction after cycle 2** — the HUD instruction fades; the orb has already taught the pattern by then.

## Accessibility Baseline (Already Built)

Do not remove these without replacement:

- `prefers-reduced-motion`: particles and orb animation skip in `BreathingOrb.tsx`
- Keyboard shortcuts: `Space` pause/resume, `Esc` exit guard, `F` fullscreen toggle
- ARIA live regions on phase label (`aria-live="polite"`) and cycle counter
- `role="timer"` on countdown, `role="progressbar"` on session bar
- Radio group keyboard navigation (arrow keys) on session picker
- All interactive elements have `aria-label`

## What to Avoid

- Adding screens, modals, or flows that require decisions before the user can breathe
- Surfacing technical details (phase names, seconds, pattern math) before they are needed
- Assuming the user knows what "breathwork" or "breath cycles" means
- Complexity that would cause a non-self-care-app user to close the tab

## Design Context

Full design system documentation lives in two files at the project root. Read these before any visual work:

- **`PRODUCT.md`** — register (product), users, product purpose, brand personality (quiet, warm, accessible), anti-references, design principles, emotional arc, accessibility target (WCAG 2.1 AA)
- **`DESIGN.md`** — color palette (Still Water), typography (Inter 100/200/300/600 only), elevation rules, component specs, named rules including: Amber Exception, One Accent, Weight Ceiling, Uppercase Contract, No Shadow, No Italic

Key named rules to enforce on every change:
- Emerald accent ≤10% coverage outside the session canvas
- Amber only on session complete — nowhere else
- Only `font-thin/extralight/light/semibold` (100/200/300/600) — no `font-normal`
- No `italic` anywhere in the interface
- No `box-shadow` for structural elevation. Static orb marks also avoid colored glow shadows; luminous phase light belongs inside the session canvas.
- Session controls (Pause, Exit) at bottom corners — never top of screen on mobile
- Dialog/guard backdrops use tinted forest-night scrims such as `rgba(15,23,18,0.85)` — never pure black and never a colored accent
