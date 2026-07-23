---
name: feedback-vps-comms-git-mailbox
description: "iMac↔VPS Claude comms = the ops/inbox git mailbox, not manual copy-paste"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: bbebfc06-e8d6-4f7a-8224-4abe435df6ac
  modified: 2026-07-23T17:09:58.771Z
---

To hand a task to the VPS Claude (the NinjaTrader/CrossTrade VPS reached via the mym-autotrader repo sync), DO NOT copy-paste a brief into the VPS's VS Code Claude session. Use the git-synced mailbox in `~/code/projects/mym-autotrader`:

- Write `ops/inbox/vps/NNN-slug.md` (next free NNN, one concern per file) with frontmatter `task/mode/status/created` + the task body written as a normal prompt to VPS Claude. Commit + push.
- The VPS sync loop (`ops/vps-sync/vps_sync.ps1`) pulls every ~5 min and phone-notifies on new tasks. Read results from `ops/outbox/vps/<slug>-result.md` (syncs back on the next pull).
- `ops/inbox/imac/` is the reverse direction (tasks FOR the iMac from the VPS).

**Why:** the mailbox already existed as the designed channel but was underused; adopted 2026-07-23 as the standard, replacing manual paste.

**How to apply:** `mode: read-only` → VPS Claude may process autonomously (fully hands-off). `mode: needs-approval` (anything that recompiles/deploys/enables/flattens/touches a funded account/edits live code) → sits pending until the founder gives an explicit in-session "go" on THAT task on the VPS side — a deliberate money-safety gate, never auto-fired. Completing side writes the outbox result, flips `status: done`, commits, pushes.

Related: [[project-mym-vps-file-bridge]], [[reference-mym-execution-fidelity]].
