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

Answered 2026-05-19. See Answered Questions below.

Tester follow-up prompts to keep using during the alternate-rhythm beta round:

```text
Did the Rest period help you reset, or did it feel like it interrupted the breathing rhythm?
```

```text
If the rhythm did not fit you, did you want it gentler/easier, slower/deeper, or simply less interrupted by Rest?
```

```text
Did the rhythm ever make you feel like you had to gasp, catch up, or strain?
```

### Should Exhale offer customizable breath rhythms?

Context: Feedback is starting to show that rhythm fit varies. Some users report the current pace feels fast or pressuring, one user did not care for Rest, one user prefers a slower/deeper pattern with longer inhale, hold, and exhale, and one user found the prompts difficult to follow without gasping. Customization could help, but it risks adding decision friction before the first breath.

Current answer: Open.

Possible customization dimensions:

- Timing: let users adjust seconds for Inhale, Hold, Exhale, and Rest.
- Phases: allow patterns without Hold, without Rest, or with Rest only between cycles.
- Space between phases: add a small transition buffer, softer cue, or grace period between prompts.
- Presets: offer a few named rhythms instead of full manual controls, such as Default, Gentle, Deep, or No Rest.
- Accessibility-oriented rhythm: offer a less demanding option with shorter or optional holds, less aggressive exhales, and more permission to breathe normally between phases.
- Experience level: keep the current default for new users, with advanced rhythm controls hidden inside Session Setup.
- Session goal: choose a rhythm based on intent, such as settle quickly, relax deeply, or practice familiar breathwork.
- Adaptive pacing: start slower for the first cycle, then settle into the selected rhythm once the user understands the pattern.

Key product tension:

```text
Customization may make Exhale fit more bodies, but too much choice can break the low-friction promise for people who do not use self-care apps.
```

Follow-up questions to ask testers:

```text
Would you rather choose from a few rhythm presets, or adjust the seconds yourself?
```

```text
Would seeing rhythm settings before your first session make Exhale feel more helpful or more complicated?
```

```text
If you could change one part of the rhythm, would it be Inhale, Hold, Exhale, Rest, or the transition between them?
```

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

### Would a fuller account system ever create enough value to justify the added friction?

Context: Exhale currently uses anonymous Supabase identity by default and optional email-code sync only inside Practice History. `PRODUCT.md` and `DESIGN.md` both protect the anonymous-first promise: no required account, login, profile, onboarding gate, or sync prompt before breathing. Any fuller auth model, such as password login, OAuth, profiles, account settings, or persistent account management, would need a clear user benefit that optional email sync cannot provide.

Current answer: Open, but not an implementation task during beta feedback collection.

Possible reasons to revisit:

- Testers explicitly ask for stronger account recovery or account management.
- Cross-device sync feels unreliable or confusing with email-code sign-in alone.
- Deletion, data export, privacy controls, or trust needs become hard to support without account settings.
- A future therapist, group, or organizational use case requires managed identities.

Default stance:

```text
Do not add fuller account auth unless beta feedback shows the value outweighs the extra friction.
```

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

### How many similar reports are enough to act on rhythm comfort?

Answer: The threshold is reached when reports converge on the rhythm itself (not isolated preference variants) and at least one report describes a safety- or capacity-level concern, not just a preference. Five of six recent beta testers reported rhythm-fit concerns, and T-2026-05-19-05 specifically could not follow the rhythm without gasping, which is a capacity mismatch rather than a taste signal. That tipped the decision from "investigate further" to "act now."

Date answered: 2026-05-19

Evidence: `docs/USER_FEEDBACK.md` entries T-2026-05-18-01 (performance pressure, possibly long Exhale), T-2026-05-19-02 (pacing felt fast), T-2026-05-19-03 (did not care for Rest), T-2026-05-19-04 (prefers slower-deeper), T-2026-05-19-05 (gasping; capacity mismatch).

Follow-up: Promoted Priority added to `docs/ROADMAP.md` and `docs/TODO.md` to design and ship selectable alternate rhythms while continuing beta feedback collection in parallel.

### Template

Question:

Answer:

Date answered:

Evidence:

Follow-up:
