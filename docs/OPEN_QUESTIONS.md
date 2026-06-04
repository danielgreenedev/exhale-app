# Exhale Open Questions

Last updated: May 23, 2026 (pediatrician Relax and HUD readability feedback added)

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

Context: Supabase `app_events` can show timer selections, session starts, Settling In exits, early exits, and completions.

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

### Do brand-new users need an optional tutorial?

Context: T-2026-05-21-10 suggested an optional tutorial after first-use uncertainty around phase changes caused stress and prevented completion. This is a first concrete request for tutorial-like support, but it conflicts with Exhale's low-friction first-run goal if handled too loudly.

Current answer: Open, but do not implement a tutorial yet. First try to learn whether clearer in-session cues can solve the same confusion without adding a pre-session instruction step.

Possible options:

- A very quiet "How it works" link near Session Setup, never blocking Begin.
- A one-screen optional tutorial reachable from Practice History or footer.
- A first-session-only microcopy line before Begin, if repeated feedback shows people need it.
- No tutorial, but stronger self-explanatory cue design in the orb itself.

### Should Exhale offer optional spoken voice guidance?

Context: T-2026-05-21-11 asked whether Exhale could have a voice guide the breathing along with the visual. This overlaps with the transition-cue uncertainty signal from T-2026-05-21-10, but it is a separate modality question: spoken guidance could make phases easier to follow, but it could also make Exhale feel less quiet, more intrusive, and more dependent on mobile audio reliability.

2026-05-23 update: the idea has repeated. T-2026-05-23-14 thought voice narration could be good, but warned that an AI voice could create a negative reaction. Three additional family testers also liked the idea of voice narration. This is now enough to treat voice as a roadmap candidate, but still not enough to build before the transition/Relax work is clarified.

Current answer: Open, promoted from parked idea to candidate. Keep visual-first as the default. If built, voice should be optional, off by default, and likely start with spoken phase names only. Avoid marketing or framing it as an "AI voice" feature during beta.

Possible approaches:

- Spoken phase names only: "Inhale", "Hold", "Exhale", "Relax".
- Spoken anticipatory prompts: "exhale next" or a very soft countdown cue, if visual-only cues remain unclear.
- A separate voice-guided mode inside Session Setup Audio.
- A one-time optional tutorial with voice, rather than voice during every session.

Risks:

- Voice may break the quiet/minimal tone.
- Voice may be harder to internationalize and personalize.
- Voice requires reliable audio, which is currently under investigation in Facebook's in-app browser.
- Voice could increase cognitive load if it overlaps with visual labels, tones, and background sound.
- AI-voice perception could hurt trust even if the guidance itself helps.

Follow-up prompts:

```text
Would you want voice because you close your eyes, because the transitions are hard to follow, or because it makes the app feel more guided?
```

```text
Would a simple human-recorded voice saying only the phase names be enough?
```

```text
Should voice replace the background sound, layer over it, or be a separate mode?
```

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

2026-05-20 signal: T-2026-05-19-08 liked the color leads and soft pre-cues on the default Quick / Steady path. They specifically said the sequencing felt natural, did not add strain, and did not interrupt the rhythm. This is a positive cue-system signal for the default path, separate from the same tester's Flow-specific complaint that the short 2-second Relax/pause felt rushed.

2026-05-20 second signal from the same tester: on Quick / Full / Small / Warm, the tester found the center circle relaxing when used as the timing object, but the outer guide line felt like a "pickup note" that could make them feel already behind because it begins before the center circle changes. Product response: keep the center orb as the primary timing anchor, lower the contrast/chroma of the guide line and incoming cue, and strengthen the orb rim slightly. This reframes the open question from "do we need cues?" to "are the cues quiet enough to support without becoming something to chase?"

2026-05-21 signal: T-2026-05-21-10, a brand-new user, found phase uncertainty stressful enough that they could not complete the process. They reported that phase colors felt too similar and suggested more distinct cues, including phase-specific shapes or a one-second anticipatory morph as the orb approaches the next phase. When asked whether they could tell what phase was coming next without reading extra text, they answered no, not at all. This pushes the question beyond "quiet enough" toward "clear enough for first-time users without adding distracting text."

2026-05-23 signal: T-2026-05-23-14 completed a 3-minute Android session and found the core exercise effective, but said phase transitions felt jarring and popped in. They specifically suggested a one-second fade where the old instruction fades out and the new instruction fades in at the boundary. This is different from the existing color/audio pre-cue; it is a request for the central label/instruction transition itself to feel smoother.

2026-05-23 second signal: T-2026-05-23-18, a pediatrician, could follow the phase transitions and did not think the time between phases needed to be extended. This is an important constraint: if transition polish ships, it should be a visual/readability crossfade or cue refinement, not added seconds between phases.

Current answer: Partially answered. Label/instruction boundary smoothing remains a near-term polish candidate, but do not add a global transition delay. Evidence now says some users can follow the timing, while others perceive the visual swap as abrupt.

Still open from the original five:

- (1) and (5) have a first attempt: the user-facing phase is now `Relax` with instruction `Breathe`, while the internal enum remains `rest`. Follow-up should test whether that reframe is enough or whether the phase itself still feels awkward.
- Whether the current crossfade is deep enough or needs further softening now that Rest has been reframed.
- Whether the outer guide line is now quiet enough that new users follow the orb first and perceive the line as support.
- Whether phase colors are distinct enough, or whether each phase needs a redundant shape/motion cue.
- Whether the orb itself should preview the next phase during the final second instead of relying mainly on the outer guide line.

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

```text
Could you tell what phase was coming next without reading extra text?
```

```text
Did the instruction text fade smoothly, or did the next phase feel like it popped in?
```

```text
Could you follow the timing, but still found the text hard to read?
```

### Is the central phase text readable over every phase color?

Context: The phase label and instruction sit over the animated phase circle. Earlier feedback raised phase-color distinctness; T-2026-05-23-18 added a more specific accessibility concern: the overlaid title/instruction text felt too bright and still did not contrast well enough with the phase circle, making it hard to read.

Current answer: Partially addressed in the beta polish pass, still awaiting tester validation. Do not solve with "make the text brighter." A local visual comparison found dark text with a light shadow helpful only on the brightest orb center and fragile around darker edges. The accepted first pass keeps light text, lowers HUD intensity, adds a local text halo, and reduces orb brightness/glow/pulse so the text and canvas no longer compete as strongly.

Possible approaches:

- Move the instruction stack slightly off the brightest part of the orb while preserving the centered meditation feel.
- Add a very subtle local text scrim or contrast layer that does not read as a card.
- Tune phase-specific text color/shadow so Hold/Relax do not wash out against amber/pink fills.
- Reduce title brightness while improving edge contrast, since the tester perceived both glare and poor legibility.
- Validate at mobile brightness settings, especially on OLED Android and iPhone screens.

Follow-up prompts:

```text
Which phase was hardest to read: Inhale, Hold, Exhale, or Relax?
```

```text
Was the text hard to read because it was too bright, too soft/blurry, too close in color to the circle, or directly on top of the brightest part?
```

```text
Would moving the text slightly above the circle make the phase easier to read, or would it feel less calm?
```

### Is audio reliable enough inside Facebook's in-app browser?

Context: Multiple testers have now reported mobile sound uncertainty. Earlier feedback suggested app-switching and silent mode may affect perceived sound. T-2026-05-21-10 reported that audio did not work at all on iPhone 14 after opening Exhale from a Facebook post inside Facebook's built-in in-app browser; the iPhone silent switch was not on. The project owner has also personally experienced similar Facebook in-app browser behavior on a Google Pixel. This suggests the risk may be Facebook's in-app browser capture path, not only iPhone/Safari.

2026-05-23 update: T-2026-05-23-14 first believed they were testing Brave on a Galaxy S26 Ultra, but screenshots showed the session was actually inside Facebook's in-app preview browser. The app rendered and the policy pages loaded correctly, but the fullscreen button did not function. Follow-up in real Brave mobile showed the interface displaying correctly. A later screenshot showed Messenger also opens `exhale.guide` inside a Messenger in-app browser. This broadens the question from audio reliability to browser-capability reliability inside Meta webviews.

Current answer: Open. Existing hardening improved suspended Web Audio reporting and iPhone silent-mode hints, but real-device validation is still needed across Facebook iOS, Facebook Android, Messenger Android/iOS, Safari, Chrome, Brave, silent switch/system mute state, volume state, fullscreen support, and app switching.

Follow-up prompts:

```text
Did sound fail inside the Facebook app browser, or also after opening the same link in Safari/Chrome?
```

```text
Was the phone muted or in silent mode, and did other web audio play normally?
```

```text
After tapping Begin, did tapping the sound button start audio, or did it stay silent?
```

```text
Could you open the link in your default browser and check whether sound works there?
```

### Should Exhale detect Meta's in-app browsers and guide users to an external browser?

Context: T-2026-05-23-14 confirmed that Facebook's in-app preview browser can render Exhale correctly while breaking at least the fullscreen affordance. A later screenshot confirmed Messenger opens Exhale inside its own in-app browser too. Prior feedback already raised Facebook in-app browser audio uncertainty. A referenced Stack Overflow thread on forcing Facebook links into external browsers does not provide a reliable, current, cross-platform escape hatch; comments and answers are inconsistent, and some approaches were Android-only, Messenger-only, or no longer reliable. The safest app-side move is detection plus a quiet user-facing nudge, not trying to force escape.

Current answer: Implemented in the session screen. Do not block breathing. When a Meta in-app browser is detected, hide unsupported controls such as fullscreen and show a compact note: tap the browser menu to open in a normal browser for sound or fullscreen.

Possible approaches:

- Hide fullscreen when the browser reports no usable Fullscreen API or when a Facebook webview user agent is detected.
- Keep fullscreen hidden and show a one-time small hint near the top-right area: `Tap menu to open in browser for sound or fullscreen`.
- Avoid stronger blocking or modal treatment unless audio failures repeat after this compact hint.
- Add instructions to tester prompts: if opening from Facebook, use the menu to open in external browser before reporting browser-specific bugs.

Follow-up prompts:

```text
Did the issue happen inside the Facebook app browser, or after opening the link in your regular browser?
```

```text
If Exhale showed a small "open in browser for fullscreen" hint, would that feel helpful or annoying?
```

### Should Rest and Hold be partly or completely optional?

Context: Originally raised by T-2026-05-19-03 (did not care for Rest, suggested an option to include or remove it) and T-2026-05-19-05 (capacity mismatch; gasping). Soft (internal id `gentle`) already trims Hold to 2s and Rest to 4s, but that may not be far enough.

2026-05-19 update: Two unsolicited replies on the Facebook pacing question flagged Hold and/or Rest. T-2026-05-19-06 called Hold "the hardest part" and described an asymmetric exhale-to-inhale ratio as friction. T-2026-05-19-07 liked Hold and slow Exhale, but said the rests felt awkward. That is now four distinct testers flagging Rest/Relax, plus two flagging Hold - convergent enough to promote this from deferred to active.

2026-05-20 update: T-2026-05-19-08 tested Flow and gave a split signal. Removing Hold helped; Inhale and Exhale felt smooth and well-paced. The remaining 2-second Relax/pause felt too fast, "spastic," and interruptive, and the anticipatory push felt rushed. When asked directly whether the tiny pause helped reset or whether Flow should be inhale/exhale only, the tester answered that they would take out the pause. This suggests Flow may need to become truly continuous (candidate 4-0-6-0) if another independent Flow tester reports the same pause friction.

2026-05-23 update: T-2026-05-23-14 independently questioned whether an 8-second Relax segment is counterproductive during anxiety reduction, because it seems to interrupt controlled breathing by returning to normal breathing. They suggested using that time more productively by lengthening transitions or Hold. This signal is not identical to "remove Rest" because the tester may be reacting to the concept of normal-breathing space in Steady rather than Flow's short pause, but it increases the weight of the Rest/Relax design question.

2026-05-23 second update: T-2026-05-23-18, a pediatrician, liked the app but said Relax took her out of the moment because the pause was too long. She also did not know whether to hold breath, breathe deep, or breathe normally during Relax, and noted that some square breathing techniques use a short hold after exhaling. This is another independent clinical signal that Steady's 8-second Relax is semantically and structurally confusing.

Possible directions:

- Add a fourth rhythm preset with Hold=0 or Rest=0 (or both) instead of exposing free-phase customization. Working candidate: a "Flow" rhythm with no Hold, e.g. 4-0-6-2 or 4-0-6-0. Tracked as a Stage 1 sketch task in `docs/TODO.md`.
- Reframe Rest's identity further beyond the Relax/Breathe rename if the awkwardness signal continues.
- Allow per-phase duration overrides inside Session Setup (closer to free customization; reintroduces decision friction).
- Test whether the default Steady fourth phase should be shorter or more explicitly a post-exhale hold. Be careful: "hold after exhale" is recognizable in square breathing, but may be less accessible for anxious users than permission to breathe naturally.

Current answer: **Partially answered as of 2026-05-20, but Flow's shape and Steady's 8-second Relax both need revalidation.** Flow (4-0-6-2) shipped as a fourth rhythm preset rather than as a gated preview build; the original pre-merge validation gate was waived. First Flow follow-up signal from T-2026-05-19-08 says no-Hold helps, but the 2-second Relax/pause interrupts the otherwise smooth Inhale/Exhale loop. The same tester explicitly prefers removing the pause. New Steady/default-path signals from T-2026-05-23-14 and T-2026-05-23-18 say the 8-second Relax feels counterproductive or too long and remains unclear. Post-launch validation is now Stage 0 item 2 in `docs/TODO.md`: follow up with Rest/Hold-frictioned testers and ask whether Flow fits better than their current choice **and** whether it would be better with no pause at all. If an independent tester repeats the Flow pause complaint, test 4-0-6-0 before considering free per-phase customization. Separately, test whether Steady's Relax should be shorter or reframed.

### Should Exhale support progressive/ramping rhythms?

Context: Two independent testers have asked for a rhythm shape that changes across the session rather than staying identical every cycle. T-2026-05-19-07 framed it competitively: "The competitive nature in me likes the idea of the breath, hold, and exhale increasing in duration by the last rep." T-2026-05-22-13 (retired ICU nurse and childbirth educator) framed it clinically: could the session "build up to the 8 second pause" rather than dropping the user straight into Steady's full-length Relax? Two testers, two different framings (escalation vs. acclimation), one underlying ask — a non-isochronous shape. Per the handoff's Parked Questions list, second-independent-signal was the explicit promotion trigger.

Current answer: **Promoted from Parked on 2026-05-22.** Not yet a build task. Resolve the design tension first.

Design tension:

- All four current rhythms are isochronous: every cycle has the same per-phase durations. Progressive ramping breaks that property by design.
- `CLAUDE.md` records that rhythm is locked at session start and does not change mid-session. That decision was driven by predictability — the user should never feel the floor shift under them. A progressive ramp shape *does* change durations mid-session, but it does so on a stated curve the user signed up for at start. The invariant the user actually wants is "no surprises," not "no change"; a transparent ramp can preserve that. Framing has to make the curve unambiguous.
- `rhythmRef` locking in `useBreathingSession`, `BreathingOrb`, `GameHUD`, and `useAudioEngine` assumes a static `Rhythm` object captured at first render. Progressive shapes would need either a richer Rhythm shape (per-phase scaling function over cycle index) or a derived per-cycle Rhythm computed at the start of each cycle.
- Anticipatory cue math (`getPhaseLookahead`, `PHASE_LOOKAHEAD_SECONDS = 0.8` with the 25% cap) assumes fixed phase durations. The lookahead would need to compute against the current cycle's phase duration, not a registry constant.
- Cycle counts per minute length (`quick`/`short`/`medium`/`long`) are recalibrated per rhythm today. A ramp shape changes the average cycle length over the session, so the cycle count -> minute label mapping needs to be recomputed for any ramp curve.

Possible shapes:

- A single named preset ("Build" or similar) that ramps Inhale/Hold/Exhale/Relax from short toward target durations over the first N cycles, then sustains. Easiest to add. Compatible with the locked-at-start invariant if the curve is fixed and disclosed.
- An "ease in" modifier on any of the four existing rhythms — applies a soft-start ramp on top of the chosen pattern. More flexible, more decision-cost on Session Setup, harder to communicate.
- A first-cycle-only soft start that warms into the chosen rhythm. Smallest visible product change. Could also partially address T-2026-05-22-13's Settling-In-too-short feedback if framed as part of the settle, not as a separate ramp.

Open subquestions:

- Should the ramp cover only the first N cycles ("build up, then sustain") or the whole session ("escalate throughout")? The childbirth-educator framing implies the former; the competitive framing implies the latter.
- If shipped, does this become a fifth preset (more home-screen decision-cost) or a modifier on existing presets (more Session Setup decision-cost, more flexibility)?
- Does the ramp ask from T-2026-05-22-13 partly disappear if the Relax-clarity work lands? She is naming the 8s Relax as "the 8 second pause," which suggests she is interpreting it as a held pause she needs to acclimate to. If Relax stops reading as a pause, the ramp ask may shrink.
- For T-2026-05-19-07's competitive framing, does the ask survive if Hold and Exhale already feel right at their target durations, or is escalation specifically the appeal?

Follow-up prompts:

```text
When you said "build up to the 8 second pause," did you mean the first few cycles should be shorter and grow into the full rhythm, or that the whole session should escalate from short to long?
```

```text
Would a single named "Build" rhythm work for you, or would you want any rhythm to be able to ramp?
```

```text
If the long Relax stopped feeling like a held pause, would you still want a ramp?
```

Do not implement until at least the first two follow-ups have a tester answer.

### Should Session Setup be visible before a first completed session?

Context: Session Setup started as a way to avoid hiding necessary fit controls from people whose breathing capacity, sound needs, or visual comfort differ from the default. The product tension is now explicit. Some testers like customization and even ask for more, such as color/theme changes. T-2026-05-23-14 argued the opposite: because Exhale is guided breathing, first-time users may undermine the guidance if they can immediately change timing and settings before feeling the default.

Current answer: Answered and implemented on 2026-05-23. Session Setup is hidden until one local completed session exists, then appears as `Adjust next session`. Time selection remains visible because it is the primary first decision. This preserves the anonymous-first design: no account, cookie, or sync requirement.

2026-05-23 owner note: Ryan's suggestion to hide settings for brand-new users until they complete the exercise once feels directionally right because it could reduce first-session friction and distraction while preserving customization after the user understands the default.

Technical implementation: completed sessions are stored locally under `exhale-stats` via `useSessionStats`, and settings are stored in localStorage through `exhale-session-length`, `exhale-rhythm`, `exhale-orb-scale`, and the sound palette key. There is no session cookie required. `sessionStorage` is only used for short resume state. The gate reads localStorage session count, and if localStorage is unavailable, falls back to showing setup rather than trapping users in the default.

Possible approaches:

- Keep current setup visible, but continue to frame it as optional and secondary.
- Hide Session Setup until one completed session exists, then reveal it as "Adjust next session."
- Hide advanced setup until one completed session exists, but keep the time choices visible because they are the primary first decision.
- Show only non-rhythm controls first, such as Circle Size and Sound, and delay pace/timing details.
- Add a small post-session nudge: `Want to adjust the next one?`

Follow-up prompts:

```text
Did seeing Session Setup before your first session make you feel more in control or less guided?
```

```text
Would you rather try the default once before seeing pace and sound options?
```

```text
If setup appeared after one completed session, would that feel natural or frustrating?
```

### Should Session Complete show exact elapsed seconds?

Context: T-2026-05-23-14 chose a 3-minute session and saw `2:56 of calm` on Session Complete. They found this bizarre and potentially confusing because the consumer-facing promise was "3 minutes." The discrepancy is likely honest runtime rounding/cycle calibration, but exact seconds do not help the user at completion and may undermine trust in the timer label.

Current answer: Open, leaning toward removing exact elapsed display. Prefer a selected-duration label such as `3 minutes complete`, or omit duration and let breath cycles plus the quote carry the moment.

Follow-up prompts:

```text
After a 3-minute session, would "3 minutes complete" feel clearer than showing the exact elapsed time?
```

```text
Do you care about the exact seconds, or only that the session matched the time you picked?
```

### Does Box resolve the retired Full/Relax confusion?

Context: T-2026-05-19-08 tried Quick / Full / Small / Warm while at resting heart rate and found the 10-second Exhale difficult, but also said Full could be useful when someone needs focused help slowing breath from panic. Later Relax feedback from multiple testers, plus the app designer's own reaction on 2026-06-04, showed that the post-exhale Relax phase was still cognitively confusing. Full was replaced by Box (`box`, 4-4-4-4) so the fourth beat is an expected Hold after Exhale.

Current answer: Full is retired. Validate whether Box feels clearer than Full/Relax and whether it earns a permanent place as the structured alternate.

Follow-up:

```text
Does Box feel clearer than Full/Relax, especially the hold after exhale?
```

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
- At the time, this did not change the underlying Steady (`standard`), Soft (`gentle`), or Full patterns. Current state after 2026-06-04: Full is retired and Box (`box`) occupies that slot. Default first-time experience is still unchanged.
- Does not fully address T-2026-05-19-06's exhale-to-inhale ratio concern. Flow's 6:4 ratio is the same as Steady's; only 4-0-5-3 would directly address that. If the ratio concern persists after Flow lands with the other three testers, treat it as a separate question.

Validation gate before shipping (recorded so the bar is explicit, not retroactive):

- Run the sketch past at least two of T-2026-05-19-03, -05, -06, -07 in a Vercel preview build or a private session before merging to master. If none of them prefer Flow over their current choice (Steady or Soft), do not ship — the friction signal is real but the preset is not the right shape.
- If at least one prefers Flow and the rest are neutral, ship as an optional fourth preset. This is not strong enough signal to make it the default for anyone, but is enough to justify giving Hold-frictioned users a path that exists.
- If two or more prefer Flow, treat that as confirmation and watch `app_events` to see whether Flow's selection rate justifies its slot in Session Setup long-term.

Open subquestions parked for after the sketch lands:

- Should Flow have distinct phase colors, or inherit existing ones? Default: inherit. Phase identity is consistent across rhythms and Flow does not warrant breaking that.
- Does the anticipation cue audio still feel right at a 12s cycle with the abrupt Exhale-to-Relax handoff? First Flow follow-up signal says the "push" felt rushed and interruptive during the pause. The proportional cap is already live, so if the signal repeats, test removing Flow's Relax phase before adding more cue complexity.
- Does the Flow rhythm helper's `Continuous` summary read well alongside Soft's `Accessible` and Box's `Structured`? Earlier alternatives were `Open`, `Light`, `Steady`, and `Free`; revisit only if tester language suggests the current label is confusing. The compact rhythm tiles are now label-only, so this is helper/aria copy rather than visible tile copy.

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

Context: Return use is part of the Stage 0 gate. `docs/USER_FEEDBACK.md` now asks whether a tester would use Exhale again when stressed, tired, or needing to settle.

Current answer: Partially answered. The prompt is now in the brand-new-user follow-up set, but the gate still needs actual return-use signal, not only stated usefulness.

2026-05-20 signal: T-2026-05-19-08 said Exhale is a good tool for feeling stressed, tired, or needing to settle, but also said they might not think to use it. That is positive product-value feedback and a reminder that retention may depend on whether the user remembers Exhale in the right moment.

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

### Is optional Backup & Sync quiet enough?

Context: Backup & Sync belongs only inside Practice History and must not make Exhale feel account-gated. This now covers both email-code sync and the promoted Google OAuth path.

Current answer: Open.

### Could OAuth (Google / Apple Sign-In) be lower-friction than email OTP for Practice History sync?

Context: Practice History sync currently uses email-code OTP. That requires the user to leave Exhale, open their email app, find the code, switch back, and paste it. OAuth providers offer a one-tap consent flow when the device is already signed into Google or Apple. For users who have already decided to sync (inside Practice History), OAuth is plausibly a strict friction reduction over OTP. This is a different question from "should Exhale have a fuller account system" below: the framing is friction-reduction within the existing optional sync gate, not adding a new account surface to the app.

Current answer: **Resolved and completed in Stage 0 on 2026-05-20.** Google OAuth is now an optional Backup & Sync path inside Practice History alongside the existing email-code flow. Anonymous-first stays the default; the home screen does not change; breathing never requires sign-in. App-side wiring, Supabase/Google provider setup, manual linking, local smoke testing, production redirect smoke testing, email-code-to-Google linking, and Firefox production restore testing are complete. Supabase shows Email and Google attached to the same user, and a fresh Firefox production session restored synced Practice History through `Continue with Google`. Apple Sign-In remains a later candidate because it is privacy-aligned but adds Apple Developer/provider overhead.

Why this moved up:

- Product reliability: OAuth can make cross-device persistence more reliable and less brittle than email-code switching for users who already want sync.
- Developer feedback: Shawn Beck recommended proper OAuth on Practice History so users can persist their data more reliably.
- Future optionality: a stable provider-backed identity creates a cleaner path if premium subscriptions ever become relevant, while monetization remains conditional and deferred.
- Portfolio value: implementing this as privacy-first optional account linking is a strong resume/GitHub signal because it demonstrates auth architecture without sacrificing product philosophy.

Tradeoffs worth naming before building:

- A "Sign in with Google" button reads as more account-gated than a text email field even when both gate the same Supabase identity. This sits slightly against the anonymous-first brand signal, even if the button only appears inside Practice History.
- OAuth introduces Google (and eventually Apple) as third-party dependencies for synced users. Non-synced users are unaffected.
- Apple Sign-In adds review/policy overhead and a separate provider config. Defensible to defer until a tester actually asks for it.
- Implementation cost is low: Supabase supports both providers natively, and the current anonymous-to-email sync flow already converts anonymous identities; OAuth follows the same identity-linking stance when possible.

Implementation stance shipped:

- Use Supabase Auth provider support, not manual OAuth handshakes.
- Use normal Google sign-in from idle/anonymous states, because fresh browsers receive anonymous Supabase sessions by default. Use `linkIdentity()` only from the synced email-code `Link Google` state when the provider is not attached yet.
- Add Google first, then evaluate Apple later.
- Treat OAuth as "Backup & Sync" or "Save across devices," not as a profile/account feature.
- Preserve and merge existing local/anonymous data when a provider is linked.
- Keep email-code sync available unless it becomes clearly redundant after testing.
- Keep `/privacy` and `/terms` aligned with the optional provider path so they describe provider sign-in, exact synced data, third-party involvement, deletion/request paths, and the anonymous-first promise.

Related: the existing "fuller account system" question below addresses a different concern (account management surface area, not friction reduction within an existing optional gate).

### Would a fuller account system ever create enough value to justify the added friction?

Context: Exhale currently uses anonymous Supabase identity by default and optional email-code sync only inside Practice History. `PRODUCT.md` and `DESIGN.md` both protect the anonymous-first promise: no required account, login, profile, onboarding gate, or sync prompt before breathing. Any fuller auth model, such as password login, OAuth, profiles, account settings, or persistent account management, would need a clear user benefit that optional email sync cannot provide.

Current answer: Still no fuller account system. Optional Google OAuth for Practice History Backup & Sync has shipped, but that does not authorize profiles, account settings, passwords, avatars, required login, or auth-first onboarding.

Possible reasons to revisit:

- Testers explicitly ask for stronger account recovery or account management.
- Cross-device sync feels unreliable or confusing with email-code sign-in alone.
- Deletion, data export, privacy controls, or trust needs become hard to support without account settings.
- A future therapist, group, or organizational use case requires managed identities.

Default stance:

```text
Do not add a fuller account surface beyond optional Practice History Backup & Sync unless beta feedback shows the value outweighs the extra friction.
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
- Add a self-serve deletion confirmation flow after Backup & Sync.

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

Answer: Curated presets, not free customization. Four rhythms are now available inside Session Setup as visible pace choices: Steady (internal id `standard`, 4-4-6-4 as of 2026-05-26, originally 4-4-6-8), Soft (internal id `gentle`, 3-2-4-4), Box (`box`, 4-4-4-4, replacing Full on 2026-06-04), and Flow (`flow`, 4-0-6-2). Each persists through `exhale-rhythm` localStorage and `user_settings.rhythm` cloud column; legacy `full` and `slow` values normalize to `box`. Free per-phase customization is intentionally not exposed; the presets handle the rhythm-fit complaints captured so far without forcing the skeptical primary user to make a multi-axis decision before pressing Begin.

Date answered: 2026-05-19

Evidence: Promoted Priority work shipped end to end (`docs/ROADMAP.md`, `docs/TODO.md` Completed Promoted Priority section). Original rhythm-fit signals from `docs/USER_FEEDBACK.md` entries T-2026-05-18-01 through T-2026-05-19-05.

Follow-up: Beta-test Box and Flow against the Relax-confusion testers. If complaints persist beyond what the presets cover, revisit free customization. Otherwise treat free customization as deliberately deferred.

### Template

Question:

Answer:

Date answered:

Evidence:

Follow-up:
