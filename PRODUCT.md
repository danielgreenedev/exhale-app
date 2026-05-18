# Exhale — Product Context

## Register

product

## Users

Primary: people who do not use self-care apps. Skeptical of wellness software, low tolerance for friction, will leave at the first sign of complexity or obligation. They arrive stressed or curious, not motivated. They may never have heard of "breathwork."

Secondary: people with existing breathwork or meditation experience. They know what they want, can navigate without hand-holding, and will use the app efficiently if it stays out of their way.

Design for the primary user. Don't break the experience for the secondary.

## Product Purpose

Exhale is a guided breathing tool for learning paced breathing as an anxiety coping skill. It exists to make an anxiety-sensitive 4-4-6-4 breathing pattern accessible to anyone, regardless of prior experience or motivation.

Success: a first-time user completes a session without being confused, and returns voluntarily.

No required account, no onboarding gate, no premium framing. The product should be ready to use in two taps from landing.

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
6. **Sync is optional.** Email sync exists only inside Practice History, only after the user chooses it, and only to carry history and preferences between devices. It includes practice history, timer length, Circle Size, and sound choice. It must never appear before a first session or become a condition for breathing.

## Real User Feedback

Recent hands-on browser feedback exposed where the product promise breaks down fastest:

- If a selector looks clickable but does not change state, the user reads the app as stuck. Session length and Circle Size controls must use robust form semantics, clear selected states, and full hit areas around both text and icon targets.
- If Begin leads to a blank or static screen, trust is lost immediately. The game route must always render a visible first state: the settle prompt, the orb canvas, and then the live breathing phases.
- If the breathing page appears stuck on Inhale, the guide has failed its core job. The phase label, countdown, orb scale, sound cue, color wash, and progress rings must all advance from the same session state.
- If the orb is missing, the product is missing. The orb, background motion, and audio affordance are not decorative extras; they are the primary teaching surface.
- Alignment issues on secondary controls still matter because they signal care. Practice History and other optional actions should feel centered, calm, and intentionally secondary.
- Background sound should support regulation without demanding taste or attention. Keep sound optional, synthesized, and easy to turn off; palettes should feel like environments, not songs.
- Cross-device history needs its own sign-in step. Email links are single-use and fragile across devices, so the product uses 6-digit email codes for optional sync.

Design implication: future audits should prioritize task completion and state reliability before visual nuance. Exhale can be quiet, but it can never look inert, broken, or ambiguous.

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
- No paywall or premium tier framing in UI copy

## Infrastructure

- Database: Supabase.
- Production host: Vercel.
- Deployment source: GitHub `master`.
- Preview branch: GitHub `preview`, deployed by Vercel as a pre-production branch.
- Public domain: `https://exhale.guide`.
- Optional sync depends on Supabase email OTP codes. The email template should visibly include the 6-digit token.

## Accessibility & Inclusion

Target: WCAG 2.1 AA.

Already implemented:
- `prefers-reduced-motion`: orb breathe animation and canvas particle system are skipped
- Keyboard shortcuts: Space (pause/resume), Esc (exit guard), F (fullscreen toggle)
- ARIA live regions on phase label and cycle counter
- `role="timer"` on countdown, `role="progressbar"` on session bar
- Radio group keyboard navigation (arrow keys) on session picker
- All interactive elements have `aria-label`

Known gaps:
- Color contrast: some UI text at reduced opacity (white/28–38) may fall below 4.5:1 against #090c0a; has not been formally audited
- Canvas content (orb, phase rings, particles) is not accessible to screen readers; the phase label ARIA live region is the accessible equivalent
- Session resume window (60s) has no extension mechanism for users who need more time
