# Codex Handoff

Last updated: 2026-05-22 (beta feedback closeout)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`.
- Working tree was clean at the May 22 closeout check.
- Latest commits on `master`: `05cc631 docs: add accessibility cue candidates`, `f81ed88 fix: accept email change sync codes`, and `b85a732 chore: add local impeccable audit wrapper`.
- Verification from the latest code batch passed: `npm.cmd test -- statsSyncCodeLength.test.ts --runInBand`, `npm.cmd test -- --runInBand`, and `npm.cmd run lint`.
- `next-env.d.ts` may be rewritten by `next build`; restore it to the checked-in dev routes import before committing if it changes.

## Current Batch Summary

- **Beta feedback mode continues.** Do not start new features unless feedback clearly promotes them. Current signal is about rhythm fit, Flow pause friction, transition clarity, audio reliability, and first-time understanding of Relax.
- **Rhythm telemetry is live.** `session_started`, `session_complete`, and `session_exited` now include `rhythm` in the `app_events` payload so future Supabase reads can compare completion/drop-off by pace.
- **Resend SMTP is configured through Supabase.** Auth email now sends from `Exhale <no-reply@auth.exhale.guide>` through Resend/Supabase custom SMTP. `docs/DEPLOYMENT.md` records the setup.
- **Email change codes are fixed in-app.** Supabase Change Email Address emails can send 8-digit `{{ .Token }}` codes, so the Backup & Sync UI now accepts the expected 8 digits for link/email-change mode while keeping 6 digits for sign-in mode.
- **Accessibility candidates are parked on the roadmap.** `docs/ROADMAP.md` now lists High Visual Contrast and Voice Cues as Stage 1 accessibility candidates. They are not promoted implementation work yet.
- **Illinois sister feedback logged.** Latest feedback says audio was present but could feel fuller/richer, visual focus was useful, Relax copy was fine but surprising on first appearance, and a pre-start sequence where words appear one at a time may help.
- **Playwright is usable again.** Managed browser install was stuck on Windows due partial/stale cache behavior, but the Playwright Chromium cache was repaired manually and `chromium.launch({ headless: true })` works.
- **Impeccable audit wrapper exists.** Use `npm.cmd run audit:impeccable -- http://127.0.0.1:3000/`; the wrapper sets `PUPPETEER_EXECUTABLE_PATH` to system Chrome so Puppeteer does not fail on a missing cached browser.

## Key Functional State

- **Four visible paces.** Steady (4-4-6-8), Soft (3-2-4-4), Full (6-6-10-4), and Flow (4-0-6-2). Flow's zero-duration Hold is skipped by `getPhaseAtTime` and `getNextPhase`.
- **Fourth phase: Relax.** The user-facing label is `Relax` with instruction `Breathe`; the internal phase enum remains `'rest'`.
- **Anticipatory phase cue.** `PHASE_LOOKAHEAD_SECONDS = 0.8` is still the ceiling. `getPhaseLookahead(phase)` returns `Math.min(0.8, phase.duration * 0.25)`. No HUD text cue is shown.
- **Cue hierarchy.** The center orb is the primary timing object. The outer guide ring is a quiet pre-cue/support signal, not the thing users should chase.
- **Static orb marks.** Home, stats, policy, terms, complete, and app icons use muted radial fills plus low-opacity outline rings. Avoid reintroducing `emerald-300`, `#6ee7b7`, or colored `box-shadow` on static orb marks.
- **Background-tab audio fix.** `useAudioEngine.scheduleAmbientStop` schedules the ambient fade-out against the Web Audio clock, and `game/page.tsx` schedules that stop at the guided-session deadline.
- **Local visual QA quieter.** `AuthProvider` skips Supabase anonymous auth on `localhost` / `127.0.0.1` in development unless `localStorage.setItem('exhale-enable-local-supabase', '1')` is set.

## OAuth Setup Status

- Complete as of 2026-05-20.
- Keep an eye on the existing-email OAuth conflict path during beta: if users hit it, the app should guide them to sign in with email first, then link Google from Backup & Sync.

## Email Delivery Status

- Resend domain: `auth.exhale.guide`.
- From address: `Exhale <no-reply@auth.exhale.guide>`.
- Supabase custom SMTP is configured with Resend. API keys should remain in Supabase/Resend only and should not be committed.
- Next validation: request a fresh Backup & Sync code in incognito or a fresh browser state, confirm delivery from the new sender, enter the full code, and check that sync completes.

## Feedback Mode

Current brand-new-user prompts live in `docs/USER_FEEDBACK.md`; key themes still waiting on more signal are:

- Whether Soft or Full fits rhythm-concern testers better than Steady.
- Whether Flow solves the Rest/Hold friction for testers who disliked interruption.
- Whether Flow should become inhale/exhale only if a second tester confirms the 2-second pause feels interruptive.
- Whether anticipatory color/audio cues make transitions easier or add noise.
- Whether the softened guide line makes the orb feel clearly primary.
- Whether Full's 10-second exhale needs clearer expectation-setting for resting vs stressed states.
- Whether Session Setup labels and explanations feel natural to brand-new users.
- Whether first-time users need a pre-start sequence preview such as `Inhale -> Hold -> Exhale -> Relax`, potentially with each word appearing one at a time.
- Whether audio needs to be fuller/richer, or whether volume/context/browser behavior is the real problem.

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

Continue beta feedback collection. The smallest next Codex-ready closeout item is validating the deployed Backup & Sync email-code flow after the 8-digit fix. The smallest next human-feedback item is following up with rhythm-concern testers on Flow, especially whether the 2-second Relax pause interrupts the inhale/exhale loop.
