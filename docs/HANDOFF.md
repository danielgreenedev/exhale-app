# Codex Handoff

Last updated: 2026-05-26 (Footer signed-in state and sync anchor)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`.
- Working tree is clean after this handoff's commit. Untracked entries are dev logs (`.next-dev.err.log`, `.next-dev.out.log`, `debug.log`, `tmp/`) that should stay out of git.
- Recently committed and pushed: auth refresh hardening (3b4a031), shared sign-in footer link (3b4a031), and auth-aware label + sync anchor on the footer link (1b447bf).
- Verification from this batch: `npm.cmd run lint` clean, `npm.cmd test -- --runInBand` 107/107 passing, Playwright screenshots at 375 / 390 / 640 px on home and stats.
- `next-env.d.ts` may be rewritten by `next build`; restore it to the checked-in dev routes import before committing if it changes.

## Current Batch Summary

- **Beta feedback mode continues.** Do not start new features unless feedback clearly promotes them. Current signal is still about rhythm fit, Flow pause friction, transition clarity, audio reliability, first-time understanding of Relax, and whether the progressive/ramping ask is a true rhythm-shape need or a Relax-framing problem.
- **Session persistence hardened for returning synced users.** `src/lib/auth.tsx` no longer signs the user out on transient errors during bootstrap or refresh. A new `isInvalidSessionError(error)` helper limits the anonymous fallback to explicit 401/403 from Supabase; network failures, 5xx, and thrown timeouts now preserve the cached session. The deleted-user FK-violation guard is preserved for the explicit-invalidation path.
- **Supabase client config made explicit.** `src/lib/supabase.ts` now passes `persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`. These were defaults; stating them documents intent and prevents future option drift.
- **Footer sign-in entry point shipped.** `src/components/PolicyFooter.tsx` now renders Privacy / Terms / Sign In to Sync on home, session complete, and stats. The footer wraps cleanly at iPhone SE width because the policy links are paired in one inline-flex group and the sign-in link stands alone; per-link `whitespace-nowrap` plus container `flex-wrap` prevents mid-link breaks. Tracking dropped from `0.18em` to `0.14em` to fit comfortably.
- **Footer is auth-aware as of 2026-05-26.** `PolicyFooter` is a client component that reads `useAuth()`; the sync link label switches to `Signed In` when the user is signed in (`ready && !isAnonymous`) and the href is `/stats#sync` so signed-in users land at the Backup & Sync block without re-signing in. The Backup & Sync section in `stats/page.tsx` carries `id="sync"` and `scroll-mt-6` so the fragment scrolls cleanly. Default label during bootstrap stays on `Sign In to Sync` to avoid a misleading flash for anonymous visitors.
- **No sign-in button on home itself.** The home screen and session flow still must never become auth-gated (CLAUDE.md rule). Footer placement gives returning synced users a recovery path without making the first decision feel account-related.
- **T-2026-05-25-19 logged.** AI-software-developer tester reported being locked out after their Supabase session was lost: the home page hid Practice History (no local sessions), and there was no visible path back to sign-in. Project owner notes the tester likely used an earlier build; the implementation above addresses both the discoverability hole and the most plausible session-loss cause (transient errors poisoning the cached session).
- **All prior beta-polish state from 2026-05-24 still applies.** The first-session setup gate, central HUD readability pass, dimmer-orb treatment, one-second phase-label crossfade, `3 minutes complete` copy, Meta in-app browser fullscreen hint, accepted email-change 8-digit codes, Resend SMTP, rhythm telemetry, and parked Impeccable follow-ups all remain in place. Nothing from those batches was touched this session.

## Key Functional State

- **Four visible paces.** Steady (4-4-6-8), Soft (3-2-4-4), Full (6-6-10-4), and Flow (4-0-6-2). Flow's zero-duration Hold is skipped by `getPhaseAtTime` and `getNextPhase`.
- **Fourth phase: Relax.** User-facing label `Relax`, instruction `Breathe naturally`; the internal phase enum remains `'rest'`.
- **Anticipatory phase cue.** `PHASE_LOOKAHEAD_SECONDS = 0.8` is still the ceiling. `getPhaseLookahead(phase)` returns `Math.min(0.8, phase.duration * 0.25)`. No HUD text cue is shown.
- **Cue hierarchy.** The center orb is the primary timing object. The outer guide ring is a quiet pre-cue/support signal, not the thing users should chase.
- **Static orb marks.** Home, stats, policy, terms, complete, and app icons use muted radial fills plus low-opacity outline rings. Avoid reintroducing `emerald-300`, `#6ee7b7`, or colored `box-shadow` on static orb marks.
- **Background-tab audio fix.** `useAudioEngine.scheduleAmbientStop` schedules the ambient fade-out against the Web Audio clock; `game/page.tsx` schedules that stop at the guided-session deadline.
- **Local visual QA quieter.** `AuthProvider` skips Supabase anonymous auth on `localhost` / `127.0.0.1` in development unless `localStorage.setItem('exhale-enable-local-supabase', '1')` is set.
- **Auth bootstrap now defensive.** Bootstrap and `refreshUser` only fall back to anonymous on real auth invalidation. If you change those code paths, preserve the `isInvalidSessionError` check and do not call `supabase.auth.signOut()` on transient errors.
- **Footer is the sign-in entry point for cleared/returning sessions.** Do not remove or rename `Sign In to Sync` without replacing the entry-point function. The link is intentionally quiet and lives below all primary content.

## OAuth Setup Status

- Complete as of 2026-05-20.
- Existing-email OAuth conflict path: if users hit it, the app should guide them to sign in with email first, then link Google from Backup & Sync.
- Token-refresh client-side defenses are now stronger; if synced users still report being dropped after long idle periods, the next place to look is Supabase project settings (JWT expiry, inactivity timeout, refresh-token reuse interval). Those are dashboard-controlled and outside the repo.

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
- Whether progressive/ramping rhythm requests survive after Relax is clarified, and whether "build up" means a short ease-in or whole-session escalation.
- Whether the Facebook/Messenger in-app browser hint is clear enough without distracting from the session, and whether the tester can actually find an external-browser option in the Meta menu.
- Whether the one-second visual crossfade makes phase changes feel smoother without making testers feel late.
- Whether the revised central phase label/instruction and dimmer orb treatment are readable over each phase color without glare or washout.
- Whether Steady's 8-second Relax should become shorter, clearer, or replaced by a more recognizable post-exhale pause in some rhythm.
- Whether Session Complete should show selected duration (`3 minutes complete`) instead of exact elapsed seconds.
- Whether hiding Session Setup until after the first completed local session reduces first-use friction without frustrating customization-oriented testers.
- Whether the anonymous-state footer label `Sign In to Sync` reads as inviting for fresh visitors, and whether the signed-in `Signed In` label is recognized as a working entry point or read as a status badge. T-2026-05-25-19 is the trigger tester; next first-time and next returning-synced testers are the validation reads.
- Which parked Impeccable follow-up, if any, is validated by the next tester: Relax clarity, active HUD distillation, Meta-webview hardening, or first-run cue/onboarding.

## Parked Questions

- Apple Sign-In as a later privacy-aligned provider if testers ask for it.
- Garden skin/theme work, including possible color customization, after feedback intake.
- A stronger visual treatment for Session Setup tab-panel titles, if tester feedback suggests users are missing the first line in each tab.
- Whether the Supabase project-side refresh-token lifetime or inactivity timeout needs extending. Client-side defenses are in place; do not change dashboard settings unless more testers report drop-outs that survive the new transient-error tolerance.

## Do Not Revert / Preserve

- `rhythmRef` locking in session/audio/orb code: rhythm is intentionally fixed at session start.
- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`: used by the guide-ring lead and audio pre-cue.
- The internal `'rest'` enum: user-facing copy says Relax, but storage/runtime discriminators stay stable.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Local-only auth bypass on localhost unless deliberately testing Supabase sync.
- Backup & Sync framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.
- `isInvalidSessionError` in `src/lib/auth.tsx`: only fall back to anonymous on explicit 401/403, never on transient errors.
- Explicit Supabase auth options in `src/lib/supabase.ts`: keep `persistSession`, `autoRefreshToken`, `detectSessionInUrl` stated even though they are framework defaults.
- `PolicyFooter` sync link: the only sign-in entry point for users whose Practice History link is hidden. Anonymous label is `Sign In to Sync`, signed-in label is `Signed In`; both point to `/stats#sync`. Do not remove either label or the fragment without replacing the entry-point function.

## Recommended Next Step

Continue beta feedback collection using the Next Tester Prompt in `docs/USER_FEEDBACK.md`. The smallest near-term human-feedback items remain T-2026-05-22-13, T-2026-05-23-14, and T-2026-05-23-18 follow-ups; additionally, if T-2026-05-25-19 (or a similar synced-but-lost tester) returns, confirm the new transient-error tolerance kept them signed in across normal use and that the `Sign In to Sync` footer link was findable. Keep Relax-duration changes, setup gating changes, voice guidance, and the parked Impeccable follow-ups behind one more validation pass.
