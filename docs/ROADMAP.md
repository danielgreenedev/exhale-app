# Exhale Roadmap

Last updated: June 29, 2026

Exhale is organized around learning gates, not feature batches. Each stage carries one question: do we have enough signal to invest in the next stage? Engineering effort follows validation.

Project goal: a free tool that helps people learn paced breathing as an anxiety coping skill. Always free. Monetization is conditional and intentionally deferred.

## Stage 0, Validate (in progress)

Confirm the premise: does the right kind of person find this useful?

- Done: first iPhone tester (May 2026); rhythm, sound, and mobile control feedback addressed.
- Done: second unrelated tester reported it helpful.
- Current: beta feedback mode is active with two beta testers, and the current production build has been posted on the project owner's Facebook page.
- Note: Facebook link-preview scraping still has a 403/parser issue despite verified app-side Open Graph metadata. Treat it as non-blocking unless Facebook sharing becomes important to beta acquisition.
- Recruit roughly 10 to 20 testers from the target audience (people who do not normally use self-care apps).
- Watch Supabase `app_events` for completion rate, return rate, and drop-off phase.
- Current build-quality investment: optional Google, Apple, and email sign-in for history across devices is app-side complete; continue validating beta feedback and retention signal.
- Decide if real retention signal exists before investing more engineering.

Gate: roughly ten testers, mostly target-audience, with at least one signal of return use.

## Promoted Priority, Optional Provider Sign In (Google complete 2026-05-20, expanded 2026-06-29)

Pulled into the current phase for two reasons: product reliability and portfolio polish.

Product framing:

- Exhale still starts anonymous and local-first. No authentication before breathing and no OAuth prompt before first use.
- Google, Apple, and email sign-in are the visible paths for users who want history across devices. Email-code verification is retained only as a legacy/recovery bridge.
- The goal is reliable cross-device continuity for practice history, timer length, Circle Size, sound choice, and rhythm.
- The feature should be presented as "Sign In" with a practical history-across-devices description, not as a profile, social account, or onboarding step.

Technical/product rationale:

- Developer feedback from Shawn Beck recommended proper OAuth on Practice History so users can persist data more reliably.
- Google and Apple OAuth are handled through Supabase Auth provider support, and email sign-in uses Supabase magic links with legacy code-entry fallback.
- Optional OAuth creates a cleaner path if premium features or subscriptions ever become relevant, while monetization remains conditional and deferred.
- From a portfolio/resume perspective, this demonstrates privacy-first auth architecture: anonymous local use by default, optional OAuth-backed persistence when the user asks for it.

Risks to guard:

- A "Sign in with Google" button can weaken the perceived anonymity promise if it appears too early or too loudly.
- OAuth adds third-party provider dependency for synced users. Non-synced users must remain unaffected.
- Do not add profile screens, avatars, passwords, account settings, or auth-first navigation as part of this work.

Success shape:

- Complete: Practice History offers Google, Apple, and email sign-in as visible optional sign-in choices.
- Complete: existing anonymous/local data is preserved and merged when a user signs in.
- Complete: privacy copy states what syncs and makes clear that breathing remains usable without any sign-in.
- Complete: `/privacy` and `/terms` explain optional OAuth provider involvement and the anonymous-first philosophy in plain language.
- Complete: implementation uses Supabase Auth provider support rather than custom OAuth handshakes. App-side wiring uses normal provider sign-in from idle/anonymous states, and reserves `linkIdentity()` for already signed-in non-anonymous users.
- Pending deployment validation: Apple provider credentials must be configured in Supabase/Apple Developer, the new email-update consent migration must be applied, and email magic-link templates must be verified.

## Promoted Priority, Alternate Rhythm Options (complete 2026-05-19)

Pulled forward from Stage 1 after five of six recent beta testers reported rhythm-fit concerns (see `docs/USER_FEEDBACK.md`). T-2026-05-19-05 specifically could not follow the rhythm without gasping, which was treated as a comfort and capacity signal, not preference.

Shipped:

- Four selectable paces surfaced inside Session Setup, with concrete pattern cards that show proportional phase bars and seconds:
  - **Soft** (`gentle`) — 4-4, 8s cycle. Default for first-time users; no holds, just an easy in and out.
  - **Box** (`standard`) — 4-4-4-4, 16s cycle. Structured square-breathing option; the second Hold after Exhale stays at the exhaled orb scale.
  - **Flow** (`flow`) — 4-6, 10s cycle. No hold or pause, just inhale and longer exhale.
  - **Relax** (`box`) — 4-7-8, 19s cycle. Classic structured option; the storage id remains `box` for compatibility.
- Per-rhythm cycle counts recalibrated so all four minute labels stay close to their targets.
- Rhythm threads through `useBreathingSession`, `BreathingOrb`, `GameHUD`, `useAudioEngine`, and `game/page.tsx` via a Rhythm object captured at first render.
- Local persistence through `exhale-rhythm` localStorage key; cloud round-trip through `user_settings.rhythm` (Supabase migrations 002-004).
- Picking a pace shows the pattern inside the selected option; there is no separate `Show pattern` / `View timing` disclosure.

The next signal worth gathering: ask testers whether default Soft feels accessible and calming, whether Box feels clear as the structured option, whether Flow works for users who dislike holds but want a longer exhale, and whether Relax's 4-7-8 timing feels calming or too demanding.

## Stage 1, Ship-quality polish

Make Exhale feel like a "v1 you would link publicly."

- Garden warmer skin, with floral accents and a sun-through-leaves character. Toggle between this and the current "Still Water" aesthetic.
- Skin-system proposal pass: shape at least two alternative full-app skin or UI overhaul directions, including Garden as one candidate, before deciding which are free defaults, donations incentives, or future paid theme-pack unlocks. Each proposal must preserve a complete free app, the two-tap Begin path, and accessibility contrast rules.
- Discoverability and SEO optimization: Open Graph tags, social card image, meta description, friendly page title, sitemap, robots, canonical URLs, keyword/intent fit for anxiety breathing and paced breathing, and search-result copy. Existing metadata/social-preview plumbing is the baseline; the remaining SEO pass should improve organic search discoverability without turning the home screen into a marketing page or adding friction before the first breath.
- Full Impeccable product-design pass before public v1/distribution: rerun design critique and technical audit, then cover typography (`typeset`), spacing and hierarchy (`layout`), mobile/platform behavior (`adapt`), edge cases (`harden`), copy (`clarify`), and final ship polish (`polish`). Use `shape` for the two skin proposals before any skin build.
- Privacy policy page and terms of use page; footer links from main pages.
- Color contrast audit on text at low opacity (white/28 to 38 against forest-night).
- In-session HUD readability audit by phase color: title/instruction text must remain readable over Inhale, Hold, and Exhale circles without becoming glaring. June 8 low-vision phone feedback promoted this from polish to accessibility. Default HUD text hardening is shipped; still validate whether optional High Visual Contrast / Large Text is needed.
- Accessibility candidates, after targeted validation:
  - **High Visual Contrast**: optional visual mode that makes phase colors and cues easier to tell apart for colorblind users, low-vision users, and first-time users who cannot distinguish phase changes quickly enough. Prefer stronger color separation plus non-color cue differences over a generic "colorblind mode" label.
  - **Voice Cues**: optional Audio setting that speaks only phase names (`Inhale`, `Hold`, `Exhale`) for blind users, screen-reader users, or testers who need non-visual guidance. Keep off by default and separate from background sound. Validate human-recorded or very neutral voice treatment before shipping; beta feedback now includes explicit concern that an obviously AI voice could hurt trust.
- Auth/sync provider expansion: Google, Apple, and email sign-in are now app-side visible choices. Deployment still needs Apple provider configuration, email template verification, and production validation. Any future auth work must keep anonymous local use as the default and must update `/privacy` and `/terms` in the same change.
- Ongoing polish in response to beta feedback.

## Stage 2, Distribution

Reach beyond direct URL sharing.

- Android via Trusted Web Activity (Play Store), after the Garden skin and discoverability work land.
- PWA "Add to Home Screen" prompt or hint on iOS; no native shell.
- Native iPhone/iOS Store release remains conditional. The current path is PWA-first on iOS because the Apple Developer fee, native shell work, and App Review risk are not justified for Stage 0/1. Revisit a Capacitor iOS shell only if reception, donations, or paid-theme demand clearly justify it.

## Stage 3, Operations And Monetization (conditional)

Only if Stage 0 and Stage 1 reception data justifies. Always preserve a fully featured free version.

- Small private admin/support panel, only when Supabase Dashboard plus docs stop being enough. Preferred first version: a custom protected Next.js route backed by Supabase, not Payload. First useful scope: synced-user deletion/support lookup, beta/tester event review, retention/drop-off summaries, and lightweight content management if completion quotes or themes become hard to maintain manually. Revisit Payload only if CMS-style editing grows beyond what a small custom panel should own.
- Donation button/page, with PayPal Business link as the owner-preferred path once the business PayPal account exists. Stripe Payment Link remains a backup if PayPal adds friction. The donation affordance must be quiet, optional, and never appear before the user can start breathing.
- Freemium model exploration for two optional feature classes only: custom breathing patterns and alternative app skins/full UI overhauls. The free app must keep curated breathing patterns, Still Water, local history, and the full breathing session experience. No account, payment, or subscription prompt before breathing.
- Theme-pack purchase option; the Stage 1 skin proposal/build work unlocks this. Paid skins can be aesthetic alternatives, not required accessibility fixes.
- Email marketing readiness for signed-in users, only with explicit opt-in consent. Auth email addresses are not automatically marketing permission; this needs privacy copy, unsubscribe handling, and an email-service decision before any campaign.
- B2B or therapist licensing, only if a clear customer surfaces.
- LLC formation, only when about to take money.

## Stage 4, Scale

Far future. Marketing, partnerships, content. Intentionally undefined until earlier stages produce evidence.

## Deliberately deferred

These have been considered and are not on the active roadmap unless something changes:

- iOS Store deployment. See Stage 2 reasoning.
- Required accounts, required login, or any authentication before breathing. Violates the anonymous-first promise in `PRODUCT.md`.
- Marketing email without explicit consent from the signed-in user.
- Push notifications, social features, streaks-as-pressure. Explicit anti-features in `PRODUCT.md`.
- Health, medical, or therapeutic claims. Exhale teaches a breathing pattern; it does not treat anything.
