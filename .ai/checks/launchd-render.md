---
name: Launchd Render
description: LaunchAgent installation renders personal paths for the current user instead of copying Jonathan-specific plists.
command: bash -lc 'home="$(mktemp -d)"; forbidden_prefix="$(printf "/%s/" Users)"; HOME="$home" DOTFILES="$PWD" LAUNCH_AGENTS_DIR="$home/Library/LaunchAgents" bin/cc-launchd-install --render cc-health-weekly | tee "$home/rendered.plist"; ! rg -q "$forbidden_prefix" "$home/rendered.plist"; rg -q "$home/dotfiles/bin/cc-health-weekly|$PWD/bin/cc-health-weekly" "$home/rendered.plist"'
expect: cc-health-weekly
---

This check prevents the maintenance docs from instructing public users to copy
LaunchAgent plists that still contain Jonathan-specific absolute paths.
