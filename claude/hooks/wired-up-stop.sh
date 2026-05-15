#!/bin/bash
# Stop hook (opt-in) that blocks the turn from ending if the working tree
# contains source files that aren't imported/referenced anywhere — i.e.
# Claude added orphan code and is about to walk away from it.
#
# Activate per-session by `touch ~/.claude/hooks/state/wired-up.activate`.
# Most useful in code-heavy unattended sessions. Off by default because
# it's noisy in note-taking / config-editing sessions.
#
# Mechanism:
#   1. git diff --name-only HEAD → modified+untracked source files
#   2. For each .ts/.tsx/.js/.jsx/.py/.go/.rs file (skip tests/index/main),
#      grep the rest of the tree for an import or reference to it.
#   3. Files with zero references → block Stop with the list.
set -u

STATE_DIR="$HOME/.claude/hooks/state"
mkdir -p "$STATE_DIR"

input=$(cat)
session_id=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("session_id","default"))' 2>/dev/null \
  || echo default)
already_nudged=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(str(d.get("stop_hook_active",False)).lower())' 2>/dev/null \
  || echo false)
cwd=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("cwd",""))' 2>/dev/null)

active_file="$STATE_DIR/wired-up-${session_id}.active"

if [ -f "$STATE_DIR/wired-up.deactivate" ]; then
  rm -f "$STATE_DIR/wired-up.deactivate" "$active_file"
  exit 0
fi
if [ -f "$STATE_DIR/wired-up.activate" ]; then
  rm -f "$STATE_DIR/wired-up.activate"
  : >"$active_file"
fi

[ -f "$active_file" ] || exit 0
[ "$already_nudged" = "true" ] && exit 0
[ -z "$cwd" ] || [ ! -d "$cwd" ] && exit 0

cd "$cwd" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Collect changed + untracked files (one shot)
files=$(
  {
    git diff --name-only HEAD 2>/dev/null
    git ls-files --others --exclude-standard 2>/dev/null
  } \
    | sort -u
)
[ -z "$files" ] && exit 0

# Filter to source files only; skip obvious entry-points and tests.
filtered=$(printf '%s\n' "$files" | grep -E '\.(ts|tsx|js|jsx|py|go|rs|rb|php|java|kt|swift)$' \
  | grep -vE '(^|/)(test|tests|__tests__|spec|node_modules|dist|build|target|vendor|\.next)/|\.test\.|\.spec\.|/index\.|/main\.|/__init__\.py$|conftest\.py$')
[ -z "$filtered" ] && exit 0

orphans=""
while IFS= read -r f; do
  [ -z "$f" ] || [ ! -f "$f" ] && continue
  base=$(basename "$f")
  stem="${base%.*}"
  # Skip if file is empty or whitespace-only (not really committed code)
  [ ! -s "$f" ] && continue
  # Skip tiny files (< 5 non-blank lines) — likely WIP placeholders
  [ "$(grep -cv '^[[:space:]]*$' "$f")" -lt 5 ] && continue
  # Search for references to either the basename or stem in OTHER files
  refs=$(grep -rEl --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
    --include='*.py' --include='*.go' --include='*.rs' --include='*.rb' --include='*.php' \
    --include='*.java' --include='*.kt' --include='*.swift' \
    -e "['\"\`/]${stem}['\"\`/.]" -e "from .*${stem}" -e "import.*${stem}" \
    . 2>/dev/null | grep -v "^\./${f}$" | head -1)
  if [ -z "$refs" ]; then
    orphans="${orphans}${f}\n"
  fi
done <<<"$filtered"

[ -z "$orphans" ] && exit 0

reason=$(printf 'You added source files that nothing else references:\\n%s\\nWire them in (import, register, render, route) or delete them before stopping. Do not leave orphan code in the tree.' "$(printf '%b' "$orphans" | sed 's|^|  - |')")

# Emit JSON-block decision
python3 -c "import json; print(json.dumps({'decision':'block','reason':'[wired-up] ' + '''$reason'''}))"
