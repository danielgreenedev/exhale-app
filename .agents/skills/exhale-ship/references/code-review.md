# Code Review Gate

Use this gate for source, tests, auth, sync, rhythm, audio, routing, state-machine, or data-flow changes.

## Inputs

- Run `git status -sb`.
- Inspect changed source and test diffs.
- Read `CLAUDE.md`, `PRODUCT.md`, and `docs/HANDOFF.md` when judging core mechanics.

## Checks

- Preserve anonymous-first use. Google/Supabase sign-in must remain optional and must not block breathing.
- Preserve Web Audio API synthesis. Do not introduce external audio files for session sound.
- Preserve `scheduleAmbientStop` behavior for active sessions so background-tab throttling cannot leave ambient audio running after completion.
- Preserve rhythm locking at session start through the `rhythmRef` pattern where session, audio, or orb behavior depends on rhythm.
- Preserve the 0.8 second anticipatory phase lookahead, capped at 25% for short phases.
- Do not reintroduce an internal or visible post-exhale `Relax`, `Pause`, `Breathe naturally`, or `rest` phase without fresh product approval.
- Keep App Router client boundaries correct: files using hooks or browser APIs need `"use client"` where applicable.
- Watch for hydration mismatches from browser-only state, localStorage, time, random values, or auth bootstrap behavior.
- Add or adjust focused tests when behavior changes in `src/lib`, `src/hooks`, or critical user flows.

## Output

- Lead with P0/P1 findings, each with file and line references.
- Include P2/P3 items only after blockers.
- If a fix plan is useful, write a concise plan to `.plans/` only when the user asks for a persistent plan.
- Do not edit source code during a read-only review request.
