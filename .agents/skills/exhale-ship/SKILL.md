---
name: exhale-ship
description: Guarded Exhale shipping workflow for Codex. Use when asked to run or improve the Exhale agent factory, /ship pipeline, production deployment preparation, precommit/prepush/production release readiness, baseline Impeccable cleanup, code review gate, design review gate, documentation harmonization, commit analysis, cleanup, commit, push, deployment checks, or pre-release validation for this repo.
---

# Exhale Ship

## Overview

Run Exhale changes through a guarded, repo-aware shipping workflow. Treat this skill as the release conductor: it routes to focused review gates, applies only low-risk automatic cleanup, runs verification, prepares commits, and pushes only when explicitly authorized.

Keep the workflow useful in one Codex session, and use subagents only when the user explicitly asks for parallel agent work.

## Source Of Truth

Read these files before making judgments that depend on product, design, or release rules:

- `CLAUDE.md` for repo map, current mechanics, and implementation guardrails.
- `PRODUCT.md` for product promise and non-goals.
- `DESIGN.md` for Still Water visual rules.
- `docs/HANDOFF.md` for current branch state and recent decisions.
- `package.json` for the actual validation commands.

Treat those files as canonical. Do not duplicate long rule text from them unless the user asks for a standalone artifact.

## Workflow

1. Choose the shipping mode:
   - `precommit`: review, low-risk cleanup, tests, and commit-readiness summary. Do not commit unless the user also explicitly asks.
   - `prepush`: everything in `precommit`, plus production build, branch hygiene, and push-readiness summary. Do not push unless explicitly asked.
   - `production`: full release pipeline with deployment/external-service checks. Commit and push only when the user explicitly authorizes those actions.
2. Read `references/production-pipeline.md` for the mode checklist, sub-skill routing, auto-fix rules, commit analysis, and final report shape.
3. Inspect `git status -sb` and identify changed files.
4. Run the code review gate when source, tests, auth, sync, rhythm, audio, or routing changed. Read `references/code-review.md`.
5. Run the design review gate only when UI, CSS, Tailwind, visible copy, or interaction behavior changed. Read `references/design-review.md`.
6. Run the docs harmonizer when product behavior, design rules, verification state, open questions, or feedback changed. Read `references/docs-harmonizer.md`.
7. Apply the owner decision guardrail before accepting risk, expanding scope, choosing among materially different fixes, committing, pushing, deploying, or touching external services. Read `references/owner-decision.md`.
8. Run the release gate only after review blockers are resolved or the user asks for release readiness. Read `references/release.md`.

Stop for confirmation before committing, pushing, deploying, adding MCP servers, or changing automation behavior unless the current user request explicitly authorizes that exact action.

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

Always ask before committing, pushing, deploying, changing external services, adding dependencies/MCP servers, changing database policy/schema in production, or overriding a durable product/design non-goal unless the current user request explicitly authorizes that exact action. If the owner is unavailable, choose the safest non-shipping path: fix clear defects, document uncertainty, and do not release with unresolved P0/P1 risk.

Read references/owner-decision.md when a finding may need owner input.

## Automatic Fix Contract

Auto-fix only low-risk defects that are mechanical, local, and consistent with the source-of-truth docs. Examples: invalid Tailwind opacity syntax, generated `next-env.d.ts` route import churn after build, obvious missing design-token variants, accidental screenshot/build artifacts, whitespace failures from `git diff --check`, or narrow docs drift caused by the current change.

Do not auto-fix product direction, auth/sync behavior, Supabase schema/RLS, external provider settings, payment/donation flow, SEO strategy, first-run defaults, rhythm semantics, accessibility tradeoffs, or monetization placement. Report those as decisions or follow-up work.

## Delegation

Keep the default workflow single-session. If the user explicitly asks for subagents or parallel agent work, read `references/subagents.md` and split by disjoint responsibility:

- Code review agent: read-only source and tests.
- Design review agent: read-only UI, CSS, browser inspection, and design docs.
- Docs agent: write only docs.
- Release agent: verification commands only, with git operations gated by approval.

Do not ask a worker to stage, commit, push, or deploy unless the user explicitly authorized that action.
