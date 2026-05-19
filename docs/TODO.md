# Exhale To-Do List

Last updated: May 19, 2026 (Facebook reply intake; Rest label resolved; Flow rhythm parked)

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
- Static 1200x630 social preview image at `public/og-image.png` using the Still Water aesthetic (orb with rings, wordmark, subtle `Begin` cue).
- The earlier dynamic `src/app/opengraph-image.tsx` route was removed because Next's file-based metadata route auto-injected `/opengraph-image?...` as `og:image`, overriding the configured static URL.
- `public/robots.txt` explicitly allows Meta and Facebook crawlers, Twitterbot, LinkedInBot, Slackbot, and general traffic.
- Vercel firewall: custom Facebook crawler bypass rule plus system bypass rules for observed Meta IP ranges (104.210.140.0/24, 173.252.82.0/24, 173.252.87.0/24, 57.141.18.0/24, 69.63.184.0/24).
- Verified live: 200 responses for `/`, `/robots.txt`, and `/og-image.png`; correct OG meta tags in rendered HTML; Facebook crawler user-agent receives 200 from outside Meta.
- Troubleshooting walkthrough kept in `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md` for future resume.

## Completed Policy Pages

- `/privacy` now covers anonymous browser identity, local storage, optional email sync, Supabase storage, lightweight `app_events`, deletion, and the absence of advertising or third-party tracking.
- `/terms` now covers no medical advice, use at your own discretion, acceptable use, intellectual property, service availability, no warranties, and contact.
- Both pages are reachable directly and have quiet Exhale-styled layouts; they still need to be surfaced from the main app UI.

## Completed Promoted Priority (2026-05-19)

Alternate rhythm options shipped end to end:

- `RHYTHMS` registry in `src/lib/breathing.ts` with three rhythms: Standard 4-4-6-8 (default), Gentle 3-2-4-4, Full 6-6-10-4. Per-rhythm session-cycle recalibration keeps the 3/5/7/10 minute labels honest.
- Rhythm threaded through `useBreathingSession`, `BreathingOrb`, `GameHUD`, `useAudioEngine`, and `game/page.tsx` via a locked-at-first-render `rhythmRef` pattern.
- Session Setup rhythm picker with one-word relative descriptors (Balanced / Easier / Longer); technical phase signature kept in title/aria-label but not visible by default, to avoid intimidating the skeptical primary user.
- localStorage key `exhale-rhythm` plus Supabase `user_settings.rhythm` column (migration 002), with isRhythmId guard on parse.
- Back-compat aliases (`BREATHING_PATTERN`, `CYCLE_DURATION`, `SESSION_CYCLES`) removed; all consumers read rhythm-aware data.
- 11 new tests cover the registry shape, cycle recalibration accuracy, getPhaseAtTime boundary behavior with non-default rhythms, and the rhythm-lock invariant.

Two tester-follow-up tasks land here as Stage 0 work below.

## Completed Critique-Driven Polish (2026-05-19)

`/impeccable critique` scored the home page 36/40; three P3 items addressed:

- Renamed the third rhythm `slow` to `full` (label, id, type) and added a per-rhythm one-word `summary` field used as the visible tile sub-label. Technical signature moves to title and aria-label.
- Practice History link now hidden on the home page until at least one completed session exists, so first-visit users see exactly one decision (length) and one action (Begin).
- Tile sub-label styling unified with the time-button sub-label (text-[10px] tracking-[0.08em]).
- Data migration 003 rewrites any cloud `rhythm = 'slow'` values to `'full'`.

## Completed Audit-Driven Polish (2026-05-19)

`/impeccable audit` scored the codebase 19/20; one P1 and three P3 items addressed:

- **P1 contrast bumps**: SessionComplete quote attribution (38% to 55%) and stats sync explanatory copy (42-48% to 55%). Calculated contrast now clears WCAG AA 4.5:1 on body content. Marker, placeholder, and disabled-state opacities remain unchanged (decorative or exempt). DESIGN.md gained the Text Opacity Floor named rule.
- **P3 debounced cloud writes**: 400ms trailing debounce in `queueSettingsSave` batches rapid Circle Size / Sound / Rhythm / Time clicks into a single Supabase upsert. Local writes stay immediate. Pending changes flushed on userId rotation or unmount.
- **P3 particle count scaling**: `BreathingOrb` uses 22 particles on viewports below 600px wide instead of 38, as a defensive perf measure for older mobile GPUs.
- **P3 iOS PWA tip**: `Stats` page detects iOS Safari and shows a one-line Add-to-Home-Screen prompt when the app is not yet in standalone mode, compensating for the missing Fullscreen API on iOS.

## Completed Phase Transition Support (2026-05-19)

Early beta feedback showed that presets alone may not solve phase-boundary friction: users can understand the rhythm but still need a beat to process the shift between Inhale, Hold, Exhale, and Rest.

- Added a final-beat phase lookahead (`PHASE_LOOKAHEAD_SECONDS = 0.8`) that exposes the next phase before the current phase ends.
- Added a quiet `Next [phase]` HUD cue so the label leads the motion without replacing the current instruction early.
- Added a subtle anticipatory sound cue before the regular phase marker.
- Softened canvas phase boundaries with a longer color crossfade and a faint incoming-color guide ring.
- Kept the underlying rhythm timings unchanged; this is a comprehension/handoff improvement, not a new rhythm.

## Remaining To-Do

Items are grouped loosely by roadmap stage. See `docs/ROADMAP.md` for the strategic context.

### Stage 0, validation and tester signal

Primary focus: remain in beta feedback mode. Collect feedback and usage data.

1. Pending feedback/data collection: test cross-device sync on Device B and verify Practice History, timer length, Circle Size, sound choice, and rhythm sync correctly through Supabase.

2. Pending follow-up with the original five rhythm-concern testers (T-2026-05-18-01 and T-2026-05-19-02 through -05). Ask whether Gentle or Full fits better than Standard did. Capture answers in `docs/USER_FEEDBACK.md`.

2a. Resolved 2026-05-19: the Rest phase is now labeled `Relax` with the single-word instruction `Breathe`. The phase enum stays `rest` as the internal discriminator. `Relax` preserves imperative-verb parity with Inhale/Hold/Exhale and reads as permission rather than instruction; the one-word instruction stops the copy from competing with the phase label for attention. See `CLAUDE.md` Core Mechanic and `src/lib/breathing.ts` for the canonical statement.

2b. Resolved 2026-05-19: the `Next [phase]` HUD text cue was removed because it competed with the central phase label and countdown. Audio pre-cue and ring-color lead remain.

3. Pending feedback/data collection: run one more first-use clarity and rhythm comfort check: "Can you start breathing without thinking?", "Did matching the prompts feel pressuring?", "Did Exhale feel too long?", "Did any sound behavior surprise you?", and "Did Settle In feel optional enough?"

4. Pending feedback/data collection: validate whether the new anticipatory transition cues help users keep up with phase shifts. Ask: "Did the Next cue, color lead, or soft pre-cue make the phase changes easier to follow, or did they add noise?"

5. Pending feedback/data collection: recruit a small open beta group (roughly 10 to 20 testers from the target audience) and capture feedback in `docs/USER_FEEDBACK.md`.

6. Pending feedback/data collection: after a meaningful sample of synced sessions, review Supabase `app_events` counts (timer selections, session starts, Settle In exits, early exits, completions). Watch completion rate, return rate, and drop-off phase.

### Stage 1, ship-quality polish

These can wait until after Stage 0 feedback signal is in.

6a. Sketch a Hold-less "Flow" rhythm candidate driven by the Rest/Hold-friction signal (T-2026-05-19-03, -05, -06, -07). Working shape: 4-0-6-2 or 4-0-6-0 — Inhale, no Hold, Exhale, brief or zero Relax. Design blockers to think through before any code: `getPhaseAtTime` in `src/lib/breathing.ts` and the `BreathingOrb` animation currently assume every phase has duration greater than zero, so a 0-second phase needs explicit handling (either skip the index or treat as an instantaneous transition). Cycle recalibration math also needs to tolerate shorter total cycles without recommending impractically high cycle counts for the long session length. Goal of the sketch is a design proposal in `docs/OPEN_QUESTIONS.md`, not a shipped preset; ship only if the Rest/Hold-frictioned testers prefer it.

6b. Park: do rhythms need to support progressive ramping (each rep longer than the last) rather than only steady patterns? Single-user signal from T-2026-05-19-07. Do not act yet; revisit if a second tester independently asks for escalation or if competitive-framing usage shows up in `app_events`. If raised again, write it up as a full open question in `docs/OPEN_QUESTIONS.md` before any scoping.

7. Later, after feedback intake: design and build the Garden skin as a toggle alongside the current "Still Water" aesthetic. Aesthetic direction: sage and moss greens on a soft warm white, organic shapes, sun-through-leaves dappled quality, gentle floral accents. Both skins must remain disciplined under the existing design system rules (one accent per skin, weight ceiling, no italics, no decorative shadows). Run `/impeccable shape Garden skin` before building.

8. Confirm Facebook's Sharing Debugger renders the preview after their scrape cache clears. App side is verified working; the remaining loose end is Meta-side cache only. Resume playbook lives in `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md`. When the Garden skin lands, consider an updated OG image that shows both aesthetics.

9. Not a priority for now: add a UI affordance linking the main pages to `/privacy` and `/terms`. Likely a small footer link from home, game complete, and stats in keeping with the quiet aesthetic, but a more prominent button could also fit. The pages exist and are reachable; they are not surfaced from any other screen yet.

### Stage 2, distribution

Stage 2 comes after the Stage 0 and Stage 1 work above.

10. Package Exhale as an Android Trusted Web Activity and submit to the Play Store. Land this after the Garden skin, feedback-driven changes, and discoverability work.

11. iOS PWA "Add to Home Screen" affordance already exists as a quiet tip on `/stats` (2026-05-19); revisit when wider beta begins to decide if it needs a more prominent surfacing.

## Recommended Next Move

Continue beta feedback collection. The natural next concrete step is following up with the five rhythm-concern testers (item 2 above) to validate whether Gentle or Full materially helps. Defer the Garden skin, contrast audit re-check, and distribution work until that signal is in.
