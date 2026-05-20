# Codex Handoff

Last updated: 2026-05-20 (pre-commit audit follow-up)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`.
- Current working tree contains a mobile polish / feedback documentation checkpoint after the OAuth commit.
- Verification passed on May 20, 2026: `npm.cmd run lint`, `npm.cmd test -- --runInBand`, `npm.cmd run build`, and a mobile Playwright smoke on Home plus `/game?length=quick&rhythm=full&orb=0.75&sound=off`.
- `next-env.d.ts` may be rewritten by `next build`; restore it to the checked-in dev routes import before committing if it changes.

## Current Batch Summary

- **Google Backup & Sync started.** Practice History now offers `Continue with Google` as a sibling to email-code sync, framed under `Backup & Sync`.
- **Anonymous-first preserved.** Home and session flow remain ungated. Google sync uses Supabase `linkIdentity()` first when a Supabase session already exists, so anonymous cloud rows can remain under the same user id where Supabase allows it.
- **Provider setup still required.** Supabase Google provider, manual identity linking, redirect allow-list entries, and Google Cloud OAuth settings still need dashboard configuration before live OAuth testing.
- **Policy pages updated.** `/privacy` and `/terms` now describe optional email/Google Backup & Sync, exact synced data, third-party provider involvement, deletion path, and the promise that sign-in is never required to breathe.
- **Deployment docs updated.** `docs/DEPLOYMENT.md` now includes the Google OAuth setup checklist and cross-device sync acceptance checks.
- **Feedback mode continues.** The project is still collecting beta signal on rhythm fit, Flow pause friction, transition cues, and Session Setup clarity.
- **Mobile legibility and sound trust pass completed in this checkpoint.** Home spacing, in-session label contrast, Settle In styling, iPhone silent-mode hinting, and suspended-Web-Audio handling were tightened after marketing/UX feedback.
- **Visual cue hierarchy adjusted.** Graphic-designer feedback on Full showed the center orb felt relaxing, but the outer guide line could feel like the user was already behind. The guide line and incoming cue should stay softer than the orb.
- **Impeccable audit follow-up applied.** Static orb marks now avoid colored glow box-shadows, body/sentence tracking is calmer, and pure-black shadow/scrim values were replaced with tinted forest-night values. `DESIGN.md` and `CLAUDE.md` were updated to preserve those rules.
- **Audit status.** The rerun cleared the neon/static-glow and wide-body-tracking findings. One pure-black scanner warning still appears despite source/computed visible styles using tinted Forest Night (`#0f1712`), so treat that as a residual audit false positive unless a visible pure-black surface is found.

## Key Functional State

- **Four visible paces.** Steady (4-4-6-8), Soft (3-2-4-4), Full (6-6-10-4), and Flow (4-0-6-2). Flow's zero-duration Hold is skipped by `getPhaseAtTime` and `getNextPhase`.
- **Fourth phase: Relax.** The user-facing label is `Relax` with instruction `Breathe`; the internal phase enum remains `'rest'`.
- **Anticipatory phase cue.** `PHASE_LOOKAHEAD_SECONDS = 0.8` is still the ceiling. `getPhaseLookahead(phase)` returns `Math.min(0.8, phase.duration * 0.25)`. No HUD text cue is shown.
- **Cue hierarchy.** The center orb is the primary timing object. The outer guide ring is a quiet pre-cue/support signal, not the thing users should chase.
- **Static orb marks.** Home, stats, policy, terms, complete, and app icons use muted radial fills plus low-opacity outline rings. Avoid reintroducing `emerald-300`, `#6ee7b7`, or colored `box-shadow` on static orb marks.
- **Background-tab audio fix.** `useAudioEngine.scheduleAmbientStop` schedules the ambient fade-out against the Web Audio clock, and `game/page.tsx` schedules that stop at the guided-session deadline.
- **Local visual QA quieter.** `AuthProvider` skips Supabase anonymous auth on `localhost` / `127.0.0.1` in development unless `localStorage.setItem('exhale-enable-local-supabase', '1')` is set.

## OAuth Setup Remaining

1. Enable Google provider in Supabase Auth.
2. Add Google client ID and client secret to Supabase.
3. Enable manual identity linking in Supabase so `linkIdentity()` can convert anonymous users.
4. Add Supabase redirect allow-list URLs for production, local, and any preview environment used for testing.
5. Add Google Cloud authorized origins and the Supabase callback redirect URI.
6. Test Google Backup & Sync with the local Supabase flag enabled or on preview.
7. Confirm a second device restores practice history, timer length, Circle Size, sound choice, and rhythm.

## Feedback Mode

Current brand-new-user prompts live in `docs/USER_FEEDBACK.md`; key themes still waiting on more signal are:

- Whether Soft or Full fits rhythm-concern testers better than Steady.
- Whether Flow solves the Rest/Hold friction for testers who disliked interruption.
- Whether Flow should become inhale/exhale only if a second tester confirms the 2-second pause feels interruptive.
- Whether anticipatory color/audio cues make transitions easier or add noise.
- Whether the softened guide line makes the orb feel clearly primary.
- Whether Full's 10-second exhale needs clearer expectation-setting for resting vs stressed states.
- Whether Session Setup labels and explanations feel natural to brand-new users.

## Parked Questions

- Apple Sign-In as a later privacy-aligned provider if testers ask for it.
- Progressive/ramping rhythms if a second tester independently asks for escalation.
- Garden skin/theme work, including possible color customization, after feedback intake.
- A stronger visual treatment for Session Setup tab-panel titles, if tester feedback suggests users are missing the first line in each tab.

## Do Not Revert / Preserve

- `rhythmRef` locking in session/audio/orb code: rhythm is intentionally fixed at session start.
- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`: used by the guide-ring lead and audio pre-cue.
- The internal `'rest'` enum: user-facing copy says Relax, but storage/runtime discriminators stay stable.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Local-only auth bypass on localhost unless deliberately testing Supabase sync.
- Backup & Sync framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.

## Recommended Next Step

Configure Supabase/Google OAuth, then do a real cross-device Backup & Sync test before considering the OAuth item done.
