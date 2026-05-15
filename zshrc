# Deduplicate PATH entries
typeset -U path PATH

# Shared environment contract for interactive shells too.
[ -f "$HOME/code/scripts/ecosystem-env.sh" ] && source "$HOME/code/scripts/ecosystem-env.sh"

# History
HISTFILE=~/.zsh_history
HISTSIZE=100000
SAVEHIST=100000
setopt SHARE_HISTORY              # share history across sessions
setopt HIST_IGNORE_ALL_DUPS       # drop older duplicates
setopt HIST_IGNORE_SPACE          # don't record commands starting with space
setopt HIST_REDUCE_BLANKS
setopt EXTENDED_HISTORY           # write timestamp + duration

# Completion (Homebrew completions before compinit)
if [ -d /opt/homebrew/share/zsh/site-functions ]; then
  fpath=(/opt/homebrew/share/zsh/site-functions $fpath)
fi
autoload -Uz compinit
if [[ -n ~/.zcompdump(#qN.mh+24) ]]; then
  compinit
else
  compinit -C
fi
zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}' '+r:|[._-]=* r:|=*'

# Navigation
setopt AUTO_CD                    # `foo/bar` cds into it
setopt AUTO_PUSHD                 # cd pushes to dir stack
setopt PUSHD_IGNORE_DUPS

# Useful aliases
if command -v eza >/dev/null 2>&1; then
  alias ls='eza --icons --git-ignore'
  alias ll='eza -lah --icons --git'
  alias la='eza -a --icons'
  alias lt='eza --tree --level=2 --icons'
else
  alias ll='ls -lah'
  alias la='ls -A'
fi
command -v bat >/dev/null 2>&1 && alias bcat='bat'
alias gs='git status'
alias gd='git diff'
alias gl='git log --oneline --graph --decorate -20'
alias lg='lazygit'
alias ..='cd ..'
alias ...='cd ../..'

# zoxide — smarter cd (use `z <dir>` to jump, `zi` for interactive fzf)
command -v zoxide >/dev/null 2>&1 && eval "$(zoxide init zsh)"
alias zi='z -i'

# direnv — per-directory env vars
command -v direnv >/dev/null 2>&1 && eval "$(direnv hook zsh)"

# fzf — fuzzy finder with fd integration
export FZF_DEFAULT_COMMAND='fd --type f --hidden --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_ALT_C_COMMAND='fd --type d --hidden --exclude .git'
export BAT_THEME='Monokai Extended'
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# fzf-git.sh — fuzzy git branch/file/commit/hash browsing
[ -f ~/dotfiles/bin/fzf-git.sh ] && source ~/dotfiles/bin/fzf-git.sh

# bat — better cat, also as man pager
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
export RIPGREP_CONFIG_PATH="$HOME/.config/ripgreprc"

# starship — fancy prompt (defer for faster startup)
if [ "${TERM:-}" != "dumb" ] && command -v starship >/dev/null 2>&1; then
  eval "$(starship init zsh)"
else
  autoload -Uz vcs_info
  precmd() { vcs_info }
  zstyle ':vcs_info:git:*' formats ' %F{cyan}(%b)%f'
  setopt PROMPT_SUBST
  PROMPT='%F{green}%n%f@%F{blue}%m%f %F{yellow}%~%f${vcs_info_msg_0_}
%# '
fi

# atuin — magical shell history (replaces Ctrl-R)
command -v atuin >/dev/null 2>&1 && eval "$(atuin init zsh --disable-up-arrow)"

# zsh-autosuggestions — fish-like inline suggestions
[ -f /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh ] \
  && source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh

# zsh-history-substring-search — powerful up/down arrow history search
[ -f /opt/homebrew/share/zsh-history-substring-search/zsh-history-substring-search.zsh ] \
  && source /opt/homebrew/share/zsh-history-substring-search/zsh-history-substring-search.zsh
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down

# zsh-syntax-highlighting — must be sourced LAST
[ -f /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ] \
  && source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Shared PATH/runtime ownership lives in ecosystem-env.sh.

# Aider — AI pair programming
export PATH="/opt/homebrew/opt/aider/libexec/bin:$PATH"

# Repomix — codebase context packaging
alias repomix-here='repomix --config ~/.repomixrc'

# Tree-sitter — AST-aware syntax check
alias ts-check='tree-sitter parse'

# Zellij — terminal multiplexer with tmux keybinds
alias zj='zellij --layout ~/.config/zellij/layouts/dev.kdl'
alias zj-attach='zellij attach'

# Git worktree shortcuts
alias gwt='git worktree'
alias gwta='git worktree add'
alias gwtl='git worktree list'
alias gwtr='git worktree remove'

# cc-dispatch — fire-and-forget Claude CLI agent dispatch (bypasses harness watchdog)
export PATH="$HOME/.claude/bin:$PATH"
