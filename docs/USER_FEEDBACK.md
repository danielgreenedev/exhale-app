# Exhale User Feedback

Last updated: May 19, 2026 (Facebook reply intake)

## Purpose

Use this document to capture user critique, usability notes, and product observations without mixing private tester details into the core product docs.

## Current Test Surface

Use `https://exhale.guide` for the current beta round. Use a Vercel preview only when a future test needs changes that should not be visible on production yet.

## Privacy Rules

- Keep feedback anonymous unless a user explicitly asks to be named.
- Use anonymous tester IDs for follow-up tracking. Keep the private mapping from tester ID to real person outside git.
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

- Tester ID:
- Follow-up OK: Yes / No / Unknown
- Date:
- Environment: Local / Preview / Production
- Device:
- Browser:
- Route tested:
- Session length:
- Rhythm:
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

### 2026-05-19, T-2026-05-19-07, Facebook Reply, Rest Awkward + Progressive Interest

#### Session

- Tester ID: T-2026-05-19-07
- Follow-up OK: Unknown
- Source: Public Facebook post reply to project owner's pacing question

#### Friction

- Verbatim reply to the prompt "If the rhythm did not fit you, did you want it gentler/easier, slower/deeper for each section, or the transitions between phases, or simply less interrupted by Rest?":

```text
I liked the hold and slow exhale.
The rests were a little awkward.
The competitive nature in me likes the idea of the breath, hold, and exhale increasing in duration by the last rep.
```

- This tester liked Hold and slow Exhale, so do not group them with Hold-friction testers. Their friction is specifically the Rest/Relax moment plus interest in progressive/ramping rhythm.
- "Rests awkward" is another Rest/Relax complaint logged. Follow-up should check whether the Relax/Breathe reframe helps, since the original public wording still used Rest.
- Progressive escalation (each rep longer than the last) is a non-isochronous rhythm shape that no current preset offers. First request of this kind.

#### Follow-Up, Same Tester Thread / Secondary User Signal

- Source: New public Facebook post follow-up from the same tester, reporting a teenager's reaction.

```text
My teenager likes the simplicity of the layout and interface.
Likes all the ways you can customize it.
Wonders about adding the ability to change colors.
But really positive
```

- Positive secondary-user signal: the simple layout and interface are landing.
- Customization is noticed positively here, not as friction.
- Color customization is a theme/personalization signal. Treat it as related to skins, accessibility, and phase-color comfort rather than a request to add freeform color controls immediately.

#### Actionable Recommendations

1. Reinforces "Should Rest and Hold be partly or completely optional?" - Rest/Relax itself, not only its duration, is the issue for some users.
2. New product question parked: should rhythms support a guided ramp/escalation instead of only steady patterns? Single-user signal; do not act yet.
3. Park a color/theme customization question: ask whether "change colors" means orb/phase colors, background/skin, or accessibility/contrast preference.

### 2026-05-19, T-2026-05-19-06, Facebook Reply, Hold And Exhale-Inhale Ratio

#### Session

- Tester ID: T-2026-05-19-06
- Follow-up OK: Unknown
- Source: Public Facebook post reply to project owner's pacing question

#### Friction

- Verbatim reply to the prompt "If the rhythm did not fit you, did you want it gentler/easier, slower/deeper for each section, or the transitions between phases, or simply less interrupted by Rest?":

```text
I think the hardest part for me was the hold and the slower exhale then a short inhale
```

- Two distinct frictions in one sentence: Hold is the hardest phase, and the Exhale-to-next-Inhale ratio reads as abrupt ("slower exhale then a short inhale"). The 6s exhale to 4s inhale asymmetry in Standard is intentional (parasympathetic), but lands as imbalance for this user.
- Gentle (3-2-4-4) would not flatten this asymmetry; Full (6-6-10-4) would make it more pronounced.

#### Actionable Recommendations

1. Reinforces "Should Rest and Hold be partly or completely optional?" — Hold as well as Rest is a friction phase for some users, matching T-2026-05-19-05's gasping signal.
2. Consider whether any preset should have a more symmetric exhale-to-inhale ratio, or whether ratio comfort is a separate axis from rhythm-fit.

### 2026-05-19, Internal Beta Observation, Phase Transition Friction

#### Session

- Tester ID: Internal
- Follow-up OK: Yes

#### Friction

- Multiple users have mentioned not liking or being interrupted by the Rest/Relax phase.
- Project owner observed that after Exhale changes to Rest/Relax, the instinctive response is to start breathing in.
- Across Standard, Gentle, and Full, phase transitions can still feel cognitively abrupt; it takes a beat to catch up to the shift even with existing cues.

#### Actionable Recommendations

1. Treat this as a phase-boundary comprehension issue, not only a rhythm-duration issue.
2. Keep evaluating the live anticipatory cues: pre-cue sound and softer incoming visual color before the boundary. The experimental next-phase text label was removed because it competed with the main instruction.
3. Keep collecting whether Rest/Relax itself is disliked, or whether the Exhale-to-Relax and Relax-to-Inhale handoff needs clearer framing.

### 2026-05-19, T-2026-05-19-05, Breathing Capacity Constraint

#### Session

- Tester ID: T-2026-05-19-05
- Follow-up OK: Unknown

#### Friction

- Tester found it difficult to follow the prompts without gasping because the rhythm did not fit their breathing capacity.
- This is an accessibility and comfort signal, not just a preference signal. A single default rhythm may be too demanding for some bodies.

#### Actionable Recommendations

1. Continue collecting rhythm-fit feedback, but treat breathing-capacity mismatch as higher risk than aesthetic or preference feedback.
2. When evaluating alternate rhythms, include an easier/gentler option with shorter holds, less demanding exhales, or a more permissive transition/rest structure.
3. Consider adding tester follow-up language that asks whether the rhythm ever made them feel like they had to gasp, catch up, or strain.

### 2026-05-19, T-2026-05-19-04, Slow-Breath Preference

#### Session

- Tester ID: T-2026-05-19-04
- Follow-up OK: Unknown

#### What Worked

- Overall response was positive; tester called the app cool and impressive.

#### Friction

- Tester prefers a slower-paced breathing pattern with a longer deep inhale, longer hold, and much longer exhale.
- This is not the same as the "too fast" or "remove Rest" feedback; it points toward users with an existing preference for deeper, slower breathwork rhythms.

#### Actionable Recommendations

1. Keep collecting rhythm-comfort feedback before changing the default 4-4-6-8 pattern.
2. When evaluating alternate rhythm options, consider whether the need is a beginner-friendly softer rhythm, an experienced-user slower/deeper rhythm, or both.

### 2026-05-19, T-2026-05-19-03, Rest Preference

#### Session

- Tester ID: T-2026-05-19-03
- Follow-up OK: Unknown

#### What Worked

- Overall response was positive; tester liked the experience.
- Sound choices were specifically praised.

#### Friction

- Tester did not care for the Rest period.
- Tester suggested an option to include or remove Rest.

#### Actionable Recommendations

1. Treat this as a rhythm-structure signal, not an immediate feature request. Rest is intentional in the current 4-4-6-8 pattern, so more feedback is needed before adding a no-rest or alternate-rhythm option.
2. Add a follow-up rhythm question during beta intake: "Did the Rest period help you reset, or did it feel like it interrupted the breathing rhythm?"

### 2026-05-19, T-2026-05-19-02, Casual User

#### Session

- Tester ID: T-2026-05-19-02
- Follow-up OK: Unknown
- Environment: Production
- Session length: 5 minutes

#### What Worked

- Overall response was strongly positive; tester said they loved it and completed the 5-minute session.
- Tester expressed intent to revisit the app when they had more time to navigate it calmly.

#### Friction

- Tester agreed the pacing felt a little fast.
- Context may have affected experience: tester was getting ready to leave, so navigation and rhythm comfort may have been evaluated under time pressure.

#### Actionable Recommendations

1. Treat this as a second signal that pacing may feel fast for some casual users, but keep collecting feedback before changing the default rhythm.
2. Continue asking rhythm-comfort questions during beta intake, especially whether the pace feels fast, pressuring, or hard to settle into.

### 2026-05-19, T-2026-05-19-01, Beta Tester (web)

#### Session

- Tester ID: T-2026-05-19-01
- Follow-up OK: Unknown

#### What Worked

- The session-complete quotes continue to land well across repeated use; rotating variety appreciated.
- The softened Hold copy reads naturally and was specifically called out as a positive, validating the earlier strain-language revision.
- Overall impression remains positive ("everything else looks great").

#### Friction

- The bottom session progress bar is hard to read. The unfilled portion of the track is too faint over the dark ground, so the colored fill appears to be a free-floating segment with no visible endpoint. Users can reverse-engineer what it is, but report a brief "what is this doing?" feeling that creates uncertainty rather than confidence. Once understood, the desire is still to see the endpoint clearly.

#### Actionable Recommendations

1. Raise the visibility of the progress bar's unfilled track so the full rail is unmistakable, with the colored fill reading as advancing along a visible line toward an obvious endpoint. The fill itself should remain the foreground signal; the track just needs to read as present, not as a guess.

### 2026-05-18, T-2026-05-18-01, Production iPhone Beta

#### Session

- Tester ID: T-2026-05-18-01
- Follow-up OK: Unknown

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
