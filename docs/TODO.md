# Exhale To-Do List

Last updated: May 18, 2026

## Completed Rhythm Changes

- Settle In now lasts 8 seconds before the first guided inhale.
- The core rhythm is now 4-4-6-8, with an 8-second Rest phase.
- Session breath counts were recalibrated so the 3, 5, 7, and 10 minute labels stay accurate.

## Completed UI Polish

- Sound preview has visible state plus screen-reader status.
- Off is separated from sound textures and uses a mute icon.
- Time, Circle Size, and Sound selected states share one quieter visual language.
- View Sequence and Settings were merged into one Session Setup drawer.
- Begin remains the only solid green primary action.
- Still is now audibly present.
- Circle Size and Sound live inside Session Setup from the start; the 3-session hiding rule was removed.
- When available, Resume now appears directly below Begin and before Session Setup.

## Completed From Sync And Measurement Follow-Up

- Supabase sync copy now indicates that timer setting, Circle Size, audio choice, and Practice History sync.
- App events are logged for email-synced users when they select a timer, start a session, exit early through the app, or complete a session.
- Practice completion is still recorded in `breathing_sessions`; behavioral counts now have a lightweight path through `app_events`.

## Completed From Full Impeccable Audit

- Full impeccable audit was run against the current local UI, with browser checks for Home, Stats, Settle In, and the running breathing page.
- Settle In now has an immediate quiet Exit path, and Escape opens the exit guard during the 8-second buffer.
- Opening the exit guard during Settle In pauses the settle timer; Resume returns to Settle In instead of starting the session behind the dialog.
- The mute control now meets the 44x44 touch target floor.
- The Begin button has more space above it so it no longer feels cramped against the timer buttons.
- Home orb size changes and the session progress bar now animate with transforms instead of layout-width/height transitions.

## Completed Preview Prep

- The current beta-ready work was committed and pushed to the `preview` branch for Vercel preview deployment.
- A dedicated `docs/USER_FEEDBACK.md` file now exists for anonymized tester notes, critique synthesis, and product decisions.

## Completed Production Deploy

- The latest work was pushed to both `preview` and `master`.
- Vercel reported the production deployment complete for commit `c6ca1b6`.

## Completed Local Smoke Test

- Local Home, Begin, Session Setup, running breathing session, exit guard, audio choice selection, Practice History, and sync copy were smoke tested with no browser console errors.
- The latest Vercel preview URL was found, but it currently redirects to Vercel login before the app loads.

## Completed Documentation Polish

- Markdown docs were aligned with the current Next.js version, Resume placement, Session Setup, Supabase tables, Vercel preview access note, and beta handoff flow.
- `docs/USER_FEEDBACK.md` now includes a current test surface and a short beta test prompt.

## Completed Beta Surface Decision

- For the current beta round, testers will use the live production site at `https://exhale.guide`.
- Vercel preview access can wait until a future test needs non-production changes.

## Remaining To-Do

1. Share `https://exhale.guide` with a beta tester and capture anonymized notes in `docs/USER_FEEDBACK.md`.

2. Finish cross-device sync testing once Supabase rate limiting clears: request OTP, confirm the email sends a 6-digit code, sign in on Device B, and verify Practice History, timer length, Circle Size, and sound choice sync.

3. Do a low-light human visual pass: check Home, expanded Session Setup, Practice History count contrast, selected setting readability, and the Settle In exit affordance with phone brightness low.

4. Run one more first-use clarity and rhythm comfort check: "Can you start breathing without thinking?", "Did matching the prompts feel pressuring?", "Did Exhale feel too long?", "Did any sound behavior surprise you?", and "Did Settle In feel optional enough?"

5. After a few synced sessions, review Supabase event counts for timer selections, session starts, Settle In exits, early exits, and completions. Use that to check whether the default timer, sound choice, or first-use flow needs adjustment.

6. Design and build selectable app skins. The current visual direction reads sci-fi and cool; explore a warmer set of user-selectable themes so people can choose the environment that feels safest and most inviting to them.

7. Replace the email OTP-only Practice History sync flow with auth sign-in, so a user can sign in on any device and reliably track Practice History. Make sure the new sign-in flow integrates cleanly with the Supabase database, existing `breathing_sessions`, `user_settings`, and `app_events` records.

8. Improve the in-session sound control for mobile. Make the control easier to notice and tap during a session, and explore a gentle way to clarify iPhone silent-mode behavior when sound appears unavailable.

9. If more testers report breath-timing pressure or a too-long Exhale, test a softer rhythm option such as 4-4-5-8 or a relaxed mode before changing the default 4-4-6-8 pattern.

## Recommended Next Move

Run one focused iPhone follow-up on rhythm comfort and sound control, then capture the notes in `docs/USER_FEEDBACK.md`.
