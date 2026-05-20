# Exhale User Feedback

Last updated: May 20, 2026 (graphic designer Full feedback logged)

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

## Brand-New User Follow-Up Questions

Use these when asking someone to try Exhale for the first time:

- Could you start breathing without thinking too much?
- Did the pace ever feel rushed, pressuring, or make you gasp/catch up?
- Did Relax help, or did it interrupt the rhythm?
- Did the phase changes feel easy to follow, or did they lag your brain a bit?
- If you opened Session Setup, did the options feel natural? Did the button names and explanations make sense?
- Would you use this again when stressed, tired, or needing to settle?
- What would you change first?

## Flow Follow-Up Questions

Use these after someone tries the Flow pace:

- Did Flow feel smoother than the other pace you tried?
- Did removing Hold help?
- Did the tiny pause after Exhale help you reset, or would Flow feel better as inhale/exhale only with no pause at all?
- Did the pause, cue, or circle movement ever feel rushed, pushy, or interruptive?
- Would you choose Flow again, or would you pick a different pace?

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

### 2026-05-20, T-2026-05-19-08, Graphic Designer Follow-Up, Full Rhythm And Soft-Cue Clarity

#### Session

- Tester ID: T-2026-05-19-08
- Follow-up OK: Unknown
- Source: Project owner's graphic designer friend
- Environment: Production or local unknown
- Device: iPhone
- Browser: Safari
- Session length: Quick / 3 minutes
- Rhythm: Full
- Circle Size: Small
- Sound choice: Warm
- Signal class: **Same design-eye tester, focused on Full rhythm load and visual cue hierarchy.**

#### Context Notes

- Tester was switching from Safari to Notes/Messenger while using the app. This may have affected sound behavior on iPhone.
- Tester was at resting heart rate, not actively anxious or in panic, which matters because the long Full exhale may feel different when the user is trying to slow down from a stressed state.

#### What Worked

- Visuals and overall presentation still looked good.
- The tester understood that Full could be useful when someone needs help focusing their breath to slow down from panic.
- The Relax/pause phase was actively used after the long Full exhale, which supports keeping a recovery beat in deeper rhythms.
- When the tester followed the center circle's timing, the visuals felt relaxing and supportive.

#### Friction

- Full's 10-second Exhale felt very long at rest. The tester had to strategize the exhale to make it to 10 seconds.
- Following the outer line/soft cue could feel stressful, like the tester was already behind because the line starts quickly before the center circle.
- The tester did not immediately understand the line as a pickup note or soft visual pre-cue.
- The line may currently be too high contrast/neon relative to the center circle, causing the eye to follow the cue instead of the main orb.

#### Actionable Recommendations

1. Do not treat this as a reason to remove Full; it may serve a different state than resting baseline. Follow up with whether Full feels better during actual stress or after choosing it intentionally.
2. Keep the center circle/orb as the primary timing object.
3. Lower the contrast/chroma of the outer guide line and incoming soft cue so it reads as support, not the object to chase.
4. Strengthen the center circle's rim/visual presence slightly so users understand it is the main timing anchor.
5. Add iPhone app-switching to sound QA: Safari, silent mode on/off, leaving and returning from another app, and then tapping the sound control.

#### Product Response

- Accepted for immediate visual tuning: center orb rim slightly strengthened; current guide arc, outgoing arc, and incoming lead arc reduced in opacity/chroma so the pre-cue becomes quieter.
- No rhythm change yet. Full's long exhale is doing what it is designed to do, but it may need clearer expectation-setting or remain a secondary-user/deeper-breath option.
- Sound note folded into iPhone sound validation rather than treated as independent evidence that sound synthesis is broken.

### 2026-05-20, T-2026-05-20-09, Marketing/UX First-Pass Mobile Feedback

#### Session

- Tester ID: T-2026-05-20-09
- Follow-up OK: Unknown
- Source: Project owner's marketing/UX friend
- Environment: Production, inferred from mobile screenshots
- Device: iPhone-class mobile viewport
- Browser: Mobile browser, exact browser unknown
- Signal class: **Marketing and first-impression UX signal.** Weight heavily for above-the-fold, legibility, and first-pass trust; keep rhythm-comfort conclusions separate.

#### What Worked

- Overall impression is positive: the app is "very close," "already very nice," and close to a polished first impression.
- The tester framed the remaining items as final tightening rather than foundational problems.

#### Friction

- Sound did not work or was not perceived on first pass, regardless of sound mode.
- Home screen top spacing and logo size leave important controls low in the viewport on a standard iPhone display.
- In-session phase header and description have too much vertical space between them.
- White/gray text is too small and low-contrast for older users or people with impaired vision.
- The in-session description needs stronger contrast, likely via brighter text and text shadow.
- Settle In text is visually weaker than the phase label and should feel consistent with the active session state.

#### Actionable Recommendations

1. Treat first-pass sound trust as a priority bug, not only a preference. The user should either hear sound or get a clear, timely hint about tapping for sound or checking silent mode.
2. Reduce home-screen top padding and the home orb/logo footprint enough to improve first-viewport fit on iPhone without shrinking tap targets.
3. Increase contrast on readable text, especially session instructions and secondary controls, while keeping the Still Water restraint.
4. Compact the in-session phase label/instruction stack and strengthen the instruction text shadow.
5. Style Settle In closer to the active phase label so the session start feels coherent and legible.

#### Product Response

- Accepted for immediate polish: compact mobile home header, slightly smaller mobile home orb, higher-contrast home/session text, tighter in-session label spacing, and stronger Settling In styling.
- Accepted for immediate hardening: do not mark sound active when the Web Audio context is still suspended, and show the silent-mode hint after Settling In on iPhone-class browsers when sound is active.
- Follow-up implementation: the pre-session label now reads `Settling in` and shares the active phase HUD's positioning, uppercase semibold label treatment, bright shadowed instruction style, and vertical spacing.
- Still needs validation on real iPhone hardware because iOS silent mode and browser autoplay policies can differ by browser.

### 2026-05-20, T-2026-05-19-08, Graphic Designer Follow-Up, Default Quick Positive Signal

#### Session

- Tester ID: T-2026-05-19-08
- Follow-up OK: Unknown
- Source: Project owner's graphic designer friend, latest build follow-up
- Environment: Production or local unknown
- Session length: Quick / 3 minutes
- Rhythm: Default Steady, inferred from "hit begin as is"
- Signal class: **Same professional design-eye tester, now giving default-path comfort feedback.** This should be read separately from their Flow-specific pause critique.

#### What Worked

- Opening the app and pressing Begin with the default 3-minute session "feels really nice where it is at."
- The default Relax/pause felt good.
- Inhale, Exhale, and Hold all felt good.
- Relax did not interrupt the breathing rhythm.
- Color leads were good.
- The soft pre-cues were liked.
- The slight sequencing where the circle started a moment after the time track felt natural and easy to follow.
- The rhythm did not make the tester feel like they needed to gasp, catch up, or strain.
- The tester said Exhale is a good tool for feeling stressed, tired, or needing to settle.

#### Friction

- Return intent is positive but not fully spontaneous: the tester said they might not think to use it, but it would be a great resource if they did.

#### Actionable Recommendations

1. Do not overcorrect the default Steady / Quick path because of Flow-specific pause feedback. For this tester, the default pause and transition cues are working.
2. Treat the current color lead and soft pre-cue system as provisionally validated on the default path for this tester.
3. Keep return-use questions active. "Useful if remembered" is not the same as actual retention; it points toward future discoverability/habit-context work, not an immediate product rewrite.

#### Open Questions

1. Will target-audience testers remember to use Exhale when stressed, or does it need a later, non-pushy discoverability/reminder strategy?
2. Are the color lead and pre-cue only problematic on Flow's short 2-second Relax, while helpful on the default Steady rhythm?

### 2026-05-20, T-2026-05-19-08, Graphic Designer Follow-Up, Flow Pause Friction

#### Session

- Tester ID: T-2026-05-19-08
- Follow-up OK: Unknown
- Source: Project owner's graphic designer friend, responding to Flow-specific follow-up questions
- Environment: Production or local unknown
- Rhythm: Flow
- Signal class: **Professional design eye plus live rhythm comfort signal.** Useful for both motion-coherence and Flow validation, but still weigh target-audience feedback separately.

#### What Worked

- Inhale and Exhale felt "really nice."
- Removing Hold made the rhythm feel smoother.
- The circle line/orb motion felt well-paced during Inhale and Exhale.
- The tester liked the Flow timing overall and described the interface visuals as calm.

#### Friction

- The 2-second Relax/pause in Flow felt too fast and "spastic."
- The pause pulled attention away from the otherwise positive Inhale and Exhale prompts.
- The visual line/motion during the pause was the specific part that felt too fast.
- The anticipatory "push" made the tester feel rushed and interrupted, pulling them out of flow.
- Net assessment: the current Flow change made the experience both better and worse. Better because Hold is gone and Inhale/Exhale are pleasant; worse because the remaining pause interrupts the continuous feel.

#### Direct Follow-Up

Project owner asked:

```text
In Flow, did the tiny pause after Exhale help you reset, or would it feel better as inhale/exhale only with no pause at all?
```

Tester answered:

```text
I would take out the pause in the flow.
```

This confirms the same tester's signal: their preferred Flow shape is inhale/exhale only, not no-Hold plus a brief Relax beat.

#### Actionable Recommendations

1. Treat this as the first concrete post-launch signal that Flow's 4-0-6-2 shape may still have too much transition interruption.
2. Before changing production, ask at least one independent Flow tester whether they would also prefer **no pause at all** after Exhale.
3. If the same signal repeats, test a Flow variant with Relax removed entirely, likely 4-0-6-0, rather than adding more copy or cueing around the pause.
4. Keep the Inhale/Exhale timing and visual pacing intact in any Flow revision; the problem is the pause/transition, not the main breathing phases.

#### Open Questions

1. Is Flow meant to be a truly continuous Inhale/Exhale loop, or a no-Hold rhythm with a brief reset beat?
2. Does the anticipatory cue feel helpful on longer rhythms but too pushy on Flow's short Relax phase?
3. If Relax is removed from Flow, does the Exhale-to-Inhale handoff feel natural or too abrupt?

### 2026-05-19, T-2026-05-19-08, Graphic Designer Professional Eye, In-Session HUD Coherence

#### Session

- Tester ID: T-2026-05-19-08
- Follow-up OK: Unknown
- Source: Project owner's graphic designer friend; in-session screenshot annotated and shared
- Signal class: **Professional design eye, not target-audience tester.** Weight this differently in synthesis — it answers design-coherence questions, not "will this user return" or "does the rhythm fit me."
- Screenshot reference: `C:\Users\User\OneDrive\Documents\Exhale files\middle_line.jpg`. Yellow circle marks the three concentric rings around the orb; arrow points to the innermost ring as the noise element.

#### Friction

Verbatim feedback, four items:

```text
I feel like the count down track is competing and unhelpful on the exhale and the inhale.

I think the timer track is helpful on the hold and on the rest.

The gentle-easier track (or the 3min track) is way too fast. To main flash changes with the visuals.

The line in the middle of the time tracker is too much noise. (I see the idea and it's cool but to busy and unnecessary.)
```

#### Decoded

- **Countdown text** (`src/components/GameHUD.tsx:113-124`, `role="timer"`) competes with the orb's scale animation on Inhale and Exhale, where the orb itself is already showing phase progress. On Hold and Relax the orb is static, so the countdown is the only "how long" indicator and stays useful. Today's code fades the countdown uniformly to 58% opacity after cycle 2; the designer wants the fade to be phase-conditional, not cycle-conditional.
- **"Way too fast / main flash changes"** parses as too many phase-transition flashes. The phase-transition ring flash (`src/components/BreathingOrb.tsx:272-287`) fires at full amplitude on every phase boundary. Gentle has a boundary every 2 to 4 seconds (13s cycle with 4 phases), so a Quick (3 min) Gentle session sees roughly 56 full-amplitude flashes. On the 2-second Gentle Hold the flash reads as strobe.
- **"Interior line of the three"** = the innermost of three concentric rings drawn in the canvas, which is the Phase progress ring (`src/components/BreathingOrb.tsx:295-322`, `ringR = maxR + 24`). The sweeping arc duplicates phase-progress signal already carried by the orb scale on Inhale and Exhale, and by the countdown number on Hold and Relax. Three rings around the orb (phase progress, session progress, outer guide) is one more than the eye can hold without effort.

The four observations cohere as one underlying signal: phase progress is shown three different ways at once (orb scale, countdown text, phase ring arc), plus the flash. The cleanup wants each indicator to live only where it is load-bearing.

#### Actionable Recommendations

1. Drop the innermost phase progress ring entirely. It is the third indicator of the same signal the orb scale and countdown number already carry; removing it does not lose information.
2. Make the countdown phase-aware: visible on Hold and Relax (only indicator that conveys "how long"), hidden or strongly de-emphasized on Inhale and Exhale (orb scale is the natural indicator).
3. Damp the phase-transition flash on short phases. Scale flash opacity by phase duration so a 2-second Gentle Hold does not strobe. The same proportional pattern raised for the anticipation lead window (`PHASE_LOOKAHEAD_SECONDS`) would apply.
4. Land all three as one coordinated design-coherence pass. They share intent and shipping any one alone leaves the canvas mid-edit.

#### Open Questions

1. Should the phase progress ring be removed outright, or kept at very low opacity on Hold and Relax only? Default: remove outright, since the countdown number already carries Hold/Relax.
2. Should flash dampening be a single proportional formula or rhythm-specific? Default: proportional, matches the same "scale by phase duration" pattern raised for the anticipation lead window.
3. Should "hidden on Inhale/Exhale" be a full hide (opacity 0) or a deeper fade (opacity 0.15)? Tester this in browser; if the user can still glance at it as a sanity check without being distracted by it, the deeper fade is the safer landing.

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
- Exhale may feel slightly long for some users; this needs more validation before changing the default Steady rhythm.
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

- Does the default Steady rhythm feel natural?
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
