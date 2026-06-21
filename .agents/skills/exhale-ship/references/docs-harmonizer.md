# Docs Harmonizer Gate

Use this gate when code, design, product behavior, release readiness, open questions, or feedback records changed.

## Inputs

- Inspect changed files with `git status -sb` and focused diffs.
- Read `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, `docs/HANDOFF.md`, `docs/OPEN_QUESTIONS.md`, `docs/USER_FEEDBACK.md`, `docs/TODO.md`, and `docs/ROADMAP.md` only as needed.

## Checks

- Keep `docs/HANDOFF.md` current with branch state, important changed areas, recent decisions, and verification results.
- Cross-check product behavior against `PRODUCT.md` and `CLAUDE.md`.
- Cross-check visual or copy changes against `DESIGN.md`.
- Flag contradictions such as forced accounts, gamification, external audio files, unapproved post-exhale pauses, or design rules that no longer match implementation.
- Move resolved open questions or feedback only when the change clearly answers them.
- Do not edit game code or UI from this gate.

## Output

- Keep documentation edits narrow and factual.
- Mention what docs were updated and why.
- Do not commit docs directly unless the user explicitly requests a commit.
