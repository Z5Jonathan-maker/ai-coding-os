#!/bin/bash
# PostToolUse hook: snapshot the working tree to a hidden git ref after
# every successful Edit / Write / MultiEdit / NotebookEdit. Lets you
# rollback ANY single agent step (not just the whole session) via the
# cc-rollback wrapper.
#
# Pattern lifted from Cline (after Phase-2 strategic-fit analysis,
# 2026-04-30). Adapted: Cline maintains a hidden parallel git repo per
# task; we instead use a single hidden ref `refs/cc-shadow/<session>`
# inside the project's existing .git, which avoids parallel-repo
# bookkeeping and keeps the snapshots co-located with the real history.
#
# Per-iteration commits go to the shadow ref, never to the user-visible
# branch. The user's normal `git log` is unchanged. `git log
# refs/cc-shadow/<session>` shows the agent's trail.
#
# Skip rules (no snapshot for):
#   - Repos that are NOT git repos
#   - Tool calls that are clearly read-only (handled at hook-matcher level)
#   - When the working tree has nothing changed since the last shadow tip
#   - When CC_SHADOW_DISABLE=1 is in env
set -u

[ "${CC_SHADOW_DISABLE:-0}" = "1" ] && exit 0

input=$(cat)

# Extract session_id and cwd from hook input
read session_id cwd tool <<<"$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("session_id","default"), d.get("cwd",""), d.get("tool_name",""))' 2>/dev/null)"

[ -z "${cwd:-}" ] || [ ! -d "$cwd" ] && exit 0

# Only snapshot for write-class tools
case "$tool" in
  Edit|Write|MultiEdit|NotebookEdit) ;;
  *) exit 0 ;;
esac

cd "$cwd" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Sanitize session id for ref path
sid="${session_id//[^a-zA-Z0-9-]/_}"
sid="${sid:0:32}"
ref="refs/cc-shadow/${sid}"

# Build a tree from the current index + working changes WITHOUT touching
# the user's index. Pattern:
#   1. Snapshot working tree to a temp index
#   2. Write tree from temp index
#   3. Commit that tree under the shadow ref (parent = previous shadow tip)
TMP_INDEX=$(mktemp -t cc-shadow-idx.XXXXXX)
trap 'rm -f "$TMP_INDEX"' EXIT

# Copy current real index as starting point so untracked-tracked split is preserved
cp "$(git rev-parse --git-dir)/index" "$TMP_INDEX" 2>/dev/null || true

# Stage all current files (including new + modified + deleted) into temp index
GIT_INDEX_FILE="$TMP_INDEX" git add -A 2>/dev/null

# Write the tree
tree=$(GIT_INDEX_FILE="$TMP_INDEX" git write-tree 2>/dev/null)
[ -z "$tree" ] && exit 0

# If the tree is identical to the last shadow tip's tree, skip (no change)
last_commit=$(git rev-parse --verify "$ref" 2>/dev/null || true)
if [ -n "$last_commit" ]; then
  last_tree=$(git rev-parse --verify "${last_commit}^{tree}" 2>/dev/null || true)
  [ "$tree" = "$last_tree" ] && exit 0
fi

# Compose commit message
msg="agent-step ${tool} $(date '+%Y-%m-%d %H:%M:%S') session=${sid:0:8}"

# Commit with parent = previous shadow tip (or no parent if first)
if [ -n "$last_commit" ]; then
  new_commit=$(GIT_AUTHOR_NAME="cc-shadow" GIT_AUTHOR_EMAIL="cc-shadow@local" \
    GIT_COMMITTER_NAME="cc-shadow" GIT_COMMITTER_EMAIL="cc-shadow@local" \
    git commit-tree "$tree" -p "$last_commit" -m "$msg" 2>/dev/null)
else
  new_commit=$(GIT_AUTHOR_NAME="cc-shadow" GIT_AUTHOR_EMAIL="cc-shadow@local" \
    GIT_COMMITTER_NAME="cc-shadow" GIT_COMMITTER_EMAIL="cc-shadow@local" \
    git commit-tree "$tree" -m "$msg" 2>/dev/null)
fi

[ -z "$new_commit" ] && exit 0

git update-ref "$ref" "$new_commit" 2>/dev/null

exit 0
