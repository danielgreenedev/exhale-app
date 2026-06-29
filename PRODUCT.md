# Exhale — Product Context

## Register

product

## Users

Primary: people who do not use self-care apps. Skeptical of wellness software, low tolerance for friction, will leave at the first sign of complexity or obligation. They arrive stressed or curious, not motivated. They may never have heard of "breathwork."

Secondary: people with existing breathwork or meditation experience. They know what they want, can navigate without hand-holding, and will use the app efficiently if it stays out of their way.

Design for the primary user. Don't break the experience for the secondary.

## Product Purpose

Exhale is a guided breathing tool for learning paced breathing as an anxiety coping skill. It exists to make anxiety-sensitive paced breathing patterns accessible to anyone, regardless of prior experience or motivation.

Success: a first-time user completes a session without being confused, and returns voluntarily.

No required account, no onboarding gate, no premium framing. The product should be ready to use in two taps from landing.

Exhale is free by default. Monetization is conditional, deferred, and must never reduce the usefulness of the free breathing tool.

## Brand Personality

Quiet, warm, accessible.

Voice: calm, inviting, undemanding. Language is simple, lowercase-friendly, sparse. No urgency, no celebration, no gamification copy. Reflection over achievement. The app speaks like a quiet room, not a productivity tool.

Emotional goal: the user should feel held, not guided. The orb teaches through movement; copy never explains what the orb already shows.

## Anti-references

- Headspace / Calm: too branded, too much onboarding, premium-feeling gates
- Fitness apps: streaks as guilt, progress as pressure, badges as obligation
- Meditation apps with teachers, voices, or courses: too much content, too much commitment
- Any app that requires an account before showing value

## Design Principles

1. **Zero friction to first breath.** A new user should be able to start a session in two taps from landing. Every extra step is a barrier for the primary user.
2. **The orb does the teaching.** The orb's movement teaches the pattern without words. Copy explains nothing the orb doesn't already show.
3. **Silence is a feature.** Empty states, pauses, and minimal copy are not gaps; they are the product.
4. **History is optional.** Stats exist for users who want them. They are never surfaced as a primary motivation or a source of pressure. Never on the critical path to breathing.
5. **Every screen feels like the same app.** The emerald orb mark anchors home and stats. Color, type, and spacing are consistent. The amber shift on session complete is the only intentional deviation.
6. **Sign-in is optional.** Google, Apple, and email sign-in exist only to carry history and preferences between devices. Synced data includes practice history, timer length, Circle Size, sound choice, and rhythm. Sign-in must never become a condition for breathing.

## Emotional Arc

Each screen has a deliberate emotional register. New screens or features must fit within this arc or extend it intentionally:

1. **Home** — calm, decisive. One clear action. No pressure.
2. **Game** — immersive, zero decisions. The user is not a user; they are a breather.
3. **Complete** — warm closure. Amber shift. A single quote. Nothing to do.
4. **Stats** — reflective, optional. Never pressuring. The orb mark anchors it to the brand.

## Never Do

These are decisions made and should not be revisited without strong cause:

- No push notifications or reminders
- No social features, sharing, or comparisons
- No audio files: synthesis only (zero load time is part of the low-friction promise)
- No hold-to-breathe interaction during sessions: the orb guides, the user follows
- No mascot, named persona, or illustrated character
- No required account, required login, or sync prompt before breathing
- No profile surface, avatar, password account flow, or auth-first navigation unless future feedback proves optional Google sign-in is insufficient
- No paywall or premium tier framing in UI copy

## Infrastructure

- Database: Supabase.
- Production host: Vercel.
- Deployment source: GitHub `master`.
- Preview branch: GitHub `preview`, deployed by Vercel as a pre-production branch.
- Public domain: `https://exhale.guide`.
- Optional sign-in depends on Supabase Auth with Google, Apple, and email magic-link providers. The visible path must stay inside Practice and footer recovery, never before breathing.
- Auth email runs through Supabase Auth custom SMTP. Email Updates are opt-in only through an unchecked checkbox during sign-in; provider email addresses are not marketing consent by themselves.
- Supabase tables currently used: `breathing_sessions`, `user_settings`, `app_events`, `email_update_subscriptions`, and `quotes`.

## Roadmap Posture

The roadmap is evidence-gated. Stage 0 is still validation: recruit roughly 10 to 20 testers from the target audience, watch completion/return/drop-off signal, and avoid broad feature expansion until retention signal is real.

Stage 1 is ship-quality polish: accessibility, discoverability and SEO optimization, privacy/terms, theme polish, and beta-driven refinements. The Garden skin and High Visual Contrast / Large Text or voice cues are candidates, not defaults.

Stage 2 is distribution: Android Trusted Web Activity after polish and discoverability work; iOS remains a PWA-first path unless reception justifies native App Store cost.

Stage 3 is conditional operations and monetization. If a small admin/support panel becomes necessary, the preferred first version is a protected Next.js route backed by Supabase, not Payload. First useful scope: synced-user deletion/support lookup, beta/tester event review, retention/drop-off summaries, and lightweight content management for quotes or themes. Revisit Payload only if CMS-style editing grows beyond what a small custom panel should own.

## Beta Handoff

For the current beta round, use `https://exhale.guide`. Capture anonymized notes in `docs/USER_FEEDBACK.md`, then move accepted work into `docs/TODO.md`. Use a Vercel preview only when a future test needs changes that should not be visible on production yet.

## Accessibility & Inclusion

Target: WCAG 2.1 AA.

Already implemented:
- `prefers-reduced-motion`: orb breathe animation and canvas particle system are skipped
- Keyboard shortcuts: Space (pause/resume), Esc (exit guard), F (fullscreen toggle)
- ARIA live regions on phase label and cycle counter
- `role="timer"` on countdown, `role="progressbar"` on session bar
- Radio group keyboard navigation (arrow keys) on session picker
- All interactive elements have `aria-label`
- Low-vision HUD hardening: larger mobile phase labels, no visible sentence overlay on the orb, stronger timer contrast, stronger dark text edge, a local contrast backplate, and `prefers-contrast: more` canvas simplification

Known gaps:
- Color contrast: some decorative or secondary UI text at reduced opacity may fall below 4.5:1 against #0f1712; content text should stay at 55% Still White or stronger
- Canvas content (orb, phase rings, particles) is not accessible to screen readers; the phase label ARIA live region is the accessible equivalent
- Session resume window (60s) has no extension mechanism for users who need more time
- Same-device validation is still owed for the 97-year-old low-vision phone tester. If the default HUD hardening is not enough, promote optional High Visual Contrast / Large Text mode or voice cues from candidate to implementation
