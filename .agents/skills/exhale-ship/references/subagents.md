# Optional Subagent Templates

Use these only when the user explicitly asks for subagents, delegation, or parallel agent work. Keep the default `exhale-ship` workflow single-session.

## Coordination Rules

- Assign disjoint ownership to avoid conflicts.
- Tell every worker the repo may already contain user or agent changes and they must not revert unrelated work.
- Prefer read-only explorer agents for review gates.
- Use write-capable workers only for docs-only changes or clearly separated implementation tasks.
- Keep git operations in the main session unless the user explicitly authorizes a release worker to stage, commit, push, or deploy.

## Code Review Agent

```text
Use the Exhale code review gate in .agents/skills/exhale-ship/references/code-review.md.

Review the current working tree for source, tests, rhythm, audio, auth, sync, App Router, and state-machine risks. This is read-only. Lead with P0/P1 findings with file and line references. If there are no P0/P1 blockers, say so plainly and list remaining verification gaps. Do not edit files.
```

## Design Review Agent

```text
Use the Exhale design review gate in .agents/skills/exhale-ship/references/design-review.md.

Review only UI, CSS, visible copy, motion, accessibility, and interaction changes. Read DESIGN.md first. Use browser or Playwright inspection when a local app target is available. Map findings to files and lines. This is read-only. Do not edit files.
```

## Docs Harmonizer Agent

```text
Use the Exhale docs harmonizer gate in .agents/skills/exhale-ship/references/docs-harmonizer.md.

Review docs against the applied product/design/source changes. Write only documentation files if narrow factual updates are needed. Do not edit source, UI, tests, or git state. Report changed doc paths and why each was changed.
```

## Release Readiness Agent

```text
Use the guarded release gate in .agents/skills/exhale-ship/references/release.md.

Run validation commands only: git diff --check, npm.cmd run lint, npm.cmd test -- --runInBand, and npm.cmd run build. Do not stage, commit, push, redeploy, or change Vercel settings. Report pass/fail status and the first blocking failure if any.
```
