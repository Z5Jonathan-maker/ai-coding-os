# Policy schema

Each `<service>.yaml` describes the actions TEL is allowed to perform on the user's behalf for that service. Adding a service is **the only way** Claude gets new powers — no whitelist entry, no execution.

## Schema

```yaml
service: <short name>           # required, used as the routing key
base_url: <https://...>         # required, prepended to action endpoints
notes: |                        # optional, free-text human note
  <multiline>

actions:
  <action_name>:                # snake_case key
    description: <one line>
    method: GET|POST|PUT|PATCH|DELETE
    endpoint: <path with {placeholders}>
    required_args: [arg1, arg2]
    optional_args: [arg3]
    reversible: true|false      # whether this action issues an undo_token
    undo_window_seconds: 0      # how long the undo_token is valid (if reversible)
    rate_limit_per_hour: 100    # per-action rate cap
    auth_keychain_service: cc.service.token   # preferred Keychain service
    auth_op_path: op://...      # optional 1Password fallback
    auth_header: Authorization  # HTTP header name
    auth_prefix: Bearer         # prefix before the token (or "" for none)
```

## Adding a new service

1. Seed the credential into Keychain under the `auth_keychain_service` name you choose
2. Optionally keep a matching `auth_op_path` if you still want a 1Password fallback
3. Write `policies/<service>.yaml` following the schema
4. `curl -X POST http://127.0.0.1:8765/reload` to hot-reload the registry (or restart the launchd agent)
5. Verify with `curl http://127.0.0.1:8765/registry` — your new service should appear
6. Test with a `dry_run: true` request before letting Claude execute live

## Reversibility guidance

- **reversible: true** + non-zero `undo_window_seconds` → TEL issues an undo_token in the response. Good for: drafts, scheduled posts, presentations created (delete inverse), PRs opened (close inverse)
- **reversible: false** → no undo token. Default for: GET requests, anything irreversible (sent emails, deleted records, money movement)

## Rate limit guidance

- Read-heavy GET endpoints: 200-500/hour
- Light write/create endpoints: 30-100/hour
- Expensive or third-party-billed endpoints: 5-20/hour
- Tune up after observing real usage in audit logs
