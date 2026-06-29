# Guarded Release Gate

Use this gate for release readiness, final verification, committing, pushing, or deployment checks.

## Preflight

- Run `git status -sb`.
- Confirm whether the user wants validation only or a commit/push flow.
- Confirm the active shipping mode: `precommit`, `prepush`, or `production`.
- Avoid `git add .` by default. Stage explicit files after review, and never stage unrelated or generated artifacts accidentally.
- Read `production-pipeline.md` before staging, committing, pushing, or reporting production readiness.

## Validation

Run these commands in order:

1. `git diff --check`
2. `npm.cmd run lint`
3. `npm.cmd test -- --runInBand`
4. `npm.cmd run build`

Abort the release gate on the first failing required command. Summarize the failure and do not proceed to git operations.

## Git Operations

- Before committing, run the commit analysis and cleanup step in `production-pipeline.md`.
- Commit only after explicit user approval or an unambiguous current-turn request to commit.
- Use the current branch unless the user names another branch.
- Use a descriptive commit message tied to the actual change.
- Push only after tests/build pass and explicit approval or an unambiguous current-turn request to push.
- After committing or pushing, rerun `git status -sb` and report the resulting branch state.

## Deployment

- After a successful push, check deployment status with the available Vercel path in this environment.
- First look for a linked Vercel project such as `.vercel/project.json` or an available Vercel plugin/connector.
- If the checkout is not linked, use the repository's known production context from `PRODUCT.md` and `docs/DEPLOYMENT.md`, then report that local deployment status cannot be confirmed from the checkout alone.
- If the Vercel CLI is authenticated and a deployment URL or alias is known, prefer read-only checks such as `npx.cmd vercel logs <url-or-alias>` over redeploy commands.
- Do not run `npx.cmd vercel redeploy`, change Vercel environment variables, or create a deployment unless the user explicitly asks.
- If deployment tooling is unavailable, unauthenticated, or unlinked, report the local release status and the missing deployment check.

## Output

- Report validation commands and pass/fail status.
- Report staged files, commit hash, pushed branch, and deployment status when those actions happen.
- If validation only was requested, stop after the verification summary.
