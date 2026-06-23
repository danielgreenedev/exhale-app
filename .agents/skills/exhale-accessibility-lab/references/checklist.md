# Accessibility Checklist

## Core Session

- Active phase label remains readable on small phones and over bright orb states.
- Timer uses tabular numbers and does not shift layout.
- `prefers-reduced-motion` disables particle texture and nonessential orb animation.
- `prefers-contrast: more` keeps the phase label, countdown, orb rim, and guide ring clear.
- Pause, Exit, sound, fullscreen, and exit guard controls are reachable by keyboard where applicable.
- Space, Escape, and F shortcuts do not interfere with focused controls or completion state.
- Exit guard traps focus while open and restores focus on close.

## Text And Contrast

- Content text stays at Still White 55% opacity or stronger unless it is disabled, placeholder, or decorative.
- Do not use `font-normal`, bold weights beyond the allowed semibold exceptions, italic, gradient text, or structural shadows.
- Completion amber remains confined to the completion screen.
- Error, storage, and sync messages are plain language and do not make sign-in feel required.

## Semantics

- Interactive elements have accessible names.
- Radio groups keep arrow-key behavior.
- Live regions are polite and do not chatter on every animation frame.
- The canvas has screen-reader-equivalent state through HUD labels and timers.
- Buttons have stable dimensions so hover/focus/content changes do not resize layout.

## Mobile And Touch

- Important controls are in thumb-reachable bottom zones during sessions.
- Touch targets are at least 44px tall/wide for core actions.
- No horizontal overflow at narrow mobile widths.
- The first-visit path still reaches the first breath with minimal decisions.

## Audio And Environment

- Sound remains optional.
- Autoplay failure falls back to user interaction without blocking the session.
- iPhone silent-mode hint is timed, quiet, and not shown as a persistent warning.
- Ambient audio schedules fade-out at the guided-session deadline.

## Useful Commands

- `rg -n "font-normal|font-bold|italic|box-shadow|shadow-|backdrop-blur|text-.*\/([0-4][0-9])" src`
- `npm.cmd run lint`
- `npm.cmd test`
- `npm.cmd run build`
- `npm.cmd run audit:impeccable` when visual design rules are in scope.
