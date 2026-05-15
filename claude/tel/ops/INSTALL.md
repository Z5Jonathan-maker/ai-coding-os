# TEL — Install

Three steps. ~5 minutes. Then Claude can execute against any whitelisted service without ever seeing the credential.

## 1. Create a Python venv + install deps (needs your nod — adds Python deps)

**Python ≥ 3.10 required** — the server uses PEP 604 `X | Y` union types in pydantic models. macOS system Python is 3.9 and will fail at import time. Use the user-installed 3.12 (already on your machine via uv at `~/.local/bin/python3.12`):

```bash
cd ~/.claude/tel
~/.local/bin/python3.12 -m venv .venv
.venv/bin/pip install -r server/requirements.txt
```

This installs FastAPI + uvicorn + httpx + pyyaml + pydantic into an isolated venv at `~/.claude/tel/.venv/`. **Nothing pollutes the global Python.**

Verify imports + units pass:

```bash
cd ~/.claude/tel
.venv/bin/python -c "
from server import server, auth_broker, tool_registry, policy, audit, rollback
from pathlib import Path
reg = tool_registry.ToolRegistry(Path('policies'))
print('OK — policies parsed:', list(reg.services.keys()))
"
```

Should print `OK — policies parsed: ['gamma', 'github', 'gmail']`.

## 2. Verify the server runs interactively

```bash
cd ~/.claude/tel
source .venv/bin/activate
uvicorn server.server:app --host 127.0.0.1 --port 8765
```

In another terminal:
```bash
curl -s http://127.0.0.1:8765/health | jq .
```

You should see `{"ok": true, "version": "0.1.0", "auth_broker": {...}, "services": [...]}`.

If `auth_broker.ok` is false: check Keychain access first. TEL is Keychain-first now, with 1Password as an optional fallback for unmigrated services. If Keychain is healthy but `op whoami` fails, TEL can still be healthy; you'll just see an auth-broker warning instead of a hard failure.

Stop the interactive server (Ctrl-C) and proceed to step 3.

## 3. Auto-start at login via launchd

```bash
cp ~/.claude/tel/ops/bio.tel.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/bio.tel.plist
launchctl list | grep bio.tel
```

You should see `bio.tel` listed with status 0.

Logs:
- stdout: `/tmp/tel.log`
- stderr: `/tmp/tel.err`

## 4. Per-service credential setup (one-time per service)

For each service in `~/.claude/tel/policies/<service>.yaml`, prefer seeding the Keychain service named in `auth_keychain_service`. Keep `auth_op_path` only as a compatibility fallback if you still want 1Password in the loop.

### Gamma example

```bash
security add-generic-password -U -a "$USER" -s cc.gamma.credential -w '<paste-gamma-api-key>'
```

### GitHub example

```bash
security add-generic-password -U -a "$USER" -s cc.github.token -w '<paste-PAT>'
```

If you're still using 1Password fallback, the GUI path is fine too — same vault, item titled per the YAML, field named `credential`.

## 5. Smoke test

Use the wrapper to dry-run an action — no real call, just validates the request shape:

```bash
~/.claude/tel/client/tel-call.sh --health
~/.claude/tel/client/tel-call.sh --list
~/.claude/tel/client/tel-call.sh --dry-run gamma create_presentation '{"title":"Smoke test","outline":["Just testing"]}'
```

Then a real read-only call:

```bash
~/.claude/tel/client/tel-call.sh gmail list_labels '{}'
```

## 6. Wire Claude to use it

Add to your shell rc (already there if you use `~/dotfiles/zprofile`):

```bash
export PATH="$HOME/.claude/tel/client:$PATH"
```

Now Claude can call `tel-call.sh gamma create_presentation '{"title":"X","outline":[...]}'` from any session, and:
- Claude never sees the Gamma credential
- The credential never enters Claude's transcript
- Every call is audited at `~/.claude/tel/audit/<date>.jsonl`
- Off-whitelist actions return 403 without touching the credential

## Removal

```bash
launchctl unload ~/Library/LaunchAgents/bio.tel.plist
rm ~/Library/LaunchAgents/bio.tel.plist
rm -rf ~/.claude/tel/.venv
```

Audit logs in `~/.claude/tel/audit/` are preserved unless you remove them manually.

## Health monitoring

The TEL is monitored by the SessionStart hook `mcp-session-probe.sh` (extended in iter 8 to also check TEL health). If TEL is down, you'll see a warning at session open. The daily MCP probe also includes a TEL reachability check.

## Adding a new service

See [policies/README.md](../policies/README.md). Three steps: write YAML, seed Keychain (plus optional 1Password fallback), hot-reload via `tel-call.sh --reload`.
