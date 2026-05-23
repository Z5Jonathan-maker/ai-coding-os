# PROVIDER-ACCOUNTS.md

This product routes across local tools and user-owned AI accounts. It does not
resell model access.

## Core Accounts

| Lane | Expected account/tool | Role | Required for |
|---|---|---|---|
| Codex | Codex / ChatGPT plan or configured Codex CLI | code edits, local engineering, verification | code lane |
| Claude | Claude subscription via Claude CLI OAuth | architecture, hard debugging, security/final review | precision lane |
| Kimi | Kimi Desktop + Kimi CLI + WebBridge extension | UI/browser/operator lane | design/browser lane |
| DeepSeek | DeepSeek API key | cheap extraction, transforms, bulk work | cheap lane |
| ChatGPT image | ChatGPT/Image 2.0 access | creative direction, canonical image assets | image lane |
| TEL/1Password | local credential vault | audited credentialed actions | credentialed workflows |

## What The First-Run Doctor Checks

`cc-first-run` checks installed tools and local app presence. It intentionally
does not inspect secret values or print API keys.

Use:

```sh
cc-provider-capacity
```

to verify live provider capacity after accounts are configured.

Expected full-capacity state:

```text
ready=4/4 status=full-capacity
```

## Billing Boundary

Provider costs belong to the user's accounts. The router optimizes routing and
tracks visible economics through `cc-token-ledger`, but it does not guarantee a
provider's quota, subscription reset time, or API billing policy.

## Degraded Operation

If one lane is exhausted, Auto mode should continue through the fallback chain.
Precision work degrades most visibly when Claude quota is unavailable; browser
and UI work degrades when Kimi/WebBridge is unavailable.
