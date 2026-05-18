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
- View Sequence is more compact.
- Begin remains the only solid green primary action.
- Still is now audibly present.
- After 3 completed sessions, Circle Size and Sound move into a quiet Settings disclosure.

## Completed From Sync And Measurement Follow-Up

- Supabase sync copy now indicates that timer setting, Circle Size, audio choice, and Practice History sync.
- App events are logged for signed-in synced users when they select a timer, start a session, exit early through the app, or complete a session.
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

## Completed Local Smoke Test

- Local Home, Begin, View Sequence, running breathing session, exit guard, Settings disclosure, audio choice selection, Practice History, and sync copy were smoke tested with no browser console errors.
- The latest Vercel preview URL was found, but it currently redirects to Vercel login before the app loads.

## Remaining To-Do

1. Make the latest Vercel preview accessible to testers, either by disabling preview authentication for this project/branch or sharing a Vercel bypass/protection link, then rerun the preview smoke test before touching `master`.

2. Share the preview URL with a beta tester and capture anonymized notes in `docs/USER_FEEDBACK.md`.

3. Finish cross-device sync testing once Supabase rate limiting clears: request OTP, confirm the email sends a 6-digit code, sign in on Device B, and verify Practice History, timer length, Circle Size, and sound choice sync.

4. Do a low-light human visual pass: check Home, expanded View Sequence, Practice History count contrast, selected setting readability, and the Settle In exit affordance with phone brightness low.

5. Run one more first-use clarity check: "Can you start breathing without thinking?", "Did any sound behavior surprise you?", and "Did Settle In feel optional enough?"

6. After a few synced sessions, review Supabase event counts for timer selections, session starts, Settle In exits, early exits, and completions. Use that to check whether the default timer, sound choice, or first-use flow needs adjustment.

7. Review and polish the Markdown documents for consistency, current product language, deployment accuracy, and clean handoff notes.

## Recommended Next Move

Fix preview access, rerun the smoke test on the actual Vercel preview, then share that same preview URL with the beta tester. Cross-device sync can wait until Supabase email rate limiting clears.
