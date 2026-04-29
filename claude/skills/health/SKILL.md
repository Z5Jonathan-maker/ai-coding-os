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

3. **MCP servers** — playwright + github connected:
   ```sh
   claude mcp list 2>&1 | grep -E "(playwright|github):" | grep -v "✓ Connected" && echo "mcp issue" || true
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

## Output

If everything is healthy, just say **"all green"** with a one-line summary.
If anything's broken, list each issue with the exact fix command.
