# Production Pipeline

Use this reference after choosing `precommit`, `prepush`, or `production` mode from `SKILL.md`.

## Mode Semantics

- `precommit`: prepare a change for commit. Review, fix safe mechanical issues, run required checks, and produce a commit-readiness summary. Commit only if the user explicitly asks.
- `prepush`: prepare a committed or staged change for push. Run the full local release gate, inspect branch hygiene, and produce a push-readiness summary. Push only if the user explicitly asks.
- `production`: prepare and ship to the production branch. Run all applicable review, design, docs, verification, commit, push, and deployment-status checks. Commit and push only if explicitly authorized in the current request or after owner confirmation.

If the user's request is ambiguous, default to validation and preparation, not git mutation.

## Pipeline

1. **Preflight**
   - Run `git status -sb`.
   - Identify changed, staged, untracked, generated, and artifact files.
   - Refuse broad staging such as `git add .` unless the user explicitly asks and the diff is fully understood.
   - Restore known generated churn, especially `next-env.d.ts` switching from `./.next/dev/types/routes.d.ts` to `./.next/types/routes.d.ts` after `next build`, unless the route-types import change is intentionally part of the work.

2. **Change Classification**
   - Source/test changes: run `references/code-review.md`.
   - UI, CSS, Tailwind, visible copy, interaction, or motion changes: run `references/design-review.md`.
   - Auth, sync, storage, Supabase, provider, settings, or history changes: use the repo `exhale-sync-audit` skill if available, then run the code review gate.
   - Accessibility, low-vision, reduced-motion, keyboard, ARIA, active-session readability, or touch-target changes: use `exhale-accessibility-lab` if available, then run the design review gate.
   - Device, viewport, PWA, Meta in-app browser, iOS, Android, canvas, or active-session layout changes: use `exhale-device-qa` if available.
   - Feedback, roadmap, TODO, handoff, privacy, terms, or open-question changes: use `exhale-beta-triage` if available, then run `references/docs-harmonizer.md`.
   - Broad UI polish or design-system checks: use `impeccable` if available.

3. **Baseline Impeccable Pass**
   - Run when UI or copy changed, or when the user explicitly asks for a design/release polish pass.
   - Prefer `npm.cmd run audit:impeccable -- <affected local URLs>` when a local server is available.
   - Auto-fix only low-risk mechanical findings:
     - invalid Tailwind opacity syntax such as `text-still-white/58` when Tailwind requires `text-still-white/[0.58]`;
     - default Tailwind gray border fallback caused by an invalid class;
     - missing 44px tap targets on obvious controls;
     - accidental built-in color scale drift where an existing Exhale token is the direct replacement;
     - obvious text clipping or wrapping defects with a narrow local fix.
   - Do not auto-fix taste findings that conflict with `DESIGN.md`, such as detector complaints about the intentional Inter/system typography.
   - Do not redesign surfaces, rewrite product copy, change first-run hierarchy, or add new UI affordances without owner approval.

4. **Code Review Gate**
   - Run after auto-fixes, not before final verification.
   - Treat P0 and P1 as release blockers.
   - Fix narrow, obvious local defects when they preserve documented behavior.
   - Stop for owner decision when the fix changes product, auth/sync, privacy, accessibility, data, external services, or release risk.

5. **Docs Harmonization**
   - Run only when behavior, product stance, design rules, roadmap state, external setup, verification state, privacy, terms, or open questions changed.
   - Keep docs factual and narrow.
   - Do not use docs to hide unresolved release risk.

6. **Verification**
   - Always run the release gate commands from `references/release.md` before `prepush` or `production` completion:
     1. `git diff --check`
     2. `npm.cmd run lint`
     3. `npm.cmd test -- --runInBand`
     4. `npm.cmd run build`
   - For `precommit`, run the full set unless the change is documentation-only; for docs-only changes, at minimum run `git diff --check`.
   - For UI changes, capture Playwright screenshots of affected routes and at least one mobile viewport. Use `output/playwright/` and avoid committing screenshots unless they are intentional artifacts.
   - After `next build`, check and restore `next-env.d.ts` generated churn when appropriate.

7. **Commit Analysis And Cleanup**
   - Run `git status -sb` and `git diff --stat`.
   - Inspect untracked files and generated artifacts.
   - Confirm staged files are only the intended files.
   - Check for secrets, local env files, screenshots, build artifacts, and unrelated user changes.
   - Summarize the actual behavioral change in one sentence.
   - Propose a concise commit message using repo style.

8. **Commit And Push**
   - Commit only after the user explicitly requests it or confirms the proposed commit.
   - Stage explicit files, not broad directories, unless the diff is fully reviewed.
   - Push only after tests/build pass and the user explicitly authorizes push.
   - Use the current branch unless the user names another branch.
   - After push, run read-only deployment-status checks when tooling is available. Do not redeploy or change Vercel settings unless explicitly asked.

## Hard Stops

Stop before commit, push, or production release when any of these are true:

- Required verification fails.
- A P0 or P1 finding is unresolved.
- Auth/sync, privacy, Supabase, email, OAuth, or provider behavior changed without appropriate validation.
- A production migration, RLS change, provider credential, environment variable, or external service setup is required but unconfirmed.
- The change introduces required sign-in, premium framing before breathing, external audio files, push reminders, social features, or other durable non-goal conflicts.
- The worktree has unexplained untracked files or unrelated modified files.
- The fix requires choosing among materially different product/design/accessibility approaches.

## Final Report

End every run with:

- Mode run.
- Changed files summary.
- Auto-fixes applied.
- Findings by severity, or "no blocking findings."
- Verification commands and pass/fail status.
- Browser/screenshot coverage when UI changed.
- Docs updated or docs intentionally unchanged.
- Commit hash and pushed branch if those actions happened.
- Deployment-status result or reason it could not be confirmed.
- Remaining external tasks or owner decisions.
