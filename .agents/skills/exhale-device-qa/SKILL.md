---
name: exhale-device-qa
description: Run repeatable Exhale device, browser, viewport, and visual-state QA for mobile layout, active breathing sessions, completion transitions, Meta/Facebook in-app-browser approximations, reduced motion, large circle size, and key first-run or returning-user flows. Use when reproducing tester device bugs, checking layout shifts, doing pre-release visual QA, or verifying local/preview deployments.
---

# Exhale Device QA

## Overview

Exercise Exhale like a stressed user on a real phone: narrow screens, webviews, sound constraints, reduced motion, completion transitions, and returning-user state. Prefer repeatable browser checks over ad hoc clicking.

## Source Of Truth

Read:

- `CLAUDE.md` for route map, query params, storage keys, rhythm mechanics, and known webview constraints.
- `DESIGN.md` for viewport-sensitive layout and component rules.
- `PRODUCT.md` for first-session and no-friction expectations.
- `docs/HANDOFF.md` for current device caveats and validation asks.
- `package.json` for validation commands.

Use the browser or Playwright skills/tools when automating a real browser. Do not add new device-cloud, MCP, or deployment dependencies without explicit approval.

## Workflow

1. Inspect `git status -sb` and identify changed UI, session, canvas, audio, routing, storage, or docs files.
2. Confirm the local target. Use an existing dev server when one is already running; otherwise start `npm.cmd run dev`.
3. Select the smallest useful QA matrix from `references/matrix.md`.
4. Seed browser storage deliberately for first-visit, returning-user, settings, and resume states.
5. Capture screenshots or browser observations for every failing or risky state.
6. Report pass/fail by state and viewport, with reproduction steps and file/line suspects when known.
7. If asked to fix, patch narrowly and rerun the affected state checks.

## Required States For Full Passes

- First-visit home: no local storage, default Quick and Soft path.
- Returning home: `exhale-stats` present, Session Setup visible, Pattern/Visual/Audio usable.
- Active session: normal, paused, exit guard, sound on/off, fullscreen capability if available.
- Completion: quote area, amber-only closure, Breathe Again, Back to Menu, storage-unavailable note when relevant.
- Stats: local history, signed-out optional Sign In framing, no guilt mechanics.

Read `references/matrix.md` before a full device QA pass or any tester-reported mobile/browser issue.
