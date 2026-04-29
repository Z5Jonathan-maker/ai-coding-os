# Post-setup checklist

Stuff that needs human attention because it's interactive, sensitive, or UI-only.

## Critical

- [ ] **Rotate macOS password.** The earlier setup session has it in plaintext in `~/.claude/projects/.../sessions/*.jsonl`. System Settings → Touch ID & Password → Change Password.

## Apps that need first-run setup

- [ ] **Rectangle** — System Settings → Privacy & Security → Accessibility → enable Rectangle.
- [ ] **OrbStack** — open the app, run through onboarding (Docker Desktop alternative). Then `orbctl --version` should work.
- [ ] **1Password** — sign in, set up browser extension. For SSH agent (replaces ssh-agent + Keychain): open 1Password → Settings → Developer → "Use the SSH agent".
- [ ] **Raycast** — onboarding wizard. Recommend swapping its hotkey to `⌘ Space` (and re-binding Spotlight to something else).
- [ ] **Slack / Notion** — sign in.

## Done already (no action needed)

- ✅ `gh auth login` (device flow with scopes: repo, read:org, workflow, gist, admin:public_key, admin:ssh_signing_key)
- ✅ SSH key (`~/.ssh/id_ed25519`) generated, added to Apple Keychain agent, registered on GitHub for both authentication AND signing
- ✅ Git commit signing enabled (SSH-based) — commits show ✅ Verified on GitHub
- ✅ Dotfiles repo at `git@github.com:Z5Jonathan-maker/dotfiles.git` (private, SSH remote)
- ✅ `gh extension` installed: `gh-dash` (terminal dashboard for PRs/issues — try `gh dash`)
- ✅ gh aliases: `gh co <#>` (PR checkout), `gh prs`, `gh prv`, `gh issues`, `gh runs`, `gh repos`

## Optional

- [ ] **Touch ID for sudo** — already enabled in `/etc/pam.d/sudo_local`. Will activate automatically next time you run `sudo` if you have Touch ID hardware (Magic Keyboard with Touch ID, MacBook fingerprint).
- [ ] **Migrate to 1Password SSH agent**:
  ```sh
  # After enabling 1Password's SSH agent in Settings → Developer:
  cat >> ~/.zshrc <<'EOF'

  # Use 1Password's SSH agent
  export SSH_AUTH_SOCK="$HOME/Library/Group Containers/2BUA8C4S2C.com.1password/t/agent.sock"
  EOF
  # Then move ~/.ssh/id_ed25519 into 1Password and remove from disk.
  ```

## Reload the shell

Open a new Ghostty window — your starship prompt, eza colors, fzf Ctrl-R, zoxide `z`, fnm auto Node, direnv, and brew shellenv all kick in fresh. Run `gh dash` to see your PR/issue dashboard.
