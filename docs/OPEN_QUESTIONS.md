# Exhale Open Questions

Last updated: May 19, 2026

Use this as a living parking lot for product, validation, trust, accessibility, and strategy questions that are not ready to become implementation tasks. As questions are answered, add the answer, date, evidence, and any resulting TODO/doc updates.

## How To Use

- Keep questions here until they are answered or intentionally closed.
- When a question becomes actionable, move the work into `docs/TODO.md`.
- When a question is answered by tester signal, link or summarize the relevant note from `docs/USER_FEEDBACK.md`.
- Prefer short answers with concrete evidence over long debate.

## Validation Gate

### What exact signal lets Stage 0 pass?

Context: `docs/ROADMAP.md` says roughly 10 target testers and at least one return-use signal, but the exact return signal is not yet defined.

Current answer: Open.

Possible evidence:

- A tester completes a second session later without prompting.
- A tester returns on a different day.
- A tester chooses to sync or preserve history.
- A tester says they would use it again, then actually does.

### What completion or drop-off rate would worry us enough to change the rhythm or first-run flow?

Context: Supabase `app_events` can show timer selections, session starts, Settle In exits, early exits, and completions.

Current answer: Open.

### Who exactly counts as the target beta audience?

Context: `PRODUCT.md` describes people who do not use self-care apps, are skeptical of wellness software, and have low tolerance for friction.

Current answer: Open.

Clarify whether target beta testers must be:

- Non-self-care-app users.
- Anxiety coping-skill curious.
- Skeptical but willing to try.
- Existing breathwork users as a secondary comparison group.

## Feedback Intake

### Should testers be asked to try Practice History and sync?

Context: Practice History and sync are optional by design. Asking everyone to test them could distort first-breath feedback, but cross-device sync still needs validation.

Current answer: Open.

### How many similar reports are enough to act?

Context: One iPhone tester reported performance pressure and a possibly long Exhale; current plan is to revisit rhythm only if the pattern repeats.

Current answer: Open.

Example threshold to decide later:

- One report: note only.
- Two or three similar reports: investigate.
- Repeated reports plus drop-off data: test an alternative.

### Should feedback intake include a return-intent question?

Context: Return use is part of the Stage 0 gate, but `docs/USER_FEEDBACK.md` does not yet directly ask whether a tester would use Exhale again.

Current answer: Open.

Possible prompt:

```text
Would you use Exhale again on your own? If yes, when would you reach for it?
```

## Product Boundaries

### Do the rotating completion quotes create attribution or licensing risk?

Context: Completion quotes are landing well with testers, but wider distribution may require checking quote sourcing, attribution, and public-domain/fair-use comfort.

Current answer: Open.

### Does Practice History feel reflective, or could it become pressure?

Context: `PRODUCT.md` says history is optional and never a source of pressure. Current stats should be watched for any streak-like or achievement-pressure feeling.

Current answer: Open.

### Is optional email sync quiet enough?

Context: Sync belongs only inside Practice History and must not make Exhale feel account-gated.

Current answer: Open.

## Accessibility

### Is the ARIA phase label enough as the screen-reader equivalent for the canvas orb?

Context: The canvas orb is not screen-reader accessible; the phase label ARIA live region is the intended equivalent.

Current answer: Open.

### Does the 60-second resume window need an accessibility-friendly extension?

Context: `PRODUCT.md` lists this as a known gap. Some users may need more than 60 seconds after accidental exit or interruption.

Current answer: Open.

### What is the contrast acceptance bar?

Context: Low-opacity text may fall below WCAG 2.1 AA. Decide whether strict AA applies everywhere or only to functional text.

Current answer: Open.

## Policy And Trust

### Are `/privacy` and `/terms` good enough for beta?

Context: Pages exist and match current product behavior, but they are not lawyer-reviewed.

Current answer: Open.

### Is email-based deletion acceptable for now?

Context: Privacy page currently says synced users can email to request cloud data deletion.

Current answer: Open.

Future options:

- Keep email deletion during beta.
- Add in-app deletion inside Practice History.
- Add a self-serve deletion confirmation flow after email sync.

## Strategy

### What is the primary purpose of the Garden skin?

Context: Garden is on the roadmap, but the reason affects scope.

Current answer: Open.

Possible purposes:

- Warmer accessibility option.
- Retention and freshness.
- Shareability.
- Future theme-pack monetization.
- Aesthetic breadth for public launch.

### Is Facebook preview worth more attention?

Context: App-side Open Graph is verified. Facebook appears to have a Meta-side parser/cache issue for `exhale.guide`; other crawlers parse correctly.

Current answer: Open, but currently not blocking.

Default stance:

```text
Treat as Meta-side bug unless Facebook sharing becomes important to beta acquisition.
```

## Answered Questions

Move answered questions here with date, answer, evidence, and follow-up.

### Template

Question:

Answer:

Date answered:

Evidence:

Follow-up:
