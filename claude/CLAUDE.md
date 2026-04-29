# Global preferences for Claude Code

This file is loaded into every Claude Code session on this machine. Keep it short and high-signal — anything project-specific should live in a project-level `CLAUDE.md` instead.

## Environment

- macOS (Apple Silicon), zsh
- Tools live under `~/local/bin` (manual portable installs) and, for newer tools, Homebrew
- Editor: VS Code (`code` is in PATH)

## How I like to work

- Be terse. Skip restating the prompt or summarizing what you just did — I can read the diff.
- Default to action over planning when the task is well-scoped; ask first when the task is ambiguous or destructive.
- Prefer editing existing files; don't scaffold new files unless asked.
- No emojis in code or commits unless I ask for them.
- Don't add comments that just restate what the code does.

## Defaults

- Default branch name: `main`
- Default Python: `python3`
- Default Node package manager: `npm` (until I say otherwise)

<!-- Add project-agnostic preferences here as they come up. Project-specific
     conventions belong in a CLAUDE.md inside that project's directory. -->
