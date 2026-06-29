# Codex Handoff

Last updated: 2026-06-29 (production shipping pipeline)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`, tracking `origin/master`.
- Current local change: `.agents/skills/exhale-ship` is being upgraded into a mode-based production shipping conductor with `precommit`, `prepush`, and `production` flows.
- Current validation standard: `git diff --check`, `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`.
- Known build churn: restore `next-env.d.ts` to the checked-in dev route-types import if `next build` rewrites it from `./.next/dev/types/routes.d.ts` to `./.next/types/routes.d.ts`.

## What Changed Most Recently

- `exhale-ship` now routes release work through a dedicated production pipeline reference.
- The production pipeline defines low-risk auto-fix boundaries, hard stops, commit analysis, explicit staging rules, verification requirements, deployment-status checks, and final report requirements.
- The release gate now requires the active mode and references the production pipeline before staging, committing, pushing, or reporting production readiness.
- The owner-decision guardrail now clarifies that commit/push/deploy actions are allowed only when explicitly requested in the current turn.
- The skill UI metadata now presents `Exhale Ship` as the guarded production shipping flow.

## Durable Invariants

- Anonymous local use remains default. Sign In is optional, visible choices are Google, Apple, and email, and the framing remains history across devices rather than an account gate.
- There is no internal or visible post-exhale `rest`, Relax, Pause, or natural-breathing phase. Box's fourth beat is a true `Hold` after Exhale and stays at the exhaled orb scale.
- Rhythm is fixed at session start.
- Center orb is the primary timing object. Outer guide ring and incoming-color lead stay quiet support.
- Game `main` keeps `100dvh` inline style with `h-screen` fallback, and `BreathingOrb` keeps the width-aware radius clamp.
- Supabase auth falls back to anonymous only on explicit 401/403. Transient errors preserve cached sessions.
- Footer `Sign In` opens `/stats#sync` so the user can choose Google, Apple, or email and optionally opt into Email Updates.
- Do not add required sign-in, premium framing before breathing, external audio files, push reminders, social features, or full account/profile surfaces.

## Current External Tasks

- Apply/confirm the Email Updates Supabase migration in production if not already applied.
- Configure and smoke-test Apple provider credentials in Supabase/Apple Developer.
- Verify Supabase email magic-link templates and redirect URLs before relying on email sign-in for release.
- Keep donation, freemium, custom patterns, paid skins, Android TWA, and native iOS work behind roadmap stage gates.

## Next Validation Priorities

1. Production smoke-test Google, Apple, and email sign-in with Email Updates checked and unchecked.
2. Confirm active-session readability and Meta/Facebook in-app browser behavior with real devices.
3. Continue beta feedback collection before changing rhythms, voice guidance, skins, or monetization surfaces.

## Do Not Revert / Preserve

- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`.
- Local-only Supabase auth bypass on localhost unless deliberately testing sync.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Sitemap and Bing verification files unless search-console ownership is intentionally changed.
- Sign In framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.
- `PolicyFooter` sign-in role as the recovery path when Practice History is hidden.
