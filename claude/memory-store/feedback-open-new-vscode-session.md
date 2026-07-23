---
name: feedback-open-new-vscode-session
description: "VS Code Claude Code extension exposes `claude-vscode.newConversation` (and 4 variants). Trigger via `open "vscode://command/<id>"` URI scheme. Wrapper script at ~/local/bin/claude-new."
metadata:
  type: feedback
  originSessionId: 76bf2a21-1a71-41aa-8729-fb0bd48bcb78
---
**Bash one-liner** (works from anywhere on the iMac):
```bash
open "vscode://command/claude-vscode.newConversation"
```

**Wrapper script** at `~/local/bin/claude-new`:
- `claude-new`           → new conversation (default)
- `claude-new window`    → open in new VS Code window
- `claude-new tab`       → open in editor tab
- `claude-new sidebar`   → open in side bar
- `claude-new terminal`  → open in integrated terminal

**Other commands** (full list, also URI-triggerable):
- `claude-vscode.editor.open` / `editor.openLast` / `primaryEditor.open`
- `claude-vscode.window.open`
- `claude-vscode.createWorktree`
- `claude-vscode.sidebar.open`
- `claude-vscode.newConversation`
- `claude-vscode.terminal.open`
- `claude-vscode.focus` / `.blur` / `.logout`
- `claude-vscode.installPlugin`

**Why URI scheme over `code --command`:** VS Code CLI's `--command` flag is non-standard (just passed to Electron). The `vscode://command/<id>` URI scheme is the documented + working trigger.

**Discovery method:** inspect the extension's `package.json` at `~/.vscode/extensions/anthropic.claude-code-*-darwin-arm64/package.json` → `contributes.commands[]`.
