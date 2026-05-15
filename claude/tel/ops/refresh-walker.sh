#!/usr/bin/env bash
# TEL refresh walker — periodic auto-fetch across TEL-policy services.
#
# Inspired by tinyhumansai/openhuman's 20-min auto-fetch pattern: walk
# every configured service, pull fresh data into a local cache, so the
# next prompt has "tomorrow's context this morning" without doing the
# fetch inside the conversation.
#
# Reads ~/.claude/tel/refresh.yaml (per-service config). Writes per-service
# cache files to ~/.claude/state/tel-refresh/<service>.json with timestamps.
# Skill code can read these caches when injecting context into prompts.
#
# This walker fires nothing by default — `refresh.yaml` must exist and
# enumerate {service, action, args} entries to opt in. Empty = no-op.

set -euo pipefail

CONFIG="${TEL_REFRESH_CONFIG:-$HOME/.claude/tel/refresh.yaml}"
CACHE_DIR="${TEL_REFRESH_CACHE:-$HOME/.claude/state/tel-refresh}"
TEL_CALL="$HOME/.claude/tel/client/tel-call.sh"
LOG="${TEL_REFRESH_LOG:-$HOME/Library/Logs/tel-refresh.log}"

mkdir -p "$CACHE_DIR" "$(dirname "$LOG")"

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
log() { echo "[$(ts)] $*" >>"$LOG"; }

if [ ! -f "$CONFIG" ]; then
  log "skip: no config at $CONFIG (copy refresh.yaml.example to opt in)"
  exit 0
fi

if [ ! -x "$TEL_CALL" ]; then
  log "skip: tel-call.sh not executable at $TEL_CALL"
  exit 0
fi

# Parse YAML entries. Minimal parser — expects entries shaped as:
#   - service: gmail
#     action: search_threads
#     args: '{"q": "is:unread", "maxResults": 10}'
# Lines starting with '#' are comments; blank lines ignored.
python3 - "$CONFIG" <<'PY' >"$CACHE_DIR/.entries.tmp"
import sys, yaml, json
try:
    with open(sys.argv[1]) as f:
        cfg = yaml.safe_load(f) or {}
    entries = cfg.get('entries', [])
    print(json.dumps(entries))
except Exception as e:
    print(f"PARSE_ERROR: {e}", file=sys.stderr)
    sys.exit(1)
PY

ENTRIES=$(cat "$CACHE_DIR/.entries.tmp")
rm -f "$CACHE_DIR/.entries.tmp"

if [ -z "$ENTRIES" ] || [ "$ENTRIES" = "[]" ]; then
  log "skip: config has no entries"
  exit 0
fi

# Iterate entries and call TEL for each. Use python3 to safely iterate JSON;
# the bash wrapper only needs to spawn it.
python3 - "$ENTRIES" "$TEL_CALL" "$CACHE_DIR" "$LOG" <<'PY'
import sys, json, subprocess, os
from datetime import datetime, timezone

entries = json.loads(sys.argv[1])
tel_call = sys.argv[2]
cache_dir = sys.argv[3]
log = sys.argv[4]

def lg(msg):
    with open(log, "a") as f:
        f.write(f"[{datetime.now(timezone.utc).isoformat(timespec='seconds')}] {msg}\n")

fired = errors = 0
for i, e in enumerate(entries):
    svc = e.get('service')
    act = e.get('action')
    args = e.get('args', {})
    if not svc or not act:
        lg(f"entry[{i}] skipped: missing service or action")
        errors += 1
        continue
    args_json = json.dumps(args) if isinstance(args, dict) else (args or '{}')
    out_path = os.path.join(cache_dir, f"{svc}-{act}.json")
    try:
        result = subprocess.run(
            [tel_call, svc, act, args_json],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            with open(out_path, 'w') as f:
                f.write(result.stdout)
            lg(f"ok: {svc}.{act} → {out_path} ({len(result.stdout)} bytes)")
            fired += 1
        else:
            lg(f"fail: {svc}.{act} exit={result.returncode} err={result.stderr[:200]}")
            errors += 1
    except subprocess.TimeoutExpired:
        lg(f"timeout: {svc}.{act}")
        errors += 1
    except Exception as ex:
        lg(f"exception: {svc}.{act} {ex}")
        errors += 1

print(f"fired={fired} errors={errors}")
PY

log "walker done"
