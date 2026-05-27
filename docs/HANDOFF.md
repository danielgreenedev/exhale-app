# Codex Handoff

Last updated: 2026-05-27 (Facebook in-app orb-overflow and Meta hint copy)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`. Working tree clean after the latest push. Only untracked entries are dev logs (`.next-dev.err.log`, `.next-dev.out.log`, `debug.log`, `tmp/`) which should stay out of git.
- Recent commit history (newest first):
  - `5f45fb5` — Orb-overflow fix in Facebook in-app browser; Meta hint copy tightened.
  - `4837cc2` — Steady (4-4-6-4) and Full (6-6-10-6) Relax revisions.
  - `f850b5f` — Doc reconciliation for the auth-aware footer label.
  - `1b447bf` — Auth-aware `Signed In` / `Sign In to Sync` label on the footer, plus `/stats#sync` anchor.
  - `3b4a031` — Auth refresh hardening (transient-error tolerance) and shared sign-in footer link.
- Verification standard for this stretch: `npm.cmd run lint` clean, `npm.cmd test -- --runInBand` 107/107 passing, plus Playwright smoke screenshots for any UI-touching change.
- `next-env.d.ts` may be rewritten by `next build`; restore it to the checked-in dev-routes import before committing if it changes.

## What Changed Most Recently

These items shipped in the current session and are worth knowing before the next change lands on top:

- **Facebook in-app orb-overflow fixed (`src/app/game/page.tsx`).** Game `main` now sets `style={{ height: '100dvh' }}` with `h-screen` retained as the `100vh` fallback. On browsers that support dynamic viewport units (current Chrome / Safari / Android WebView / Facebook in-app) the main element resolves to the actual visible viewport height instead of the un-compressed `100vh`, so the orb (centered against the canvas) no longer falls below Facebook's top bar. Verified locally at 412×915, 412×700, and 360×640. Real-Facebook validation owed by T-2026-05-23-14.
- **Meta in-app browser hint copy tightened (`src/app/game/page.tsx`).** `Tap menu to open in browser for sound or fullscreen` → `Tap menu (top-right) for sound and fullscreen`. The positional cue is kept generic (no Android-specific glyph reference) so the copy reads on iOS Meta-webviews too.
- **Steady and Full Relax revised (`src/lib/breathing.ts`).** Steady is now 4-4-6-4 (cycle 18s, ~3.3 breaths/min); Full is now 6-6-10-6 (cycle 28s, ~2.1 breaths/min). `recalibrateCycles` derives the new sessionCycles (Steady: 10/17/23/33, Full: 6/11/15/21). Soft and Flow untouched. Responsive to repeated Relax-too-long signal (T-2026-05-23-14, T-2026-05-23-18, T-2026-05-22-13).
- **Footer is auth-aware (`src/components/PolicyFooter.tsx`).** Client component reading `useAuth()`. Anonymous label: `Sign In to Sync`. Signed-in label: `Signed In` when `ready && !isAnonymous`. Both target `/stats#sync` so signed-in users land at the Backup & Sync block without re-signing in. The Backup & Sync section on `/stats` carries `id="sync"` and `scroll-mt-6` for clean fragment scrolling. Default label during the bootstrap window stays on `Sign In to Sync` to avoid a misleading flash for anonymous visitors.
- **Auth bootstrap defensive against transient errors (`src/lib/auth.tsx`).** New `isInvalidSessionError` helper limits the anonymous fallback to explicit 401/403. Network failures, 5xx, and thrown timeouts now preserve the cached session so synced users do not get bounced out by a momentary connectivity blip on page load. Deleted-user FK-violation guard preserved on the explicit-invalidation path.
- **Supabase client config explicit (`src/lib/supabase.ts`).** `persistSession`, `autoRefreshToken`, `detectSessionInUrl` all stated as `true`. These are framework defaults; stating them documents intent and protects against future option drift.

## Parked Signals Waiting On Tester Action

These came in recently and are deliberately not implemented yet. They are listed so the next session does not act on them without the validation step.

- **Pace-too-fast on Steady (T-2026-05-23-14, 2026-05-27).** Same tester says the new Steady (4-4-6-4) still feels too fast and Relax is still an unnecessary interruption. Direct conflict with T-2026-05-23-18 (pediatrician) who said transitions were followable and timing should not be extended. Do not change Steady defaults for one tester. Ask Ryan to try Full (6-6-10-6) and Flow (4-0-6-2) before any rhythm-shape change; those presets were designed for this preference.
- **No-Relax Full / Flow variant (Conditional, TODO 6f / 6f-1).** Trigger remains: one more tester independently asking to remove Relax entirely after Relax-clarity work has shipped. Currently only T-2026-05-23-14 is asking for removal; T-2026-05-23-18 wants Relax clearer rather than gone.
- **Parked Impeccable follow-ups.** `/impeccable clarify Relax phase`, `/impeccable distill active session HUD`, `/impeccable harden Meta in-app browser state`, `/impeccable onboard first-run cue` all still gated on next-tester signal. The 2026-05-27 follow-up did not trip any of their triggers (Meta-webview report was viewport-overflow, fixed directly; Relax signal is "remove it", which the clarify skill is unlikely to answer).

## Key Functional State (Durable Invariants)

- **Four visible paces.** Steady (4-4-6-4, cycle 18s), Soft (3-2-4-4, cycle 13s), Full (6-6-10-6, cycle 28s), Flow (4-0-6-2, cycle 12s). Steady was 4-4-6-8 and Full was 6-6-10-4 before the 2026-05-26 revisions. Flow's zero-duration Hold is skipped by `getPhaseAtTime` and `getNextPhase`.
- **Fourth phase.** User-facing label `Relax`, instruction `Breathe naturally`. Internal phase enum stays `'rest'`.
- **Anticipatory phase cue.** `PHASE_LOOKAHEAD_SECONDS = 0.8` is the ceiling. `getPhaseLookahead(phase)` returns `Math.min(0.8, phase.duration * 0.25)`. No HUD text cue.
- **Cue hierarchy.** Center orb is the primary timing object. Outer guide ring is quiet support; not the thing users should chase.
- **Static orb marks.** Home, stats, policy, terms, complete, app icons use muted radial fills + low-opacity outline rings. Avoid reintroducing `emerald-300`, `#6ee7b7`, or colored `box-shadow` on static orb marks.
- **Background-tab audio.** `useAudioEngine.scheduleAmbientStop` schedules ambient fade-out against the Web Audio clock; `game/page.tsx` schedules that stop at the guided-session deadline so Chrome background-tab throttling cannot leave audio running after completion.
- **Local visual QA.** `AuthProvider` skips Supabase anonymous auth on `localhost` / `127.0.0.1` in development unless `localStorage.setItem('exhale-enable-local-supabase', '1')` is set.
- **Auth bootstrap rule.** Only fall back to anonymous on explicit 401/403. Transient errors preserve the cached session. `isInvalidSessionError` is the gate.
- **Footer sync link.** The only sign-in entry point when Practice History is hidden (first-run users with no local sessions). Anonymous reads `Sign In to Sync`; signed-in reads `Signed In`; both target `/stats#sync`.

## OAuth Setup Status

- Complete as of 2026-05-20. Email-code sync plus optional Google OAuth via Supabase Auth, with anonymous local use as the default.
- Existing-email OAuth conflict path: guide users to sign in with email first, then link Google from Backup & Sync.
- Token-refresh client-side defenses are now stronger (transient-error tolerance, 2026-05-25). If synced users still report being dropped after long idle periods, the next place to look is Supabase project settings (JWT expiry, inactivity timeout, refresh-token reuse interval). Those are dashboard-controlled and outside the repo.

## Email Delivery Status

- Resend domain: `auth.exhale.guide`. From address: `Exhale <no-reply@auth.exhale.guide>`. Supabase custom SMTP wired through Resend.
- Next deliverability validation: request a fresh Backup & Sync code from an incognito or fresh browser state, confirm delivery from the new sender, and verify sync completes after entering the code. API keys live in Supabase/Resend, not the repo.

## Feedback Mode

Brand-new-user prompts and follow-up question sets live in `docs/USER_FEEDBACK.md`. Key themes still waiting on more signal:

- Whether Soft or Full fits rhythm-concern testers better than Steady.
- Whether Flow solves the Rest/Hold friction for testers who disliked interruption.
- Whether Flow should become inhale/exhale only if a second tester independently confirms the 2-second pause feels interruptive (one signal so far from T-2026-05-19-08).
- Whether anticipatory color/audio cues make transitions easier or add noise.
- Whether the softened guide line makes the orb feel clearly primary.
- Whether Full's 10-second exhale needs clearer expectation-setting for resting vs stressed states.
- Whether Session Setup labels and explanations feel natural to brand-new users.
- Whether first-time users need a pre-start sequence preview such as `Inhale → Hold → Exhale → Relax`, potentially with each word appearing one at a time.
- Whether audio needs to be fuller/richer, or whether volume/context/browser behavior is the real problem.
- Whether the progressive/ramping rhythm request survives after Relax clarification, and whether "build up" means a short ease-in or whole-session escalation.
- Whether the Facebook/Messenger in-app browser hint, with the tightened `Tap menu (top-right) for sound and fullscreen` copy, is clear enough without distracting from the session.
- Whether the orb-overflow fix actually holds in real Facebook in-app browser on Android and iPhone (T-2026-05-23-14 is the Android validator; iPhone validator still needed).
- Whether the one-second phase-label crossfade makes transitions feel smoother without making testers feel late.
- Whether the revised central phase label/instruction and dimmer orb treatment are readable over each phase color without glare or washout.
- Whether Steady's revised 4-second Relax now feels well-timed, or whether it has tipped too short for testers who valued the longer breath-back beat. T-2026-05-23-14 says it is still too fast overall; T-2026-05-23-18 has not yet been re-asked.
- Whether Session Complete should show selected duration (`3 minutes complete`) instead of exact elapsed seconds.
- Whether hiding Session Setup until after the first completed local session reduces first-use friction without frustrating customization-oriented testers (positive signal from T-2026-05-23-14, 2026-05-27).
- Whether the anonymous-state footer label `Sign In to Sync` reads as inviting for fresh visitors, and whether the signed-in `Signed In` label is recognized as a working entry point or read as a status badge.
- Which parked Impeccable follow-up, if any, is validated by the next tester: Relax clarity, active HUD distillation, Meta-webview hardening, or first-run cue / onboarding.

## Parked Questions

- Apple Sign-In as a later privacy-aligned provider if testers ask for it.
- Garden skin / theme work, including possible color customization, after feedback intake.
- Stronger visual treatment for Session Setup tab-panel titles, if tester feedback suggests users miss the first line in each tab.
- Supabase project-side refresh-token lifetime or inactivity timeout. Client-side defenses are in place; do not change dashboard settings unless more testers report drop-outs that survive the new transient-error tolerance.
- Voice guidance (spoken phase names, optional, off by default) — multiple positive signals but no implementation work yet.

## Do Not Revert / Preserve

- `rhythmRef` locking in session / audio / orb code: rhythm is intentionally fixed at session start.
- `nextPhase`, `phaseLeadProgress`, `getPhaseLookahead`: used by the guide-ring lead and audio pre-cue.
- Internal `'rest'` enum: user-facing copy says Relax, but storage and runtime discriminators stay stable.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Local-only auth bypass on localhost unless deliberately testing Supabase sync.
- Backup & Sync framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.
- `isInvalidSessionError` in `src/lib/auth.tsx`: only fall back to anonymous on explicit 401/403, never on transient errors.
- Explicit Supabase auth options in `src/lib/supabase.ts`: keep `persistSession`, `autoRefreshToken`, `detectSessionInUrl` stated even though they are framework defaults.
- `PolicyFooter` sync link: the only sign-in entry point for users whose Practice History link is hidden. Anonymous label `Sign In to Sync`, signed-in label `Signed In`; both point to `/stats#sync`. Do not remove either label or the fragment without replacing the entry-point function.
- Game `main` `100dvh` inline style with `h-screen` fallback in `src/app/game/page.tsx`. The pair is what keeps the orb visible inside Facebook's in-app browser. Removing either side regresses the Facebook viewport bug.
- Default Steady remains 4-4-6-4 and default Full remains 6-6-10-6 unless a second confirming signal arrives on either side (too-fast or too-slow).

## Recommended Next Step

Continue beta feedback collection. Two highest-leverage validation asks:

1. **T-2026-05-23-14:** ask him to reopen exhale.guide in the Facebook in-app browser on Android and confirm whether the breathing orb now fits the visible canvas. Same question, this time with Full and then Flow selected, to check whether either feels closer to his preferred pace.
2. **An iPhone Meta-webview tester** (any willing iPhone owner who has Facebook installed): open exhale.guide from a Facebook post and verify that the orb fits the visible canvas, the `Tap menu (top-right)` hint is reachable, and the `Open in browser` option exists. This is the missing half of the orb-overflow validation.

Keep Steady duration changes, no-Relax variants, voice guidance, and the parked Impeccable follow-ups behind one more validation pass.
