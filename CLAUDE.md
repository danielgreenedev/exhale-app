# Exhale

Guided breathing app built with Next.js 16, React 19, TypeScript, Tailwind CSS v3.

## Mission

To allow anyone to learn paced breathing as an anxiety coping skill.

## Target Audience

People who don't use self-care apps. The goal is as low friction and as few obstacles as possible to participating. It should also be usable for anyone, including people with existing breathwork experience.

This means: no sign-up, no accounts, no onboarding gates, no streaks that guilt, no complexity that intimidates. Every screen should feel like an invitation, not a requirement.

## Core Mechanic

Selectable breathing rhythm exposed inside Session Setup on the home screen. Three options, default Standard:

- **Standard** — 4-4-6-8 (22s cycle). Default for first-time users.
- **Gentle** — 3-2-4-4 (13s cycle). Shorter cycle with a lighter hold; for capacity-constrained users.
- **Full** — 6-6-10-4 (26s cycle). Longer inhale, hold, and exhale; for experienced breathwork users.

Fully guided, with no user input needed during a session. Session lengths: quick (~3m), short (~5m), medium (~7m), long (~10m). Cycle counts are recalibrated per rhythm so each minute label stays close to its target across all three patterns.

The rest phase in Standard is intentionally long enough to allow a normal breath, yawn, or soft reset before the next inhale. Gentle and Full reshape that balance for their respective audiences.

## Stack

- `src/app/page.tsx` — home/menu screen
- `src/app/game/page.tsx` — active session screen
- `src/app/stats/page.tsx` — practice history screen
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` — quiet policy pages (not linked from main UI yet)
- `src/components/BreathingOrb.tsx` — canvas orb, particles, progress rings; rhythm-aware
- `src/components/GameHUD.tsx` — in-session HUD overlay; rhythm-aware
- `src/components/SessionComplete.tsx` — end-of-session screen
- `src/hooks/useBreathingSession.ts` — RAF-based session state machine; accepts rhythm
- `src/hooks/useAudioEngine.ts` — Web Audio API synthesis (no external files); rhythm-aware breath filter ramp
- `src/hooks/useSessionStats.ts` — localStorage + Supabase session persistence
- `src/lib/breathing.ts` — RHYTHMS registry, phase configs, session lengths, easing math
- `src/lib/sound.ts` — sound palette labels and storage IDs
- `src/lib/auth.tsx` — anonymous-first auth with optional email upgrade
- `src/lib/supabase.ts` — browser Supabase client singleton
- `src/lib/settingsSync.ts` — local/cloud round-trip for orb scale, sound, session length, rhythm
- `src/lib/sessionSync.ts` — local/cloud session merge helpers (dedup-aware)
- `src/lib/appEvents.ts` — Supabase event logging for email-synced users

## Design Principles

- **Friction is the enemy.** Every extra tap, label, or decision is a barrier for the target user. Cut before adding.
- **The orb is the product.** All UI is secondary to the breathing experience on the canvas.
- **Calm over clever.** No animations for their own sake. Motion should reinforce breathing rhythm.
- **Dark, minimal, emerald accent.** Amber only on session complete (signals closure). No other accent colors.
- **No guilt mechanics.** Stats and streaks are for reflection, not pressure.

## Audio System

Web Audio API synthesis only — no external audio files. Zero load time, works offline.

- Ambient drone: 174Hz
- Phase tones (Solfeggio frequencies): 528Hz inhale, 432Hz hold, 396Hz exhale, 285Hz rest
- Autoplay policy is already handled: attempts auto-start, falls back to first user interaction

## Phase Colors

These shift the entire canvas (orb, glow, rings, particles) during a session:

- Inhale: `hsl(198, 45%, 63%)` — blue
- Hold: `hsl(40, 55%, 61%)` — orange
- Exhale: `hsl(148, 35%, 53%)` — green
- Rest: `hsl(348, 42%, 66%)` — pink

Amber (`hsl(38, 92%, 65%)` approx) appears only on the session complete screen — it signals closure, not phase.

## localStorage Keys

Do not reuse these keys for new features:

| Key | Storage | Purpose |
|-----|---------|---------|
| `exhale-stats` | localStorage | Session records array |
| `exhale-orb-scale` | localStorage | Circle size preference (0.75 / 1.0 / 1.25) |
| `exhale-sound-palette` | localStorage | Sound palette preference (`air` / `warm` / `low` / `quiet` / `off`; labels are Air / Warm / Deep / Still / mute) |
| `exhale-session-length` | localStorage | Last picked session length (`quick` / `short` / `medium` / `long`) |
| `exhale-rhythm` | localStorage | Last picked breathing rhythm (`standard` / `gentle` / `full`) |
| `exhale-visited` | localStorage | First-visit flag (cleared = first visit) |
| `exhale-resume` | sessionStorage | In-progress session state, 60s TTL |

## Supabase Data

Supabase is optional from the user's point of view and only appears through Practice History sync.

| Table | Purpose |
|-------|---------|
| `breathing_sessions` | Cloud practice history |
| `user_settings` | Timer length, Circle Size, sound choice, and rhythm |
| `app_events` | Lightweight counts for timer selection, session start, early exit, and completion |
| `quotes` | Rotating inspirational quotes for the session complete screen (read-only via RLS) |

## Key UX Decisions

These are intentional — don't undo them without understanding the rationale:

- **No user input during a session** — fully guided, not hold-to-breathe. Reduces intimidation for first-timers who don't know when to inhale.
- **Abstract orb** — chosen over thematic visuals (ocean, lantern, mandala). More universal, less culturally loaded, works for any user.
- **Selectable rhythm (Standard / Gentle / Full)** — added after five of six recent beta testers reported rhythm-fit concerns across a range of capacities and preferences. Default stays Standard 4-4-6-8; alternates are accessibility-oriented, not preference-oriented. Rhythm is locked at session start; it does not change mid-session.
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
- No `box-shadow` for structural elevation — orb glow only
- Session controls (Pause, Exit) at bottom corners — never top of screen on mobile
- Dialog/guard backdrops use `rgba(0,0,0,0.65)` — never a colored tint
