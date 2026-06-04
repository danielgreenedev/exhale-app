# Codex Handoff

Last updated: 2026-06-04 (Box replaces Full; Pixel/Facebook Large orb edge clamp)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`. Working tree has uncommitted source and doc updates for the Pixel/Facebook Large orb clamp and the Full-to-Box rhythm replacement. Untracked dev logs (`.next-dev.err.log`, `.next-dev.out.log`, `debug.log`, `tmp/`) should stay out of git.
- Recent commit history (newest first):
  - `5f45fb5` - Orb-overflow fix in Facebook in-app browser; Meta hint copy tightened.
  - `4837cc2` - Steady (4-4-6-4) and Full (6-6-10-6) Relax revisions.
  - `f850b5f` - Doc reconciliation for the auth-aware footer label.
  - `1b447bf` - Auth-aware `Signed In` / `Sign In to Sync` label on the footer, plus `/stats#sync` anchor.
  - `3b4a031` - Auth refresh hardening and shared sign-in footer link.
- Verification standard: `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`. Restore `next-env.d.ts` to the checked-in dev-routes import if `next build` rewrites it.

## What Changed Most Recently

- **Large orb clamp tightened (`src/components/BreathingOrb.tsx`).** Real Pixel 9 Pro XL / Android / Facebook-app testing still clipped Large mode by about 20px per side after the first 14px simulated side gap. The orb now keeps a 40px canvas edge margin and compresses minimum guide-ring spacing before shrinking the core orb. Local faked-Facebook checks at 393x873, 412x915, and 360x640 confirmed a 40px side gap.
- **Full replaced by Box (`src/lib/breathing.ts`).** Owner feedback promoted Relax confusion from tester preference to product-model issue. Current visible paces are Steady, Soft, Box, Flow. Box is 4-4-4-4 (cycle 16s) and uses a second Hold after Exhale instead of Relax.
- **Legacy rhythm compatibility.** `normalizeRhythmId()` maps saved `full` and older `slow` values to `box`. Home/game URL handling and local/cloud settings sync use this normalization. `supabase/migrations/004-rename-full-to-box.sql` updates existing synced rows.
- **Docs updated.** `CLAUDE.md`, `DESIGN.md`, `docs/TODO.md`, `docs/ROADMAP.md`, `docs/OPEN_QUESTIONS.md`, and `docs/USER_FEEDBACK.md` now describe Box as the current structured preset.

## Durable Invariants

- **Four visible paces.** Steady (4-4-6-4, cycle 18s), Soft (3-2-4-4, cycle 13s), Box (4-4-4-4, cycle 16s), Flow (4-0-6-2, cycle 12s).
- **Fourth phase handling.** Steady, Soft, and Flow use `Relax` / `Breathe naturally` with internal phase enum `'rest'`. Box uses a second user-facing `Hold` after Exhale.
- **Rhythm lock.** `rhythmRef` locking in session/audio/orb code is intentional. Rhythm is fixed at session start.
- **Meta webview layout.** Game `main` keeps `100dvh` inline style with `h-screen` fallback, and `BreathingOrb` keeps the width-aware radius clamp. Removing either side risks regressing Facebook in-app browser layout.
- **Cue hierarchy.** Center orb is the primary timing object. Outer guide ring and incoming-color lead stay quiet support.
- **Auth/sync.** Anonymous local use remains default. Backup & Sync is optional and framed as persistence, not an account gate.
- **Supabase auth.** Only fall back to anonymous on explicit 401/403. Transient errors preserve cached sessions.
- **Footer sync link.** Anonymous label `Sign In to Sync`, signed-in label `Signed In`; both target `/stats#sync`.

## Feedback Mode

Next highest-leverage validation asks:

1. **Pixel/Facebook owner retest:** in Facebook Android on Pixel 9 Pro XL, Circle Size Large, confirm whether the orb and outer guide ring now fit fully without left/right clipping.
2. **Box vs Flow rhythm check:** after one Box session and one Flow session, ask whether Box's post-exhale Hold feels clearer than Relax, or whether Flow feels better because it minimizes pauses.
3. **iPhone Meta-webview tester:** open Exhale from Facebook on iPhone and verify orb fit, Meta hint readability, and whether an external browser option exists.

Keep Steady default changes, no-pause Flow variants, voice guidance, and parked Impeccable follow-ups behind one more validation pass.

## Do Not Revert / Preserve

- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`.
- Local-only Supabase auth bypass on localhost unless deliberately testing sync.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Backup & Sync framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.
- `PolicyFooter` sync-link role as the recovery path when Practice History is hidden.
