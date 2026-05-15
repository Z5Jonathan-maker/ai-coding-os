# Trusted Execution Layer (TEL)

**Goal:** Remove the need to bypass the harness by separating the planning layer (Claude) from the credential layer (TEL). Claude never sees secrets; the TEL holds them and executes on Claude's behalf within a strict whitelist.

## Architecture

```
                ┌─────────────────────────────────┐
                │  USER (one-time OAuth approval) │
                └────────────────┬────────────────┘
                                 │ logs in via browser
                                 ↓
                ┌─────────────────────────────────┐
                │  Keychain / 1Password vault     │
                │  ─ tokens, OAuth refresh creds  │
                │  ─ never read by Claude         │
                └────────────────┬────────────────┘
                                 │ Keychain first, op:// fallback
                                 ↓
       ┌─────────────────────────────────────────────────┐
       │  TEL EXECUTOR (FastAPI on 127.0.0.1:8765)       │
       │  ┌─────────────┐  ┌─────────────┐               │
       │  │ Auth broker │  │   Policy    │               │
       │  └──────┬──────┘  └──────┬──────┘               │
       │         ↓                ↓                       │
       │  ┌─────────────────────────────┐  ┌──────────┐  │
       │  │  Tool registry (whitelist)  │→ │  Audit   │  │
       │  └──────────────┬──────────────┘  └──────────┘  │
       │                 ↓                                │
       │  ┌─────────────────────────────┐  ┌──────────┐  │
       │  │   Service call (HTTP/SDK)   │→ │ Rollback │  │
       │  └─────────────────────────────┘  └──────────┘  │
       └─────────────────────────────────────────────────┘
                                 ↑
                                 │ POST /execute (signed envelope, intent only)
                                 │ ← {ok, result, undo_token?, audit_id}
                ┌─────────────────────────────────┐
                │  CLAUDE (planner / orchestrator)│
                │  ─ tel-call.sh wrapper          │
                │  ─ never sees tokens            │
                │  ─ writes outcomes to wiki      │
                └─────────────────────────────────┘
```

## Trust model

| Layer | Sees | Doesn't see |
|---|---|---|
| Claude (planner) | Action intent, allowed-action list, structured response | Tokens, passwords, API keys |
| TEL (executor) | Tokens (via Keychain first, 1Password fallback), action requests, responses | Why Claude wants this; just executes structured intent |
| Keychain / 1Password | Secrets at rest | Anything else |
| User | One-time OAuth approval per service | Repetitive auth prompts |

## Protocol

### Request envelope (what Claude sends)

```json
{
  "service": "gamma",
  "action": "create_presentation",
  "args": {
    "title": "Aurex Q3 batch update",
    "outline": ["Slide 1: ...", "Slide 2: ..."],
    "theme": "minimal-dark"
  },
  "request_id": "req_<uuid>",
  "client": "claude-code-session-<id>"
}
```

### Response envelope (what TEL returns)

```json
{
  "ok": true,
  "result": {"presentation_id": "abc123", "url": "https://gamma.app/docs/abc123"},
  "audit_id": "log_<uuid>",
  "undo_token": "undo_<uuid>",
  "expires_at": "2026-05-03T16:00:00Z"
}
```

Claude never sees the bearer token, OAuth refresh, or API key. The TEL signs requests outbound, validates responses, logs everything, and returns only the action result.

## Components

| Component | File | Purpose |
|---|---|---|
| **Server** | `server/server.py` | FastAPI HTTP listener on 127.0.0.1:8765 |
| **Auth broker** | `server/auth_broker.py` | Keychain-first lookup, optional 1Password fallback, in-memory cache |
| **Tool registry** | `server/tool_registry.py` | Whitelist of allowed actions per service (loaded from `policies/*.yaml`) |
| **Policy engine** | `server/policy.py` | Per-action approval rules + rate limits + dry-run mode |
| **Audit log** | `server/audit.py` | Append-only JSONL at `audit/<date>.jsonl` (NEVER committed) |
| **Rollback** | `server/rollback.py` | Issues undo tokens for reversible actions; `/undo <token>` reverses if within window |
| **Client wrapper** | `client/tel-call.sh` | Claude-callable bash wrapper that signs the envelope + hits the API |
| **Policies** | `policies/<service>.yaml` | Per-service action whitelist with rate limits + reversibility flags |
| **Ops** | `ops/bio.tel.plist` | launchd plist to auto-start TEL at login |

## Security properties (and what they get you)

- **Credential isolation:** Claude can NEVER exfiltrate tokens — they don't enter its context
- **Whitelist enforcement:** Off-list actions return `policy_denied` without touching the credential
- **Rate limiting:** Per-service caps prevent runaway loops (e.g. 100 Gamma calls/hour)
- **Audit trail:** Every call logged with request_id, action, args (sensitive args redacted), result hash, timestamp
- **Undo window:** Reversible actions return an undo_token valid for N minutes (per-action policy)
- **Dry-run mode:** Add `"dry_run": true` to test the call shape without execution
- **Local-only by default:** TEL listens on 127.0.0.1 only — not exposed to network

## What TEL is NOT

- Not a credential proxy (doesn't pipe secrets back to Claude)
- Not a bypass for harness rules (the harness still blocks credential reads in transcripts; TEL just makes that irrelevant)
- Not a replacement for MCP servers (MCPs handle their own OAuth via the `claude mcp` UI; TEL handles services that have no MCP, or where you want strict whitelisting)
- Not magic — the user still does OAuth once per service interactively

## When to use TEL vs MCP vs direct Bash

| Scenario | Tool |
|---|---|
| Service has a working MCP server, OAuth fresh | MCP (default — already integrated) |
| Service has no MCP, has REST/SDK | TEL |
| Service has MCP but it's down + you have a manual fallback | TEL |
| You want strict whitelisting on a service | TEL (even if MCP exists) |
| Local file/CLI ops, no credentials | Bash directly |
| Credential needed but action is read-only single-shot | Bash + Keychain lookup (or explicit `op read` if still unmigrated) |

See [wiki/decision-rules.md](../wiki/decision-rules.md) D13 for the routing rule.

## Install + first-run

See [ops/INSTALL.md](ops/INSTALL.md). Two-step:
1. `pip install -r server/requirements.txt`
2. `launchctl load ~/Library/LaunchAgents/bio.tel.plist`

Then for each service: seed the matching Keychain entry, optionally keep an `op://...` fallback, write a `policies/<service>.yaml`, restart TEL.

## Status (iter 8)

Architecture + protocol are now live on this Mac. The FastAPI server is running under launchd on `127.0.0.1:8765`, the auth broker is Keychain-capable, and GitHub has already been seeded into Keychain. Remaining service migrations are per-service credential work, not platform bring-up.
