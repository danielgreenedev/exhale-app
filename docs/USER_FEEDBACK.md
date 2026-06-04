# Exhale User Feedback

Last updated: June 4, 2026 (owner Box rhythm decision after Relax confusion)

## Purpose

Use this document to capture user critique, usability notes, and product observations without mixing private tester details into the core product docs.

## Current Test Surface

Use `https://exhale.guide` for the current beta round. Use a Vercel preview only when a future test needs changes that should not be visible on production yet.

## Current QA Notes

- First-run defaults should remain 3 minutes / Medium circle / Steady pace / Air background sound.
- If Firefox on Windows 11 appears to enter a session with sound off, verify whether Session Setup actually selected `Off` or whether Web Audio simply has not started yet. The former is a settings persistence bug; the latter is expected browser autoplay behavior if it resolves after a tap.
- When a tester reports "Brave" or "Chrome" from a Facebook-shared link, verify whether they are actually in Facebook's in-app preview browser. Facebook preview can render Exhale correctly while still blocking or degrading browser features such as fullscreen.
- Facebook and Messenger in-app browsers are limited-capability containers. If sound, fullscreen, or browser controls feel broken there, ask the tester to retry in Chrome, Brave, Safari, or their normal default browser before classifying the issue as a browser-specific app bug.
- Parked Impeccable follow-ups should wait until the next beta response: Relax confusion triggers `/impeccable clarify Relax phase`; continued visual overload/readability friction triggers `/impeccable distill active session HUD`; another Meta-webview audio/capability failure triggers `/impeccable harden Meta in-app browser state`; first-cycle cue feedback triggers `/impeccable onboard first-run cue`.

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
2. Notice anything that feels rushed, confusing, too quiet, too loud, hard to read, or hard to follow.
3. If you have time, open Session Setup and Practice History.
4. Send back what worked, what felt off, and anything you would change first.

## Next Tester Prompt

Use this for the next clean beta pass after the May 23 HUD/readability, phase-crossfade, completion-copy, Meta-browser, and first-session setup-gate polish:

```text
Could you try the default 3-minute session first, without opening any settings?

I am especially curious about four things:
- Did Relax make sense, or did it interrupt the rhythm?
- Was the phase text easy to read over the circle?
- Did phase changes feel smooth or jarring?
- Did you miss having settings before the first run, or was it better to start with fewer choices?

After that, if you want, try another session or look around and tell me anything that felt confusing, too quiet, too bright, hard to follow, or worth changing first.
```

## Meta In-App Browser Follow-Up

Use this when a tester opens Exhale from Facebook or Messenger:

```text
When you tapped the menu in Facebook or Messenger, did you see an option like Open in browser, Open in Chrome, Open in Brave, or Open in Safari, or was that option missing entirely?
```

If they report sound, fullscreen, or display issues inside Facebook or Messenger, ask them to retry the same link in their normal browser before treating the issue as Chrome, Brave, Safari, or Android/iOS behavior.

## Brand-New User Follow-Up Questions

Use these when asking someone to try Exhale for the first time. Ask them to start with the default 3-minute session before trying Session Setup.

- Could you start breathing without thinking too much?
- Did Settling In feel helpful before the first breath, or did it feel like a delay?
- Did the pace feel rushed, pressuring, or make you gasp/catch up?
- Did Relax help you reset, or did it interrupt the rhythm?
- Did the phase changes feel easy to follow, or did they lag your brain a bit?
- Could you tell what phase was coming next without reading extra text?
- Were the words, contrast, and sounds easy enough to notice without feeling distracting?
- Would you use this again when stressed, tired, or needing to settle?
- What would you change first?

## Session Setup Follow-Up Questions

Use these if the tester opens Session Setup, or if they mention wanting a different pace, sound, or visual feel.

- Did the Session Setup options feel natural, or did they feel like too much?
- Did the pace names and short explanations make sense?
- Was it clear that Sound means background sound?
- Would you change pace, circle size, or background sound before starting a future session?

## Flow Follow-Up Questions

Use these after someone mentions Hold, Relax, rushed transitions, interruption, or wanting a smoother inhale/exhale rhythm, then tries the Flow pace:

- Did Flow feel smoother than the other pace you tried?
- Did removing Hold help?
- Did the tiny pause after Exhale help you reset, or would Flow feel better as inhale/exhale only with no pause at all?
- Did the pause, cue, or circle movement ever feel rushed, pushy, or interruptive?
- Would you choose Flow again, or would you pick a different pace?

## Box Follow-Up Questions

Use these after someone says Relax is confusing, counterproductive, or too much like an unexplained pause, then tries the Box pace:

- Did Box feel clearer than the pace with Relax?
- Did the hold after Exhale feel expected, or did it feel uncomfortable?
- Would you choose Box, Flow, or Steady if you were actually stressed?

## Targeted Follow-Up Queue

Use this as the active beta queue before promoting any new feature work. Keep the tone conversational; do not ask every question if the tester has limited time.

### T-2026-05-23-14: Android Facebook/Brave Rhythm, Transition, And Setup Follow-Up

Goal: separate browser-container issues from core product issues, and check whether the latest Relax clarification/first-cycle cue changes answer the confusion before changing rhythm math.

Priority questions:

- In the real Brave app, did the fullscreen button work differently than it did inside Facebook's in-app browser?
- In Brave proper, did the phase transitions still feel like they popped in, or was that mainly the Facebook preview run?
- After seeing "Breathe naturally" for Relax, does Relax still feel counterproductive, or does the issue shift to the length of the 8-second segment?
- Would Flow feel better for you than Steady, or would Flow need to remove its remaining pause entirely?
- If Session Setup were hidden until after one completed session, would that feel helpful, or would it feel like the app is withholding useful control?
- Would voice guidance be useful if it used a human-recorded voice or simple local audio prompts, or is the concern specifically about AI voice perception?

Decision guardrail: do not change the default Steady durations from this note alone. The actionable near-term signals are transition crossfade, Facebook in-app-browser hardening, completion-duration copy, and Session Setup exposure. Rhythm-duration changes should wait until we know whether the latest Relax clarity and/or Flow answer the same concern.

### T-2026-05-23-18: Clinical Relax-Length And Text Readability Follow-Up

Goal: separate Relax duration/meaning from transition timing, and reproduce the text-over-orb readability issue.

Priority questions:

- Did Relax feel too long because you did not know what to do, because the circle was no longer giving a controlled-breathing task, or both?
- Would a shorter post-exhale hold, like square breathing's exhale-hold, feel clearer than an 8-second natural-breathing Relax?
- Would Flow's shorter Relax pause feel better, or should Relax be removed entirely for your preferred rhythm?
- Which phase color made the overlaid title/instruction hardest to read?
- Was the issue brightness/glare, low contrast against the circle, text shadow blur, or the text sitting directly on top of the phase circle?
- If the phase text sat just above the circle, or had a quieter contrast treatment, would it be easier to read?

Decision guardrail: this is a high-value clinical signal, but do not solve it by simply making text brighter. The tester explicitly said the text was too bright and still did not contrast well against the phase circle. Treat this as placement/backdrop/color-pairing work, not only opacity work.

Implementation note, 2026-05-23: local visual investigation compared dark text with a light shadow against dimmer orb treatments. Dark text improved contrast on the brightest center of the orb but became unreliable against darker orb edges and surrounding canvas. The implemented direction keeps light text, softens HUD opacity, and reduces the orb core brightness, glow, guide rings, flash, and particle pulse.

### T-2026-05-22-13: Settling In, Relax Meaning, And Ramp Clarification

Goal: separate three overlapping signals before changing the app: whether Settling In is too short, whether Relax reads as a breath hold, and whether a progressive/ramping rhythm is still desired after Relax is clearer.

Priority questions:

- When you said Settling In should be "at least 5 breaths," did you mean literally five full guided breaths, or more generally that you wanted more time to settle before the first prompt?
- Would something shorter, like 15-25 seconds, have felt long enough to arrive before the first Inhale?
- When Relax appeared, did it feel like the app wanted you to hold your breath, or like it was giving you room to breathe naturally?
- If Relax said or implied "breathe naturally" more clearly, would you still want the session to build up gradually?
- When you said "build up to the 8 second pause," did you mean the first few cycles should be shorter and grow into the full rhythm, or that the whole session should keep escalating from short to long?
- Did you only try the default Steady pace, or did you also try Soft, Box, or Flow?

Decision guardrail: do not implement longer Settling In, progressive/ramping rhythms, or a Relax rename from this signal alone. Use the answers to decide whether the next experiment is first-cycle Relax clarity, a pre-start sequence preview, a longer/active settle-in shape, or a scoped ramp concept.

### T-2026-05-21-12: First-Cycle Sequence Preview

Goal: check whether Relax confusion was caused by the phase appearing unexpectedly rather than by the word Relax itself.

Priority questions:

- Would a tiny first-session preview like `Inhale -> Hold -> Exhale -> Relax` have helped, or would it make the app feel too instructional?
- If Relax had briefly said "Breathe naturally" the first time only, would that have answered your question without adding too much text?
- Was the audio too quiet because of device volume, browser behavior, or because the default Air sound itself felt too thin?

Decision guardrail: if this tester and T-2026-05-22-13 both prefer a preview/first-cycle clarification, sketch that before changing rhythm durations.

### Flow Validation: Rest/Hold-Friction Testers

Goal: decide whether Flow should stay 4-0-6-2 or be tested as inhale/exhale only.

Ask T-2026-05-19-03, T-2026-05-19-05, T-2026-05-19-06, and T-2026-05-19-07 to try Flow if they are willing.

Priority questions:

- Did Flow feel smoother than Steady, Soft, or Box?
- Did removing Hold help?
- Did the tiny pause after Exhale help you reset, or would Flow feel better as inhale/exhale only with no pause at all?
- Did the pause, cue, or circle movement ever feel rushed, pushy, or interruptive?
- Would you choose Flow again?

Decision guardrail: if one independent tester repeats T-2026-05-19-08's "take out the pause" signal, test a Flow 4-0-6-0 variant before adding copy or cue complexity.

### Rhythm-Fit Recheck: Original Pace-Concern Testers

Goal: learn whether the existing four paces already cover the most important comfort needs.

Ask T-2026-05-18-01 and T-2026-05-19-02 through T-2026-05-19-05 to compare Steady with Soft and/or Box if they are willing.

Priority questions:

- Did Soft feel easier, too fast, or better matched to your natural breathing?
- Did Box feel useful, too structured, or clearer than the pace with Relax?
- Did any rhythm make you gasp, catch up, strain, or feel pressure to perform?
- Which rhythm would you choose if you were actually stressed or tired?
- Would more explanation before the first cycle have helped, or was the rhythm itself the issue?

## Transition Cue Diagnostic

Use this only if someone says phase changes felt weird, hard to follow, pushy, or visually noisy but cannot easily explain why:

- Did the color lead or soft pre-cue make the phase changes easier to follow, or did they add noise?

## Practice History And Sync Testing

Use these when a tester is willing to do functionality testing after at least one breathing session:

- After one session, open Practice History. Did the session count and history look right?
- Try Backup & Sync with Google or email code, whichever feels comfortable.
- Check the same synced history on phone and computer, or in a second browser.
- Did practice history, timer length, circle size, background sound, and pace carry over correctly?
- If anything breaks, send a screenshot or copy any visible console error text from Chrome DevTools.

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

### 2026-06-04, Owner Product Feedback, Replace Full With Box

#### Session

- Tester ID: Owner / app designer
- Follow-up OK: Yes
- Source: Product owner reflection after Flow/Relax beta feedback
- Date: 2026-06-04
- Environment: Local/product review
- Route tested: Session rhythm experience
- Rhythm: Flow felt better; Full proposed for replacement

#### Friction

- Relax remains cognitively confusing even for the app designer. This is a stronger signal than a single tester preference because the person who designed the model still has to interpret what Relax asks the body to do.
- Flow feels better, which reinforces that reducing or clarifying the post-exhale beat improves the experience.
- A post-exhale Hold is easier to anticipate because the user is already prepared for a clear hold cue.
- The remaining uncertainty is personal preference versus broader usability, but the accumulated tester feedback now supports an experiment with a familiar structured preset.

#### Actionable Recommendations

1. **Implemented 2026-06-04: replace Full with Box.** Box uses 4-4-4-4 and labels the fourth beat as Hold after Exhale, avoiding another Relax beat.
2. Keep Steady as the default for now. This change replaces the secondary Full preset, not the first-run rhythm.
3. Ask the next rhythm-sensitive tester whether Box feels clearer than Full/Relax, and whether they would choose Box, Flow, or Steady when actually stressed.

#### Open Questions

1. Does Box feel clearer than the retired Full/Relax shape?
2. Does the post-exhale Hold feel calm and expected, or too restrictive for anxious users?
3. Does Flow still feel better than Box for people who dislike pauses entirely?

### 2026-05-27, T-2026-05-23-14, Android Follow-Up, Meta Hint, Cross-Browser Behavior, Pace Still Feels Too Fast

#### Session

- Tester ID: T-2026-05-23-14 (Ryan, returning tester; original entry 2026-05-23)
- Follow-up OK: Yes (provided this follow-up unprompted)
- Source: Same Android tester who first reported on 2026-05-23
- Date: 2026-05-27
- Environment: Production
- Devices/Browsers tested in this round: (a) Facebook in-app browser on Android (Galaxy S26 Ultra), (b) Messenger in-app browser on Android, (c) Brave mobile, (d) Microsoft Edge on Windows, (e) Google Chrome on Windows
- Route tested: Home, session, multiple session lengths
- Session length: Multiple
- Rhythm: Steady (default) was the focus
- Sound choice: Not specified
- Circle Size: Not specified; the earlier 2026-05-23 screenshot showed an oversized orb in Facebook in-app browser, see Friction
- Signal class: **Trusted returning tester with cross-platform discipline.** Tested the same build in five environments before reporting. Strongest evidence we have for what is browser-container vs core product.

#### What Worked

- Meta in-app browser hint: tester confirmed it appears (in-session, not on the home screen) and is present.
- Three-dot menu on Android Facebook and Messenger in-app browsers does expose an `Open in external browser` option. The tester could escape to a real browser.
- Aside from fullscreen, Facebook and Brave mobile behaved largely the same for performance and core breathing function.
- Microsoft Edge and Google Chrome on Windows: tester explicitly said the build appears to function perfectly. Multiple session lengths and multiple sections of the site tested with no formatting or layout issues.
- Tester explicitly approved hiding Session Setup for brand-new users: "I did see the settings thing, and I think that was a wise move."
- General visual verdict: "the site is simple and well formatted and pleasing to the eyes."
- Tester acknowledged that some Facebook-in-app limitations are inherent to that browser container and may not be designable around.

#### Friction

- **Bug, Facebook in-app browser only:** "The breathing bubble is too big for the screen in Facebook mobile browser." A previous screenshot from this tester confirmed the orb visibly overflowing the visible canvas inside Facebook's in-app browser. The cause is likely Facebook's top bar compressing the visible viewport while `h-screen` / `100vh` still resolves to the un-compressed value. The orb is centered against the full height, so the bottom edge intrudes into the compressed area. Did not reproduce in Brave proper.
- Meta browser hint copy: tester proposed `click 3 dots in top right to open in browser for enhanced sound and fullscreen`. The current copy is `Tap menu to open in browser for sound or fullscreen`. Tester also suggested making the font smaller if necessary. The "enhanced" framing is positive rather than apologetic; the "3 dots in top right" is more directive but more Android-specific.
- Facebook in-app browser readability is worse than Brave because Facebook adds a large top bar that compresses screen height (browser-container limitation, not an app bug).
- **Pace still feels too fast on the latest build, even on Steady (default).** "I did notice some adjustments to the timing of the breathing aspect but I still feel it's got work to do." This is on the new Steady 4-4-6-4 (revised 2026-05-26); tester is reporting it as still too fast.
- **Relax still feels like an unnecessary interruption with no benefit.** Tester is consistent with his 2026-05-23 framing on this. Shortening Steady Relax from 8s to 4s did not resolve the objection.

#### Accessibility Notes

- Strong cross-browser evidence that the desktop experience is solid. The remaining issues cluster around the Facebook in-app browser and the rhythm itself.
- The orb-overflow report is the first concrete in-app rendering bug since the 2026-05-23 round; previously the only Meta-browser issue was fullscreen, which is now handled by hide+hint.

#### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other: Mixed positive. Strong on "simple, well formatted, pleasing to the eyes." Rushed on the active rhythm. Frustrated with Relax. Pragmatic about Facebook-browser limits.
- Notes: This tester clearly distinguishes container-bound limits from product-bound limits, which is unusual and high-credibility.

#### Correlation To Existing Feedback

- Pace-too-fast: this is a NEW signal direction on Steady from this tester. Previously his complaint was transition smoothness ("popped") and Relax counter-productivity. Slowness was not previously his ask. The shortened Steady (4-4-6-4) may have inadvertently pushed past his comfort window. After the 2026-06-04 owner signal, the next reasonable experiment for this tester is Box for structured clarity and Flow for low-interruption breathing — not a default change.
- Relax-as-interruption: reinforces T-2026-05-23-18 and T-2026-05-22-13. Shortening Relax did not address this tester's objection — for him, the issue is the existence of Relax in a controlled-breathing rhythm, not its duration. Flow 4-0-6-2 is the closest current preset; ask if he has tried it.
- Settings-hidden-for-first-run gate: confirmed positive from a tester who previously argued for it (T-2026-05-23-14, 2026-05-23). This validates the first-run setup-gate decision.
- Meta browser hint reach: this tester is the first to confirm the in-session Meta-webview hint actually appears and is read. The escape path through the 3-dot menu also works on his device.

#### Actionable Recommendations

2026-05-27 owner retest note: the first `100dvh` fix solved the vertical Facebook webview issue but not Large mode's horizontal ring clipping on Pixel 9 Pro XL / Android / Facebook app. `src/components/BreathingOrb.tsx` now also clamps the Large canvas radius and guide-ring spacing against the visible canvas width. Local verification at 393x873, 412x915, and 360x640 with Large mode and a faked Facebook in-app user agent left a 14px side gap at Pixel/Facebook widths. Ask the owner/tester to retry the same real Facebook path.

2026-06-04 owner retest note: real Facebook Android on Pixel 9 Pro XL still clipped Large mode by about 20px on the left and right after the 14px clamp. `src/components/BreathingOrb.tsx` now uses a 40px canvas edge margin and compresses the minimum guide-ring gap before shrinking the core orb. Local verification confirmed the simulated Facebook/Pixel path leaves a 40px side gap.

1. **Implemented 2026-05-27: orb-overflow fix.** `src/app/game/page.tsx` now sets `style={{ height: '100dvh' }}` on the game `main`, keeping the existing `h-screen` (`100vh`) classname as a fallback for browsers that do not understand `dvh`. On supporting browsers (Chrome ≥108, Safari ≥15.4, current Android WebView, current Facebook in-app), the main element resolves to the visible viewport height instead of the un-compressed `100vh`, so the orb (centered against the canvas) no longer falls below the browser's top bar. Smoke-tested at 412×700 and 360×640 simulated compressed viewports; orb stays centered with margin on all sides. Real-Facebook validation still owed: ask this tester to retry and confirm.
2. **Implemented 2026-05-27: hint copy refinement.** `Tap menu to open in browser for sound or fullscreen` is now `Tap menu (top-right) for sound and fullscreen`. The positional cue is kept generic (no "3 dots" glyph reference so the copy works on iOS Meta-webviews where the menu icon may differ). Verified visually under a faked Facebook in-app user agent at 412×700.
3. **Do not change Steady's default rhythm based on this tester alone.** His "still too fast" signal directly conflicts with T-2026-05-23-18 (pediatrician) who said she could follow the transitions and time did not need to be extended. Steady is the default for everyone; further changes need a second confirming signal. Instead, ask this tester to try Box and Flow: Box tests whether a clear post-exhale Hold solves Relax confusion, while Flow tests whether he wants fewer pauses entirely.
4. **Park the broader "is Relax structurally wrong for some users" question** until the Flow follow-up loop closes. Two testers (T-2026-05-23-14 and T-2026-05-23-18) now have different reactions to Relax: this tester wants it removed, the pediatrician wants it clearer. Flow already removes most of it. Wait for a Flow trial from this tester before promoting a no-Relax variant to implementation.

#### Open Questions

0. Does Large Circle Size now fit on the same Pixel 9 Pro XL / Android / Facebook-app path, or does the native Facebook header still compress the webview differently from the simulated viewport?

1. Has the tester tried Box (4-4-4-4) or Flow (4-0-6-2) yet, or only Steady? "Still too fast" on Steady combined with "Relax is bad" is the exact phenotype Box and Flow are meant to separate. If he has not tried them, the next ask is one Box session and one Flow session.
2. What does the Facebook in-app orb-overflow look like with the small Circle Size? If the bug only appears at L/M, the safety fallback may be capping max orb radius against the available viewport. If it appears at S too, the root cause is the viewport-height computation, not orb sizing.
3. Is the proposed Meta-browser hint copy "enhanced sound and fullscreen" actually clearer to first-time testers, or only to a returning tester who already knows what the missing capabilities are? A fresh tester read on the hint copy is the right validator.
4. Should the Meta-webview detection also serve a one-time onboarding hint, or only the in-session hint? Currently only in-session; the tester originally expected to see it on the home screen.

### 2026-05-25, T-2026-05-25-19, AI Software Developer, Sign-In Discoverability After Session Loss

#### Session

- Tester ID: T-2026-05-25-19
- Follow-up OK: Unknown
- Source: Project owner network, AI software developer
- Date: Reported 2026-05-25; tester likely used an earlier build before current session-handling and OAuth changes shipped
- Environment: Production assumed
- Device: Unknown
- Browser: Unknown
- Route tested: Home, attempted Practice History
- Session length: Unknown
- Rhythm: Unknown
- Sound choice: Unknown
- Circle Size: Unknown
- Signal class: **Discoverability defect.** Returning synced user could not find the OAuth/sign-in entry point because the Practice History link is hidden until a local completed session exists. Project owner notes tester likely saw an earlier build; possible token-refresh contribution was hardened defensively this session.

#### What Worked

- Tester reached home and recognized the app.

#### Friction

- After their Supabase session had been lost (likely token refresh failure or cleared site data), the home page treated them as a first-time visitor, which hides the Practice History link.
- With Practice History hidden, there was no visible path back to OAuth or email-code sign-in. Without knowing to navigate to `/stats` directly, the tester had no way to restore their synced history.

#### Accessibility Notes

- The "hide Practice History until first local session" rule was added on 2026-05-19 to reduce first-decision load (Impeccable critique 36/40), but it combines badly with the returning-synced-user case: a user who legitimately has cloud history is treated as a brand-new visitor.

#### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other: Confusing, felt locked out of own data.

#### Correlation To Existing Feedback

- First report of session-loss friction. No prior tester signal on this specifically.
- Adjacent to OAuth setup completion (2026-05-20): the OAuth path works for first-time sign-in, but the post-session-loss recovery path was incomplete.

#### Actionable Recommendations (implemented 2026-05-25)

1. Hardened auth bootstrap and `refreshUser` handling in `src/lib/auth.tsx`: only fall back to anonymous on explicit 401/403 session invalidation; preserve cached session on transient (network/5xx) errors. This is the most plausible root cause for a "session expired" feel caused by a momentary network blip during page load.
2. Made the Supabase client's auth config explicit in `src/lib/supabase.ts` (`persistSession`, `autoRefreshToken`, `detectSessionInUrl` all true) so persistence intent is stated rather than implied.
3. Added a quiet sign-in link to the shared `PolicyFooter`, visible on home, session complete, and stats. Returning synced users always have a path to sign in regardless of local session count.
4. Did not add a sign-in button on home itself; that would conflict with the "Home is never auth-gated" rule in CLAUDE.md. Footer placement keeps the entry point discoverable without making the first decision feel account-related.
5. Refined 2026-05-26: the footer link is now auth-aware. It reads `Signed In` when the user is signed in (`ready && !isAnonymous`) and `Sign In to Sync` otherwise, and both point to `/stats#sync` so signed-in users land at the Backup & Sync block without re-signing in. The Backup & Sync block on `/stats` has `id="sync"` and `scroll-mt-6` for clean fragment scrolling.

#### Open Questions

1. Confirm with tester that the current build keeps them signed in across normal use without re-triggering the lockout.
2. Whether the anonymous-state footer label `Sign In to Sync` reads as inviting (recovery path) or coercive (account ask) for fresh visitors, and whether the signed-in `Signed In` label is recognized as a working entry point or read as a status badge. Watch the next first-time and the next returning-synced tester.
3. Whether Supabase project-side refresh-token lifetime needs extending. Client-side defenses are now in place; if synced users still report drop-outs, check the JWT expiry and inactivity-timeout dashboard settings.

### 2026-05-23, T-2026-05-23-18, Pediatrician, Relax Length/Meaning And In-Session Text Readability

#### Session

- Tester ID: T-2026-05-23-18
- Follow-up OK: Yes
- Source: Project owner's sister, pediatrician in Cleveland
- Date: 2026-05-23
- Environment: Production assumed
- Device: Unknown
- Browser: Unknown
- Route tested: Home/session
- Session length: Unknown
- Rhythm: Steady assumed unless follow-up says otherwise
- Sound choice: Unknown
- Circle Size: Unknown
- Signal class: **High-credibility clinical signal.** Medical training plus user-level first-run perception. Weight Relax semantics, duration, and readability feedback heavily, but separate from formal clinical validation.

#### What Worked

- Tester liked the app overall.
- Tester could follow the phase transitions. She did not think time between phases needed to be extended.
- Tester recognized that some square-breathing techniques hold briefly after exhaling, which gives useful domain context for post-exhale pauses.

#### Friction

- Relax phase took the tester out of the moment because the pause felt too long.
- Relax was unclear: tester did not know whether to hold breath, breathe deeply, or breathe normally.
- The phase title and instruction text overlaid on the phase circle was visually problematic: it felt too bright, but also did not contrast well enough against the phase circle color, making it hard to read.

#### Accessibility Notes

- This is the clearest signal so far that the central HUD text treatment itself may fail against some phase colors. Increasing opacity alone is probably the wrong fix because the tester perceived the text as already too bright.
- This cuts against the idea that all transition friction needs longer timing or crossfade. For this tester, transitions were followable; the issue was Relax meaning/length and text readability.
- The square-breathing comment suggests a possible reframing: a short post-exhale hold may be more recognizable than a long natural-breathing Relax for some users.

#### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other: Positive overall, disrupted by Relax and hard-to-read HUD text
- Notes: This is a useful corrective to over-weighting Ryan's transition-crossfade suggestion. Smoother transitions may still help, but they are not the primary barrier for every clinical-signal tester.

#### Correlation To Existing Feedback

- Relax length/meaning reinforces T-2026-05-23-14, T-2026-05-22-13, T-2026-05-21-12, T-2026-05-19-03, and T-2026-05-19-07. The pattern is now strong enough to treat Relax as the core rhythm/semantics issue in the default path.
- "Could follow transitions" partially conflicts with T-2026-05-23-14's jarring-transition signal. Synthesis: do not lengthen time between phases globally. Consider visual/text smoothing, but keep timing changes targeted to Relax/Flow experiments.
- Text over phase circle correlates with T-2026-05-21-10's phase-color clarity concern and the existing high-contrast roadmap candidate. It adds a more specific defect: bright text can still be hard to read when placed over a colored orb.

#### Actionable Recommendations

1. Promote in-session text readability over the active circle to a near-term visual/accessibility task. Explore placement, shadow/backdrop, color pairing, and contrast, not just brighter text.
2. Do not globally extend time between phases based on Ryan's feedback; Sara could follow the transitions. If a crossfade is implemented, keep it visual-only and do not add extra rhythm time.
3. Treat Relax as the highest-priority rhythm/semantics problem. Test whether a shorter post-exhale pause, a no-pause Flow, or clearer "breathe normally" framing works better before changing all durations.
4. Ask this tester to try Flow if willing, with the specific question of whether the shorter pause still interrupts her.

#### Open Questions

1. Which phase color made the text hardest to read?
2. Was the text hard to read because of color contrast, text shadow blur, brightness/glare, or because it sits directly over the orb?
3. Would Relax feel acceptable if it were shorter and named/framed as a post-exhale hold, or should it be natural breathing only outside the controlled rhythm?
4. Would Flow 4-0-6-2 or a no-pause Flow variant solve this tester's Relax objection?

### 2026-05-23, T-2026-05-23-14, Android Facebook/Brave Tester, Browser Container, Transition Smoothness, Relax Meaning, Customization, And Voice

#### Session

- Tester ID: T-2026-05-23-14
- Follow-up OK: Yes
- Source: Android tester reached through a Facebook-shared link
- Date: 2026-05-23
- Environment: Production
- Device: Samsung Galaxy S26 Ultra
- Browser: First run was Facebook in-app preview browser, initially believed to be Brave. Follow-up run was Brave mobile proper.
- Follow-up screenshot: tapping the link from Messenger opened an Android Messenger in-app browser header (`Messenger` over `exhale.guide`) with the home screen rendered correctly. Treat Messenger as the same Meta in-app-browser family for capability checks, not as the user's external browser.
- Route tested: Privacy, Terms, Home/session, Session Complete, Session Setup
- Session length: 3 minutes
- Rhythm: Steady assumed from default screenshots unless follow-up says otherwise
- Sound choice: Unknown; audio button visible in screenshot
- Circle Size: Unknown

#### What Worked

- The app loaded and ran in the Facebook in-app preview browser, despite that being a degraded browser container.
- Privacy and Terms loaded correctly with no visible formatting issues.
- The session was effective enough that the tester reported feeling relaxed.
- The core guidance outside Relax matched familiar clinical breathing-exercise instruction, including the Hold phase.
- Completion quote was strongly positive. Tester called the quote an excellent addition.
- In Brave mobile proper, the interface displayed correctly with no formatting issues.

#### Friction

- The top-right fullscreen button did not work in Facebook's in-app preview browser. Treat this as an in-app-browser capability problem, not a Brave problem.
- Transitions between phases felt jarring and "popped" rather than easing. Tester suggested fading the outgoing instruction and fading in the next instruction around the zero boundary, starting around 1 second.
- Relax remained unclear and potentially counterproductive. Tester understood it might mean returning to normal breathing, but questioned whether interrupting controlled breathing for 8 seconds supports anxiety reduction.
- Tester noticed Exhale appeared one second longer than Inhale. This is correct for Steady (4s Inhale, 6s Exhale), but the user-facing mental model may need to make intentional exhale length feel less surprising.
- Completion screen saying `2:56 of calm` after choosing a 3-minute session felt bizarre and potentially confusing. Tester recommended removing that exact elapsed-time display because the user chose 3 minutes and has no useful reason to inspect the rounded actual duration.
- Session Setup customization created a product-philosophy concern: because Exhale is guided breathing, too much immediate customization may let a first-time user change the guidance before they understand it.
- Tester suggested locking customization behind an account or at least after a full run. Treat account-locking as misaligned with Exhale's anonymous-first stance, but the "after one completed session" part is relevant.
- Tester thought voice narration could be good, but warned that an AI voice could trigger negative perception.

#### Accessibility Notes

- Meta in-app browsers are now confirmed as a real browser-container risk on Android, not only iPhone/Pixel audio speculation. Facebook and Messenger can display the app but still break or degrade capability-dependent controls such as fullscreen.
- The fullscreen control needs environment-aware behavior: hide it, disable it with explanation, or show "Open in browser for fullscreen" when inside Facebook's preview browser.
- Transition smoothness is an accessibility and comprehension issue, not only visual polish. It affects how quickly the user can switch instructions without feeling behind.
- Voice guidance has now repeated across multiple independent family/tester signals. Keep it optional and clearly separate from background sound; do not let it replace the visual-first session.

#### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other: Effective but mechanically jarring
- Notes: The tester was direct and product-minded. They validated the core calming effect while asking for smoother phase handoffs and a clearer rationale for Relax.

#### Correlation To Existing Feedback

- Relax friction reinforces T-2026-05-21-12, T-2026-05-22-13, T-2026-05-19-03, T-2026-05-19-07, and the Internal phase-transition observation. This is no longer a single-copy issue; it is a combined semantics, duration, and transition-shape issue.
- Transition-pop feedback reinforces the open transition-cue question. Earlier work added anticipatory color/audio cues, but this tester is specifically asking for a label/instruction crossfade at the boundary.
- Fullscreen failure correlates with the Facebook in-app-browser audio/open-webview risk already tracked in `docs/OPEN_QUESTIONS.md`.
- Customization concern pushes against T-2026-05-19-07's secondary teen signal that liked customization. The emerging answer is not "more" or "less" customization universally; it is "customization should stay optional and maybe delayed until after first value."
- Voice guidance is now a stronger pattern: T-2026-05-21-11 asked for it, this tester supported it with AI-voice caution, and three additional family testers liked the idea.
- Completion quote praise reinforces T-2026-05-19-01's positive quote feedback, but the exact duration display is a new clarity issue.

#### Actionable Recommendations

1. Near-term: smooth the GameHUD phase label/instruction transition with a true boundary crossfade. The current visual treatment is not being perceived as smooth enough on at least one real Android run.
2. Near-term: detect Facebook's in-app browser and hide or soften the fullscreen affordance there. Provide a quiet hint to open in the external browser for fullscreen/sound reliability rather than presenting a control that fails.
3. Near-term: replace the completion elapsed copy (`2:56 of calm`) with a user-facing selected-duration message, such as `3 minutes complete`, or omit duration entirely and let breath cycles plus quote carry completion.
4. Next: compare the latest Relax copy (`Breathe naturally`) and first-cycle cue with this tester before changing Steady durations. If Relax still feels counterproductive, test reducing/removing Relax in a variant or steering them to Flow.
5. Next: test whether Session Setup should stay visible but framed as optional, or remain hidden until one completed session. Do not lock customization behind an account.
6. Later: promote optional voice guidance to a roadmap candidate. Prefer human-recorded or very restrained system-generated prompts; avoid a prominently "AI voice" framed feature during beta.

#### Open Questions

1. Did the transition-pop feeling persist in Brave mobile proper, or only in Facebook preview?
2. Does the latest first-cycle cue plus `Breathe naturally` solve the Relax meaning problem for this tester?
3. Would this tester prefer Flow over Steady, and if so, current Flow (4-0-6-2) or a no-pause Flow variant (4-0-6-0)?
4. Would hiding Session Setup until after one completed session increase trust or frustrate customization-oriented users?
5. Should Session Complete show only the chosen duration label instead of actual rounded elapsed seconds?

### 2026-05-23, Voice Guidance Pattern From Three Additional Family Testers

#### Session

- Tester IDs: T-2026-05-23-15 through T-2026-05-23-17
- Follow-up OK: Unknown
- Date: 2026-05-23
- Environment, device, browser, route: Unknown
- Signal class: Product direction only. Not enough detail to evaluate implementation shape.

#### What Worked / Requested

- Three separate family testers liked the idea of voice narration.

#### Correlation To Existing Feedback

- Reinforces T-2026-05-21-11's voice-guidance request and T-2026-05-23-14's suggestion that voice could help, with the caveat that AI voice perception may be negative.
- Voice guidance may address the same root problem as first-cycle sequence preview and transition crossfade: some people want to follow without reading the screen continuously.

#### Actionable Recommendations

1. Promote optional voice narration from parked idea to roadmap candidate, but do not build immediately.
2. Define the smallest voice experiment before implementation: spoken phase names only, optional, off by default, probably inside Audio.
3. Test human-recorded voice or a neutral non-AI-branded voice first because AI-voice perception is now an explicit concern.

#### Open Questions

1. Do these testers want voice because they close their eyes, because transitions are hard to follow, or because voice makes the app feel more guided?
2. Should voice replace background sound, layer over it, or be a separate mode?
3. Is voice useful only for the first session, or for every session?

### 2026-05-22, T-2026-05-22-13, First-Time User, Settling-In Length, Relax Clarity, And Progressive Ramp Request

#### Session

- Tester ID: T-2026-05-22-13
- Follow-up OK: Yes
- Source: Project owner's mother, retired ICU nurse and childbirth educator
- Date: 2026-05-22
- Environment: Production assumed
- Device: Samsung S24
- Browser: Unknown
- Route tested: Home/session
- Session length: Unknown
- Rhythm: Steady assumed (default); not explicitly confirmed
- Sound choice: Unknown
- Circle Size: Unknown
- Signal class: **High-credibility clinical signal.** Career spent teaching people to use breath to move from fast/stressed states to calm states (ICU bedside, childbirth education). Weigh pacing-onboarding, transition-clarity, and rhythm-shape feedback heavily; weigh separately from preference signal.

#### Friction

- Settling In felt too short. Verbatim: "I think the settle in should be longer ..at least 5 breaths." Current Settling In is 8 seconds; five Steady breaths would be ~110 seconds, so read the number as directional rather than literal. The underlying signal: 8s is not enough time to actually move someone from "reading the screen" to "in the session," especially for a tester whose professional threshold for "settled" is high.
- Relax phase was unclear on first encounter. Verbatim: "And I wonder about the relax. Is that a pause in breathing." For a clinical breathing educator to ask this directly means the single-word `Breathe` instruction is not carrying enough framing on first exposure. Echoes T-2026-05-21-12's first-cycle Relax uncertainty.
- Asked for a progressive ramp up to the long Relax phase. Verbatim: "And do you think you could build up to the 8 second pause." She is naming Steady's 8-second Relax as "the 8 second pause" — which is itself evidence she has interpreted Relax as a held pause rather than as permission to breathe naturally. The ramp ask and the Relax-clarity ask may share a root cause: if Relax is read as "hold breath for 8 seconds," dropping straight into 8 seconds feels too steep, and ramping up makes sense.

#### Accessibility Notes

- Settling-In signal coheres with prior first-run uncertainty feedback (T-2026-05-21-10 stress; T-2026-05-21-12 wanted a pre-start sequence cue) but is mechanistically different — this tester is asking for more time to physically settle, not more information up front.
- Relax-clarity signal is now multi-tester (T-2026-05-21-12, T-2026-05-22-13). The Rest -> Relax + `Breathe` reframe did not eliminate the first-cycle "what am I supposed to do" question for at least two testers, including one career breathing educator.
- Progressive-ramp signal is the **second independent ask** for a non-isochronous rhythm shape. First was T-2026-05-19-07 (competitive framing, wanted breath/hold/exhale to increase by the last rep). The two asks differ in framing — competitive escalation vs. clinical "build up to the long pause" — but share the underlying shape: rhythm that is not the same every cycle. The handoff's Parked Questions list named "Progressive/ramping rhythms if a second tester independently asks for escalation" as the explicit promotion trigger; that trigger has now fired.

#### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other: Constructive / Clinically observant
- Notes: All three points were framed as suggestions, not complaints. The clinical framing matters: this is the kind of tester who has watched many people transition from fast to calm breathing under real stress, including in childbirth where the breath ramp is part of the curriculum.

#### Actionable Recommendations

1. Do not immediately lengthen Settling In to a fixed multi-breath duration. Watch for one more independent signal that 8s is insufficient before changing the default. Worth thinking about whether the better intervention is a longer Settling In or a different settle-in shape (for example, a guided first breath the user can follow during Settling In, which would also address T-2026-05-21-12's pre-start sequence preview ask).
2. Treat the Relax-clarity signal as enough to actively design a first-cycle clarification, not enough to rename Relax. Possible directions: a one-time first-cycle instruction expansion (e.g., "Breathe naturally" only on cycle 1); a slightly different instruction word that reads less ambiguous; or the pre-start sequence cue from T-2026-05-21-12. Defer choice until at least one option is sketched against the no-text / quiet design constraint.
3. Promote progressive/ramping rhythms from Parked to an actively-considered Open Question in `docs/OPEN_QUESTIONS.md`. Surface the design tension with the locked-at-start invariant before any implementation.
4. Park "build up to 8 seconds" as also potentially a Relax-framing problem, not only a ramp ask. If the next iteration of Relax clarity lands well (whatever shape that takes), re-ask this tester whether she still wants a ramp, or whether the long Relax stops feeling like a held pause she needs to acclimate to.

#### Open Questions

1. Is "5 breaths" of Settling In a literal ask, or a way of saying "give me a real pre-session settle"? Follow-up: would something between 15-25 seconds have felt sufficient?
2. Did the tester try only Steady, or also Soft / Box / Flow? The "8 second pause" wording maps cleanly to Steady's old 8s Relax; Box now tests whether a clear post-exhale Hold resolves that confusion.
3. Would a one-time, first-session-only "What's about to happen" preview reduce both Settling-In-too-short and Relax-unclear signals at once, without becoming an instructional onboarding gate?
4. Does the clinical-observer pattern (knows breathwork deeply, seeing this specific guided flow for the first time) call for different copy than a true first-time-breather pattern, or do both populations want the same clarifications?

### 2026-05-21, T-2026-05-21-12, First-Time User, Audio Immersion And Relax Clarity

#### Session

- Tester ID: T-2026-05-21-12
- Follow-up OK: Yes, partial follow-up received
- Date: 2026-05-21
- Environment: Production assumed
- Device: Unknown
- Browser: Unknown
- Route tested: Home/session
- Session length: Unknown
- Rhythm: Steady assumed
- Sound choice: Unknown; tester did not think they picked a sound setting
- Circle Size: Unknown

#### What Worked

- Tester heard the audio and said it was pretty good without voice guidance.
- Keeping eyes open gave the tester something to focus on, suggesting the visual-first session model worked for this user.
- Tester figured out Relax after the next cycle and later clarified that the short Relax wording was good; the issue was that Relax appeared unexpectedly.

#### Friction

- Audio felt pretty quiet and could feel fuller/richer, but not necessarily nature-like.
- Relax caused first-cycle uncertainty: when Relax appeared, the tester was unsure whether they were supposed to breathe because they did not see that phase coming.
- Tester thought a tiny pre-start cycle cue could help and responded positively to the idea of each word in `Inhale -> Hold -> Exhale -> Relax` appearing one at a time.

#### Accessibility Notes

- This is a first-run sequence-preview signal, not a clear request for voice guidance or a Relax renaming. The tester explicitly said the session was pretty good without voice guidance and later said the short Relax wording was good.
- The audio signal points toward sound presence/richness and default volume perception rather than mobile audio failure.

#### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other: Mostly constructive; briefly confusing at Relax
- Notes: The tester recovered after one cycle and did not reject the word Relax, so treat this as first-cycle sequence-preview feedback rather than evidence that Relax itself failed.

#### Actionable Recommendations

1. Do not build yet. Wait for the remaining follow-up answers before promoting a pre-start sequence cue.
2. If this repeats, consider a first-session-only, non-blocking animated sequence cue before the exercise starts.
3. Keep voice guidance parked; this tester did not need it.
4. Track whether "more immersive" audio means louder default, richer synthesis, or a different sound palette expectation.

#### Open Questions

1. Would a first-session-only sequence cue feel helpful, or would it make the app feel more instructional?
2. Was the audio too quiet because of device/browser volume, default Air texture, or the selected sound setting?

### 2026-05-21, T-2026-05-21-11, First-Time User, Voice Guidance Request

#### Session

- Tester ID: T-2026-05-21-11
- Follow-up OK: Unknown
- Date: 2026-05-21
- Environment: Production assumed
- Device: Unknown
- Browser: Unknown
- Route tested: Home/session
- Session length: Unknown
- Rhythm: Unknown
- Sound choice: Unknown
- Circle Size: Unknown

#### What Worked

- Tester understood the visual-guidance concept and suggested an additional modality rather than rejecting the core experience.

#### Friction

- Tester wondered whether Exhale could include a voice to guide the breathing along with the visual.

#### Accessibility Notes

- Voice guidance could help users who struggle to track the visual orb, phase colors, or upcoming phase transitions.
- Voice guidance could also help users who cannot or do not want to stare at the screen during the session.
- Voice guidance depends on the same mobile/in-app-browser audio reliability questions now being tracked separately.

#### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other: Constructive / Curious
- Notes: Treat as a modality/accessibility suggestion, not as evidence that the current visual system failed for this tester.

#### Actionable Recommendations

1. Park optional voice guidance as an open product question.
2. If implemented later, keep it optional and off by default unless repeated feedback shows voice is needed for first-run success.
3. Consider lower-risk variants first: short spoken phase names only, spoken transition prompts, or a separate voice-guided mode.

#### Open Questions

1. Would optional voice guidance reduce phase uncertainty, or would it make Exhale feel less quiet/minimal?
2. Should voice guidance be a background-sound option, a separate toggle, or a dedicated guided mode?
3. Can voice guidance work reliably in mobile browsers and Facebook's in-app browser?

### 2026-05-21, T-2026-05-21-10, First-Time User, Transition-Cue Uncertainty

#### Session

- Tester ID: T-2026-05-21-10
- Follow-up OK: Unknown
- Date: 2026-05-21
- Environment: Production assumed
- Device: iPhone 14 reported in follow-up
- Browser: Facebook in-app browser
- Route tested: Home/session
- Session length: Unknown
- Rhythm: Unknown
- Sound choice: Unknown
- Circle Size: Unknown

#### What Worked

- Tester engaged enough to give concrete product-level feedback about first-run clarity and phase signaling.
- The visual orb model was legible enough for the tester to reason about how expanding/morphing shapes could communicate the current and upcoming phase.

#### Friction

- Brand-new-user uncertainty about the next phase caused stress and prevented the tester from completing the process.
- Existing phase colors felt too similar to reliably distinguish transitions.
- Existing cues did not sufficiently communicate that a phase change was imminent, especially the move toward Exhale.
- Tester suggested an optional tutorial for brand-new users.
- Follow-up answer to "Could you tell what phase was coming next without reading extra text?": no, not at all.
- Audio did not work at all for this tester on iPhone 14.
- Tester opened Exhale by tapping the project owner's Facebook post link. Facebook kept the page inside its built-in in-app browser rather than opening the user's default browser. The iPhone silent switch was not on.

#### Accessibility Notes

- Distinguishing phases by color alone may not be robust enough. Consider redundant cues such as shape, motion, or stronger state-specific visual behavior.
- If a cue is added, it should clarify the next phase without competing with the central instruction text or recreating the removed `Next [phase]` HUD problem.
- Facebook in-app browser audio is a live QA risk across mobile platforms. Need to distinguish Facebook iOS, Facebook Android, Safari/Chrome, silent switch or system mute state, volume, autoplay policy, and whether the user tapped Begin/sound controls.

#### Emotional Tone

- Calm / Clear / Rushed / Confusing / Overstimulating / Other: Confusing / Stressful
- Notes: The key phrase to preserve is that uncertainty caused stress and inability to complete the process. This is stronger than a simple preference complaint.

#### Actionable Recommendations

1. Keep optional tutorial/onboarding as an open question, but avoid making first-run feel instructional or account-like.
2. Revisit phase cue distinctness. Candidate direction: each phase has a slightly more distinctive color/shape/motion signature while preserving the center orb as the primary timing anchor.
3. Explore whether the last second before a phase change can subtly morph toward the next phase through color or shape, especially before Exhale, without adding text.
4. Add this tester's iPhone 14 / Facebook in-app browser audio report to the sound QA queue rather than treating sound as fully validated. The project owner has also personally seen similar behavior in Facebook's in-app browser on Google Pixel.

#### Open Questions

1. Do brand-new users need an optional tutorial, or can the in-session cues become self-explanatory enough?
2. Are current phase colors too similar for first-time users?
3. Should the orb itself communicate phase transitions through shape/motion changes, not only color and the outer guide line?
4. Does audio fail specifically in Facebook's in-app browser on iPhone/Android, while working in Safari/Chrome?

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
2. This was the first product signal for guided ramp/escalation instead of only steady patterns. As of T-2026-05-22-13, it has a second independent signal and is promoted to an active open question, but still not a build task.
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
