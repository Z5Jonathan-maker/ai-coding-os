---
name: health
description: Verify the iMac dev environment — all expected CLI tools, gh auth, MCP servers, dotfiles symlinks.
---

# Health check

When the user invokes `/health`, verify the entire dev setup and report only what's broken or missing. Quiet on success.

Run these checks in parallel:

1. **CLI tools on PATH** — every tool from the Brewfile must be in `command -v`. Use:
   ```sh
   awk -F'"' '/^brew /{print $2}' ~/dotfiles/Brewfile | xargs -I{} sh -c 'command -v {} >/dev/null || echo "missing: {}"'
   ```

2. **gh auth** — token must include scopes for repo, workflow:
   ```sh
   gh auth status 2>&1 | grep -q "Token scopes" || echo "gh: not authenticated"
   ```

3. **MCP servers** — enumerate every connected MCP, ping each, surface auth-needed:
   ```sh
   claude mcp list 2>&1 | grep -v "✓ Connected" | grep -E ":\s" && echo "mcp: one or more disconnected" || true
   jq -e 'length == 0' ~/.claude/mcp-needs-auth-cache.json >/dev/null 2>&1 || echo "mcp: re-auth needed (see ~/.claude/mcp-needs-auth-cache.json)"
   for mcp in chrome-devtools playwright github context7 mempalace; do
     claude mcp list 2>&1 | grep -q "^$mcp:" || echo "mcp: $mcp missing from connection list (referenced in CLAUDE.md routing table)"
   done
   ```

4. **Dotfiles symlinks** — install.sh should report all "ok":
   ```sh
   ~/dotfiles/install.sh 2>&1 | grep -v '^ok ' | grep -v "^Done\|^$"
   ```

5. **Ollama** — local LLM should respond:
   ```sh
   echo "ping" | llm 2>&1 | head -1 || echo "ollama: not responding"
   ```

6. **Git signing** — last dotfiles commit shows verified:
   ```sh
   gh api repos/Z5Jonathan-maker/dotfiles/commits/HEAD --jq '.commit.verification.verified' | grep -q true || echo "signing broken"
   ```

7. **Routing-table drift** — every name in CLAUDE.md routing tables must exist:
   ```sh
   for s in $(awk -F'`' '/\| `/{print $2}' ~/dotfiles/claude/CLAUDE.md 2>/dev/null | grep -v '^$' | sort -u); do
     [ -d ~/.claude/skills/"$s" ] || [ -f ~/.claude/agents/"$s".md ] || echo "routing: $s referenced in CLAUDE.md but not found"
   done
   ```

8. **Auto-memory size** — MEMORY.md must stay under 200 lines (loaded every session):
   ```sh
   lines=$(wc -l < ~/.claude/projects/-Users-leonardofibonacci-Claude-Code/memory/MEMORY.md)
   [ "$lines" -gt 180 ] && echo "memory: MEMORY.md at $lines/200 lines — run memory-curator agent" || true
   ```

## Output

If everything is healthy, just say **"all green"** with a one-line summary.
If anything's broken, list each issue with the exact fix command.

## Composes with

- `morning` — health is part of the daily standup
- `audit` — health failures get filed into the audit punch list, not fixed inline
- `skill-router` — MCP failures route through skill-router to find a working alternative
- `memory-curator` — triggered by check #8 when MEMORY.md crosses the 180-line line
