---
target: exhale app full critique
total_score: 28
p0_count: 0
p1_count: 1
timestamp: 2026-05-17T04-48-08Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Audio indicator (14x14px, opacity-40) is effectively invisible; paused state text is white/25 |
| 2 | Match System / Real World | 4 | Phase labels, instructions, orb metaphor all speak natural language fluently |
| 3 | User Control and Freedom | 3 | Pause/resume/exit all work; Esc navigates away immediately with no confirmation guard |
| 4 | Consistency and Standards | 3 | Consistent button vocabulary except stats Back button renders as plain text link |
| 5 | Error Prevention | 2 | No destructive-exit confirmation; minutesLeft hardcodes 16-second cycle constant |
| 6 | Recognition Rather Than Recall | 4 | Everything visible; keyboard shortcuts printed in HUD; resume button shows elapsed time |
| 7 | Flexibility and Efficiency | 2 | Space/Esc shortcuts work; no audio mute toggle; single fixed breathing pattern |
| 8 | Aesthetic and Minimalist Design | 3 | Game screen minimal; HUD frosted panel draws attention to UI chrome during session |
| 9 | Error Recovery | 2 | Resume-state save is thoughtful; audio failure invisible; canvas/storage errors silently swallowed |
| 10 | Help and Documentation | 2 | Breathing pattern explained inline; no why-this-pattern or safety note |
| **Total** | | **28/40** | **Good - address weak areas, solid foundation** |

## Anti-Patterns Verdict

LLM assessment: Partially. The app avoids worst AI slop tells - no gradient text, no glassmorphism surfaces, no neon on black. The muted pastoral palette is deliberate. What keeps this from a clean pass: the stats page deploys the 2x2 hero-metric card grid that is the most cloned pattern in productivity UI, and the orb-on-dark with concentric rings is a structurally common AI design template - redeemed by the color work but recognizable.

Deterministic scan: Zero findings. Clean pass across all 27 patterns. The bg-black/48 from the previous run has been replaced with bg-emerald-950/45 and no longer triggers.

## Priority Issues

P1 - HUD center panel competes with the meditative experience. bg-emerald-950/45 rounded-3xl card sits over the orb during the entire session. Remove the backdrop panel; let phase label and countdown float with text-shadow treatment; reserve frosted panel for paused state only.

P2 - Accidental Esc exit has no confirmation. Keyboard Esc immediately exits with no guard. On Esc, surface a minimal overlay with Resume and Exit options.

P3 - Audio failure is invisible. If Web Audio fails, muted icon at opacity-20 shows with no explanation. Add one-time inline prompt when audio cannot autostart.

P4 - Stats page breaks the emotional register. 2x2 hero-metric grid, streak gamification, ISO date format. Replace with sparse single-column layout, soften streak framing, use human date formats.

P5 - Session-complete screen does not land the peak-end moment. Static quote, identical CTA weights. Make Breathe Again visually primary; rotate quotes or add contextual summary line from history.
