# Exhale To-Do List

Last updated: May 19, 2026

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

## Completed From Full UI Audit

- Full UI audit was run against the current local UI, with browser checks for Home, Stats, Settle In, and the running breathing page.
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
- Commit `fbaf95b` was pushed to both `master` and `preview` with Session Setup, beta feedback capture, default-setting, and Hold-copy polish.

## Completed Local Smoke Test

- Local Home, Begin, Session Setup, running breathing session, exit guard, audio choice selection, Practice History, and sync copy were smoke tested with no browser console errors.
- The latest Vercel preview URL was found, but it currently redirects to Vercel login before the app loads.

## Completed Documentation Polish

- Markdown docs were aligned with the current Next.js version, Resume placement, Session Setup, Supabase tables, Vercel preview access note, and beta handoff flow.
- `docs/USER_FEEDBACK.md` now includes a current test surface and a short beta test prompt.

## Completed Beta Surface Decision

- For the current beta round, testers will use the live production site at `https://exhale.guide`.
- Vercel preview access can wait until a future test needs non-production changes.
- As of May 19, 2026, Exhale is officially in beta feedback mode with two beta testers and the current production build posted on the project owner's Facebook page.
- Facebook's Sharing Debugger still reports a 403/parser issue, but app-side OG metadata and image responses are verified; this is paused as a non-blocking Meta-side issue while cache/state settles.

## Completed iPhone Beta Feedback Follow-Up

- Production iPhone tester notes were captured in `docs/USER_FEEDBACK.md`.
- Hold copy was softened to avoid mentioning strain.
- One low-light iPhone readability pass reported that the color changes were clear and usable.
- Settle In, pause length, phase-marker sounds, the main menu structure, and the Circle label were validated as working well.

## Completed Auth Sign-In Sync

- Practice History now has an optional email sign-in flow instead of an OTP-only sync branch.
- New email sign-ins convert the current anonymous Supabase user where possible, preserving existing `breathing_sessions`, `user_settings`, and `app_events` rows under the same user id.
- Existing email sign-ins merge local practice history into the signed-in `breathing_sessions` records and restore synced timer length, Circle Size, and sound choice through `user_settings`.

## Completed Mobile Sound Control

- The in-session sound control now sits bottom-center between Pause and Exit, away from the top-right fullscreen toggle.
- The sound control has a 44px mobile tap target, a clearer on/off icon state, and safe-area-aware bottom placement for iPhone.
- After sound is turned on during a session, a short hint appears: "still quiet? check silent mode".

## Completed Discoverability Pass

- Open Graph and Twitter card metadata added to `src/app/layout.tsx`, with `metadataBase: https://exhale.guide` so relative asset URLs resolve correctly.
- Static 1200x630 social preview image at `public/og-image.png` using the Still Water aesthetic (orb with rings, wordmark, "4 4 6 8 RHYTHM" callout).
- The earlier dynamic `src/app/opengraph-image.tsx` route was removed because Next's file-based metadata route auto-injected `/opengraph-image?...` as `og:image`, overriding the configured static URL.
- `public/robots.txt` explicitly allows Meta and Facebook crawlers, Twitterbot, LinkedInBot, Slackbot, and general traffic.
- Vercel firewall: custom Facebook crawler bypass rule plus system bypass rules for observed Meta IP ranges (104.210.140.0/24, 173.252.82.0/24, 173.252.87.0/24, 57.141.18.0/24, 69.63.184.0/24).
- Verified live: 200 responses for `/`, `/robots.txt`, and `/og-image.png`; correct OG meta tags in rendered HTML; Facebook crawler user-agent receives 200 from outside Meta.
- Troubleshooting walkthrough kept in `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md` for future resume.

## Completed Policy Pages

- `/privacy` now covers anonymous browser identity, local storage, optional email sync, Supabase storage, lightweight `app_events`, deletion, and the absence of advertising or third-party tracking.
- `/terms` now covers no medical advice, use at your own discretion, acceptable use, intellectual property, service availability, no warranties, and contact.
- Both pages are reachable directly and have quiet Exhale-styled layouts; they still need to be surfaced from the main app UI.

## Remaining To-Do

Items are grouped loosely by roadmap stage. See `docs/ROADMAP.md` for the strategic context.

### Promoted Priority, Alternate Rhythm Options

Pulled forward from Stage 1 on 2026-05-19. Five of six recent beta testers reported rhythm-fit concerns, including one (T-2026-05-19-05) who could not follow the rhythm without gasping (capacity, not preference). The default 4-4-6-8 stays; this work adds selectable alternates so the rhythm conversation stops dominating other product feedback. Runs in parallel with Stage 0 feedback collection.

1. Design at least two alternate rhythm options. Starting points:
   - A gentler option with shorter total cycle, lighter holds, and a more permissive exhale, for capacity-constrained users (signal: T-2026-05-19-05).
   - A slower-deeper option with longer inhale, longer hold, and much longer exhale, for users with existing breathwork preference (signal: T-2026-05-19-04).
2. Refactor `BREATHING_PATTERN` in `src/lib/breathing.ts` to support multiple named patterns instead of a single constant. Each pattern needs its own phase durations and cycle-count recalibration so the 3, 5, 7, 10 minute labels remain accurate.
3. Add a rhythm selector inside Session Setup, alongside Circle Size and Sound, using the same quiet emerald selected-state language. Default remains 4-4-6-8.
4. Persist rhythm choice in Supabase `user_settings` alongside `session_length`, `orb_scale`, and `sound_palette`. Update `settingsSync` to round-trip the new column.
5. Follow up with the original five testers once the alternates ship; ask whether one of the new options fits better and capture answers in `docs/USER_FEEDBACK.md`.

### Stage 0, validation and tester signal

Primary focus: remain in beta feedback mode. Collect feedback and usage data while the Promoted Priority work above proceeds in parallel.

6. Pending feedback/data collection: test cross-device sync on Device B and verify Practice History, timer length, Circle Size, and sound choice sync correctly through Supabase.

7. Pending feedback/data collection: run one more first-use clarity and rhythm comfort check: "Can you start breathing without thinking?", "Did matching the prompts feel pressuring?", "Did Exhale feel too long?", "Did any sound behavior surprise you?", and "Did Settle In feel optional enough?"

8. Pending feedback/data collection: recruit a small open beta group (roughly 10 to 20 testers from the target audience) and capture feedback in `docs/USER_FEEDBACK.md`.

9. Pending feedback/data collection: after a meaningful sample of synced sessions, review Supabase `app_events` counts (timer selections, session starts, Settle In exits, early exits, completions). Watch completion rate, return rate, and drop-off phase.

### Stage 1, ship-quality polish

These can wait until after the Promoted Priority and Stage 0 work are complete.

10. Later, after feedback intake: design and build the Garden skin as a toggle alongside the current "Still Water" aesthetic. Aesthetic direction: sage and moss greens on a soft warm white, organic shapes, sun-through-leaves dappled quality, gentle floral accents. Both skins must remain disciplined under the existing design system rules (one accent per skin, weight ceiling, no italics, no decorative shadows). Run `/impeccable shape Garden skin` before building.

11. Confirm Facebook's Sharing Debugger renders the preview after their scrape cache clears. App side is verified working; the remaining loose end is Meta-side cache only. Resume playbook lives in `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md`. When the Garden skin lands, consider an updated OG image that shows both aesthetics.

12. Not a priority for now: add a UI affordance linking the main pages to `/privacy` and `/terms`. Likely a small footer link from home, game complete, and stats in keeping with the quiet aesthetic, but a more prominent button could also fit. The pages exist and are reachable; they are not surfaced from any other screen yet.

13. Wait until after feedback intake: color contrast audit on text at low opacity (white/28 to 38 against forest-night). May fall below WCAG 2.1 AA. Run `/impeccable audit` before considering Stage 2.

### Stage 2, distribution

Stage 2 comes after the validation and ship-quality polish work above.

14. Package Exhale as an Android Trusted Web Activity and submit to the Play Store. Land this after the Garden skin, feedback-driven changes, and discoverability work.

15. Add a quiet PWA "Add to Home Screen" affordance for iOS. No native shell; iOS Store deployment is deferred (see ROADMAP).

## Recommended Next Move

Begin the Promoted Priority work (alternate rhythm options) in parallel with continued beta feedback collection. Defer the Garden skin, policy-page surfacing, contrast audit, and distribution work until the Promoted Priority and Stage 0 work are complete.
