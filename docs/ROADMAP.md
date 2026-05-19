# Exhale Roadmap

Last updated: May 19, 2026

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
- Decide if real retention signal exists before investing more engineering.

Gate: roughly ten testers, mostly target-audience, with at least one signal of return use.

## Stage 1, Ship-quality polish

Make Exhale feel like a "v1 you would link publicly."

- Garden warmer skin, with floral accents and a sun-through-leaves character. Toggle between this and the current "Still Water" aesthetic.
- Discoverability: Open Graph tags, social card image, meta description, friendly page title; consider a small landing-screen treatment on the home page.
- Privacy policy page and terms of use page; footer links from main pages.
- Color contrast audit on text at low opacity (white/28 to 38 against forest-night).
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
