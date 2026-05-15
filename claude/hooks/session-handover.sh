#!/bin/bash
# Stop hook: write a compact "checkpoint" markdown to
# ~/.claude/checkpoints/ when the session is about to end. The next
# session's SessionStart hook reads the most recent checkpoint and
# surfaces it as additional context, giving cross-session continuity
# without bloating CLAUDE.md.
#
# Always runs (no opt-in flag) — checkpoints are cheap and the next
# session decides whether they're relevant.
#
# Captures from the transcript:
#   - cwd                          (working directory)
#   - last user prompt             (what was asked)
#   - last 1500 chars of assistant (what was said)
#   - todo state file if present   (~/.claude/hooks/state/*.todos.json)
#   - last 10 tool calls           (tool name + first 80 chars of input)
set -u

CHECKPOINT_DIR="$HOME/.claude/checkpoints"
mkdir -p "$CHECKPOINT_DIR"

input=$(cat)

export _SH_INPUT="$input"
checkpoint=$(
  python3 <<'PY'
import json, os, time
from pathlib import Path

raw = os.environ.get("_SH_INPUT", "")
try:
    d = json.loads(raw)
except Exception:
    raise SystemExit(0)

session_id = d.get("session_id", "default")
cwd = d.get("cwd", "")
transcript = d.get("transcript_path", "")

last_user = ""
last_assistant = ""
recent_tools = []

if transcript and Path(transcript).exists():
    try:
        with open(transcript, encoding="utf-8") as f:
            for line in f:
                try:
                    row = json.loads(line)
                except Exception:
                    continue
                t = row.get("type")
                if t == "user":
                    msg = row.get("message", {})
                    c = msg.get("content", "")
                    if isinstance(c, list):
                        for b in c:
                            if isinstance(b, dict) and b.get("type") == "text":
                                last_user = b.get("text", "")
                    elif isinstance(c, str):
                        last_user = c
                elif t == "assistant":
                    msg = row.get("message", {})
                    c = msg.get("content", [])
                    if isinstance(c, list):
                        text_parts = [b.get("text","") for b in c if isinstance(b, dict) and b.get("type") == "text"]
                        if text_parts:
                            last_assistant = "".join(text_parts)
                        for b in c:
                            if isinstance(b, dict) and b.get("type") == "tool_use":
                                ti = b.get("input", {})
                                summary = json.dumps(ti)[:80]
                                recent_tools.append(f"{b.get('name','?')}: {summary}")
    except Exception:
        pass

recent_tools = recent_tools[-10:]

ts = time.strftime("%Y-%m-%d %H:%M:%S")
slug = time.strftime("%Y%m%d-%H%M%S")
out_path = Path.home() / ".claude" / "checkpoints" / f"{slug}-{session_id[:8]}.md"

body = []
body.append(f"# Session checkpoint — {ts}")
body.append("")
body.append(f"- session_id: `{session_id}`")
body.append(f"- cwd: `{cwd}`")
body.append("")
body.append("## Last user prompt")
body.append("```")
body.append((last_user or "(none captured)")[-1000:])
body.append("```")
body.append("")
body.append("## Last assistant response (tail)")
body.append("```")
body.append((last_assistant or "(none captured)")[-1500:])
body.append("```")
body.append("")
if recent_tools:
    body.append("## Last 10 tool calls")
    for t in recent_tools:
        body.append(f"- {t}")
    body.append("")

out_path.write_text("\n".join(body), encoding="utf-8")

# Trim to last 50 checkpoints to bound disk
ckpts = sorted((Path.home() / ".claude" / "checkpoints").glob("*.md"))
for old in ckpts[:-50]:
    try: old.unlink()
    except Exception: pass

print(str(out_path))
PY
)
unset _SH_INPUT

# Append a record to a rolling index for quick listing
[ -n "$checkpoint" ] && echo "$(date '+%Y-%m-%d %H:%M:%S') $checkpoint" >>"$CHECKPOINT_DIR/.index"

exit 0
