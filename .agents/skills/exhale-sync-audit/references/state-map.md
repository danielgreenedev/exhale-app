# Sync State Map

## Local Browser State

- `exhale-stats` in localStorage stores `{ sessions: SessionRecord[] }` and remains the anonymous history source of truth.
- `exhale-orb-scale`, `exhale-sound-palette`, `exhale-session-length`, and `exhale-rhythm` store practice settings.
- `exhale-visited` marks first-visit UI state.
- `exhale-resume` in sessionStorage stores in-progress session resume state with a short window.
- `exhale-enable-local-supabase` opts local development into real Supabase auth when set to `1`; otherwise localhost uses local-only auth.

## Cloud State

- `breathing_sessions` stores synced practice history by `user_id`, date, duration, cycles, and length.
- `user_settings` stores one settings row by `user_id` for timer length, circle size, sound, and rhythm.
- `app_events` is analytics-like and must not block breathing.
- `quotes` is read-only completion content and should not affect save/sync correctness.

## Critical Invariants

- Anonymous local use is the default. Sign-in must never gate breathing or local history.
- Local storage writes happen first for completed sessions; cloud insert is opportunistic when `userId` exists.
- Only 401/403 auth invalidation should drop a cached user. Transient auth failures preserve cached session state.
- Localhost bypass prevents blocked Supabase requests from producing noisy dev overlays unless deliberately disabled with `exhale-enable-local-supabase`.
- Google, Apple, and email magic link are the visible sign-in paths. Email-code behavior is legacy/recovery only.
- Email Updates consent is opt-in only and stored in `email_update_subscriptions` after sign-in completes.
- Existing cloud settings overwrite local settings on sign-in; absent cloud settings get initialized from local settings.
- Legacy rhythm IDs `full` and `slow` normalize to `box` for compatibility.
- Session history merge uses date, duration, cycles, and length as the duplicate key and preserves extra local duplicates.
- Sign out returns the app to anonymous/local use without deleting local history.

## Drift Scenarios To Check

- First visit with no storage, blocked storage, or malformed `exhale-stats`.
- Returning anonymous user with local history using footer Sign In versus Practice Sign In.
- OAuth return to `/stats?sync=google` or `/stats?sync=apple`, email return to `/stats?sync=email`, and hash/query error handling.
- Checked Email Updates before redirect, followed by successful or failed consent persistence.
- Signed-in user with cloud sessions plus local-only sessions created before sync.
- Signed-in user with no cloud settings row but local settings present.
- Signed-in user with invalid cloud settings values.
- Network or Supabase read failure while local history/settings exist.
- Session exit/resume within and after the resume window.
- Completion save when localStorage quota/private browsing blocks writes.
- Local development with and without `exhale-enable-local-supabase`.

## Files And Tests

High-signal source files:

- `src/lib/auth.tsx`
- `src/lib/settingsSync.ts`
- `src/lib/sessionSync.ts`
- `src/hooks/useSessionStats.ts`
- `src/app/page.tsx`
- `src/app/game/page.tsx`
- `src/app/stats/page.tsx`
- `src/components/PolicyFooter.tsx`

Current focused tests:

- `src/__tests__/settingsSync.test.ts`
- `src/__tests__/sessionSync.test.ts`
- `src/__tests__/computeStats.test.ts`
- `src/__tests__/statsSyncCopy.test.ts`
- `src/__tests__/statsSyncCodeLength.test.ts`
- `src/__tests__/appEvents.test.ts`

Useful checks:

- `rg -n "localStorage|sessionStorage|exhale-|syncUserSettings|missingLocalSessions|mergeSyncedSessions|signInWithOAuth|linkIdentity|signInAnonymously|onAuthStateChange|breathing_sessions|user_settings" src`
- `npm.cmd test -- settingsSync.test.ts sessionSync.test.ts`
- `npm.cmd test`
- `npm.cmd run lint`
- `npm.cmd run build` for release-adjacent changes; restore `next-env.d.ts` if Next rewrites route-type imports.
