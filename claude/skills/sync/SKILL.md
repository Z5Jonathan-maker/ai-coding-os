---
name: sync
description: Sync dotfiles to GitHub — stage, commit (with auto-message if none given), push.
---

# Sync dotfiles

When the user invokes `/sync` or `/sync <message>`:

1. `cd ~/dotfiles`
2. `git status --short` — if nothing's changed, report and stop
3. `git add -A`
4. Commit with the user's message if provided, else generate a concise one based on the diff (e.g., "Update zshrc aliases", "Add new helper script", "Refresh Brewfile")
5. `git push`
6. Report the new commit SHA + verified status: `gh api repos/Z5Jonathan-maker/dotfiles/commits/HEAD --jq '.commit.verification'`

Output: 2-3 lines max — what was committed, where it was pushed, ✓ verified or not.
