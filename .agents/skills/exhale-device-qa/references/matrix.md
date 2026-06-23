# Device QA Matrix

## Viewports

Use the smallest set that matches the risk:

- Small phone: 360x740.
- Common phone: 390x844.
- Large phone: 430x932.
- Landscape phone: 844x390.
- Tablet-ish: 768x1024.
- Desktop: 1366x768.

For Meta/Facebook in-app-browser approximations, use a mobile viewport plus a Facebook or Messenger user agent when the browser tool supports it. Confirm actual Meta behavior on-device when the bug depends on browser chrome, fullscreen, audio, or OS policy.

## Browser States

- Empty localStorage for first visit.
- `exhale-stats` with at least one completed session for returning-user setup.
- `exhale-orb-scale` set to `1.25` for large circle checks.
- `exhale-sound-palette` set to `warm`, `air`, and `off` for sound-control checks.
- `exhale-rhythm` set to `gentle`, `standard`, `flow`, and `box` when rhythm-specific timing or layout is in scope.
- `exhale-resume` in sessionStorage for resume-window checks.

## Useful Routes

- `/` for home and setup.
- `/game?length=quick&rhythm=gentle` for default active-session path.
- `/game?length=quick&rhythm=standard&skipSettle=1` for Box without settle.
- `/game?length=quick&rhythm=flow&skipSettle=1` for Flow without settle.
- `/game?length=quick&rhythm=box&skipSettle=1` for Relax without settle.
- `/stats` for practice history and optional sign-in.

For completion-state checks, derive the selected rhythm's quick-session duration from `src/lib/breathing.ts`, then open `/game` with `resume` near the end and `skipSettle=1`. Watch for text swaps, vertical movement, audio fade behavior, and saved-session side effects.

## Visual Assertions

- No horizontal overflow.
- No important text clipped or overlapping.
- Orb and guide ring fully visible, especially at large circle size.
- Session controls stay bottom-left and bottom-right on mobile.
- Sound toggle hint does not cover the HUD.
- Completion quote does not shift the action buttons after it appears.
- Amber appears only on completion.
- Home and stats retain emerald as the only interface accent.

## Report Format

Use a compact table:

| State | Viewport | Result | Evidence | Notes |
|---|---:|---|---|---|

Then list blockers by severity. Include screenshot paths when captured.
