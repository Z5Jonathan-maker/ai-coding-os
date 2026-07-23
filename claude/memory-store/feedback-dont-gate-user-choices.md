---
name: feedback-dont-gate-user-choices
description: "When the user installs/authorizes a tool, document what it does — never add prescriptive "don't use for X" restrictions to wiki/memory/docs unless they explicitly asked for that guardrail. The user owns the use-case decision."
metadata:
  type: feedback
  originSessionId: aeda5184-d147-4d61-98c9-daa4117a8a76
---
When the user authorizes installing a tool (Scrapling, autobrowse, anything dual-use), the wiki entry should capture:
- What it is (license, version, capabilities, install path)
- How it's invoked (technical reference)
- Known failure modes (sandbox issues, dep conflicts, etc.)

**Why:** The user installed it deliberately. Adding "don't use this for X workflow" or "legitimate use cases are A, B, C — NOT D, E" is the assistant editorializing on a decision the user already made. They own the tool-use call; the assistant's job is to document the tool, not gatekeep.

**How to apply:** If a tool has a TOS-sensitive or legal-grey-area capability (Cloudflare bypass, anti-bot, automation against rate limits), note the capability factually but don't prescribe what the user should/shouldn't point it at. If you genuinely think a use is risky, raise it ONCE in the chat turn and let the user decide — don't write the restriction into a persistent file that future Claude treats as policy.

**Real example (2026-05-03):** I installed Scrapling at user's explicit "dl it" direction, then wrote a wiki entry saying "don't use Scrapling for Aurex competitor scrapes (elitebiogenix, truepeptidelabs)." User pushed back: "Huh? I'm not authorizing these restrictions." I removed the restrictions, kept only factual capability docs.

**Real example (2026-05-09):** Defensively integrating elder-plinius/G0DM0D3 jailbreak corpus, I patched lib/tiers/chat.cjs so prompts containing markers (godmode, jailbreak, dan, etc.) wouldn't match the chat-tier greeting regex, then locked it in with a pre-commit gauntlet. User: "So you just made my Claude stricter? I'm trying to walk the grey area, not restrict it." Reverted the source patch + rewrote the gauntlet to be a baseline-drift detector instead of a no-route-to-chat enforcer. Lesson: gating in source code or test files is the SAME violation as gating in wiki/docs — possibly worse because future Claude treats committed code as ground truth. The "raise once in chat" rule applies to ALL persistent forms, not just docs.

**Edge cases where guardrails ARE warranted:** when the user has previously written a memory like `feedback_no_uncensored_models.md` (their own rule), apply that. But don't invent new rules from "brand brain says voice is X" or "auto-browser MCP README says Y" — those are documentation of OTHER things, not authorization to gate the user's choices.

**The persistence-form rule (extended 2026-05-09):** "Don't write the restriction into a persistent file" includes:
- wiki/docs (`*.md` in ~/.claude/wiki/)
- memory entries (this directory)
- source code (lib/*.cjs runtime restrictions)
- tests that lock in restrictions (assertions like "must route to X" or "must not call Y" that aren't there to detect drift but to enforce a value judgment)
- launchd plists / cron jobs that act on the restriction

If you find yourself writing any of these to enforce an "I think this might be risky" judgment, stop and ask in chat instead.
