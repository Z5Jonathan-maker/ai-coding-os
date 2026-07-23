---
name: project-device-disk-constraint
description: "The iMac is chronically disk-constrained (228GB Data volume, hit 99% / 3.7GB free on 2026-07-22). Founder is actively growing chart/brain data and won't stop, so space is a standing concern. Safe cache-clear playbook + Photos→iCloud Optimize is the durable fix."
metadata:
  node_type: memory
  type: project
  originSessionId: 7910b278-22e3-48b4-add8-a5a46f358d13
  modified: 2026-07-22T07:14:00.000Z
---

**Standing constraint (founder flagged 2026-07-21/22):** "my device is very very limited on space… I don't plan
on stopping adjusting chart data / data for our brain anytime soon… barely scratched the surface." Disk, not RAM,
is the bottleneck — on 2026-07-22 `/System/Volumes/Data` hit **99% (3.7GB free of 228GB)** and swap couldn't grow,
which felt like a RAM/slowness problem but wasn't (RAM was 48% free). Treat "my memory is at 99%" as a DISK issue.

**Safe cache-clear playbook (all regenerable, freed ~9.3GB → 99%→94%):** `~/Library/Caches`, `~/.cache`
(codex-runtimes, huggingface — check contents first, don't nuke re-downloadable ML models blindly), `node_modules`
across `~/code` (`npm install` restores), VS Code caches + `~/Library/Logs`, npm/pip/Homebrew caches, dormant
research venvs (Kronos, TradingAgents). NEVER touch: Pictures, Downloads, project source, active venvs
(mym-autotrader, ClaimPilot).

**Durable fix = Photos→iCloud.** iCloud Photos IS already enabled (signed in as z5jonathan@icloud.com), library is
~12G, but "Optimize Mac Storage" is OFF so full-res originals are kept locally AND in iCloud (redundant). Flipping
Photos → ⌘, → iCloud → **Optimize Mac Storage** evicts local originals (safe, reversible, never deletes — they stay
in iCloud) and progressively frees ~12G. The toggle is safe to drive via UI automation (earlier over-caution about
it was wrong — it's not a file deletion).

**Blocker for scripting the toggle:** VS Code lacks macOS Accessibility permission, and granting it demands a VS
Code relaunch which ends the Claude session — so this step often gets handed to the founder (2 clicks) or a model
with full-Mac control. Given the data-growth trajectory, the real long-term answer is external/archival storage,
not repeated cache clears. See [[reference-mym-tape-state-and-cycle-cost]] (tape data is a major space consumer).
