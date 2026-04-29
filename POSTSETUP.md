# Post-setup checklist

Stuff that needs human attention because it's interactive, sensitive, or UI-only.

## Critical

- [ ] **Rotate macOS password.** The earlier setup session has it in plaintext in `~/.claude/projects/.../sessions/*.jsonl`. System Settings → Touch ID & Password → Change Password.
- [ ] **GitHub auth** — interactive browser flow:
  ```sh
  gh auth login   # pick: GitHub.com → HTTPS → Y → Login with web browser
  ```

## Apps that need first-run setup

- [ ] **Rectangle** — System Settings → Privacy & Security → Accessibility → enable Rectangle.
- [ ] **OrbStack** — open the app, run through onboarding (no-Docker-Desktop alternative). Then `orbctl --version` should work.
- [ ] **1Password** — sign in, set up browser extension, install `op` CLI shim if you want it (`op signin` after).
- [ ] **Raycast** — onboarding wizard. Recommend swapping its hotkey to `⌘ Space` (and re-binding Spotlight to something else).
- [ ] **Slack / Notion** — sign in.

## Optional but recommended

- [ ] Generate an SSH key for GitHub:
  ```sh
  ssh-keygen -t ed25519 -C "z5jonathan@icloud.com"
  pbcopy < ~/.ssh/id_ed25519.pub
  open https://github.com/settings/ssh/new
  ```
- [ ] Push this dotfiles repo to GitHub (after `gh auth login`):
  ```sh
  cd ~/dotfiles
  gh repo create dotfiles --private --source=. --remote=origin --push
  ```
- [ ] Configure git commit signing (1Password supports SSH signing — slick):
  ```sh
  # In 1Password app: enable SSH agent (Developer settings)
  git config --global gpg.format ssh
  git config --global user.signingkey "<paste-public-key-here>"
  git config --global commit.gpgsign true
  ```

## Reload the shell

Open a new Ghostty / Terminal window — your new prompt (starship), aliases, completions, fnm, zoxide, and brew shellenv all kick in fresh.
