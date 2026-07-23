---
name: project-mym-24-7-hunter-scheduler
description: "2026-07-18: the mym-autotrader discovery engine is now RUNNING 24/7 as a launchd loop. com.jonathan.mym-strategy-hunter (KeepAlive) runs `engine.orchestrate gauntlet` every 15min + monitor stage hourly; com.jonathan.mym-hunter-deadman (StartInterval 900) watches log freshness -> docs/data/hunter-health.json + ntfy. Paper-only by construction. Cycles cost ~15-60min (honest full-tape backtest)."
metadata:
  node_type: memory
  type: project
  originSessionId: 35aa6961-2e1d-4bbc-93f4-b7df230489be
---

**The 24/7 loop is LIVE (installed + started 2026-07-18).** Two launchd jobs, both `.venv`-interpreted, symlinked into `~/Library/LaunchAgents/`:
- `com.jonathan.mym-strategy-hunter` (plist `ops/launchd/`, script `ops/engine-hunter-loop.sh`): `while true: engine.orchestrate gauntlet; every 4th cycle also monitor stage (decay alarms); sleep 900`. KeepAlive+ThrottleInterval 60. Runs the WIRED generator (problem_driven self-learning, [[project-mym-engine-self-learning-live]]).
- `com.jonathan.mym-hunter-deadman` (`ops/hunter_deadman.py`, StartInterval 900): stdlib-only watchdog -- reads `logs/strategy-hunter.log`, writes `docs/data/hunter-health.json` for the HQ dashboard, ntfy on a health transition (KeepAlive can't catch a wedged/crash-looping loop). 45-min stale horizon.

**Money-safety (why starting it autonomously was correct):** paper-only BY CONSTRUCTION -- `engine/orchestrate/safety.py` AST-bans any `service`/`connectors` import, there is NO order path in the engine tree, every terminal is paper (shadow_book / forward-candidate). Funding stays a manual founder gate; the loop can only surface candidates. Founder directive was explicit ("working 24/7 autonomously mining new strategies").

**Manage it:** `launchctl list | grep mym-strategy-hunter` (PID = alive), `tail logs/strategy-hunter.log`, `cat docs/data/hunter-health.json`. Stop: `launchctl unload -w ~/Library/LaunchAgents/com.jonathan.mym-strategy-hunter.plist`. HQ dashboard at `http://127.0.0.1:8770/hq/`.

**NOT auto-enabled (founder-gated):** the nightly databento gap-fill `com.jonathan.mym-tape-gapfill.plist` (recurring PAID -- see [[reference-mym-tape-state-and-cycle-cost]]); repointing the 9 live trade-service launchd jobs off system-py3.9 to .venv (belt-and-suspenders; the actual py3.12 f-string crash is already fixed).
