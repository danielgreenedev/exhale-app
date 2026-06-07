# Codex Handoff

Last updated: 2026-06-07 (Google-only sign-in simplification)

This document is overwritten on each handoff. The previous handoff's content does not need to be preserved; the commit history and `docs/TODO.md` / `docs/OPEN_QUESTIONS.md` / `docs/USER_FEEDBACK.md` are the durable record.

## Branch State

- Branch: `master`. Working tree should be clean after the current SEO/docs pass is committed and pushed.
- Recent commit history before this pass:
  - `5d86e5b` - Bing site verification file and local artifact ignore rules.
  - `c120dbe` - Static sitemap route plus `robots.txt` sitemap declaration.
  - `06ec5a9` - Full rhythm replaced by Box.
  - `743e510` - Handoff rewrite for the prior Facebook in-app browser pass.
  - `5f45fb5` - Orb-overflow fix in Facebook in-app browser; Meta hint copy tightened.
- Verification standard: `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`. Restore `next-env.d.ts` to the checked-in dev-routes import if `next build` rewrites it.

## What Changed Most Recently

- **Search crawler coverage.** `src/app/sitemap.ts` now serves `/sitemap.xml` for `/`, `/privacy`, and `/terms`; `public/robots.txt` advertises `Sitemap: https://exhale.guide/sitemap.xml`.
- **Bing verification.** `public/BingSiteAuth.xml` is deployed at `/BingSiteAuth.xml`. The owner reports Google and Bing are now verified; Bing URL Inspection shows `https://exhale.guide` indexed successfully.
- **Home H1 hardening.** Bing flagged `H1 tag missing`. The visible app already renders `<h1>Exhale</h1>` after client hydration, but the static HTML for `/` was bailing out to client rendering because the home page reads `useSearchParams`. `HomeFallback` now gives the static HTML a crawler-visible Exhale H1 while preserving the hydrated app UI.
- **Crawler caveat.** Spoofed `bingbot` command-line requests can still hit Vercel's challenge response. Since real Bing verification/indexing is working, treat this as monitor-only. If Bing or Google inspection later fails to fetch the live page, use Vercel Firewall / Verified Bots allow rules rather than changing app markup.

## Durable Invariants

- **Four visible paces.** Steady (4-4-6-4, cycle 18s), Soft (3-2-4-4, cycle 13s), Box (4-4-4-4, cycle 16s), Flow (4-0-6-2, cycle 12s).
- **Fourth phase handling.** Steady, Soft, and Flow use `Relax` / `Breathe naturally` with internal phase enum `'rest'`. Box uses a second user-facing `Hold` after Exhale.
- **Rhythm lock.** `rhythmRef` locking in session/audio/orb code is intentional. Rhythm is fixed at session start.
- **Meta webview layout.** Game `main` keeps `100dvh` inline style with `h-screen` fallback, and `BreathingOrb` keeps the width-aware radius clamp. Removing either side risks regressing Facebook in-app browser layout.
- **Cue hierarchy.** Center orb is the primary timing object. Outer guide ring and incoming-color lead stay quiet support.
- **Auth/sync.** Anonymous local use remains default. Sign In is optional, Google-only in the visible UI, and framed as history across devices rather than an account gate.
- **Supabase auth.** Only fall back to anonymous on explicit 401/403. Transient errors preserve cached sessions.
- **Footer sign-in link.** Anonymous label `Sign In`, signed-in label `Signed In`. Anonymous visitors with no local practice history start Google sign-in directly; anonymous visitors with local history go to `/stats#sync` first.

## Feedback Mode

Next highest-leverage validation asks:

1. **Pixel/Facebook owner retest:** in Facebook Android on Pixel 9 Pro XL, Circle Size Large, confirm whether the orb and outer guide ring now fit fully without left/right clipping.
2. **Box vs Flow rhythm check:** after one Box session and one Flow session, ask whether Box's post-exhale Hold feels clearer than Relax, or whether Flow feels better because it minimizes pauses.
3. **Meta-browser sound/capability check:** in Facebook or Messenger in-app browsers, note whether sound works, whether the menu hint is understandable, and whether opening in the normal browser changes behavior.
4. **HUD readability check:** confirm whether phase text and transitions feel readable and smooth after the dimmer-orb/crossfade pass.

Keep Steady default changes, no-pause Flow variants, voice guidance, Garden skin, Android TWA, and parked Impeccable follow-ups behind one more validation pass.

## Do Not Revert / Preserve

- `nextPhase`, `phaseLeadProgress`, and `getPhaseLookahead`.
- Local-only Supabase auth bypass on localhost unless deliberately testing sync.
- Vercel firewall and `robots.txt` crawler allowances for social preview bots.
- Sitemap and Bing verification files unless search-console ownership is intentionally changed.
- Sign In framing: no profile screen, no auth-first onboarding, no required sign-in before breathing.
- `PolicyFooter` sign-in role as the recovery path when Practice History is hidden.
