# Exhale

Guided breathing app built with Next.js 16, React 19, TypeScript, Tailwind CSS v3.

## Mission

To allow anyone to learn paced breathing as an anxiety coping skill.

## Target Audience

People who don't use self-care apps. The goal is as low friction and as few obstacles as possible to participating. It should also be usable for anyone, including people with existing breathwork experience.

This means: no required sign-up, no required accounts, no onboarding gates, no streaks that guilt, no complexity that intimidates. Every screen should feel like an invitation, not a requirement.

## Core Mechanic

Selectable breathing rhythm exposed inside Session Setup on the home screen. Four visible pace options appear in this order: Soft, Box, Flow, Relax. Default is Soft. Current internal ids are `gentle`, `standard`, `flow`, and `box`; legacy saved ids `full` and `slow` normalize to `box` for storage compatibility. The visible `Relax` option uses the `box` storage id and presents the 4-7-8 preset:

- **Soft** (`gentle`) - 4-4 (8s cycle, 7.5 breaths/min). Default for first-time users; no holds, just an easy in and out.
- **Box** (`standard`) - 4-4-4-4 (16s cycle, 3.75 breaths/min). Structured square-breathing option; the second Hold stays at the exhaled orb scale.
- **Flow** (`flow`) - 4-6 (10s cycle, 6.0 breaths/min). No hold or pause, just inhale and longer exhale.
- **Relax** (`box`) - 4-7-8 (19s cycle, 3.2 breaths/min). Classic 4-7-8 option; the id remains `box` only for storage compatibility.

Fully guided, with no user input needed during a session. Session lengths: quick (~3m), short (~5m), medium (~7m), long (~10m). Cycle counts are recalibrated per rhythm so each minute label stays close to its target across all four patterns.

There is no `rest` phase or post-exhale Relax/Pause mechanic in the current phase model. Box includes a second `Hold` after Exhale, but it remains a true hold phase and keeps the orb at the exhaled-small scale. The previous post-exhale Relax/Pause mechanic was retired on 2026-06-21 after broad tester dislike and clinical-family pranayama feedback reinforced that the post-exhale beat was semantically confusing and could make the rhythm feel inhale-heavy.

Phase transitions have anticipatory support because beta feedback showed that exact boundary changes can take a beat to process. In the final 0.8s of each phase (or 25% of phase duration on short phases, whichever is smaller), the guide ring around the orb picks up the next phase's color and a quiet pre-cue tone plays when sound is on. The cap is set by `getPhaseLookahead(phase)` in `src/lib/breathing.ts`; shipped phases are currently 4s or longer, so they use the full `PHASE_LOOKAHEAD_SECONDS = 0.8` lead. The proportional cap stays for future short phases. No textual HUD cue is shown; an earlier attempt at a `Next [phase]` label competed with the central phase label and countdown for attention, so it was removed.

The active phase label and the Settling In label intentionally share the same semibold, shadowed treatment for legibility over the moving orb. The instruction line below the phase label remains visible throughout the session, is brighter than decorative UI text, and is shadowed for older/low-vision mobile users.

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
- `src/lib/auth.tsx` — anonymous-first auth with optional Google, Apple, and email sign-in
- `src/lib/emailUpdates.ts` — opt-in-only Email Updates consent helper
- `src/lib/supabase.ts` — browser Supabase client singleton
- `src/lib/settingsSync.ts` — local/cloud round-trip for orb scale, sound, session length, rhythm
- `src/lib/sessionSync.ts` — local/cloud session merge helpers (dedup-aware)
- `src/lib/appEvents.ts` — Supabase event logging for synced users

## Design Principles

- **Friction is the enemy.** Every extra tap, label, or decision is a barrier for the target user. Cut before adding.
- **The orb is the product.** All UI is secondary to the breathing experience on the canvas.
- **Calm over clever.** No animations for their own sake. Motion should reinforce breathing rhythm.
- **Dark, minimal, emerald accent.** Amber only on session complete (signals closure). Phase colors may appear only as tiny semantic markers for breath-related settings/history, never as a second accent system.
- **No guilt mechanics.** Stats and streaks are for reflection, not pressure.

## Audio System

Web Audio API synthesis only — no external audio files. Zero load time, works offline.

- Background sound palettes: Off, Warm, Air, Deep, Still. Warm is the default.
- Phase cues are synthesized from per-phase tone pairs in `CUE_MAP`; the rhythm-aware breath filter ramps with the active phase duration.
- Autoplay policy is already handled: attempts auto-start, falls back to first user interaction.
- During active sessions, `scheduleAmbientStop` schedules a Web Audio clock fade-out at the guided-session deadline so Chrome background-tab throttling cannot leave the ambient bed running after completion.
- On iPhone-class browsers, the session screen shows a timed "still quiet? check silent mode" hint after Settling In when sound is active. `startAmbient` must not report success unless the Web Audio context is actually running.

## Phase Colors

These shift the entire canvas (orb, glow, rings, particles) during a session:

- Inhale: `hsl(198, 45%, 63%)` — blue
- Hold: `hsl(40, 55%, 61%)` — orange
- Exhale: `hsl(148, 35%, 53%)` — green

Amber (`hsl(38, 92%, 65%)` approx) appears only on the session complete screen — it signals closure, not phase.

## localStorage Keys

Do not reuse these keys for new features:

| Key | Storage | Purpose |
|-----|---------|---------|
| `exhale-stats` | localStorage | Session records array |
| `exhale-orb-scale` | localStorage | Circle size preference (0.75 / 1.0 / 1.25) |
| `exhale-sound-palette` | localStorage | Sound palette preference (`air` / `warm` / `low` / `quiet` / `off`; labels are Air / Warm / Deep / Still / mute) |
| `exhale-session-length` | localStorage | Last picked session length (`quick` / `short` / `medium` / `long`) |
| `exhale-rhythm` | localStorage | Last picked breathing rhythm (`standard` / `gentle` / `box` / `flow`; legacy `full` / `slow` normalize to `box`) |
| `exhale-visited` | localStorage | First-visit flag (cleared = first visit) |
| `exhale-email-updates-pending` | localStorage | Short-lived pending Email Updates opt-in marker while OAuth or magic-link sign-in redirects complete |
| `exhale-resume` | sessionStorage | In-progress session state, 60s TTL |

## Supabase Data

Supabase is optional from the user's point of view and appears through Sign In for history across devices. The visible paths are Google OAuth, Apple OAuth, and email magic link through Supabase Auth, while preserving anonymous local use as the default. Footer `Sign In` opens Practice so the user can choose a provider and optionally check Email Updates. OAuth sign-in should use `signInWithOAuth()` from idle/anonymous states, because new browsers get anonymous Supabase sessions by default. Use `linkIdentity()` only as a bridge from an already signed-in non-anonymous user state.

| Table | Purpose |
|-------|---------|
| `breathing_sessions` | Cloud practice history |
| `user_settings` | Timer length, Circle Size, sound choice, and rhythm |
| `app_events` | Lightweight counts for timer selection, session start, early exit, and completion |
| `email_update_subscriptions` | Explicit opt-in consent for future Email Updates |
| `quotes` | Rotating inspirational quotes for the session complete screen (read-only via RLS) |

Local development on `localhost` / `127.0.0.1` uses local-only auth by default so blocked Supabase requests do not trigger the Next.js dev overlay during visual QA. To deliberately test local Supabase auth/sync, run `localStorage.setItem('exhale-enable-local-supabase', '1')` in the browser and reload.

## Key UX Decisions

These are intentional — don't undo them without understanding the rationale:

- **No user input during a session** — fully guided, not hold-to-breathe. Reduces intimidation for first-timers who don't know when to inhale.
- **Anonymous by default, Sign In by choice** — users can breathe and keep local history without signing in. Visible sign-in choices are Google, Apple, and email magic link, and exist to track history across devices; the session flow must never become auth-gated.
- **Abstract orb** — chosen over thematic visuals (ocean, lantern, mandala). More universal, less culturally loaded, works for any user.
- **Selectable pace (Soft / Box / Flow / Relax)** — Soft is the default easiest no-hold loop, Box is the 4-4-4-4 structure, Flow is the smoother no-hold option, and Relax uses the legacy `box` id for compatibility while keeping the 4-7-8 timing visible in the picker. Alternates are accessibility-oriented, not preference-oriented. Rhythm is locked at session start; it does not change mid-session.
- **Post-exhale handling** — there is no internal or visible post-exhale `Relax`, `Pause`, `Breathe naturally`, or `rest` phase in current rhythms. `Relax` is a selectable rhythm name, not a phase. Box's second post-exhale beat is a `Hold`, not a rest/relax phase. Do not reintroduce a post-exhale rest phase without fresh beta evidence.
- **Anticipatory cue in the final 0.8s of each phase, or 25% of phase duration, whichever is smaller** — guide-ring picks up the next-phase color and audio plays a quiet pre-cue. The proportional cap keeps the lead from feeling jittery on short phases. No HUD text cue (removed because it competed with the central phase label and countdown).
- **8s Settling In before first breath** — gives the user a quiet transition from "reading the screen" to "being in the session."
- **New-user defaults** — Quick / 3 min, Soft rhythm, medium Circle Size, and Warm sound are the first-run defaults so the first session feels short, gentle, visually balanced, and warm when audio is allowed.
- **Session resume (60s window)** — exiting a session shows an exit guard; sessionStorage holds state for 60s so accidental exits don't lose progress.
- **Resume directly below Begin** — when a resumable session exists, the continuation action sits next to the primary start action before Session Setup.
- **Session Setup disclosure** — one quiet drawer below Begin/Resume contains Pattern, Visual, and Audio settings after the visitor has completed at least one local session. If localStorage is unavailable, show setup rather than trapping the user in defaults.
- **Persistent phase instruction** — the HUD instruction remains visible after cycle 2. Low-vision phone feedback showed that hiding the instruction can make the session visually unusable even when the user can otherwise use a phone.

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
- Amber only on session complete — nowhere else. The Hold phase marker uses `PHASE_COLORS.hold`, not the closure amber.
- Phase colors outside the active canvas are limited to tiny semantic markers in rhythm, Circle Size, Sound, and Practice History surfaces.
- Only `font-thin/extralight/light/semibold` (100/200/300/600) — no `font-normal`
- No `italic` anywhere in the interface
- No `box-shadow` for structural elevation. Static orb marks also avoid colored glow shadows; luminous phase light belongs inside the session canvas.
- Session controls (Pause, Exit) at bottom corners — never top of screen on mobile
- Dialog/guard backdrops use tinted forest-night scrims such as `rgba(15,23,18,0.85)` — never pure black and never a colored accent
