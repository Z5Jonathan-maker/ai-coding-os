---
name: feedback-dosecraft-canonical-repo
description: "DoseCraft canonical path is ~/code/projects/dosecraft (not ~/DoseCraft); the latter is a stale orphan clone and any work landed there is wrong-repo."
metadata:
  type: feedback
  originSessionId: 4b3b19d5-e602-41f6-b59d-cf970dc42e03
---
DoseCraft work belongs in **`~/code/projects/dosecraft`**, NOT `~/DoseCraft`. Both clones push to the same GitHub remote (`Z5Jonathan-maker/dosecraft`, case-insensitive resolution) but `~/DoseCraft` is an **abandoned orphan clone**:

- `~/DoseCraft` was 58 commits behind origin/main on 2026-05-16 with 12+ local-only commits that have never been pushed (coach mobile a11y cycles, audit-findings backlog work, etc.).
- `~/code/projects/dosecraft` IS the live working tree — that's where the active dev happens (paths/curriculum system, gumroad storefront, IG bot, landing-page conversion levers, drip emails).
- The two histories have diverged. A commit made in `~/DoseCraft` cannot be pushed cleanly — it would be rejected as non-fast-forward.

**Why:** User confirmed on 2026-05-16 "Disregard it, old repo, old everything" when shown the divergence. Per memory [[project-aurex]] and other project memories, the established convention is `~/code/projects/<slug>` for all live development.

**How to apply:**
- ANY DoseCraft `cd` / `git` / `Read` / `Write` should target `~/code/projects/dosecraft` unless the user explicitly says otherwise.
- If memory entries reference `~/DoseCraft` (e.g. [[project-dosecraft-testerarmy]], [[project-dosecraft-apple-typography]], [[feedback-codemagic-yaml-security-issue]]), TREAT those file paths as outdated — re-resolve under `~/code/projects/dosecraft/` and verify before acting.
- Before any DoseCraft commit, run `git remote -v` + `git status --short --branch` to confirm you're not on a stale clone (ahead/behind count exposes drift).
- Active dev surface markers in `~/code/projects/dosecraft`: `apps/{web,api,landing,mobile}`, `scripts/paths/`, `instagram/`, `apps/web/content/paths/`.
