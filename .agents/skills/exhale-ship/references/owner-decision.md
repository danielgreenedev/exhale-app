# Owner Decision Guardrail

## Default Rule

Ask the owner only when an agent would otherwise make a product, risk, release, or external-system decision. Do not ask for routine implementation details that are already determined by Exhale's source-of-truth docs.

## Must Ask

Ask before proceeding when any item involves:

- Shipping with a known P0 or P1 risk.
- Choosing between materially different product, design, accessibility, auth, sync, or privacy remedies.
- Changing first-run defaults, rhythm semantics, session timing, completion behavior, sign-in framing, history behavior, or storage/auth precedence.
- Revisiting durable non-goals from `PRODUCT.md`, such as required accounts, push reminders, social features, premium framing, external audio files, mascot/persona, or onboarding gates.
- Changing Supabase schema, RLS, OAuth provider behavior, Vercel settings, environment variables, analytics semantics, retention/deletion behavior, or production data.
- Adding dependencies, MCP servers, external services, background automation, scheduled jobs, or recurring reminders.
- Committing, staging broad file sets, pushing, deploying, redeploying, or creating branches/PRs when not explicitly requested.
- Spending substantial time on speculative P2/P3 polish outside the user's stated goal.

## Usually Do Not Ask

Proceed without owner input when:

- A P0/P1 has one narrow, obvious local-code fix and the user already asked to fix the problem. Report the severity and verification after fixing.
- A P2 is contained, preserves documented behavior, and is cheap to fix while already editing the same area.
- A P3 is cosmetic, optional, or better parked in docs.
- The answer is already explicit in `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, `docs/HANDOFF.md`, or the relevant specialist skill.

## Severity Threshold

- P0: Stop release. Ask for owner decision unless applying an obvious local fix first is safer. Never ship unresolved.
- P1: Stop this change until fixed or owner chooses a direction. Ask when there is any tradeoff or product interpretation.
- P2: Agent may fix, defer, or document. Ask only for scope, priority, or risk-acceptance decisions.
- P3: Agent should not interrupt. Include as polish or park it.

## Question Format

When asking, keep it short:

1. State the issue and severity.
2. Name the risk in one sentence.
3. Recommend one default option.
4. Offer at most two alternatives.
5. Say what will remain blocked until the owner decides.

Example:

```text
P1 decision needed: fixing this sync bug can either preserve local settings on sign-in or keep cloud settings as the source of truth. I recommend keeping cloud settings authoritative because that matches current docs. Alternative: merge per-field with local recency. I will not ship this change until you choose the sync precedence.
```

## If The Owner Is Unavailable

Choose the safest non-shipping path:

- Fix obvious local defects.
- Preserve documented product behavior.
- Leave external systems unchanged.
- Document unresolved P0/P1 risk.
- Stop before release, commit, push, deploy, or broad scope expansion.