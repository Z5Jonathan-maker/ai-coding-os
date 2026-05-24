#!/usr/bin/env bash
# Re-create symlinks from $HOME → ~/dotfiles. Idempotent: skips files that
# are already correctly symlinked, and refuses to clobber unrelated files.
set -euo pipefail

DOTFILES_DIR="${DOTFILES_DIR:-${DOTFILES:-$HOME/dotfiles}}"

case "${1:-}" in
--dry-run | --doctor | doctor)
  DOTFILES="$DOTFILES_DIR" exec "$DOTFILES_DIR/bin/cc-first-run"
  ;;
-h | --help)
  printf 'Usage: install.sh [--dry-run|--doctor]\n'
  exit 0
  ;;
esac

link() {
  local src="$DOTFILES_DIR/$1"
  local dst="$HOME/$2"

  [ -e "$src" ] || {
    echo "skip $2 (source missing: $src)"
    return
  }

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

link_to() {
  local src="$1"
  local dst="$HOME/$2"

  [ -e "$src" ] || {
    echo "skip $2 (source missing: $src)"
    return
  }

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

link zshrc .zshrc
link zprofile .zprofile
link gitconfig .gitconfig
link gitignore_global .gitignore_global
link tmux.conf .tmux.conf
link ssh_config .ssh/config
link starship.toml .config/starship.toml
link ghostty_config .config/ghostty/config
link claude/CLAUDE.md .claude/CLAUDE.md
link claude/settings.json .claude/settings.json
link claude/skills .claude/skills
link claude/agents .claude/agents
link claude/hooks/nonstop.sh .claude/hooks/nonstop.sh
link claude/hooks/loop-guard.sh .claude/hooks/loop-guard.sh
link claude/hooks/no-ask-human.sh .claude/hooks/no-ask-human.sh
link claude/hooks/context-monitor.sh .claude/hooks/context-monitor.sh
link claude/hooks/wired-up-stop.sh .claude/hooks/wired-up-stop.sh
link claude/hooks/secret-paste-guard.sh .claude/hooks/secret-paste-guard.sh
link claude/hooks/session-handover.sh .claude/hooks/session-handover.sh
link claude/hooks/session-resume.sh .claude/hooks/session-resume.sh
link claude/hooks/error-gate.sh .claude/hooks/error-gate.sh
link claude/hooks/ntfy-notify.sh .claude/hooks/ntfy-notify.sh
link claude/hooks/bootstrap-check.sh .claude/hooks/bootstrap-check.sh
link claude/hooks/git-shadow-checkpoint.sh .claude/hooks/git-shadow-checkpoint.sh
link claude/hooks/environment-details.sh .claude/hooks/environment-details.sh

link codex/AGENTS.md .Codex/AGENTS.md

# Codex reads ~/.Codex/AGENTS.md, but most durable brain resources are shared
# with Claude Code through dotfiles. Keep the paths that AGENTS.md advertises
# real instead of maintaining a second copy of the same wiki/design/TEL stack.
link claude/wiki .Codex/wiki
link claude/design .Codex/design
link claude/tel .Codex/tel
link claude/memory .Codex/memory
link claude/skills/kimi-webbridge .Codex/skills/kimi-webbridge
link_to "$HOME/.claude/scripts" .Codex/scripts
link_to "$HOME/.claude/commands" .Codex/commands
link_to "$HOME/.claude/bin" .Codex/bin
link_to "$HOME/.claude/checkpoints" .Codex/checkpoints
link_to "$HOME/.claude/projects" .Codex/projects
link_to "$HOME/.claude/state" .Codex/state
link_to "$HOME/.claude/jobs" .Codex/jobs

# Retired legacy wrappers from the 2026-05-19 cleanup intentionally stay out
# of PATH.
# Note: individual skills are already covered by `link claude/skills .claude/skills`
# above (it links the entire directory). Adding sub-symlinks for each skill creates
# self-loops because ~/.claude/skills resolves through the parent symlink to the
# same dir as the source.
link git-config/allowed_signers .config/git/allowed_signers
link atuin/config.toml .config/atuin/config.toml
link hammerspoon/init.lua .hammerspoon/init.lua
link editorconfig .editorconfig
link ripgreprc .config/ripgreprc
link gh-config.yml .config/gh/config.yml
link .aider.conf.yml .aider.conf.yml
link repomix.config.json .repomixrc
link .zellij.kdl .config/zellij/config.kdl
link zellij-layout.kdl .config/zellij/layouts/dev.kdl
link vscode/argv.json "Library/Application Support/Code/argv.json"
link vscode/settings.json "Library/Application Support/Code/User/settings.json"
link vscode/argv.json "Library/Application Support/Code/User/argv.json"
link vscode/keybindings.json "Library/Application Support/Code/User/keybindings.json"
link vscode/tasks.json "Library/Application Support/Code/User/tasks.json"
link vscode/mcp.json "Library/Application Support/Code/User/mcp.json"
link vscode/AI-HQ.code-workspace AI-HQ.code-workspace
link vscode/ai-cockpit .vscode/extensions/z5jonathan.ai-system-cockpit-0.1.0

# Ensure zellij layout dir exists
mkdir -p "$HOME/.config/zellij/layouts"

# Vendored skills cloned outside dotfiles. The symlinks tracked under
# claude/skills/ point at these paths; clone them if missing so the
# symlinks resolve on a fresh machine.
clone_if_missing() {
  local repo_url="$1" dest="$2"
  if [ -d "$dest/.git" ]; then
    echo "ok   vendor: $dest"
  else
    mkdir -p "$(dirname "$dest")"
    git clone --depth=1 "$repo_url" "$dest" && echo "vendor cloned: $dest"
  fi
}
clone_if_missing https://github.com/alchaincyf/huashu-design.git "$HOME/code/research/huashu-design"
clone_if_missing https://github.com/browser-use/browser-harness.git "$HOME/code/research/browser-harness"
clone_if_missing https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git "$HOME/code/research/ui-ux-pro-max-skill"

# ssh config must be 600 (its target file is in this repo, but ssh checks the linked path)
chmod 600 "$DOTFILES_DIR/ssh_config" || true
chmod 700 "$HOME/.ssh" 2>/dev/null || true

# Verify Brewfile packages are installed (warn if drift)
if command -v brew >/dev/null 2>&1; then
  echo
  echo "Checking Brewfile bundle status..."
  brew bundle check --file="$DOTFILES_DIR/Brewfile" --no-upgrade 2>/dev/null || {
    echo "Some Brewfile packages are missing. Run: brew bundle --file=$DOTFILES_DIR/Brewfile"
  }
fi

# npm globals that are intentionally outside Brewfile. Keep this tiny; prefer
# Homebrew or uv unless npm is the stable upstream install path.
if command -v npm >/dev/null 2>&1 && [ -f "$DOTFILES_DIR/npm-global-packages.txt" ]; then
  echo
  echo "Checking npm global packages..."
  while read -r pkg cmd _rest; do
    case "$pkg" in
    "" | \#*) continue ;;
    esac
    if npm list -g --depth=0 "$pkg" >/dev/null 2>&1; then
      echo "ok   npm global: $pkg"
    else
      echo "install npm global: $pkg"
      npm install -g "$pkg"
    fi
    if [ -n "${cmd:-}" ] && ! command -v "$cmd" >/dev/null 2>&1; then
      echo "warn npm global command not on PATH: $cmd"
    fi
  done <"$DOTFILES_DIR/npm-global-packages.txt"
  if [ -x "$HOME/local/opt/node/bin/codex" ]; then
    mkdir -p "$HOME/.local/bin"
    ln -sf "$HOME/local/opt/node/bin/codex" "$HOME/.local/bin/codex"
    echo "ok   codex shim"
  fi
fi

if command -v code >/dev/null 2>&1 && [ -f "$DOTFILES_DIR/vscode/extensions.txt" ]; then
  echo
  echo "Checking VS Code extensions..."
  vscode_ext_list=$(mktemp)
  trap 'rm -f "$vscode_ext_list"' EXIT
  code --list-extensions >"$vscode_ext_list"
  if [ -f "$DOTFILES_DIR/vscode/obsolete-extensions.txt" ]; then
    while IFS= read -r ext; do
      case "$ext" in
      "" | \#*) continue ;;
      esac
      if grep -Fxqi "$ext" "$vscode_ext_list"; then
        echo "uninstall obsolete vscode extension: $ext"
        code --uninstall-extension "$ext" >/dev/null || true
        code --list-extensions >"$vscode_ext_list"
      fi
    done <"$DOTFILES_DIR/vscode/obsolete-extensions.txt"
  fi
  while IFS= read -r ext; do
    case "$ext" in
    "" | \#*) continue ;;
    esac
    if grep -Fxqi "$ext" "$vscode_ext_list"; then
      echo "ok   vscode extension: $ext"
    else
      echo "install vscode extension: $ext"
      code --install-extension "$ext" >/dev/null
      code --list-extensions >"$vscode_ext_list"
    fi
  done <"$DOTFILES_DIR/vscode/extensions.txt"
fi

echo
echo "Done. Open a new shell to pick up changes."
