---
name: Native App Status
description: Native app status resolves repo-local Kimi/WebBridge status without relying on PATH.
command: bash -lc 'home="$(mktemp -d)"; HOME="$home" DOTFILES="$PWD" PATH="/usr/bin:/bin:/usr/sbin:/sbin" bin/cc-native-app-status'
expect: Status: native-app-status-ready
---

This check protects the cockpit native-app status surface from losing Kimi
WebBridge visibility when the repo `bin/` directory has not been added to PATH.
