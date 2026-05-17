---
name: Exhale
description: Guided breathing for a calmer mind
colors:
  forest-night: "#090c0a"
  emerald-pulse: "#34d399"
  sylvan-glow: "#224f34"
  coastal-haze: "#76b2cb"
  amber-warmth: "#d2ae65"
  forest-floor: "#5db184"
  quiet-blush: "#cd8492"
  warm-closure: "#fbbf24"
  still-white: "#f5f5f2"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 200
    lineHeight: 1.1
    letterSpacing: "0.25em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 200
    lineHeight: 1.2
    letterSpacing: "0.3em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.3em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "0.12em"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: "0.18em"
  timer:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 100
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  pill: "9999px"
  card: "16px"
  control: "8px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-begin:
    backgroundColor: "rgba(6,78,59,0.15)"
    textColor: "rgba(167,243,208,0.90)"
    rounded: "{rounded.card}"
    padding: "20px 24px"
  button-begin-hover:
    backgroundColor: "rgba(6,78,59,0.26)"
    textColor: "rgba(236,253,245,1)"
    rounded: "{rounded.card}"
    padding: "20px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "rgba(245,245,242,0.45)"
    rounded: "{rounded.card}"
    padding: "12px 24px"
  button-ghost-hover:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "rgba(245,245,242,0.65)"
    rounded: "{rounded.card}"
    padding: "12px 24px"
  button-session:
    backgroundColor: "transparent"
    textColor: "rgba(245,245,242,0.45)"
    rounded: "{rounded.card}"
    padding: "12px 24px"
  button-session-selected:
    backgroundColor: "rgba(52,211,153,0.10)"
    textColor: "rgba(245,245,242,0.90)"
    rounded: "{rounded.card}"
    padding: "12px 24px"
  button-game-control:
    backgroundColor: "transparent"
    textColor: "rgba(245,245,242,0.65)"
    rounded: "{rounded.control}"
    padding: "6px 12px"
  button-game-control-hover:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "rgba(245,245,242,0.90)"
    rounded: "{rounded.control}"
    padding: "6px 12px"
---

# Design System: Exhale

## 1. Overview

**Creative North Star: "The Still Water"**

Exhale is a surface that reflects without distorting. It moves with the user but never against them: responsive to breath, invisible to anxiety. The design holds itself at rest — near-black ground, a single soft orb, text that barely whispers. Nothing competes for attention because the breath is the only thing that matters.

The brand personality is quiet, warm, accessible. The system's restraint is deliberate. The primary user has never opened a self-care app and will leave at the first sign of obligation. Every visual decision is filtered through one test: does this create friction, or does it dissolve it? Borders are present only to help the eye, not to impose structure. Color shifts with the breath cycle, teaching the rhythm without a word of instruction. Silence is not absence — it is the point.

This system explicitly rejects the language of productivity apps (progress bars as pressure, badges as obligation, streaks as guilt), the visual clichés of wellness software (gradients, glassmorphism, illustrated characters), the branded exuberance of Headspace and Calm, and anything that requires the user to understand a concept before they can breathe.

**Key Characteristics:**
- Near-black ground with a warm forest glow that anchors without darkening
- A single emerald accent, used sparingly; amber appears only at session close
- Inter at extralight and light weights — airy, not thin to the point of strain
- Wide tracking on all uppercase labels; sentence case for human-facing copy
- Motion that follows breath rhythm; nothing decorates for its own sake
- Flat surfaces, no shadows — depth via glow and opacity, never elevation
- Session controls in the thumb zone (bottom corners); the top screen belongs to passive status

## 2. Colors: The Still Water Palette

A near-monochrome ground with one living accent and four phase colors that breathe through the canvas during sessions.

### Primary
- **Emerald Pulse** (`#34d399`): The single brand accent. Used on the home orb, session button borders and backgrounds, and the stats orb mark. Never used for text on dark backgrounds at full opacity — always with an opacity modifier (10–45%) so it suggests rather than demands. Its rarity is the point.

### Secondary
- **Warm Closure** (`#fbbf24`): Amber, used exclusively on the session complete screen. Signals end-of-session warmth and closure. Not a brand color — a moment color. Never appears before a session ends.

### Tertiary — Phase Colors
These shift the entire canvas (orb, glow, progress rings, particles) with each breath phase. They are never used as UI chrome — not for buttons, borders, backgrounds, or labels outside the session canvas.

- **Coastal Haze** (`#76b2cb`) — Inhale. A muted steel blue. Opening, expanding, the color of breathing in.
- **Amber Warmth** (`#d2ae65`) — Hold. Warm amber-gold. Sustained, interior, candlelit.
- **Forest Floor** (`#5db184`) — Exhale. Sage green. Releasing, settling, returning.
- **Quiet Blush** (`#cd8492`) — Rest. Dusty rose-pink. Soft, restorative, the color of stillness.

### Neutral
- **Forest Night** (`#090c0a`): The ground. Near-black with the faintest green tint — not pure void, but the darkness before a forest dawn. Every screen.
- **Sylvan Glow** (`#224f34`): The warm radial backdrop on home and stats. Used only as a low-opacity radial gradient (15–20%), never as a solid surface.
- **Still White** (`#f5f5f2`): Text and borders, always at reduced opacity. 90% for primary text, 60% for secondary, 38–45% for tertiary, 18–28% for structural chrome. Never full white — the slight warmth keeps the screen from feeling clinical.

### Named Rules
**The Amber Exception Rule.** Amber (`#fbbf24`) appears on one screen, for one purpose: session closure. If you are tempted to use amber anywhere else, the answer is no.

**The One Accent Rule.** Emerald is the only accent. Phase colors belong to the canvas, not the UI. Do not use phase colors for buttons, labels, borders, or overlays outside of the session canvas. The exit guard backdrop is `#000` at 65% opacity — not emerald.

## 3. Typography

**Display/Body Font:** Inter (weights 100, 200, 300 only)
**No secondary typeface.** Inter's extralight and light weights carry every role.

**Character:** A single humanist sans used at its most weightless. The type feels etched rather than printed — wide tracking, uppercase labels, near-invisible on the dark ground. Heavy weights are reserved for one purpose: the phase label during an active session, where semibold at 600 signals authority amid stillness.

### Hierarchy

- **Display** (extralight 200, 2.25rem, tracking 0.25em, uppercase): The "Exhale" wordmark on the home screen. One instance per app.
- **Headline** (extralight 200, 1.875rem, tracking 0.3em, uppercase): Screen titles — "Practice", "Complete". Airy and formal.
- **Title** (semibold 600, 1.875rem, tracking 0.3em, uppercase): The active phase label during a session — "Inhale", "Hold", "Exhale", "Rest". The only heavy weight in the system. Its weight is earned: it is the only instruction the user needs.
- **Body** (light 300, 0.875rem, tracking 0.12em): Taglines, descriptions, session complete quotes. Sentence case. 45–60% white.
- **Label** (light 300, 0.75rem, tracking 0.18–0.28em, uppercase): Button text, metadata, stat labels. The tracking widens with the importance of the label — Begin sits at 0.28em, secondary actions at 0.18em.
- **Timer** (thin 100, 3.75rem, tabular-nums): The countdown during a session. Uses `font-variant-numeric: tabular-nums` to prevent layout shift as numbers change.

### Named Rules
**The Weight Ceiling Rule.** Only one element in the entire system uses semibold (600): the active phase label. Every other element uses 100, 200, or 300. Adding bold text anywhere else breaks the hierarchy. `font-normal` (400) is also prohibited — it sits in no-man's-land between the permitted weights.

**The Uppercase Contract.** Uppercase is for labels and controls only — things the user acts on or reads quickly. Copy (taglines, instructions, quotes) is always sentence case. Never all-caps a full sentence of human-facing copy.

## 4. Elevation

This system is flat by design. There are no `box-shadow` values used for structural elevation. Depth is conveyed through two mechanisms only: **opacity** (foreground elements are brighter; background elements fade) and **glow** (the orb and its rings emit a radial light that separates them from the canvas without casting a shadow).

The orb's glow (`box-shadow: 0 0 48px rgba(110,231,183,0.22)`) is the sole exception — and it is decorative, not structural. It does not imply that the orb "floats" above the surface; it implies that the orb is alive. The complete-screen amber orb carries an equivalent amber glow (`0 0 60px rgba(251,191,36,0.30)`) — the only moment a second glow color is permitted.

Dialog overlays (exit guard) use `background: rgba(0,0,0,0.65)` — a neutral dark scrim, not a colored tint.

### Named Rules
**The No Shadow Rule.** No UI element uses `box-shadow` for structural depth. If you reach for a drop shadow to separate a card, panel, or modal from the background, rethink the structure instead. The orb glow is the only permitted glow, and it belongs to the canvas.

## 5. Components

### Buttons

Soft and inviting — generous rounded corners (16px / `rounded-2xl`), borders that barely register, tinted backgrounds that confirm selection without demanding it. Low stakes, approachable for a user who has never tapped a wellness app before.

- **Shape:** Generously curved (16px radius). Game controls use a tighter curve (8px / `rounded-lg`).
- **Begin (Primary):** Emerald-tinted border (`emerald-400` at 32% opacity) with an emerald-tinted background (15% opacity). Text at `emerald-200` 90%. On hover: background lifts to 26%, border to 55%, text brightens. Tracks a 300ms ease-all transition.
- **Ghost (Secondary):** White border at 15–18% opacity, no background fill, text at 38–45% white. On hover: background tints to white at 4%, border to 28–32%, text to 55–65%. Used for "Practice history", "← Back", "Back to Menu", secondary navigation.
- **Session Picker Options:** Ghost by default; selected state adds an `emerald-400` background at 10% and border at 45%. Full-width, left-aligned label with right-aligned breath count. Arrow key navigation via `role="radiogroup"`.
- **Game Controls (Pause/Exit):** 8px radius, white border at 18%, transparent background. Compact padding (6px 12px). Positioned at the bottom corners of the session canvas for thumb-zone access. Do not use at the top of the screen.

### The Breathing Orb (Signature Component)

The brand mark and the product itself. Three contexts:

- **Home (large, 80px):** Emerald gradient (emerald-300 at 60% to emerald-600 at 40%), white highlight overlay (gradient from white at 20% to transparent), one outer ring (`inset -14px`, emerald border at 20% opacity with matching glow). Animated with `orbBreathe` keyframe (scale 1.0 → 1.14 → 1.0, 8s ease-in-out infinite) unless `prefers-reduced-motion` is set.
- **Stats (medium, 56px):** Same construction as home orb at reduced size. Same outer ring. Same breathe animation.
- **Complete (large, 96px):** Amber gradient (amber-300 at 75% to amber-600 at 50%), white highlight overlay, one outer ring (`inset -14px`, amber border at 20% opacity with amber glow). No breathe animation — the session is over.
- **Session canvas:** Full canvas, rendered via `<canvas>`. Scales between 60–140px base radius (orb size preference S/M/L). Phase colors shift the entire orb and its multi-layer glow on every breath phase change.

### Progress Indicators

- **Phase ring:** Drawn on canvas around the orb — arc from `-π/2` sweeping with phase progress. Phase color at 80% opacity.
- **Session ring:** Outer ring, same origin — session progress at 32% opacity.
- **HUD progress bar:** `w-48 h-[2px]` white/15 track, phase-colored fill at 70% opacity. Bottom-center of session screen (above the control buttons).

### Stats Rows

Flat list — no cards, no side borders. Each row: `border-b border-white/6`, `py-5`, label in label style at 35% white, value in headline style at 80% white. The asymmetry (tiny label, large value) creates hierarchy without structural chrome.

### Milestone Badges

`48x48px rounded-2xl`. Unearned: white at 3% background, white at 7% border. Earned: emerald at 12% background, emerald at 30% border, emerald icon at 85%. Transition: 300ms ease-all. These are reflective markers, not achievement prompts — they should never be accompanied by fanfare.

## 6. Do's and Don'ts

### Do:
- **Do** keep emerald (`#34d399`) at ≤10% surface coverage on any screen outside the active session canvas.
- **Do** use opacity as the primary tool for hierarchy — `white/90` to `white/18` covers every level from primary action to structural chrome.
- **Do** apply wide tracking (`0.18em` minimum) to all uppercase labels. Tight tracking on uppercase looks cramped at these weights.
- **Do** use amber (`#fbbf24`) exclusively on the session complete screen. It is earned by finishing a session — nowhere else.
- **Do** keep all button text at `font-light` (300) or lighter, uppercase, with tracking `≥0.18em`. The "Begin" button uses `0.28em`.
- **Do** respect `prefers-reduced-motion`: skip the orb breathe animation and canvas particle system entirely when the OS requests it.
- **Do** surface stats and practice history as optional, secondary navigation. Never on the critical path to breathing.
- **Do** place session controls (Pause, Exit) in the bottom corners of the session screen — the thumb zone on all phone sizes.
- **Do** give every orb mark (home, stats, complete) its outer ring at `inset -14px`, colored to match the orb's accent (emerald for home/stats, amber for complete).

### Don't:
- **Don't** use `font-bold`, `font-extrabold`, `font-normal`, or any weight other than 100, 200, 300, or 600. The weight ceiling is semibold (600), used only on the active phase label.
- **Don't** add shadows for structural elevation. No `box-shadow` on cards, panels, modals, or buttons. The orb glow is the only permitted exception.
- **Don't** use glassmorphism: no `backdrop-filter: blur()` on UI chrome. The canvas has depth; the UI does not.
- **Don't** use gradient text (`background-clip: text`). Phase colors on the orb are earned; gradient text on labels is decoration.
- **Don't** use a colored overlay for dialog/guard backdrops. The exit guard background is `rgba(0,0,0,0.65)` — neutral black, not emerald or any phase color.
- **Don't** add a second accent color. Emerald and amber are the full palette. Phase colors belong to the canvas only.
- **Don't** use `italic` anywhere in the interface. There is no italic role in this system. Emphasis is conveyed via opacity, not decoration.
- **Don't** design like Headspace or Calm — no onboarding carousels, no premium gate framing, no illustrated brand characters, no teacher voices.
- **Don't** design like a fitness app — no streak counters as pressure, no achievement popups, no guilt mechanics.
- **Don't** require an account, login, or cloud sync. Session data lives in localStorage. The user owns it; you don't.
- **Don't** add push notifications, sharing features, or social comparisons. The experience is private and self-contained.
- **Don't** use audio files. All sound is synthesized via Web Audio API. Zero load time is part of the low-friction promise.
