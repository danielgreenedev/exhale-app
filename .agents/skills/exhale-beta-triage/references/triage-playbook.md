# Beta Triage Playbook

## Triage Shape

For each item capture:

- Source: tester, owner, reviewer, analytics, support-like report, or unknown.
- Surface: Home, Game, Complete, Stats, auth/sync, docs, deployment, or unknown.
- Observation: what happened, in concrete terms.
- Impact: blocked completion, confused timing, visual discomfort, low-vision issue, device bug, trust/privacy issue, polish, or idea.
- Confidence: confirmed, repeated, plausible, speculative.
- Decision: accepted, needs-repro, parked, rejected, or already-handled.
- Destination: feedback, todo, open question, handoff, or no doc edit.

## Documentation Destinations

Use `docs/USER_FEEDBACK.md` for raw evidence and anonymized tester quotes. Preserve concrete device/browser/session details.

Use `docs/TODO.md` for accepted work. Phrase tasks as small outcomes, not broad themes.

Use `docs/OPEN_QUESTIONS.md` for validation prompts, owner decisions, and uncertain tradeoffs.

Use `docs/HANDOFF.md` only for current branch state, recent decisions, verification status, or warnings the next Codex session must see.

## Exhale-Specific Filters

Escalate anything that risks the first session: first-visit home clarity, Begin path, session setup disclosure, active phase readability, audio start/fade behavior, exit guard, completion save, or local history.

Escalate accessibility reports even from one tester when they involve low vision, motion sensitivity, reduced contrast, keyboard access, screen-reader labels, or device/browser incompatibility.

Be skeptical of feature ideas that add a new choice before breathing. Exhale's validation stage values completion and return behavior over breadth.

Keep beta asks concrete:

- "Which screen?"
- "Which device and browser?"
- "What rhythm, circle size, sound setting, and session length?"
- "Did it block completion or just feel odd?"
- "Could you reproduce it after reload?"
