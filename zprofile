
eval "$(/opt/homebrew/bin/brew shellenv zsh)"

# Added by OrbStack: command-line tools and integration
# This won't be added again if you remove it.
source ~/.orbstack/shell/init.zsh 2>/dev/null || :

# Auto-resolve sudo password via askpass (1Password biometric → osascript fallback)
export SUDO_ASKPASS="$HOME/dotfiles/bin/sudo-askpass"

# 1Password Service Account token — when set, `op` skips biometric and runs
# fully headless (true autonomy for sudo-askpass + any op-driven flow).
# Create at: my.1password.com → Developer → Service Accounts (paid plan).
# Scope to the Personal vault, then paste the `ops_…` token below and uncomment.
# export OP_SERVICE_ACCOUNT_TOKEN="ops_REPLACE_ME"

# ntfy.sh push topic — installed by cc-bootstrap 2026-04-30
export NTFY_TOPIC="cc-imac-c1ac6b58f282"

# Source local-only secret env file (NOT committed to dotfiles).
# Currently holds Langfuse API keys until they're moved to 1P.
[ -f "$HOME/.langfuse.local" ] && . "$HOME/.langfuse.local"
