# Codex Handoff

Last updated: 2026-06-21 (agent factory roadmap concluded)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`, synced with `origin/master` through `0d057f0`.
- Working tree should be clean except for the intentionally untracked local reference PDF `docs/agent_factory_start_guide.pdf`.
- Recent commit history:
  - `0d057f0` - Design-distinctiveness feedback captured in feedback/open-question docs.
  - `b27ed48` - Agent factory roadmap advanced with subagent/deployment references.
  - `7f42735` - Post-exhale phase retired and `exhale-ship` workflow added.
  - `3c8cbdc` - Social preview image cache bust.
  - `bbff871` - Baseline SEO metadata improved.
- Verification standard: `git diff --check`, `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`. Restore `next-env.d.ts` to the checked-in dev-routes import if `next build` rewrites it.

## What Changed Most Recently

- **Agent factory concluded.** `docs/AGENT_FACTORY_ROADMAP.md` now treats the roadmap as concluded and the factory as an operational process. The repo-local `.agents/skills/exhale-ship/` skill owns the guarded workflow.
- **Review/release gates exist.** The skill has focused playbooks for code review, design review, docs harmonization, release checks, and optional subagent delegation.
- **First factory run shipped.** The no-post-exhale rhythm model was reviewed, validated, committed, and pushed to `master`.
- **Deployment caveat.** The checkout has no `.vercel/project.json`; command-line `curl.exe -I https://exhale.guide` receives Vercel's challenge/429 response, matching the known tooling caveat in `docs/DEPLOYMENT.md`. Confirm production deployment status through GitHub/Vercel's authenticated UI or an authenticated CLI surface when needed.
- **Design-distinctiveness feedback captured.** T-2026-06-21-22 is recorded anonymously in `docs/USER_FEEDBACK.md`, and `docs/OPEN_QUESTIONS.md` now tracks whether Exhale feels visually distinct enough to avoid reading as generic or derivative.

## Durable Invariants

- **Four visible paces.** Steady (4-2-6, cycle 12s), Soft (3-1-5, cycle 9s), 4-7-8 (storage id `box`, cycle 19s), Flow (4-6, cycle 10s).
- **Post-exhale handling.** There is no internal or visible post-exhale `rest`, Relax, or Pause phase. Do not reintroduce one without fresh validation.
- **Rhythm lock.** `rhythmRef` locking in session/audio/orb code is intentional. Rhythm is fixed at session start.
- **Meta webview layout.** Game `main` keeps `100dvh` inline style with `h-screen` fallback, and `BreathingOrb` keeps the width-aware radius clamp. Removing either side risks regressing Facebook in-app browser layout.
- **Cue hierarchy.** Center orb is the primary timing object. Outer guide ring and incoming-color lead stay quiet support.
- **Auth/sync.** Anonymous local use remains default. Sign In is optional, Google-only in the visible UI, and framed as history across devices rather than an account gate.
- **Supabase auth.** Only fall back to anonymous on explicit 401/403. Transient errors preserve cached sessions.
- **Footer sign-in link.** Anonymous label `Sign In`, signed-in label `Signed In`. Anonymous visitors with no local practice history start Google sign-in directly; anonymous visitors with local history go to `/stats#sync` first.

## Feedback Mode

Next highest-leverage validation asks:

1. **Pixel/Facebook owner retest:** in Facebook Android on Pixel 9 Pro XL, Circle Size Large, confirm whether the orb and outer guide ring now fit fully without left/right clipping.
2. **No-post-exhale rhythm check:** ask Relax/Pause-friction testers whether default Steady now feels smoother with only Inhale, Hold, and Exhale. Then compare 4-7-8 for structured practice and Flow for users who dislike holds entirely.
3. **Meta-browser sound/capability check:** in Facebook or Messenger in-app browsers, note whether sound works, whether the menu hint is understandable, and whether opening in the normal browser changes behavior.
4. **HUD readability check:** confirm whether phase text and transitions feel readable and smooth after the dimmer-orb/crossfade pass.
5. **Design distinctiveness follow-up:** ask the professional/advocacy reviewer which screen or visual choice felt generic, what it reminded them of, and whether the issue was color, layout, motion, type, copy, or the orb treatment.

Keep further Steady default changes, voice guidance, Garden skin, Android TWA, and parked Impeccable follow-ups behind one more validation pass.

## Do Not Revert / Preserve

- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`.
- Local-only Supabase auth bypass on localhost unless deliberately testing sync.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Sitemap and Bing verification files unless search-console ownership is intentionally changed.
- Sign In framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.
- `PolicyFooter` sign-in role as the recovery path when Practice History is hidden.
