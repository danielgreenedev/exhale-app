# Codex Handoff

Last updated: 2026-06-29 (provider sign-in expansion and opt-in Email Updates)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`, tracking `origin/master`.
- Working tree is currently dirty with provider sign-in expansion, opt-in Email Updates consent storage, roadmap/docs updates, and prior roadmap clarification docs.
- Recent commit history:
  - `fe8be2f` - Rhythm picker pattern cards show timing directly.
  - `6dc32b4` - Agent factory roadmap concluded.
  - `0d057f0` - Design-distinctiveness feedback captured in feedback/open-question docs.
  - `b27ed48` - Agent factory roadmap advanced with subagent/deployment references.
  - `7f42735` - Post-exhale phase retired and `exhale-ship` workflow added.
- Verification standard: `git diff --check`, `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`. Restore `next-env.d.ts` to the checked-in dev-routes import if `next build` rewrites it.
- Current validation on 2026-06-23: `git diff --check`, `npm.cmd run lint`, `npm.cmd test -- --runInBand` (9 suites, 115 tests), `npm.cmd run build`, and `npm.cmd run audit:impeccable` passed. Chrome-channel Playwright QA passed first-visit home, returning home, Meta-style active session with Large circle, completion, stats, desktop home, and long-quote completion layout checks. The audit wrapper now calls the current Impeccable `detect` command and ignores the Next.js dev overlay portal finding outside the Exhale UI.

## What Changed Most Recently

- **Completion quote stabilization.** `SessionComplete` now waits for one resolved completion quote instead of showing a local fallback and then swapping to a fetched quote. `src/lib/completionQuote.ts` owns remote quote fetch, normalization, and a short fallback timeout; focused Jest tests cover remote, empty, and slow quote paths.
- **Provider sign-in expansion.** Practice now offers Google, Apple, and email sign-in. Footer Sign In opens Practice instead of auto-launching Google. Email sign-in sends a Supabase magic link and still accepts a code if the email template is in a legacy code state.
- **Email Updates opt-in.** The Practice Sign In section has one unchecked Email Updates checkbox. Consent is persisted only after sign-in completes with a real email identity, through the new `email_update_subscriptions` table. Auth email alone is not marketing consent.
- **External setup still required.** Apply `supabase/migrations/005-email-update-subscriptions.sql`, configure the Apple provider in Supabase/Apple Developer, and verify Supabase email templates/redirect URLs before production smoke testing.
- **Factory expanded.** Repo-local skills now cover beta triage, sync drift audit, accessibility lab review, and device QA. `exhale-ship` remains the final guarded release gate.
- **Owner decision guardrail active.** `exhale-ship` now records when Codex must stop for owner input: P0/P1 risk acceptance, product/design/auth/sync/accessibility tradeoffs, external-service changes, dependencies/MCP additions, production DB/schema/policy changes, and commit/push/deploy actions.
- **Agent factory concluded.** `docs/AGENT_FACTORY_ROADMAP.md` now treats the roadmap as concluded and the factory as an operational process. The repo-local `.agents/skills/exhale-ship/` skill owns the guarded workflow.
- **Review/release gates exist.** The skill has focused playbooks for code review, design review, docs harmonization, owner decision guardrails, release checks, and optional subagent delegation.
- **First factory run shipped.** The no-post-exhale rhythm model was reviewed, validated, committed, and pushed to `master`.
- **Deployment caveat.** The checkout has no `.vercel/project.json`; command-line `curl.exe -I https://exhale.guide` receives Vercel's challenge/429 response, matching the known tooling caveat in `docs/DEPLOYMENT.md`. Confirm production deployment status through GitHub/Vercel's authenticated UI or an authenticated CLI surface when needed.
- **Pattern picker refreshed.** Breathing Sequence cards now show proportional phase bars and seconds directly; the separate pattern reveal is gone.
- **Owner rhythm update in progress.** Visible order is Soft, Box, Flow, Relax. Default Soft (`gentle`) is 4-4, Box (`standard`) is 4-4-4-4, Flow is 4-6, and Relax (`box`) is 4-7-8 for legacy storage compatibility.
- **Settings naming/defaults updated.** Session Setup tabs now read Pattern, Visual, Audio; the old Pace label now reads Breathing Sequence; Circle Size defaults to Medium; Audio shows Warm before Air and defaults to Warm.
- **Settings/history color accents added.** Tiny phase-color markers now appear in rhythm cards, Circle Size, Background sound, and Practice History. These are semantic markers, not a new accent system.
- **Current local validation passed.** `git diff --check`, `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build` passed on 2026-06-22. Playwright mobile QA at 390px confirmed Pattern / Visual / Audio labels, Soft / Medium / Warm defaults, Warm-before-Air order, Practice History phase-color accents, and no horizontal overflow. `next-env.d.ts` was restored to the checked-in dev route-types import after build.

## Durable Invariants

- **Four visible paces.** Soft (`gentle`, 4-4, cycle 8s, default), Box (`standard`, 4-4-4-4, cycle 16s), Flow (`flow`, 4-6, cycle 10s), Relax (`box`, 4-7-8, cycle 19s).
- **Post-exhale handling.** There is no internal or visible post-exhale `rest`, Relax, Pause, or natural-breathing phase. Box's fourth beat is a true `Hold` after Exhale and stays at the exhaled orb scale. Do not reintroduce a rest/relax phase without fresh validation.
- **Rhythm lock.** `rhythmRef` locking in session/audio/orb code is intentional. Rhythm is fixed at session start.
- **Meta webview layout.** Game `main` keeps `100dvh` inline style with `h-screen` fallback, and `BreathingOrb` keeps the width-aware radius clamp. Removing either side risks regressing Facebook in-app browser layout.
- **Cue hierarchy.** Center orb is the primary timing object. Outer guide ring and incoming-color lead stay quiet support.
- **Auth/sync.** Anonymous local use remains default. Sign In is optional, visible choices are Google, Apple, and email, and the framing remains history across devices rather than an account gate.
- **Supabase auth.** Only fall back to anonymous on explicit 401/403. Transient errors preserve cached sessions.
- **Footer sign-in link.** Anonymous label `Sign In`, signed-in label `Signed In`. Footer always opens `/stats#sync` so the user can choose Google, Apple, or email and optionally opt into Email Updates.

## Feedback Mode

Next highest-leverage validation asks:

1. **Pixel/Facebook owner retest:** in Facebook Android on Pixel 9 Pro XL, Circle Size Large, confirm whether the orb and outer guide ring now fit fully without left/right clipping.
2. **Current rhythm check:** ask testers whether default Soft feels accessible and calming, whether Box feels clear as the structured option, whether Flow is smoother for longer-exhale no-hold users, and whether Relax's 4-7-8 timing feels calming or too demanding.
3. **Meta-browser sound/capability check:** in Facebook or Messenger in-app browsers, note whether sound works, whether the menu hint is understandable, and whether opening in the normal browser changes behavior.
4. **HUD readability check:** confirm whether phase text and transitions feel readable and smooth after the dimmer-orb/crossfade pass.
5. **Design distinctiveness follow-up:** ask the professional/advocacy reviewer which screen or visual choice felt generic, what it reminded them of, and whether the issue was color, layout, motion, type, copy, or the orb treatment.

Keep further default-rhythm changes, voice guidance, Garden skin, Android TWA, and parked Impeccable follow-ups behind one more validation pass.

## Do Not Revert / Preserve

- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`.
- Local-only Supabase auth bypass on localhost unless deliberately testing sync.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Sitemap and Bing verification files unless search-console ownership is intentionally changed.
- Sign In framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.
- `PolicyFooter` sign-in role as the recovery path when Practice History is hidden.
