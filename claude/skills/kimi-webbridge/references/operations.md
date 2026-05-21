# Operations: install, lifecycle, diagnose

Read this file when the health check in SKILL.md indicates the daemon is missing, not running, or the extension isn't connected — or when the user explicitly asks to install, start, stop, restart, or troubleshoot kimi-webbridge.

## Path convention

The `kimi-webbridge` binary always lives at `~/.kimi-webbridge/bin/kimi-webbridge`, regardless of how it was installed. Status, PID, and logs live under `~/.kimi-webbridge/`.

## Routing table (what to do based on status)

Run: `~/.kimi-webbridge/bin/kimi-webbridge status`

| Observed | Action |
|---|---|
| `command not found` or binary missing | Not installed. Run: `curl -fsSL https://cdn.kimi.com/webbridge/install.sh \| bash` |
| `{"running": false, ...}` | Daemon not running. Run: `~/.kimi-webbridge/bin/kimi-webbridge start` |
| `{"running": true, "extension_connected": false, ...}` | Extension not connected. For logged-in user-browser work, tell the user to open the browser extension from https://www.kimi.com/features/webbridge. For remote setup / smoke tests, run `cc-kimi-webbridge-shim start`. |
| `{"running": true, "extension_connected": true, ...}` | Healthy. Return to the main SKILL.md to make tool calls. |

## /status JSON fields

- `running` (bool) — daemon listening on `:10086`
- `port` (int) — 10086
- `version` (string) — daemon build version
- `extension_connected` (bool) — a WebSocket client is attached
- `extension_id` (string) — the Chrome/Edge extension ID, empty if none
- `uptime_seconds` (int)

## Daily operations

- **Check status:** `~/.kimi-webbridge/bin/kimi-webbridge status`
- **Start:** `~/.kimi-webbridge/bin/kimi-webbridge start` (idempotent — safe to call when already running)
- **Stop:** `~/.kimi-webbridge/bin/kimi-webbridge stop`
- **Restart after unexpected state:** `~/.kimi-webbridge/bin/kimi-webbridge restart`
- **View recent logs:** `~/.kimi-webbridge/bin/kimi-webbridge logs -n 100`
- **Follow logs live:** `~/.kimi-webbridge/bin/kimi-webbridge logs -f`
- **View previous run's logs:** `~/.kimi-webbridge/bin/kimi-webbridge logs --prev`

## Remote fallback shim

`cc-kimi-webbridge-shim` is a local fallback client that connects to the official daemon with the Kimi extension origin and services WebBridge commands through a persistent headless Chrome profile at `~/.kimi-webbridge/shim-chrome-profile`.

Use it when the daemon is installed but Chrome will not silently enable the official WebBridge extension. It makes remote automation and proof checks work without user clicks.

Commands:

- **Start shim:** `cc-kimi-webbridge-shim start`
- **Stop shim:** `cc-kimi-webbridge-shim stop`
- **Restart shim:** `cc-kimi-webbridge-shim restart`
- **Shim status:** `cc-kimi-webbridge-shim status`
- **Shim logs:** `cc-kimi-webbridge-shim logs`

Boundary: this is not the official logged-in browser extension. It uses its own persistent headless Chrome profile. For tasks that require the user's existing Chrome cookies/session, the official extension still needs to be active in the user's normal browser.

## Install flags (install.sh)

When running `install.sh`:

- Default: install binary + start daemon + install skills to all detected AI agents
- `--no-start`: install binary + skills, but don't start the daemon
- `--no-skill`: install binary + start daemon, but skip skill installation
- `-h` or `--help`: show usage

## Diagnosing common failures

| Symptom | Action |
|---|---|
| `start` fails with "address already in use" | `~/.kimi-webbridge/bin/kimi-webbridge stop && ~/.kimi-webbridge/bin/kimi-webbridge start`; if that fails, `lsof -i :10086` to find the conflicting process. |
| Tool calls time out | `~/.kimi-webbridge/bin/kimi-webbridge logs -n 100` — check for `[error]` / `panic` lines. |
| `extension_connected` stays `false` after install | Browser extension not running. If logged-in user-browser access is required, ask them to open the browser extension or install it from https://www.kimi.com/features/webbridge. If remote smoke automation is enough, run `cc-kimi-webbridge-shim start`. |
| `status` returns `extension_connected: true` but tool call fails | May be a multi-browser conflict. `~/.kimi-webbridge/bin/kimi-webbridge logs` will show recent upgrade rejections. |
