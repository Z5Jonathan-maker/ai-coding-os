---
name: morning
description: Run the user's daily morning standup — show open PRs, brew updates, and recent commits to relevant repos.
---

# Morning standup

When the user invokes `/morning`, run these steps in parallel and present a single concise digest. **Do not** narrate each command; just run them and synthesize the output.

1. **Open PRs across all my repos**
   ```sh
   gh search prs --author=@me --state=open --limit=10 --json repository,title,url,statusCheckRollup
   ```

2. **PRs requesting my review**
   ```sh
   gh search prs --review-requested=@me --state=open --limit=10 --json repository,title,url,author
   ```

3. **Issues assigned to me**
   ```sh
   gh search issues --assignee=@me --state=open --limit=10 --json repository,title,url,labels
   ```

4. **Brew updates available**
   ```sh
   brew outdated --formula --quiet | head -20
   brew outdated --cask --quiet | head -10
   ```

5. **Dotfiles state**
   ```sh
   git -C ~/dotfiles status --short
   git -C ~/dotfiles log --oneline -3
   ```

## Output format

A single block with sections:
- **Action items** — PRs needing my attention (mine open, reviews requested, blocked on me)
- **Updates available** — count of brew outdated, dotfiles uncommitted lines
- **Recent activity** — last 3 dotfiles commits

Keep it under 30 lines. Don't include zero-count sections.
