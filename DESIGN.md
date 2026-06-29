---
name: Exhale
description: Guided breathing for a calmer mind
colors:
  forest-night: "#0f1712"
  emerald-pulse: "#34d399"
  sylvan-glow: "#224f34"
  coastal-haze: "#76b2cb"
  amber-warmth: "#d2ae65"
  forest-floor: "#5db184"
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
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.12em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "0.04em"
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
    backgroundColor: "{colors.emerald-pulse}"
    textColor: "{colors.forest-night}"
    rounded: "{rounded.card}"
    padding: "20px 24px"
  button-begin-hover:
    backgroundColor: "#a7f3d0"
    textColor: "{colors.forest-night}"
    rounded: "{rounded.card}"
    padding: "20px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "rgba(245,245,242,0.45)"
    rounded: "{rounded.card}"
    padding: "12px 24px"
  button-ghost-hover:
    backgroundColor: "rgba(245,245,242,0.04)"
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
    backgroundColor: "rgba(245,245,242,0.05)"
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
- Low-vision readability is part of calm: active-session words must remain readable on phones without becoming a modal, card, or interruption

## 2. Colors: The Still Water Palette

A near-monochrome ground with one living accent and four phase colors that breathe through the canvas during sessions.

### Primary
- **Emerald Pulse** (`#34d399`): The single brand accent. Used on the home orb, session button borders and backgrounds, and the stats orb mark. Never used for text on dark backgrounds at full opacity — always with an opacity modifier (10–45%) so it suggests rather than demands. Its rarity is the point.

### Secondary
- **Warm Closure** (`#fbbf24`): Amber, used exclusively on the session complete screen. Signals end-of-session warmth and closure. Not a brand color — a moment color. Never appears before a session ends.

### Tertiary — Phase Colors
These shift the entire canvas (orb, glow, progress rings, particles) with each breath phase. Outside the active session canvas, they may appear only as tiny semantic markers that explain breath-related choices or history: proportional bars in rhythm cards, small dots in Circle Size, small dots in Background sound, and small dots in Practice History. They are not general UI chrome and must not become buttons, borders, backgrounds, large labels, or overlays.

- **Coastal Haze** (`#76b2cb`) — Inhale. A muted steel blue. Opening, expanding, the color of breathing in.
- **Amber Warmth** (`#d2ae65`) — Hold. Warm amber-gold. Sustained, interior, candlelit.
- **Forest Floor** (`#5db184`) — Exhale. Sage green. Releasing, settling, returning.

### Neutral
- **Forest Night** (`#0f1712`): The ground. Near-black with a visible green tint — not pure void, but the darkness before a forest dawn. Every screen.
- **Sylvan Glow** (`#224f34`): The warm radial backdrop on home and stats. Used only as a low-opacity radial gradient (15–20%), never as a solid surface.
- **Still White** (`#f5f5f2`): Text and borders, always at reduced opacity. 90% for primary text, 60% for secondary, 38–45% for tertiary, 18–28% for structural chrome. Never full white — the slight warmth keeps the screen from feeling clinical.

### Named Rules
**The Amber Exception Rule.** Amber (`#fbbf24`) appears on one screen, for one purpose: session closure. If you are tempted to use amber anywhere else, the answer is no.

**The One Accent Rule.** Emerald is the only interface accent. Phase colors are allowed outside the canvas only as tiny semantic markers for breath-related settings and history. Do not use phase colors for buttons, labels, borders, filled surfaces, or overlays. The exit guard backdrop is a forest-night scrim, not emerald.

## 3. Typography

**Display/Body Font:** Inter (weights 100, 200, 300 only)
**No secondary typeface.** Inter's extralight and light weights carry every role.

**Character:** A single humanist sans used at its most weightless. The type feels etched rather than printed — wide tracking, uppercase labels, near-invisible on the dark ground. Heavy weights are reserved for two purposes: the phase label during an active session, where semibold at 600 signals authority amid stillness, and the Begin button label, where semibold earns its place by holding legibility for the primary action against a saturated emerald fill.

### Hierarchy

- **Display** (extralight 200, 2.25rem, tracking 0.25em, uppercase): The "Exhale" wordmark on the home screen. One instance per app.
- **Headline** (extralight 200, 1.875rem, tracking 0.3em, uppercase): Screen titles — "Practice", "Complete". Airy and formal.
- **Title** (semibold 600, 2.75rem mobile / 3rem desktop, tracking 0.12em mobile, uppercase): The active phase label during a session — "Inhale", "Hold", or "Exhale". Beginning in uses the same treatment because it functions as the pre-session state label. Together with the Begin button label, these are the only semibold uses in the system. Their weight is earned: they are the only instructions the user needs.
- **Body** (light 300, 0.875rem, tracking 0.04em): Taglines, descriptions, session complete quotes. Sentence case. 55–72% white. Body copy uses only subtle tracking; wide spacing is reserved for uppercase labels and controls.
- **Label** (light 300, 0.75rem, tracking 0.18–0.28em, uppercase): Most button text, metadata, and stat labels. Secondary actions sit at 0.18em. The Begin button is the one sanctioned exception, using semibold 600 at tracking 0.20em for legibility against the emerald fill; see Begin (Primary) below.
- **Timer** (thin 100, 3.75rem, tabular-nums): The countdown during a session. Uses `font-variant-numeric: tabular-nums` to prevent layout shift as numbers change.

### Named Rules
**The Weight Ceiling Rule.** Semibold (600) is reserved for the active phase label, the Beginning in pre-session label, and the Begin button label. Every other element uses 100, 200, or 300. Adding bold text anywhere else breaks the hierarchy. `font-normal` (400) is also prohibited — it sits in no-man's-land between the permitted weights. The Begin exception exists because the primary action pairs Forest Night text with an Emerald Pulse fill, which is a lower-contrast pairing than any other text in the system (everything else sits on the dark ground). No other surface pairs text with a saturated brand color, so the exception does not generalize.

**The Uppercase Contract.** Uppercase is for labels and controls only — things the user acts on or reads quickly. Copy (taglines, instructions, quotes) is always sentence case. Never all-caps a full sentence of human-facing copy.

**The Text Opacity Floor.** Content text (body copy, metadata, sub-labels, anything a user actually reads) uses Still White at 55% opacity or higher. Calculated contrast over forest-night clears WCAG AA 4.5:1 at 55%; below that the ratio drops fast (3.7:1 at 42%, 3.1:1 at 38%, 1.8:1 at 28%). Lower opacities are reserved for structural and decorative chrome only: borders (18-30%), list markers (35%), placeholders (40%, WCAG-exempt), disabled-state labels (28%, WCAG-exempt). The opacity hierarchy stays — 90% / 70% / 60% / 55% — it just doesn't extend into content text below 55%.

## 4. Elevation

This system is flat by design. There are no `box-shadow` values used for structural elevation. Depth is conveyed through two mechanisms only: **opacity** (foreground elements are brighter; background elements fade) and **intrinsic light** (the orb's radial fill and canvas light, not UI elevation).

The static orb marks use a muted radial fill, a Still White highlight, and a low-opacity outline. They do not use colored `box-shadow`; this keeps the brand mark from reading as neon/cyan-on-dark while preserving the quiet living-orb signal. The active session canvas may still render phase light inside the canvas because that light is the breathing object itself, not UI chrome.

Dialog overlays (exit guard) use a tinted forest-night scrim such as `rgba(15,23,18,0.85)` — neutral to the app, not pure black and not a colored accent.

### Named Rules
**The No Shadow Rule.** No UI element uses `box-shadow` for structural depth. If you reach for a drop shadow to separate a card, panel, or modal from the background, rethink the structure instead. Static orb marks also avoid colored box-shadow; the session canvas is the only place phase light should feel luminous.

## 5. Components

### Buttons

Soft and inviting — generous rounded corners (16px / `rounded-2xl`), borders that barely register, tinted backgrounds that confirm selection without demanding it. Low stakes, approachable for a user who has never tapped a wellness app before.

- **Shape:** Generously curved (16px radius). Game controls use a tighter curve (8px / `rounded-lg`).
- **Begin (Primary):** Solid Emerald Pulse fill with Forest Night text in semibold 600 at text-sm and tracking 0.20em. It is the only filled action on the home screen, so the start path is unmistakable even when the user is stressed or in low light. Semibold is a sanctioned exception to the Weight Ceiling Rule: the Forest Night on Emerald Pulse pairing has lower contrast than any other text in the system, and the primary call to action has to read clearly under any lighting condition. On hover, the fill warms slightly to emerald-200. Tracks a 300ms ease-all transition.
- **Resume (Contextual):** Appears only when a session can be resumed within the 60-second window. It sits directly below Begin and above Session Setup so continuation remains close to the primary action without competing with it.
- **Ghost (Secondary):** White border at 15–18% opacity, no background fill, text at 38–45% white. On hover: background tints to white at 4%, border to 28–32%, text to 55–65%. Used for "Practice history", "← Back", "Back to Menu", secondary navigation.
- **Session Picker Options:** Ghost by default; selected state uses an emerald border, a 10% emerald tint, and green-lit text so it reads as active without competing with the solid Begin button. New users default to Quick / 3 min. Buttons show only the time label; rhythm-specific breath counts stay in the rhythm helper to avoid adding pressure or calculation to the first decision. Arrow key navigation via `role="radiogroup"`.
- **Game Controls (Pause/Exit):** 8px radius, white border at 18%, transparent background. Compact padding (6px 12px). Positioned at the bottom corners of the session canvas for thumb-zone access. Do not use at the top of the screen.

### The Breathing Orb (Signature Component)

The brand mark and the product itself. Three contexts:

- **Home (large, 72px mobile / 80px desktop):** Muted emerald radial fill, Still White highlight at roughly 14% opacity, one outer ring (`inset -12px` mobile / `inset -14px` desktop, forest-emerald border at 20% opacity). No colored box-shadow. Animated with `orbBreathe` keyframe (scale 1.0 → 1.14 → 1.0, 8s ease-in-out infinite) unless `prefers-reduced-motion` is set.
- **Stats (medium, 56px):** Same muted construction as home orb at reduced size. Same outer ring. Same breathe animation.
- **Complete (large, 96px):** Muted amber radial fill, Still White highlight at roughly 15% opacity, one outer ring (`inset -14px`, amber border at 22% opacity). No colored box-shadow and no breathe animation — the session is over.
- **Session canvas:** Full canvas, rendered via `<canvas>`. Scales between 60–140px base radius (Circle Size preference S/M/L). Phase colors shift the entire orb and its multi-layer glow on every breath phase change.

### Breathing Rhythm

The default Soft rhythm is 4-4: Inhale 4 seconds, Exhale 4 seconds. It is the first-run path because it avoids holds while still showing the real breath pattern. Box remains available as the structured 4-4-4-4 option: Inhale 4 seconds, Hold 4 seconds, Exhale 4 seconds, Hold 4 seconds. Box's second Hold stays at the exhaled-small orb scale so the visual does not expand after the release. Every visible rhythm keeps the guided exhale at least as long as the guided inhale. There is no internal or visible `rest` phase in the current model. This replaced the earlier post-exhale Relax / Breathe naturally / Pause framing on 2026-06-21 after broad tester dislike and clinical-family pranayama feedback reinforced that the post-exhale beat was semantically confusing and could make the rhythm feel inhale-heavy. The pre-session Beginning in state lasts 4 seconds, shows a countdown with a subtle progress ring, and is skipped when resuming a session or tapping Breathe Again from completion. Soft, Box, Flow, and Relax presets reshape the per-phase durations; see the Rhythm component spec.

### Anticipatory Phase Cue

In the final lead window before each phase change, the guide ring around the orb crossfades to the incoming phase color and a quiet pre-cue tone plays when sound is on. The lead window is per-phase: `getPhaseLookahead(phase)` returns `Math.min(PHASE_LOOKAHEAD_SECONDS, phase.duration * 0.25)`, with `PHASE_LOOKAHEAD_SECONDS = 0.8`. Shipped phases are currently 4s or longer, so they use the full 0.8s lead; shorter future phases are capped at 25% of their own duration so the cue never occupies too much of the phase and reads as jittery. The intent is to give the brain a beat to register the upcoming transition without changing the actual phase timing. No textual HUD cue is shown; an earlier `Next [phase]` text experiment competed with the central phase label and the countdown for attention and was removed. Hook returns `nextPhase`, `phaseLeadProgress` (0-1), and `timeUntilPhaseEnd` so other consumers can opt in to anticipation without re-deriving them.

### Progress Indicators

- **Session ring:** Drawn on canvas around the orb, with session progress fill at 42% opacity over a 12% track. This is the sole session-level progress indicator; the redundant HUD progress bar was removed after a beta tester reported the floating colored segment more confusing than informative.
- **Guide ring:** The outer breath rail shows current phase progress and the incoming phase color lead, but it must stay lower contrast than the center orb. It is a pickup note, not the timing object to chase. Current and incoming arcs use reduced opacity/chroma so the orb remains the primary breathing anchor. The earlier separate inner phase-progress ring was removed after graphic-designer feedback because it duplicated the orb scale and countdown signals.

### Phase Transitions

During the last lead window of a phase (0.8s on long phases, capped to 25% of phase duration on short phases — see Anticipatory Phase Cue above), the guide ring begins to show the next phase color as a faint incoming arc. This is an anticipatory cue, not a new phase; it gives the user's eye a beat to understand that a transition is coming. It should be visibly softer than the center orb so anxious users do not feel behind before the orb itself changes.

Phase changes should feel like a handoff rather than a switch. The HUD keeps the current phase label active; anticipation is carried by the guide-ring color lead and quiet pre-cue sound. Visual color transitions are deliberately softened; the boundary can be sensed before the orb changes state, especially for users who need a moment to process the new instruction.

### Session HUD Legibility

The active phase label and Beginning in label use semibold 600 with a dark text shadow because they sit directly on the canvas orb and must read on bright phase colors. On phones, phase labels use lower tracking than ordinary uppercase labels so older and low-vision users can parse the word shape. The active label is 2.75rem on mobile, 3rem on desktop, and stays at 90-96% Still White opacity.

Visible session instruction is phase-only: `Inhale`, `Hold`, and `Exhale` (Flow uses only `Inhale` and `Exhale`), plus the countdown. Do not place a sentence instruction over the orb. The timer is large enough to read from a phone at arm's length and never fades below a faint-but-visible state. A local forest-night contrast backplate sits behind the phase word and timer. In `prefers-contrast: more`, the canvas removes ambient washes, particle texture, and soft halos while strengthening the orb rim, guide ring, phase label, and countdown.

### Rhythm

The breathing pattern itself is selectable inside the `Pattern` tab of Session Setup under the label `Breathing Sequence`. Four options, shown in picker order:

- **Soft** (`gentle`, `Accessible`) — 4-4, 8s cycle. Default for first-time users; no holds, just an easy in and out.
- **Box** (`standard`, `Structured`) — 4-4-4-4, 16s cycle. Structured square-breathing option; the second Hold after Exhale stays at the exhaled orb scale.
- **Flow** (`flow`, `Continuous`) — 4-6, 10s cycle. No hold or pause, just inhale and longer exhale.
- **Relax** (`box`, `Classic`) — 4-7-8, 19s cycle. The storage id remains `box` for compatibility with saved settings and legacy `full` / `slow` mappings.

Each option is a compact selection card for `Soft`, `Box`, `Flow`, and `Relax`. The visible card shows the pace name, the numeric signature, and the actual phase pattern as proportional timing bars with phase seconds. One-word descriptors (`Accessible`, `Structured`, `Continuous`, `Classic`) stay in aria-labels for screen readers and implementation clarity, not as visible persuasion copy. This makes rhythm choice concrete without asking the user to imagine what "soft" or "flow" means.

Rhythm uses the same quiet emerald selected-state language as Time, Circle Size, and Sound. Default is `Soft` (stored as internal id `gentle`). The choice persists through `exhale-rhythm` in localStorage and `user_settings.rhythm` in Supabase; legacy `full` and `slow` values normalize to `box`. Rhythm cannot change mid-session; the picker is read once at session start and the resulting pattern drives the orb timing, audio cue ramps, and HUD time-remaining calculation. Switching rhythm requires returning to the home screen and starting a new session.

The pattern preview is part of the picker, not a second reveal. Every pace card shows the true phase sequence in place: Inhale, optional Hold, Exhale, with seconds and proportional bar lengths. The selected state keeps the same quiet emerald language as other settings. The picker does not use a separate `Show pattern` disclosure because that adds friction precisely where clarity is needed.

### Background Sound Palettes

Background sound is optional and synthesized only. The home screen exposes Off plus four texture choices: Warm, Air, Deep, and Still. Warm is the default and adds a little body without becoming foreground audio. Air should stay closest to silence: filtered air, a low grounding tone, and a sparse open pad. Deep shifts the bed darker and lower. Still removes almost all tonality but remains audible as a very quiet breath tone. Sound options may include tiny phase-color dots as quiet material cues, but selected state remains emerald.

The palette control belongs in the `Audio` tab inside Session Setup, below the primary Begin flow, and its visible label is `Background sound` so users understand these choices affect the ambient bed rather than the phase cues. Sound textures use the same quiet emerald selected state as other radio controls. Selecting Air, Warm, Deep, or Still plays a brief soft preview, shows a small selected-tile preview indicator, announces the preview to screen readers, then fades out. Selecting the visible Off option stops sound immediately. No sound plays on page load from a saved setting. During active sessions, ambient sound also schedules a Web Audio clock fade-out at the guided-session deadline so Chrome background-tab throttling cannot leave the sound bed droning after completion.

### Circle Size

Circle Size lives in the `Visual` tab and uses compact S/M/L radio controls. New users default to M. The active size uses the same emerald border, faint tint, and green-lit label as Time, Pattern, and Audio selections, so all home-screen preferences share one checked-state language while Begin stays the only solid green control. The S/M/L dots may use Inhale/Hold/Exhale phase colors to echo the orb, but they stay small and informational.

### Session Setup Disclosure

Session Setup is the single push-down disclosure below Begin and Resume, shown only after the visitor has completed at least one local session. First-visit users see exactly one decision (length) and one action (Begin); after completion, the disclosure label becomes `Adjust next session`. The gate is local and anonymous, based on `exhale-stats`; if localStorage is unavailable, show setup rather than trapping the user in defaults. Session Setup contains a three-part segmented tab row: `Pattern`, `Visual`, and `Audio`. Pattern contains four breathing-sequence cards under the local section label `Breathing Sequence`; each card includes the breathing pattern directly. Visual contains Circle Size. Audio contains Off plus the four sound textures. Practice History stays outside Session Setup because it is navigation, not a preference, and is shown only after at least one completed session.

### Stats Rows

Flat list, no cards, no side borders. Each row: `border-b border-still-white/10`, `py-5`, label in label style at 58% white, value in headline style at 86% white. Tiny phase-color dots may sit beside labels and recent-session dates to carry the orb language into reflection without turning history into a progress dashboard. The asymmetry (tiny label, large value) creates hierarchy without structural chrome.

Practice history is pure reflection. Show only `Sessions`, `Total time`, `Days practiced`, and `Recent sessions`. Do not show weekly counts, streaks, milestones, badges, future targets, unearned markers, or any progress frame that nudges the user to maintain a pattern.

### Optional Sign In

Sign In belongs only in the footer and on the Practice screen, below the reflective history content. It is an optional continuity affordance, not a requirement before breathing. It syncs practice history, timer length, Circle Size, sound choice, and rhythm.

The default path remains anonymous local use. Footer `Sign In` opens Practice so the user can choose Google, Apple, or email sign-in without making any provider feel required. The Practice copy stays practical: "Sign in to track your history across all devices." Provider actions read `Sign In With Google`, `Sign In With Apple`, and `Email Sign In`.

Email sign-in uses a magic link as the visible path. Legacy email-code verification can remain as a recovery bridge for older in-progress states, but normal users should not see a code-first flow. Do not use avatars, profile language, account settings, resend loops, premium-gate framing, or anything that makes breathing feel gated.

Email Updates consent appears as one unchecked checkbox in the Practice Sign In section. It must remain opt-in only: unchecked means no update emails. The checkbox is for future update messages, not for breathing, sync, account access, or any required step. If checked, consent is recorded only after sign-in completes with a real email identity.

OAuth releases must keep `/privacy` and `/terms` current in the same change. They should explain the optional provider path in plain language, name what syncs, note third-party provider involvement, preserve the anonymous-first promise, and avoid legalistic language that makes Sign In feel mandatory.

Cloud writes for settings are debounced (~400ms trailing) so rapid clicks through Circle Size or Sound options collapse into a single Supabase upsert. localStorage writes stay immediate so the local UI reflects the choice without waiting on a round trip.

### Future Admin/Support Panel

If the roadmap's admin/support panel is built, it should feel like a quiet operations surface, not a new branded destination. Use the same forest-night ground, Still White hierarchy, restrained emerald selected state, and flat list/table language. Keep density higher than the breathing app where support tasks require scanning, but do not introduce a SaaS dashboard aesthetic, hero metrics, bright charts, card grids, avatars, or account-management theater. The first version should be a protected Next.js route backed by Supabase; design for support lookup, deletion confirmation, beta event review, retention/drop-off summaries, and lightweight quote/theme maintenance.

## 6. Do's and Don'ts

### Do:
- **Do** keep emerald (`#34d399`) at ≤10% surface coverage on any screen outside the active session canvas.
- **Do** use opacity as the primary tool for hierarchy — `white/90` to `white/18` covers every level from primary action to structural chrome.
- **Do** apply wide tracking (`0.18em` minimum) to all uppercase labels. Tight tracking on uppercase looks cramped at these weights.
- **Do** use amber (`#fbbf24`) exclusively on the session complete screen. It is earned by finishing a session — nowhere else.
- **Do** keep all button text at `font-light` (300) or lighter, uppercase, with tracking `≥0.18em`. The Begin button is the one sanctioned exception, using semibold 600 at tracking 0.20em (see Begin (Primary)).
- **Do** respect `prefers-reduced-motion`: skip the orb breathe animation and canvas particle system entirely when the OS requests it.
- **Do** surface stats and practice history as optional, secondary navigation. Never on the critical path to breathing.
- **Do** keep Sign In optional and quiet. It is for carrying history across devices, not for onboarding.
- **Do** keep active-session phase and instruction text readable for older and low-vision phone users. Use size, lower tracking, dark edge contrast, and a local halo before adding louder UI.
- **Do** place session controls (Pause, Exit) in the bottom corners of the session screen — the thumb zone on all phone sizes.
- **Do** give every orb mark (home, stats, complete) its outer ring at `inset -12px` to `inset -14px`, colored to match the orb's accent at low opacity (emerald for home/stats, amber for complete).

### Don't:
- **Don't** use `font-bold`, `font-extrabold`, `font-normal`, or any weight other than 100, 200, 300, or 600. The weight ceiling is semibold (600), used only on the active phase label and the Begin button. See the Weight Ceiling Rule for why Begin is the sanctioned exception.
- **Don't** add shadows for structural elevation. No `box-shadow` on cards, panels, modals, buttons, or static orb marks. Luminous depth belongs inside the session canvas only.
- **Don't** use glassmorphism: no `backdrop-filter: blur()` on UI chrome. The canvas has depth; the UI does not.
- **Don't** use gradient text (`background-clip: text`). Phase colors on the orb are earned; gradient text on labels is decoration.
- **Don't** use a colored overlay for dialog/guard backdrops. The exit guard background is a tinted forest-night scrim, not emerald, a phase color, or pure black.
- **Don't** add a second accent color. Emerald and amber are the full palette. Phase colors outside the canvas are limited to tiny semantic markers in rhythm, Circle Size, Sound, and Practice History.
- **Don't** use `italic` anywhere in the interface. There is no italic role in this system. Emphasis is conveyed via opacity, not decoration.
- **Don't** design like Headspace or Calm — no onboarding carousels, no premium gate framing, no illustrated brand characters, no teacher voices.
- **Don't** design like a fitness app — no streak counters as pressure, no achievement popups, no guilt mechanics.
- **Don't** require an account, login, OAuth, or cloud sync before breathing. Optional Sign In must never block first use.
- **Don't** build a full account surface around sign-in. No profile screen, avatar, password flow, account settings, or auth-first navigation.
- **Don't** make a future admin panel look like generic SaaS. No hero metrics, bright chart walls, nested cards, or decorative dashboard chrome.
- **Don't** add push notifications, sharing features, or social comparisons. The experience is private and self-contained.
- **Don't** use audio files. All sound is synthesized via Web Audio API. Zero load time is part of the low-friction promise.
