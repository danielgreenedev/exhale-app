# Codex Handoff

Last updated: 2026-05-20 (late evening — proportional anticipation cap, regression smoke tests, TS cleanup, policy footer)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- `master` and `preview` are at the same head on origin and locally. No divergence.
- Working tree was clean when this doc was written; if you see uncommitted changes, they are from after this handoff.
- Test/typecheck/lint status: 104/104 pass; `npx tsc --noEmit` clean (the pre-existing appEvents spread-args error is fixed); `npx eslint src` silent.

## What Shipped Recently

Commits since the last major handoff, oldest to newest:

- `fe3502a` — **Flow rhythm shipped (4-0-6-2, 12s cycle).** `'flow'` added to `RhythmId`, `isRhythmId`, and `RHYTHMS` in `src/lib/breathing.ts`. `getNextPhase` skips zero-duration phases so anticipation cues stay correct. Session Setup rhythm picker is now a 4-column grid. Pre-merge validation gate was waived in favor of post-launch tester signal collection.
- `e30873b` — Canonical docs (CLAUDE.md, DESIGN.md, TODO.md, OPEN_QUESTIONS.md) updated to reflect Flow as a fourth preset.
- `2785803` — **Proportional anticipation cue cap.** New `getPhaseLookahead(phase)` helper returns `Math.min(0.8, phase.duration * 0.25)`. Long phases keep the full 0.8s lead; Gentle Hold (2s) and Flow Relax (2s) now get a 0.5s lead so the cue never occupies 40% of the phase. `useBreathingSession` (two call sites) and `BreathingOrb` updated to use the helper. CLAUDE.md and DESIGN.md updated with the new formula and concrete per-rhythm values.
- `f056a9b` — **Smoke test for the cap.** 8 new tests in `useBreathingSession.test.ts` verify the lead window opens at the right moment per rhythm and per phase. Catches anyone reverting `getPhaseLookahead` or breaking `getNextPhase`'s zero-skip.
- `9f620bb` — **Full Exhale regression guard.** Tight `toBeCloseTo(0.375, 2)` assertion that Full Exhale (10s, the imperceptibility-risk phase at 8%) keeps the full 0.8s lead. Catches any future "improvement" that silently shrinks the lead on long phases.
- `c82b396` — Pre-existing TS spread-args error in `src/__tests__/appEvents.test.ts` fixed. The mocked `supabase.from` now has an explicit `(_table: string)` parameter matching the real signature.
- `55fd8fd` — **Quiet privacy/terms footer (TODO 9 closed).** New `src/components/PolicyFooter.tsx` component mounted on home, session complete, and stats. 10px uppercase tracking-wide text at 45% white opacity; 75% on hover. Surfaces `/privacy` and `/terms` (which have existed but weren't linked from the main UI).

## Key Functional State (Reference, Not Recent Changes)

- **Anticipatory phase cue.** `PHASE_LOOKAHEAD_SECONDS = 0.8` ceiling in `src/lib/breathing.ts`, with `getPhaseLookahead(phase)` returning the per-phase effective window. `useBreathingSession` returns `nextPhase`, `phaseLeadProgress` (0-1), and `timeUntilPhaseEnd`. `BreathingOrb` guide ring crossfades to next-phase color; `useAudioEngine.playAnticipationCue` plays a quiet pre-cue. No HUD text cue (a `Next [phase]` experiment was removed because it competed with the central phase label).
- **Fourth phase: "Relax" with instruction "Breathe".** Phase enum stays `'rest'` as the internal discriminator. All user-facing surfaces flow from `PhaseConfig.label` / `PhaseConfig.instruction`.
- **Four rhythms.** Standard (4-4-6-8 default), Gentle (3-2-4-4), Full (6-6-10-4), Flow (4-0-6-2). Flow's zero-duration Hold is skipped at runtime by `getPhaseAtTime` (strict less-than) and `getNextPhase` (proportional skip).
- **Visual coherence pass shipped (e2a7c4c).** Innermost phase progress ring removed. Countdown opacity is phase-aware: 0.62 on Hold/Relax, 0.16 on Inhale/Exhale, full opacity during cycle-1 teaching. Phase-transition flash scales by phase duration with a 35% floor.

## What's Mid-Flight (For You or the Project Owner to Pick Up)

1. **Post-launch validation for Flow (Stage 0 item 2).** Flow shipped without the pre-merge tester pilot. Follow up with T-2026-05-19-03, -05, -06, -07 to confirm Flow fits better than their current choice. If at least one prefers Flow, the Rest/Hold question is fully answered. If none do, revisit whether the shape was wrong (4-0-6-0 or 4-0-5-3 from the sketch's alternatives in `docs/OPEN_QUESTIONS.md`) or whether free per-phase customization is needed. **Project owner has sent a feedback-question list to a graphic designer + several others (2026-05-20); responses expected over the next day or two.**

2. **OAuth-vs-OTP for Practice History sync** is parked as an open question. Lean is add Google Sign-In alongside existing OTP (not replace), pilot with beta testers, defer Apple. No implementation work scheduled — wants a tester pilot decision first. See `docs/OPEN_QUESTIONS.md`.

## Visual Verification Needed (Eyes Only — Codex If You Have Browser Access, Otherwise Project Owner)

Five visual gaps that can't be closed by code or tests. If Codex has browser access on the user's machine, these are good candidates. If not, they're for the project owner.

1. **Anticipation cue feel check at the new 0.5s cap.** The proportional cap shipped on 2026-05-20 takes Gentle Hold and Flow Relax leads from 0.8s to 0.5s. The math says the lead is no longer in the 40% jitter zone, but whether 0.5s of fading guide-ring color actually registers as "approaching transition" or as a flicker that's gone before the user notices is an eye question. Audio sync at the shorter window also needs an ear. **This is the most load-bearing visual check** because it directly validates today's shipped change.

2. **Flow rhythm orb transition smoothness.** Flow has the orb jump from end-of-Exhale (0.45 scale) straight to next-Inhale (0.45 → 1.0) with only a 2s Relax in between and a zero-duration Hold. Tests confirm phase ordering is correct; whether the visual jump feels "freeing" or "abrupt" is unanswered.

3. **Flow tile at mobile width.** The rhythm picker is now a 4-column grid. Each tile gets ~65px on the 288px mobile container. The math says "Flow" / "Open" should fit, but visual crowding and tap-target comfort on a real phone needs hands.

4. **Full Exhale imperceptibility verification.** The regression guard locks the 0.8s lead, but the underlying concern — that 8% of phase is too brief to register — was never visually confirmed. Could already be invisible in production. If imperceptible, the fix is a floor formula (e.g., scale the lead's visual opacity up on long phases), which is a separate change.

5. **Visual coherence pass net effect.** Phase ring removal, phase-aware countdown opacity, and flash dampening shipped together (e2a7c4c). The HUD intent was "calmer canvas without losing how-long signal." Whether it now feels coherent, sparse, or oddly empty needs a browser session, not a unit test.

## Open Questions Status

- **Active**: "Should Rest and Hold be partly or completely optional?" — partially answered by Flow shipping. Full answer waits on tester follow-up (mid-flight item 1).
- **Parked**: progressive/ramping rhythms (single signal from T-2026-05-19-07), color/theme customization beyond Garden (single signal from T-2026-05-19-07 follow-up), OAuth-vs-OTP (waiting on tester pilot).
- **Recently answered**: "Is Facebook preview worth more attention?" closed when Meta cache aged out (playbook preserved in `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md`).

## Tester Signals Recently Captured

Verbatim entries in `docs/USER_FEEDBACK.md`:

- **T-2026-05-19-06** (Facebook): Hold is the hardest part; exhale-to-inhale ratio reads as abrupt.
- **T-2026-05-19-07** (Facebook): Likes Hold and slow Exhale; rests feel awkward; competitive interest in progressive escalation. Same tester reports a teenager liked the simple UI and wondered about color customization.
- **T-2026-05-19-08** (graphic designer, professional eye): Phase progress shown three ways at once; flash strobes on short phases. Drove TODO 6c (the visual coherence pass). Weight as design-coherence input, not target-audience signal.

A new feedback round was sent out 2026-05-20 to the graphic designer plus several others, asking:

```text
Did the Relax/Rest period help you reset, or did it feel like it interrupted the breathing rhythm?
Did the color lead or soft pre-cue make the phase changes easier to follow, or did they add noise?
Did the rhythm ever make you feel like you had to gasp, catch up, or strain?
Would you use Exhale again when you felt stressed, tired, or needed to settle?
```

Responses expected over the next day or two. When they come in, slot them into the open questions above and `docs/USER_FEEDBACK.md`.

## Do Not Revert / Preserve

- **Vercel firewall bypass rules for Meta IP ranges** and the **`robots.txt` allowances** for Meta/Facebook/LinkedIn/Twitter crawlers stay in place even though the Facebook preview issue is resolved. Belt and braces.
- **`nextPhase` and `phaseLeadProgress` on `useBreathingSession`** are still consumed by `BreathingOrb` (guide ring lead) and `useAudioEngine` (anticipation cue) even though the HUD text cue was removed.
- **`getPhaseLookahead` cap behavior**: shipping a "remove the cap" or "tighten the ceiling" change would silently worsen the imperceptibility on Full Exhale. The regression guard test in `useBreathingSession.test.ts` should fail loudly if anyone tries.
- **Settle-In 8-second buffer**, **cycle-2 instruction-fade rule**, **60-second resume window**, **Pause/Exit at bottom on mobile**, **mute control 44px touch target**, **rhythmRef locked at first render**: all intentional. See `CLAUDE.md` Key UX Decisions.
- **`'rest'` phase enum**: stays as the internal discriminator even though user-facing label is "Relax". Renaming the enum would force a Supabase column rename and break sessionStorage resume.

## Recommended Next Concrete Step

The engineering surface is in a clean idle state. Most remaining work is feedback-dependent or eyes-only:

- **If you have browser access**: knock out the five visual verification items above. #1 (anticipation cue feel at 0.5s) is the most load-bearing.
- **If not**: stand down on engineering and let the in-flight feedback round arrive.
- **For follow-up implementation work**: nothing scoped beyond what the feedback might surface. Garden skin (TODO 7) is the next sizable design piece and benefits from a fresh `/impeccable shape` pass before starting.
