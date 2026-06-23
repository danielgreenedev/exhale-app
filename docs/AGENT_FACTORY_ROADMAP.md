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

Status: complete for first factory run; ongoing per release

- Inspected `git status -sb` and avoided broad staging.
- Ran `git diff --check`, `npm.cmd run lint`, `npm.cmd test -- --runInBand`, and `npm.cmd run build`.
- Committed the validated release candidate as `7f42735 feat: retire post-exhale phase and add ship workflow`.
- Pushed `master` through `0d057f0 docs: capture design distinctiveness feedback`.
- Checked deployment linkage after push. The checkout is not linked with `.vercel/project.json`, and command-line `curl.exe -I https://exhale.guide` receives Vercel's challenge/429 response. This matches the existing deployment-doc caveat for tool requests, so local Vercel deployment status cannot be proven from this checkout alone.
- Remaining release behavior is now operational, not roadmap work: after future pushes, check GitHub/Vercel status through the available authenticated surface.

## Phase 5: Optional Factory Expansion

Status: complete as an operational baseline

- Added subagent prompt templates for optional parallel code, design, docs, and release-readiness review.
- Tightened the guarded release playbook with deployment-check paths that do not assume a linked Vercel project.
- MCP additions remain deferred; current Codex desktop tools, Browser/Playwright capabilities, npm scripts, and git commands are enough for the current factory loop.

## Conclusion

Status: roadmap concluded

The Exhale agent factory is now a repo-local, guarded workflow rather than a loose idea. It has:

- A concise `exhale-ship` skill with focused reference gates.
- Review paths for code, design, docs, release, and optional subagent delegation.
- A validated first factory run covering the no-post-exhale rhythm release.
- Explicit guardrails for staging, committing, pushing, deployment checks, MCP additions, and subagent use.

Future work should treat the factory as an operating process:

- Run the relevant gates whenever source, design, docs, release readiness, or feedback changes.
- Keep MCP additions deferred until a repeated gap appears that current Codex desktop tools cannot cover.
- Keep subagents optional and explicitly requested, not the default path.
- Preserve the untracked source PDF (`docs/agent_factory_start_guide.pdf`) as local reference material unless the owner explicitly wants it versioned or removed.

## Operational Skill Additions

Status: added after roadmap conclusion

Four focused repo-local skills now extend the operating process without changing the guarded release core:

- `exhale-beta-triage` classifies tester notes into accepted work, parked ideas, rejected directions, already-handled reports, and validation questions.
- `exhale-accessibility-lab` reviews low-vision, reduced-motion, contrast, keyboard, ARIA, touch, sound, and active-session accessibility risk.
- `exhale-device-qa` runs repeatable viewport/browser/state checks for first-run, returning-user, active-session, completion, stats, and mobile/webview-sensitive flows.
- `exhale-sync-audit` reviews localStorage, sessionStorage resume, anonymous auth, Google sign-in, Supabase settings sync, cloud history merge, and localhost bypass drift.

These skills should feed `exhale-ship` rather than replace it. Use them to sharpen evidence and QA before the final release gate.

## Owner Decision Guardrail

Status: active

`exhale-ship` now owns the threshold for when Codex must stop and ask the owner. P0 always blocks release; P1 blocks the current change unless the fix is narrow and preserves documented behavior; P2 only needs owner input for scope, priority, or risk-acceptance decisions; P3 should be parked or reported without interruption. The guardrail also requires owner approval before commits, pushes, deployments, external-service changes, dependency/MCP additions, production database policy/schema changes, or overrides of durable product/design non-goals.
