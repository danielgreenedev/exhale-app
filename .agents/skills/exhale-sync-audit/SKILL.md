---
name: exhale-sync-audit
description: Audit Exhale state, auth, storage, and sync behavior across localStorage settings/history, sessionStorage resume, anonymous local use, optional Google sign-in, Supabase settings sync, cloud history merge, and localhost Supabase bypass. Use for state-drift bugs, auth/sync reviews, storage failure reports, resume-window issues, settings/history sync changes, or pre-release checks touching src/lib/auth.tsx, src/lib/settingsSync.ts, src/lib/sessionSync.ts, src/hooks/useSessionStats.ts, src/app/page.tsx, src/app/game/page.tsx, src/app/stats/page.tsx, or Supabase tables.
---

# Exhale Sync Audit

## Overview

Find subtle state drift before users feel it. Exhale's sync risk is not big backend complexity; it is local anonymous state, optional cloud state, browser storage, OAuth returns, and resume/session timing disagreeing quietly.

## Source Of Truth

Read the files relevant to the requested audit:

- `CLAUDE.md` for storage keys, auth posture, local Supabase bypass, and session invariants.
- `PRODUCT.md` for anonymous-first and optional sign-in promises.
- `docs/HANDOFF.md` for current caveats and recent auth/sync decisions.
- `src/lib/auth.tsx` for anonymous auth, Google sign-in, cached session handling, and localhost bypass.
- `src/lib/settingsSync.ts` for local/cloud settings precedence.
- `src/lib/sessionSync.ts` and `src/hooks/useSessionStats.ts` for history save/merge behavior.
- `src/app/page.tsx`, `src/app/game/page.tsx`, `src/app/stats/page.tsx`, and `src/components/PolicyFooter.tsx` for UI-triggered state transitions.
- `supabase/schema.sql` and migrations when table shape, RLS, or persisted IDs are involved.

Do not query production data, change Supabase settings, or modify OAuth/provider configuration without explicit approval.

## Workflow

1. Inspect `git status -sb` and identify changed auth, storage, stats, settings, session, route, or Supabase files.
2. Read the relevant source files and `references/state-map.md`.
3. Map the user path under review: first visit, returning anonymous, signed in, OAuth return, sign out, resume, storage unavailable, or localhost bypass.
4. Check local state, cloud state, and UI state separately. Identify which source wins and what happens on failure.
5. Review existing tests for the touched behavior. Add focused tests when merge keys, normalization, fallback behavior, or error branches change.
6. Report findings first, ordered by severity, with file/line references. Separate confirmed drift from untested risk.
7. If fixing, keep edits narrow and verify with focused Jest tests plus `npm.cmd run lint`; use browser checks when UI state or OAuth-return copy is affected.

## Severity

- P0: Data loss, privacy leak, auth loop, or app-blocking storage/auth failure.
- P1: Must fix before release; breaks anonymous-first use, optional sign-in framing, settings/history continuity, resume behavior, or local/cloud consistency.
- P2: Meaningful drift risk, missing test coverage on a fragile branch, or confusing recovery copy.
- P3: Cleanup or future hardening.

## Audit Focus

Read `references/state-map.md` for storage keys, table responsibilities, drift scenarios, and useful test paths before a full sync audit.