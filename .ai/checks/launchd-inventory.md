---
name: Launchd Inventory
description: Every tracked LaunchAgent plist is valid and classified as rendered, template, or local-only.
command: bin/cc-launchd-inventory --check
expect: Status: launchd-inventory-ready
---

This check prevents machine-specific LaunchAgent artifacts from silently
becoming public install instructions.
