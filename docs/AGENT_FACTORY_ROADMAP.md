# Exhale Agent Factory Roadmap

Last updated: 2026-06-21

## Purpose

Create a Codex-native agent factory for Exhale that improves review, documentation, and release confidence without adding brittle MCP dependencies or unattended git automation.

## Principles

- Keep Exhale's source of truth in `CLAUDE.md`, `DESIGN.md`, `PRODUCT.md`, and `docs/HANDOFF.md`.
- Use a repo-local skill under `.agents/skills/` instead of loose `.codex/skills/*.md` persona files.
- Prefer existing Codex desktop tools, Browser/Playwright capabilities, and npm scripts before adding new MCP servers.
- Make release automation guarded: validate first, then commit or push only after explicit approval.
- Support optional subagent delegation when requested, but keep the workflow usable in one Codex session.

## Phase 1: Skill Foundation

Status: complete

- Created `.agents/skills/exhale-ship/SKILL.md`.
- Added focused reference playbooks for code review, design review, docs harmonization, and release.
- Kept the main skill concise and role playbooks loaded only when needed.
- Validated skill metadata with the skill-creator validation script.

## Phase 2: Review Gates

Status: complete for first factory run; ongoing per change

- Ran the code review gate against the no-post-exhale rhythm changes.
- Ran the design gate for UI/copy changes and confirmed no new source-level design violations.
- Used `npm.cmd run audit:impeccable`; current warnings are pre-existing color-token warnings around Tailwind emerald/gray defaults and the Next dev portal, not regressions from the rhythm change.
- Recorded no P0/P1 blockers for the first factory run.

## Phase 3: Documentation Harmonization

Status: complete for first factory run; ongoing per change

- Updated `docs/HANDOFF.md`, `CLAUDE.md`, `DESIGN.md`, `docs/TODO.md`, `docs/OPEN_QUESTIONS.md`, and `docs/USER_FEEDBACK.md` for the no-post-exhale rhythm model.
- Cross-checked product and design changes against `PRODUCT.md`, `CLAUDE.md`, and `DESIGN.md`.
- Fixed docs drift found by the gate: removed the retired `quiet-blush` design token and removed active tester prompt wording that still asked about `Pause`.

## Phase 4: Guarded Release

Status: local validation complete; push/deployment pending explicit approval

- Inspected `git status -sb` and avoided broad staging.
- Ran `git diff --check`, `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`.
- Committed the validated release candidate as `7f42735 feat: retire post-exhale phase and add ship workflow`.
- Remaining gated step: push `master` and check Vercel deployment status after explicit approval.

## Phase 5: Optional Factory Expansion

Status: in progress

- Added subagent prompt templates for optional parallel code, design, docs, and release-readiness review.
- Tightened the guarded release playbook with deployment-check paths that do not assume a linked Vercel project.
- MCP additions remain deferred; current Codex desktop tools, Browser/Playwright capabilities, npm scripts, and git commands are enough for the current factory loop.
