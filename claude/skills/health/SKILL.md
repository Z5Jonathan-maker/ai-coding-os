---
name: health
description: Verify the iMac dev environment — all expected CLI tools, gh auth, MCP servers, dotfiles symlinks.
---

# Health check

When the user invokes `/health`, verify the entire dev setup and report only what's broken or missing. Quiet on success.

Run these checks in parallel:

1. **Package-managed CLIs** — Brewfile must be satisfied; every npm-global command in `npm-global-packages.txt` must resolve. Use:
   ```sh
   brew bundle check --file=~/dotfiles/Brewfile || echo "brew: bundle drift"
   awk 'NF && $1 !~ /^#/ {print $2}' ~/dotfiles/npm-global-packages.txt | xargs -I{} sh -c 'command -v {} >/dev/null || echo "missing npm global command: {}"'
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

5. **Shell startup silence** — automation shells must not emit banners/errors:
   ```sh
   zsh -i -c exit </dev/null
   TERM=dumb zsh -i -c exit </dev/null
   ```

6. **Router smoke tests** — known prompts must route to known platforms:
   ```sh
   ~/dotfiles/bin/cc-router-smoke
   ```

7. **Lane registry** — tool/model lanes must resolve to real declared fallbacks:
   ```sh
   ~/dotfiles/bin/cc-lane-registry-check
   ```

8. **VS Code interface** — User config must be dotfile-managed and the extension manifest must be installed:
   ```sh
   for f in settings keybindings tasks mcp; do
     [ "$(readlink "$HOME/Library/Application Support/Code/User/$f.json")" = "$HOME/dotfiles/vscode/$f.json" ] || echo "vscode: $f.json not symlinked"
   done
   code --list-extensions > /tmp/vscode-extensions.txt
   comm -23 \
     <(awk 'NF && $1 !~ /^#/ {print tolower($1)}' ~/dotfiles/vscode/extensions.txt | LC_ALL=C sort) \
     <(awk '{print tolower($1)}' /tmp/vscode-extensions.txt | LC_ALL=C sort) \
     | sed 's/^/vscode: missing extension /'
   ```

9. **Retired-reference noise** — active docs/scripts should not mention dead lanes:
   ```sh
   rg -n 'perplexity|cc-loop-v2|cc-loop-v3|com\.user\.cc-prune|openai ask|openai ping|localhost:330[1-6]' ~/dotfiles \
     --glob '!**/bin/cc-health-weekly' \
     --glob '!claude/audits/**' \
     --glob '!**/docs/COMMAND-REGISTRY.md' \
     --glob '!**/claude/skills/health/SKILL.md' \
     --glob '!claude/wiki/learnings/**' \
     --glob '!claude/wiki/logs/**'
   ```

10. **Command registry** — every executable in `bin/` must be classified:
   ```sh
   comm -23 \
     <(find -L ~/dotfiles/bin -maxdepth 1 -type f -perm -111 -print | sed 's#.*/##' | sort) \
     <(sed -n 's/^- `\([^`]*\)`.*/\1/p' ~/dotfiles/docs/COMMAND-REGISTRY.md | sort -u) \
     | sed 's/^/bin: unregistered command /'
   ```

11. **Runtime mirror symlinks** — no broken global links:
   ```sh
   find -L ~/dotfiles ~/.claude ~/.Codex -maxdepth 2 -type l -print | sed 's/^/broken symlink: /'
   ```

12. **LaunchAgent noise** — retired jobs should not be loaded:
   ```sh
   launchctl list | rg 'com\.user\.cc-prune|cc-loop-v2|cc-loop-v3|cc-mercury|perplexity'
   ```

13. **Git signing** — last dotfiles commit shows verified:
   ```sh
   gh api repos/Z5Jonathan-maker/ai-coding-os/commits/HEAD --jq '.commit.verification.verified' | grep -q true || echo "signing broken"
   ```

14. **Routing-table drift** — use the canonical drift checker:
   ```sh
   ~/dotfiles/claude/scripts/routing-drift-check.sh >/tmp/routing-drift.out || cat /tmp/routing-drift.out
   ```

15. **Auto-memory size** — MEMORY.md must stay under 200 lines (loaded every session):
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
- `memory-curator` — triggered by check #14 when MEMORY.md crosses the 180-line line
