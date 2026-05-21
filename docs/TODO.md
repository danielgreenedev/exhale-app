# Exhale To-Do List

Last updated: May 21, 2026 (rhythm event-tracking follow-up)

## Completed Rhythm Changes

- Settling In now lasts 8 seconds before the first guided inhale.
- The core rhythm is now 4-4-6-8, with an 8-second Relax phase (internal phase enum `rest`).
- Session breath counts were recalibrated so the 3, 5, 7, and 10 minute labels stay accurate.
- Top-level session length buttons now show only time labels; rhythm-specific timing details stay behind the optional `View timing` reveal instead of the first decision surface.

## Completed UI Polish

- Sound preview has visible state plus screen-reader status.
- Off is separated from sound textures and uses a mute icon.
- Time, Circle Size, and Sound selected states share one quieter visual language.
- View Sequence and Settings were merged into one Session Setup drawer.
- Session Setup was split into three tabs to reduce density: Sequence, Visual, and Audio.
- Begin remains the only solid green primary action.
- Still is now audibly present.
- Circle Size and Sound live inside Session Setup from the start; the 3-session hiding rule was removed.
- Audio now shows an explicit Off option instead of an icon-only mute control.
- `View timing` now reads as a secondary button with a disclosure caret instead of plain text.
- When available, Resume now appears directly below Begin and before Session Setup.

## Completed Marketing/Accessibility Mobile Polish

- Marketing/UX first-pass feedback from T-2026-05-20-09 was logged in `docs/USER_FEEDBACK.md`.
- Graphic designer Full-rhythm and visual soft-cue feedback from T-2026-05-19-08 was logged in `docs/USER_FEEDBACK.md`.
- Home mobile spacing tightened: reduced top padding, reduced mobile home orb/logo footprint by roughly 10%, and compacted the first screen enough to improve iPhone first-viewport fit while preserving large tap targets.
- Home secondary text and controls gained modest contrast increases for older users and low-vision users.
- In-session phase label/instruction stack was compacted, with stronger contrast and text shadow on the instruction line.
- Settling In now uses the same strong phase-label treatment, positioning, and shadowed instruction style as the active session labels so the intro state feels consistent and legible.
- Center-orb timing hierarchy was reinforced: the orb rim is slightly stronger, while the outer guide/progress line and incoming soft cue are lower contrast and less neon so users are less likely to chase the pre-cue.
- First-pass sound trust was hardened: Web Audio no longer reports active if the context remains suspended, and iPhone-class browsers get a timely silent-mode hint after Settling In when sound is active.
- Remaining validation: test sound perception on a real iPhone in normal mode and silent mode, across Safari and the browser used by the tester if possible. Include app-switching away from Safari and back, because tester feedback suggests that may affect perceived sound. Add Facebook's in-app browser on iPhone 14 and Google Pixel/Android to this matrix after T-2026-05-21-10 reported no audio when opening Exhale from a Facebook post inside the Facebook iOS app, and the project owner saw similar Facebook in-app browser behavior on Pixel. Also validate latest Firefox on Windows 11 after a fresh build/profile: Session Setup should default to Air, while the in-session sound icon may still appear inactive until Web Audio starts from a user gesture.
- Open question added: whether Full needs clearer state-specific framing after a resting-heart-rate tester found the 10-second exhale difficult but potentially useful during panic/stress.

## Completed Pre-Commit Impeccable Audit Follow-Up

- Ran `/impeccable audit` against `http://127.0.0.1:3000/`; the local run required the system Chrome executable because Puppeteer's cached browser was unavailable.
- Removed neon/cyan-coded static orb treatments: home, stats, policy, terms, complete, and app icons now use muted radial fills and low-opacity outline rings instead of colored glow box-shadows.
- Replaced pure-black canvas/shadow values with tinted forest-night values (`rgba(15,23,18,...)`) and lightened Forest Night from `#090c0a` to `#0f1712` so dark overlays and shadows stay inside the Still Water palette.
- Reduced sentence/body copy tracking where it was previously 0.10-0.12em, keeping wider tracking reserved for uppercase labels and controls.
- Updated `DESIGN.md` and `CLAUDE.md` so future agents preserve the no-static-glow and no-pure-black rules.
- Audit rerun cleared the neon/static-glow and wide-body-tracking findings. One residual pure-black scanner warning remains, but source search and computed visible styles now show the app background, body, and main surface using tinted Forest Night rather than pure black.

## Completed From Sync And Measurement Follow-Up

- Supabase sync copy now indicates that timer setting, Circle Size, audio choice, and Practice History sync.
- App events are logged for synced users when they select a timer, start a session, exit early through the app, or complete a session.
- Practice completion is still recorded in `breathing_sessions`; behavioral counts now have a lightweight path through `app_events`.

## Completed From Full UI Audit

- Full UI audit was run against the current local UI, with browser checks for Home, Stats, Settling In, and the running breathing page.
- Settling In now has an immediate quiet Exit path, and Escape opens the exit guard during the 8-second buffer.
- Opening the exit guard during Settling In pauses the settle timer; Resume returns to Settling In instead of starting the session behind the dialog.
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
- Settling In, pause length, phase-marker sounds, the main menu structure, and the Circle label were validated as working well.

## Completed Auth Sign-In Sync

- Practice History now has an optional email sign-in flow instead of an OTP-only sync branch.
- New email sign-ins convert the current anonymous Supabase user where possible, preserving existing `breathing_sessions`, `user_settings`, and `app_events` rows under the same user id.
- Existing email sign-ins merge local practice history into the signed-in `breathing_sessions` records and restore synced timer length, Circle Size, and sound choice through `user_settings`.
- Google Backup & Sync is now being added as a sibling provider path, not a replacement for email code sync.

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

- `/privacy` now covers anonymous browser identity, local storage, optional Backup & Sync through email code or Google, Supabase storage, lightweight `app_events`, deletion, and the absence of advertising or third-party tracking.
- `/terms` now covers no medical advice, use at your own discretion, optional Backup & Sync, acceptable use, intellectual property, service availability, no warranties, and contact.
- Both pages are reachable directly, linked from the shared policy footer, and styled in the quiet Exhale layout.

## Completed Promoted Priority (2026-05-19)

Alternate rhythm options shipped end to end:

- `RHYTHMS` registry in `src/lib/breathing.ts` with four visible paces: Steady 4-4-6-8 (internal id `standard`, default), Soft 3-2-4-4 (internal id `gentle`), Full 6-6-10-4, and Flow 4-0-6-2. Per-rhythm session-cycle recalibration keeps the 3/5/7/10 minute labels honest.
- Rhythm threaded through `useBreathingSession`, `BreathingOrb`, `GameHUD`, `useAudioEngine`, and `game/page.tsx` via a locked-at-first-render `rhythmRef` pattern.
- Session Setup rhythm picker now uses label-only pace tiles (Steady / Soft / Full / Flow); the connected helper row is human-first, and technical phase timing stays hidden by default behind `View timing` to avoid intimidating the skeptical primary user.
- localStorage key `exhale-rhythm` plus Supabase `user_settings.rhythm` column (migration 002), with isRhythmId guard on parse.
- Back-compat aliases (`BREATHING_PATTERN`, `CYCLE_DURATION`, `SESSION_CYCLES`) removed; all consumers read rhythm-aware data.
- 11 new tests cover the registry shape, cycle recalibration accuracy, getPhaseAtTime boundary behavior with non-default rhythms, and the rhythm-lock invariant.

Two tester-follow-up tasks land here as Stage 0 work below.

## Completed Critique-Driven Polish (2026-05-19)

`/impeccable critique` scored the home page 36/40; three P3 items addressed:

- Renamed the third rhythm `slow` to `full` (label, id, type) and added a per-rhythm one-word `summary` field for aria labels and helper context. Technical signature moved out of the tile and into the connected helper.
- Practice History link now hidden on the home page until at least one completed session exists, so first-visit users see exactly one decision (length) and one action (Begin).
- Rhythm tile sub-labels were removed after mobile review; label-only tiles leave the connected helper to carry the extra context. The detailed phase list is now hidden by default behind `View timing`.
- Data migration 003 rewrites any cloud `rhythm = 'slow'` values to `'full'`.

## Completed Audit-Driven Polish (2026-05-19)

`/impeccable audit` scored the codebase 19/20; one P1 and three P3 items addressed:

- **P1 contrast bumps**: SessionComplete quote attribution (38% to 55%) and stats sync explanatory copy (42-48% to 55%). Calculated contrast now clears WCAG AA 4.5:1 on body content. Marker, placeholder, and disabled-state opacities remain unchanged (decorative or exempt). DESIGN.md gained the Text Opacity Floor named rule.
- **P3 debounced cloud writes**: 400ms trailing debounce in `queueSettingsSave` batches rapid Circle Size / Sound / Rhythm / Time clicks into a single Supabase upsert. Local writes stay immediate. Pending changes flushed on userId rotation or unmount.
- **P3 particle count scaling**: `BreathingOrb` uses 22 particles on viewports below 600px wide instead of 38, as a defensive perf measure for older mobile GPUs.
- **P3 iOS PWA tip**: `Stats` page detects iOS Safari and shows a one-line Add-to-Home-Screen prompt when the app is not yet in standalone mode, compensating for the missing Fullscreen API on iOS.

## Completed Phase Transition Support (2026-05-19)

Early beta feedback showed that presets alone may not solve phase-boundary friction: users can understand the rhythm but still need a beat to process the shift between Inhale, Hold, Exhale, and Relax.

- Added a final-beat phase lookahead (`PHASE_LOOKAHEAD_SECONDS = 0.8`) that exposes the next phase before the current phase ends.
- Removed the experimental `Next [phase]` HUD cue after it competed with the central phase label and countdown.
- Added a subtle anticipatory sound cue before the regular phase marker.
- Softened canvas phase boundaries with a longer color crossfade and a faint incoming-color guide ring.
- Kept anticipation in the audio pre-cue and ring-color lead; no textual HUD transition cue is shown.
- Kept the underlying rhythm timings unchanged; this is a comprehension/handoff improvement, not a new rhythm.

## Completed Flow Rhythm (2026-05-20)

A fourth rhythm preset shipped end to end, responsive to four converged tester signals on Rest/Hold friction (T-2026-05-19-03, -05, -06, -07):

- `RHYTHMS.flow` added to `src/lib/breathing.ts` with pattern `[4, 0, 6, 2]`, 12s cycle, label `Flow`, summary `Continuous`, and a description framing the no-Hold and brief-Relax shape. Session-cycle recalibration produces 15 / 25 / 35 / 50 cycles for Quick / Short / Medium / Long.
- `RhythmId` union and `isRhythmId` guard accept `'flow'`. Supabase `user_settings.rhythm` is plain text with no enum constraint, so no migration was needed.
- `getNextPhase` updated to skip zero-duration phases. Without this fix the anticipation cue between Inhale and Exhale on Flow would target the zero-duration Hold and never reach Exhale. `getPhaseAtTime` and `getOrbScale` already handled zero-duration phases correctly through the existing strict-less-than boundary check.
- Session Setup rhythm picker switched from a 3-column to a 4-column grid to fit the new tile at mobile width.
- New tests in `src/__tests__/breathing.test.ts` cover the Flow registry shape, the relaxed "Hold/Relax may be zero" duration contract, `getPhaseAtTime` returning Exhale at t=4 in Flow (skipping the zero Hold), the Hold phase index never being active during a Flow cycle, and `getNextPhase` skipping zero-duration phases. Tests now total 89 passing.
- The design sketch's pre-merge validation gate was waived in favor of shipping and collecting post-launch signal. Follow-up with the four frictioned testers on Flow fit lands as Stage 0 item 2.

## Completed Proportional Anticipation Cue Cap (2026-05-20)

Driven by the math in the smoke-test plan and the same "stop showing the same signal three different ways" intent as the visual coherence pass. The 0.8s lead window was occupying 40% of the 2-second Hold on Soft and the 2-second Relax on Flow — the jitter threshold.

- New `getPhaseLookahead(phase)` helper in `src/lib/breathing.ts` returns `Math.min(PHASE_LOOKAHEAD_SECONDS, phase.duration * 0.25)`. Long phases keep the full 0.8s lead; short phases get capped to 25% of their own duration.
- `useBreathingSession` (two call sites) and `BreathingOrb` updated to use the helper.
- Concrete effects: Soft Hold 0.8s → 0.5s; Soft Inhale 0.8s → 0.75s; Flow Relax 0.8s → 0.5s; everything else unchanged.
- 8 new smoke tests in `src/__tests__/useBreathingSession.test.ts` lock the cap behavior per rhythm/phase, including a regression guard for Full Exhale (the imperceptibility-risk phase, where the cap must not engage). 104 tests now pass.
- CLAUDE.md and DESIGN.md updated to describe the per-phase formula and the concrete values.

## Completed Policy Footer (2026-05-20)

TODO 9 closed. Quiet privacy/terms footer surfaced on home, session complete, and stats:

- New `src/components/PolicyFooter.tsx` shared component. 10px uppercase tracking-wide text at 45% white opacity (75% on hover), with `py-2 px-1` providing a comfortable hit area without louder visual weight.
- Mounted on home (after the Practice History link), session complete (below the Back to Menu button), and stats (below the Back link).
- Stays neutral white on all three surfaces — amber stays exclusive to the celebratory orb and Breathe Again button on session complete.

## Completed Visual Coherence Pass (2026-05-19)

Graphic-designer feedback flagged that the active session was showing phase progress too many ways at once. The coordinated TODO 6c pass is now implemented:

- Removed the innermost phase progress ring from `BreathingOrb`; the session ring and outer guide ring remain.
- Made the countdown phase-aware after cycle 1: Inhale/Exhale fade to a quiet 16% visual opacity because the orb scale carries phase progress, while Hold/Relax stay readable at 62% because the orb is static and the timer is load-bearing.
- Dampened the transition flash by phase duration so short phases, especially Soft's 2-second Hold, do not strobe at full amplitude.
- Smoke-tested Steady, Soft, and Full in the browser at mobile width.

## Remaining To-Do

Items are grouped loosely by roadmap stage. See `docs/ROADMAP.md` for the strategic context.

### Stage 0, validation and tester signal

Primary focus: remain in beta feedback mode. Collect feedback and usage data.

1. Resolved 2026-05-20: production Google OAuth restore worked in Firefox after linking Google to the existing email-code user. Practice History restored via `Continue with Google`, and Supabase showed Email and Google enabled on the same user. Continue normal beta observation, but the OAuth implementation project is complete.

1a. Completed promoted work: optional OAuth-backed Backup & Sync inside Practice History.

- Scope: add Google OAuth as a sibling option to the existing email-code sync, using Supabase Auth provider support rather than custom OAuth handling.
- Keep anonymous local use as the default. No sign-in prompt on Home, no auth before breathing, no blocking gate before Practice History can be viewed locally.
- App-side status: initial Google button, OAuth return-error handling, email-code-to-Google linking, privacy copy, terms copy, and deployment setup notes are implemented. Localhost and production Google OAuth have been smoke-tested, including a Firefox production restore after deployment.
- Preserve and merge existing local/anonymous practice history when a user starts Google sync, matching the current Backup & Sync preservation goal. Implementation uses normal Google sign-in from idle/anonymous states and reserves Supabase `linkIdentity()` for the synced email-code `Link Google` state. Practice History now writes the reconciled cloud/local session list back to local storage so the Home counter can reflect synced history after Practice has loaded it.
- Copy direction: frame this as "Backup & Sync" or "Save across devices." It is a persistence affordance, not an account system.
- Portfolio rationale: demonstrates a privacy-first auth architecture suitable for a resume/GitHub project while respecting the app's anonymity promise.
- Future path: Apple Sign-In can follow later if iPhone testers or privacy-sensitive users ask for it; do not take on Apple Developer/account overhead as the first provider.
- Guardrails: no profile screen, avatars, passwords, account settings, premium gate, or auth-first onboarding as part of this task.
- Acceptance completed: the same Supabase user shows Email and Google providers enabled, and a fresh Firefox production session restored practice history through Google sign-in. Keep email-code sync available unless follow-up testing shows it is redundant.

2. Pending follow-up with rhythm-concern testers: ask the original five (T-2026-05-18-01 and T-2026-05-19-02 through -05) whether Soft or Full fits better than Steady did, and ask the four Rest/Hold-frictioned testers (T-2026-05-19-03, -05, -06, -07) whether Flow fits better than their current choice. Use the Flow follow-up questions in `docs/USER_FEEDBACK.md` so the tiny-pause question is asked consistently. Capture answers in `docs/USER_FEEDBACK.md`. Flow shipped on 2026-05-20 without the original pre-merge validation gate; this follow-up is the post-launch validation. First Flow follow-up from T-2026-05-19-08 says no-Hold helps but the 2-second pause feels too fast and interruptive; the same tester explicitly said they would take out the pause.

2a. Resolved 2026-05-19: the Rest phase is now labeled `Relax` with the single-word instruction `Breathe`. The phase enum stays `rest` as the internal discriminator. `Relax` preserves imperative-verb parity with Inhale/Hold/Exhale and reads as permission rather than instruction; the one-word instruction stops the copy from competing with the phase label for attention. See `CLAUDE.md` Core Mechanic and `src/lib/breathing.ts` for the canonical statement.

2b. Resolved 2026-05-19: the `Next [phase]` HUD text cue was removed because it competed with the central phase label and countdown. Audio pre-cue and ring-color lead remain.

3. Pending feedback/data collection: run one more first-use clarity and rhythm comfort check. Use the refreshed Brand-New User, Session Setup, Flow, Transition Cue Diagnostic, and Practice History And Sync question sets in `docs/USER_FEEDBACK.md`. First latest-build signal from T-2026-05-19-08 on default Quick / Steady is positive: no gasp/catch-up/strain, default Relax did not interrupt, and the session felt useful. New first-time signal from T-2026-05-21-10 says phase uncertainty caused stress and prevented completion; when asked whether they could tell what phase was coming next without extra text, they answered no, not at all. Ask the next brand-new tester the same question.

4. Pending feedback/data collection: validate whether the new anticipatory transition cues help users keep up with phase shifts. Ask: "Did the color lead or soft pre-cue make the phase changes easier to follow, or did they add noise?" First latest-build signal from T-2026-05-19-08 is positive on default Quick / Steady: color leads and soft pre-cues were liked and felt natural. Keep testing because the same tester still found Flow's short pause/cue pushy, and T-2026-05-21-10 found phase colors too similar and wanted stronger transition signaling.

4a. Pending feedback/data collection: validate whether the softened outer guide line now reads as support rather than a timing object to chase. First Full follow-up from T-2026-05-19-08 said the center circle timing was relaxing, but the line could feel like being already behind because it begins before the orb changes. The current implementation lowers guide-line contrast/chroma and strengthens the orb rim; ask the next design-eye tester whether the orb clearly feels primary.

4b. Parked investigation: optional tutorial or stronger self-explanatory orb cues for brand-new users. Trigger: one more first-time tester reports that uncertainty about the next phase caused stress, confusion, or inability to complete the session. Candidate directions: non-blocking "How it works" affordance, more distinct phase colors, phase-specific shape/motion language, or a subtle final-second morph toward the next phase.

4c. Pending feedback/data collection: reproduce Facebook in-app browser audio behavior on iPhone and Android. T-2026-05-21-10 opened Exhale from a Facebook post inside Facebook's iOS in-app browser, with silent switch off, and sound never played. The project owner has seen similar behavior on Google Pixel. Compare Facebook in-app browser against opening the same URL in Safari/Chrome, and note whether tapping the sound button changes anything.

4d. Parked investigation: optional spoken voice guidance. T-2026-05-21-11 asked whether a voice could guide breathing along with the visual. Do not build yet; collect whether this repeats and whether it is about accessibility, phase-transition clarity, or preference. If it repeats, evaluate a voice-guided mode or spoken phase names as an optional Audio setting.

5. Pending feedback/data collection: recruit a small open beta group (roughly 10 to 20 testers from the target audience) and capture feedback in `docs/USER_FEEDBACK.md`.

6. Pending feedback/data collection: after a meaningful sample of synced sessions, review Supabase `app_events` by pace. `session_started`, `session_complete`, and `session_exited` payloads include `rhythm`, so reads can compare completion rate, return rate, and drop-off phase across Steady / Soft / Full / Flow alongside tester notes.

### Stage 1, ship-quality polish

These can wait until after Stage 0 feedback signal is in.

6a. Resolved 2026-05-20: Flow rhythm shipped to production (4-0-6-2, 12s cycle, label "Flow", summary "Continuous"). See "Completed Flow Rhythm" section below. The original design-sketch validation gate was waived in favor of shipping and collecting post-launch tester signal; follow-up with T-2026-05-19-03, -05, -06, -07 on Flow fit is now Stage 0 item 2.

6b. Park: do rhythms need to support progressive ramping (each rep longer than the last) rather than only steady patterns? Single-user signal from T-2026-05-19-07. Do not act yet; revisit if a second tester independently asks for escalation or if competitive-framing usage shows up in `app_events`. If raised again, write it up as a full open question in `docs/OPEN_QUESTIONS.md` before any scoping.

6c. Resolved 2026-05-19: visual-coherence pass on the in-session HUD. See Completed Visual Coherence Pass above.

6d. Resolved 2026-05-20: background-tab audio no longer continues indefinitely after a session completes in Chrome.

- Repro reported 2026-05-20: start a breathing exercise in Chrome with background audio on, switch focus to another tab/window, let the session run to completion while Exhale is in the background, and the background audio continues indefinitely until focus returns to the Exhale tab.
- Root cause: completion cleanup was tied to the React/RAF session loop, which Chrome can throttle while a tab is hidden. The Web Audio sources kept playing because the completion effect did not run until focus returned.
- Fix: `useAudioEngine` now exposes `scheduleAmbientStop`, which schedules a fade-out against the Web Audio clock itself. `game/page.tsx` schedules that stop when the guided session begins, using the remaining session duration from `elapsedRef`.
- Expected behavior: ambient audio fades out at the guided-session deadline even if the tab is hidden. Returning focus after completion should show the complete screen with no ongoing audio. Pausing/exiting before completion keeps existing behavior because pause/stop/resume cancel the scheduled audio deadline.

6e. Parked polish: make Session Setup tab-panel titles feel consistent and gently focal.

- Current thought: keep `Background sound` unchanged for now, but later give each tab body a consistent title treatment for `Choose your pace`, `Circle size`, and `Background sound`.
- Goal: add a mild visual cue that says "read this first" without making the drawer louder. Possible directions include a small emerald tick/dot, a softer active-title tint, or a thin connected accent inside the tab panel.
- Do not implement until a later polish pass or tester feedback suggests the tab contents need stronger scanning guidance.

6f. Conditional Flow revision: evaluate a no-pause Flow variant.

- Trigger: at least one more Flow tester independently reports that the 2-second Relax/pause feels rushed, spastic, interruptive, or pulls them out of the continuous Inhale/Exhale loop. T-2026-05-19-08 has already confirmed they would remove the pause; the remaining question is whether that signal repeats beyond one tester.
- Candidate: Flow 4-0-6-0. Keep the current Inhale and Exhale timing because T-2026-05-19-08 said those felt smooth and well-paced.
- Avoid solving this with more explanatory copy. The feedback says the interruption happens too quickly to process, so extra words are unlikely to help.
- Keep parked until Stage 0 Flow follow-up produces a second confirming signal.

6g. Resolved 2026-05-20: local Next dev overlay no longer appears from blocked Supabase anonymous auth during visual QA.

- `AuthProvider` now skips automatic Supabase anonymous auth on `localhost` / `127.0.0.1` in development and continues with local-only settings.
- Production, preview domains, and non-local development hosts still use Supabase auth as before.
- Local sync/auth testing remains available by setting `localStorage.setItem('exhale-enable-local-supabase', '1')` and reloading.

7. Later, after feedback intake: design and build the Garden skin as a toggle alongside the current "Still Water" aesthetic. Aesthetic direction: sage and moss greens on a soft warm white, organic shapes, sun-through-leaves dappled quality, gentle floral accents. Both skins must remain disciplined under the existing design system rules (one accent per skin, weight ceiling, no italics, no decorative shadows). Secondary-user feedback asked about changing colors; evaluate that through a theme/skin system before considering freeform color controls. Run `/impeccable shape Garden skin` before building.

8. Resolved 2026-05-19: the Facebook preview now renders correctly on shared posts; the Sharing Debugger issue cleared once Meta's cache aged out, matching the working hypothesis. Playbook preserved in `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md` for future reference. When the Garden skin lands, consider an updated OG image that shows both aesthetics — that is the only related thread still on the radar.

9. Resolved 2026-05-20: quiet privacy/terms footer added to home, session complete, and stats. See "Completed Policy Footer" section above.

### Stage 2, distribution

Stage 2 comes after the Stage 0 and Stage 1 work above.

10. Package Exhale as an Android Trusted Web Activity and submit to the Play Store. Land this after the Garden skin, feedback-driven changes, and discoverability work.

11. iOS PWA "Add to Home Screen" affordance already exists as a quiet tip on `/stats` (2026-05-19); revisit when wider beta begins to decide if it needs a more prominent surfacing.

## Recommended Next Move

Continue beta feedback collection. The natural next concrete step is following up with the five rhythm-concern testers (item 2 above) to validate whether Soft or Full materially helps. Defer the Garden skin, contrast audit re-check, and distribution work until that signal is in.
