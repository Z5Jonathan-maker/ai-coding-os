#!/usr/bin/env bash
# routing-drift-check.sh
# Surface drift between CLAUDE.md routing tables and the actual contents of
# ~/.claude/skills/ and ~/.claude/agents/. Run weekly via cron.
# Output goes to ~/.claude/audits/drift-<date>.md and ntfy if anything is off.
set -euo pipefail

CLAUDE_MD="${HOME}/dotfiles/claude/CLAUDE.md"
SKILLS_DIR="${HOME}/.claude/skills"
AGENTS_DIR="${HOME}/.claude/agents"
OUT="${HOME}/.claude/audits/drift-$(date +%Y-%m-%d).md"
NTFY_TOPIC="${NTFY_TOPIC:-}"

[ -f "$CLAUDE_MD" ] || { echo "CLAUDE.md missing at $CLAUDE_MD" >&2; exit 1; }

declare -a issues=()

# Built-in agents (provided by Claude Code, not in ~/.claude/agents/)
BUILTINS="Explore Plan general-purpose claude-code-guide statusline-setup code-reviewer"
# MCP servers (validated by mcp-probe.sh, not by file presence)
MCPS="auto-browser chrome-devtools claude_ai_Amplitude claude_ai_Figma claude_ai_Gamma claude_ai_Gmail claude_ai_Google_Calendar claude_ai_Google_Drive claude_ai_Vibe_Prospecting context7 github mempalace playwright shadcn webclaw"

is_builtin() { for b in $BUILTINS; do [ "$1" = "$b" ] && return 0; done; return 1; }
is_mcp() { for m in $MCPS; do [ "$1" = "$m" ] && return 0; done; return 1; }

referenced=$(awk -F'`' '/\| `/{print $2}' "$CLAUDE_MD" | grep -v '^$' | sort -u)

for name in $referenced; do
  [ -d "$SKILLS_DIR/$name" ] && continue
  [ -f "$AGENTS_DIR/$name.md" ] && continue
  is_builtin "$name" && continue
  is_mcp "$name" && continue
  issues+=("- 🔴 \`$name\` referenced in CLAUDE.md but not found in skills/, agents/, builtins, or MCPs")
done

for d in "$SKILLS_DIR"/*/; do
  name=$(basename "$d")
  grep -q "\`$name\`" "$CLAUDE_MD" || issues+=("- 🟡 skill \`$name\` exists but not in CLAUDE.md routing table")
done

for f in "$AGENTS_DIR"/*.md; do
  [ -e "$f" ] || continue
  name=$(basename "$f" .md)
  grep -q "\`$name\`" "$CLAUDE_MD" || issues+=("- 🟡 agent \`$name\` exists but not in CLAUDE.md routing table")
done

{
  echo "# Routing drift report — $(date)"
  echo
  if [ ${#issues[@]} -eq 0 ]; then
    echo "✓ No drift. CLAUDE.md routing tables are in sync."
  else
    echo "Found ${#issues[@]} drift item(s):"
    echo
    printf '%s\n' "${issues[@]}"
  fi
} > "$OUT"

if [ ${#issues[@]} -gt 0 ] && [ -n "$NTFY_TOPIC" ]; then
  curl -fsS -d "Routing drift: ${#issues[@]} item(s). See $OUT" \
    "https://ntfy.sh/$NTFY_TOPIC" >/dev/null 2>&1 || true
fi

cat "$OUT"
