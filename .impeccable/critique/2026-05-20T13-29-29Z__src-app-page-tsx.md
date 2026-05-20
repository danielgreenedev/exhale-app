---
target: "src/app/page.tsx and http://127.0.0.1:3000/"
total_score: 33
p0_count: 0
p1_count: 0
timestamp: 2026-05-20T13-29-29Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Selected states are clear; local Supabase fetch failures are invisible to users and noisy in dev QA. |
| 2 | Match System / Real World | 3 | Calm language works; rhythm notation and breaths/min still assume some breathwork literacy. |
| 3 | User Control and Freedom | 4 | Begin, setup toggle, radio choices, and later session controls give good control without traps. |
| 4 | Consistency and Standards | 4 | Strong component vocabulary, color rules, spacing, and state language. |
| 5 | Error Prevention | 3 | Choices are constrained and defaults are sane; sound/off and rhythm choices could still be misunderstood. |
| 6 | Recognition Rather Than Recall | 3 | Main action is visible; expanded setup relies on compact labels and helper text. |
| 7 | Flexibility and Efficiency | 3 | Good presets and persisted preferences without compromising the primary path. |
| 8 | Aesthetic and Minimalist Design | 3 | Collapsed home is excellent; expanded setup is more information-dense than the rest of the product. |
| 9 | Error Recovery | 3 | Low-risk surface; network/auth failure recovery is not exposed on home. |
| 10 | Help and Documentation | 4 | Contextual helper is exactly enough for this kind of tool. |
| **Total** | | **33/40** | **Good** |

## Anti-Patterns Verdict

LLM assessment: The home page does not read as generic AI slop. The dark emerald surface, sparse wordmark, single orb, and restrained controls feel specific to Exhale. The main risk is not generic composition; it is overusing the same dark-glow language until the intentional orb identity starts looking like the detector's dark-mode cliche.

Deterministic scan: `npx impeccable detect --json src/app/page.tsx` returned no findings. URL detection returned 5 warnings: dark-glow x2, AI color palette, wide tracking on body text, and pure black background. The dark-glow and AI-palette warnings are mostly false positives because the orb glow is the product identity and the palette is emerald/forest, not purple/cyan SaaS. Wide tracking is a useful caution. Pure black appears to be a detector mismatch; the app uses `#090c0a` forest-night.

Visual overlays: The packaged `impeccable live` overlay entrypoint was not available in this install, so I used URL detection and Playwright screenshots at mobile, narrow mobile, and desktop widths instead.

## Overall Impression

The first screen is quiet, direct, and trustworthy. The strongest opportunity is keeping Session Setup from becoming a tiny settings panel once opened. The primary flow is almost exactly right; the optional path needs just a little more restraint.

## What's Working

- The collapsed home screen has excellent hierarchy: orb, name, length, Begin, then setup.
- The label-only rhythm tiles are a strong improvement; they keep the four-column mobile row calm.
- Touch target sizing is generally good: primary controls and setup controls are around 44px or larger.

## Priority Issues

**[P2] Expanded Session Setup Exposes Too Many Decisions**
Why it matters: Once opened, the user sees rhythm, a four-phase preview, circle size, sound off, and four sound palettes. The primary path is still simple, but the optional path shifts from calm to dense.
Fix: Keep Rhythm plus the phase preview visible, but consider moving Circle Size and Sound into a second `More options` row, or visually compress phase preview after a rhythm is selected.
Suggested command: `/impeccable distill session setup`

**[P2] Rhythm Helper Still Leads With Technical Notation**
Why it matters: New users who already said pacing can feel hard may not get value from `4-4-6-8` and `2.7 breaths/min` before they understand the bodily feel.
Fix: Make the helper human-first, for example `Standard · balanced baseline · inhale 4, hold 4, exhale 6, relax 8`. Keep breaths/min in aria or a secondary position.
Suggested command: `/impeccable clarify rhythm helper`

**[P2] Sound Off Is Icon-Only In A Text-Led Panel**
Why it matters: Every nearby option has a text label except mute/off. A first-timer may not know whether the icon is a setting, preview button, or current status.
Fix: Give Off a visible short label or fold it into the sound grid as `Off`, while keeping the icon if desired.
Suggested command: `/impeccable clarify sound controls`

**[P3] Footer Links Are Below Mobile Touch Target Comfort**
Why it matters: Privacy and Terms are secondary, but legal links should still be easy to tap. Current boxes measured about 31px high.
Fix: Give the footer links `min-h-11` with the same quiet visual treatment.
Suggested command: `/impeccable adapt footer links`

**[P3] QA Noise From Local Auth Failure Obscures Visual Review**
Why it matters: The red dev overlay is not a product issue, but it blocks visual evaluation and could hide real regressions during local review.
Fix: Fix or mock the local Supabase anonymous sign-in path during design QA.
Suggested command: `/impeccable harden local auth/dev QA`

## Persona Red Flags

Jordan, first-timer: The primary action is obvious within five seconds. Risk appears only after opening Session Setup: rhythm math and breaths/min may feel like homework.

Sam, accessibility-dependent user: Focus indicators and aria labels are strong. Watch low-opacity small text and footer tap targets; the rhythm helper works for focus/tap, which is better than hover-only.

Casey, distracted mobile user: The default path is thumb-friendly and fast. Expanded setup becomes long enough that interruption can make the user forget what they were adjusting.

## Minor Observations

- The detector's dark-glow warning should stay on the radar as a guardrail, not a mandate to remove the orb glow.
- The home tagline uses wide tracking on sentence text; it fits the brand, but this should not spread into longer copy.
- Narrow mobile layout now contains `Standard` correctly.

## Questions To Consider

1. Should Session Setup stay as one expanded panel, or should Circle Size/Sound move behind a quieter second layer?
2. Should the rhythm helper prioritize body-feel copy over technical rates for beta users?
3. Should Sound Off become a visible `Off` tile instead of an icon-only control?
