# Codex Handoff

Last updated: 2026-05-20 (Claude pickup after Codex's visual-coherence pass landed locally)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- `master` and `preview` are both at the same head on origin and locally. No divergence.
- Working tree was clean when this doc was written; if you see uncommitted changes, they are from after this handoff.

## What Shipped Today

Today's commits, oldest to newest:

- `f1433b5` through `fef3aa5` — Rhythm registry rollout end to end. `RHYTHMS` registry in `src/lib/breathing.ts` with three rhythms (Standard 4-4-6-8 default, Gentle 3-2-4-4, Full 6-6-10-4). Rhythm threaded through `useBreathingSession`, `BreathingOrb`, `GameHUD`, `useAudioEngine`, and `game/page.tsx` via a locked-at-first-render `rhythmRef`. localStorage `exhale-rhythm` plus Supabase `user_settings.rhythm` (migrations 002, 003). 11 new tests.
- `e31206e` — Polish from `/impeccable critique` (home page 36/40). Renamed third rhythm `slow` to `full`. Added per-rhythm one-word `summary` field. Practice History link hidden until first completed session. Tile sub-label styling unified.
- `746e12d` — Apply `/impeccable audit` recommendations (codebase 19/20). P1 contrast bumps (SessionComplete quote attribution, stats sync copy). P3 debounced cloud writes (400ms trailing). P3 particle count scaling (22 below 600px viewport). P3 iOS PWA Add-to-Home-Screen tip on /stats.
- `235ac1c` — Integrate today's work into the docs (CLAUDE / DESIGN / ROADMAP / TODO / OPEN_QUESTIONS).
- `c9edf0e` — Polish social preview metadata (Codex authored).
- `d9c3b3f` — Anticipatory phase cue, Relax phase reframe, and Rest/Hold signal capture. Major commit; see "Key Functional Changes" below.
- `9d11751` — Log OAuth-vs-OTP friction question in OPEN_QUESTIONS.md.
- `d205b67` — Close Facebook preview issue (Meta cache aged out; no app-side fix needed).
- `f959b7e` — Flow rhythm design sketch + ARIA sweep fix. Design proposal for the Hold-less rhythm landed in OPEN_QUESTIONS.md; CLAUDE.md Phase Colors bullet relabeled "Rest" to "Relax" for parity.
- `cab95ff` — Initial Codex handoff doc (this file, first pass).
- `34ae14c` — Codex's mobile HUD polish + doc cleanup. `GameHUD.tsx` got mobile width/overflow polish: container max-widths, `min-w-0`, responsive instruction text (`text-xs sm:text-sm` with tighter mobile tracking), `leading-relaxed`. Also corrected my Flow sketch's migration claim (Supabase `user_settings.rhythm` is plain text, no migration needed) and the T-2026-05-19-07 framing (they liked Hold and slow Exhale; only Rest is the friction). Deduplicated a stale anticipatory-cue question in OPEN_QUESTIONS.md and added a new "Should Exhale support color or theme customization beyond Garden?" question from a secondary-user signal.
- `0163e34` — Log graphic-designer HUD coherence feedback (T-2026-05-19-08) and add visual-coherence pass as TODO 6c.
- `58e3603` — Second-pass HANDOFF.md update (this file) capturing Codex's mobile polish and the new design signal.
- `e2a7c4c` — Visual coherence pass on the in-session HUD (TODO 6c shipped). Implements all three coordinated changes from T-2026-05-19-08: innermost phase progress ring removed in `BreathingOrb.tsx`, countdown opacity is now phase-aware in `GameHUD.tsx` (0.62 on Hold/Relax, 0.16 on Inhale/Exhale, full opacity during cycle-1 teaching), and phase-transition flash opacity scales by phase duration with a 35% floor so short Gentle phases don't strobe. Bonus mobile padding tweaks on `page.tsx` and `stats/page.tsx`. Smoke-tested Standard, Gentle, and Full at mobile width.

## Key Functional Changes Since Your Last Pass

- **Anticipatory phase cue is live.** `PHASE_LOOKAHEAD_SECONDS = 0.8` in `src/lib/breathing.ts`. `useBreathingSession` returns `nextPhase`, `phaseLeadProgress` (0-1), and `timeUntilPhaseEnd`. `BreathingOrb` guide ring crossfades to the next-phase color during the lead window. `useAudioEngine.playAnticipationCue` plays a quiet pre-cue tone. **There is no HUD text cue**; an earlier `Next [phase]` experiment competed with the central phase label + countdown for attention and was removed. `nextPhase` and `phaseLeadProgress` stay on the hook return so the orb and audio engine still consume them.
- **Fourth phase relabeled.** "Rest" → "Relax" with single-word instruction "Breathe". Phase enum stays `'rest'` as the internal discriminator. All user-facing surfaces flow from `PhaseConfig.label` / `PhaseConfig.instruction`, so aria-live announcements and HUD text update automatically with no consumer changes.

## What's Mid-Flight (For You to Pick Up)

1. **Flow rhythm implementation.** Full design proposal lives in `docs/OPEN_QUESTIONS.md` under "Should Rest and Hold be partly or completely optional?" -> sub-section "Flow rhythm design sketch (2026-05-19)". Primary candidate is **4-0-6-2** (Inhale 4s, no Hold, Exhale 6s, brief Relax 2s). Real code change is small: one-line fix to `getNextPhase` in `src/lib/breathing.ts` to skip 0-duration phases; `getPhaseAtTime` and `getOrbScale` already handle them correctly. Add `'flow'` to the client-side `RhythmId`, `isRhythmId`, settings parser, and tests. Supabase stores `user_settings.rhythm` as plain text with no enum/check constraint, so no database migration is required unless a constraint is intentionally added later. Implementation is **gated behind a tester validation step** - run the sketch past at least two of T-2026-05-19-03, -05, -06, -07 in a preview build before merging; ship as a fourth preset only if at least one prefers Flow over their current choice.

2. **Visual smoke test of the anticipation cue across all three rhythms.** Code is live; needs browser confirmation. The 0.8s lead is a different fraction of each phase: Standard Exhale 13%, Gentle Hold 40% (jitter risk), Full Exhale 8% (imperceptibility risk). If Gentle feels jittery on Hold, scale `PHASE_LOOKAHEAD_SECONDS` proportional to phase duration, e.g. `Math.min(0.8, phase.duration * 0.25)`. Lightweight follow-up if smoke test flags it.

3. **OAuth-vs-OTP for Practice History sync** is parked as an open question. Lean is add Google Sign-In alongside existing OTP (not replace), pilot with beta testers, defer Apple. No implementation work scheduled — wants a tester pilot decision first. See `docs/OPEN_QUESTIONS.md`.

## Open Questions Promoted Today

- **"Should Rest and Hold be partly or completely optional?"** promoted from deferred to **active** after four testers converged on Rest/Hold as friction (T-2026-05-19-03 didn't care for Rest; T-2026-05-19-05 capacity-mismatched/gasping; T-2026-05-19-06 hardest part is Hold + asymmetric exhale-inhale; T-2026-05-19-07 rests awkward + competitive/progressive interest). Flow sketch is the proposed answer.
- **"Could OAuth (Google / Apple Sign-In) be lower-friction than email OTP for Practice History sync?"** — newly added. Distinct from the existing "fuller account system" question because the framing is friction-reduction within an existing optional gate, not adding a new account surface.
- **Parked (single signal so far): progressive/ramping rhythms.** T-2026-05-19-07 asked for each rep to increase in duration. Single user; do not act. See `docs/TODO.md` 6b for the parking criteria.

## Open Questions Answered Today

- **"Is Facebook preview worth more attention?"** — closed. Meta cache aged out; preview renders correctly on current production build. Playbook preserved in `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md` for future cache symptoms.

## Tester Signals Captured Today

Three new tester entries in `docs/USER_FEEDBACK.md` (verbatim quoted, anonymized):

- **T-2026-05-19-06** (Facebook reply): "I think the hardest part for me was the hold and the slower exhale then a short inhale." Two frictions in one sentence — Hold and the asymmetric exhale-to-inhale ratio.
- **T-2026-05-19-07** (Facebook reply): "I liked the hold and slow exhale. The rests were a little awkward. The competitive nature in me likes the idea of the breath, hold, and exhale increasing in duration by the last rep." Likes Hold/slow Exhale, flags Rest/Relax awkwardness, and shows progressive-escalation interest. Same tester later reported a teenager liked the simple UI and customization, and wondered about changing colors; color/theme customization is now parked as an open question.
- **T-2026-05-19-08** (graphic designer, professional eye, annotated screenshot): four observations that cohere as one signal — phase progress is shown three different ways at once (orb scale, countdown number, innermost ring), and the phase-transition flash strobes on short phases. Drives TODO 6c (visual-coherence pass). Weight this entry as design-coherence input, not as "will this user return."

## Do Not Revert / Preserve

- **Vercel firewall bypass rules for Meta IP ranges** and the **`robots.txt` allowances** for Meta/Facebook/LinkedIn/Twitter crawlers stay in place even though the Facebook preview issue is resolved. They cost nothing and prevent regression if Meta cycles crawler IPs.
- **`nextPhase` and `phaseLeadProgress` on `useBreathingSession`** are still consumed by `BreathingOrb` (guide ring lead) and `useAudioEngine` (anticipation cue) even though the HUD text cue was removed. Do not delete them — they look unused on the HUD side but are load-bearing on the orb and audio sides.
- **Settle-In 8-second buffer**, **cycle-2 instruction-fade rule**, **60-second resume window**, **Pause/Exit at the bottom of the screen on mobile**, **mute control at 44px touch target with safe-area padding**, **rhythmRef locked at first render**: all intentional. See `CLAUDE.md` Key UX Decisions for rationale.
- **`'rest'` phase enum**: stays as the internal discriminator. Only the user-facing label changed to "Relax". Do not rename the enum — it would force a Supabase column rename and break compatibility with any in-flight sessionStorage resume data.

## Recommended Next Concrete Step

Two candidates remaining, each a clean scoped piece of work:

- **Implement the Flow rhythm sketch** behind the validation gate. Design is fully worked out in `docs/OPEN_QUESTIONS.md`; the only ambiguity is whether testers actually prefer it. Run past at least two of T-2026-05-19-03, -05, -06, -07 in a Vercel preview, then ship as a fourth preset only if at least one prefers it.
- **Smoke-test the anticipation cue** across all three rhythms in a browser to decide whether `PHASE_LOOKAHEAD_SECONDS` needs to be scaled per phase. Lower-cost than Flow but lower upside; could be folded into the same session as the Flow tester pilot.

If picking one: Flow. It's the higher-leverage answer to four converged tester signals. The smoke test is a nice-to-have that can be done alongside or after.

The visual-coherence pass that was leading this section yesterday shipped in `e2a7c4c`; no further design work pending unless smoke testing reveals an issue.

## Anything Else Worth Knowing

- `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md` was moved to "Resolved" status but kept in full as a playbook for future cache symptoms.
- The pre-existing TypeScript spread-argument issue in `src/__tests__/appEvents.test.ts` is unrelated to today's work; tests still pass at runtime. Untouched.
- All 81 tests pass; `npx tsc --noEmit` clean; `npx eslint src` clean.
