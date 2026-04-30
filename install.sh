#!/usr/bin/env bash
# Re-create symlinks from $HOME → ~/dotfiles. Idempotent: skips files that
# are already correctly symlinked, and refuses to clobber unrelated files.
set -euo pipefail

DOTFILES_DIR="${DOTFILES_DIR:-$HOME/dotfiles}"

link() {
  local src="$DOTFILES_DIR/$1"
  local dst="$HOME/$2"

  [ -e "$src" ] || { echo "skip $2 (source missing: $src)"; return; }

  mkdir -p "$(dirname "$dst")"

  if [ -L "$dst" ]; then
    local current
    current=$(readlink "$dst")
    if [ "$current" = "$src" ]; then
      echo "ok   $2"
      return
    fi
    rm "$dst"
  elif [ -e "$dst" ]; then
    local backup
    backup="$dst.backup.$(date +%Y%m%d%H%M%S)"
    echo "back $2 -> $backup"
    mv "$dst" "$backup"
  fi

  ln -s "$src" "$dst"
  echo "link $2 -> $src"
}

link zshrc                .zshrc
link zprofile             .zprofile
link gitconfig            .gitconfig
link gitignore_global     .gitignore_global
link tmux.conf            .tmux.conf
link ssh_config           .ssh/config
link starship.toml        .config/starship.toml
link ghostty_config       .config/ghostty/config
link claude/CLAUDE.md     .claude/CLAUDE.md
link claude/settings.json .claude/settings.json
link claude/skills        .claude/skills
link claude/agents        .claude/agents
link claude/hooks/nonstop.sh           .claude/hooks/nonstop.sh
link claude/hooks/loop-guard.sh        .claude/hooks/loop-guard.sh
link claude/hooks/no-ask-human.sh      .claude/hooks/no-ask-human.sh
link claude/hooks/context-monitor.sh   .claude/hooks/context-monitor.sh
link claude/hooks/wired-up-stop.sh     .claude/hooks/wired-up-stop.sh
link claude/hooks/secret-paste-guard.sh .claude/hooks/secret-paste-guard.sh
link git-config/allowed_signers .config/git/allowed_signers
link atuin/config.toml          .config/atuin/config.toml
link hammerspoon/init.lua       .hammerspoon/init.lua
link editorconfig               .editorconfig

# ssh config must be 600 (its target file is in this repo, but ssh checks the linked path)
chmod 600 "$DOTFILES_DIR/ssh_config" || true

echo
echo "Done. Open a new shell to pick up changes."
