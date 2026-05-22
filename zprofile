
eval "$(/opt/homebrew/bin/brew shellenv zsh)"

# Auto-resolve sudo password via askpass (1Password biometric → osascript fallback)
export SUDO_ASKPASS="$HOME/dotfiles/bin/sudo-askpass"

# 1Password Service Account token — when set, `op` skips biometric and runs
# fully headless (true autonomy for sudo-askpass + any op-driven flow).
# Create at: my.1password.com → Developer → Service Accounts (paid plan).
# Scope to the Personal vault, then paste the `ops_…` token below and uncomment.
# export OP_SERVICE_ACCOUNT_TOKEN="ops_REPLACE_ME"

# ntfy.sh push topic — installed by cc-bootstrap 2026-04-30
export NTFY_TOPIC="cc-imac-c1ac6b58f282"

# Shared environment contract for Codex, Claude, shells, and local agents.
[ -f "$HOME/code/scripts/ecosystem-env.sh" ] && source "$HOME/code/scripts/ecosystem-env.sh"
