---
name: exhale-accessibility-lab
description: Audit or improve Exhale accessibility across low-vision readability, WCAG contrast, reduced motion, keyboard operation, ARIA/live regions, touch targets, sound fallbacks, and mobile active-session usability. Use for accessibility reviews, low-vision tester reports, UI/copy changes, active-session HUD changes, completion/stats readability, or before release when accessibility risk matters.
---

# Exhale Accessibility Lab

## Overview

Review Exhale through the people most likely to be strained by it: stressed first-time users, older phone users, low-vision testers, keyboard users, and people with motion or sound constraints.

## Source Of Truth

Read:

- `PRODUCT.md` for user posture, non-goals, and known accessibility gaps.
- `DESIGN.md` for typography, opacity floor, active-session HUD rules, motion, and component constraints.
- `CLAUDE.md` for implemented accessibility baseline and session mechanics.
- `package.json` for validation commands.

If visual behavior is in scope, use the local browser or Playwright when available. If source changes touch design, copy, or interaction behavior, consider the repo's `impeccable` skill as a companion design specialist.

## Workflow

1. Inspect `git status -sb` and identify changed UI, CSS, copy, session, audio, auth, stats, or storage files.
2. Read the relevant source-of-truth docs above.
3. Run a static pass for semantic HTML, ARIA labels, live regions, focus paths, keyboard handlers, text opacity, motion preferences, and touch target regressions.
4. Run a browser pass when feasible for mobile, reduced motion, high contrast, and the active-session HUD.
5. Report findings first, ordered by severity and grounded in file/line references or browser state.
6. If asked to fix issues, keep changes small and verify with focused tests plus visual/browser checks for affected states.

## Severity

- P0: App-blocking, data-loss, privacy, or session-completion failure for an accessibility path.
- P1: Must fix before release; breaks keyboard access, core readable guidance, reduced-motion behavior, screen-reader equivalent, or WCAG-relevant content contrast.
- P2: Meaningful accessibility or usability risk, especially on mobile or low-vision paths.
- P3: Polish or future enhancement.

## Checks

Read `references/checklist.md` for the detailed review list. Use it for full accessibility passes, release readiness, and tester-reported accessibility bugs.
