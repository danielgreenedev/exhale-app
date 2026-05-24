# Exhale Roadmap

Last updated: May 23, 2026

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
- Current build-quality investment: optional OAuth-backed Backup & Sync is complete; continue validating beta feedback and retention signal.
- Decide if real retention signal exists before investing more engineering.

Gate: roughly ten testers, mostly target-audience, with at least one signal of return use.

## Promoted Priority, Optional OAuth Backup & Sync (complete 2026-05-20)

Pulled into the current phase for two reasons: product reliability and portfolio polish.

Product framing:

- Exhale still starts anonymous and local-first. No authentication before breathing, no account gate on the home screen, and no OAuth prompt during first use.
- Practice History already contains optional email-code sync. OAuth is an additional Backup & Sync path for users who have already chosen persistence.
- The goal is reliable cross-device continuity for practice history, timer length, Circle Size, sound choice, and rhythm.
- The feature should be presented as "Backup & Sync" or "Save across devices," not as a profile, social account, or onboarding step.

Technical/product rationale:

- Developer feedback from Shawn Beck recommended proper OAuth on Practice History so users can persist data more reliably.
- Google OAuth is a practical first provider because Supabase Auth can manage the provider flow, sessions, and identity linking without a custom auth backend.
- Apple Sign-In is privacy-aligned because of Hide My Email, but it adds Apple Developer account overhead and provider setup. Defer until iPhone testers or privacy-sensitive users ask for it.
- Optional OAuth creates a cleaner path if premium features or subscriptions ever become relevant, while monetization remains conditional and deferred.
- From a portfolio/resume perspective, this demonstrates privacy-first auth architecture: anonymous local use by default, optional OAuth-backed persistence when the user asks for it.

Risks to guard:

- A "Sign in with Google" button can weaken the perceived anonymity promise if it appears too early or too loudly.
- OAuth adds third-party provider dependency for synced users. Non-synced users must remain unaffected.
- Do not add profile screens, avatars, passwords, account settings, or auth-first navigation as part of this work.

Success shape:

- Complete: Practice History offers email-code sync and Google OAuth as quiet sibling options.
- Complete: existing anonymous/local data is preserved and merged when a user starts Backup & Sync.
- Complete: privacy copy states what syncs and makes clear that breathing remains usable without any sign-in.
- Complete: `/privacy` and `/terms` explain optional OAuth provider involvement and the anonymous-first philosophy in plain language.
- Complete: implementation uses Supabase Auth provider support rather than custom OAuth handshakes. App-side wiring uses normal Google sign-in from idle/anonymous states, and reserves `linkIdentity()` for the synced email-code `Link Google` state. Existing email-code users can link Google from the synced Backup & Sync state when Google is not attached yet.
- Validation complete: Supabase shows Email and Google attached to the same user, and Firefox on production restored synced practice history through `Continue with Google`.

## Promoted Priority, Alternate Rhythm Options (complete 2026-05-19)

Pulled forward from Stage 1 after five of six recent beta testers reported rhythm-fit concerns (see `docs/USER_FEEDBACK.md`). T-2026-05-19-05 specifically could not follow the rhythm without gasping, which was treated as a comfort and capacity signal, not preference.

Shipped:

- Four selectable paces surfaced inside Session Setup, with label-only tiles and human-first helper descriptions:
  - **Steady** (`standard`) — 4-4-6-8, 22s cycle. Default for first-time users.
  - **Soft** (`gentle`) — 3-2-4-4, 13s cycle. Shorter, lighter cycles.
  - **Full** (`full`) — 6-6-10-4, 26s cycle. Slower, deeper rhythm.
  - **Flow** (`flow`) — 4-0-6-2, 12s cycle. No hold, steady momentum.
- Per-rhythm cycle counts recalibrated so all four minute labels stay close to their targets.
- Rhythm threads through `useBreathingSession`, `BreathingOrb`, `GameHUD`, `useAudioEngine`, and `game/page.tsx` via a Rhythm object captured at first render.
- Local persistence through `exhale-rhythm` localStorage key; cloud round-trip through `user_settings.rhythm` (Supabase migration 002 + 003 applied).
- Picking a pace updates the helper row; detailed phase timing is available behind `View timing`.

The next signal worth gathering: circle back to the original five testers and ask whether one of Soft or Full fits better than Steady did, and ask Flow testers whether the remaining 2-second Relax/pause helps or interrupts the rhythm. First Flow follow-up says no-Hold helps but the pause may need to become no-pause. That tester follow-up is captured as TODO item.

## Stage 1, Ship-quality polish

Make Exhale feel like a "v1 you would link publicly."

- Garden warmer skin, with floral accents and a sun-through-leaves character. Toggle between this and the current "Still Water" aesthetic.
- Discoverability: Open Graph tags, social card image, meta description, friendly page title; consider a small landing-screen treatment on the home page.
- Privacy policy page and terms of use page; footer links from main pages.
- Color contrast audit on text at low opacity (white/28 to 38 against forest-night).
- In-session HUD readability audit by phase color: title/instruction text must remain readable over Inhale, Hold, Exhale, and Relax circles without becoming glaring. Recent feedback says brighter text can still fail if it sits over the wrong phase color.
- Accessibility candidates, after targeted validation:
  - **High Visual Contrast**: optional visual mode that makes phase colors and cues easier to tell apart for colorblind users, low-vision users, and first-time users who cannot distinguish phase changes quickly enough. Prefer stronger color separation plus non-color cue differences over a generic "colorblind mode" label.
  - **Voice Cues**: optional Audio setting that speaks only phase names (`Inhale`, `Hold`, `Exhale`, `Relax`) for blind users, screen-reader users, or testers who need non-visual guidance. Keep off by default and separate from background sound. Validate human-recorded or very neutral voice treatment before shipping; beta feedback now includes explicit concern that an obviously AI voice could hurt trust.
- Ongoing polish in response to beta feedback.

## Stage 2, Distribution

Reach beyond direct URL sharing.

- Android via Trusted Web Activity (Play Store), after the Garden skin and discoverability work land.
- PWA "Add to Home Screen" prompt or hint on iOS; no native shell.
- iOS Store via Capacitor is deferred. The cost (Apple Developer $99/yr, plus 2 to 4 weeks of native shell work, plus Apple's strict health-app review) is too high for a free tool when PWA on iOS already covers most of the experience. Revisit only if reception clearly justifies it.

## Stage 3, Monetization (conditional)

Only if Stage 0 and Stage 1 reception data justifies. Always preserve a fully featured free version.

- Donation page (Stripe link, lowest friction).
- Theme-pack purchase option; the warmer skin work in Stage 1 unlocks this.
- B2B or therapist licensing, only if a clear customer surfaces.
- LLC formation, only when about to take money.

## Stage 4, Scale

Far future. Marketing, partnerships, content. Intentionally undefined until earlier stages produce evidence.

## Deliberately deferred

These have been considered and are not on the active roadmap unless something changes:

- iOS Store deployment. See Stage 2 reasoning.
- Required accounts, required login, or any authentication before breathing. Violates the anonymous-first promise in `PRODUCT.md`.
- Push notifications, social features, streaks-as-pressure. Explicit anti-features in `PRODUCT.md`.
- Health, medical, or therapeutic claims. Exhale teaches a breathing pattern; it does not treat anything.
