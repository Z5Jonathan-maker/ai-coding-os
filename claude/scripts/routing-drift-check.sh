#!/usr/bin/env bash
# routing-drift-check.sh
# Surface drift between CLAUDE.md routing tables and the actual contents of
# ~/.claude/skills/ and ~/.claude/agents/. Run weekly via launchd
# (bio.claude.routing-drift, Mondays 09:05).
# Writes ~/.claude/audits/drift-<date>.md and pings ntfy on drift.
# shellcheck disable=SC2016
set -euo pipefail

CLAUDE_MD="${HOME}/.claude/CLAUDE.md"
SKILLS_DIR="${HOME}/.claude/skills"
AGENTS_DIR="${HOME}/.claude/agents"
OUT="${HOME}/.claude/audits/drift-$(date +%Y-%m-%d).md"
NTFY_TOPIC="${NTFY_TOPIC:-}"

[ -f "$CLAUDE_MD" ] || {
  echo "CLAUDE.md missing at $CLAUDE_MD" >&2
  exit 1
}
mkdir -p "${HOME}/.claude/audits"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

section() {
  local heading="$1"
  awk -v heading="$heading" '
    $0 == heading { in_section=1; next }
    in_section && /^## / { exit }
    in_section { print }
  ' "$CLAUDE_MD"
}

# Extract backtick-quoted names from column 2 of a markdown table (the
# "Skill to invoke" / "Agent" column). Avoids false positives from notes
# columns that mention env vars, memory entries, etc.
table_column2_backticks() {
  awk -F'|' 'NF >= 4 && $1 ~ /^$/ && $2 !~ /^[[:space:]]*-+[[:space:]]*$/ && $2 !~ /^[[:space:]]*User intent/ && $2 !~ /^[[:space:]]*Task[[:space:]]*$/ { print $3 }' \
    | grep -Eo '`[^`]+`' \
    | sed 's/^`//; s/`$//' \
    | grep -E '^[A-Za-z0-9][A-Za-z0-9_-]*$' \
    | sort -u
}

disk_skills() {
  find -L "$SKILLS_DIR" -mindepth 1 -maxdepth 1 \( -type d -o -type l \) -print \
    | sed 's#.*/##' \
    | sort -u
}

disk_agents() {
  find -L "$AGENTS_DIR" -mindepth 1 -maxdepth 1 \( -type f -o -type l \) -name '*.md' -print \
    | sed 's#.*/##; s/\.md$//' \
    | sort -u
}

builtin_skills() {
  cat <<'BUILTIN'
claude-api
fewer-permission-prompts
init
keybindings-help
loop
review
schedule
security-review
simplify
update-config
BUILTIN
}

builtin_agents() {
  cat <<'BUILTIN'
Explore
Plan
claude-code-guide
general-purpose
statusline-setup
BUILTIN
}

commands_disk() {
  # Slash-commands live in ~/.claude/commands/ as .md files. They are valid
  # routing targets — treat them the same as on-disk skills for drift purposes.
  local CMDS_DIR="${HOME}/.claude/commands"
  [ -d "$CMDS_DIR" ] || return 0
  find -L "$CMDS_DIR" -mindepth 1 -maxdepth 1 -type f -name '*.md' -print \
    | sed 's#.*/##; s/\.md$//' \
    | sort -u
}

cli_allowlist() {
  # Names that appear in routing tables as backtick tokens but are CLI tools
  # rather than skills/commands. Living in ~/dotfiles/bin/ or ~/local/bin/.
  cat <<'CLIS'
cc-reflect
cc-deploy-watch
cc-skill-register
cc-push-gate
CLIS
}

# Skills come from the routing table column 2 AND the inline
# "Built-in Anthropic skills" line.
{
  section "## SKILL ROUTING TABLE (read this before invoking anything)" | table_column2_backticks
  grep -E '^\*\*Built-in Anthropic skills\*\*' "$CLAUDE_MD" \
    | grep -Eo '`[^`]+`' | sed 's/^`//; s/`$//' \
    | grep -E '^[A-Za-z0-9][A-Za-z0-9_-]*$'
} | sort -u >"$tmpdir/routed_skills"

section "## AGENT ROUTING TABLE" | table_column2_backticks >"$tmpdir/routed_agents"
section "## MCP ROUTING TABLE" | grep -Eo 'mcp__[A-Za-z0-9_:-]+' | sort -u >"$tmpdir/routed_mcps" || true

{
  disk_skills
  builtin_skills
  commands_disk
  cli_allowlist
} | sort -u >"$tmpdir/disk_skills"
{
  disk_agents
  builtin_agents
} | sort -u >"$tmpdir/disk_agents"

comm -23 "$tmpdir/routed_skills" "$tmpdir/disk_skills" | sed 's/^/skill /' >"$tmpdir/routed_missing"
comm -23 "$tmpdir/routed_agents" "$tmpdir/disk_agents" | sed 's/^/agent /' >>"$tmpdir/routed_missing"

comm -13 "$tmpdir/routed_skills" "$tmpdir/disk_skills" | sed 's/^/skill /' >"$tmpdir/disk_unrouted"
comm -13 "$tmpdir/routed_agents" "$tmpdir/disk_agents" | sed 's/^/agent /' >>"$tmpdir/disk_unrouted"

skill_ok="$(comm -12 "$tmpdir/routed_skills" "$tmpdir/disk_skills" | wc -l | awk '{print $1}')"
agent_ok="$(comm -12 "$tmpdir/routed_agents" "$tmpdir/disk_agents" | wc -l | awk '{print $1}')"
mcp_refs="$(wc -l <"$tmpdir/routed_mcps" | awk '{print $1}')"
_total_ok="$((skill_ok + agent_ok))"

issue_count=0
[ -s "$tmpdir/routed_missing" ] && issue_count=$((issue_count + $(wc -l <"$tmpdir/routed_missing")))
[ -s "$tmpdir/disk_unrouted" ] && issue_count=$((issue_count + $(wc -l <"$tmpdir/disk_unrouted")))

{
  # Use date-only (matches filename); avoids non-idempotent wall-clock timestamps
  # that cause pre-commit "files modified by hook" false-failures on re-runs.
  echo "# Routing drift report — $(date +%Y-%m-%d)"
  echo
  if [ "$issue_count" -eq 0 ]; then
    echo "✓ No drift. CLAUDE.md routing tables are in sync."
    echo
    echo "Coverage: $skill_ok skills, $agent_ok agents, $mcp_refs MCP refs."
  else
    echo "Found $issue_count drift item(s):"
    echo
    if [ -s "$tmpdir/routed_missing" ]; then
      echo "## Routed but not on disk (false promises)"
      echo
      sort "$tmpdir/routed_missing" | sed 's/^/- 🔴 /'
      echo
    fi
    if [ -s "$tmpdir/disk_unrouted" ]; then
      echo "## On disk but not routed (orphan)"
      echo
      sort "$tmpdir/disk_unrouted" | sed 's/^/- 🟡 /'
      echo
    fi
    echo "Coverage: $skill_ok skills, $agent_ok agents, $mcp_refs MCP refs."
  fi
} >"$OUT"

if [ "$issue_count" -gt 0 ] && [ -n "$NTFY_TOPIC" ]; then
  curl -fsS -d "Routing drift: $issue_count item(s). See $OUT" \
    "https://ntfy.sh/$NTFY_TOPIC" >/dev/null 2>&1 || true
fi

cat "$OUT"

[ "$issue_count" -eq 0 ] || exit 1
exit 0
