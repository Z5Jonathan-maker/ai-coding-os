#!/bin/bash
# Stop hook that catches Claude trying to end the turn with a question
# instead of a decision. Scans the final assistant message (passed via
# transcript_path in the hook input) for question patterns. If the message
# is essentially a punt to the user, blocks the stop and tells Claude to
# pick the most reasonable option and proceed.
#
# Activate the same way as nonstop:
#   touch ~/.claude/hooks/state/no-ask-human.activate
# Deactivate:
#   touch ~/.claude/hooks/state/no-ask-human.deactivate
set -u

STATE_DIR="$HOME/.claude/hooks/state"
mkdir -p "$STATE_DIR"

input=$(cat)

read session_id transcript already_nudged <<<"$(printf '%s' "$input" | python3 -c '
import json, sys
d = json.load(sys.stdin)
print(d.get("session_id","default"), d.get("transcript_path",""), str(d.get("stop_hook_active",False)).lower())
' 2>/dev/null)"

active_file="$STATE_DIR/no-ask-human-${session_id}.active"

if [ -f "$STATE_DIR/no-ask-human.deactivate" ]; then
  rm -f "$STATE_DIR/no-ask-human.deactivate" "$active_file"
  exit 0
fi

if [ -f "$STATE_DIR/no-ask-human.activate" ]; then
  rm -f "$STATE_DIR/no-ask-human.activate"
  : > "$active_file"
fi

[ -f "$active_file" ] || exit 0
[ "${already_nudged:-false}" = "true" ] && exit 0
[ -z "${transcript:-}" ] || [ ! -f "$transcript" ] && exit 0

# Pull the last assistant text from the JSONL transcript.
last_text=$(python3 -c "
import json, sys
text_parts = []
try:
    with open('$transcript') as f:
        for line in f:
            try:
                row = json.loads(line)
            except Exception:
                continue
            if row.get('type') != 'assistant': continue
            msg = row.get('message', {})
            content = msg.get('content', [])
            if isinstance(content, str):
                text_parts = [content]
            elif isinstance(content, list):
                text_parts = [b.get('text','') for b in content if isinstance(b, dict) and b.get('type') == 'text']
except Exception:
    pass
print(''.join(text_parts)[-2000:])
" 2>/dev/null)

[ -z "$last_text" ] && exit 0

# Heuristic: if the message is short (<800 chars) AND contains question
# patterns, treat it as a punt. Long messages with a final question are
# usually a real summary + offer, leave those alone.
verdict=$(printf '%s' "$last_text" | python3 -c "
import sys, re
t = sys.stdin.read().strip()
if len(t) > 800:
    print('ok'); sys.exit()
patterns = [
    r'\bdo you want me to\b',
    r'\bshould i\b',
    r'\bwould you like\b',
    r'\bwhich (option|one|approach) do you',
    r'\b(let me know|tell me) (which|if|whether|how)',
    r'\?\s*$',
    r'\bplease confirm\b',
    r'\bcan you (clarify|confirm)\b',
]
hits = sum(1 for p in patterns if re.search(p, t, re.IGNORECASE))
print('punt' if hits >= 2 or (hits == 1 and len(t) < 300) else 'ok')
" 2>/dev/null)

[ "$verdict" != "punt" ] && exit 0

cat <<'JSON'
{"decision":"block","reason":"[no-ask-human] You ended with a question instead of a decision. The user is AFK. Pick the most reasonable option from what you proposed, state which you picked and why in one sentence, and proceed. Reserve real questions for genuinely irreversible decisions (deploy, delete, send). For everything else: choose, act, log."}
JSON
