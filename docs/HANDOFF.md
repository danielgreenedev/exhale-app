# Codex Handoff

Last updated: 2026-05-20 (commit prep: Session Setup polish, local auth QA cleanup, social preview notes, background-tab audio fix)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`.
- Current working tree contains a commit-ready beta-polish batch. It has not been committed yet at the time this handoff was written.
- Verification passed on May 20, 2026: `npm.cmd run lint`, focused Jest smoke tests, full Jest, `npm.cmd run build`, and a Playwright smoke check for Session Setup on the local preview.
- `next-env.d.ts` may be rewritten by `next build`; restore it to the checked-in dev routes import before committing if it changes.

## Current Batch Summary

- **Session Setup distilled.** The drawer is split into `Sequence`, `Visual`, and `Audio` tabs. Sequence uses the instructional label `Choose your pace`; Visual contains Circle Size; Audio uses the clearer label `Background sound`.
- **Pace labels simplified.** User-facing pace names are now Steady, Soft, Full, and Flow. Internal ids remain `standard`, `gentle`, `full`, and `flow` for storage compatibility.
- **Timing details hidden by default.** The compact pace tiles are label-only; the helper row carries short human-facing descriptions. Detailed phase timing is behind a secondary `View timing` button with a disclosure caret.
- **Audio choices clarified.** Off is now a visible radio option instead of an icon-only mute control. Sound previews still fade out and announce to screen readers.
- **Background-tab audio fixed.** `useAudioEngine.scheduleAmbientStop` schedules the ambient fade-out against the Web Audio clock, and `game/page.tsx` schedules that stop at the guided-session deadline.
- **Local visual QA quieter.** `AuthProvider` skips Supabase anonymous auth on `localhost` / `127.0.0.1` in development unless `localStorage.setItem('exhale-enable-local-supabase', '1')` is set.
- **Social preview playbook updated.** Facebook is resolved as a Meta cache/parser delay; Discord and Telegram previews worked after crawler/firewall allowances.
- **Playwright added as a dev dependency.** This supports local browser QA scripts without relying on the bundled REPL package resolution.

## Key Functional State

- **Anticipatory phase cue.** `PHASE_LOOKAHEAD_SECONDS = 0.8` is still the ceiling. `getPhaseLookahead(phase)` returns `Math.min(0.8, phase.duration * 0.25)`, so short phases such as Soft Hold and Flow Relax get a 0.5s lead. No HUD text cue is shown.
- **Fourth phase: Relax.** The user-facing label is `Relax` with instruction `Breathe`; the internal phase enum remains `'rest'`.
- **Four visible paces.** Steady (4-4-6-8), Soft (3-2-4-4), Full (6-6-10-4), and Flow (4-0-6-2). Flow's zero-duration Hold is skipped by `getPhaseAtTime` and `getNextPhase`.
- **Session Setup is optional.** The first-breath path remains time selection plus Begin. Session Setup stays collapsed by default.
- **Practice History remains secondary.** It appears only after at least one completed session exists.

## Feedback Mode

The project is still in beta feedback collection. Current brand-new-user prompts live in `docs/USER_FEEDBACK.md`; key themes still waiting on more signal are:

- Whether Soft or Full fits rhythm-concern testers better than Steady.
- Whether Flow solves the Rest/Hold friction for testers who disliked interruption.
- Whether anticipatory color/audio cues make transitions easier or add noise.
- Whether Session Setup labels and explanations feel natural to brand-new users.

## Parked Questions

- OAuth alongside email-code sync for Practice History.
- Progressive/ramping rhythms if a second tester independently asks for escalation.
- Garden skin/theme work, including possible color customization, after feedback intake.
- A stronger visual treatment for Session Setup tab-panel titles, if tester feedback suggests users are missing the first line in each tab.

## Do Not Revert / Preserve

- `rhythmRef` locking in session/audio/orb code: rhythm is intentionally fixed at session start.
- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`: used by the guide-ring lead and audio pre-cue.
- The internal `'rest'` enum: user-facing copy says Relax, but storage/runtime discriminators stay stable.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Local-only auth bypass on localhost unless deliberately testing Supabase sync.

## Recommended Next Step

Commit the prepared beta-polish batch once the project owner has manually glanced at Session Setup and, if possible, manually tested the Chrome background-tab audio fix.
