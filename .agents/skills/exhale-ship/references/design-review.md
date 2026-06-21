# Design Review Gate

Use this gate only when UI, CSS, Tailwind config, visible copy, motion, accessibility, or interaction behavior changed.

## Inputs

- Read `DESIGN.md` before making visual judgments.
- Inspect the changed UI/CSS diffs.
- If the app can run locally, use the available Codex Browser or Playwright tooling for rendered inspection.
- Prefer the repo's existing `npm.cmd run audit:impeccable` script when a broader UI audit is useful.

## Checks

- Enforce the Weight Ceiling: use Inter 100, 200, or 300 except sanctioned semibold use on the Begin button, Beginning pre-session label, and active phase labels.
- Reject `font-normal`, italics, and unsanctioned bold weights.
- Enforce the Amber Exception: `#fbbf24` belongs only to the session complete state.
- Enforce the One Accent rule: emerald `#34d399` is the only accent outside completion and should stay sparse outside the canvas.
- Enforce the No Shadow rule: no `box-shadow` for UI elevation or static orb marks.
- Use tinted forest-night dialog scrims instead of pure black backdrops.
- Preserve `prefers-reduced-motion` fallbacks for orb and particle motion.
- Preserve ARIA live regions for changing phase/cycle text.
- Preserve `role="timer"` or equivalent timer semantics for countdowns.
- Keep Pause and Exit controls in the mobile thumb zone, not at the top of the session screen.
- Check mobile and desktop text fit for any changed controls, labels, and overlays.

## Output

- Map visual and accessibility findings to specific files and lines.
- Include screenshot or rendered-inspection notes when browser verification is performed.
- If UI changed but browser verification was not possible, state that as residual risk.
