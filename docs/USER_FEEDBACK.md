# Exhale User Feedback

Last updated: May 18, 2026

## Purpose

Use this document to capture user critique, usability notes, and product observations without mixing private tester details into the core product docs.

## Current Test Surface

Use `https://exhale.guide` for the current beta round. Use a Vercel preview only when a future test needs changes that should not be visible on production yet.

## Privacy Rules

- Keep feedback anonymous unless a user explicitly asks to be named.
- Do not include diagnoses, private health details, email addresses, account details, or identifying context.
- Summarize patterns in your own words instead of storing long raw quotes.
- Separate observations from product decisions.
- Move accepted work into `docs/TODO.md` when it becomes actionable.

## Beta Test Prompt

Send a short, open prompt so feedback stays practical:

1. Try starting a breathing session without extra explanation.
2. Notice anything that feels rushed, confusing, too quiet, too loud, or hard to read.
3. Try Practice History if you have time.
4. Send back what worked, what felt off, and anything you would change.

## Feedback Intake Template

### Session

- Date:
- Environment: Local / Preview / Production
- Device:
- Browser:
- Route tested:
- Session length:
- Sound choice:
- Circle Size:

### What Worked

- 

### Friction

- 

### Accessibility Notes

- 

### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other:
- Notes:

### Actionable Recommendations

1. 

### Open Questions

1. 

## Recent Feedback Notes

### 2026-05-18, Production iPhone Beta

#### What Worked

- Settle In felt useful and gave the session a good intro space.
- The phase-marker sounds during the session felt well chosen.
- Pause length felt good.
- The main menu interface was easy to follow and explore.
- Changing "orb" to "circle" made the setting feel more accessible.
- Low-light readability was usable on the tester's normal low-brightness phone setup.

#### Friction

- The tester noticed performance pressure around matching breath timing and being ready for the next prompt.
- Hold copy that mentions strain can accidentally make the user think about straining.
- Exhale may feel slightly long for some users; this needs more validation before changing the core 4-4-6-8 rhythm.
- In-session sound control is small in the top-right, and iPhone silent mode made sound behavior harder to diagnose.

#### Actionable Recommendations

1. Remove "strain" from Hold copy and keep the language permissive.
2. Validate rhythm comfort with more testers before changing Exhale duration; consider testing a 4-4-5-8 or relaxed variant if this pattern repeats.
3. Improve the in-session sound affordance for mobile, especially touch size, visibility, and silent-mode confusion.
4. Preserve Settle In, pause length, phase sounds, the main menu structure, the Circle label, and the low-light palette.

## Critique Categories

### First-Use Clarity

- Can someone start a breathing session without explanation?
- Does View Sequence make the rhythm understandable before starting?
- Does Settle In feel like a gentle buffer rather than a blocker?

### Rhythm Comfort

- Does the 4-4-6-8 rhythm feel natural?
- Is Rest long enough to feel permissive?
- Are transitions between Inhale, Hold, Exhale, and Rest smooth enough?

### Visual Comfort

- Are selected controls clear without competing with Begin?
- Is the interface readable in low light?
- Does the animated circle communicate the breath phase through peripheral vision?

### Sound Comfort

- Are the sound names understandable?
- Does selecting a sound preview it clearly and gently?
- Does mute feel obvious?

### Sync And History

- Does Practice History clearly explain what sync includes?
- Is the privacy reassurance clear without using account-heavy language?
- Does cross-device history feel reliable after confirming an email code?

## Synthesis Format

When turning multiple notes into product direction, use this structure:

1. Pattern: What did more than one person notice?
2. Risk: What user stress, confusion, or accessibility issue could this create?
3. Recommendation: What should change?
4. Priority: Now / Next / Later.
5. Validation: How will we know it worked?

## Decision Log

Add accepted decisions here only after they are intentionally chosen.

| Date | Decision | Source Pattern | Follow-Up |
| --- | --- | --- | --- |
|  |  |  |  |
