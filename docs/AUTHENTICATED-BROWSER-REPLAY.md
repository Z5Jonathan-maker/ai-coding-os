# AUTHENTICATED-BROWSER-REPLAY.md

Authenticated browser replay is the contract for proving logged-in browser work
without storing credentials.

## Rule

Replay fixtures may describe workflow steps and assertions. They may not store:

- cookies
- bearer tokens
- passwords
- API keys
- localStorage/sessionStorage dumps
- authorization headers
- screenshots containing secrets

The user's real browser session remains the credential boundary. The fixture is
only the workflow recipe and proof expectation.

## Replay Shape

```text
fixture.json
  -> required browser mode
  -> credential boundary
  -> target origin allowlist
  -> steps
  -> assertions
  -> redaction rules
  -> proof packet requirements
```

## Execution Policy

- `official-extension` fixtures require Kimi WebBridge connected to the user's
  normal Chrome session.
- `shim` fixtures may prove public smoke flows only.
- CI validates fixture safety with `cc-browser-replay-check`.
- Prepared machines validate live replay readiness with
  `cc-browser-replay-live-check`; public machines skip cleanly when WebBridge is
  not connected.
- Live authenticated replay is local-only and must never write secrets to repo.

## Status

This repository ships the safe replay contract, verifier, and prepared-machine
live readiness gate. The live gate uses a credential-free nonce page to prove the
official WebBridge path without reading cookies, local storage, session storage,
authorization headers, or screenshots containing secrets. Real authenticated
target replays still depend on the user's approved browser session and should be
run only on the maintainer machine or an explicitly prepared evaluator machine.
