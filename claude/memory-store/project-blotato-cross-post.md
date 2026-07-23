---
name: project-blotato-cross-post
description: "DoseCraft Blotato API cross-post workflow — TikTok + Instagram Reels + YouTube Shorts + X + Threads from one video drop. Waitlist pending. Wrapper + env scaffold ready to flip once access lands."
metadata:
  type: project
  originSessionId: c965723c-215a-44b0-be03-c8a9f39935a1
---
DoseCraft has zero TikTok / YouTube Shorts presence — biggest channel gap per `ASO_STRATEGY.md`. Blotato closes it: post once → distribute to 5+ platforms via API.

**Why:** Manual cross-post burns hours/week. Blotato API + agent-orchestrable Python skill (`grandamenium/blotato-posting`, stdlib-only) plugs into the existing cc-dispatch pattern.

**How to apply:**

1. **Status (2026-05-14):** PAID SERVICE — sign up + pay at blotato.com, no waitlist. (Earlier I misread the `SabrinaRamonov/prompts:join_blotato_waitlist.md` repo file as evidence Blotato was waitlist-gated. User corrected: it's a paid subscription, available immediately.)
2. **Setup:** sign up at blotato.com → pay → grab API key from dashboard → connect each platform (TikTok / IG / YouTube / X / Threads) via OAuth → copy account IDs from Settings → Connected Accounts.
3. **Wire env vars:** populate `BLOTATO_API_KEY` + per-platform account IDs in `~/.claude/.env` (placeholders already scaffolded with comments).
4. **Wrapper:** `~/code/projects/dosecraft/scripts/post-content.sh <video.mp4> "<caption>"` — appends compliance footer automatically, defaults to tiktok+instagram+youtube+x. `--dry-run` to preview, `--platforms` to scope.
5. **Skill code:** clone preserved at `~/code/research/blotato-posting/`. Override location via `BLOTATO_SKILL_DIR` env if relocated.

**Hard constraints (peptide-niche compliance):**

- **Real human content ONLY.** Never use Blotato's AI video-generation templates for DoseCraft. Apple Guideline 1.4.3 + FTC/FDA gray area + the evidence-based brand positioning = AI-generated peptide content is a trust + compliance risk. Use Blotato strictly as a distribution layer for Jonathan-recorded video.
- **Compliance footer is non-optional.** Wrapper always appends "Research use only. Not medical advice." — never bypass.
- **Voice consistency.** Captions should come from mempalace recall of established voice (per [[feedback-path-b-be-bold]] + [[feedback-mentor-corpus-no-attribution]]), not generic AI rewrites.

**Future-cycle integration:**

When access lands, wire cc-dispatch agent flow: launchd watcher on `~/inbox-video/` → cc-dispatch spawns agent → mempalace voice recall → per-platform caption variants → blotato wrapper → work-log entry. Documented in commit `ec6dbe40` on `wip/cycles-08-09-staged`.

**Companion decision:** Hermes Desktop was evaluated same session — verdict was skip (duplicates existing Claude Code capability). Blotato is different — fills a genuine channel gap and plugs into stack rather than competing with it.
