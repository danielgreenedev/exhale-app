# Codex Handoff

Last updated: 2026-07-11 (account/preferences and Apple sign-in validation)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`, tracking `origin/master`.
- Current local change: add a quiet `/account` surface for signed-in users with subscription status, basic contact info, Email Updates consent, support/privacy links, and future premium controls for themes and the breathing pattern creator.
- Current validation standard: `git diff --check`, `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`.
- Known build churn: restore `next-env.d.ts` to the checked-in dev route-types import if `next build` rewrites it from `./.next/dev/types/routes.d.ts` to `./.next/types/routes.d.ts`.

## What Changed Most Recently

- Apple sign-in was configured and smoke-tested successfully in production on 2026-07-11 after the existing Apple key/client-secret path was recovered.
- `email_update_subscriptions` exists in production with RLS policies for create/read/update own consent.
- Footer `Signed In` now opens `/account`, while anonymous `Sign In` still opens `/stats#sync`.
- Account creation/sign-in copy now reassures that premium options are optional and the free breathing tool remains fully functional.
- Email Updates consent can be read and changed from Account, in addition to the opt-in checkbox during sign-in.

## Durable Invariants

- Anonymous local use remains default. Sign In is optional, visible choices are Google, Apple, and email, and the framing remains history across devices rather than an account gate.
- There is no internal or visible post-exhale `rest`, Relax, Pause, or natural-breathing phase. Box's fourth beat is a true `Hold` after Exhale and stays at the exhaled orb scale.
- Rhythm is fixed at session start.
- Center orb is the primary timing object. Outer guide ring and incoming-color lead stay quiet support.
- Game `main` keeps `100dvh` inline style with `h-screen` fallback, and `BreathingOrb` keeps the width-aware radius clamp.
- Supabase auth falls back to anonymous only on explicit 401/403. Transient errors preserve cached sessions.
- Footer `Sign In` opens `/stats#sync` so the user can choose Google, Apple, or email and optionally opt into Email Updates. Footer `Signed In` opens `/account`.
- Do not add required sign-in, premium framing before breathing, external audio files, push reminders, social features, or profile/social-account theater. Keep `/account` practical and post-sign-in only.

## Current External Tasks

- Verify Supabase email magic-link templates and redirect URLs before relying on email sign-in for release.
- Keep the Apple key path and client-secret renewal process documented outside the repo; never commit `.p8` keys or generated client secrets.
- Keep donation, freemium, custom patterns, paid skins, Android TWA, and native iOS work behind roadmap stage gates.

## Next Validation Priorities

1. Production smoke-test Google and email sign-in with Email Updates checked and unchecked; Apple passed a manual smoke test on 2026-07-11.
2. Confirm active-session readability and Meta/Facebook in-app browser behavior with real devices.
3. Continue beta feedback collection before changing rhythms, voice guidance, skins, or monetization surfaces.

## Do Not Revert / Preserve

- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`.
- Local-only Supabase auth bypass on localhost unless deliberately testing sync.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Sitemap and Bing verification files unless search-console ownership is intentionally changed.
- Sign In framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.
- `PolicyFooter` anonymous sign-in role as the recovery path when Practice History is hidden; signed-in state may open `/account`.
