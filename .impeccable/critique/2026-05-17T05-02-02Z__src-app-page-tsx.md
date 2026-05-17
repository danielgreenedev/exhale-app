---
target: exhale app full critique pass 3
total_score: 34
p0_count: 0
p1_count: 0
timestamp: 2026-05-17T05-02-02Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Audio indicator still 14px at opacity-40, but live countdown, cycle counter, dual rings, and progress bar are comprehensive |
| 2 | Match System / Real World | 4 | Natural language throughout; "Rest" is slightly ambiguous vs "Pause" but taxonomically correct |
| 3 | User Control and Freedom | 3 | Exit guard is well-implemented; paused state indicator is white/25 — too faint to communicate clearly |
| 4 | Consistency and Standards | 4 | Highly consistent; only minor: pause/resume buttons use emoji while all other controls use text |
| 5 | Error Prevention | 3 | Exit guard and resume window are solid; immediate start-on-mount gives no count-in buffer |
| 6 | Recognition Rather Than Recall | 4 | All decisions visible; keyboard hints present; resume button shows length and elapsed time |
| 7 | Flexibility and Efficiency | 3 | Space/Esc/arrow-keys work; no persistent last-used session length preference |
| 8 | Aesthetic and Minimalist Design | 4 | Game screen genuinely minimal — orb and floating text only; home screen vertical density is high but justified |
| 9 | Error Recovery | 3 | Exit guard and 60s resume window are genuine improvements; silent localStorage failure still drops data without feedback |
| 10 | Help and Documentation | 2 | Pattern explained inline; keyboard hint at white/22 nearly invisible; no mobile touch equivalent; no ring legend |
| **Total** | | **34/40** | **Good — minor polish before ship** |

## Anti-Patterns Verdict

LLM assessment: No. This no longer reads as AI-generated. The forest-green near-black (#090c0a), the four-phase color semantics (cool blue / warm amber / sage / dusty rose), the ultra-light type with extreme letter-spacing, and the sparse stats list all distinguish it from the standard dark-UI template. The exit guard overlay, the humanized dates, and the floating HUD text show design decisions that required intentionality. Residual risk: the SessionComplete quotes follow the same aphoristic template and may read as AI-sourced.

Deterministic scan: One finding — bg-black/40 on the exit guard overlay (game/page.tsx line 258). The detector flagged it as a pure-black background; in context this is a semi-transparent dimming layer, not a true background. It should be tinted slightly toward emerald (bg-emerald-950/40 or similar) to stay in palette. Not a slop signal — a minor palette consistency note.

## Priority Issues

P2 - No count-in buffer before session start. The game page calls start() on mount. By the time the page loads and the user orients, "Inhale" is already ticking. A 2-3 second "Ready" state before the first breath fires would match every guided session context (yoga, meditation apps, physical coaching) and remove the micro-anxiety spike of being caught unprepared.

P2 - "Days practiced" label misrepresents streak semantics. The value is a consecutive-day streak counter that resets on any gap day. A user with 20 lifetime sessions may see "1" after a two-day absence and conclude their data is lost. Either change the label back to "Day streak" (accurate) and add a separate lifetime unique-day count, or replace streak entirely with a monotonically increasing "days practiced" count — appropriate for a low-judgment wellness app.

P2 - Paused state is too visually faint. "Paused" at white/25 is approximately 2.5:1 contrast against #090c0a — failing WCAG AA. The keyboard hint ("space to resume") at white/22 is even lower. A user who accidentally hit Space may believe the app has frozen. Raise the "Paused" text to white/55 and add "Space to resume" beneath it at white/38.

P2 - Silent localStorage failure drops completed session data. catch blocks in useSessionStats swallow errors without any user feedback. In private/incognito browsing (plausible for discretion-seeking users), or on iOS Safari with storage restrictions, a user completes a session and navigates to stats to find "No sessions yet." Fix: surface a non-blocking note on SessionComplete ("History requires storage access") and display an in-memory session summary regardless of storage.

P3 - "~N min remaining" surfaces time-awareness during a time-relief experience. The approximate countdown at the bottom of the HUD draws attention to time passing — the opposite of present-moment focus. The session progress bar communicates the same information without activating the anticipatory mental loop. Consider removing the text label and relying on the bar alone, or replacing it with neutral copy after the first cycle.
