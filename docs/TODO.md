# Exhale To-Do List

Last updated: June 29, 2026 (distribution, design-pass, and monetization roadmap clarification)

## Completed Rhythm Changes

- Accepted 2026-06-21 clinical-family rhythm feedback plus broad Relax/Pause dislike: visible post-exhale Relax/Pause mechanics are removed; Relax is now only the selectable 4-7-8 rhythm using the legacy `box` storage id.
- Accepted 2026-06-22 owner rhythm direction: picker order is Soft, Box, Flow, Relax; default Soft (`gentle`) is 4-4; Box (`standard`) is 4-4-4-4; Flow remains 4-6; Relax (`box`) remains 4-7-8.
- Settling In now lasts 8 seconds before the first guided inhale.
- The default visible rhythm is now Soft 4-4 (cycle 8s), with Box 4-4-4-4 available as the structured square-breathing option. Box's second Hold after Exhale is a true `hold` phase held at the exhaled-small orb scale, not a rest/relax phase.
- Session breath counts were recalibrated so the 3, 5, 7, and 10 minute labels stay accurate.
- Top-level session length buttons now show only time labels; rhythm-specific timing details live inside each Breathing Sequence option in Session Setup instead of the first decision surface.

## Completed UI Polish

- Sound preview has visible state plus screen-reader status.
- Off is separated from sound textures and uses a mute icon.
- Time, Circle Size, and Sound selected states share one quieter visual language.
- View Sequence and Settings were merged into one Session Setup drawer.
- Session Setup was split into three tabs to reduce density: Pattern, Visual, and Audio.
- Begin remains the only solid green primary action.
- Still is now audibly present.
- Circle Size and Sound live inside Session Setup from the start; the 3-session hiding rule was removed.
- Audio now shows an explicit Off option instead of an icon-only mute control.
- Breathing Sequence options now show proportional phase bars and seconds directly, so the old `Show pattern` disclosure is removed.
- Audio texture choices now show Warm before Air, and Warm is the default background sound.
- When available, Resume now appears directly below Begin and before Session Setup.
- Visual, Audio, and Practice History now use tiny phase-color markers from the orb palette so settings/history feel connected to the breathing object without adding a second accent system.

## Completed Beta Feedback Polish

- Central in-session phase text now uses a softer fill, lighter weight, stronger dark edge contrast, and a subtle local text halo so it reads better over the phase circle without becoming brighter.
- Follow-up readability investigation tested dark text with a light shadow against dimmer orb treatments. The accepted direction is dimmer, less glowy phase orbs plus slightly softer HUD text; dark text helped on the orb center but became fragile around darker circle edges.
- Phase label/instruction changes now crossfade for roughly one second at phase boundaries without adding time to the breathing rhythm.
- Session Complete now shows the selected duration label, for example `3 minutes complete`, instead of exact elapsed seconds such as `2:56 of calm`.
- Meta in-app browser detection, covering Facebook and Messenger, hides the fullscreen button and shows a quiet `Tap menu to open in browser for sound or fullscreen` hint instead of presenting a control that cannot work reliably there.
- Verified the changes with mobile Playwright checks for running session, phase transition, Facebook-preview behavior, and completion copy.
- May 24 pre-tester smoke passed: fresh local visitor sees time choices, Begin, and first-cycle cue without Session Setup; the session reaches Settling In, Inhale, Hold, Exhale, and Relax with `Breathe naturally`; completion shows `3 minutes complete`; returning home after completion reveals `Adjust next session`.
- May 24 `/impeccable critique` scored the first-run flow 31/40. Recommended Impeccable follow-ups are intentionally parked until the next beta test produces signal: `/impeccable clarify Relax phase`, `/impeccable distill active session HUD`, `/impeccable harden Meta in-app browser state`, and `/impeccable onboard first-run cue`.

## Completed Older Low-Vision HUD Readability Hardening (2026-06-08)

Driven by T-2026-06-08-20: an older low-vision phone tester could not read any instruction words on the active-session graphics, despite being able to use a phone for calls and read large-print Kindle books on an iPad.

- `src/components/GameHUD.tsx` now keeps the instruction sentence visible after cycle 2 instead of fading it to zero.
- Phase labels are larger on mobile, semibold, higher opacity, and use lower letter spacing so words are easier to parse.
- Instruction text is larger, higher opacity, and uses lower tracking while preserving the quiet tone.
- The local dark halo behind the HUD text is stronger and slightly wider, improving separation from bright phase colors without introducing a visible card.
- Follow-up owed: ask the same tester to retry the same phone if possible. If the words are still unreadable, promote optional High Visual Contrast / Large Text mode or voice cues from candidate to implementation.

## Completed Marketing/Accessibility Mobile Polish

- Marketing/UX first-pass feedback from T-2026-05-20-09 was logged in `docs/USER_FEEDBACK.md`.
- Graphic designer Full-rhythm and visual soft-cue feedback from T-2026-05-19-08 was logged in `docs/USER_FEEDBACK.md`.
- Home mobile spacing tightened: reduced top padding, reduced mobile home orb/logo footprint by roughly 10%, and compacted the first screen enough to improve iPhone first-viewport fit while preserving large tap targets.
- Home secondary text and controls gained modest contrast increases for older users and low-vision users.
- In-session phase label/instruction stack was compacted, with stronger contrast and text shadow on the instruction line.
- Settling In now uses the same strong phase-label treatment, positioning, and shadowed instruction style as the active session labels so the intro state feels consistent and legible.
- Center-orb timing hierarchy was reinforced: the orb rim is slightly stronger, while the outer guide/progress line and incoming soft cue are lower contrast and less neon so users are less likely to chase the pre-cue.
- First-pass sound trust was hardened: Web Audio no longer reports active if the context remains suspended, and iPhone-class browsers get a timely silent-mode hint after Settling In when sound is active.
- Remaining validation: test sound perception on a real iPhone in normal mode and silent mode, across Safari and the browser used by the tester if possible. Include app-switching away from Safari and back, because tester feedback suggests that may affect perceived sound. Add Facebook's in-app browser on iPhone 14 and Google Pixel/Android to this matrix after T-2026-05-21-10 reported no audio when opening Exhale from a Facebook post inside the Facebook iOS app, and the project owner saw similar Facebook in-app browser behavior on Pixel. Also validate latest Firefox on Windows 11 after a fresh build/profile: Session Setup should default to Warm, while the in-session sound icon may still appear inactive until Web Audio starts from a user gesture.
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

## Completed Session Persistence And Sign-In Discoverability (2026-05-25)

Driven by T-2026-05-25-19: returning synced user could not find OAuth/sign-in because the Practice History link is hidden until a local completed session exists, and the entry-point hint was missing.

- Made the Supabase client's auth config explicit in `src/lib/supabase.ts` (`persistSession`, `autoRefreshToken`, `detectSessionInUrl` all true). These were defaults; stating them documents intent and prevents future option drift.
- Hardened `AuthProvider` bootstrap and `refreshUser` in `src/lib/auth.tsx`: a new `isInvalidSessionError` helper limits the anonymous fallback to actual 401/403 invalidation. Transient errors (network, 5xx, thrown timeouts) now preserve the cached session so synced users do not get bounced out by a momentary connectivity blip on page load. The "deleted user FK violation" guard is preserved for the explicit-invalidation path.
- Added a quiet `Sign In to Sync` link to `src/components/PolicyFooter.tsx`, visible on home, session complete, and stats. The footer now uses `flex-wrap` with paired Privacy/Terms in a single inline-flex group and a standalone sign-in link, so the long label never breaks mid-word at iPhone SE / iPhone 12 widths. Tracking dropped from `0.18em` to `0.14em` to fit all three labels comfortably on one row.
- Did not add a sign-in button on home itself. The "Home is never auth-gated" rule in CLAUDE.md stands; the footer placement keeps the recovery path discoverable without making the first decision feel account-related.
- Lint clean and full Jest suite passes (107/107) after the change. Playwright screenshots at 375 / 390 / 640 px confirm the three-link footer fits without wrap on home and looks clean on stats.

## Completed Google-Only Sign-In Simplification (2026-06-07)

Driven by owner direction after reviewing Shawn Beck's auth recommendation.

- The visible Practice sign-in path is now Google-only. The email-code form is removed from the normal UI; the code-entry state remains only as a legacy bridge if an older email-code confirmation is already pending.
- The Practice section label changed from `Backup & Sync` to `Sign In`.
- The main sign-in copy is now `Sign in to track your history across all devices.`
- The Google action now reads `Sign In With Google` instead of `Continue with Google`.
- The shared footer now reads `Sign In` for anonymous users and `Signed In` for signed-in users. If an anonymous visitor has no local practice history, footer Sign In starts Google directly. If local history exists, it opens Practice first so the user can see the history before connecting it.
- Privacy, terms, product, design, roadmap, deployment, and handoff docs were updated to reflect Google sign-in as the visible path while preserving anonymous-first use.

## Completed Provider Sign-In Expansion (2026-06-29)

Owner-directed auth update: Google remains, Apple and email sign-in are now visible optional choices, and Email Updates consent is opt-in only.

- Practice Sign In now shows Google, Apple, and email sign-in choices below the reflective Practice content.
- Footer Sign In opens Practice instead of auto-launching Google, so users can choose their provider and see the Email Updates checkbox.
- Email Updates is unchecked by default. Consent is stored only when the user checks the box and sign-in completes with a real signed-in email.
- Added `email_update_subscriptions` with RLS for explicit consent storage. Auth email alone is not marketing consent.
- Email sign-in uses Supabase magic link with code-entry fallback for legacy email templates.
- Privacy, terms, product, design, deployment, roadmap, and implementation docs were updated.
- Deployment still needs the migration applied, Apple provider configured in Supabase/Apple Developer, and production/preview provider flows smoke-tested.

## Completed Facebook In-App Orb-Overflow And Meta Hint Copy (2026-05-27)

Driven by T-2026-05-23-14 follow-up on 2026-05-27. Tester reported the breathing orb visibly oversized inside Facebook's in-app browser on Android (Galaxy S26 Ultra), and proposed a more directive Meta-webview hint.

- `src/app/game/page.tsx` game `main` now uses `style={{ height: '100dvh' }}` with `h-screen` retained as the 100vh fallback. On browsers that support dynamic viewport units the main element resolves to the actual visible height, so the canvas no longer extends below Facebook's top bar. Old browsers continue to get `100vh`.
- Real Pixel 9 Pro XL / Android / Facebook-app testing showed a second Large-mode issue: the outer orb ring still clipped horizontally. `src/components/BreathingOrb.tsx` now clamps the canvas max radius and guide-ring spacing against the visible canvas width, preserving Large where there is room and shrinking only enough to keep the guide ring inside the viewport.
- A June 4 owner retest showed the first 14px simulated side gap was still too tight on the real Pixel/Facebook path, with roughly 20px clipped on each side. The clamp now keeps a 40px edge margin and compresses the minimum guide-ring gap before shrinking the core orb.
- Meta in-app browser hint copy updated from `Tap menu to open in browser for sound or fullscreen` to `Tap menu (top-right) for sound and fullscreen`. The positional cue is kept generic; the tester's literal "3 dots in top right" is Android-specific and would not match every iOS Meta-webview build.
- Verified locally at 393×873, 412×915, and 360×640 viewports with Large mode and a faked Facebook in-app user agent. The June 4 clamp keeps the outer guide ring 40px from each canvas edge at Pixel/Facebook widths.
- Real-Facebook validation still owed. The tester is the validator; ask him to retry on the same device and confirm the orb sits within the visible canvas now.
- This addresses the first two Actionable Recommendations from the 2026-05-27 T-2026-05-23-14 follow-up. The pace-too-fast and Relax-as-interruption signals now feed the Box and Flow follow-up loop.

## Completed Box Rhythm Replacement (2026-06-04)

Owner feedback promoted the Relax problem from tester preference to product-model confusion: Flow felt better, and Relax was still cognitively confusing even for the app designer. Full was replaced by Box so the structured alternate uses a familiar square-breathing shape instead of another Relax beat.

- `src/lib/breathing.ts` now exposes Box (`box`) as the third rhythm: 4-4-4-4, 16s cycle, with a second `Hold` after Exhale. Full (`full`) and the older `slow` value normalize to Box for backward compatibility.
- Session-cycle recalibration derives Box counts: quick 11, short 19, medium 26, long 38.
- Home and game URL/localStorage handling now normalize legacy `full` and `slow` values before choosing a rhythm, so old links or saved settings open Box rather than falling back to Steady.
- `supabase/migrations/004-rename-full-to-box.sql` updates synced `user_settings.rhythm` rows from `full`/`slow` to `box`.
- Tests updated for Box registry shape, equal phase timing, duplicate Hold phases, legacy-id normalization, and settings compatibility.
- Authoritative product docs updated: `CLAUDE.md`, `DESIGN.md`, `docs/ROADMAP.md`, `docs/OPEN_QUESTIONS.md`, `docs/USER_FEEDBACK.md`, and `docs/HANDOFF.md`.

## Completed Steady And Full Relax Revisions (2026-05-26)

Owner-directed rhythm adjustment, responsive to repeated Relax-too-long beta signal (T-2026-05-23-14, T-2026-05-23-18, T-2026-05-22-13).

- **Steady** Relax shortened from 8s to 4s. New pattern is 4-4-6-4, cycle 18s, ~3.3 breaths/min. The phase is now a brief breath-back beat rather than the previous "long enough for a full normal breath" framing. This is the default rhythm for first-time users, so the change touches every default session.
- **Full** Relax extended from 4s to 6s. New pattern is 6-6-10-6, cycle 28s, ~2.1 breaths/min. The shape is now more symmetrical (inhale+hold = 12s, exhale+relax = 16s) and the post-exhale beat reads as a deliberate pause rather than a short interruption.
- `recalibrateCycles` in `src/lib/breathing.ts` auto-derives the new sessionCycles so the 3/5/7/10 minute labels stay honest:
  - Steady: quick 10, short 17, medium 23, long 33 (was 8/14/19/27).
  - Full: quick 6, short 11, medium 15, long 21 (was 7/12/16/23).
- Soft (3-2-4-4) and Flow (4-0-6-2) untouched; only the two rhythms named in the request changed.
- Tests in `src/__tests__/breathing.test.ts` and `src/__tests__/useBreathingSession.test.ts` updated for the new boundaries, cycle durations, totalCycles, and phase-window comments. All 107 still pass.
- Authoritative docs updated: `CLAUDE.md`, `PRODUCT.md` (dropped the now-stale `4-4-6-8` reference in favor of "anxiety-sensitive paced breathing patterns"), `DESIGN.md`, `docs/ROADMAP.md`, `docs/OPEN_QUESTIONS.md`. Historical tester observations and Impeccable critiques that quoted the old durations are left intact as point-in-time records.

## Completed Footer Signed-In State And Sync Anchor (2026-05-26)

Driven by project owner refinement on the sign-in footer link.

- `PolicyFooter` is now a client component that reads `useAuth()`. When the user is signed in (`ready && !isAnonymous`), the link reads `Signed In`; otherwise it reads `Sign In to Sync`. The default during the bootstrap window stays on `Sign In to Sync` so anonymous visitors (the common case) do not see a misleading flash of `Signed In`.
- The link target now uses the fragment `/stats#sync` so signed-in users land directly on the Backup & Sync block without re-entering credentials, and anonymous users land where they can sign in. The fragment also scrolls past the practice list when the user already has history.
- `src/app/stats/page.tsx` adds `id="sync"` and `scroll-mt-6` to the Backup & Sync block so the hash anchor scrolls cleanly without clipping under the page top padding.
- aria-label tracks the visible label: `Open practice page; you are signed in` when signed in, `Sign in to sync practice history` otherwise.
- PolicyFooter remains shared across home, session complete, and stats. Privacy and Terms pages do not render it.
- Lint clean and 107/107 tests still passing after the change.

## Completed Mobile Sound Control

- The in-session sound control now sits bottom-center between Pause and Exit, away from the top-right fullscreen toggle.
- The sound control has a 44px mobile tap target, a clearer on/off icon state, and safe-area-aware bottom placement for iPhone.
- After sound is turned on during a session, a short hint appears: "still quiet? check silent mode".

## Completed Discoverability Pass

- Open Graph and Twitter card metadata added to `src/app/layout.tsx`, with `metadataBase: https://exhale.guide` so relative asset URLs resolve correctly.
- Static 1200x630 social preview images at `public/og-image.png`, `public/og-image-v2.png`, and current `public/og-image-v3.png` use the Still Water aesthetic (orb with rings, wordmark, subtle `Begin` cue).
- The earlier dynamic `src/app/opengraph-image.tsx` route was removed because Next's file-based metadata route auto-injected `/opengraph-image?...` as `og:image`, overriding the configured static URL.
- `public/robots.txt` explicitly allows Meta and Facebook crawlers, Twitterbot, LinkedInBot, Slackbot, and general traffic.
- `src/app/sitemap.ts` serves `/sitemap.xml` for the home, privacy, and terms pages, and `public/robots.txt` advertises the sitemap URL.
- `public/BingSiteAuth.xml` supports Bing Webmaster Tools verification. The owner reports Google and Bing verification complete; Bing URL Inspection shows the home URL indexed successfully.
- The home page now has a static Suspense fallback with an Exhale H1 so crawlers see an H1 before client hydration. This addresses Bing's `H1 tag missing` warning without changing the hydrated home UI.
- Vercel firewall: custom Facebook crawler bypass rule plus system bypass rules for observed Meta IP ranges (104.210.140.0/24, 173.252.82.0/24, 173.252.87.0/24, 57.141.18.0/24, 69.63.184.0/24).
- Verified live before the 2026-06-18 cache-bust: 200 responses for `/`, `/robots.txt`, and `/og-image-v2.png`; correct OG meta tags in rendered HTML; Facebook crawler user-agent receives 200 from outside Meta. Current metadata points at `/og-image-v3.png`.
- Troubleshooting walkthrough kept in `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md` for future resume.

## Completed Policy Pages

- `/privacy` now covers anonymous browser identity, local storage, optional Backup & Sync through email code or Google, Supabase storage, lightweight `app_events`, deletion, and the absence of advertising or third-party tracking.
- `/terms` now covers no medical advice, use at your own discretion, optional Backup & Sync, acceptable use, intellectual property, service availability, no warranties, and contact.
- Both pages are reachable directly, linked from the shared policy footer, and styled in the quiet Exhale layout.

## Completed Promoted Priority (2026-05-19)

Alternate rhythm options shipped end to end:

- `RHYTHMS` registry in `src/lib/breathing.ts` with four visible paces: Soft 4-4 (internal id `gentle`, default), Box 4-4-4-4 (internal id `standard`), Flow 4-6, and Relax 4-7-8 (internal id `box` for compatibility). Per-rhythm session-cycle recalibration keeps the 3/5/7/10 minute labels honest.
- Rhythm threaded through `useBreathingSession`, `BreathingOrb`, `GameHUD`, `useAudioEngine`, and `game/page.tsx` via a locked-at-first-render `rhythmRef` pattern.
- Session Setup rhythm picker now uses pattern cards for Soft / Box / Flow / Relax, with proportional phase bars and seconds visible inside each selectable option.
- localStorage key `exhale-rhythm` plus Supabase `user_settings.rhythm` column (migration 002), with isRhythmId guard on parse.
- Back-compat aliases (`BREATHING_PATTERN`, `CYCLE_DURATION`, `SESSION_CYCLES`) removed; all consumers read rhythm-aware data.
- 11 new tests cover the registry shape, cycle recalibration accuracy, getPhaseAtTime boundary behavior with non-default rhythms, and the rhythm-lock invariant.

Two tester-follow-up tasks land here as Stage 0 work below.

## Completed Critique-Driven Polish (2026-05-19)

`/impeccable critique` scored the home page 36/40; three P3 items addressed:

- Renamed the third rhythm `slow` to `full` (label, id, type) and added a per-rhythm one-word `summary` field for aria labels and helper context. Technical signature moved out of the tile and into the connected helper.
- Practice History link now hidden on the home page until at least one completed session exists, so first-visit users see exactly one decision (length) and one action (Begin).
- Rhythm tile sub-labels were removed after mobile review; the latest picker keeps visible context concrete by showing phase bars and seconds inside each pace card rather than in a separate reveal.
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
- Smoke tests in `src/__tests__/useBreathingSession.test.ts` lock the cap behavior per rhythm/phase, including a guard that Box Exhale keeps the full readable 0.8s lead window.
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
- Superseded 2026-06-29: Apple Sign-In is now app-side implemented by owner direction. Apple Developer/Supabase provider setup remains a deployment task.
- Guardrails: no profile screen, avatars, passwords, account settings, premium gate, or auth-first onboarding as part of this task.
- Acceptance completed: the same Supabase user shows Email and Google providers enabled, and a fresh Firefox production session restored practice history through Google sign-in. Keep email-code sync available unless follow-up testing shows it is redundant.

2. Pending follow-up with rhythm-concern testers: ask whether default Soft feels accessible and calming, whether Box feels clear as the structured option, whether Relax's 4-7-8 timing feels calming or too demanding, and whether Flow's no-hold/no-pause loop feels smoother for users who dislike holds. Use the refreshed rhythm follow-up questions in `docs/USER_FEEDBACK.md`. Capture answers in `docs/USER_FEEDBACK.md`.

2a. Superseded 2026-06-21: `Relax` / `Breathe`, `Relax` / `Breathe naturally`, and the brief `Pause` compromise did not resolve the semantics issue. The `rest` phase enum and post-exhale phase object were removed entirely.

2b. Resolved 2026-05-19: the `Next [phase]` HUD text cue was removed because it competed with the central phase label and countdown. Audio pre-cue and ring-color lead remain.

3. Pending feedback/data collection: run one more first-use clarity and rhythm comfort check. Use the refreshed Brand-New User, Session Setup, Flow, Transition Cue Diagnostic, Practice History And Sync, and Targeted Follow-Up Queue question sets in `docs/USER_FEEDBACK.md`. Prior latest-build signal from T-2026-05-19-08 on the old default Quick / Steady path was positive: no gasp/catch-up/strain, default Relax did not interrupt, and the session felt useful. New first-time signal from T-2026-05-21-10 says phase uncertainty caused stress and prevented completion; when asked whether they could tell what phase was coming next without extra text, they answered no, not at all. New clinical-observer signal from T-2026-05-22-13 says Settling In felt too short, Relax read like a possible breathing pause, and a progressive build-up might help. Ask targeted follow-ups before changing durations or rhythm math again.

3a. Pending targeted follow-up with T-2026-05-22-13: clarify whether "at least 5 breaths" means a literal multi-breath settle or simply a longer arrival buffer; whether the 8-second Relax felt like a held pause versus permission to breathe naturally; whether clearer Relax framing would reduce the ramp request; and whether "build up" means a short ease-in over the first few cycles or escalation across the whole session. Do not implement longer Settling In, a progressive rhythm, or a post-exhale Relax phase rename until these answers are captured.

4. Pending feedback/data collection: validate whether the anticipatory transition cues help users keep up with phase shifts. Ask: "Did the color lead or soft pre-cue make the phase changes easier to follow, or did they add noise?" Prior signal from T-2026-05-19-08 was positive on the old default Quick / Steady path: color leads and soft pre-cues were liked and felt natural. Keep testing on the current Soft / Box / Flow / Relax set because T-2026-05-21-10 found phase colors too similar and wanted stronger transition signaling. T-2026-05-23-18 could follow transitions and did not want extra time between phases, so avoid adding global transition seconds unless more evidence appears.

4a. Pending feedback/data collection: validate whether the softened outer guide line now reads as support rather than a timing object to chase. First Full follow-up from T-2026-05-19-08 said the center circle timing was relaxing, but the line could feel like being already behind because it begins before the orb changes. The current implementation lowers guide-line contrast/chroma and strengthens the orb rim; ask the next design-eye tester whether the orb clearly feels primary.

4b. Parked investigation: optional tutorial or stronger self-explanatory orb cues for brand-new users. Trigger: one more first-time tester reports that uncertainty about the next phase caused stress, confusion, or inability to complete the session. Candidate directions: non-blocking "How it works" affordance, more distinct phase colors, phase-specific shape/motion language, or a subtle final-second morph toward the next phase.

4c. Pending feedback/data collection: reproduce Facebook in-app browser audio behavior on iPhone and Android. T-2026-05-21-10 opened Exhale from a Facebook post inside Facebook's iOS in-app browser, with silent switch off, and sound never played. The project owner has seen similar behavior on Google Pixel. Compare Facebook in-app browser against opening the same URL in Safari/Chrome, and note whether tapping the sound button changes anything.

4d. Partially resolved 2026-05-27 by T-2026-05-23-14 follow-up. The same tester reran on Facebook in-app, Messenger in-app, and Brave proper on a Galaxy S26 Ultra and confirmed that aside from fullscreen, performance and core breathing behavior are uniform across containers. A new container-specific bug was reported (orb visibly oversized due to Facebook's top bar compressing the visible viewport while `100vh` still resolved to the un-compressed height); the fix shipped 2026-05-27 by switching the game `main` to `100dvh` with `100vh` as fallback. Still pending: iPhone Facebook/Messenger reproduction, since this tester only verified Android. Continue asking Facebook-opened testers to retry in their external browser before classifying issues as Chrome/Safari/Brave behavior.

4e. Roadmap candidate, not a build task yet: optional spoken voice guidance. T-2026-05-21-11 asked whether a voice could guide breathing along with the visual. On 2026-05-23, T-2026-05-23-14 supported voice narration but warned that an AI voice may create negative perception, and three additional family testers liked the idea of voice. Next step is scoping the smallest voice experiment, likely spoken phase names only, optional and off by default, before implementation.

5. Pending feedback/data collection: recruit a small open beta group (roughly 10 to 20 testers from the target audience) and capture feedback in `docs/USER_FEEDBACK.md`.

6. Pending feedback/data collection: after a meaningful sample of synced sessions, review Supabase `app_events` by pace. `session_started`, `session_complete`, and `session_exited` payloads include `rhythm`, so reads can compare completion rate, return rate, and drop-off phase across Soft / Box / Flow / Relax alongside tester notes.

### Stage 1, ship-quality polish

These can wait until after Stage 0 feedback signal is in.

6a. Resolved 2026-05-20; revised 2026-06-21: Flow originally shipped as 4-0-6-2, then moved to a true 4-6 two-phase loop after later pause-friction feedback. Follow-up with T-2026-05-19-03, -05, -06, -07 on Flow fit is now Stage 0 item 2.

6b. Active open question, not a build task: should rhythms support progressive/ramping shapes rather than only steady patterns? The second independent signal arrived on 2026-05-22 from T-2026-05-22-13, after the original T-2026-05-19-07 competitive-escalation ask. This is now written up in `docs/OPEN_QUESTIONS.md`. Next step is tester clarification, not implementation: determine whether the need is a first-cycle/first-few-cycles ease-in, a whole-session escalation, or mostly a Relax-clarity problem. Preserve the locked-at-start predictability invariant unless a future scoped ramp design explicitly explains the curve before the session starts.

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
- Candidate: Flow 4-6. Keep the current Inhale and Exhale timing because T-2026-05-19-08 said those felt smooth and well-paced.
- Avoid solving this with more explanatory copy. The feedback says the interruption happens too quickly to process, so extra words are unlikely to help.
- Keep parked until Stage 0 Flow follow-up produces a second confirming signal.

6f-1. Conditional default-path Relax revision: evaluate shorter or clearer Steady Relax.

- Trigger: T-2026-05-23-14 found the 8-second Relax potentially counterproductive; T-2026-05-23-18 said Relax took her out of the moment because the pause was too long and did not know whether to hold, breathe deeply, or breathe normally.
- Candidate: before changing durations, test the latest `Breathe naturally` copy and first-cycle cue. If confusion persists, compare a shorter Relax, a square-breathing-style post-exhale hold, and Flow/no-pause variants.
- Guardrail: a post-exhale hold may be recognizable to some users, but it can be less accessible for anxious or breath-capacity-constrained users. Do not replace natural-breathing Relax with an exhale hold without validation.

6g. Resolved 2026-05-20: local Next dev overlay no longer appears from blocked Supabase anonymous auth during visual QA.

- `AuthProvider` now skips automatic Supabase anonymous auth on `localhost` / `127.0.0.1` in development and continues with local-only settings.
- Production, preview domains, and non-local development hosts still use Supabase auth as before.
- Local sync/auth testing remains available by setting `localStorage.setItem('exhale-enable-local-supabase', '1')` and reloading.

6h. Resolved 2026-05-23: smooth the central phase label/instruction transition.

- Trigger: T-2026-05-23-14 reported that phase transitions felt jarring and "popped" rather than easing, despite finding the breathing exercise effective.
- Candidate: a true boundary crossfade where the old instruction fades out and the new one fades in around the zero boundary. Start with roughly 1 second, then tune in browser so it does not make the user feel late.
- Keep separate from the existing color/audio pre-cue work. This is about the perceived swap of the central instruction text itself.
- Constraint: T-2026-05-23-18 could follow the transitions and did not think time between phases needed extension. Keep this visual-only; do not lengthen the rhythm.

6h-1. Resolved 2026-05-23: improve central HUD text readability over the phase circle.

- Trigger: T-2026-05-23-18 said the title and instruction text overlaid on each phase was too bright but still did not contrast well enough with the phase circle color, making it hard to read.
- Candidate: audit the text-over-orb treatment by phase color. Explore placement, edge contrast, shadow, and a subtle local scrim/backdrop that does not become a card. Do not simply raise text opacity.
- Validate on mobile OLED screens and against Hold/Relax colors in particular.

6i. Resolved 2026-05-23: handle Facebook in-app browser fullscreen limitations.

- Trigger: T-2026-05-23-14 reported the top-right fullscreen button did not function in Facebook's in-app preview browser on Android. A follow-up screenshot showed Messenger opens the link in its own in-app browser as well.
- Candidate: when Fullscreen API is unsupported or Meta webview is detected, hide the fullscreen control or replace it with a quiet "open in browser for fullscreen" hint.
- Do not try to force Facebook to open the external browser. External reports are inconsistent and platform-dependent; detection plus guidance is safer.
- 2026-05-24 follow-up: the project owner reported that escaping the Facebook/Messenger browser still does not seem to be working reliably. Broadened the in-session hint to name the browser menu and include both sound and fullscreen: `Tap menu to open in browser for sound or fullscreen`.

6j. Resolved 2026-05-23: revise Session Complete duration copy.

- Trigger: T-2026-05-23-14 chose 3 minutes and found `2:56 of calm` confusing.
- Candidate: show the selected duration label, for example `3 minutes complete`, or remove duration from the completion card and rely on breath cycles plus quote.
- Preserve completion quotes; this tester explicitly liked the quote addition, reinforcing earlier quote-positive feedback.

6k. Resolved 2026-05-23: hide Session Setup until after the first completed session.

- Trigger: T-2026-05-23-14 argued that immediate customization may undermine a guided breathing tool by letting the user change guidance before feeling the default. This conflicts with prior positive customization feedback and the accessibility need for fit controls.
- 2026-05-23 owner note: this idea is worth saving for later. Hiding settings until one completed exercise may reduce first-session friction and distraction while preserving customization after the user has felt the default.
- Technical note: this does not require a login or cookie. Completed sessions already persist locally in `exhale-stats`; settings persist in localStorage via `exhale-session-length`, `exhale-rhythm`, `exhale-orb-scale`, and sound palette storage. If built, derive "has completed one session" from local session count, and fall back to showing setup when localStorage is unavailable.
- Implemented: first-time local visitors see the time picker and Begin only; after one completed local session, the disclosure appears as `Adjust next session`.
- Guardrail: do not lock customization behind an account. The gate is local and anonymous. If localStorage is unavailable, show setup rather than trapping the user in defaults.

6l. Parked Impeccable follow-ups: wait for next beta signal before running.

- `/impeccable clarify Relax phase`: run only if the next tester still finds `Relax` confusing, counterproductive, or like a breath hold after seeing `Breathe naturally`.
- `/impeccable distill active session HUD`: run only if the next tester still reports phase text readability, visual overload, or jarring first-cycle instruction load after the dimmer-orb/HUD pass.
- `/impeccable harden Meta in-app browser state`: run only if another Facebook, Messenger, or Meta in-app browser tester reports audio or capability failure beyond fullscreen.
- `/impeccable onboard first-run cue`: run only after the next tester tells us whether the first-cycle cue helped, felt too instructional, or was ignored.
- Rationale: the current build is a clean testable hypothesis. Do not change Relax timing, HUD density, Meta-webview copy, or first-run cue behavior until fresh tester feedback tells us which branch is real.

6m. Planned SEO optimization pass: make Stage 1 discoverability explicit beyond the already shipped metadata, sitemap, robots, and social-preview work. Scope should include keyword/intent fit for anxiety breathing and paced breathing, title/meta/canonical review, search-result copy, structured data only if it genuinely fits, and performance/indexability checks. Keep the home screen calm and two-tap; do not solve SEO by adding a marketing-heavy landing page or extra first-breath friction.

6n. Planned full Impeccable product-design pass: before public v1/distribution, review the whole active product surface with the relevant Impeccable commands instead of only the already-run audit/critique items. Recommended order:

- `/impeccable critique Exhale product surface` to rescore first-run, active session, completion, Practice, policy/footer, and settings surfaces.
- `/impeccable audit Exhale product surface` for measurable accessibility, performance, responsiveness, theming, and anti-pattern checks.
- `/impeccable typeset Exhale product surface` for the Inter/lightweight hierarchy, low-vision readability, line length, tracking, and body-size decisions.
- `/impeccable layout Exhale product surface` for spacing rhythm, first-viewport fit, Session Setup density, and active-session hierarchy.
- `/impeccable adapt Exhale mobile and PWA contexts` for iOS Safari/PWA, Android Chrome/TWA, Meta in-app browser, touch targets, and viewport behavior.
- `/impeccable harden Exhale product surface` for long text, auth/sync failures, network/offline behavior, empty states, and edge cases.
- `/impeccable clarify Exhale copy` for sign-in, donation, paid-skin, custom-pattern, error, and policy language.
- `/impeccable polish Exhale product surface` as the final pass after fixes land.

Use `/impeccable colorize`, `/impeccable delight`, or `/impeccable overdrive` only for scoped skin proposals, not the default Still Water app. The default app should stay restrained.

6o. Resolved 2026-06-29: app-side auth/sync provider expansion is implemented for Google, Apple, and email sign-in. Remaining work is deployment validation: apply migration `005-email-update-subscriptions.sql`, configure the Apple provider in Supabase/Apple Developer, verify email magic-link templates, and smoke-test provider returns on preview/production.

7. Later, after feedback intake: design a skin system and build the first skin toggle alongside the current "Still Water" aesthetic. Garden is the first candidate direction: sage and moss greens on a soft warm white, organic shapes, sun-through-leaves dappled quality, gentle floral accents. Add a proposal pass for at least two alternative full-app skin/UI overhaul directions before implementation, with `/impeccable shape` run for each candidate. Both free and paid skins must remain disciplined under the design rules: one accent per skin, weight ceiling, no italics, no decorative shadows, strong contrast, and no extra friction before Begin. Secondary-user feedback asked about changing colors; evaluate that through curated skins before considering freeform color controls.

8. Resolved 2026-05-19 for Facebook feed posts: the Facebook preview now renders correctly on shared posts; the Sharing Debugger issue cleared once Meta's cache aged out, matching the working hypothesis. Observed 2026-06-15: Facebook Messenger messages still do not show the rich preview even though Facebook feed posts, Discord, and Telegram do. Treat Messenger as a separate cache/fetch/client-rendering surface and use `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md` before changing metadata again. When the Garden skin lands, consider an updated OG image that shows both aesthetics - that is the only related product-side thread still on the radar.

9. Resolved 2026-05-20: quiet privacy/terms footer added to home, session complete, and stats. See "Completed Policy Footer" section above.

### Stage 2, distribution

Stage 2 comes after the Stage 0 and Stage 1 work above.

10. Package Exhale as an Android Trusted Web Activity and submit to the Play Store. Land this after the Garden skin, feedback-driven changes, and discoverability work.

11. iOS PWA "Add to Home Screen" affordance already exists as a quiet tip on `/stats` (2026-05-19); revisit when wider beta begins to decide if it needs a more prominent surfacing.

12. Native iPhone/iOS Store release is not active, but keep it as a conditional revisit. A Capacitor shell should wait until reception, donations, or paid-theme demand justifies the Apple Developer account cost, native wrapper work, and App Review risk.

### Stage 3, conditional operations and monetization

These wait until Stage 0/1 reception justifies taking money. The free breathing tool must remain useful without payment, sign-in, or subscription.

13. Donation button/page: add a quiet optional donation affordance that links to the owner's PayPal Business account once created. Stripe Payment Link remains a fallback if PayPal is not ready or adds too much friction. Do not place donation in the first-breath path.

14. Freemium model proposal: scope paid unlocks to optional custom breathing patterns and alternative app skins/full UI overhauls. Keep curated breathing patterns, Still Water, local history, and the core session experience free. Avoid premium language on Home, Game, and Complete.

15. Custom breathing-pattern proposal: define the smallest advanced editor that avoids overwhelming first-time users. Likely placement is after at least one completed session, behind Session Setup or Practice, with guardrails for safe phase durations, accessible labels, and a free preset baseline.

16. Paid skin/theme-pack proposal: use the Stage 1 skin proposals to decide which two skins could sit behind the future freemium unlock. Paid skins are aesthetic alternatives, not accessibility fixes; High Visual Contrast or Large Text must stay free if built.

17. Email marketing readiness: collect and use signed-in email addresses for marketing only after explicit opt-in consent. Add privacy copy, unsubscribe handling, an email-service decision, and a consent field/table before any campaign. Auth email alone is not marketing permission.

## Recommended Next Move

Continue beta feedback collection. The best next step is validation, not another rhythm rewrite or Impeccable command run: use the Next Tester Prompt in `docs/USER_FEEDBACK.md`, and ask whether the Pixel/Facebook Large orb clamp, Box vs Flow rhythm choices, Meta-browser sound behavior, low-vision HUD readability hardening, and HUD crossfade pass solve the current friction. Keep no-pause Flow, voice guidance, Garden skin, Android TWA, and parked Impeccable follow-ups behind one more validation pass.
