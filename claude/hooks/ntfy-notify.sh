#!/bin/bash
# Stop hook: push a notification to ntfy.sh (or self-hosted ntfy) when
# a turn ends — so you get a phone push if you stepped away.
#
# Disabled by default. Set NTFY_TOPIC in the env to enable. For privacy,
# use a long random topic on ntfy.sh (it's basically a shared secret) or
# point NTFY_URL at a self-hosted ntfy on your tailnet.
#
# Env:
#   NTFY_TOPIC   the topic name (e.g. "cc-imac-x9k4"). Required to fire.
#   NTFY_URL     base URL; defaults to https://ntfy.sh
#   NTFY_PRIORITY  message priority 1-5 (default 3 = default)
#   NTFY_TIMEOUT_S curl timeout (default 5)
#
# To get notifications on iPhone: install ntfy.sh app, subscribe to your
# topic, optionally over Tailscale by pointing NTFY_URL at the self-hosted
# instance (https://github.com/binwiederhier/ntfy).
set -u

[ -z "${NTFY_TOPIC:-}" ] && exit 0

NTFY_URL="${NTFY_URL:-https://ntfy.sh}"
NTFY_PRIORITY="${NTFY_PRIORITY:-3}"
NTFY_TIMEOUT_S="${NTFY_TIMEOUT_S:-5}"

input=$(cat)
export _NTFY_INPUT="$input"

# Build a short summary from the transcript tail.
summary=$(python3 <<'PY'
import json, os
from pathlib import Path
raw = os.environ.get("_NTFY_INPUT", "")
try:
    d = json.loads(raw)
except Exception:
    print(""); raise SystemExit(0)

cwd = d.get("cwd", "")
tp = d.get("transcript_path", "")
last = ""
if tp and Path(tp).exists():
    try:
        with open(tp, encoding="utf-8") as f:
            for line in f:
                try: row = json.loads(line)
                except: continue
                if row.get("type") != "assistant": continue
                msg = row.get("message", {})
                c = msg.get("content", [])
                if isinstance(c, list):
                    parts = [b.get("text","") for b in c if isinstance(b, dict) and b.get("type") == "text"]
                    if parts:
                        last = "".join(parts)
    except Exception:
        pass
last = (last or "").strip().split("\n")[0][:150]
print(f"{cwd}|{last}")
PY
)
unset _NTFY_INPUT

cwd="${summary%%|*}"
last="${summary#*|}"
title="cc-loop: ${cwd##*/}"
body="${last:-Claude finished a turn (no text response).}"

curl -fsSL --max-time "$NTFY_TIMEOUT_S" \
  -H "Title: $title" \
  -H "Priority: $NTFY_PRIORITY" \
  -H "Tags: robot" \
  -d "$body" \
  "${NTFY_URL%/}/${NTFY_TOPIC}" >/dev/null 2>&1 &

exit 0
