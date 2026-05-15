#!/bin/bash
# PostToolUse hook (matcher: Edit|Write|MultiEdit|NotebookEdit) —
# snapshots the working tree to a hidden git ref after every successful
# file-modifying tool call. Lifted from Cline's per-task git shadow
# checkpoint pattern, adapted to be a Claude Code hook + ref-based
# instead of per-task-shadow-repo.
#
# Snapshots = commits on `refs/cc-shadow/<session-id>` linear log.
# Each commit's tree is the FULL working tree (incl. untracked) at
# that moment. Doesn't touch the user's index, working tree, or
# normal branches.
#
# Walk + restore via `cc-rollback`.
#
# Disabled: touch ~/.claude/hooks/state/git-shadow.disable
set -u

STATE_DIR="$HOME/.claude/hooks/state"
mkdir -p "$STATE_DIR"

[ -f "$STATE_DIR/git-shadow.disable" ] && exit 0

input=$(cat)
session_id=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("session_id","default"))' 2>/dev/null \
  || echo default)
cwd=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("cwd",""))' 2>/dev/null)

[ -z "$cwd" ] || [ ! -d "$cwd" ] && exit 0

# Find git repo root (skip if not in a repo)
git_dir=$(git -C "$cwd" rev-parse --git-dir 2>/dev/null)
[ -z "$git_dir" ] && exit 0
repo_root=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null)
[ -z "$repo_root" ] && exit 0

# Skip if working tree is bigger than 500MB (avoid massive snapshots on
# repos with vendored binaries / build outputs not in .gitignore)
if [ "$(du -sm "$repo_root" 2>/dev/null | cut -f1)" -gt 500 ]; then
  exit 0
fi

# Build a tree of the current working state via a separate index file
# (doesn't pollute the user's index)
tmp_index=$(mktemp -t cc-shadow-index.XXXXXX)
trap 'rm -f "$tmp_index"' EXIT

# Seed temp index with the user's actual index so renames/deletions track
if [ -f "$repo_root/.git/index" ]; then
  cp "$repo_root/.git/index" "$tmp_index" 2>/dev/null || true
fi

# Stage everything (incl untracked, respecting .gitignore)
GIT_INDEX_FILE="$tmp_index" git -C "$repo_root" add -A 2>/dev/null

# Write tree
tree=$(GIT_INDEX_FILE="$tmp_index" git -C "$repo_root" write-tree 2>/dev/null)
[ -z "$tree" ] && exit 0

# Get parent (previous shadow commit on this session's ref)
ref="refs/cc-shadow/${session_id}"
parent=$(git -C "$repo_root" rev-parse --verify --quiet "$ref" 2>/dev/null)

# If tree matches parent's tree, nothing changed — skip
if [ -n "$parent" ]; then
  parent_tree=$(git -C "$repo_root" rev-parse "${parent}^{tree}" 2>/dev/null)
  [ "$tree" = "$parent_tree" ] && exit 0
fi

# Build commit
parent_arg=()
[ -n "$parent" ] && parent_arg=(-p "$parent")

ts=$(date '+%Y-%m-%d %H:%M:%S')
commit=$(git -C "$repo_root" commit-tree "$tree" "${parent_arg[@]}" \
  -m "cc-shadow ${ts}" 2>/dev/null)
[ -z "$commit" ] && exit 0

# Update the ref
git -C "$repo_root" update-ref "$ref" "$commit" "${parent:-}" 2>/dev/null \
  || git -C "$repo_root" update-ref "$ref" "$commit" 2>/dev/null

exit 0
