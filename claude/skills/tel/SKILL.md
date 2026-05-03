---
name: tel
description: Invoke a credentialed action through the Trusted Execution Layer (TEL) at ~/.claude/tel/. Use when you need to call a third-party API on the user's behalf without ever touching the credential — Gmail/Gamma/GitHub/Vercel/Notion/Linear are wired. The credential lives in 1Password and never enters Claude's transcript. Use when the user says "use TEL", "tel-call", "/tel", or when a credentialed action emerges naturally during a task and the relevant policy YAML exists at ~/.claude/tel/policies/. Different from MCP — TEL is for strict whitelisting + audit + undo tokens.
---

# tel — credentialed action via TEL

The Trusted Execution Layer holds credentials in 1Password and executes whitelisted actions on the user's behalf. **Claude never sees the credential.** Architecture detail: `~/.claude/tel/README.md`.

## Quick reference (run these from any session)

```bash
# Health + service inventory
~/.claude/tel/client/tel-call.sh --health
~/.claude/tel/client/tel-call.sh --list

# Dry-run (validates request shape, no execution)
~/.claude/tel/client/tel-call.sh --dry-run gamma create_presentation '{"title":"X","outline":["..."]}'

# Real execute
~/.claude/tel/client/tel-call.sh gamma create_presentation '{"title":"X","outline":["..."]}'

# Audit log inspect
~/.claude/tel/client/tel-call.sh --audit gamma

# Undo a reversible action within its window
~/.claude/tel/client/tel-call.sh --undo undo_<token>

# Reload policy YAMLs after editing one
~/.claude/tel/client/tel-call.sh --reload
```

## Currently wired services (6 total, 20 actions)

| Service | Actions | Credential path in 1Password |
|---|---|---|
| `gamma` | create_presentation, get_presentation, list_presentations | op://Personal/Gamma/credential |
| `github` | list_issues, get_pr, create_pr | op://Personal/GitHub/token |
| `gmail` | search_threads, get_message, list_labels | op://Personal/Gmail-OAuth/access_token |
| `vercel` | list_deployments, get_deployment, alias_deployment, list_projects | op://Personal/Vercel/token |
| `notion` | search, get_page, query_database, create_page | op://Personal/Notion/integration_token |
| `linear` | query, list_issues, create_issue | op://Personal/Linear/api_key |

Inspect live via `tel-call.sh --list` — that's the source of truth.

## When to use this skill (vs alternatives)

| Scenario | Pick |
|---|---|
| Service has working MCP, OAuth fresh | **MCP** (default — already integrated) |
| Service has no MCP but has REST/SDK | **TEL** |
| MCP exists but is down + credentials in 1Password | **TEL** (failover) |
| You want strict whitelisting + audit + undo on a credentialed service | **TEL** (even if MCP exists) |
| Read-only single-shot, no credentials needed | **Bash directly** |
| User asks to paste a credential into chat | **NEVER** — refuse; route to TEL or `claude mcp` UI |

See [wiki/decision-rules.md](file:///Users/leonardofibonacci/.claude/wiki/decision-rules.md) D13 for the full routing rule.

## Workflow (per [wiki/workflow-templates.md](file:///Users/leonardofibonacci/.claude/wiki/workflow-templates.md) W9)

1. Check policy exists: `ls ~/.claude/tel/policies/<service>.yaml`
2. If missing: write the policy YAML (see `~/.claude/tel/policies/README.md` schema), DON'T activate without user nod
3. Verify TEL is up: `tel-call.sh --health`
4. Dry-run first: `tel-call.sh --dry-run <service> <action> '<args>'`
5. Execute: `tel-call.sh <service> <action> '<args>'`
6. Capture audit_id from response for traceability
7. If response includes undo_token AND user wants to reverse: `tel-call.sh --undo <token>` within window
8. If response was 401: TEL auto-invalidates the broker cache; user re-auths and retries

## When TEL daemon is down

The daily MCP probe (and SessionStart `tel-health.sh` hook) surface this. Recovery:
```bash
launchctl kickstart -k gui/$(id -u)/bio.tel
# or if not yet installed: see ~/.claude/tel/ops/INSTALL.md
```

If TEL is structurally unreachable for the duration of the task, **stage the work as READY-TO-RUN**: produce the exact tel-call.sh invocation user can run when daemon returns, log the staged item to `wiki/logs/anti-patterns.md` if this happens repeatedly.

## Adding a new service (3 steps, ~5 min)

1. Write `~/.claude/tel/policies/<service>.yaml` per the schema in `policies/README.md`
2. Store credential in 1Password at the YAML's `auth_op_path`
3. `tel-call.sh --reload` to pick up the new policy
4. Verify: `tel-call.sh --list | jq '.services[].service'` — your service should appear

## Hard rules

- NEVER ask the user to paste a credential into chat
- NEVER bypass the harness by asking for OAuth flows in transcript
- ALWAYS dry-run new actions before live execute
- ALWAYS capture audit_id from response (downstream tools may need it)
- If the policy YAML doesn't define an action you need, write the YAML extension first, get user nod, then execute

## Composes with

- `wiki/decision-rules.md` D13 — routing rule
- `wiki/workflow-templates.md` W9 — full 10-step recipe
- `tel-canary.sh` — daemon-less health check (runs daily in MCP probe)
- `tel-health.sh` SessionStart hook — surfaces 🔴 inline at session open
