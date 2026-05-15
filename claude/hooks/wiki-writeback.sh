#!/usr/bin/env bash
# Stop hook: append session-end markers to wiki logs so manual writeback isn't
# required for every session. Cheap — only writes a heartbeat unless explicit
# CC_WIKI_FAILURE or CC_WIKI_OPTIMIZATION env vars were set during the session.
# Real entries (with root cause + fix) are still written by Claude during the
# session via Edit on the log files. This hook captures unprompted heartbeats.
set -u

WIKI="${HOME}/.claude/wiki"
[ -d "$WIKI" ] || exit 0

HEARTBEAT="$WIKI/logs/.session-heartbeat"
mkdir -p "$WIKI/logs"

# Heartbeat: last session timestamp + cwd
{
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) cwd=${PWD}"
} >>"$HEARTBEAT"

# If the session set explicit env vars, append structured entries
if [ -n "${CC_WIKI_FAILURE:-}" ]; then
  cat >>"$WIKI/logs/failure-log.md" <<EOF

## $(date +%Y-%m-%d) · ${CC_WIKI_FAILURE_TITLE:-(untitled)}
$CC_WIKI_FAILURE
EOF
fi

if [ -n "${CC_WIKI_OPTIMIZATION:-}" ]; then
  cat >>"$WIKI/logs/optimization-log.md" <<EOF

## $(date +%Y-%m-%d) · ${CC_WIKI_OPTIMIZATION_TITLE:-(untitled)}
$CC_WIKI_OPTIMIZATION
EOF
fi

# Drain the structured reflection queue written by `cc-reflect`.
# This is the closed-loop path: sessions (and autonomous cycles) push
# JSONL entries during work; the Stop hook flushes them to the wiki logs
# at session end, then truncates the queue.
QUEUE="${HOME}/.claude/state/reflection-queue.jsonl"
if [ -s "$QUEUE" ]; then
  python3 - "$QUEUE" "$WIKI/logs/optimization-log.md" "$WIKI/logs/failure-log.md" <<'PY' || true
import json, sys, os, datetime
queue_path, opt_log, fail_log = sys.argv[1:4]
today = datetime.date.today().isoformat()

opt_buf, fail_buf = [], []
with open(queue_path) as f:
    for line in f:
        line = line.strip()
        if not line: continue
        try:
            e = json.loads(line)
        except Exception:
            continue
        t = e.get("type", "optimization")
        title = e.get("title") or e.get("summary") or "(untitled reflection)"
        body_lines = [f"\n## {today} · {title}"]
        if t == "cycle":
            n = e.get("n", "?")
            kind = e.get("kind", "?")
            depth = e.get("depth", "?")
            regression = e.get("regression", "?")
            body_lines.append(f"- **Cycle:** #{n} ({kind})")
            body_lines.append(f"- **Summary:** {e.get('summary','')}")
            body_lines.append(f"- **Depth:** {depth} · **Regression:** {regression}")
            if e.get("ts"): body_lines.append(f"- **Timestamp:** {e['ts']}")
            opt_buf.append("\n".join(body_lines))
        elif t == "failure":
            body_lines.append(f"- **Root cause:** {e.get('root_cause','')}")
            body_lines.append(f"- **Fix:** {e.get('fix','')}")
            if e.get("ts"): body_lines.append(f"- **Timestamp:** {e['ts']}")
            fail_buf.append("\n".join(body_lines))
        else:  # optimization
            for k in ("before","change","after","why"):
                v = e.get(k)
                if v: body_lines.append(f"- **{k.capitalize()}:** {v}")
            if e.get("ts"): body_lines.append(f"- **Timestamp:** {e['ts']}")
            opt_buf.append("\n".join(body_lines))

if opt_buf:
    with open(opt_log, "a") as f: f.write("\n".join(opt_buf) + "\n")
if fail_buf:
    with open(fail_log, "a") as f: f.write("\n".join(fail_buf) + "\n")

# Truncate the queue only after a successful flush
open(queue_path, "w").close()
PY
fi

# Cap heartbeat at 1000 lines (rotate)
if [ -f "$HEARTBEAT" ] && [ "$(wc -l <"$HEARTBEAT")" -gt 1000 ]; then
  tail -500 "$HEARTBEAT" >"$HEARTBEAT.tmp" && mv "$HEARTBEAT.tmp" "$HEARTBEAT"
fi

exit 0
