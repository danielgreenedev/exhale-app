# Exhale Open Questions

Last updated: May 20, 2026 (Flow pause follow-up logged)

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
Did the Relax/Rest period help you reset, or did it feel like it interrupted the breathing rhythm?
```

```text
If the rhythm did not fit you, did you want it gentler/easier, slower/deeper, or simply less interrupted by Relax/Rest?
```

```text
Did the rhythm ever make you feel like you had to gasp, catch up, or strain?
```

Flow-specific follow-up prompts:

```text
Did Flow feel smoother than the other pace you tried?
```

```text
Did removing Hold help?
```

```text
Did the tiny pause after Exhale help you reset, or would Flow feel better as inhale/exhale only with no pause at all?
```

```text
Did the pause, cue, or circle movement ever feel rushed, pushy, or interruptive?
```

```text
Would you choose Flow again, or would you pick a different pace?
```

### Should Exhale offer customizable breath rhythms?

Answered 2026-05-19 with a partial yes: three curated presets, not free customization. See Answered Questions below for the full record.

Remaining open: whether to expose free per-phase customization on top of presets. Defer until the three presets have at least one beta round of usage data; if presets cover the rhythm-fit complaints we have, free customization is decision-cost the skeptical primary user does not need.

### Do users need anticipatory phase cues or softer phase transitions?

Context: Beta feedback suggested phase changes can feel abrupt and that the brain takes a beat to register an exact-boundary transition (label, sound, and motion all changing at the same instant). Five candidate interventions surfaced in critique:

1. Rename or reframe Rest so it does not imply stillness
2. Add a quiet pre-cue 500-800ms before each phase change
3. Let the label and audio lead the orb motion slightly
4. Soften phase boundaries with a deeper crossfade
5. Treat Rest as natural breathing space rather than an empty hold

Current answer: partially answered. Implementing 2026-05-19:

- `PHASE_LOOKAHEAD_SECONDS = 0.8` constant added in `src/lib/breathing.ts`
- `useBreathingSession` exposes `nextPhase`, `phaseLeadProgress`, and `timeUntilPhaseEnd` so consumers can render lead state
- `BreathingOrb` guide ring picks up the next-phase color during the lead window
- `useAudioEngine` schedules a quiet pre-cue before each phase change
- `GameHUD` initially showed a `Next [phase]` text cue but it competed for attention with the central phase label and countdown. Removed 2026-05-19; the audio pre-cue and ring color lead carry the anticipation signal on their own. `nextPhase` and `phaseLeadProgress` stay on the hook return so the orb and audio engine still consume them.

Still open from the original five:

- (1) and (5) have a first attempt: the user-facing phase is now `Relax` with instruction `Breathe`, while the internal enum remains `rest`. Follow-up should test whether that reframe is enough or whether the phase itself still feels awkward.
- Whether the current crossfade is deep enough or needs further softening now that Rest has been reframed.

Follow-up: watch beta feedback for whether anyone still reports boundary anxiety after the lead window is live. If not, treat this as covered. Ask specifically:

```text
Did the color lead or soft pre-cue make the phase changes easier to follow?
```

```text
Did the transition cues feel helpful, or did they add too much information?
```

```text
Was any specific phase change still hard to follow, such as Exhale to Relax or Relax to Inhale?
```

### Should Rest and Hold be partly or completely optional?

Context: Originally raised by T-2026-05-19-03 (did not care for Rest, suggested an option to include or remove it) and T-2026-05-19-05 (capacity mismatch; gasping). Soft (internal id `gentle`) already trims Hold to 2s and Rest to 4s, but that may not be far enough.

2026-05-19 update: Two unsolicited replies on the Facebook pacing question flagged Hold and/or Rest. T-2026-05-19-06 called Hold "the hardest part" and described an asymmetric exhale-to-inhale ratio as friction. T-2026-05-19-07 liked Hold and slow Exhale, but said the rests felt awkward. That is now four distinct testers flagging Rest/Relax, plus two flagging Hold - convergent enough to promote this from deferred to active.

2026-05-20 update: T-2026-05-19-08 tested Flow and gave a split signal. Removing Hold helped; Inhale and Exhale felt smooth and well-paced. The remaining 2-second Relax/pause felt too fast, "spastic," and interruptive, and the anticipatory push felt rushed. When asked directly whether the tiny pause helped reset or whether Flow should be inhale/exhale only, the tester answered that they would take out the pause. This suggests Flow may need to become truly continuous (candidate 4-0-6-0) if another independent Flow tester reports the same pause friction.

Possible directions:

- Add a fourth rhythm preset with Hold=0 or Rest=0 (or both) instead of exposing free-phase customization. Working candidate: a "Flow" rhythm with no Hold, e.g. 4-0-6-2 or 4-0-6-0. Tracked as a Stage 1 sketch task in `docs/TODO.md`.
- Reframe Rest's identity further beyond the Relax/Breathe rename if the awkwardness signal continues.
- Allow per-phase duration overrides inside Session Setup (closer to free customization; reintroduces decision friction).

Current answer: **Partially answered as of 2026-05-20, but Flow's shape is not fully validated.** Flow (4-0-6-2) shipped as a fourth rhythm preset rather than as a gated preview build; the original pre-merge validation gate was waived. First Flow follow-up signal from T-2026-05-19-08 says no-Hold helps, but the 2-second Relax/pause interrupts the otherwise smooth Inhale/Exhale loop. The same tester explicitly prefers removing the pause. Post-launch validation is now Stage 0 item 2 in `docs/TODO.md`: follow up with T-2026-05-19-03, -05, -06, -07 and ask whether Flow fits better than their current choice **and** whether it would be better with no pause at all. If at least one of them prefers current Flow and no one else flags the pause, keep 4-0-6-2. If an independent tester repeats the pause complaint, test 4-0-6-0 before considering free per-phase customization.

#### Flow rhythm design sketch (2026-05-19)

Working hypothesis: a fourth preset that removes Hold and shortens Relax to a transition beat addresses the Rest/Hold-friction signal without exposing free per-phase customization. Name: `Flow`.

Candidate shapes (tradeoff matrix):

| Shape   | Cycle | Quick / Short / Medium / Long (cycles) | Profile |
|---------|-------|----------------------------------------|---------|
| 4-0-6-2 | 12s   | 15 / 25 / 35 / 50                      | Primary candidate. Brief Relax keeps a transition beat without reading as an interruption. Cycle counts comparable to Soft (13s). |
| 4-0-6-0 | 10s   | 18 / 30 / 42 / 60                      | Strict in-out, no recovery beat. Cleanest answer to "remove Rest entirely," but 60 cycles in 10 min may feel demanding and the orb has no held-small visual beat between Exhale end and next Inhale start. |
| 4-0-5-3 | 12s   | 15 / 25 / 35 / 50                      | More symmetric exhale:inhale ratio (5:4 vs 6:4). Directly addresses T-2026-05-19-06's "slower exhale then short inhale" framing, but loses some parasympathetic benefit of the longer exhale. |
| 3-0-5-2 | 10s   | 18 / 30 / 42 / 60                      | Lighter still. Risks overlapping with Soft's role (3-2-4-4) — both shorter and easier — without a distinct purpose. |

Recommendation: ship **4-0-6-2** if anything ships. Reasoning:

- Removes Hold, which is the unifier across the four frictioned testers (T-2026-05-19-03, -05, -06, -07).
- Preserves the 6:4 exhale:inhale ratio so the parasympathetic effect is intact.
- 2s Relax is short enough to feel like a transition beat rather than an interruption, addressing the Rest-awkward feedback without removing the breathing space entirely.
- Cycle counts land in the same range as existing rhythms (Soft: 14 / 23 / 32 / 46; Flow: 15 / 25 / 35 / 50). No cycle-counter UX regression.

Code implications (for Codex; no implementation in this sketch):

1. `getPhaseAtTime` in `src/lib/breathing.ts` already handles 0-duration phases correctly — the strict `<` check silently skips them. No change needed.
2. `getNextPhase` currently returns the literal next index, including 0-duration phases. Change needed: skip zero-duration phases so the anticipation cue does not lead into a phase that has no time on screen. Single-line fix in `breathing.ts`.
3. `getOrbScale` is correct as-is. 0-duration phases never become the active phase, so they never have a scale computed. `prevScale` carries continuity across them (Exhale ends at 0.45, next Inhale begins from 0.45).
4. `useAudioEngine.playAnticipationCue` and `BreathingOrb`'s guide-ring lead both consume `nextPhase` from `useBreathingSession`. If `getNextPhase` is fixed to skip zero-duration phases, these inherit correct behavior automatically — no further change.
5. Session Setup tile needs a new entry. Final shipped label: `Flow`; summary: `Continuous`; helper description now reads "No hold, steady momentum." Technical timing is hidden behind `View timing`.
6. `RhythmId` union, `isRhythmId` guard, settings parser, and tests all need `'flow'` added. Supabase currently stores `user_settings.rhythm` as plain text with no enum/check constraint, so no database migration is required unless we intentionally add a constraint later. Existing parsers fall back to `DEFAULT_RHYTHM` on unknown values, so older clients hitting a flow-row stay safe.
7. Tests in `src/__tests__/breathing.test.ts` to cover: Flow registry shape, `getNextPhase` zero-skip behavior, `getPhaseAtTime` boundaries across a Flow cycle, and cycle recalibration counts.

What this does NOT do:

- Does not introduce free per-phase customization. Decision-cost stays bounded to four named presets.
- Does not change the underlying Steady (`standard`), Soft (`gentle`), or Full patterns. Default first-time experience is unchanged.
- Does not fully address T-2026-05-19-06's exhale-to-inhale ratio concern. Flow's 6:4 ratio is the same as Steady's; only 4-0-5-3 would directly address that. If the ratio concern persists after Flow lands with the other three testers, treat it as a separate question.

Validation gate before shipping (recorded so the bar is explicit, not retroactive):

- Run the sketch past at least two of T-2026-05-19-03, -05, -06, -07 in a Vercel preview build or a private session before merging to master. If none of them prefer Flow over their current choice (Steady or Soft), do not ship — the friction signal is real but the preset is not the right shape.
- If at least one prefers Flow and the rest are neutral, ship as an optional fourth preset. This is not strong enough signal to make it the default for anyone, but is enough to justify giving Hold-frictioned users a path that exists.
- If two or more prefer Flow, treat that as confirmation and watch `app_events` to see whether Flow's selection rate justifies its slot in Session Setup long-term.

Open subquestions parked for after the sketch lands:

- Should Flow have distinct phase colors, or inherit existing ones? Default: inherit. Phase identity is consistent across rhythms and Flow does not warrant breaking that.
- Does the anticipation cue audio still feel right at a 12s cycle with the abrupt Exhale-to-Relax handoff? First Flow follow-up signal says the "push" felt rushed and interruptive during the pause. The proportional cap is already live, so if the signal repeats, test removing Flow's Relax phase before adding more cue complexity.
- Does the Flow rhythm helper's `Continuous` summary read well alongside Soft's `Accessible` and Full's `Deep`? Earlier alternatives were `Open`, `Light`, `Steady`, and `Free`; revisit only if tester language suggests the current label is confusing. The compact rhythm tiles are now label-only, so this is helper/aria copy rather than visible tile copy.

Constraints to note for implementation:

- Keep Flow as a 4-phase rhythm with zero-duration phases rather than removing phases from the registry; a truly variable phase count would be a larger refactor.
- `getNextPhase` must skip zero-duration phases so anticipation does not point at an invisible phase.

Related: see Rest renaming brainstorm in the working-tree handoff notes; even with the same phase structure, label and instruction copy can do a lot of work.

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

### Could OAuth (Google / Apple Sign-In) be lower-friction than email OTP for Practice History sync?

Context: Practice History sync currently uses email-code OTP. That requires the user to leave Exhale, open their email app, find the code, switch back, and paste it. OAuth providers offer a one-tap consent flow when the device is already signed into Google or Apple. For users who have already decided to sync (inside Practice History), OAuth is plausibly a strict friction reduction over OTP. This is a different question from "should Exhale have a fuller account system" below: the framing is friction-reduction within the existing optional sync gate, not adding a new account surface to the app.

Current answer: Open. Lean is to add Google Sign-In as a second option inside Practice History alongside OTP rather than replacing OTP, pilot with the current beta tester group, and add Apple Sign-In later if iPhone testers reach for it. Anonymous-first stays the default; the home screen does not change.

Tradeoffs worth naming before building:

- A "Sign in with Google" button reads as more account-gated than a text email field even when both gate the same Supabase identity. This sits slightly against the anonymous-first brand signal, even if the button only appears inside Practice History.
- OAuth introduces Google (and eventually Apple) as third-party dependencies for synced users. Non-synced users are unaffected.
- Apple Sign-In adds review/policy overhead and a separate provider config. Defensible to defer until a tester actually asks for it.
- Implementation cost is low: Supabase supports both providers natively, and the current `linkEmailToAnonymousUser` flow already converts anonymous identities; OAuth would follow the same conversion path.

Decision blocker: tester preference. Before committing, run the dual-option Practice History past a few testers and watch which path they reach for. If OTP completion rate is the bottleneck on cross-device usage, OAuth should narrow that gap.

Related: the existing "fuller account system" question below addresses a different concern (account management surface area, not friction reduction within an existing optional gate).

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

### Should Exhale support color or theme customization beyond Garden?

Context: T-2026-05-19-07's follow-up reported that a teenager liked the simplicity of the layout and interface, liked the existing customization, and wondered about changing colors.

Current answer: Open, not Stage 0. Treat this as a theme/personalization signal, not an immediate request for freeform color controls. Freeform colors could break the calm design language, phase-color meaning, contrast guarantees, and the "one accent per skin" rule. A safer first step is a curated skin/theme path such as Garden.

Follow-up questions to ask:

```text
When you say change colors, do you mean the orb/phase colors, the background style, or a comfort/contrast setting?
```

```text
Would a few curated themes feel better than choosing every color yourself?
```

### Is Facebook preview worth more attention?

Answered 2026-05-19. See Answered Questions below.

## Answered Questions

Move answered questions here with date, answer, evidence, and follow-up.

### Is Facebook preview worth more attention?

Answer: No further work needed. The Facebook Sharing Debugger 403 / preview-rendering issue cleared on its own once Meta's cache aged out from the original `exhale.guide` scrape. The current live build renders correctly when shared on Facebook. The working hypothesis (Meta-side parser/cache state, not an Exhale-side issue) held up — no app-side change was the fix, time was. App-side Open Graph metadata, the static `/og-image.png`, the `robots.txt` allowances for Meta/Facebook crawlers, and the Vercel firewall bypass rules for observed Meta IP ranges all stay in place as belt-and-braces protection against a recurrence.

Date answered: 2026-05-19

Evidence: Project owner confirmed the live Facebook share renders the intended preview after testing the latest production build. `docs/SOCIAL_PREVIEW_TROUBLESHOOTING.md` has been updated to "Resolved" with the full playbook preserved for future reference.

Follow-up: None active. Revisit the playbook only if a future domain change, OG image swap, or skin update triggers similar cache symptoms.

### How many similar reports are enough to act on rhythm comfort?

Answer: The threshold is reached when reports converge on the rhythm itself (not isolated preference variants) and at least one report describes a safety- or capacity-level concern, not just a preference. Five of six recent beta testers reported rhythm-fit concerns, and T-2026-05-19-05 specifically could not follow the rhythm without gasping, which is a capacity mismatch rather than a taste signal. That tipped the decision from "investigate further" to "act now."

Date answered: 2026-05-19

Evidence: `docs/USER_FEEDBACK.md` entries T-2026-05-18-01 (performance pressure, possibly long Exhale), T-2026-05-19-02 (pacing felt fast), T-2026-05-19-03 (did not care for Rest), T-2026-05-19-04 (prefers slower-deeper), T-2026-05-19-05 (gasping; capacity mismatch).

Follow-up: Promoted Priority added to `docs/ROADMAP.md` and `docs/TODO.md` to design and ship selectable alternate rhythms while continuing beta feedback collection in parallel.

### Should Exhale offer customizable breath rhythms?

Answer: Curated presets, not free customization. Four rhythms are now available inside Session Setup as visible pace choices: Steady (internal id `standard`, 4-4-6-8), Soft (internal id `gentle`, 3-2-4-4), Full (`full`, 6-6-10-4), and Flow (`flow`, 4-0-6-2). Each persists through `exhale-rhythm` localStorage and `user_settings.rhythm` cloud column. Free per-phase customization is intentionally not exposed; the presets handle the rhythm-fit complaints captured so far without forcing the skeptical primary user to make a multi-axis decision before pressing Begin.

Date answered: 2026-05-19

Evidence: Promoted Priority work shipped end to end (`docs/ROADMAP.md`, `docs/TODO.md` Completed Promoted Priority section). Original rhythm-fit signals from `docs/USER_FEEDBACK.md` entries T-2026-05-18-01 through T-2026-05-19-05.

Follow-up: Beta-test the three presets with the original five rhythm-concern testers (TODO Stage 0 item 2). If complaints persist beyond what the presets cover, revisit free customization. Otherwise treat free customization as deliberately deferred.

### Template

Question:

Answer:

Date answered:

Evidence:

Follow-up:
