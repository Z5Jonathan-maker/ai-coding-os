#!/bin/bash
# UserPromptSubmit hook: append a compact environment-details block to
# every user turn. Pre-warms the agent with workspace state so it never
# has to "ask what's the state" before responding.
#
# Pattern lifted from Cline (after Phase-2 strategic-fit analysis,
# 2026-04-30). Adapted: Cline embeds this in the system prompt; we
# inject via UserPromptSubmit hook so it lives in the conversation
# history (compaction-resistant, observable in transcripts) and respects
# our hook-architecture instead of a system-prompt rewrite.
#
# Hard caps:
#   - Total emit < 500 tokens (~2KB). Fail closed if would exceed.
#   - Skip if cwd has no signal (not a git repo, not a project)
#   - Skip if CC_ENV_DISABLE=1 in env
#
# Block format (all sections optional, only emit if signal exists):
#   <env_details>
#   cwd: <path>
#   git: <branch> (<dirty-count> changed) — last commit: <hash> "<msg>"
#   stack: <framework> + <key deps>
#   handoff: <last SESSION-HANDOFF.md updated when, top "next step">
#   mercury: <last activity if daemon running>
#   shadow: <N agent-steps in cc-shadow this session>
#   </env_details>
set -u

[ "${CC_ENV_DISABLE:-0}" = "1" ] && exit 0

input=$(cat)
cwd=$(printf '%s' "$input" | python3 -c \
  'import json,sys; d=json.load(sys.stdin); print(d.get("cwd",""))' 2>/dev/null)
[ -z "$cwd" ] || [ ! -d "$cwd" ] && exit 0

cd "$cwd" 2>/dev/null || exit 0

# Build the block iteratively; bail if signal is too thin
out=""

# Always include cwd (cheap signal)
out="cwd: $(pwd | sed "s|$HOME|~|")"$'\n'

# Git: branch + dirty count + last commit (only if we're in a repo)
if git rev-parse --git-dir >/dev/null 2>&1; then
  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  dirty=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  last_commit=$(git log -1 --pretty=format:'%h "%s"' 2>/dev/null | head -c 80)
  out="${out}git: ${branch} (${dirty} changed) — ${last_commit}"$'\n'
fi

# Stack: framework + first 3 key deps from package.json (if present)
if [ -f package.json ]; then
  stack=$(python3 -c "
import json
try:
    d = json.load(open('package.json'))
    deps = list((d.get('dependencies') or {}).keys())[:5]
    fw = 'next' if 'next' in deps else ('vite' if 'vite' in deps else ('expo' if 'expo' in deps else ('astro' if 'astro' in deps else '?')))
    print(f'{fw}: ' + ', '.join(deps[:3]))
except Exception:
    pass
" 2>/dev/null)
  [ -n "$stack" ] && out="${out}stack: ${stack}"$'\n'
elif [ -f pyproject.toml ]; then
  out="${out}stack: python (pyproject.toml present)"$'\n'
fi

# SESSION-HANDOFF.md presence + age
if [ -f SESSION-HANDOFF.md ]; then
  age=$((($(date +%s) - $(stat -f %m SESSION-HANDOFF.md 2>/dev/null || stat -c %Y SESSION-HANDOFF.md 2>/dev/null || date +%s)) / 86400))
  out="${out}handoff: SESSION-HANDOFF.md (updated ${age}d ago)"$'\n'
fi

# Mercury daemon activity (if running)
if pgrep -f 'mercury' >/dev/null 2>&1; then
  mlog="$HOME/.mercury/daemon.log"
  if [ -f "$mlog" ]; then
    last_mercury=$(tail -1 "$mlog" 2>/dev/null | head -c 80)
    [ -n "$last_mercury" ] && out="${out}mercury: ${last_mercury}"$'\n'
  fi
fi

# Shadow checkpoint count (if any in this repo for any session)
if git rev-parse --git-dir >/dev/null 2>&1; then
  shadow_count=$(git for-each-ref --format='%(refname)' refs/cc-shadow/ 2>/dev/null | wc -l | tr -d ' ')
  if [ "$shadow_count" -gt 0 ]; then
    latest_shadow=$(git for-each-ref --sort=-committerdate --count=1 --format='%(refname)' refs/cc-shadow/ 2>/dev/null)
    if [ -n "$latest_shadow" ]; then
      step_count=$(git rev-list --count "$latest_shadow" 2>/dev/null || echo 0)
      out="${out}shadow: ${step_count} agent-steps in latest cc-shadow ref (cc-rollback to walk)"$'\n'
    fi
  fi
fi

# Bail if nothing meaningful (just cwd → don't bother)
line_count=$(printf '%s' "$out" | wc -l | tr -d ' ')
[ "$line_count" -lt 2 ] && exit 0

# Hard cap: 2KB
[ "${#out}" -gt 2048 ] && out="${out:0:2000}…"$'\n'

# Emit JSON for UserPromptSubmit additionalContext
export _CC_ENV_OUT="$out"
python3 -c "
import json, os
ctx = '<env_details>\n' + os.environ['_CC_ENV_OUT'] + '</env_details>'
print(json.dumps({'hookSpecificOutput': {'hookEventName': 'UserPromptSubmit', 'additionalContext': ctx}}))
" 2>/dev/null
unset _CC_ENV_OUT
