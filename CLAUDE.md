# Exhale

Guided breathing app built with Next.js 15, React 19, TypeScript, Tailwind CSS v3.

## Mission

To allow anyone to learn paced breathing as an anxiety coping skill.

## Target Audience

People who don't use self-care apps. The goal is as low friction and as few obstacles as possible to participating. It should also be usable for anyone, including people with existing breathwork experience.

This means: no sign-up, no accounts, no onboarding gates, no streaks that guilt, no complexity that intimidates. Every screen should feel like an invitation, not a requirement.

## Core Mechanic

4-4-6-4 breathing pattern (inhale 4s → hold 4s → exhale 6s → rest 4s = 18s/cycle). Fully guided — no user input needed during a session. Session lengths: quick (~3m), short (~5m), medium (~7m), long (~10m).

The rest phase was extended from 2s to 4s based on direct user feedback (see below). The original 2s rest caused momentary anxiety in a user with anxiety and bipolar disorder — there wasn't enough time to complete a natural breath before the next inhale began, and the countdown felt rushed rather than restorative. 4s gives the body time to actually rest.

## Stack

- `src/app/page.tsx` — home/menu screen
- `src/app/game/page.tsx` — active session screen
- `src/app/stats/page.tsx` — practice history screen
- `src/components/BreathingOrb.tsx` — canvas orb, particles, progress rings
- `src/components/GameHUD.tsx` — in-session HUD overlay
- `src/components/SessionComplete.tsx` — end-of-session screen
- `src/hooks/useBreathingSession.ts` — RAF-based session state machine
- `src/hooks/useAudioEngine.ts` — Web Audio API synthesis (no external files)
- `src/hooks/useSessionStats.ts` — localStorage session persistence
- `src/lib/breathing.ts` — phase configs, session lengths, easing math

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
| `exhale-sound-palette` | localStorage | Sound palette preference (air / warm / low / quiet / off) |
| `exhale-visited` | localStorage | First-visit flag (cleared = first visit) |
| `exhale-resume` | sessionStorage | In-progress session state, 60s TTL |

## Key UX Decisions

These are intentional — don't undo them without understanding the rationale:

- **No user input during a session** — fully guided, not hold-to-breathe. Reduces intimidation for first-timers who don't know when to inhale.
- **Abstract orb** — chosen over thematic visuals (ocean, lantern, mandala). More universal, less culturally loaded, works for any user.
- **6s settle-in before first breath** — extended from 3.5s based on user feedback: 3.5s wasn't enough time for a grounding first breath before the guided pattern began. The settle-in is the user's moment to transition from "reading the screen" to "being in the session."
- **Session resume (60s window)** — exiting a session shows an exit guard; sessionStorage holds state for 60s so accidental exits don't lose progress.
- **No phase instruction after cycle 2** — the HUD instruction fades; the orb has already taught the pattern by then.

## Accessibility Baseline (Already Built)

Do not remove these without replacement:

- `prefers-reduced-motion`: particles and orb animation skip in `BreathingOrb.tsx`
- Keyboard shortcuts: `Space` pause/resume, `Esc` exit guard, `F` fullscreen toggle
- ARIA live regions on phase label (`aria-live="polite"`) and cycle counter
- `role="timer"` on countdown, `role="progressbar"` on session bar
- Radio group keyboard navigation (arrow keys) on session picker
- All interactive elements have `aria-label`

## Founding User Feedback

The following is unedited first-session feedback from the primary real-world test user. This person has anxiety, bipolar disorder, and formal training in graphic design and UI. Their feedback shaped several core decisions and should be treated as a primary design input — especially any future changes to timing, pacing, or the first-session experience.

> **THE REST:** The rest segment is too short. It either needs to be removed or extended. There isn't enough time to "rest naturally before the next breath." I could hardly get a normal breath in there before it started again. The 2 second(?) countdown felt like I was rushed and made me momentarily anxious. I also could barely read the instruction tag in time before it was over and I didn't even get a chance to do what it said.
>
> You may not even need it. But I would look at actual "timing it" with the breath and see if you can make the natural rhythm of those three sections more in sync to what feels natural and best. (The exhale-into rest-into inhale)
>
> **SESSION STARTING PAGE:** I think once you start a session, the first "Settle in, breathe naturally" is also too short. It needs more time to settle and take a first breath. (There wasn't time for a starting first deep breath) which I feel like you do when you're about to settle into something.
>
> I had to look up what an orb was and took me a few clicks to realize it changed the circle once you started a session. (Cause I clicked to change it from med to sm and nothing happened in reaction to that on that page, but I figured it out.)
>
> **DIAGRAM (add a button):** Is it possible to have a button on the main page that when you click on it, shows you each "page" in the breathing session, so you could learn each action coming, and can read the info without a timer? (Technically it's the same info over and over again so eventually you'd know it.) But it was a little stressful the first time trying to read the information, understand what it said and do it before the timer was up for that "page" — especially the "subtitle/info line."
>
> But I do like the content you have on those lines. That's good. I don't think it's too long or hard to read, just too fast on the slide time. [granted I am a slow reader so it might be just right for the average.]
>
> **WHAT I LIKED:** Overall it's great! I liked the "portfolio" as a whole. The server looks good! I like the button color change and the user centric set up. I like the background music you picked. And the different colors for each circle. I like the colors you picked too. I like the motion of the orb and the number countdown and the top count of how many breaths left in the session/breaths complete. I found the exit and pause button which was great. I think it is really cool.
>
> **BRAINSTORM — new adds:** Might be cool to add a variety of song choices of the different time length options. If someone's going to keep coming back a thousand times. Or if you could set it up where you can pick which song after you pick what time length you want. Plus have a separate button you can listen to all of them to test which one you like best.

**What this feedback already drove:**
- Rest phase extended from 2s → 4s
- Settle-in extended from 3.5s → 6s
- "Orb size" renamed to "Circle size" (the word "orb" was unfamiliar)
- Home screen orb now resizes live when circle size is changed
- "Preview rhythm" button added to home screen (addresses the diagram/learn-before-session request)
- Sound palette picker with Listen preview button added (addresses the music variety request)

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
