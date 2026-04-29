export PATH="$HOME/local/bin:$HOME/.local/bin:$PATH"

# History
HISTFILE=~/.zsh_history
HISTSIZE=100000
SAVEHIST=100000
setopt SHARE_HISTORY              # share history across sessions
setopt HIST_IGNORE_ALL_DUPS       # drop older duplicates
setopt HIST_IGNORE_SPACE          # don't record commands starting with space
setopt HIST_REDUCE_BLANKS
setopt EXTENDED_HISTORY           # write timestamp + duration
setopt INC_APPEND_HISTORY

# Completion (Homebrew completions before compinit)
if [ -d /opt/homebrew/share/zsh/site-functions ]; then
  fpath=(/opt/homebrew/share/zsh/site-functions $fpath)
fi
autoload -Uz compinit && compinit
zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}' '+r:|[._-]=* r:|=*'

# Navigation
setopt AUTO_CD                    # `foo/bar` cds into it
setopt AUTO_PUSHD                 # cd pushes to dir stack
setopt PUSHD_IGNORE_DUPS

# History search with up/down on partial command
autoload -U up-line-or-beginning-search down-line-or-beginning-search
zle -N up-line-or-beginning-search
zle -N down-line-or-beginning-search
bindkey '^[[A' up-line-or-beginning-search
bindkey '^[[B' down-line-or-beginning-search

# Useful aliases
if command -v eza >/dev/null 2>&1; then
  alias ls='eza'
  alias ll='eza -lah --git'
  alias la='eza -a'
  alias lt='eza --tree --level=2'
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

# zoxide — smarter cd (use `z <dir>` to jump)
command -v zoxide >/dev/null 2>&1 && eval "$(zoxide init zsh)"

# fnm — fast Node version manager
command -v fnm >/dev/null 2>&1 && eval "$(fnm env --use-on-cd --shell zsh)"

# starship — fancy prompt (replaces vcs_info prompt above if installed)
if command -v starship >/dev/null 2>&1; then
  eval "$(starship init zsh)"
else
  autoload -Uz vcs_info
  precmd() { vcs_info }
  zstyle ':vcs_info:git:*' formats ' %F{cyan}(%b)%f'
  setopt PROMPT_SUBST
  PROMPT='%F{green}%n%f@%F{blue}%m%f %F{yellow}%~%f${vcs_info_msg_0_}
%# '
fi

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
