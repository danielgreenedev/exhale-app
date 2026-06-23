---
name: exhale-ship
description: Guarded Exhale shipping workflow for Codex. Use when asked to run or improve the Exhale agent factory, /ship pipeline, release readiness flow, code review gate, design review gate, documentation harmonization, or pre-release validation for this repo.
---

# Exhale Ship

## Overview

Run Exhale changes through a guarded, repo-aware shipping workflow. Keep the workflow useful in one Codex session, and use subagents only when the user explicitly asks for parallel agent work.

## Source Of Truth

Read these files before making judgments that depend on product, design, or release rules:

- `CLAUDE.md` for repo map, current mechanics, and implementation guardrails.
- `PRODUCT.md` for product promise and non-goals.
- `DESIGN.md` for Still Water visual rules.
- `docs/HANDOFF.md` for current branch state and recent decisions.
- `package.json` for the actual validation commands.

Treat those files as canonical. Do not duplicate long rule text from them unless the user asks for a standalone artifact.

## Workflow

1. Inspect `git status -sb` and identify changed files.
2. Run the code review gate when source, tests, auth, sync, rhythm, audio, or routing changed. Read `references/code-review.md`.
3. Run the design review gate only when UI, CSS, Tailwind, visible copy, or interaction behavior changed. Read `references/design-review.md`.
4. Run the docs harmonizer when product behavior, design rules, verification state, open questions, or feedback changed. Read `references/docs-harmonizer.md`.
5. Apply the owner decision guardrail before accepting risk, expanding scope, or choosing among materially different fixes. Read `references/owner-decision.md`.
6. Run the release gate only after review blockers are resolved or the user asks for release readiness. Read `references/release.md`.

Stop for confirmation before committing, pushing, deploying, adding MCP servers, or changing automation behavior.

## Severity

- P0: Must fix before any release; severe product, privacy, data-loss, build, or app-blocking issue.
- P1: Must fix before this change ships; breaks an Exhale core rule, major workflow, accessibility path, or verification standard.
- P2: Should fix soon; meaningful quality, maintainability, or documentation risk.
- P3: Optional polish.

Lead review outputs with findings. If no blocking issues exist, say so plainly and list remaining verification gaps.

## Owner Decision Guardrail

Use severity plus decision type to decide when to stop for the owner.

- P0: Always blocks release. Fix obvious local defects when the user asked for a fix, but ask before accepting risk, choosing a tradeoff, touching external services, or shipping.
- P1: Blocks the current change. Fix when the remedy is narrow and preserves documented behavior; ask when the remedy changes product direction, default behavior, privacy/auth/sync posture, accessibility tradeoffs, or has multiple credible options.
- P2: Usually proceed or document without asking. Ask only when it expands scope, consumes meaningful time, changes roadmap priority, or asks the owner to accept known risk.
- P3: Do not interrupt. Park, document, or include as optional polish.

Always ask before committing, pushing, deploying, changing external services, adding dependencies/MCP servers, changing database policy/schema in production, or overriding a durable product/design non-goal. If the owner is unavailable, choose the safest non-shipping path: fix clear defects, document uncertainty, and do not release with unresolved P0/P1 risk.

Read references/owner-decision.md when a finding may need owner input.

## Delegation

Keep the default workflow single-session. If the user explicitly asks for subagents or parallel agent work, read `references/subagents.md` and split by disjoint responsibility:

- Code review agent: read-only source and tests.
- Design review agent: read-only UI, CSS, browser inspection, and design docs.
- Docs agent: write only docs.
- Release agent: verification commands only, with git operations gated by approval.

Do not ask a worker to stage, commit, push, or deploy unless the user explicitly authorized that action.
