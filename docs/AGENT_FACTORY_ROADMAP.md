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

Status: planned

- Run the code review gate against working-tree changes.
- Run the design gate only when UI, CSS, Tailwind, or visible copy changes.
- Use `npm.cmd run audit:impeccable` and browser inspection when UI changes require visual verification.
- Record P0/P1 blockers separately from lower-risk follow-ups.

## Phase 3: Documentation Harmonization

Status: planned

- Update `docs/HANDOFF.md` with current branch state, recent changes, and verification results.
- Cross-check product and design changes against `PRODUCT.md`, `CLAUDE.md`, and `DESIGN.md`.
- Move resolved questions or feedback into the appropriate docs only when the change itself answers them.

## Phase 4: Guarded Release

Status: planned

- Inspect `git status -sb` and avoid broad staging by default.
- Run `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`.
- Summarize staged candidates and verification output.
- Commit, push, and check deployment status only after explicit user approval.

## Phase 5: Optional Factory Expansion

Status: planned

- Add subagent prompts for parallel code/design/doc review after the single-session skill proves useful.
- Add Vercel deployment checks through the existing Vercel CLI/plugin path if the guarded release flow needs it.
- Consider MCP additions only when a repeated task cannot be handled reliably with current tools.
