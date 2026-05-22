#!/usr/bin/env bash
# mcp-fallback-resolver.sh
# Given an MCP name, output the best fallback MCP that is currently UP.
# Returns empty string if no fallback exists or no fallback is healthy.
#
# Usage: ~/.claude/scripts/mcp-fallback-resolver.sh chrome-devtools
#        → outputs: playwright (if chrome-devtools is down + playwright is up)
#
# Used by skill-router agent and downstream automation when an MCP fails mid-task.
set -euo pipefail

PRIMARY="${1:?usage: $0 <mcp-name>}"

# Fallback chain: each line is "primary fallback1 fallback2 ..."
# Order matters — first healthy fallback wins.
FALLBACKS="
chrome-devtools playwright
playwright chrome-devtools
github
context7
mempalace
webclaw chrome-devtools playwright
claude_ai_Figma
claude_ai_Gmail
claude_ai_Google_Calendar
claude_ai_Google_Drive
claude_ai_Gamma
claude_ai_Amplitude
claude_ai_Vibe_Prospecting
shadcn
"

# Get the chain for the requested primary
chain=$(echo "$FALLBACKS" | awk -v p="$PRIMARY" '$1 == p { for (i=2; i<=NF; i++) print $i }')

if [ -z "$chain" ]; then
  exit 0 # no fallback chain defined
fi

# Get current MCP status
list=$(claude mcp list 2>&1 || true)

# Try each fallback in order; output the first one that's ✓ Connected
for fb in $chain; do
  if echo "$list" | grep -q "^$fb:.*✓ Connected"; then
    echo "$fb"
    exit 0
  fi
done

# No healthy fallback
exit 0
