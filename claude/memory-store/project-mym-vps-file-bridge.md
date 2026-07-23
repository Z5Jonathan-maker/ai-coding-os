---
name: project-mym-vps-file-bridge
description: CrossTrade MCP from the iMac writes files directly onto the VPS NT8 — bypasses the VPS git-auth blocker for .cs deploys
metadata: 
  node_type: memory
  type: project
  originSessionId: b28d84dc-00c8-4b24-b841-74673929cd52
---

The VPS clone of mym-autotrader cannot `git pull` (HTTPS auth broken: "could not read Username"; no credential helper on the Windows box). This blocked the 2026-07-08 signal-prefix bundle (PA/PB/PC etc.) from reaching NT8.

**Workaround that works (used 2026-07-08):** the iMac's `crosstrade` MCP bridges into the VPS NT8 directly — `ReadNinjaScriptFile`/`WriteNinjaScriptFile(kind:"strategy", overwrite:true, trigger_compile:false)` read/write `C:\Users\Administrator\Documents\NinjaTrader 8\bin\Custom\Strategies\`. Writes are inert until a native compile (F5 or VPS-side), so mid-market writes are safe.

**Why:** file transfer to the VPS needs no git; the MCP is already authenticated and the compile step is the integrity gate (a corrupted transfer fails loudly at compile, old DLL keeps running).

**How to apply:** for any repo→VPS `.cs` deploy while git auth is broken: (1) verify the VPS copy is byte-equivalent to the repo's last-deployed commit (read via MCP, compare `repo_bytes + line_count` = VPS bytes for LF→CRLF files), (2) write repo HEAD with `trigger_compile:false`, (3) re-read to verify round-trip, (4) let VPS-Claude/human run the native compile outside market hours.

VPS git auth was RESOLVED 2026-07-08 (founder re-logged in) — git pull is again the primary path; the CrossTrade bridge remains the fallback and the only path that writes NT8's live strategy folder directly (a repo pull updates the clone, NOT `Documents\NinjaTrader 8\bin\Custom\` — files still need copying or bridging). See [[project-mym-live-config]].
