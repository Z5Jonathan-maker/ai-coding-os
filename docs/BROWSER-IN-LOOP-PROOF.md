# Browser-In-Loop Proof

`codex_proof` can now verify the app through the browser before deploy.

Use:

```sh
cc-design-handoff execute \
  --dir .ai/design-handoffs/<mission> \
  --phase codex_proof \
  --browser-url http://localhost:3000
```

The phase writes:

- `browser.proof.1.json`
- `codex.proof.json`

If the browser bridge is unhealthy or the URL cannot produce proof, the Codex
proof verdict becomes `blocked_failed_local_proof`, and `tel_deploy` stays
blocked.

This is intentionally URL-driven. The implementation lane can also put URLs in
`implementation.result.json` under `browser_proof`, and `codex_proof` will
verify those automatically.
