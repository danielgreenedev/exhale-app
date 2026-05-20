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
    backgroundColor: "#34d399"
    textColor: "#090c0a"
    rounded: "{rounded.card}"
    padding: "20px 24px"
  button-begin-hover:
    backgroundColor: "#a7f3d0"
    textColor: "#090c0a"
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
- **Quiet Blush** (`#cd8492`) — Relax phase (phase enum `rest`). Dusty rose-pink. Soft, restorative, the color of permission to breathe naturally between guided inhales.

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

**Character:** A single humanist sans used at its most weightless. The type feels etched rather than printed — wide tracking, uppercase labels, near-invisible on the dark ground. Heavy weights are reserved for two purposes: the phase label during an active session, where semibold at 600 signals authority amid stillness, and the Begin button label, where semibold earns its place by holding legibility for the primary action against a saturated emerald fill.

### Hierarchy

- **Display** (extralight 200, 2.25rem, tracking 0.25em, uppercase): The "Exhale" wordmark on the home screen. One instance per app.
- **Headline** (extralight 200, 1.875rem, tracking 0.3em, uppercase): Screen titles — "Practice", "Complete". Airy and formal.
- **Title** (semibold 600, 1.875rem, tracking 0.3em, uppercase): The active phase label during a session — "Inhale", "Hold", "Exhale", "Relax". Together with the Begin button label, one of only two semibold uses in the system. Its weight is earned: it is the only instruction the user needs.
- **Body** (light 300, 0.875rem, tracking 0.12em): Taglines, descriptions, session complete quotes. Sentence case. 45–60% white.
- **Label** (light 300, 0.75rem, tracking 0.18–0.28em, uppercase): Most button text, metadata, and stat labels. Secondary actions sit at 0.18em. The Begin button is the one sanctioned exception, using semibold 600 at tracking 0.20em for legibility against the emerald fill; see Begin (Primary) below.
- **Timer** (thin 100, 3.75rem, tabular-nums): The countdown during a session. Uses `font-variant-numeric: tabular-nums` to prevent layout shift as numbers change.

### Named Rules
**The Weight Ceiling Rule.** Two elements in the entire system use semibold (600): the active phase label and the Begin button label. Every other element uses 100, 200, or 300. Adding bold text anywhere else breaks the hierarchy. `font-normal` (400) is also prohibited — it sits in no-man's-land between the permitted weights. The Begin exception exists because the primary action pairs Forest Night text with an Emerald Pulse fill, which is a lower-contrast pairing than any other text in the system (everything else sits on the dark ground). No other surface pairs text with a saturated brand color, so the exception does not generalize.

**The Uppercase Contract.** Uppercase is for labels and controls only — things the user acts on or reads quickly. Copy (taglines, instructions, quotes) is always sentence case. Never all-caps a full sentence of human-facing copy.

**The Text Opacity Floor.** Content text (body copy, metadata, sub-labels, anything a user actually reads) uses Still White at 55% opacity or higher. Calculated contrast over forest-night clears WCAG AA 4.5:1 at 55%; below that the ratio drops fast (3.7:1 at 42%, 3.1:1 at 38%, 1.8:1 at 28%). Lower opacities are reserved for structural and decorative chrome only: borders (18-30%), list markers (35%), placeholders (40%, WCAG-exempt), disabled-state labels (28%, WCAG-exempt). The opacity hierarchy stays — 90% / 70% / 60% / 55% — it just doesn't extend into content text below 55%.

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
- **Begin (Primary):** Solid Emerald Pulse fill with Forest Night text in semibold 600 at text-sm and tracking 0.20em. It is the only filled action on the home screen, so the start path is unmistakable even when the user is stressed or in low light. Semibold is a sanctioned exception to the Weight Ceiling Rule: the Forest Night on Emerald Pulse pairing has lower contrast than any other text in the system, and the primary call to action has to read clearly under any lighting condition. On hover, the fill warms slightly to emerald-200. Tracks a 300ms ease-all transition.
- **Resume (Contextual):** Appears only when a session can be resumed within the 60-second window. It sits directly below Begin and above Session Setup so continuation remains close to the primary action without competing with it.
- **Ghost (Secondary):** White border at 15–18% opacity, no background fill, text at 38–45% white. On hover: background tints to white at 4%, border to 28–32%, text to 55–65%. Used for "Practice history", "← Back", "Back to Menu", secondary navigation.
- **Session Picker Options:** Ghost by default; selected state uses an emerald border, a 10% emerald tint, and green-lit text so it reads as active without competing with the solid Begin button. New users default to Quick / 3 min. Arrow key navigation via `role="radiogroup"`.
- **Game Controls (Pause/Exit):** 8px radius, white border at 18%, transparent background. Compact padding (6px 12px). Positioned at the bottom corners of the session canvas for thumb-zone access. Do not use at the top of the screen.

### The Breathing Orb (Signature Component)

The brand mark and the product itself. Three contexts:

- **Home (large, 80px):** Emerald gradient (emerald-300 at 60% to emerald-600 at 40%), white highlight overlay (gradient from white at 20% to transparent), one outer ring (`inset -14px`, emerald border at 20% opacity with matching glow). Animated with `orbBreathe` keyframe (scale 1.0 → 1.14 → 1.0, 8s ease-in-out infinite) unless `prefers-reduced-motion` is set.
- **Stats (medium, 56px):** Same construction as home orb at reduced size. Same outer ring. Same breathe animation.
- **Complete (large, 96px):** Amber gradient (amber-300 at 75% to amber-600 at 50%), white highlight overlay, one outer ring (`inset -14px`, amber border at 20% opacity with amber glow). No breathe animation — the session is over.
- **Session canvas:** Full canvas, rendered via `<canvas>`. Scales between 60–140px base radius (Circle Size preference S/M/L). Phase colors shift the entire orb and its multi-layer glow on every breath phase change.

### Breathing Rhythm

The Standard rhythm is 4-4-6-8: Inhale 4 seconds, Hold 4 seconds, Exhale 6 seconds, Relax 8 seconds (phase enum `rest`). Relax is intentionally long enough to allow a normal catch-up breath, a yawn, or a soft reset before the next guided inhale; "Relax" labels the phase rather than "Rest" because the body wants to inhale during this window, not hold still. The pre-session Settle In state lasts 8 seconds and is skipped when resuming a session. Gentle and Full presets reshape the per-phase durations; see the Rhythm component spec.

### Anticipatory Phase Cue

In the final `PHASE_LOOKAHEAD_SECONDS` (currently 0.8s) before each phase change, the guide ring around the orb crossfades to the incoming phase color and a quiet pre-cue tone plays when sound is on. The intent is to give the brain a beat to register the upcoming transition without changing the actual phase timing. No textual HUD cue is shown; an earlier `Next [phase]` text experiment competed with the central phase label and the countdown for attention and was removed. Hook returns `nextPhase`, `phaseLeadProgress` (0-1), and `timeUntilPhaseEnd` so other consumers can opt in to anticipation without re-deriving them.

### Progress Indicators

- **Session ring:** Drawn on canvas around the orb, with session progress fill at 42% opacity over a 12% track. This is the sole session-level progress indicator; the redundant HUD progress bar was removed after a beta tester reported the floating colored segment more confusing than informative.
- **Guide ring:** The outer breath rail shows current phase progress and the incoming phase color lead. The earlier separate inner phase-progress ring was removed after graphic-designer feedback because it duplicated the orb scale and countdown signals.

### Phase Transitions

During the last 0.8 seconds of a phase, the guide ring begins to show the next phase color as a faint incoming arc. This is an anticipatory cue, not a new phase; it gives the user's eye a beat to understand that a transition is coming.

Phase changes should feel like a handoff rather than a switch. The HUD keeps the current phase label active; anticipation is carried by the guide-ring color lead and quiet pre-cue sound. Visual color transitions are deliberately softened; the boundary can be sensed before the orb changes state, especially for users who need a moment to process the new instruction.

### Rhythm

The breathing pattern itself is selectable inside Session Setup as the first row, above the static phase sequence preview so that picking a rhythm updates the preview live. Three options:

- **Standard** (`Balanced`) — 4-4-6-8, 22s cycle. Default for first-time users.
- **Gentle** (`Easier`) — 3-2-4-4, 13s cycle. Shorter cycle with a lighter hold; for capacity-constrained users and anyone who feels rushed by Standard.
- **Full** (`Longer`) — 6-6-10-4, 26s cycle. Longer inhale, hold, and exhale; for experienced breathwork users.

Each tile shows the rhythm name (uppercase 10px tracking-0.12em) above a one-word relative descriptor (sentence-case 10px tracking-0.08em) — `Balanced`, `Easier`, `Longer`. The technical phase signature (`4-4-6-8`) lives in the title attribute and aria-label for breathwork-aware users and screen readers, but is not visible by default; that disambiguates rhythm tiles from breathwork-savvy notation that intimidates the skeptical primary user.

Rhythm uses the same quiet emerald selected-state language as Time, Circle Size, and Sound. Default is `Standard`. The choice persists through `exhale-rhythm` in localStorage and `user_settings.rhythm` in Supabase. Rhythm cannot change mid-session; the picker is read once at session start and the resulting pattern drives the orb timing, audio cue ramps, and HUD time-remaining calculation. Switching rhythm requires returning to the home screen and starting a new session.

The Full label was chosen over Deep to avoid colliding with the Deep sound texture in the same Session Setup pane.

### Sound Palettes

Sound is optional and synthesized only. The home screen exposes four texture choices: Air, Warm, Deep, and Still. Air is the default and should stay closest to silence: filtered air, a low grounding tone, and a sparse open pad. Warm can add more body. Deep shifts the bed darker and lower. Still removes almost all tonality but remains audible as a very quiet breath tone. Off is separated as a mute icon beside the section label so users do not read it as another sound texture.

The palette control belongs with Circle Size inside Session Setup, below the primary Begin flow. Sound textures use the same quiet emerald selected state as other radio controls. Selecting Air, Warm, Deep, or Still plays a brief soft preview, shows a small selected-tile preview indicator, announces the preview to screen readers, then fades out. Selecting Off stops sound immediately. No sound plays on page load from a saved setting.

### Circle Size

Circle Size uses compact S/M/L radio controls. New users default to M. The active size uses the same emerald border, faint tint, and green-lit label as Time and Sound selections, so all home-screen preferences share one checked-state language while Begin stays the only solid green control.

### Session Setup Disclosure

Session Setup is the single push-down disclosure below Begin and Resume. It contains the Rhythm picker first (3 options, sub-labeled with one-word descriptors), then the static 4-step phase sequence preview that updates live based on the active rhythm, a faint divider, then Circle Size and Sound. It is collapsed by default for everyone, with no completed-session rule. Practice History stays outside Session Setup because it is navigation, not a preference, and is shown only after at least one completed session so first-visit users see exactly one decision (length) and one action (Begin).

### Stats Rows

Flat list — no cards, no side borders. Each row: `border-b border-white/6`, `py-5`, label in label style at 35% white, value in headline style at 80% white. The asymmetry (tiny label, large value) creates hierarchy without structural chrome.

### Optional Sync

Sync belongs only on the Practice screen, below the reflective history content. It is an optional recovery and continuity affordance, not an account system. It syncs practice history, timer length, Circle Size, sound choice, and rhythm. The flow is quiet and linear: email field, Send code, 6-digit code field, Confirm. The privacy reassurance is: "Only these sync: practice history, timer length, circle size, sound choice, and rhythm." User-facing sync copy should not use account, profile, or login language. Do not use magic-link copy, resend loops, avatars, account settings, or anything that makes breathing feel gated.

Cloud writes for settings are debounced (~400ms trailing) so rapid clicks through Circle Size or Sound options collapse into a single Supabase upsert. localStorage writes stay immediate so the local UI reflects the choice without waiting on a round trip.

### Milestone Badges

`48x48px rounded-2xl`. Unearned: white at 3% background, white at 7% border. Earned: emerald at 12% background, emerald at 30% border, emerald icon at 85%. Transition: 300ms ease-all. These are reflective markers, not achievement prompts — they should never be accompanied by fanfare.

## 6. Do's and Don'ts

### Do:
- **Do** keep emerald (`#34d399`) at ≤10% surface coverage on any screen outside the active session canvas.
- **Do** use opacity as the primary tool for hierarchy — `white/90` to `white/18` covers every level from primary action to structural chrome.
- **Do** apply wide tracking (`0.18em` minimum) to all uppercase labels. Tight tracking on uppercase looks cramped at these weights.
- **Do** use amber (`#fbbf24`) exclusively on the session complete screen. It is earned by finishing a session — nowhere else.
- **Do** keep all button text at `font-light` (300) or lighter, uppercase, with tracking `≥0.18em`. The Begin button is the one sanctioned exception, using semibold 600 at tracking 0.20em (see Begin (Primary)).
- **Do** respect `prefers-reduced-motion`: skip the orb breathe animation and canvas particle system entirely when the OS requests it.
- **Do** surface stats and practice history as optional, secondary navigation. Never on the critical path to breathing.
- **Do** keep sync optional, quiet, and confined to Practice History. It is for carrying history across devices, not for onboarding.
- **Do** place session controls (Pause, Exit) in the bottom corners of the session screen — the thumb zone on all phone sizes.
- **Do** give every orb mark (home, stats, complete) its outer ring at `inset -14px`, colored to match the orb's accent (emerald for home/stats, amber for complete).

### Don't:
- **Don't** use `font-bold`, `font-extrabold`, `font-normal`, or any weight other than 100, 200, 300, or 600. The weight ceiling is semibold (600), used only on the active phase label and the Begin button. See the Weight Ceiling Rule for why Begin is the sanctioned exception.
- **Don't** add shadows for structural elevation. No `box-shadow` on cards, panels, modals, or buttons. The orb glow is the only permitted exception.
- **Don't** use glassmorphism: no `backdrop-filter: blur()` on UI chrome. The canvas has depth; the UI does not.
- **Don't** use gradient text (`background-clip: text`). Phase colors on the orb are earned; gradient text on labels is decoration.
- **Don't** use a colored overlay for dialog/guard backdrops. The exit guard background is `rgba(0,0,0,0.65)` — neutral black, not emerald or any phase color.
- **Don't** add a second accent color. Emerald and amber are the full palette. Phase colors belong to the canvas only.
- **Don't** use `italic` anywhere in the interface. There is no italic role in this system. Emphasis is conveyed via opacity, not decoration.
- **Don't** design like Headspace or Calm — no onboarding carousels, no premium gate framing, no illustrated brand characters, no teacher voices.
- **Don't** design like a fitness app — no streak counters as pressure, no achievement popups, no guilt mechanics.
- **Don't** require an account, login, or cloud sync before breathing. Optional email sync must never block first use.
- **Don't** add push notifications, sharing features, or social comparisons. The experience is private and self-contained.
- **Don't** use audio files. All sound is synthesized via Web Audio API. Zero load time is part of the low-friction promise.
