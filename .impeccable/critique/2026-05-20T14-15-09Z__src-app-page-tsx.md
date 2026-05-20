---
target: "src/app/page.tsx and http://127.0.0.1:3000/"
total_score: 35
p0_count: 0
p1_count: 0
timestamp: 2026-05-20T14-15-09Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Selected states are clear; setup tabs and audio preview states are legible, but local dev auth/network noise still appears as a Next overlay during QA. |
| 2 | Match System / Real World | 3 | "Choose a pattern" and "Background sound" are clearer; "Sequence" plus breath notation still assumes a little breathwork literacy. |
| 3 | User Control and Freedom | 4 | The user can start, expand setup, change length, change preferences, or ignore setup without being trapped. |
| 4 | Consistency and Standards | 4 | The three tabs, radio tiles, selected states, and quiet emerald control language now feel cohesive. |
| 5 | Error Prevention | 4 | Defaults are sane, options are constrained, Off is explicit, and Background sound reduces misunderstanding. |
| 6 | Recognition Rather Than Recall | 4 | Primary action, time choice, tab labels, and visible helper copy make the available choices discoverable. |
| 7 | Flexibility and Efficiency | 3 | Presets, persisted preferences, and optional setup support return users without complicating first use. |
| 8 | Aesthetic and Minimalist Design | 3 | The collapsed screen is excellent; expanded Sequence still carries the densest text and number load in the product. |
| 9 | Error Recovery | 3 | The surface is low-risk; recovery for background auth/network failures is not user-facing from home. |
| 10 | Help and Documentation | 4 | The helper row is the right level of contextual explanation for a no-onboarding app. |
| **Total** | | **35/40** | **Good, nearly excellent** |

## Anti-Patterns Verdict

LLM assessment: The home page still does not read as generic AI output. The orb, restrained palette, severe typography, and no-marketing first screen are specific to Exhale. The design risk is not slop, it is over-instructing the optional setup area after doing such a good job keeping the first screen quiet.

Deterministic scan: `npx impeccable detect --json src/app/page.tsx` returned `[]`. URL detection, run with the installed Chrome executable, returned five warnings: dark glow x2, AI color palette, wide tracking on body text, and pure black background. The dark glow and AI palette warnings are mostly false positives because the emerald orb glow is the product identity and the palette is not the common purple/cyan SaaS look. Wide tracking remains worth watching. The pure black warning appears to be a detector mismatch against the forest-night background or dev overlay.

Visual inspection: Playwright screenshots were taken for mobile collapsed home, mobile Sequence setup, mobile Audio setup, and desktop home. The local Next dev overlay appears because of the known sandbox Supabase/network issue; it is QA noise, not app chrome.

## Overall Impression

This pass improved the exact problem we were worried about. Splitting Session Setup into Sequence, Visual, and Audio makes the drawer feel intentional rather than crowded. The new copy also helps: `Choose a pattern` is better than repeating `Sequence`, and `Background sound` clarifies what the audio choices affect.

The strongest remaining opportunity is to make Sequence feel less technical for a brand-new user while still serving the breathwork-aware user who wants the numbers.

## What's Working

- The collapsed first screen is still excellent: orb, name, duration, Begin, optional setup. No extra explanation is in the way.
- Session Setup is now much calmer. Three tabs make the drawer scannable and keep Visual and Audio from competing with rhythm choices.
- Audio is clearer. `Background sound` plus a visible `Off` option removes the old ambiguity around whether this controls cues, music, or all sound.
- The sequence hover/focus preview is useful. Seeing the phase timings change below the tiles makes the choice feel connected to the breathing experience.

## Priority Issues

**[P2] Sequence Still Leans Technical**

Why it matters: A new user can choose Standard and ignore the details, but the helper row still asks them to parse `4-4-6-8`, `2.7 breaths/min`, and a benefit phrase at once. That is the densest cognitive moment on the home page.

Fix: Keep the current tile labels, but consider making the helper copy human-first and moving the notation to the end or a quieter line. For example: `Balanced grounding pace. 4s inhale, 4s hold, 6s exhale, 8s relax.` This is longer, but less code-like.

Suggested command: `impeccable polish src/app/page.tsx`

**[P2] Expanded Sequence Pushes The Page Into Settings Mode**

Why it matters: The first-breath path is pristine while collapsed, but once Sequence is open, the screen becomes a fairly tall preference editor. That is acceptable because it is optional, but it is the biggest contrast with Exhale's "quiet room" promise.

Fix: Keep the tab split. If beta users keep opening setup before first use and getting stuck, reduce the Sequence preview height or collapse the phase list behind a subtle "show timing" affordance. Do not change this without feedback signal.

Suggested command: `impeccable critique` after more tester feedback

**[P3] Background Sound Label Is Clear But Visually Long**

Why it matters: On mobile, `BACKGROUND SOUND` fits, but the wide tracking makes it visually heavier than the actual sound choices. It is not broken, just slightly loud for a secondary setting.

Fix: If it starts to feel heavy in hand testing, reduce tracking for section labels inside tabs or use sentence case for this one label. The current version is acceptable.

Suggested command: `impeccable polish src/app/page.tsx`

**[P3] Local QA Overlay Still Pollutes Visual Checks**

Why it matters: The red Next dev overlay can make screenshots look worse than the actual app and can distract from UI review.

Fix: Continue treating it as local QA noise unless it appears in production. A separate dev-mode Supabase mock or quieter local auth failure handling would make future visual review cleaner.

Suggested command: normal engineering cleanup, not a design command

## Persona Red Flags

**First-time stressed user**: The collapsed screen works well. They can pick time and press Begin without reading setup. If they open Sequence, the notation may look like a rule system rather than a calming choice.

**Capacity-constrained user**: Gentle and Flow are now discoverable. The phase preview helps them understand Hold/Relax differences, but "breaths/min" may be less meaningful than "shorter cycles" or "no hold."

**Breathwork-aware user**: They are well served. The phase pattern, timing preview, and Full/Flow options give them enough control without full customization.

## Minor Observations

- The desktop layout remains very clean, almost austere in a good way.
- The mobile Session Setup tabs feel like a real product control, not a patch.
- Footer links are still quiet. That is probably correct for this product.
- The URL detector warnings are worth recording, but not worth reacting to directly.

## Questions To Consider

- Should the Sequence helper speak in human timing language first and numeric notation second?
- Do beta users actually open Session Setup before their first session, or only after feeling rhythm friction?
- Is `Sequence` the best tab name long-term, or does `Breath` / `Pace` / `Pattern` test better with brand-new users?
